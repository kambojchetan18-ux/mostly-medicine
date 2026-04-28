import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BillingClient, { type CurrentSubscription } from "./BillingClient";

export const metadata = { title: "Billing & Plans — Mostly Medicine" };

interface PageProps {
  searchParams: Promise<{ success?: string; canceled?: string }>;
}

export default async function BillingPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("plan, role, stripe_customer_id, stripe_subscription_id, subscription_status, subscription_period_end, subscription_cancel_at_period_end")
    .eq("id", user.id)
    .single();

  const sub: CurrentSubscription = {
    plan: (profile?.plan as CurrentSubscription["plan"]) ?? "free",
    isAdmin: profile?.role === "admin",
    hasCustomerId: Boolean(profile?.stripe_customer_id),
    status: profile?.subscription_status ?? null,
    periodEnd: profile?.subscription_period_end ?? null,
    cancelAtPeriodEnd: Boolean(profile?.subscription_cancel_at_period_end),
  };

  // Price IDs are public (they show up in checkout URLs anyway). Pass them
  // through for the client buttons.
  const prices = {
    proMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY ?? null,
    proYearly: process.env.STRIPE_PRICE_PRO_YEARLY ?? null,
    enterpriseMonthly: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY ?? null,
    enterpriseYearly: process.env.STRIPE_PRICE_ENTERPRISE_YEARLY ?? null,
  };

  return (
    <BillingClient
      subscription={sub}
      prices={prices}
      flash={params.success ? "success" : params.canceled ? "canceled" : null}
    />
  );
}
