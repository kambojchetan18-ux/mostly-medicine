import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, assertStripeConfig } from "@/lib/stripe";

// Returns a Stripe Customer Portal URL so the user can update payment method,
// switch plans, or cancel without us building UI for any of that.
export async function POST(req: NextRequest) {
  try {
    assertStripeConfig();
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Stripe misconfigured";
    console.error("[billing/portal] config", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (!profile?.stripe_customer_id) {
    return NextResponse.json({ error: "No subscription on file" }, { status: 404 });
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mostlymedicine.com";
  try {
    const session = await stripe().billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${origin}/dashboard/billing`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    // Most common live-mode failure: Stripe Customer Portal hasn't been
    // configured at https://dashboard.stripe.com/settings/billing/portal.
    // Surface a clean message instead of letting Next.js return an empty
    // 500 that crashes the client's res.json().
    const msg = err instanceof Error ? err.message : "Portal session failed";
    console.error("[billing/portal] stripe", msg);
    return NextResponse.json(
      { error: `Stripe portal not available: ${msg}. If this is a fresh live-mode account, activate the portal at https://dashboard.stripe.com/settings/billing/portal.` },
      { status: 502 }
    );
  }
}
