import { NextRequest, NextResponse } from "next/server";
import { sendBranded, newUnsubToken } from "@/lib/email";
import { buildWelcomeEmail } from "@/lib/email-templates";

// Tiny no-AI test route — fires a sample branded email to ALERT_EMAIL
// (Chetan's inbox). Used to verify Resend + brandedShell render correctly
// before the DeepSeek balance is topped up. Auth: optional CRON_SECRET
// bearer; open if unset.
export const maxDuration = 30;

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const to = process.env.ALERT_EMAIL ?? "kamboj.chetan18@gmail.com";

  const origin = req.headers.get("origin") ?? new URL(req.url).origin;
  const token = newUnsubToken();
  const fromOverride = undefined;
  // For a one-off test we don't bother persisting the unsub token — the
  // unsubscribe route just renders an "expired link" page if clicked, which
  // is fine for the test recipient.
  const unsubscribeUrl = `${origin}/api/email/unsubscribe?token=${token}`;

  const bodyHtml = `
    <h2 style="margin:0 0 12px;font-size:24px;color:#0f172a;">🩺 Mostly Daily</h2>
    <p style="margin:0 0 18px;font-size:14px;color:#64748b;">Cardiology</p>

    <p style="margin:0 0 16px;font-size:15px;color:#0f172a;">G'day Chetan,</p>
    <p style="margin:0 0 18px;font-size:14px;color:#334155;line-height:1.6;">
      Time to challenge your clinical thinking with today's brain teaser!
    </p>

    <h3 style="margin:0 0 10px;font-size:18px;color:#0f766e;">Acute Coronary Syndrome — STEMI vs NSTEMI</h3>

    <div style="border-left:4px solid #7c3aed;padding:8px 14px;background:#f8fafc;border-radius:8px;margin:0 0 18px;">
      <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#0f172a;">Definition</p>
      <ul style="margin:0;padding-left:20px;font-size:13px;color:#334155;line-height:1.7;">
        <li>STEMI: ST elevation ≥1 mm in 2 contiguous limb leads or ≥2 mm precordial</li>
        <li>NSTEMI: troponin rise + ischaemic symptoms, no ST elevation</li>
        <li>Unstable angina: ischaemic symptoms, normal troponin</li>
      </ul>
    </div>

    <div style="border-left:4px solid #7c3aed;padding:8px 14px;background:#f8fafc;border-radius:8px;margin:0 0 18px;">
      <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#0f172a;">Australian context</p>
      <ul style="margin:0;padding-left:20px;font-size:13px;color:#334155;line-height:1.7;">
        <li>Aspirin 300 mg loading + ticagrelor 180 mg (eTG: Cardiovascular)</li>
        <li>STEMI: PCI within 90 min if Cath lab available, fibrinolysis if &gt; 120 min</li>
        <li>Door-to-balloon target ≤ 90 minutes</li>
        <li>HSF assessment, GRACE risk score for NSTEMI triage</li>
      </ul>
    </div>

    <div style="background:#fef3c7;border:1px solid #fbbf24;border-radius:12px;padding:14px;margin:0 0 18px;">
      <p style="margin:0;font-size:12px;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:0.05em;">AMC Key Point</p>
      <p style="margin:6px 0 0;font-size:13px;color:#78350f;line-height:1.6;">
        Posterior MI can present with ST depression in V1–V3 — get a posterior lead ECG (V7–V9) before discharging suspected ischaemia with "non-diagnostic" anterior leads.
      </p>
    </div>

    <details style="margin:0 0 18px;border:1px solid #e2e8f0;border-radius:12px;padding:12px 16px;">
      <summary style="cursor:pointer;font-size:14px;font-weight:700;color:#0f766e;">Quick Challenge — show answer</summary>
      <p style="margin:10px 0 4px;font-size:13px;font-weight:600;color:#0f172a;">
        Q: A 62-year-old presents with retrosternal chest pain. ECG shows 2 mm ST depression V1–V3. Trop I rising. What single test would change your management?
      </p>
      <p style="margin:0 0 4px;font-size:13px;color:#334155;line-height:1.6;">
        A: Posterior leads (V7–V9). ST depression V1–V3 with rising trop is the mirror image of a posterior STEMI. Posterior leads showing ≥0.5 mm elevation flips this from "NSTEMI for medical management" to "STEMI for urgent reperfusion".
      </p>
    </details>

    <p style="margin:0 0 6px;font-size:14px;color:#0f172a;">
      <a href="https://mostlymedicine.com/dashboard/cat1" style="color:#0f766e;font-weight:700;text-decoration:none;">Practise this on Mostly Medicine →</a>
    </p>
    <p style="margin:0;font-size:12px;color:#94a3b8;">
      Sharpen your clinical thinking every day.
    </p>
  `;

  // Optional ?type=welcome switches to the warm-welcome preview email.
  // Default = brain-teaser sample.
  const type = url.searchParams.get("type") ?? "teaser";
  const firstName = url.searchParams.get("firstName") ?? "Chetan";

  const payload = (() => {
    if (type === "welcome") {
      const welcome = buildWelcomeEmail(firstName);
      return {
        subject: welcome.subject,
        bodyHtml: welcome.bodyHtml,
        preheader: welcome.preheader,
      };
    }
    return {
      subject: "🩺 Mostly Daily — Cardiology",
      bodyHtml,
      preheader: "STEMI vs NSTEMI — posterior MI catch.",
    };
  })();

  const result = await sendBranded({
    to,
    subject: payload.subject,
    bodyHtml: payload.bodyHtml,
    unsubscribeUrl,
    preheader: payload.preheader,
    from: fromOverride ?? undefined,
  });

  return NextResponse.json({
    ok: result.ok,
    to,
    error: result.error,
    skipped: result.skipped,
    id: result.id,
  });
}
