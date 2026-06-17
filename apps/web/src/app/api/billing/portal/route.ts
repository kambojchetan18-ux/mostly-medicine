import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, assertStripeConfig } from "@/lib/stripe";
import { features } from "@/config/features";

// Returns a Stripe Customer Portal URL so the user can update payment method,
// switch plans, or cancel without us building UI for any of that.
export async function POST(req: NextRequest) {
  if (!features.paidTiersEnabled) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  try {
    assertStripeConfig();
  } catch (err) {
    console.error("[billing/portal] config", err);
    return NextResponse.json({ error: "Billing service temporarily unavailable" }, { status: 500 });
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

  const origin = req.headers.get("origin") ?? new URL(req.url).origin;
  try {
    const session = await stripe().billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${origin}/dashboard/billing`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[billing/portal] stripe", err);
    return NextResponse.json(
      { error: "Billing service temporarily unavailable" },
      { status: 500 }
    );
  }
}
