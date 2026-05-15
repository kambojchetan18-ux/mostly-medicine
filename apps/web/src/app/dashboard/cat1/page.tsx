import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { checkModulePermission } from "@/lib/permissions";
import { allQuestions } from "@mostly-medicine/content";
import UpgradeGate from "../ai-roleplay/UpgradeGate";
import Cat1Client from "./Cat1Client";

export const metadata = { title: "AMC MCQ — Mostly Medicine" };

// Computed once per server bundle — allQuestions is a static import so this
// only walks the array on cold start. Passes the per-topic count map down to
// Cat1Client as the initial state, so the topic tiles can show the exact
// pool size without waiting on the GET /api/cat1/questions round trip.
const TOPIC_COUNTS: Record<string, number> = (() => {
  const m: Record<string, number> = {};
  for (const q of allQuestions) m[q.topic] = (m[q.topic] ?? 0) + 1;
  return m;
})();

export default async function Cat1Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const perm = await checkModulePermission(supabase, "mcq");
  if (!perm.allowed) {
    return <UpgradeGate module="mcq" currentPlan={perm.plan} />;
  }

  // Mock Exam visibility is admin-controllable via /dashboard/admin → the
  // mock_exam row in module_permissions. If the row says enabled=false for
  // this user's plan, Cat1Client hides the Mock Exam button entirely.
  const mockPerm = await checkModulePermission(supabase, "mock_exam");

  return (
    <Cat1Client
      plan={perm.plan}
      initialTopicCounts={TOPIC_COUNTS}
      mockExamEnabled={mockPerm.allowed}
    />
  );
}
