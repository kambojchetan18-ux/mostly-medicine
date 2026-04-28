import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { scoreSession } from "@/lib/ai-roleplay/scoring";
import type { CaseVariant, SessionFeedback } from "@/lib/ai-roleplay/types";
import { bumpStreak } from "@/lib/streaks";
import { awardXp, XP_POINTS } from "@/lib/xp";

export async function POST(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id: sessionId } = await ctx.params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "AI service not configured" }, { status: 503 });
  }

  // ─── Load session (must belong to this user) ─────────────────────────
  const { data: session } = await supabase
    .from("acrp_sessions")
    .select("id, status, case_id, user_id, feedback, global_score, communication_score, reasoning_score")
    .eq("id", sessionId)
    .single();

  if (!session || session.user_id !== user.id) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  // ─── Idempotent: return existing feedback if already scored ──────────
  if (session.feedback) {
    return NextResponse.json({ feedback: session.feedback as SessionFeedback, cached: true });
  }

  // ─── Load case + transcript ──────────────────────────────────────────
  const { data: caseRow } = await supabase
    .from("acrp_cases")
    .select("seed, difficulty, station_stem, patient_profile, hidden_diagnosis, clue_pool, red_flags, candidate_task, setting, emotional_tone")
    .eq("id", session.case_id)
    .single();
  if (!caseRow) return NextResponse.json({ error: "Case not found" }, { status: 404 });

  const { data: msgs } = await supabase
    .from("acrp_messages")
    .select("role, content")
    .eq("session_id", sessionId)
    .order("created_at");

  const transcript = (msgs ?? []).filter(
    (m): m is { role: "user" | "assistant"; content: string } =>
      m.role === "user" || m.role === "assistant"
  );

  const caseVariant: CaseVariant = {
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

  // ─── Score ───────────────────────────────────────────────────────────
  let feedback: SessionFeedback;
  try {
    feedback = await scoreSession({ caseVariant, transcript });
  } catch (err) {
    console.error("[session/feedback] claude", err);
    const message = err instanceof Error ? err.message : "Scoring failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  // ─── Persist ─────────────────────────────────────────────────────────
  const { error: updateErr } = await supabase
    .from("acrp_sessions")
    .update({
      status: "completed",
      ended_at: new Date().toISOString(),
      global_score: feedback.globalScore,
      communication_score: feedback.communicationScore,
      reasoning_score: feedback.reasoningScore,
      feedback,
    })
    .eq("id", sessionId);

  if (updateErr) {
    console.error("[session/feedback] persist", updateErr);
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  // Streak + XP: completing a roleplay session counts as activity.
  await bumpStreak(supabase, user.id);
  await awardXp(supabase, user.id, "roleplay_completed", XP_POINTS.roleplay_completed);
  await awardXp(supabase, user.id, "feedback_received", XP_POINTS.feedback_received);

  return NextResponse.json({ feedback, cached: false });
}
