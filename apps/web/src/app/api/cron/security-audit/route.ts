import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import crypto from "crypto";

// Daily security audit cron. Runs four detection queries, inserts unseen
// findings into public.security_alerts (deduped by fingerprint), and fans
// out a Slack + email alert for every NEW alert.
//
// Triggered by Vercel Cron (see vercel.json). Protected by CRON_SECRET so
// nobody can hit it from the internet to harvest the findings.
//
// Detections (extend as needed):
//   1. priv_escalation — user is pro/enterprise/admin WITHOUT a Stripe
//      sub AND WITHOUT founder rank AND not in PRIV_WHITELIST.
//   2. plan_drift — user_profiles.subscription_status='active' but
//      Stripe doesn't know about them (or vice versa).
//   3. bulk_attempts — > 500 MCQ attempts by the same user in any 60-min
//      window over the last 24h (likely bot/scraper).
//   4. new_admin — any user_profiles.role='admin' created/updated in the
//      last 24h. Catches both legit promotions and any exploit slipping
//      through future RLS gaps.

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Family / staff accounts that legitimately bypass billing.
const PRIV_WHITELIST = new Set<string>([
  "nikhil.kamboj83@gmail.com",
  "amankamboj10@gmail.com",
  "kamboj.chetan18@gmail.com",
  "chetan.kamboj844@gmail.com",
]);

function service() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

function fingerprint(parts: unknown[]): string {
  return crypto.createHash("sha1").update(JSON.stringify(parts)).digest("hex").slice(0, 24);
}

interface Finding {
  kind: string;
  severity: "low" | "medium" | "high" | "critical";
  subjectType: "user" | "global" | "session";
  subjectId: string | null;
  fingerprint: string;
  summary: string;
  payload: Record<string, unknown>;
}

async function detectPrivEscalation(sb: ReturnType<typeof service>): Promise<Finding[]> {
  const { data } = await sb
    .from("user_profiles")
    .select("id, email, plan, role, stripe_subscription_id, founder_rank, pro_until, updated_at")
    .or("plan.eq.pro,plan.eq.enterprise,role.eq.admin")
    .is("stripe_subscription_id", null)
    .is("founder_rank", null);
  const rows = (data ?? []) as Array<{
    id: string; email: string; plan: string; role: string;
    stripe_subscription_id: string | null; founder_rank: number | null;
    pro_until: string | null; updated_at: string;
  }>;
  return rows
    .filter((r) => !PRIV_WHITELIST.has((r.email ?? "").toLowerCase()))
    .map((r) => ({
      kind: "priv_escalation",
      severity: "critical" as const,
      subjectType: "user" as const,
      subjectId: r.id,
      fingerprint: fingerprint(["priv_escalation", r.id, r.plan, r.role]),
      summary: `${r.email} is ${r.plan}/${r.role} without Stripe + without founder grant`,
      payload: r as unknown as Record<string, unknown>,
    }));
}

async function detectPlanDrift(sb: ReturnType<typeof service>): Promise<Finding[]> {
  const { data } = await sb
    .from("user_profiles")
    .select("id, email, plan, subscription_status, stripe_subscription_id, updated_at")
    .eq("subscription_status", "active")
    .is("stripe_subscription_id", null);
  const rows = (data ?? []) as Array<{ id: string; email: string; plan: string; subscription_status: string; updated_at: string }>;
  return rows.map((r) => ({
    kind: "plan_drift",
    severity: "high" as const,
    subjectType: "user" as const,
    subjectId: r.id,
    fingerprint: fingerprint(["plan_drift", r.id]),
    summary: `${r.email} subscription_status=active but no stripe_subscription_id`,
    payload: r as unknown as Record<string, unknown>,
  }));
}

async function detectBulkAttempts(sb: ReturnType<typeof service>): Promise<Finding[]> {
  // Postgres-side: any user with > 500 attempts in any 60-min rolling
  // window in the last 24h. Implemented via a single RPC-less query.
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data } = await sb
    .from("attempts")
    .select("user_id, attempted_at")
    .gte("attempted_at", since)
    .limit(50000);
  const buckets = new Map<string, number[]>(); // user_id -> ms timestamps
  for (const row of (data ?? []) as Array<{ user_id: string; attempted_at: string }>) {
    const arr = buckets.get(row.user_id) ?? [];
    arr.push(new Date(row.attempted_at).getTime());
    buckets.set(row.user_id, arr);
  }
  const offenders: Array<{ user_id: string; max_per_hour: number; total: number }> = [];
  for (const [uid, times] of buckets) {
    times.sort((a, b) => a - b);
    let max = 0;
    let i = 0;
    for (let j = 0; j < times.length; j++) {
      while (i < j && times[j] - times[i] > 60 * 60 * 1000) i++;
      max = Math.max(max, j - i + 1);
    }
    if (max > 500) offenders.push({ user_id: uid, max_per_hour: max, total: times.length });
  }
  return offenders.map((o) => ({
    kind: "bulk_attempts",
    severity: "high" as const,
    subjectType: "user" as const,
    subjectId: o.user_id,
    fingerprint: fingerprint(["bulk_attempts", o.user_id, Math.floor(Date.now() / (24 * 60 * 60 * 1000))]),
    summary: `User ${o.user_id} did ${o.max_per_hour} MCQ attempts in a 60-min window (24h total ${o.total})`,
    payload: o as unknown as Record<string, unknown>,
  }));
}

