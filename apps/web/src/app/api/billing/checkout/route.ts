import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, priceCatalog } from "@/lib/stripe";
import { getOrCreateStripeCustomer } from "@/lib/billing";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { priceId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  if (!body.priceId) return NextResponse.json({ error: "priceId required" }, { status: 400 });

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
    const origin = req.headers.get("origin") ?? new URL(req.url).origin;
    const portal = await stripe().billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/dashboard/billing`,
    });
    return NextResponse.json({ url: portal.url, alreadySubscribed: true });
  }

  const origin = req.headers.get("origin") ?? new URL(req.url).origin;
  const session = await stripe().checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: body.priceId, quantity: 1 }],
    allow_promotion_codes: true,
    success_url: `${origin}/dashboard/billing?success=1`,
    cancel_url: `${origin}/dashboard/billing?canceled=1`,
    subscription_data: { metadata: { user_id: user.id } },
  });

  return NextResponse.json({ url: session.url });
}
