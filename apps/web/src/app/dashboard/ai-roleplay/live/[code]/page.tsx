import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { checkModulePermission } from "@/lib/permissions";
import UpgradeGate from "../../UpgradeGate";
import LiveSessionClient, { type LiveCaseStem, type LivePatientBrief } from "./LiveSessionClient";

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function LiveSessionPage({ params }: PageProps) {
  const { code: rawCode } = await params;
  const code = rawCode.toUpperCase();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const perm = await checkModulePermission(supabase, "acrp_live");
  if (!perm.allowed) return <UpgradeGate module="acrp_live" currentPlan={perm.plan} />;

  const { data: session } = await supabase
    .from("acrp_live_sessions")
    .select("id, host_user_id, guest_user_id, host_role, status, case_id, patient_brief, invite_code")
    .eq("invite_code", code)
    .maybeSingle();
  if (!session) notFound();

  // If guest hasn't joined yet and current user is not host, claim the seat.
  // Use the service-role client so this works even before the new RLS policy
  // catches up — RLS otherwise blocks a non-participant from updating.
  if (!session.guest_user_id && session.host_user_id !== user.id) {
    const service = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
    const { error: claimErr } = await service
      .from("acrp_live_sessions")
      .update({ guest_user_id: user.id })
      .eq("id", session.id)
      .is("guest_user_id", null); // only claim if seat still empty (race-safe)
    if (claimErr) {
      console.error("[live/[code]] guest claim failed", claimErr);
    } else {
      session.guest_user_id = user.id;
    }
  }
  if (session.host_user_id !== user.id && session.guest_user_id !== user.id) {
    return notFound();
  }

  const myRole: "doctor" | "patient" =
    session.host_user_id === user.id
      ? (session.host_role as "doctor" | "patient")
      : session.host_role === "doctor"
        ? "patient"
        : "doctor";

  const isHost = session.host_user_id === user.id;

  // Doctor sees the candidate stem; patient sees the actor brief.
  const { data: caseRow } = await supabase
    .from("acrp_cases")
    .select("station_stem, patient_profile, candidate_task, setting, difficulty")
    .eq("id", session.case_id)
    .single();
  if (!caseRow) notFound();

  type Profile = { name: string };
  const profile = caseRow.patient_profile as Profile | null;

  const stem: LiveCaseStem = {
    presentingComplaint:
      (caseRow.station_stem as { presentingComplaint?: string })?.presentingComplaint ?? "",
    setting: caseRow.setting,
    candidateTask: caseRow.candidate_task,
    visiblePatientContext:
      (caseRow.station_stem as { visiblePatientContext?: string })?.visiblePatientContext ?? "",
    difficulty: caseRow.difficulty,
    patientName: profile?.name ?? "Patient",
  };

  return (
    <LiveSessionClient
      sessionId={session.id}
      inviteCode={session.invite_code}
      myUserId={user.id}
      myRole={myRole}
      isHost={isHost}
      hostUserId={session.host_user_id}
      guestUserId={session.guest_user_id}
      initialStatus={session.status}
      stem={stem}
      patientBrief={session.patient_brief as LivePatientBrief | null}
    />
  );
}
