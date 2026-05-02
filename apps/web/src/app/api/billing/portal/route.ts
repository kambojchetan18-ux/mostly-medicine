import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, assertStripeConfig } from "@/lib/stripe";

const ALLOWED_ORIGINS = [
  "https://www.mostlymedicine.com",
  "https://mostlymedicine.com",
];

function safeOrigin(req: NextRequest): string {
  const origin = req.headers.get("origin");
  if (origin && ALLOWED_ORIGINS.includes(origin)) return origin;
  return new URL(req.url).origin;
}

// Returns a Stripe Customer Portal URL so the user can update payment method,
// switch plans, or cancel without us building UI for any of that.
export async function POST(req: NextRequest) {
  try {
    assertStripeConfig();
  } catch (err) {
    console.error("[billing/portal] config", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Billing service unavailable" }, { status: 500 });
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

  const origin = safeOrigin(req);
  try {
    const session = await stripe().billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${origin}/dashboard/billing`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[billing/portal] stripe", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Billing portal unavailable. Please try again later." },
      { status: 502 }
    );
  }
}
