import type { SupabaseClient } from "@supabase/supabase-js";

export interface StreakResult {
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
}

/**
 * Bump the daily activity streak for `userId`. The Postgres function
 * `public.bump_streak` is idempotent within the same UTC day, so calling
 * this from multiple activity routes per request/day is safe.
 *
 * Failures are swallowed (logged only) — the streak is a side effect of
 * the user's primary action (e.g. saving an MCQ attempt) and must never
 * cause that primary action to fail.
 */
export async function bumpStreak(
  supabase: SupabaseClient,
  userId: string
): Promise<StreakResult | null> {
  try {
    const { data, error } = await supabase.rpc("bump_streak", {
      p_user_id: userId,
    });
    if (error) {
      console.error("[streaks] bump_streak rpc error", error);
      return null;
    }
    // Postgres function returns a SETOF row. supabase-js returns it as an
    // array of rows (or a single row depending on the function shape).
    if (Array.isArray(data)) {
      return (data[0] as StreakResult) ?? null;
    }
    return (data as StreakResult) ?? null;
  } catch (err) {
    console.error("[streaks] bump_streak threw", err);
    return null;
  }
}
