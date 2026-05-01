import { notFound, redirect } from "next/navigation";
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
  if (!user) redirect("/auth/login");

  // Read ONLY the columns safe for the candidate. Hidden diagnosis, clue pool,
  // and red flags stay server-side and are read by the roleplay/feedback APIs.
  const { data: row } = await supabase
    .from("acrp_cases")
    .select("id, blueprint_id, difficulty, station_stem, patient_profile, candidate_task, setting, emotional_tone")
    .eq("id", caseId)
    .single();

  if (!row) notFound();

  type Profile = { name: string };
  const profile = row.patient_profile as Profile | null;
  type Stem = {
    presentingComplaint: string;
    setting: string;
    candidateTask: string;
    visiblePatientContext: string;
  };
  const stem = row.station_stem as Stem;

  return (
    <ReadingClient
      caseId={row.id}
      difficulty={row.difficulty}
      stationStem={stem}
      patientName={profile?.name ?? "Patient"}
      candidateTask={row.candidate_task}
      setting={row.setting}
    />
  );
}
