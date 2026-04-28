// Billing helpers — get/create Stripe customer, sync subscription state.
// Server-only.
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { stripe, planForPriceId } from "./stripe";

function service() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

// Fetch the user's existing Stripe customer or create one + persist the id.
export async function getOrCreateStripeCustomer(userId: string, email: string): Promise<string> {
  const sb = service();
  const { data: profile } = await sb
    .from("user_profiles")
    .select("stripe_customer_id, full_name")
    .eq("id", userId)
    .single();

  if (profile?.stripe_customer_id) return profile.stripe_customer_id;

  const customer = await stripe().customers.create({
    email,
    name: profile?.full_name ?? undefined,
    metadata: { user_id: userId },
  });

  await sb
    .from("user_profiles")
    .update({ stripe_customer_id: customer.id })
    .eq("id", userId);

  return customer.id;
}

// Update user_profiles to reflect a Stripe subscription's current state.
// Called from the webhook on checkout.session.completed and
// customer.subscription.{created,updated,deleted}.
interface SyncInput {
  customerId: string;
  subscriptionId: string | null;
  priceId: string | null;
  status: string | null;
  periodEnd: number | null; // unix seconds
  cancelAtPeriodEnd?: boolean;
}

export async function syncSubscriptionToProfile(input: SyncInput): Promise<void> {
  const sb = service();

  // Active-ish statuses keep the plan; everything else falls back to free.
  // past_due is included so users in their Stripe grace window keep access.
  const activeStatuses = new Set(["active", "trialing", "past_due"]);
  const isActive = !!input.status && activeStatuses.has(input.status);

  // Resolve the new plan. If we have a priceId, that's authoritative. If
  // we don't (invoice.payment_failed payload sometimes can't supply it),
  // fall back to the user's existing plan so we don't demote them inside
  // the Stripe grace window.
  let plan: "free" | "pro" | "enterprise";
  if (input.priceId) {
    plan = planForPriceId(input.priceId);
  } else if (isActive) {
    const { data: existing } = await sb
      .from("user_profiles")
      .select("plan")
      .eq("stripe_customer_id", input.customerId)
      .maybeSingle();
    plan = (existing?.plan as "free" | "pro" | "enterprise" | undefined) ?? "free";
  } else {
    plan = "free";
  }

  const effectivePlan = isActive ? plan : "free";

  const updates: Record<string, unknown> = {
    stripe_subscription_id: input.subscriptionId,
    subscription_status: input.status,
    subscription_period_end: input.periodEnd
      ? new Date(input.periodEnd * 1000).toISOString()
      : null,
    plan: effectivePlan,
    updated_at: new Date().toISOString(),
  };
  // Only touch cancel_at_period_end when the caller knew it (subscription
  // events). Skipping it for invoice-only events avoids stomping a true
  // value with a default false.
  if (input.cancelAtPeriodEnd !== undefined) {
    updates.subscription_cancel_at_period_end = input.cancelAtPeriodEnd;
  }

  await sb
    .from("user_profiles")
    .update(updates)
    .eq("stripe_customer_id", input.customerId);
}
