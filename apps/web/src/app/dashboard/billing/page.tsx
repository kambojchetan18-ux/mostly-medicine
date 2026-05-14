import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { publishableKeyMode, stripeMode } from "@/lib/stripe";
import BillingClient, { type CurrentSubscription } from "./BillingClient";

export const metadata = { title: "Billing & Plans — Mostly Medicine" };

interface PageProps {
  searchParams: Promise<{
    success?: string;
    canceled?: string;
    from?: string;     // 'mock' = redirected here after a free Mock Exam preview
    session?: string;  // mcq_sessions.id of the just-finished sample
  }>;
}

export default async function BillingPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("plan, role, stripe_customer_id, stripe_subscription_id, subscription_status, subscription_period_end, subscription_cancel_at_period_end, founder_rank, pro_until")
    .eq("id", user.id)
    .single();

  // If we arrived from a free Mock Exam preview, fetch the session's score so
  // the upgrade pitch can lead with the user's own performance number rather
  // than a generic call to action.
  let mockResult: {
    sessionId: string;
    correctCount: number;
    questionsAnswered: number;
    scorePct: number;
  } | null = null;
  if (params.from === "mock" && params.session) {
    const { data: s } = await supabase
      .from("mcq_sessions")
      .select("id, correct_count, questions_answered, score_pct")
      .eq("id", params.session)
      .eq("user_id", user.id)
      .maybeSingle();
    if (s) {
      mockResult = {
        sessionId: s.id as string,
        correctCount: (s.correct_count as number) ?? 0,
        questionsAnswered: (s.questions_answered as number) ?? 0,
        scorePct: (s.score_pct as number) ?? 0,
      };
    }
  }

  const sub: CurrentSubscription = {
    plan: (profile?.plan as CurrentSubscription["plan"]) ?? "free",
    isAdmin: profile?.role === "admin",
    hasCustomerId: Boolean(profile?.stripe_customer_id),
    status: profile?.subscription_status ?? null,
    periodEnd: profile?.subscription_period_end ?? null,
    cancelAtPeriodEnd: Boolean(profile?.subscription_cancel_at_period_end),
    founderRank: profile?.founder_rank ?? null,
    proUntil: profile?.pro_until ?? null,
  };

  // Price IDs are public (they show up in checkout URLs anyway). Pass them
  // through for the client buttons.
  const prices = {
    proMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY ?? null,
    proYearly: process.env.STRIPE_PRICE_PRO_YEARLY ?? null,
    enterpriseMonthly: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY ?? null,
    enterpriseYearly: process.env.STRIPE_PRICE_ENTERPRISE_YEARLY ?? null,
  };

  // Detect Stripe mode from the publishable key prefix on the server, so we
  // can render a TEST-mode banner before any real money flows. Prefer the
  // publishable key (it's the one wired into the SDK that does the charging),
  // fall back to the secret key prefix.
  const mode: "test" | "live" | null = publishableKeyMode() ?? stripeMode();

  return (
    <BillingClient
      subscription={sub}
      prices={prices}
      mode={mode}
      flash={params.success ? "success" : params.canceled ? "canceled" : null}
      mockResult={mockResult}
    />
  );
}
