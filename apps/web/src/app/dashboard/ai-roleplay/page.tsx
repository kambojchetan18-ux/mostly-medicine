import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { checkModulePermission } from "@/lib/permissions";
import LandingClient, { type BlueprintRow, type RecentAttempt } from "./LandingClient";
import UpgradeGate from "./UpgradeGate";

export const metadata = {
  title: "AI Clinical RolePlay Cases — Mostly Medicine",
  description: "Original AI-generated AMC-style practice cases inspired by broader clinical patterns",
};

export default async function AiRoleplayPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const perm = await checkModulePermission(supabase, "acrp_solo");
  if (!perm.allowed) {
    return <UpgradeGate module="acrp_solo" currentPlan={perm.plan} />;
  }

  const { data: blueprints } = await supabase
    .from("acrp_blueprints")
    .select("id, slug, family_name, category, difficulty, presentation_cluster, candidate_tasks")
    .order("category")
    .order("family_name");

  let recent: RecentAttempt[] = [];
  if (user) {
    const { data: sessions } = await supabase
      .from("acrp_sessions")
      .select("id, case_id, status, global_score, created_at, acrp_cases(candidate_task, setting)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);
    if (sessions) {
      type Joined = {
        id: string;
        case_id: string;
        status: string;
        global_score: number | null;
        created_at: string;
        acrp_cases: { candidate_task: string; setting: string } | { candidate_task: string; setting: string }[] | null;
      };
      recent = (sessions as unknown as Joined[]).map((s) => {
        const joined = Array.isArray(s.acrp_cases) ? s.acrp_cases[0] : s.acrp_cases;
        return {
          id: s.id,
          caseId: s.case_id,
          status: s.status,
          globalScore: s.global_score,
          createdAt: s.created_at,
          candidateTask: joined?.candidate_task ?? "Clinical case",
          setting: joined?.setting ?? "",
        };
      });
    }
  }

  return (
    <LandingClient
      blueprints={(blueprints ?? []) as BlueprintRow[]}
      recent={recent}
      isAuthenticated={Boolean(user)}
    />
  );
}
