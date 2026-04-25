import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";

export type ModuleKey = "mcq" | "roleplay" | "recalls" | "acrp_solo" | "acrp_live";

export interface PermissionResult {
  allowed: boolean;
  plan: "free" | "pro" | "enterprise";
  dailyLimit: number | null;
  dailyUsed?: number;
  reason?: "no_user" | "module_disabled" | "no_profile" | "daily_limit_reached";
}

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function checkModulePermission(
  supabase: SupabaseClient,
  module: ModuleKey
): Promise<PermissionResult> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { allowed: false, plan: "free", dailyLimit: null, reason: "no_user" };
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("plan, role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role === "admin") {
    return { allowed: true, plan: (profile.plan as PermissionResult["plan"]) ?? "enterprise", dailyLimit: null };
  }

  const plan = (profile?.plan as PermissionResult["plan"]) ?? "free";

  const { data: perm } = await supabase
    .from("module_permissions")
    .select("enabled, daily_limit")
    .eq("plan", plan)
    .eq("module", module)
    .maybeSingle();

  if (!perm || !perm.enabled) {
    return { allowed: false, plan, dailyLimit: null, reason: "module_disabled" };
  }

  if (perm.daily_limit != null) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const svc = serviceClient();
    const { count } = await svc
      .from("module_usage")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("module", module)
      .gte("used_at", todayStart.toISOString());

    const used = count ?? 0;
    if (used >= perm.daily_limit) {
      return { allowed: false, plan, dailyLimit: perm.daily_limit, dailyUsed: used, reason: "daily_limit_reached" };
    }
    return { allowed: true, plan, dailyLimit: perm.daily_limit, dailyUsed: used };
  }

  return { allowed: true, plan, dailyLimit: perm.daily_limit };
}

export async function recordModuleUsage(userId: string, module: ModuleKey): Promise<void> {
  const svc = serviceClient();
  await svc.from("module_usage").insert({ user_id: userId, module, used_at: new Date().toISOString() });
}
