import { NextRequest, NextResponse } from "next/server";
import { createClinicalRoleplay } from "@mostly-medicine/ai";
import { createClient } from "@/lib/supabase/server";
import { createClient as createBrowserClient } from "@supabase/supabase-js";
import { aiRateLimit, clientKey } from "@/lib/rate-limit";
import { enforceDailyLimit } from "@/lib/permissions";

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

    if (!Array.isArray(messages) || messages.length > 50) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }
    for (const m of messages) {
      if (typeof m.content !== "string" || m.content.length > 5000) {
        return NextResponse.json({ error: "Message too long (max 5000 chars)" }, { status: 400 });
      }
    }
    if (scenarioId != null && typeof scenarioId !== "number") {
      return NextResponse.json({ error: "Invalid scenarioId" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "AI service not configured. Please add ANTHROPIC_API_KEY." },
        { status: 503 }
      );
    }

    // Plan + daily-limit enforcement. cat2 conversation is stateless
    // turn-by-turn, so we identify a "session start" by checking whether a
    // cat2_sessions row already exists for (this user, this scenario, today).
    // - No row yet → this is a fresh start. Run enforceDailyLimit and either
    //   429 + insert nothing, or insert the row + let the turn through.
    // - Row exists → user already started this scenario inside their quota
    //   today; continuing turns are not gated.
    //
    // Earlier this gate fired only on the user's FIRST turn (userTurnCount
    // === 1), which let blocked free users keep typing — once their second
    // user-turn arrived, userTurnCount === 2 skipped the check and the API
    // happily kept replying. The "row exists?" signal closes that hole and
    // is also robust to client variants that pre-seed an opener message.
    const scenarioKey = scenarioId != null ? String(scenarioId) : null;

    if (!requestFeedback) {
      const startOfDay = new Date();
      startOfDay.setUTCHours(0, 0, 0, 0);

      let alreadyStartedToday = false;
      if (scenarioKey) {
        const { count: priorRows } = await supabase
          .from("cat2_sessions")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("scenario_id", scenarioKey)
          .gte("created_at", startOfDay.toISOString());
        alreadyStartedToday = (priorRows ?? 0) > 0;
      }

      if (!alreadyStartedToday) {
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
          scenario_id: scenarioKey,
        });
      }
    }

    const reply = await createClinicalRoleplay({ scenarioId, messages, requestFeedback });
    return NextResponse.json({ reply });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[roleplay API error]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
