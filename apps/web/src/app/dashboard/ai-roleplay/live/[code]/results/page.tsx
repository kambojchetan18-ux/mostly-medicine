import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LiveResultsClient from "./LiveResultsClient";
import type { SessionFeedback } from "@/lib/ai-roleplay/types";

export default async function LiveResultsPage({ params }: { params: Promise<{ code: string }> }) {
  const { code: rawCode } = await params;
  const code = rawCode.toUpperCase();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: session } = await supabase
    .from("acrp_live_sessions")
    .select("id, host_user_id, guest_user_id, host_role, status, case_id, feedback, invite_code")
    .eq("invite_code", code)
    .maybeSingle();
  if (!session) notFound();
  if (session.host_user_id !== user.id && session.guest_user_id !== user.id) notFound();

  const myRole: "doctor" | "patient" =
    session.host_user_id === user.id
      ? (session.host_role as "doctor" | "patient")
      : session.host_role === "doctor"
        ? "patient"
        : "doctor";

  return (
    <LiveResultsClient
      sessionId={session.id}
      inviteCode={session.invite_code}
      myRole={myRole}
      initialFeedback={session.feedback as SessionFeedback | null}
    />
  );
}
