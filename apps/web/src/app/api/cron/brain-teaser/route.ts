import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { runChat } from "@mostly-medicine/ai";
import { sendBranded, newUnsubToken } from "@/lib/email";

// Daily AMC Brain Teaser email cron.
//
// Generates one AMC clinical brain-teaser for a deterministically rotated
// specialty (dayOfYear % 14), renders it into a branded HTML body, and sends
// it via Resend to every opted-in user_profiles row whose
// brain_teaser_last_sent_at is older than 20 hours (or NULL).
//
// Triggered by Vercel Cron via vercel.json — see crons entry. Auth model
// matches /api/health-keepalive: if CRON_SECRET is set, require Bearer token;
// otherwise allow (so the cron can be wired before the secret is added).

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

const SPECIALTIES = [
  "Cardiology",
  "Respiratory & Sleep",
  "Gastroenterology",
  "Endocrine & Metabolic",
  "Renal & Urinary",
  "Hematology & Oncology",
  "Infectious Diseases",
  "Neurology",
  "Psychiatry",
  "Dermatology",
  "Musculoskeletal & Rheumatology",
  "Obstetrics & Gynaecology",
  "Paediatrics",
  "Emergency Presentations",
] as const;

type Specialty = (typeof SPECIALTIES)[number];

interface Teaser {
  topic: string;
  definition_bullets: string[];
  classification_bullets: string[];
  key_points_bullets: string[];
  treatment_bullets: string[];
  amc_key_point: string;
  challenge_question: string;
  challenge_answer_short: string;
  challenge_answer_explanation: string;
}

