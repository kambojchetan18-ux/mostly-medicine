import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, priceCatalog, assertStripeConfig } from "@/lib/stripe";
import { getOrCreateStripeCustomer } from "@/lib/billing";

const ALLOWED_ORIGINS = [
  "https://mostlymedicine.com",
  "https://www.mostlymedicine.com",
  "http://localhost:3000",
];
function safeOrigin(req: NextRequest): string {
  const raw = req.headers.get("origin") ?? new URL(req.url).origin;
  return ALLOWED_ORIGINS.includes(raw) ? raw : "https://mostlymedicine.com";
}

export async function POST(req: NextRequest) {
  try {
    assertStripeConfig();
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Stripe misconfigured";
    console.error("[billing/checkout] config", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { priceId?: string; next?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  if (!body.priceId) return NextResponse.json({ error: "priceId required" }, { status: 400 });

  // Whitelist `next` to internal /dashboard paths only — guards against
  // open-redirect via Stripe success_url. Anything that doesn't match the
  // whitelist falls back to /dashboard/billing.
  const safeNext = typeof body.next === "string" && /^\/dashboard\/[a-z0-9/_-]*$/i.test(body.next)
    ? body.next
    : null;

  // Validate priceId is one we recognise — prevents tampering with the body.
  if (!priceCatalog().some((p) => p.id === body.priceId)) {
    return NextResponse.json({ error: "Unknown price" }, { status: 400 });
  }

  const customerId = await getOrCreateStripeCustomer(user.id, user.email);

  // If user already has a non-cancelled subscription on this customer, send
  // them to the Billing Portal instead of creating a duplicate checkout.
  const existing = await stripe().subscriptions.list({
    customer: customerId,
    status: "all",
    limit: 10,
  });
  const activeSub = existing.data.find((s) =>
    ["active", "trialing", "past_due", "incomplete"].includes(s.status)
  );
  if (activeSub) {
    const origin = safeOrigin(req);
    try {
      const portal = await stripe().billingPortal.sessions.create({
        customer: customerId,
        return_url: `${origin}/dashboard/billing`,
      });
      return NextResponse.json({ url: portal.url, alreadySubscribed: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Portal session failed";
      console.error("[billing/checkout] portal-redirect", msg);
      return NextResponse.json(
        { error: `You already have an active subscription. To manage it, activate the Stripe portal at https://dashboard.stripe.com/settings/billing/portal (one-time setup).` },
        { status: 502 }
      );
    }
  }

  const origin = safeOrigin(req);
  try {
    const session = await stripe().checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: body.priceId, quantity: 1 }],
      allow_promotion_codes: true,
      // Land the user back on the page they were upgrading from, when
      // provided. Falls back to the billing page so the success flash still
      // renders. Stripe runs success_url after the subscription is active.
      success_url: safeNext
        ? `${origin}${safeNext}?upgraded=1`
        : `${origin}/dashboard/billing?success=1`,
      cancel_url: safeNext
        ? `${origin}${safeNext}?upgrade_canceled=1`
        : `${origin}/dashboard/billing?canceled=1`,
      subscription_data: { metadata: { user_id: user.id } },
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    // Surface a clean error instead of letting Next.js return an empty 500
    // that crashes the client's res.json() with "Unexpected end of JSON
    // input" — the diagnostic chain we hit on 2026-05-01 + 2026-05-02.
    const msg = err instanceof Error ? err.message : "Checkout session failed";
    console.error("[billing/checkout] session-create", msg, "priceId=", body.priceId);
    return NextResponse.json(
      { error: `Stripe checkout failed: ${msg}` },
      { status: 502 }
    );
  }
}
