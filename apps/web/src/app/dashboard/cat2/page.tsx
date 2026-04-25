import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { checkModulePermission } from "@/lib/permissions";
import UpgradeGate from "../ai-roleplay/UpgradeGate";
import Cat2Client from "./Cat2Client";

export const metadata = { title: "AMC CAT 2 — Mostly Medicine" };

export default async function Cat2Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const perm = await checkModulePermission(supabase, "roleplay");
  if (!perm.allowed) {
    return <UpgradeGate module="roleplay" currentPlan={perm.plan} />;
  }

  return <Cat2Client />;
}
