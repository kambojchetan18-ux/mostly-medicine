import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * GET /api/streaks/heatmap
 *
 * Returns the authed user's MCQ attempt counts per UTC day for the last
 * 84 days (12 weeks × 7 days). Powers the GitHub-style streak heatmap on
 * the dashboard — visualising the streak is the dopamine-loop retention
 * mechanic from the growth blueprint (slide 8).
 *
 * Response shape: { days: [{ date: 'YYYY-MM-DD', count: number }, ...] }
 *
 * The grid always returns 84 entries (oldest → newest) so the client can
 * render a stable 7×12 grid even when a new user has zero attempts.
 */
export async function GET() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