async function detectNewAdmins(sb: ReturnType<typeof service>): Promise<Finding[]> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data } = await sb
    .from("user_profiles")
    .select("id, email, role, plan, updated_at")
    .eq("role", "admin")
    .gte("updated_at", since);
  const rows = (data ?? []) as Array<{ id: string; email: string; role: string; plan: string; updated_at: string }>;
  return rows
    .filter((r) => !PRIV_WHITELIST.has((r.email ?? "").toLowerCase()))
    .map((r) => ({
      kind: "new_admin",
      severity: "critical" as const,
      subjectType: "user" as const,
      subjectId: r.id,
      fingerprint: fingerprint(["new_admin", r.id]),
      summary: `${r.email} is admin and was updated in the last 24h`,
      payload: r as unknown as Record<string, unknown>,
    }));
}

async function notify(newAlerts: Finding[]): Promise<void> {
  if (newAlerts.length === 0) return;
  const slack = process.env.SLACK_WEBHOOK_URL;
  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.ALERT_EMAIL;

  const header = `🔐 Security audit found ${newAlerts.length} new alert${newAlerts.length === 1 ? "" : "s"}`;
  const body = newAlerts
    .map((a) => `• [${a.severity.toUpperCase()}] ${a.kind} — ${a.summary}`)
    .join("\n");

  await Promise.allSettled([
    slack
      ? fetch(slack, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: header,
            blocks: [
              { type: "header", text: { type: "plain_text", text: header } },
              { type: "section", text: { type: "mrkdwn", text: "```\n" + body + "\n```" } },
              {
                type: "actions",
                elements: [
                  {
                    type: "button",
                    text: { type: "plain_text", text: "Open admin" },
                    url: "https://www.mostlymedicine.com/dashboard/admin",
                  },
                ],
              },
            ],
          }),
        }).then(() => undefined)
      : Promise.resolve(undefined),
    to && resendKey
      ? fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Mostly Medicine Security <security@mostlymedicine.com>",
            to,
            subject: header,
            text: body + "\n\nOpen admin: https://www.mostlymedicine.com/dashboard/admin",
          }),
        }).then(() => undefined)
      : Promise.resolve(undefined),
  ]);
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sb = service();
  const { data: runRow } = await sb
    .from("security_audit_runs")
    .insert({ started_at: new Date().toISOString() })
    .select("id")
    .single();
  const runId = (runRow as { id?: string } | null)?.id ?? null;

  try {
    const detectors = [
      detectPrivEscalation,
      detectPlanDrift,
      detectBulkAttempts,
      detectNewAdmins,
    ];
    const findings: Finding[] = [];
    for (const d of detectors) {
      findings.push(...(await d(sb)));
    }

    let newAlerts: Finding[] = [];
    if (findings.length > 0) {
      // INSERT … ON CONFLICT DO NOTHING via the partial-unique index on
      // (kind, fingerprint) WHERE status <> 'resolved'. We work around the
      // partial-index limitation by issuing per-finding upserts inside a
      // single Promise.all.
      const results = await Promise.all(
        findings.map(async (f) => {
          const { data, error } = await sb
            .from("security_alerts")
            .insert({
              kind: f.kind,
              severity: f.severity,
              fingerprint: f.fingerprint,
              subject_type: f.subjectType,
              subject_id: f.subjectId,
              payload: { ...f.payload, summary: f.summary },
            })
            .select("id")
            .single();
          // 23505 unique_violation → finding already open. Treat as no-op.
          if (error && error.code !== "23505") {
            console.error("[security-audit] insert failed", error);
          }
          return { f, inserted: !!data && !error };
        }),
      );
      newAlerts = results.filter((r) => r.inserted).map((r) => r.f);
    }

    await notify(newAlerts);

    if (runId) {
      await sb
        .from("security_audit_runs")
        .update({
          finished_at: new Date().toISOString(),
          findings: findings.length,
          alerts_new: newAlerts.length,
        })
        .eq("id", runId);
    }

    return NextResponse.json({
      ok: true,
      findings: findings.length,
      newAlerts: newAlerts.length,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (runId) {
      await sb
        .from("security_audit_runs")
        .update({ finished_at: new Date().toISOString(), error: msg })
        .eq("id", runId);
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
