import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PlayClient from "./PlayClient";

interface PlayPageProps {
  params: Promise<{ caseId: string }>;
}

export default async function PlayPage({ params }: PlayPageProps) {
  const { caseId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Safe-only case fields — hidden_diagnosis/clue_pool stay server-side.
  const { data: caseRow } = await supabase
    .from("acrp_cases")
    .select("id, station_stem, patient_profile, candidate_task, setting, emotional_tone, difficulty")
    .eq("id", caseId)
    .single();
  if (!caseRow) notFound();

  // Find or create the active session.
  let sessionId: string | null = null;
  const { data: existing } = await supabase
    .from("acrp_sessions")
    .select("id, status")
    .eq("user_id", user.id)
    .eq("case_id", caseId)
    .in("status", ["reading", "roleplay"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) {
    sessionId = existing.id;
    if (existing.status === "reading") {
      await supabase
        .from("acrp_sessions")
        .update({ status: "roleplay", roleplay_started_at: new Date().toISOString() })
        .eq("id", existing.id);
    }
  } else {
    const { data: created } = await supabase
      .from("acrp_sessions")
      .insert({
        user_id: user.id,
        case_id: caseId,
        status: "roleplay",
        roleplay_started_at: new Date().toISOString(),
      })
      .select("id")
      .single();
    sessionId = created?.id ?? null;
  }

  if (!sessionId) notFound();

  // Load any prior messages (so a refresh resumes the transcript).
  const { data: msgs } = await supabase
    .from("acrp_messages")
    .select("id, role, content, created_at")
    .eq("session_id", sessionId)
    .order("created_at");

  type Profile = { name?: string; gender?: string };
  const profile = (caseRow.patient_profile as Profile | null) ?? null;
  const genderRaw = (profile?.gender ?? "").toLowerCase();
  const patientGender: "male" | "female" | "unknown" =
    /\b(female|woman|girl)\b/.test(genderRaw)
      ? "female"
      : /\b(male|man|boy)\b/.test(genderRaw)
        ? "male"
        : "unknown";
  type Stem = {
    presentingComplaint?: string;
    setting?: string;
    candidateTask?: string;
    visiblePatientContext?: string;
  };
  const stem = (caseRow.station_stem as Stem | null) ?? {};

  return (
    <PlayClient
      caseId={caseRow.id}
      sessionId={sessionId}
      patientName={profile?.name ?? "Patient"}
      patientGender={patientGender}
      candidateTask={stem.candidateTask || caseRow.candidate_task || ""}
      setting={stem.setting || caseRow.setting || ""}
      difficulty={caseRow.difficulty ?? "medium"}
      initialMessages={(msgs ?? [])
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({ id: m.id, role: m.role as "user" | "assistant", content: m.content }))}
    />
  );
}
