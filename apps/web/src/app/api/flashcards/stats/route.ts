import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Aggregate stats for the flashcards dashboard header:
//   - dueCount: cards whose FSRS-scheduled `due` timestamp has passed
//   - reviewsByDay[]: last 90 days of (date, count) for the GitHub-style
//     heatmap
//   - currentStreak / longestStreak: consecutive UTC days with ≥ 1 review
//   - totalCards, matureCards (state === 2): library totals
//
// All derived from the user's own flashcard_reviews rows (RLS-locked).
// Pure additive; no schema change beyond what migrations 043 + 044
// already provide.

const HEATMAP_DAYS = 90;

interface DayBucket {
  date: string; // YYYY-MM-DD (UTC)
  count: number;
}

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const horizon = new Date(now.getTime() - HEATMAP_DAYS * 86_400_000);
  horizon.setUTCHours(0, 0, 0, 0);

  // Pull ALL of this user's flashcard_reviews; the table grows on the
  // order of "one row per (user, card)" so even a heavy AnKing user
  // will be < 50k rows. We need both due (any time) and last_review
  // (last 90 days) — one query covers both.
  const { data: rows, error } = await supabase
    .from("flashcard_reviews")
    .select("card_id, state, due, last_review")
    .eq("user_id", user.id);

  if (error) {
    console.error("[flashcards/stats] select failed", error);
    return NextResponse.json({ error: "Stats fetch failed" }, { status: 500 });
  }

  const all = rows ?? [];
  const totalCards = all.length;
  const matureCards = all.filter((r) => r.state === 2).length;
  const dueCount = all.filter(
    (r) => r.due != null && new Date(r.due).getTime() <= now.getTime()
  ).length;

  // Bucket last 90 days. Use a Map keyed by YYYY-MM-DD UTC so iterating
  // is O(rows + 90) total.
  const byDay = new Map<string, number>();
  for (const r of all) {
    if (!r.last_review) continue;
    const d = new Date(r.last_review);
    if (d.getTime() < horizon.getTime()) continue;
    const key = d.toISOString().slice(0, 10);
    byDay.set(key, (byDay.get(key) ?? 0) + 1);
  }
  // Fill in the zero-days so the heatmap renders a stable grid.
  const reviewsByDay: DayBucket[] = [];
  for (let i = HEATMAP_DAYS - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86_400_000);
    d.setUTCHours(0, 0, 0, 0);
    const key = d.toISOString().slice(0, 10);
    reviewsByDay.push({ date: key, count: byDay.get(key) ?? 0 });
  }

  // Streak: consecutive UTC days with ≥ 1 review, walking backward from
  // today. We give a 1-day grace — if today is empty but yesterday isn't,
  // the streak still counts (Anki convention; users with a hectic
  // morning haven't lost their streak before the day is even over).
  const todayKey = new Date(now).toISOString().slice(0, 10);
  const yKey = new Date(now.getTime() - 86_400_000).toISOString().slice(0, 10);
  const studiedToday = (byDay.get(todayKey) ?? 0) > 0;
  let currentStreak = 0;
  const walkStart = studiedToday
    ? new Date(now.getTime())
    : (byDay.get(yKey) ?? 0) > 0
      ? new Date(now.getTime() - 86_400_000)
      : null;
  if (walkStart) {
    walkStart.setUTCHours(0, 0, 0, 0);
    let d = walkStart;
    while ((byDay.get(d.toISOString().slice(0, 10)) ?? 0) > 0) {
      currentStreak += 1;
      d = new Date(d.getTime() - 86_400_000);
    }
  }

  // Longest streak: walk the 90-day window once and track the max run.
  let longestStreak = 0;
  let run = 0;
  for (const bucket of reviewsByDay) {
    if (bucket.count > 0) {
      run += 1;
      if (run > longestStreak) longestStreak = run;
    } else {
      run = 0;
    }
  }
  if (currentStreak > longestStreak) longestStreak = currentStreak;

  return NextResponse.json({
    dueCount,
    totalCards,
    matureCards,
    currentStreak,
    longestStreak,
    studiedToday,
    reviewsByDay,
    horizonDays: HEATMAP_DAYS,
  });
}
