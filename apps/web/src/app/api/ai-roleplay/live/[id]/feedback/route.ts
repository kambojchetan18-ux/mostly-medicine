import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { scoreSession } from "@/lib/ai-roleplay/scoring";
import type { CaseVariant, SessionFeedback } from "@/lib/ai-roleplay/types";
import { bumpStreak } from "@/lib/streaks";
import { awardXp, XP_POINTS } from "@/lib/xp";
import { aiRateLimit, clientKey } from "@/lib/rate-limit";

// Idempotent: if feedback already exists, return it.
// Scores the doctor's transcript using the existing solo scoring engine.
export async function POST(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rl = await aiRateLimit(clientKey(_req, "acrp-live-feedback", user.id), { max: 10, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Rate limit reached" }, { status: 429 });
  }

  if (!process.env.ANTHROPIC_API_KEY) return NextResponse.json({ error: "AI not configured" }, { status: 503 });

  const { data: session } = await supabase
    .from("acrp_live_sessions")
    .select("id, host_user_id, guest_user_id, host_role, case_id, status, feedback")
    .eq("id", id)
    .single();
  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
  if (session.host_user_id !== user.id && session.guest_user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (session.feedback) {
    return NextResponse.json({ feedback: session.feedback as SessionFeedback, cached: true });
  }
  // Block scoring if the session never reached the roleplay phase. Otherwise
  // users who land on /results during 'waiting' or 'reading' would burn a
  // Claude call on an empty transcript and lock in a meaningless score.
  if (session.status !== "roleplay" && session.status !== "completed") {
    return NextResponse.json(
      { error: "Session has not entered the roleplay phase yet" },
      { status: 409 }
    );
  }

  const { data: caseRow } = await supabase
    .from("acrp_cases")
    .select("seed, difficulty, station_stem, patient_profile, hidden_diagnosis, clue_pool, red_flags, candidate_task, setting, emotional_tone")
    .eq("id", session.case_id)
    .single();
  if (!caseRow) return NextResponse.json({ error: "Case not found" }, { status: 404 });

  const { data: msgs } = await supabase
    .from("acrp_live_messages")
    .select("sender_role, content")
    .eq("session_id", id)
    .order("created_at");

  // Convert to {role, content} pairs where doctor=user, patient=assistant
  // so the scoring engine sees them in the same shape as solo mode.
  const transcript = (msgs ?? []).map((m) => ({
    role: (m.sender_role === "doctor" ? "user" : "assistant") as "user" | "assistant",
    content: m.content,
  }));

  const variant: CaseVariant = {
    seed: caseRow.seed,
    difficulty: caseRow.difficulty,
    stationStem: caseRow.station_stem,
    patientProfile: caseRow.patient_profile,
    hiddenDiagnosis: caseRow.hidden_diagnosis,
    cluePool: caseRow.clue_pool ?? [],
    redFlags: caseRow.red_flags ?? [],
    candidateTask: caseRow.candidate_task,
    setting: caseRow.setting,
    emotionalTone: caseRow.emotional_tone ?? "",
  };

  let feedback: SessionFeedback;
  try {
    // isLiveSession=true unlocks the patient-adherence rubric so the
    // examiner ALSO marks the peer playing the patient (vs the AI patient
    // in solo modes which doesn't need to be graded).
    feedback = await scoreSession({ caseVariant: variant, transcript, isLiveSession: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Scoring failed" }, { status: 500 });
  }

  await supabase
    .from("acrp_live_sessions")
    .update({
      status: "completed",
      ended_at: new Date().toISOString(),
      global_score: feedback.globalScore,
      communication_score: feedback.communicationScore,
      reasoning_score: feedback.reasoningScore,
      feedback,
    })
    .eq("id", id);

  await bumpStreak(supabase, user.id);

  // Award XP to both participants of the live session
  if (session.host_user_id) {
    await awardXp(supabase, session.host_user_id, "live_roleplay_completed", XP_POINTS.live_roleplay_completed);
  }
  if (session.guest_user_id && session.guest_user_id !== session.host_user_id) {
    await awardXp(supabase, session.guest_user_id, "live_roleplay_completed", XP_POINTS.live_roleplay_completed);
  }

  return NextResponse.json({ feedback, cached: false });
}
