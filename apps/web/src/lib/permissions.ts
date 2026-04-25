// Module-permission helper.
// Reads the user's plan from user_profiles, then looks up module_permissions.
// Server-side only — call inside Server Components / API routes.

import type { SupabaseClient } from "@supabase/supabase-js";

export type ModuleKey = "mcq" | "roleplay" | "recalls" | "acrp_solo" | "acrp_live";

export interface PermissionResult {
  allowed: boolean;
  plan: "free" | "pro" | "enterprise";
  dailyLimit: number | null;
  reason?: "no_user" | "module_disabled" | "no_profile";
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

  // Admins bypass module gating entirely.
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

  return { allowed: true, plan, dailyLimit: perm.daily_limit };
}
