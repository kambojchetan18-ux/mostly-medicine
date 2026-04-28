import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { stripe } from "@/lib/stripe";
import { syncSubscriptionToProfile } from "@/lib/billing";
import type Stripe from "stripe";

// Daily Stripe resync. If a webhook delivery is missed (Stripe outage,
// our 5xx, etc) plan state can drift from reality. This walks every
// user_profiles row that has a stripe_customer_id, fetches the latest
// subscription from Stripe, and re-runs syncSubscriptionToProfile.
//
// Triggered by Vercel Cron via vercel.json (see "crons" entry).
// Protected by CRON_SECRET — Vercel sets the Authorization header
// automatically when the env var is configured on the project.

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutes

function service() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sb = service();
  const { data: rows, error } = await sb
    .from("user_profiles")
    .select("stripe_customer_id, stripe_subscription_id, plan, subscription_status")
    .not("stripe_customer_id", "is", null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const total = rows?.length ?? 0;
  let synced = 0;
  let demoted = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const row of rows ?? []) {
    const customerId = row.stripe_customer_id as string;
    try {
      // Pull the most recent subscription for this customer. We don't trust
      // the stored subscription id alone — the user may have a newer one.
      const subs = await stripe().subscriptions.list({
        customer: customerId,
        status: "all",
        limit: 1,
      });
      const sub = subs.data[0] as
        | (Stripe.Subscription & { current_period_end: number; cancel_at_period_end: boolean })
        | undefined;

      if (!sub) {
        // Customer exists in Stripe but has no subscription — make sure
        // they're on free locally.
        if (row.plan !== "free") {
          await syncSubscriptionToProfile({
            customerId,
            subscriptionId: null,
            priceId: null,
            status: "canceled",
            periodEnd: null,
            cancelAtPeriodEnd: false,
          });
          demoted++;
        } else {
          skipped++;
        }
        continue;
      }

      await syncSubscriptionToProfile({
        customerId,
        subscriptionId: sub.id,
        priceId: sub.items.data[0]?.price.id ?? null,
        status: sub.status,
        periodEnd: sub.current_period_end,
        cancelAtPeriodEnd: sub.cancel_at_period_end ?? false,
      });
      synced++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "unknown";
      errors.push(`${customerId}: ${msg}`);
    }
  }

  return NextResponse.json({
    ok: true,
    total,
    synced,
    demoted,
    skipped,
    errorCount: errors.length,
    errors: errors.slice(0, 10),
  });
}
