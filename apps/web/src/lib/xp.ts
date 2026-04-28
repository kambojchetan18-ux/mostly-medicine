// XP awarding helper.
// Call awardXp() from API routes after a billable user action.
// The DB-side award_xp() RPC is SECURITY DEFINER and idempotent within 60s
// for the same (user, source), so accidental double-clicks are safe.

import type { SupabaseClient } from "@supabase/supabase-js";

export type XpSource =
  | "mcq_correct"
  | "mcq_incorrect"
  | "roleplay_completed"
  | "live_roleplay_completed"
  | "feedback_received";

export const XP_POINTS: Record<XpSource, number> = {
  mcq_correct: 10,
  mcq_incorrect: 2,
  roleplay_completed: 50,
  live_roleplay_completed: 100,
  feedback_received: 10,
};

/**
 * Award XP to a user via the public.award_xp() RPC.
 * Failures are logged but never thrown — XP must never break the parent flow.
 */
export async function awardXp(
  supabase: SupabaseClient,
  userId: string,
  source: XpSource,
  points: number = XP_POINTS[source]
): Promise<void> {
  if (!userId || !source) return;

  try {
    const { error } = await supabase.rpc("award_xp", {
      p_user_id: userId,
      p_source: source,
      p_points: points,
    });
    if (error) {
      console.error("[xp] award_xp failed", { userId, source, points, error: error.message });
    }
  } catch (err) {
    console.error("[xp] award_xp threw", { userId, source, points, err });
  }
}
