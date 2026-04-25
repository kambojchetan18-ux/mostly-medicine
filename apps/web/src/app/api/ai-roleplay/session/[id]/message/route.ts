import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { nextRoleplayReply } from "@/lib/ai-roleplay/roleplay";
import type { CaseVariant } from "@/lib/ai-roleplay/types";

interface Body {
  content?: string;
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id: sessionId } = await ctx.params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "AI service not configured" }, { status: 503 });
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const userMessage = body.content?.trim();
  if (!userMessage) return NextResponse.json({ error: "content required" }, { status: 400 });

  // ─── Load session + case (must belong to this user) ──────────────────
  const { data: session } = await supabase
    .from("acrp_sessions")
    .select("id, status, case_id, user_id")
    .eq("id", sessionId)
    .single();

  if (!session || session.user_id !== user.id) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }
  if (session.status === "completed" || session.status === "abandoned") {
    return NextResponse.json({ error: "Session already ended" }, { status: 409 });
  }

  // Full case payload — read server-side only, never returned to client.
  const { data: caseRow } = await supabase
    .from("acrp_cases")
    .select("seed, difficulty, station_stem, patient_profile, hidden_diagnosis, clue_pool, red_flags, candidate_task, setting, emotional_tone")
    .eq("id", session.case_id)
    .single();
  if (!caseRow) return NextResponse.json({ error: "Case not found" }, { status: 404 });

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

  // ─── Load transcript history ─────────────────────────────────────────
  const { data: history } = await supabase
    .from("acrp_messages")
    .select("role, content")
    .eq("session_id", sessionId)
    .order("created_at");

  const cleanHistory = (history ?? [])
    .filter((m): m is { role: "user" | "assistant"; content: string } => m.role === "user" || m.role === "assistant");

  // ─── Persist user turn first (so transcript remains complete on error) ─
  const { error: insertUserErr } = await supabase
    .from("acrp_messages")
    .insert({ session_id: sessionId, role: "user", content: userMessage });
  if (insertUserErr) {
    console.error("[session/message] persist user", insertUserErr);
    return NextResponse.json({ error: insertUserErr.message }, { status: 500 });
  }

  // Make sure the session is marked as roleplay (in case it was 'reading')
  if (session.status !== "roleplay") {
    await supabase
      .from("acrp_sessions")
      .update({ status: "roleplay", roleplay_started_at: new Date().toISOString() })
      .eq("id", sessionId);
  }

  // ─── Call Claude ─────────────────────────────────────────────────────
  let reply: string;
  try {
    reply = await nextRoleplayReply({
      caseVariant,
      history: cleanHistory,
      newUserMessage: userMessage,
    });
  } catch (err) {
    console.error("[session/message] claude", err);
    const message = err instanceof Error ? err.message : "AI error";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  await supabase
    .from("acrp_messages")
    .insert({ session_id: sessionId, role: "assistant", content: reply });

  return NextResponse.json({ reply });
}
