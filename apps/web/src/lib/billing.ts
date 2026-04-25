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
}

export async function syncSubscriptionToProfile(input: SyncInput): Promise<void> {
  const sb = service();
  const plan = input.priceId ? planForPriceId(input.priceId) : "free";

  // Active-ish statuses keep the plan; everything else falls back to free.
  const activeStatuses = new Set(["active", "trialing", "past_due"]);
  const effectivePlan =
    input.status && activeStatuses.has(input.status) ? plan : "free";

  await sb
    .from("user_profiles")
    .update({
      stripe_subscription_id: input.subscriptionId,
      subscription_status: input.status,
      subscription_period_end: input.periodEnd
        ? new Date(input.periodEnd * 1000).toISOString()
        : null,
      plan: effectivePlan,
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_customer_id", input.customerId);
}
