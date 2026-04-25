import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { syncSubscriptionToProfile } from "@/lib/billing";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import type Stripe from "stripe";

// Stripe webhook receiver — keeps user_profiles in sync with subscription
// state. Idempotent via billing_events table; replays of the same event id
// short-circuit. Configure the endpoint in Stripe dashboard:
//   URL:  https://mostlymedicine.com/api/billing/webhook
//   Events: checkout.session.completed,
//           customer.subscription.created,
//           customer.subscription.updated,
//           customer.subscription.deleted,
//           invoice.payment_failed
//   Webhook signing secret -> STRIPE_WEBHOOK_SECRET env var.

export const dynamic = "force-dynamic";

function service() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    return NextResponse.json({ error: "Missing signature/secret" }, { status: 400 });
  }

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Bad signature";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  // Idempotency — store the event id and short-circuit on replay.
  const sb = service();
  const { data: existing } = await sb
    .from("billing_events")
    .select("id")
    .eq("id", event.id)
    .maybeSingle();
  if (existing) return NextResponse.json({ ok: true, replay: true });

  await sb.from("billing_events").insert({
    id: event.id,
    type: event.type,
    payload: event as unknown as Record<string, unknown>,
  });

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;
        const subId = s.subscription as string | null;
        if (subId) {
          const sub = (await stripe().subscriptions.retrieve(subId)) as unknown as Stripe.Subscription & {
            current_period_end: number;
          };
          await syncSubscriptionToProfile({
            customerId: sub.customer as string,
            subscriptionId: sub.id,
            priceId: sub.items.data[0]?.price.id ?? null,
            status: sub.status,
            periodEnd: sub.current_period_end,
          });
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription & { current_period_end: number };
        await syncSubscriptionToProfile({
          customerId: sub.customer as string,
          subscriptionId: sub.id,
          priceId: sub.items.data[0]?.price.id ?? null,
          status: event.type === "customer.subscription.deleted" ? "canceled" : sub.status,
          periodEnd: sub.current_period_end,
        });
        break;
      }
      case "invoice.payment_failed": {
        const inv = event.data.object as Stripe.Invoice & { subscription: string | null };
        if (inv.customer && typeof inv.customer === "string") {
          await syncSubscriptionToProfile({
            customerId: inv.customer,
            subscriptionId: inv.subscription ?? null,
            priceId: null,
            status: "past_due",
            periodEnd: null,
          });
        }
        break;
      }
      default:
        // Stored in billing_events for audit; no action.
        break;
    }
  } catch (err) {
    console.error("[billing/webhook]", event.type, err);
    // Return 500 so Stripe retries.
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