interface Recipient {
  id: string;
  email: string;
  full_name: string | null;
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function dayOfYear(d: Date): number {
  const start = Date.UTC(d.getUTCFullYear(), 0, 0);
  const now = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  return Math.floor((now - start) / 86_400_000);
}

function pickSpecialty(d: Date): Specialty {
  return SPECIALTIES[dayOfYear(d) % SPECIALTIES.length] as Specialty;
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string" && x.length > 0);
}

function parseTeaser(raw: string): Teaser | null {
  // Strip accidental code fences if the model snuck them in.
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object") return null;
  const o = parsed as Record<string, unknown>;
  if (typeof o.topic !== "string" || o.topic.length === 0) return null;
  if (!isStringArray(o.definition_bullets)) return null;
  if (!isStringArray(o.classification_bullets)) return null;
  if (!isStringArray(o.key_points_bullets)) return null;
  if (!isStringArray(o.treatment_bullets)) return null;
  if (typeof o.amc_key_point !== "string" || o.amc_key_point.length === 0) return null;
  if (typeof o.challenge_question !== "string" || o.challenge_question.length === 0) return null;
  if (typeof o.challenge_answer_short !== "string" || o.challenge_answer_short.length === 0) return null;
  if (typeof o.challenge_answer_explanation !== "string" || o.challenge_answer_explanation.length === 0) return null;
  return {
    topic: o.topic,
    definition_bullets: o.definition_bullets,
    classification_bullets: o.classification_bullets,
    key_points_bullets: o.key_points_bullets,
    treatment_bullets: o.treatment_bullets,
    amc_key_point: o.amc_key_point,
    challenge_question: o.challenge_question,
    challenge_answer_short: o.challenge_answer_short,
    challenge_answer_explanation: o.challenge_answer_explanation,
  };
}

async function generateTeaser(specialty: Specialty): Promise<Teaser | null> {
  const system = `You are an AMC examiner-grade clinical content writer for International Medical Graduates preparing for the Australian Medical Council exams.

You write tight, exam-accurate teasers that match the AMC's expectations: Australian guidelines (eTG, RACGP, PBS), Australian context (rural/remote, Indigenous health, Medicare), and clean clinical reasoning. No fluff, no disclaimers, no marketing voice.

You ALWAYS reply with a single JSON object — no prose, no markdown fences, no commentary.

Schema:
{
  "topic": string — specific condition within the specialty (e.g. "Acute coronary syndrome — STEMI vs NSTEMI"),
  "definition_bullets": string[3..5],
  "classification_bullets": string[2..4],
  "key_points_bullets": string[4..6] — Australian context where applicable,
  "treatment_bullets": string[3..6] — eTG/PBS-aligned,
  "amc_key_point": string — single sentence,
  "challenge_question": string,
  "challenge_answer_short": string — 1 sentence,
  "challenge_answer_explanation": string — ≤80 words
}

Each bullet ≤14 words. Clinically accurate. Australian context throughout.`;

  const user = `Generate today's AMC Brain Teaser for ${specialty}. Keep all bullets concise (≤14 words each), Australian-context-aware (mention PBS / eTG / RACGP where relevant), and clinically accurate. Do NOT include disclaimers or filler. Return ONLY the JSON object — no prose, no markdown fences.`;

  const result = await runChat({
    useCase: "content_draft",
    system,
    messages: [{ role: "user", content: user }],
    maxTokens: 1500,
    cacheSystem: true,
    temperature: 0.4,
  });

  return parseTeaser(result.text);
}

function bulletList(items: string[]): string {
  return `<ul style="margin:0;padding-left:18px;font-size:14px;line-height:1.7;color:#334155;">${items
    .map((b) => `<li>${b}</li>`)
    .join("")}</ul>`;
}

function section(title: string, bgColor: string, borderColor: string, inner: string): string {
  return `<div style="margin:14px 0;padding:14px 16px;border-radius:10px;background:${bgColor};border:1px solid ${borderColor};">
    <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:0.04em;">${title}</p>
    ${inner}
  </div>`;
}

function renderBody(args: { teaser: Teaser; specialty: Specialty; firstName: string }): string {
  const { teaser, specialty, firstName } = args;
  const safeName = escape(firstName);
  // teaser strings are server-trusted (our own prompt) — no escape required.
  return `
    <div style="text-align:center;margin:0 0 6px;">
      <h1 style="margin:0;font-size:26px;font-weight:800;color:#0f172a;letter-spacing:-0.01em;">
        🩺 Mostly Daily
      </h1>
      <p style="margin:6px 0 0;font-size:13px;font-weight:600;color:#7c3aed;text-transform:uppercase;letter-spacing:0.06em;">
        ${specialty}
      </p>
    </div>

    <p style="margin:22px 0 6px;font-size:16px;font-weight:600;color:#0f172a;">G&apos;day ${safeName},</p>
    <p style="margin:0 0 18px;font-size:14px;line-height:1.6;color:#334155;">
      Time to challenge your clinical thinking with today&apos;s brain teaser!
    </p>

    <h2 style="margin:18px 0 6px;font-size:20px;font-weight:700;color:#0f766e;line-height:1.3;">
      ${teaser.topic}
    </h2>

    ${section("Definition", "#f0fdfa", "#99f6e4", bulletList(teaser.definition_bullets))}
    ${section("Classification", "#eff6ff", "#bfdbfe", bulletList(teaser.classification_bullets))}
    ${section("Key Points (Australian context)", "#faf5ff", "#e9d5ff", bulletList(teaser.key_points_bullets))}
    ${section("Treatment (eTG / PBS-aligned)", "#ecfdf5", "#a7f3d0", bulletList(teaser.treatment_bullets))}

    <div style="margin:18px 0;padding:14px 16px;border-radius:10px;background:#fef9c3;border:1px solid #fde68a;">
      <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#854d0e;text-transform:uppercase;letter-spacing:0.04em;">
        AMC Key Point
      </p>
      <p style="margin:0;font-size:14px;line-height:1.6;color:#713f12;font-weight:600;">
        ${teaser.amc_key_point}
      </p>
    </div>

    <div style="margin:22px 0 14px;padding:16px 18px;border-radius:12px;background:#0f172a;color:#f8fafc;">
      <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#a5f3fc;text-transform:uppercase;letter-spacing:0.06em;">
        Quick Challenge
      </p>
      <p style="margin:0 0 10px;font-size:15px;line-height:1.6;color:#f8fafc;font-weight:600;">
        ${teaser.challenge_question}
      </p>
      <details style="margin:8px 0 0;">
        <summary style="cursor:pointer;font-size:13px;font-weight:600;color:#a5f3fc;">Show answer</summary>
        <p style="margin:10px 0 6px;font-size:14px;line-height:1.6;color:#f8fafc;font-weight:600;">
          ${teaser.challenge_answer_short}
        </p>
        <p style="margin:0;font-size:13px;line-height:1.6;color:#cbd5e1;">
          ${teaser.challenge_answer_explanation}
        </p>
      </details>
    </div>

    <div style="text-align:center;margin:24px 0 8px;">
      <a href="https://mostlymedicine.com/dashboard/cat1" style="display:inline-block;padding:12px 22px;border-radius:10px;background:#0f766e;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;">
        Explore More on Mostly Medicine &rarr;
      </a>
    </div>

    <p style="margin:22px 0 0;font-size:13px;line-height:1.6;color:#64748b;font-style:italic;text-align:center;">
      Sharpen your clinical thinking every day.
    </p>
  `;
}

interface BrainTeaserOk {
  ok: true;
  specialty: Specialty;
  topic: string;
  sent: number;
  failed: number;
  skipped: number;
}

interface BrainTeaserErr {
  ok: false;
  error: string;
}

function service() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

export async function GET(
  req: NextRequest
): Promise<NextResponse<BrainTeaserOk | BrainTeaserErr>> {
  try {
    const secret = process.env.CRON_SECRET;
    const auth = req.headers.get("authorization");
    if (!secret || auth !== `Bearer ${secret}`) {
      return NextResponse.json<BrainTeaserErr>(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("[brain-teaser] missing Supabase env vars");
      return NextResponse.json<BrainTeaserErr>(
        { ok: false, error: "supabase_env_missing" },
        { status: 500 }
      );
    }

    const today = new Date();
    const specialty = pickSpecialty(today);

    const teaser = await generateTeaser(specialty);
    if (!teaser) {
      console.error("[brain-teaser] AI parse failed for specialty", specialty);
      return NextResponse.json<BrainTeaserErr>(
        { ok: false, error: "ai_parse_failed" },
        { status: 500 }
      );
    }

    const sb = service();

    const cutoff = new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString();
    const { data: rowsRaw, error: queryErr } = await sb
      .from("user_profiles")
      .select("id, email, full_name, brain_teaser_last_sent_at")
      .eq("email_marketing_opt_in", true)
      .not("email", "is", null)
      .or(`brain_teaser_last_sent_at.is.null,brain_teaser_last_sent_at.lt.${cutoff}`)
      .limit(500);

    if (queryErr) {
      console.error("[brain-teaser] recipient query failed:", queryErr.message);
      return NextResponse.json<BrainTeaserErr>(
        { ok: false, error: queryErr.message },
        { status: 500 }
      );
    }

    const recipients: Recipient[] = (rowsRaw ?? [])
      .map((r) => r as { id: string; email: string | null; full_name: string | null })
      .filter((r): r is Recipient => typeof r.email === "string" && r.email.length > 0)
      .map((r) => ({ id: r.id, email: r.email, full_name: r.full_name }));

    if (recipients.length === 0) {
      console.log("[brain-teaser] no recipients");
      return NextResponse.json<BrainTeaserOk>({
        ok: true,
        specialty,
        topic: teaser.topic,
        sent: 0,
        failed: 0,
        skipped: 0,
      });
    }

    const origin = req.headers.get("origin") ?? new URL(req.url).origin;
    const subject = `🩺 Mostly Daily — ${specialty}`;

    let sent = 0;
    let failed = 0;
    let skipped = 0;

    for (const rec of recipients) {
      try {
        const firstName = (() => {
          const full = rec.full_name?.trim();
          if (!full) return "doctor";
          const first = full.split(/\s+/)[0];
          return first || "doctor";
        })();

        const token = newUnsubToken();
        const { error: tokenErr } = await sb
          .from("email_unsub_tokens")
          .insert({ token, user_id: rec.id });
        if (tokenErr) {
          console.error(
            "[brain-teaser] token insert failed for",
            rec.id,
            tokenErr.message
          );
          failed++;
          continue;
        }

        const unsubscribeUrl = `${origin}/api/email/unsubscribe?token=${token}`;
        const bodyHtml = renderBody({ teaser, specialty, firstName });

        const result = await sendBranded({
          to: rec.email,
          subject,
          bodyHtml,
          unsubscribeUrl,
          preheader: teaser.topic,
        });

        if (!result.ok) {
          if (result.skipped) {
            skipped++;
          } else {
            console.error("[brain-teaser] send failed for", rec.email, result.error);
            failed++;
          }
        } else {
          sent++;
          const { error: stampErr } = await sb
            .from("user_profiles")
            .update({ brain_teaser_last_sent_at: new Date().toISOString() })
            .eq("id", rec.id);
          if (stampErr) {
            console.error("[brain-teaser] stamp failed for", rec.id, stampErr.message);
          }
        }
      } catch (innerErr) {
        const msg = innerErr instanceof Error ? innerErr.message : "unknown_error";
        console.error("[brain-teaser] loop error for", rec.email, msg);
        failed++;
      }

      // Pace to ~8/sec — safely under Resend free tier's 10/sec cap.
      await sleep(120);
    }

    return NextResponse.json<BrainTeaserOk>({
      ok: true,
      specialty,
      topic: teaser.topic,
      sent,
      failed,
      skipped,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown_error";
    console.error("[brain-teaser] unhandled error:", msg);
    return NextResponse.json<BrainTeaserErr>({ ok: false, error: msg }, { status: 500 });
  }
}
