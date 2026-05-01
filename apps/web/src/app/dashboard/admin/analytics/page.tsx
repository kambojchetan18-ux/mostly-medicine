import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import AnalyticsClient, { type AnalyticsPayload } from "./AnalyticsClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Analytics — Admin · Mostly Medicine" };

function service() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

const DAY_MS = 86_400_000;
const isoDaysAgo = (n: number) => new Date(Date.now() - n * DAY_MS).toISOString();
const dateDaysAgo = (n: number) => new Date(Date.now() - n * DAY_MS).toISOString().slice(0, 10);

async function loadAnalytics(): Promise<AnalyticsPayload> {
  const svc = service();
  const since7  = isoDaysAgo(7);
  const since30 = isoDaysAgo(30);
  const date1   = dateDaysAgo(1);
  const date7   = dateDaysAgo(7);
  const date30  = dateDaysAgo(30);

  // Pull only the columns we need across all tables. Service role bypasses RLS.
  // Using lean .select() is cheaper than aggregate RPCs and keeps everything
  // in one place — easy to extend later.
  const [
    profilesRes,
    attemptsRes,
    soloRes,
    liveRes,
  ] = await Promise.all([
    svc.from("user_profiles").select("id, email, full_name, plan, role, created_at, founder_rank, pro_until, last_active_date, total_xp, current_streak, stripe_subscription_id"),
    svc.from("attempts").select("user_id, attempted_at"),
    svc.from("acrp_sessions").select("user_id, status, created_at, ended_at"),
    svc.from("acrp_live_sessions").select("host_user_id, guest_user_id, status, created_at, ended_at"),
  ]);

  const profiles = profilesRes.data ?? [];
  const attempts = attemptsRes.data ?? [];
  const solo     = soloRes.data ?? [];
  const live     = liveRes.data ?? [];

  // ── Helpers ─────────────────────────────────────────────────────────
  const inLast = (iso: string | null | undefined, since: string) => !!iso && iso >= since;
  const onOrAfter = (d: string | null | undefined, target: string) => !!d && d >= target;

  // ── Signups & plan split ────────────────────────────────────────────
  const totalUsers   = profiles.length;
  const signups7d    = profiles.filter((p) => inLast(p.created_at, since7)).length;
  const signups30d   = profiles.filter((p) => inLast(p.created_at, since30)).length;

  const now = Date.now();
  const isFounderActive = (p: { founder_rank: number | null; pro_until: string | null }) =>
    p.founder_rank != null && p.pro_until != null && Date.parse(p.pro_until) > now;
  const isPaid = (p: { plan: string | null; stripe_subscription_id: string | null }) =>
    (p.plan === "pro" || p.plan === "enterprise") && !!p.stripe_subscription_id;

  const planSplit = {
    free:        profiles.filter((p) => !isFounderActive(p) && !isPaid(p) && p.plan === "free").length,
    founder:     profiles.filter((p) => isFounderActive(p) && !isPaid(p)).length,
    pro:         profiles.filter((p) => isPaid(p) && p.plan === "pro").length,
    enterprise:  profiles.filter((p) => isPaid(p) && p.plan === "enterprise").length,
    admin:       profiles.filter((p) => p.role === "admin").length,
  };

  // ── Active users (DAU/WAU/MAU) — driven by last_active_date which the
  //    streak system already keeps fresh on every meaningful action.
  const dau = profiles.filter((p) => onOrAfter(p.last_active_date, date1)).length;
  const wau = profiles.filter((p) => onOrAfter(p.last_active_date, date7)).length;
  const mau = profiles.filter((p) => onOrAfter(p.last_active_date, date30)).length;

  // ── Engagement totals ───────────────────────────────────────────────
  const totalAttempts   = attempts.length;
  const attempts7d      = attempts.filter((a) => inLast(a.attempted_at, since7)).length;
  const totalSolo       = solo.length;
  const soloCompleted   = solo.filter((s) => s.status === "completed").length;
  const totalLive       = live.length;
  const liveCompleted   = live.filter((s) => s.status === "completed").length;

  // ── Look-to-book ratios ─────────────────────────────────────────────
  // 1. Activation: signed up AND attempted at least one MCQ.
  const userIdsWithAttempt = new Set(attempts.map((a) => a.user_id));
  const userIdsWithSession = new Set([
    ...solo.map((s) => s.user_id),
    ...live.map((s) => s.host_user_id),
    ...live.map((s) => s.guest_user_id).filter(Boolean),
  ]);
  const activatedUsers = profiles.filter((p) =>
    userIdsWithAttempt.has(p.id) || userIdsWithSession.has(p.id)
  ).length;
  const activationRate = totalUsers > 0 ? (activatedUsers / totalUsers) * 100 : 0;

  // 2. Founder → paid (the actual look-to-book): founders who later paid.
  const founderTotal     = profiles.filter((p) => p.founder_rank != null).length;
  const founderConverted = profiles.filter((p) => p.founder_rank != null && isPaid(p)).length;
  const founderConvRate  = founderTotal > 0 ? (founderConverted / founderTotal) * 100 : 0;

  // 3. Started a session → finished it (RolePlay completion ratio).
  const sessionsStarted   = totalSolo + totalLive;
  const sessionsCompleted = soloCompleted + liveCompleted;
  const completionRate    = sessionsStarted > 0 ? (sessionsCompleted / sessionsStarted) * 100 : 0;

  // ── Per-user table (top 50 by combined activity) ───────────────────
  const attemptsByUser = new Map<string, number>();
  for (const a of attempts) {
    if (!a.user_id) continue;
    attemptsByUser.set(a.user_id, (attemptsByUser.get(a.user_id) ?? 0) + 1);
  }
  const soloByUser = new Map<string, number>();
  for (const s of solo) {
    if (!s.user_id) continue;
    soloByUser.set(s.user_id, (soloByUser.get(s.user_id) ?? 0) + 1);
  }
  const liveByUser = new Map<string, number>();
  for (const s of live) {
    for (const uid of [s.host_user_id, s.guest_user_id]) {
      if (!uid) continue;
      liveByUser.set(uid, (liveByUser.get(uid) ?? 0) + 1);
    }
  }

  const userRows = profiles.map((p) => {
    const mcqs = attemptsByUser.get(p.id) ?? 0;
    const so   = soloByUser.get(p.id) ?? 0;
    const li   = liveByUser.get(p.id) ?? 0;
    const effectivePlan: "free" | "founder" | "pro" | "enterprise" =
      isPaid(p) && p.plan === "enterprise" ? "enterprise"
      : isPaid(p) ? "pro"
      : isFounderActive(p) ? "founder"
      : "free";
    return {
      id: p.id,
      email: p.email ?? "",
      name: p.full_name ?? p.email?.split("@")[0] ?? "—",
      plan: effectivePlan,
      role: p.role ?? "user",
      createdAt: p.created_at,
      lastActiveDate: p.last_active_date,
      mcqAttempts: mcqs,
      soloSessions: so,
      liveSessions: li,
      totalActivity: mcqs + so + li,
      xp: p.total_xp ?? 0,
      streak: p.current_streak ?? 0,
      founderRank: p.founder_rank,
    };
  });
  userRows.sort((a, b) => b.totalActivity - a.totalActivity || b.xp - a.xp);

  // ── Daily signups (last 14 days) ────────────────────────────────────
  const dailySignups: { date: string; count: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now - i * DAY_MS).toISOString().slice(0, 10);
    dailySignups.push({ date: d, count: 0 });
  }
  for (const p of profiles) {
    if (!p.created_at) continue;
    const d = p.created_at.slice(0, 10);
    const bucket = dailySignups.find((b) => b.date === d);
    if (bucket) bucket.count += 1;
  }

  return {
    generatedAt: new Date().toISOString(),
    totals: {
      users: totalUsers,
      signups7d,
      signups30d,
      dau,
      wau,
      mau,
      mcqAttempts: totalAttempts,
      mcqAttempts7d: attempts7d,
      soloSessions: totalSolo,
      soloCompleted,
      liveSessions: totalLive,
      liveCompleted,
    },
    planSplit,
    funnel: {
      activatedUsers,
      activationRate,
      founderTotal,
      founderConverted,
      founderConvRate,
      sessionsStarted,
      sessionsCompleted,
      completionRate,
    },
    dailySignups,
    users: userRows.slice(0, 50),
  };
}

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const data = await loadAnalytics();
  return <AnalyticsClient data={data} />;
}
