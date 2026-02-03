import { auth } from "@clerk/nextjs/server";

export type PlanType = "free" | "starter" | "pro";

export const PLAN_LIMITS = {
  free: {
    maxConnectedCalendars: 1,
    maxBookingsPerMonth: 2,
  },
  starter: {
    maxConnectedCalendars: 3,
    maxBookingsPerMonth: 10,
  },
  pro: {
    maxConnectedCalendars: Infinity,
    maxBookingsPerMonth: Infinity,
  },
};

export async function getUserPlan(): Promise<PlanType> {
  const { has } = await auth();

  if (has({ plan: "pro" })) return "pro";
  if (has({ plan: "starter" })) return "starter";
  return "free";
}

export async function getUserPlanLimits() {
  const plan = await getUserPlan();
  return { ...PLAN_LIMITS[plan], plan };
}
