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

  // Idempotency — atomically claim this event id. Two concurrent webhook
  // deliveries (Stripe retries) used to both pass a separate select check
  // and run the handler twice. Switching to an upsert with ignoreDuplicates
  // makes "first writer wins" a single round-trip; the loser sees no row
  // back and short-circuits.
  const sb = service();
  const { data: claimed } = await sb
    .from("billing_events")
    .upsert(
      {
        id: event.id,
        type: event.type,
        payload: event as unknown as Record<string, unknown>,
      },
      { onConflict: "id", ignoreDuplicates: true }
    )
    .select("id");

  if (!claimed || claimed.length === 0) {
    return NextResponse.json({ ok: true, replay: true });
  }

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
        // Stripe gives the user a grace window (3-4 retries over ~3 weeks)
        // before cancelling. We must NOT demote them to free instantly;
        // retrieve the full subscription so we keep their priceId+periodEnd
        // and only flip status to past_due. syncSubscriptionToProfile
        // treats past_due as active for plan retention.
        const inv = event.data.object as Stripe.Invoice & { subscription: string | null };
        if (inv.customer && typeof inv.customer === "string") {
          let priceId: string | null = null;
          let periodEnd: number | null = null;
          let status: string | null = "past_due";
          if (inv.subscription) {
            try {
              const sub = (await stripe().subscriptions.retrieve(inv.subscription)) as unknown as Stripe.Subscription & {
                current_period_end: number;
              };
              priceId = sub.items.data[0]?.price.id ?? null;
              periodEnd = sub.current_period_end ?? null;
              // Honour Stripe's status (past_due, unpaid, etc) over our default.
              status = sub.status ?? "past_due";
            } catch (err) {
              console.error("[billing/webhook] failed to retrieve subscription", err);
            }
          }
          await syncSubscriptionToProfile({
            customerId: inv.customer,
            subscriptionId: inv.subscription ?? null,
            priceId,
            status,
            periodEnd,
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
