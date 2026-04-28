import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { checkModulePermission } from "@/lib/permissions";
import UpgradeGate from "../ai-roleplay/UpgradeGate";
import Cat1Client from "./Cat1Client";

export const metadata = { title: "AMC MCQ — Mostly Medicine" };

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

  return <Cat1Client />;
}
