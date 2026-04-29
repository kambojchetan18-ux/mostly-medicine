import { NextRequest, NextResponse } from "next/server";
import { createClinicalRoleplay } from "@mostly-medicine/ai";
import { createClient } from "@/lib/supabase/server";
import { createClient as createBrowserClient } from "@supabase/supabase-js";
import { aiRateLimit, clientKey } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  let user = null;

  // Check Bearer token (mobile) first, fall back to cookie session (web)
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data } = await supabase.auth.getUser(token);
    user = data.user;
  } else {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  }

  if (!user) {
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

    const reply = await createClinicalRoleplay({ scenarioId, messages, requestFeedback });
    return NextResponse.json({ reply });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[roleplay API error]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
