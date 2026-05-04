import { NextRequest, NextResponse } from "next/server";
import { createClinicalRoleplay } from "@mostly-medicine/ai";
import { createClient } from "@/lib/supabase/server";
import { createClient as createBrowserClient } from "@supabase/supabase-js";
import { aiRateLimit, clientKey } from "@/lib/rate-limit";
import { enforceDailyLimit } from "@/lib/permissions";

interface RoleplayMessage {
  role?: string;
  content?: string;
}

export async function POST(req: NextRequest) {
  let user = null;
  // Hold the supabase client we authenticated with so the daily-limit
  // helper can read user_profiles + cat2_sessions through the same session.
  type SupabaseLike = ReturnType<typeof createBrowserClient>;
  let supabase: SupabaseLike | null = null;

  // Check Bearer token (mobile) first, fall back to cookie session (web)
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data } = await supabase.auth.getUser(token);
    user = data.user;
  } else {
    const cookieClient = await createClient();
    supabase = cookieClient as unknown as SupabaseLike;
    const { data } = await cookieClient.auth.getUser();
    user = data.user;
  }

  if (!user || !supabase) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Per-user throttle. Mobile clients hit this directly without going
  // through the daily-counter routes, so cap raw turn rate at 30/min.
  const rl = await aiRateLimit(clientKey(req, "ai-roleplay", user.id), { max: 30, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.retryAfterMs ?? 60_000) / 1000)) } }
    );
  }

  try {
    const { scenarioId, messages, requestFeedback } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "AI service not configured. Please add ANTHROPIC_API_KEY." },
        { status: 503 }
      );
    }

    // Plan + daily-limit enforcement. The cat2 conversation is stateless
    // turn-by-turn, so we treat the user's FIRST user-turn for a scenario
    // as the session-start event. Cat2Client pre-seeds the messages array
    // with an `assistant`-role opening line BEFORE the user types, so the
    // first user turn lives at index 1 (length 2), not index 0 (length 1).
    // Counting role==='user' messages avoids that off-by-one and also
    // works if a future client variant skips the opener.
    const msgs = (messages ?? []) as RoleplayMessage[];
    const userTurnCount = msgs.filter((m) => m?.role === "user").length;
    const isFirstTurn = userTurnCount === 1;

    if (isFirstTurn && !requestFeedback) {
      const limit = await enforceDailyLimit(supabase, "roleplay");
      if (!limit.allowed) {
        if (limit.dailyLimit != null && limit.used >= limit.dailyLimit) {
          return NextResponse.json(
            {
              error: "daily_limit_reached",
              plan: limit.plan,
              dailyLimit: limit.dailyLimit,
              used: limit.used,
            },
            { status: 429 }
          );
        }
        return NextResponse.json(
          { error: "Your plan does not include AMC Handbook AI RolePlay. Upgrade to continue." },
          { status: 403 }
        );
      }

      // Record this scenario start. Service-role insert so RLS can stay
      // strict (users only SELECT their own rows; no client write path).
      const service = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      await service.from("cat2_sessions").insert({
        user_id: user.id,
        scenario_id: scenarioId ?? null,
      });
    }

    const reply = await createClinicalRoleplay({ scenarioId, messages, requestFeedback });
    return NextResponse.json({ reply });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[roleplay API error]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
