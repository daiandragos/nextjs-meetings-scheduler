import { google } from "googleapis";
import { writeClient } from "@/sanity/lib/writeClient";
import { client } from "@/sanity/lib/client";
import {
  USER_ID_BY_ACCOUNT_KEY_QUERY,
  type ConnectedAccountWithTokens,
} from "@/sanity/queries/users";

// OAuth2 client config
export function createAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  );
}

// generate OAuth URL to connect a Google account
export function getGoogleAuthUrl(state: string) {
  const oauth2Client = createAuth2Client();

  const scopes = [
    "https://www.googleapis.com/auth/calendar.readonly",
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ];

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "select_account consent",
    state,
  });
}

// exchange auth code for tokens
export async function exchangeCodeForTokens(code: string) {
  const oauth2Client = createAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

// get user info
export async function getGoogleUserInfo(accesToken: string) {
  const oauth2Client = createAuth2Client();
  oauth2Client.setCredentials({ access_token: accesToken });

  const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
  const { data } = await oauth2.userinfo.get();

  if (!data.id || !data.email) {
    throw new Error("Failed to get user info from Google");
  }

  return {
    id: data.id,
    email: data.email,
    name: data.name,
  };
}

// get calendar client for given connectec account
export async function getCalendarClient(account: ConnectedAccountWithTokens) {
  const oauth2Client = createAuth2Client();
  oauth2Client.setCredentials({
    access_token: account.accessToken,
    refresh_token: account.refreshToken,
    expiry_date: account.expiryDate,
  });

  if (account.expiryDate && Date.now() >= account.expiryDate - 60000) {
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      if (!credentials.access_token || !credentials.expiry_date) {
        throw new Error("Invalid credentials received from refresh");
      }

      await updateAccountTokens(account._key, {
        accessToken: credentials.access_token,
        expiryDate: credentials.expiry_date,
      });

      oauth2Client.setCredentials(credentials);
    } catch (error) {
      console.error("Failed to refresh token", error);
      throw new Error("Token refresh failed. Please reconnect your account.");
    }
  }
  return google.calendar({ version: "v3", auth: oauth2Client });
}

// update account tokens in Sanity
async function updateAccountTokens(
  accountKey: string,
  tokens: { accessToken: string; expiryDate: number },
) {
  const user = await client.fetch(USER_ID_BY_ACCOUNT_KEY_QUERY, { accountKey });

  if (user) {
    await writeClient
      .patch(user._id)
      .set({
        [`connectedAccounts[_key=="${accountKey}"].accessToken`]:
          tokens.accessToken,
        [`connectedAccounts[_key=="${accountKey}"].expiryDate`]:
          tokens.expiryDate,
      })
      .commit();
  }
}

export type GoogleCalendarEvent = {
  start: Date;
  end: Date;
  title: string;
  accountEmail: string;
};

export async function fetchCalendarEvents(
  accounts: ConnectedAccountWithTokens[],
  startDate: Date,
  endDate: Date,
): Promise<GoogleCalendarEvent[]> {
  const events: GoogleCalendarEvent[] = [];

  for (const account of accounts) {
    if (!account.accessToken || !account.refreshToken) continue;

    try {
      const calendar = await getCalendarClient(account);
      const { data } = await calendar.events.list({
        calendarId: "primary",
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        singleEvents: true,
        orderBy: "startTime",
      });

      for (const event of data.items ?? []) {
        // skip all day events
        if (!event.start?.dateTime || !event.end?.dateTime) continue;
        events.push({
          start: new Date(event.start.dateTime),
          end: new Date(event.end.dateTime),
          title: event.summary ?? "Busy",
          accountEmail: account.email,
        });
      }
    } catch (error) {
      console.error(`Failed to fetch events for ${account.email}`, error);
    }
  }

  return events;
}

// revoke google OAuth token
export async function revokeGoogleToken(accessToken: string) {
  try {
    await fetch(`https://oauth2.googleapis.com/revoke?token=${accessToken}`, {
      method: "POST",
    });
  } catch (error) {
    console.error("Failed to revoke token: ", error);
  }
}

export type AttendeeStatus =
  | "accepted"
  | "declined"
  | "tentative"
  | "needsAction"
  | "unknown";

export async function getEventAttendeesStatus(
  account: ConnectedAccountWithTokens,
  eventId: string,
  guestEmail: string,
): Promise<AttendeeStatus> {
  try {
    const calendar = await getCalendarClient(account);
    const response = await calendar.events.get({
      calendarId: "primary",
      eventId,
    });
    const attendee = response.data.attendees?.find(
      (a) => a.email?.toLowerCase() === guestEmail.toLowerCase(),
    );
    if (!attendee?.responseStatus) return "unknown";
    return attendee.responseStatus as AttendeeStatus;
  } catch (error) {
    console.error("Failed to get event attendee status:", error);
    return "unknown";
  }
}

// get guest attendee status from calendar event
export async function getEventAttendeesStatuses(
  account: ConnectedAccountWithTokens,
  eventId: string,
  _hostEmail: string,
  guestEmail: string,
): Promise<{ hostStatus: AttendeeStatus; guestStatus: AttendeeStatus }> {
  try {
    const calendar = await getCalendarClient(account);
    const response = await calendar.events.get({
      calendarId: "primary",
      eventId,
    });

    if (response.data.status === "cancelled") {
      return { hostStatus: "declined", guestStatus: "declined" };
    }

    const guestAttendee = response.data.attendees?.find(
      (a) => a.email?.toLowerCase() === guestEmail.toLowerCase(),
    );
    return {
      hostStatus: "accepted",
      guestStatus:
        (guestAttendee?.responseStatus as AttendeeStatus) || "needsAction",
    };
  } catch (error: unknown) {
    const gaxiosError = error as {
      code?: number;
      response?: { status?: number };
    };
    const errorCode = gaxiosError.code ?? gaxiosError.response?.status;
    if (errorCode === 404 || errorCode === 410) {
      return { hostStatus: "declined", guestStatus: "declined" };
    }
    console.error("Failed to get event attendee statuses:", error);

    return { hostStatus: "accepted", guestStatus: "unknown" };
  }
}
