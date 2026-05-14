// Module-permission helper.
// Reads the user's plan from user_profiles, then looks up module_permissions.
// Server-side only — call inside Server Components / API routes.

import type { SupabaseClient } from "@supabase/supabase-js";

export type ModuleKey = "mcq" | "roleplay" | "acrp_solo" | "acrp_live";

export interface PermissionResult {
  allowed: boolean;
  plan: "free" | "pro" | "enterprise";
  dailyLimit: number | null;
  reason?: "no_user" | "module_disabled" | "no_profile";
}

// Founder promo: the first 100 signups get Pro free for 30 days. Surfaced via
// user_profiles.pro_until. Once they later subscribe via Stripe, plan is set
// to 'pro' so this branch is irrelevant.
//
// `pro_until` is an ISO timestamp string when read via the Supabase JS client.
// Anything in the future means effective Pro.
export interface PlanLikeProfile {
  plan?: string | null;
  pro_until?: string | null;
}

export function isEffectivelyPro(profile: PlanLikeProfile | null | undefined): boolean {
  if (!profile) return false;
  if (profile.plan === "pro" || profile.plan === "enterprise") return true;
  if (profile.pro_until) {
    const until = Date.parse(profile.pro_until);
    if (Number.isFinite(until) && until > Date.now()) return true;
  }
  return false;
}

// Resolve the plan we should *gate* on. Free users inside their founder
// window are gated as `pro` so they get Pro module access.
function resolveEffectivePlan(profile: PlanLikeProfile | null | undefined): PermissionResult["plan"] {
  const raw = (profile?.plan as PermissionResult["plan"]) ?? "free";
  if (raw !== "free") return raw;
  return isEffectivelyPro(profile) ? "pro" : "free";
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
    .select("plan, role, pro_until")
    .eq("id", user.id)
    .maybeSingle();

  // Admins bypass module gating entirely. The previous code returned
  // `profile.plan ?? "enterprise"` which collapsed to plan="free" for any
  // admin who happened to have plan='free' on their profile (founder /
  // dogfooding accounts), making downstream `isPro` checks treat the admin
  // as a free user — including the 20-question topic-tile cap. Now we
  // return their actual paid tier when they have one, otherwise pretend
  // they're enterprise so every UI gate opens.
  if (profile?.role === "admin") {
    const adminPlan: PermissionResult["plan"] =
      profile.plan === "pro" || profile.plan === "enterprise"
        ? (profile.plan as PermissionResult["plan"])
        : "enterprise";
    return { allowed: true, plan: adminPlan, dailyLimit: null };
  }

  const plan = resolveEffectivePlan(profile);

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
  // /api/ai/roleplay inserts a cat2_sessions row on the user's first turn
  // of each scenario, so this counts unique-scenario starts per UTC day.
  roleplay: { table: "cat2_sessions", userColumn: "user_id", timestampColumn: "created_at" },
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
