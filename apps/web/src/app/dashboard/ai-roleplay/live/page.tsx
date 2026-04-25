import { createClient } from "@/lib/supabase/server";
import { checkModulePermission } from "@/lib/permissions";
import UpgradeGate from "../UpgradeGate";
import LiveLandingClient, { type BlueprintRow } from "./LiveLandingClient";

export const metadata = { title: "Live RolePlay — Mostly Medicine" };

export default async function LiveLandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const perm = await checkModulePermission(supabase, "acrp_live");
  if (user && !perm.allowed) return <UpgradeGate module="acrp_live" currentPlan={perm.plan} />;

  const { data: bps } = await supabase
    .from("acrp_blueprints")
    .select("id, slug, family_name, category, difficulty")
    .order("category");

  return <LiveLandingClient blueprints={(bps ?? []) as BlueprintRow[]} />;
}
