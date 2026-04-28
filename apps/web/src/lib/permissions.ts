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

// Per-module mapping of where to count "today's usage" for daily-limit
// enforcement. Each entry: { table, userColumn, timestampColumn }.
const USAGE_COUNTERS: Record<ModuleKey, { table: string; userColumn: string; timestampColumn: string } | null> = {
  mcq: { table: "attempts", userColumn: "user_id", timestampColumn: "attempted_at" },
  acrp_solo: { table: "acrp_sessions", userColumn: "user_id", timestampColumn: "created_at" },
  acrp_live: { table: "acrp_live_sessions", userColumn: "host_user_id", timestampColumn: "created_at" },
  // No server-side usage table — daily limit not enforceable.
  recalls: null,
  roleplay: null,
};

export interface DailyLimitResult extends PermissionResult {
  used: number;
  remaining: number | null;
}

// Combines plan check + today's usage count. Returns 429-worthy data when
// the user is over their daily quota. Admins and unlimited (null) plans
// always pass. UTC midnight = day boundary.
export async function enforceDailyLimit(
  supabase: SupabaseClient,
  module: ModuleKey
): Promise<DailyLimitResult> {
  const perm = await checkModulePermission(supabase, module);
  if (!perm.allowed) {
    return { ...perm, used: 0, remaining: 0 };
  }
  if (perm.dailyLimit == null) {
    return { ...perm, used: 0, remaining: null };
  }

  const counter = USAGE_COUNTERS[module];
  if (!counter) {
    // No server-side counter for this module → fall back to plan check only.
    return { ...perm, used: 0, remaining: null };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { allowed: false, plan: perm.plan, dailyLimit: perm.dailyLimit, reason: "no_user", used: 0, remaining: 0 };
  }

  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);

  const { count } = await supabase
    .from(counter.table)
    .select("id", { count: "exact", head: true })
    .eq(counter.userColumn, user.id)
    .gte(counter.timestampColumn, startOfDay.toISOString());

  const used = count ?? 0;
  const remaining = Math.max(0, perm.dailyLimit - used);
  const allowed = used < perm.dailyLimit;

  return {
    allowed,
    plan: perm.plan,
    dailyLimit: perm.dailyLimit,
    used,
    remaining,
    reason: allowed ? undefined : "module_disabled",
  };
}
