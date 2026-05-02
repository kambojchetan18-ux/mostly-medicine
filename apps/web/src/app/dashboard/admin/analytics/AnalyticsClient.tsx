"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export interface AnalyticsPayload {
  generatedAt: string;
  totals: {
    users: number;
    signups7d: number;
    signups30d: number;
    dau: number;
    wau: number;
    mau: number;
    mcqAttempts: number;
    mcqAttempts7d: number;
    soloSessions: number;
    soloCompleted: number;
    liveSessions: number;
    liveCompleted: number;
  };
  planSplit: {
    free: number;
    founder: number;
    pro: number;
    enterprise: number;
    admin: number;
  };
  funnel: {
    activatedUsers: number;
    activationRate: number;
    founderTotal: number;
    founderConverted: number;
    founderConvRate: number;
    sessionsStarted: number;
    sessionsCompleted: number;
    completionRate: number;
  };
  dailySignups: { date: string; count: number }[];
  users: Array<{
    id: string;
    email: string;
    name: string;
    plan: "free" | "founder" | "pro" | "enterprise";
    role: string;
    createdAt: string;
    lastActiveDate: string | null;
    mcqAttempts: number;
    soloSessions: number;
    liveSessions: number;
    totalActivity: number;
    xp: number;
    streak: number;
    founderRank: number | null;
    healthScore: number;
  }>;
  activationFunnel: Array<{ label: string; count: number }>;
  cohorts: Array<{
    weekStart: string;
    signups: number;
    d1Pct: number;
    d7Pct: number;
    d30Pct: number;
  }>;
  atRiskUsers: Array<{
    id: string;
    email: string;
    signedUpDate: string;
    daysSinceActivity: number | null;
    totalXp: number;
    founderRank: number | null;
  }>;
  powerUsers: Array<{
    id: string;
    name: string;
    email: string;
    plan: "free" | "founder" | "pro" | "enterprise";
    attempts: number;
    sessions: number;
    xp: number;
    streak: number;
    founderRank: number | null;
    score: number;
  }>;
  dauTimeline: Array<{ date: string; count: number }>;
  dauTrend: "up" | "flat" | "down";
  adoption: Array<{ feature: string; users: number; pct: number }>;
  hourly: {
    buckets: Array<{ hour: number; count: number }>;
    peakHour: number;
  };
}

type SortKey = "totalActivity" | "mcqAttempts" | "soloSessions" | "liveSessions" | "xp" | "streak" | "createdAt" | "lastActiveDate" | "healthScore";

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900 tabular-nums">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-gray-500">{sub}</p>}
    </div>
  );
}

function RatioCard({ label, num, denom, percent, hint }: { label: string; num: number; denom: number; percent: number; hint: string }) {
  const tone = percent >= 50 ? "text-emerald-700" : percent >= 25 ? "text-amber-700" : "text-rose-700";
  const bar  = percent >= 50 ? "bg-emerald-500" : percent >= 25 ? "bg-amber-500" : "bg-rose-500";
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">{label}</p>
      <div className="mt-1 flex items-baseline gap-2">
        <p className={`text-2xl font-bold tabular-nums ${tone}`}>{percent.toFixed(1)}%</p>
        <p className="text-xs text-gray-500 tabular-nums">{num} / {denom}</p>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div className={`h-full ${bar} transition-all`} style={{ width: `${Math.min(100, percent)}%` }} />
      </div>
      <p className="mt-2 text-[11px] text-gray-500">{hint}</p>
    </div>
  );
}

function planBadge(plan: "free" | "founder" | "pro" | "enterprise", founderRank: number | null) {
  if (plan === "enterprise") return <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700">🏢 ENT</span>;
  if (plan === "pro")        return <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">⭐ PRO</span>;
  if (plan === "founder")    return <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-bold text-pink-700">✨ #{founderRank} FOUNDER</span>;
  return <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">FREE</span>;
}

