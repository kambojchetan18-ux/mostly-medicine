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

// ── ISO week helper (Mon-anchored, like date_trunc('week', ts))
function isoWeekStart(iso: string): string {
  const d = new Date(iso);
  const day = d.getUTCDay();          // 0=Sun..6=Sat
  const delta = (day + 6) % 7;        // distance back to Monday
  d.setUTCDate(d.getUTCDate() - delta);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

async function loadAnalytics(): Promise<AnalyticsPayload> {
  const svc = service();
  const since7   = isoDaysAgo(7);
  const since14  = isoDaysAgo(14);
  const since30  = isoDaysAgo(30);
  const since60  = isoDaysAgo(60);
  const date1    = dateDaysAgo(1);
  const date7    = dateDaysAgo(7);
  const date30   = dateDaysAgo(30);

  // All independent — fire in parallel. Keeping date-bounded WHEREs on the
  // high-volume tables (attempts / xp_events / mcq_sessions) so we don't pull
  // the whole world. profiles is small enough to fetch in full for accurate
  // funnel + cohort math.
  const [
    profilesRes,
    attemptsRes,
    soloRes,
    liveRes,
    mcqSessionsRes,
    feedbackRes,
  ] = await Promise.all([
    svc.from("user_profiles").select("id, email, full_name, plan, role, created_at, founder_rank, pro_until, last_active_date, total_xp, current_streak, stripe_subscription_id"),
    // attempts is the biggest table; cap to 60d for retention math.
    svc.from("attempts").select("user_id, attempted_at").gte("attempted_at", since60),
    svc.from("acrp_sessions").select("user_id, status, created_at, ended_at"),
    svc.from("acrp_live_sessions").select("host_user_id, guest_user_id, status, created_at, ended_at"),
    svc.from("mcq_sessions").select("user_id, status, started_at"),
    svc.from("feedback_tickets").select("user_id, created_at"),
  ]);

  const profiles    = profilesRes.data ?? [];
  const attempts    = attemptsRes.data ?? [];
  const solo        = soloRes.data ?? [];
  const live        = liveRes.data ?? [];
  const mcqSessions = mcqSessionsRes.data ?? [];
  const tickets     = feedbackRes.data ?? [];

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

  // ── Active users (DAU/WAU/MAU)
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

  // ── Activity index sets (used everywhere below) ─────────────────────
  const userIdsWithAttempt = new Set(attempts.map((a) => a.user_id).filter(Boolean));
  const userIdsWithSolo    = new Set(solo.map((s) => s.user_id).filter(Boolean));
  const userIdsWithLiveHost = new Set(live.map((s) => s.host_user_id).filter(Boolean));
  const userIdsWithSession = new Set([
    ...userIdsWithSolo,
    ...userIdsWithLiveHost,
    ...live.map((s) => s.guest_user_id).filter((x): x is string => !!x),
  ]);
  const userIdsWithMcqSession = new Set(mcqSessions.map((s) => s.user_id).filter(Boolean));
  const userIdsWithCompletedMcqSession = new Set(
    mcqSessions.filter((s) => s.status === "completed").map((s) => s.user_id).filter(Boolean)
  );
  const userIdsWithTicket = new Set(tickets.map((t) => t.user_id).filter(Boolean));

  const activatedUsers = profiles.filter((p) =>
    userIdsWithAttempt.has(p.id) || userIdsWithSession.has(p.id)
  ).length;
  const activationRate = totalUsers > 0 ? (activatedUsers / totalUsers) * 100 : 0;

  // ── Look-to-book ratios ─────────────────────────────────────────────
  const founderTotal     = profiles.filter((p) => p.founder_rank != null).length;
  const founderConverted = profiles.filter((p) => p.founder_rank != null && isPaid(p)).length;
  const founderConvRate  = founderTotal > 0 ? (founderConverted / founderTotal) * 100 : 0;

  const sessionsStarted   = totalSolo + totalLive;
  const sessionsCompleted = soloCompleted + liveCompleted;
  const completionRate    = sessionsStarted > 0 ? (sessionsCompleted / sessionsStarted) * 100 : 0;

  // ── 1. Activation funnel (5 stages) ─────────────────────────────────
  const signupsCount    = totalUsers;
  const didMcqAttempt   = profiles.filter((p) => userIdsWithAttempt.has(p.id)).length;
  const didRoleplay     = profiles.filter((p) => userIdsWithSession.has(p.id)).length;
  const becameFounderOrPro = profiles.filter((p) =>
    p.founder_rank != null || p.plan === "pro" || p.plan === "enterprise"
  ).length;
  const paidSubscribers = profiles.filter((p) => !!p.stripe_subscription_id).length;
  const funnelSteps = [
    { label: "Signups",                count: signupsCount },
    { label: "→ First MCQ attempt",    count: didMcqAttempt },
    { label: "→ First RolePlay",       count: didRoleplay },
    { label: "→ Founder or Pro tier",  count: becameFounderOrPro },
    { label: "→ Paid subscription",    count: paidSubscribers },
  ];

  // ── 2. Cohort retention table — last 8 ISO weeks ────────────────────
  // Group signups by ISO week. For each user track:
  //   anyActivityIso = min(any activity ts) — used for D7 / D30
  //   We also use last_active_date for D1.
  const firstActivityByUser = new Map<string, string>();
  const recordActivity = (uid: string | null | undefined, ts: string | null | undefined) => {
    if (!uid || !ts) return;
    const cur = firstActivityByUser.get(uid);
    if (!cur || ts < cur) firstActivityByUser.set(uid, ts);
  };
  for (const a of attempts) recordActivity(a.user_id, a.attempted_at);
  for (const s of solo) recordActivity(s.user_id, s.created_at);
  for (const s of live) {
    recordActivity(s.host_user_id, s.created_at);
    recordActivity(s.guest_user_id, s.created_at);
  }
  for (const s of mcqSessions) recordActivity(s.user_id, s.started_at);

  // Bucket profiles by ISO week of signup
  const cohortMap = new Map<string, { weekStart: string; users: typeof profiles }>();
  for (const p of profiles) {
    if (!p.created_at) continue;
    const wk = isoWeekStart(p.created_at);
    if (!cohortMap.has(wk)) cohortMap.set(wk, { weekStart: wk, users: [] });
    cohortMap.get(wk)!.users.push(p);
  }
  const cohorts = Array.from(cohortMap.values())
    .sort((a, b) => (a.weekStart < b.weekStart ? 1 : -1))
    .slice(0, 8)
    .map(({ weekStart, users }) => {
      const N = users.length;
      let d1 = 0, d7 = 0, d30 = 0;
      for (const u of users) {
        if (!u.created_at) continue;
        const signupMs = Date.parse(u.created_at);
        const signupDate = u.created_at.slice(0, 10);
        // D1: last_active >= signup + 1 day
        const target1 = new Date(signupMs + 1 * DAY_MS).toISOString().slice(0, 10);
        if (u.last_active_date && u.last_active_date >= target1) d1++;
        // D7 / D30: any first activity within window
        const firstAct = firstActivityByUser.get(u.id);
        if (firstAct) {
          const actMs = Date.parse(firstAct);
          // only count post-signup activity (skip same-day signup as D7? we accept >= signup)
          if (actMs >= signupMs && actMs <= signupMs + 7 * DAY_MS && firstAct.slice(0, 10) > signupDate) d7++;
          else if (firstAct.slice(0, 10) === signupDate) {
            // same-day activity also counts as retained for D7 + D30 (they came back same day after signup means engaged)
            d7++;
          }
          if (actMs >= signupMs && actMs <= signupMs + 30 * DAY_MS) d30++;
        }
      }
      return {
        weekStart,
        signups: N,
        d1Pct:  N > 0 ? (d1  / N) * 100 : 0,
        d7Pct:  N > 0 ? (d7  / N) * 100 : 0,
        d30Pct: N > 0 ? (d30 / N) * 100 : 0,
      };
    });

  // ── 3. At-risk users ────────────────────────────────────────────────
  const sevenDaysAgoMs = now - 7 * DAY_MS;
  const atRiskUsers = profiles
    .filter((p) => {
      if (!p.created_at) return false;
      if (Date.parse(p.created_at) > sevenDaysAgoMs) return false;
      if (!!p.stripe_subscription_id) return false;
      const inactive =
        !p.last_active_date ||
        Date.parse(p.last_active_date + "T00:00:00Z") < sevenDaysAgoMs;
      return inactive;
    })
    .map((p) => {
      const lastMs = p.last_active_date ? Date.parse(p.last_active_date + "T00:00:00Z") : null;
      const daysSince = lastMs == null
        ? null
        : Math.floor((now - lastMs) / DAY_MS);
      return {
        id: p.id,
        email: p.email ?? "",
        signedUpDate: p.created_at?.slice(0, 10) ?? "",
        daysSinceActivity: daysSince,
        totalXp: p.total_xp ?? 0,
        founderRank: p.founder_rank,
      };
    })
    .sort((a, b) => {
      // founders first (lowest rank → highest priority), nulls last
      const ar = a.founderRank ?? Number.POSITIVE_INFINITY;
      const br = b.founderRank ?? Number.POSITIVE_INFINITY;
      if (ar !== br) return ar - br;
      return (b.daysSinceActivity ?? 0) - (a.daysSinceActivity ?? 0);
    })
    .slice(0, 10);

  // ── Per-user index maps (used by 4, 5, 6, 8) ────────────────────────
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

  // ── 4. Power users — top 10 by composite score ──────────────────────
  const powerUsers = profiles
    .map((p) => {
      const mcqs = attemptsByUser.get(p.id) ?? 0;
      const so   = soloByUser.get(p.id) ?? 0;
      const li   = liveByUser.get(p.id) ?? 0;
      const sessions = so + li;
      const xp = p.total_xp ?? 0;
      const score = mcqs + sessions * 5 + xp / 100;
      const effectivePlan: "free" | "founder" | "pro" | "enterprise" =
        isPaid(p) && p.plan === "enterprise" ? "enterprise"
        : isPaid(p) ? "pro"
        : isFounderActive(p) ? "founder"
        : "free";
      return {
        id: p.id,
        name: p.full_name ?? p.email?.split("@")[0] ?? "—",
        email: p.email ?? "",
        plan: effectivePlan,
        attempts: mcqs,
        sessions,
        xp,
        streak: p.current_streak ?? 0,
        founderRank: p.founder_rank,
        score,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  // ── 5. Daily activity timeline — last 30 days DAU ───────────────────
  // Build 30 buckets, populate from attempts / solo / mcqSessions activity ts.
  const dauTimeline: { date: string; count: number; userIds: Set<string> }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now - i * DAY_MS).toISOString().slice(0, 10);
    dauTimeline.push({ date: d, count: 0, userIds: new Set() });
  }
  const bucketByDate = new Map(dauTimeline.map((b) => [b.date, b]));
  const bumpDau = (uid: string | null | undefined, ts: string | null | undefined) => {
    if (!uid || !ts) return;
    const day = ts.slice(0, 10);
    const b = bucketByDate.get(day);
    if (b) b.userIds.add(uid);
  };
  for (const a of attempts) bumpDau(a.user_id, a.attempted_at);
  for (const s of solo) bumpDau(s.user_id, s.created_at);
  for (const s of mcqSessions) bumpDau(s.user_id, s.started_at);
  for (const t of dauTimeline) t.count = t.userIds.size;
  const dauTimelineOut = dauTimeline.map(({ date, count }) => ({ date, count }));

  // Trend: avg first half vs second half
  const half = Math.floor(dauTimelineOut.length / 2);
  const avgFirst  = dauTimelineOut.slice(0, half).reduce((s, x) => s + x.count, 0) / Math.max(1, half);
  const avgSecond = dauTimelineOut.slice(half).reduce((s, x) => s + x.count, 0) / Math.max(1, dauTimelineOut.length - half);
  let dauTrend: "up" | "flat" | "down" = "flat";
  if (avgSecond > avgFirst * 1.1) dauTrend = "up";
  else if (avgSecond < avgFirst * 0.9) dauTrend = "down";

  // ── 6. Feature adoption ─────────────────────────────────────────────
  const denom = Math.max(1, totalUsers);
  const adoption = [
    { feature: "AMC MCQ",            users: userIdsWithAttempt.size,   pct: (userIdsWithAttempt.size / denom) * 100 },
    { feature: "Solo RolePlay",      users: userIdsWithSolo.size,      pct: (userIdsWithSolo.size / denom) * 100 },
    { feature: "Live RolePlay (host)", users: userIdsWithLiveHost.size, pct: (userIdsWithLiveHost.size / denom) * 100 },
    { feature: "Help / Tickets",     users: userIdsWithTicket.size,    pct: (userIdsWithTicket.size / denom) * 100 },
  ];

  // ── 7. Hourly engagement heatmap (last 14d, UTC hours 0-23) ─────────
  const hourBuckets: { hour: number; count: number }[] = Array.from({ length: 24 }, (_, h) => ({ hour: h, count: 0 }));
  for (const a of attempts) {
    if (!a.attempted_at || a.attempted_at < since14) continue;
    const h = new Date(a.attempted_at).getUTCHours();
    hourBuckets[h]!.count += 1;
  }
  const peakHourCount = Math.max(...hourBuckets.map((b) => b.count));
  const peakHour = peakHourCount > 0
    ? hourBuckets.findIndex((b) => b.count === peakHourCount)
    : -1;

  // ── Per-user table (top 50 by combined activity) — extended w/ healthScore
  const userRows = profiles.map((p) => {
    const mcqs = attemptsByUser.get(p.id) ?? 0;
    const so   = soloByUser.get(p.id) ?? 0;
    const li   = liveByUser.get(p.id) ?? 0;
    const effectivePlan: "free" | "founder" | "pro" | "enterprise" =
      isPaid(p) && p.plan === "enterprise" ? "enterprise"
      : isPaid(p) ? "pro"
      : isFounderActive(p) ? "founder"
      : "free";

    // ── 8. Health score 0-100
    let health = 0;
    const lastActiveMs = p.last_active_date ? Date.parse(p.last_active_date + "T00:00:00Z") : 0;
    if (lastActiveMs >= now - 7 * DAY_MS) health += 30;
    if ((p.current_streak ?? 0) >= 3) health += 20;
    if ((p.total_xp ?? 0) > 100) health += 20;
    if (userIdsWithCompletedMcqSession.has(p.id)) health += 15;
    const distinctModules =
      (userIdsWithAttempt.has(p.id) ? 1 : 0) +
      (userIdsWithSolo.has(p.id) ? 1 : 0) +
      (userIdsWithLiveHost.has(p.id) ? 1 : 0) +
      (userIdsWithTicket.has(p.id) ? 1 : 0);
    if (distinctModules >= 2) health += 15;

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
      healthScore: health,
    };
  });
  userRows.sort((a, b) => b.totalActivity - a.totalActivity || b.xp - a.xp);

  // ── Daily signups (last 14 days)
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
    activationFunnel: funnelSteps,
    cohorts,
    atRiskUsers,
    powerUsers,
    dauTimeline: dauTimelineOut,
    dauTrend,
    adoption,
    hourly: { buckets: hourBuckets, peakHour },
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
