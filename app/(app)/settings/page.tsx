import AccountManager from "@/components/settings/account-manager";
import { getUserPlanLimits } from "@/lib/features";
import { sanityFetch } from "@/sanity/lib/live";
import { USER_CONNECTED_ACCOUNTS_DISPLAY_QUERY } from "@/sanity/queries/users";
import { auth } from "@clerk/nextjs/server";
import { ArrowBigRight, CreditCard } from "lucide-react";
import Link from "next/link";

async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { userId } = await auth();

  // user's plan limits
  const [{ data: user }, planLimits] = await Promise.all([
    sanityFetch({
      query: USER_CONNECTED_ACCOUNTS_DISPLAY_QUERY,
      params: { clerkId: userId },
    }),
    getUserPlanLimits(),
  ]);

  const connectedAccounts = user?.connectedAccounts ?? [];
  const params = await searchParams;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Manage connected accounts and preferences
        </p>
      </div>
      {params.success && (
        <div className="mb-6 rounded-md bg-green-50 border border-green-300 p-4 text-green-800">
          {params.success === "account_connected" &&
            "Google account connected succesfully!"}
          {params.success === "account_updated" &&
            "Google account tokens refreshed."}
        </div>
      )}

      {params.error && (
        <div className="mb-6 rounded-md bg-red-50 border border-red-200 p-4 text-red-800">
          {params.error === "oauth_denied" &&
            "Google account connection was denied."}
          {params.error === "oauth_failed" &&
            "Failed to connect to Google account. Please try again!"}
          {params.error === "state_expired" &&
            "Connection expired. Please try again."}
          {params.error === "state_mismatch" &&
            "Security validation failed. Please try again."}
          {params.error === "invalid_state" &&
            "Invalid security token. Please try again."}
        </div>
      )}
      <AccountManager
        connectedAccounts={connectedAccounts}
        maxCalendars={planLimits.maxConnectedCalendars}
        plan={planLimits.plan}
      />

      {/* Billing */}
      <div className="mt-8 pt-8 border-t">
        <h2 className="text-lg font-semibold mb-4">Billing</h2>
        <Link
          href="/pricing"
          className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
              <CreditCard className="size-6 text-blue-500" />
            </div>
            <div>
              <p className="font-medium">Manage Subscription</p>
              <p className="text-sm text-muted-foreground">
                View Plans and Billing Details
              </p>
            </div>
          </div>
          <span className="text-muted-foreground">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}

export default SettingsPage;