// ── Pure helpers ─────────────────────────────────────────────────────
function pctTone(pct: number) {
  if (pct >= 50) return { bg: "bg-emerald-100", text: "text-emerald-800", bar: "bg-emerald-500" };
  if (pct >= 25) return { bg: "bg-amber-100",   text: "text-amber-800",   bar: "bg-amber-500" };
  return { bg: "bg-rose-100", text: "text-rose-800", bar: "bg-rose-500" };
}

function healthTone(score: number) {
  if (score >= 70) return { text: "text-emerald-700", bar: "bg-emerald-500" };
  if (score >= 40) return { text: "text-amber-700",   bar: "bg-amber-500" };
  return { text: "text-rose-700", bar: "bg-rose-500" };
}

export default function AnalyticsClient({ data }: { data: AnalyticsPayload }) {
  const {
    totals, planSplit, funnel, dailySignups, users,
    activationFunnel, cohorts, atRiskUsers, powerUsers,
    dauTimeline, dauTrend, adoption, hourly,
  } = data;

  const [sortKey, setSortKey]     = useState<SortKey>("totalActivity");
  const [sortDir, setSortDir]     = useState<"asc" | "desc">("desc");
  const [filterPlan, setFilterPlan] = useState<"all" | "free" | "founder" | "pro" | "enterprise">("all");
  const [search, setSearch]       = useState("");

  const filtered = useMemo(() => {
    let rows = users;
    if (filterPlan !== "all") rows = rows.filter((u) => u.plan === filterPlan);
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter((u) => u.email.toLowerCase().includes(q) || u.name.toLowerCase().includes(q));
    }
    const dir = sortDir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const va = (a[sortKey] ?? "") as number | string;
      const vb = (b[sortKey] ?? "") as number | string;
      if (typeof va === "number" && typeof vb === "number") return (va - vb) * dir;
      return String(va).localeCompare(String(vb)) * dir;
    });
  }, [users, filterPlan, search, sortKey, sortDir]);

  const maxDailySignup = Math.max(1, ...dailySignups.map((d) => d.count));
  const maxFunnel      = Math.max(1, ...activationFunnel.map((s) => s.count));
  const maxDau         = Math.max(1, ...dauTimeline.map((d) => d.count));
  const maxAdoption    = Math.max(1, ...adoption.map((a) => a.pct));
  const maxHourly      = Math.max(1, ...hourly.buckets.map((b) => b.count));

  const trendLabel =
    dauTrend === "up"   ? { text: "↑ growing",   tone: "text-emerald-700 bg-emerald-50" }
    : dauTrend === "down" ? { text: "↓ declining", tone: "text-rose-700 bg-rose-50" }
    : { text: "→ flat", tone: "text-gray-700 bg-gray-100" };

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(k); setSortDir("desc"); }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📊 Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Look-to-book funnel, engagement and per-user activity. Refreshed on every load.
          </p>
        </div>
        <Link
          href="/dashboard/admin"
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
        >
          ← Admin home
        </Link>
      </header>

      {/* ── KPI grid ── */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Total users" value={totals.users} sub={`+${totals.signups7d} this week · +${totals.signups30d} this month`} />
        <StatCard label="DAU" value={totals.dau} sub={`WAU ${totals.wau} · MAU ${totals.mau}`} />
        <StatCard label="MCQ attempts" value={totals.mcqAttempts.toLocaleString()} sub={`${totals.mcqAttempts7d.toLocaleString()} in last 7 days`} />
        <StatCard
          label="RolePlay sessions"
          value={(totals.soloSessions + totals.liveSessions).toLocaleString()}
          sub={`Solo ${totals.soloSessions} · Live ${totals.liveSessions}`}
        />
      </section>

      {/* ── Look-to-book ratios ── */}
      <section>
        <h2 className="mb-2 text-sm font-bold text-gray-900">Look-to-book funnel</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <RatioCard
            label="Signup → activated"
            num={funnel.activatedUsers}
            denom={totals.users}
            percent={funnel.activationRate}
            hint="Signed up AND did ≥1 MCQ or RolePlay session."
          />
          <RatioCard
            label="Founder → paid"
            num={funnel.founderConverted}
            denom={funnel.founderTotal}
            percent={funnel.founderConvRate}
            hint="Free founders who later subscribed via Stripe."
          />
          <RatioCard
            label="Session start → completed"
            num={funnel.sessionsCompleted}
            denom={funnel.sessionsStarted}
            percent={funnel.completionRate}
            hint="RolePlay sessions that finished (vs abandoned)."
          />
        </div>
      </section>

      {/* ── Plan split ── */}
      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-bold text-gray-900">Plan distribution</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Free</p>
            <p className="mt-0.5 text-xl font-bold text-gray-900 tabular-nums">{planSplit.free}</p>
          </div>
          <div className="rounded-xl border border-pink-100 bg-pink-50 p-3 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-pink-700">✨ Founder</p>
            <p className="mt-0.5 text-xl font-bold text-pink-900 tabular-nums">{planSplit.founder}</p>
          </div>
          <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-700">⭐ Pro</p>
            <p className="mt-0.5 text-xl font-bold text-amber-900 tabular-nums">{planSplit.pro}</p>
          </div>
          <div className="rounded-xl border border-violet-100 bg-violet-50 p-3 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-violet-700">🏢 Enterprise</p>
            <p className="mt-0.5 text-xl font-bold text-violet-900 tabular-nums">{planSplit.enterprise}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-3 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Admins</p>
            <p className="mt-0.5 text-xl font-bold text-gray-900 tabular-nums">{planSplit.admin}</p>
          </div>
        </div>
      </section>

      {/* ── Daily signups bar chart (last 14 days) ── */}
      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-bold text-gray-900">Daily signups · last 14 days</h2>
        <div className="mt-4 flex h-32 items-end gap-1.5">
          {dailySignups.map((d) => {
            const h = (d.count / maxDailySignup) * 100;
            const tone = d.count === 0 ? "bg-gray-100" : "bg-brand-500";
            return (
              <div key={d.date} className="flex flex-1 flex-col items-center gap-1" title={`${d.date} — ${d.count} signups`}>
                <div className="flex w-full flex-1 items-end">
                  <div
                    className={`w-full rounded-t ${tone}`}
                    style={{ height: `${h}%`, minHeight: d.count > 0 ? "4px" : "0px" }}
                  />
                </div>
                <p className="text-[9px] tabular-nums text-gray-500">{d.date.slice(5)}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 1. Activation funnel ── */}
      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-bold text-gray-900">Activation funnel</h2>
        <p className="mt-0.5 text-xs text-gray-500">From signup → MCQ → RolePlay → Founder/Pro → Paid.</p>
        <div className="mt-4 space-y-2">
          {activationFunnel.map((step, i) => {
            const prev = i === 0 ? null : activationFunnel[i - 1]!.count;
            const widthPct = (step.count / maxFunnel) * 100;
            const drop = prev != null && prev > 0 ? ((prev - step.count) / prev) * 100 : 0;
            const ratioFromTop = activationFunnel[0]!.count > 0
              ? (step.count / activationFunnel[0]!.count) * 100
              : 0;
            const tone = pctTone(ratioFromTop);
            return (
              <div key={step.label} className="space-y-1">
                <div className="flex items-baseline justify-between gap-2 text-xs">
                  <p className="font-semibold text-gray-700">{step.label}</p>
                  <p className="tabular-nums text-gray-500">
                    <span className="font-bold text-gray-800">{step.count}</span>
                    <span className="ml-2">{ratioFromTop.toFixed(1)}% of top</span>
                    {prev != null && (
                      <span className={`ml-2 ${drop > 50 ? "text-rose-600" : drop > 20 ? "text-amber-600" : "text-emerald-600"}`}>
                        {drop > 0 ? `−${drop.toFixed(1)}%` : "—"}
                      </span>
                    )}
                  </p>
                </div>
                <div className="h-6 w-full overflow-hidden rounded-md bg-gray-100">
                  <div
                    className={`flex h-full items-center justify-end pr-2 text-[10px] font-bold text-white ${tone.bar}`}
                    style={{ width: `${Math.max(4, widthPct)}%` }}
                  >
                    {step.count}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 2. Cohort retention table ── */}
      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-bold text-gray-900">Cohort retention · last 8 weeks</h2>
        <p className="mt-0.5 text-xs text-gray-500">Grouped by ISO week of signup. D1 = next-day active. D7/D30 = any activity within window.</p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-[10px] uppercase tracking-wider text-gray-500">
                <th className="px-3 py-2 text-left font-semibold">Week of</th>
                <th className="px-3 py-2 text-right font-semibold">Signups</th>
                <th className="px-3 py-2 text-right font-semibold">D1</th>
                <th className="px-3 py-2 text-right font-semibold">D7</th>
                <th className="px-3 py-2 text-right font-semibold">D30</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {cohorts.length === 0 && (
                <tr><td colSpan={5} className="py-6 text-center text-xs text-gray-400">No cohorts yet.</td></tr>
              )}
              {cohorts.map((c) => {
                const t1  = pctTone(c.d1Pct);
                const t7  = pctTone(c.d7Pct);
                const t30 = pctTone(c.d30Pct);
                return (
                  <tr key={c.weekStart} className="hover:bg-gray-50/60">
                    <td className="px-3 py-2 text-xs font-medium tabular-nums text-gray-700">{c.weekStart}</td>
                    <td className="px-3 py-2 text-right text-xs tabular-nums text-gray-600">{c.signups}</td>
                    <td className="px-3 py-2 text-right">
                      <span className={`inline-block rounded px-2 py-0.5 text-[11px] font-semibold tabular-nums ${t1.bg} ${t1.text}`}>{c.d1Pct.toFixed(0)}%</span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <span className={`inline-block rounded px-2 py-0.5 text-[11px] font-semibold tabular-nums ${t7.bg} ${t7.text}`}>{c.d7Pct.toFixed(0)}%</span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <span className={`inline-block rounded px-2 py-0.5 text-[11px] font-semibold tabular-nums ${t30.bg} ${t30.text}`}>{c.d30Pct.toFixed(0)}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 3. At-risk users ── */}
      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-bold text-gray-900">At-risk users · top 10</h2>
        <p className="mt-0.5 text-xs text-gray-500">Signed up &gt;7d ago, no activity in last 7d, not paid. Founders prioritised first.</p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-[10px] uppercase tracking-wider text-gray-500">
                <th className="px-3 py-2 text-left font-semibold">Email</th>
                <th className="px-3 py-2 text-right font-semibold">Signed up</th>
                <th className="px-3 py-2 text-right font-semibold">Days idle</th>
                <th className="px-3 py-2 text-right font-semibold">XP</th>
                <th className="px-3 py-2 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {atRiskUsers.length === 0 && (
                <tr><td colSpan={5} className="py-6 text-center text-xs text-gray-400">All users active or paid 🎉</td></tr>
              )}
              {atRiskUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/60">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      {u.founderRank != null && (
                        <span className="rounded bg-pink-100 px-1.5 py-0.5 text-[9px] font-bold text-pink-700">✨ #{u.founderRank}</span>
                      )}
                      <span className="text-xs text-gray-700">{u.email}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right text-xs tabular-nums text-gray-500">{u.signedUpDate}</td>
                  <td className="px-3 py-2 text-right text-xs tabular-nums">
                    <span className={`font-semibold ${u.daysSinceActivity == null ? "text-rose-700" : u.daysSinceActivity > 30 ? "text-rose-700" : "text-amber-700"}`}>
                      {u.daysSinceActivity == null ? "Never" : `${u.daysSinceActivity}d`}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right text-xs tabular-nums text-gray-700">{u.totalXp}</td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      disabled
                      className="cursor-not-allowed rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-[10px] font-semibold text-gray-500"
                      title="Re-engagement email coming soon"
                    >
                      ✉️ Email re-engagement
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 4. Power users ── */}
      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-bold text-gray-900">Power users · top 10</h2>
        <p className="mt-0.5 text-xs text-gray-500">Composite = attempts + 5×sessions + xp/100.</p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-[10px] uppercase tracking-wider text-gray-500">
                <th className="px-3 py-2 text-left font-semibold">User</th>
                <th className="px-3 py-2 text-left font-semibold">Plan</th>
                <th className="px-3 py-2 text-right font-semibold">Attempts</th>
                <th className="px-3 py-2 text-right font-semibold">Sessions</th>
                <th className="px-3 py-2 text-right font-semibold">XP</th>
                <th className="px-3 py-2 text-right font-semibold">🔥</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {powerUsers.length === 0 && (
                <tr><td colSpan={6} className="py-6 text-center text-xs text-gray-400">No activity yet.</td></tr>
              )}
              {powerUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/60">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      {u.founderRank != null && <span className="text-xs">✨</span>}
                      <div>
                        <p className="text-xs font-medium text-gray-800">{u.name}</p>
                        <p className="text-[10px] text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">{planBadge(u.plan, u.founderRank)}</td>
                  <td className="px-3 py-2 text-right text-xs tabular-nums text-gray-700">{u.attempts}</td>
                  <td className="px-3 py-2 text-right text-xs tabular-nums text-gray-700">{u.sessions}</td>
                  <td className="px-3 py-2 text-right text-xs tabular-nums text-gray-700">{u.xp}</td>
                  <td className="px-3 py-2 text-right text-xs tabular-nums text-gray-700">{u.streak}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 5. Daily activity timeline ── */}
      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-gray-900">DAU · last 30 days</h2>
            <p className="mt-0.5 text-xs text-gray-500">Distinct users active in attempts, MCQ sessions or solo RolePlay.</p>
          </div>
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${trendLabel.tone}`}>
            {trendLabel.text}
          </span>
        </div>
        <div className="mt-4 flex h-24 items-end gap-1">
          {dauTimeline.map((d) => {
            const h = (d.count / maxDau) * 100;
            const tone = d.count === 0 ? "bg-gray-100" : "bg-brand-500";
            return (
              <div key={d.date} className="flex flex-1 flex-col items-center" title={`${d.date} — ${d.count} active`}>
                <div className="flex w-full flex-1 items-end">
                  <div
                    className={`w-full rounded-t ${tone}`}
                    style={{ height: `${h}%`, minHeight: d.count > 0 ? "3px" : "0px" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-1 flex justify-between text-[9px] tabular-nums text-gray-400">
          <span>{dauTimeline[0]?.date.slice(5)}</span>
          <span>{dauTimeline[dauTimeline.length - 1]?.date.slice(5)}</span>
        </div>
      </section>

      {/* ── 6. Feature adoption ── */}
      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-bold text-gray-900">Feature adoption</h2>
        <p className="mt-0.5 text-xs text-gray-500">% of all users who tried each module at least once.</p>
        <div className="mt-3 space-y-2.5">
          {adoption.map((a) => {
            const widthPct = (a.pct / Math.max(maxAdoption, 1)) * 100;
            const tone = pctTone(a.pct);
            return (
              <div key={a.feature}>
                <div className="flex items-baseline justify-between text-xs">
                  <p className="font-medium text-gray-700">{a.feature}</p>
                  <p className="tabular-nums text-gray-500">
                    <span className="font-bold text-gray-800">{a.users}</span>
                    <span className="ml-2">{a.pct.toFixed(1)}%</span>
                  </p>
                </div>
                <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <div className={`h-full ${tone.bar} transition-all`} style={{ width: `${widthPct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 7. Hourly engagement heatmap ── */}
      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-bold text-gray-900">Hourly engagement · last 14 days (UTC)</h2>
        <p className="mt-0.5 text-xs text-gray-500">
          MCQ attempts by UTC hour. Peak: <span className="font-bold text-gray-700">{hourly.peakHour < 0 ? "—" : `${String(hourly.peakHour).padStart(2, "0")}:00`}</span>. Best window for transactional emails.
        </p>
        <div className="mt-3 flex h-20 items-end gap-1">
          {hourly.buckets.map((b) => {
            const h = (b.count / maxHourly) * 100;
            const isPeak = b.hour === hourly.peakHour && b.count > 0;
            const tone = b.count === 0 ? "bg-gray-100" : isPeak ? "bg-emerald-500" : "bg-brand-300";
            return (
              <div key={b.hour} className="flex flex-1 flex-col items-center gap-1" title={`${String(b.hour).padStart(2, "0")}:00 UTC — ${b.count} attempts`}>
                <div className="flex w-full flex-1 items-end">
                  <div
                    className={`w-full rounded-t ${tone}`}
                    style={{ height: `${h}%`, minHeight: b.count > 0 ? "2px" : "0px" }}
                  />
                </div>
                {b.hour % 3 === 0 && (
                  <p className="text-[9px] tabular-nums text-gray-400">{String(b.hour).padStart(2, "0")}</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Per-user activity table (extended w/ Health column) ── */}
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 p-4">
          <h2 className="text-sm font-bold text-gray-900">User activity · top {users.length}</h2>
          <div className="flex items-center gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or email…"
              className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value as typeof filterPlan)}
              className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All plans</option>
              <option value="free">Free</option>
              <option value="founder">Founder</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <th className="px-4 py-2.5 text-left font-semibold">User</th>
                <th className="px-3 py-2.5 text-left font-semibold">Plan</th>
                <th className="cursor-pointer px-3 py-2.5 text-right font-semibold hover:text-gray-700" onClick={() => toggleSort("createdAt")}>Joined</th>
                <th className="cursor-pointer px-3 py-2.5 text-right font-semibold hover:text-gray-700" onClick={() => toggleSort("lastActiveDate")}>Last active</th>
                <th className="cursor-pointer px-3 py-2.5 text-right font-semibold hover:text-gray-700" onClick={() => toggleSort("mcqAttempts")}>MCQs</th>
                <th className="cursor-pointer px-3 py-2.5 text-right font-semibold hover:text-gray-700" onClick={() => toggleSort("soloSessions")}>Solo</th>
                <th className="cursor-pointer px-3 py-2.5 text-right font-semibold hover:text-gray-700" onClick={() => toggleSort("liveSessions")}>Live</th>
                <th className="cursor-pointer px-3 py-2.5 text-right font-semibold hover:text-gray-700" onClick={() => toggleSort("xp")}>XP</th>
                <th className="cursor-pointer px-3 py-2.5 text-right font-semibold hover:text-gray-700" onClick={() => toggleSort("streak")}>🔥</th>
                <th className="cursor-pointer px-3 py-2.5 text-right font-semibold hover:text-gray-700" onClick={() => toggleSort("healthScore")}>Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((u) => {
                const ht = healthTone(u.healthScore);
                return (
                  <tr key={u.id} className="hover:bg-gray-50/60">
                    <td className="px-4 py-2.5">
                      <p className="font-medium text-gray-800">{u.name}</p>
                      <p className="text-[11px] text-gray-400">{u.email}</p>
                    </td>
                    <td className="px-3 py-2.5">{planBadge(u.plan, u.founderRank)}</td>
                    <td className="px-3 py-2.5 text-right text-xs text-gray-500 tabular-nums">{u.createdAt.slice(0, 10)}</td>
                    <td className="px-3 py-2.5 text-right text-xs text-gray-500 tabular-nums">{u.lastActiveDate ?? "—"}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{u.mcqAttempts}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{u.soloSessions}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{u.liveSessions}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{u.xp}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{u.streak}</td>
                    <td className="px-3 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className={`text-xs font-semibold tabular-nums ${ht.text}`}>{u.healthScore}</span>
                        <div className="h-1.5 w-12 overflow-hidden rounded-full bg-gray-100">
                          <div className={`h-full ${ht.bar}`} style={{ width: `${u.healthScore}%` }} />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="py-12 text-center text-sm text-gray-400">No users match your filter.</p>
          )}
        </div>
      </section>

      <p className="text-center text-[10px] text-gray-400">
        Generated {new Date(data.generatedAt).toLocaleString("en-AU")} · top 50 users by activity
      </p>
    </div>
  );
}
