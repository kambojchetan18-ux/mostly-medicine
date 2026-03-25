import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import CasePlayer from "./CasePlayer";

export default async function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: caseData } = await supabase
    .from("cases")
    .select("*")
    .eq("id", id)
    .single();

  if (!caseData) notFound();

  let initialProgress = null;
  if (user) {
    const { data: progress } = await supabase
      .from("user_case_progress")
      .select("current_step, completed")
      .eq("user_id", user.id)
      .eq("case_id", id)
      .single();
    initialProgress = progress;
  }

  return (
    <CasePlayer
      caseData={caseData}
      userId={user?.id ?? null}
      initialStep={initialProgress?.current_step ?? 1}
      initialCompleted={initialProgress?.completed ?? false}
    />
  );
}
