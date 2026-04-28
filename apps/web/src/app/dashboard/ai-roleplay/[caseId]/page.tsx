import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ReadingClient from "./ReadingClient";

interface ReadingPageProps {
  params: Promise<{ caseId: string }>;
}

export default async function ReadingPage({ params }: ReadingPageProps) {
  const { caseId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  // Read ONLY the columns safe for the candidate. Hidden diagnosis, clue pool,
  // and red flags stay server-side and are read by the roleplay/feedback APIs.
  const { data: row } = await supabase
    .from("acrp_cases")
    .select("id, blueprint_id, difficulty, station_stem, patient_profile, candidate_task, setting, emotional_tone")
    .eq("id", caseId)
    .single();

  if (!row) notFound();

  type Profile = { name?: string };
  const profile = (row.patient_profile as Profile | null) ?? null;
  type Stem = {
    presentingComplaint?: string;
    setting?: string;
    candidateTask?: string;
    visiblePatientContext?: string;
  };
  // Old rows may have null station_stem — fall back to the flat columns so
  // the reading screen never crashes on jsonb access.
  const rawStem = (row.station_stem as Stem | null) ?? {};
  const stem = {
    presentingComplaint: rawStem.presentingComplaint ?? "",
    setting: rawStem.setting ?? row.setting ?? "",
    candidateTask: rawStem.candidateTask ?? row.candidate_task ?? "",
    visiblePatientContext: rawStem.visiblePatientContext ?? "",
  };

  return (
    <ReadingClient
      caseId={row.id}
      difficulty={row.difficulty ?? "medium"}
      stationStem={stem}
      patientName={profile?.name ?? "Patient"}
      candidateTask={row.candidate_task ?? ""}
      setting={row.setting ?? ""}
    />
  );
}
