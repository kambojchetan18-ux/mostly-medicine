import { createClient } from "@/lib/supabase/server";
import CasesClient from "./CasesClient";

export default async function CasesPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: cases } = await supabase
    .from("cases")
    .select("id, title, category, difficulty, estimated_minutes, amc_exam_type")
    .order("created_at", { ascending: true });

  let progressMap: Record<string, { current_step: number; completed: boolean }> = {};

  if (user) {
    const { data: progress } = await supabase
      .from("user_case_progress")
      .select("case_id, current_step, completed")
      .eq("user_id", user.id);

    if (progress) {
      progressMap = Object.fromEntries(
        progress.map((p) => [p.case_id, { current_step: p.current_step, completed: p.completed }])
      );
    }
  }

  return <CasesClient cases={cases ?? []} progressMap={progressMap} isAuthenticated={!!user} />;
}
