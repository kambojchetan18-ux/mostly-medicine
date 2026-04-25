import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ResultsClient from "./ResultsClient";
import type { SessionFeedback } from "@/lib/ai-roleplay/types";

interface ResultsPageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { sessionId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: session } = await supabase
    .from("acrp_sessions")
    .select("id, case_id, user_id, status, global_score, communication_score, reasoning_score, feedback, created_at")
    .eq("id", sessionId)
    .single();

  if (!session || session.user_id !== user.id) notFound();

  const { data: caseRow } = await supabase
    .from("acrp_cases")
    .select("blueprint_id, candidate_task, setting, station_stem, patient_profile")
    .eq("id", session.case_id)
    .single();

  type Stem = { presentingComplaint: string };
  const stem = caseRow?.station_stem as Stem | null;
  type Profile = { name: string };
  const profile = caseRow?.patient_profile as Profile | null;

  // Load full transcript for inline display
  const { data: msgs } = await supabase
    .from("acrp_messages")
    .select("id, role, content, created_at")
    .eq("session_id", sessionId)
    .order("created_at");
  const transcript = (msgs ?? [])
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({ id: m.id, role: m.role as "user" | "assistant", content: m.content }));

  return (
    <ResultsClient
      sessionId={session.id}
      caseId={session.case_id}
      blueprintId={caseRow?.blueprint_id ?? null}
      patientName={profile?.name ?? "Patient"}
      candidateTask={caseRow?.candidate_task ?? ""}
      setting={caseRow?.setting ?? ""}
      presentingComplaint={stem?.presentingComplaint ?? ""}
      initialFeedback={session.feedback as SessionFeedback | null}
      initialStatus={session.status}
      transcript={transcript}
    />
  );
}
