#!/usr/bin/env npx ts-node
/**
 * One-shot: re-fetch every subscription from Stripe and write the latest
 * status into user_profiles. Useful when webhook deliveries failed and the
 * DB drifted from Stripe's truth.
 *
 *   STRIPE_SECRET_KEY=sk_test_... \
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
 *     npx ts-node --project scripts/tsconfig.json --transpile-only \
 *     scripts/stripe-resync-subscription.ts
 */
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const SECRET = process.env.STRIPE_SECRET_KEY;
const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SECRET || !SB_URL || !SB_KEY) {
  console.error("Missing env: STRIPE_SECRET_KEY / NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const stripe = new Stripe(SECRET, { apiVersion: "2024-09-30.acacia" } as unknown as Stripe.StripeConfig);
const supabase = createClient(SB_URL, SB_KEY, { auth: { persistSession: false, autoRefreshToken: false } });

const PRO_PRICES = new Set(
  [process.env.STRIPE_PRICE_PRO_MONTHLY, process.env.STRIPE_PRICE_PRO_YEARLY].filter(Boolean)
);
const ENTERPRISE_PRICES = new Set(
  [
    process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY,
    process.env.STRIPE_PRICE_ENTERPRISE_YEARLY,
  ].filter(Boolean)
);

function planFor(priceId: string | null): "free" | "pro" | "enterprise" {
  if (!priceId) return "free";
  if (ENTERPRISE_PRICES.has(priceId)) return "enterprise";
  if (PRO_PRICES.has(priceId)) return "pro";
  return "free";
}

const ACTIVE = new Set(["active", "trialing", "past_due"]);

async function main() {
  const { data: profiles } = await supabase
    .from("user_profiles")
    .select("id, email, stripe_customer_id, plan")
    .not("stripe_customer_id", "is", null);
  if (!profiles?.length) {
    console.log("No customers to resync");
    return;
  }

  for (const p of profiles) {
    const subs = await stripe.subscriptions.list({
      customer: p.stripe_customer_id!,
      status: "all",
      limit: 10,
    });
    const live = subs.data.find((s) => ACTIVE.has(s.status)) ?? subs.data[0];
    if (!live) {
      console.log(`[skip] ${p.email} — no subscriptions`);
      continue;
    }

    const priceId = live.items.data[0]?.price.id ?? null;
    const plan = ACTIVE.has(live.status) ? planFor(priceId) : "free";
    const periodEnd = (live as unknown as { current_period_end?: number }).current_period_end;

    await supabase
      .from("user_profiles")
      .update({
        stripe_subscription_id: live.id,
        subscription_status: live.status,
        subscription_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
        plan,
        updated_at: new Date().toISOString(),
      })
      .eq("id", p.id);

    console.log(`✓ ${p.email} → status=${live.status} plan=${plan}`);
  }
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
