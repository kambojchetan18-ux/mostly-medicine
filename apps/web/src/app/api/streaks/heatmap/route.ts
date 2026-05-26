import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { aiRateLimit, clientKey } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rl = await aiRateLimit(clientKey(req, "streaks-heatmap", user.id), { max: 30, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(Math.ceil((rl.retryAfterMs ?? 60_000) / 1000)) } });
  }

  // 84-day window. Index 0 = oldest day, index 83 = today (UTC).
  const DAYS = 84;
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setUTCDate(start.getUTCDate() - (DAYS - 1));

  // Pull just the timestamps and aggregate in JS — 84 days of MCQ activity
  // is low volume (a heavy user does maybe 50/day = ~4k rows max), and
  // this avoids needing a Postgres function or RPC for a simple group-by.
  const { data, error } = await supabase
    .from("attempts")
    .select("attempted_at")
    .eq("user_id", user.id)
    .gte("attempted_at", start.toISOString());

  if (error) {
    console.error("[streaks/heatmap] select error", error);
    return NextResponse.json({ error: "query_failed" }, { status: 500 });
  }

  // Build the full 84-day skeleton so the grid renders even with 0 attempts.
  const buckets = new Map<string, number>();
  for (let i = 0; i < DAYS; i++) {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + i);
    buckets.set(d.toISOString().slice(0, 10), 0);
  }

  for (const row of data ?? []) {
    if (!row.attempted_at) continue;
    const key = new Date(row.attempted_at).toISOString().slice(0, 10);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  const days = Array.from(buckets.entries()).map(([date, count]) => ({
    date,
    count,
  }));

  return NextResponse.json({ days });
}
