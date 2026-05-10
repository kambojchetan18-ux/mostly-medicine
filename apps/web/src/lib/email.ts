// Shared branded-email helper for Resend.
// Used by:
//   - /api/email/welcome (one-shot when a new user verifies)
//   - /api/cron/brain-teaser (daily AMC teaser to opted-in users)
//   - any future drip campaign
//
// Required env:
//   RESEND_API_KEY        — Resend API key
//   RESEND_FROM_BRANDED   — optional, defaults to Resend's shared "onboarding@resend.dev"
//                           sender so emails work BEFORE mostlymedicine.com is verified
//                           in Resend. Once the domain is verified, set this to
//                           "Mostly Medicine <info@mostlymedicine.com>" in Vercel env
//                           and redeploy.
//   RESEND_REPLY_TO       — optional, defaults to info@mostlymedicine.com so replies
//                           land in your inbox even when sending from onboarding@resend.dev.
//
// During dev / pre-verification you can set RESEND_DRY_RUN=1 to log email
// payloads to the console instead of hitting Resend.

import crypto from "node:crypto";

const RESEND_URL = "https://api.resend.com/emails";
// Default to Resend's shared verified sender. Switch to a custom domain
// (info@mostlymedicine.com) once mostlymedicine.com is verified in Resend.
const FROM_DEFAULT = "Mostly Medicine <onboarding@resend.dev>";
const REPLY_TO_DEFAULT = "info@mostlymedicine.com";

export interface SendBrandedArgs {
  to: string | string[];
  subject: string;
  /** Inner HTML body — will be wrapped in the branded shell. */
  bodyHtml: string;
  /** Plain-text fallback. Optional but recommended for deliverability. */
  bodyText?: string;
  /** When set, appended as an "Unsubscribe" link in the footer. */
  unsubscribeUrl?: string;
  /** Override the branded preheader (the snippet email clients show next to subject). */
  preheader?: string;
  /** Reply-To override (defaults to the From address). */
  replyTo?: string;
  /** Override the From address (defaults to RESEND_FROM_BRANDED env or onboarding@resend.dev). */
  from?: string;
}

export interface SendBrandedResult {
  ok: boolean;
  id?: string;
  error?: string;
  skipped?: "no_api_key" | "dry_run";
}

/**
 * Wraps body HTML in the Mostly Medicine email shell — header logo, content
 * card, footer with unsubscribe link. All inline styles, table-based layout
 * for legacy mail-client compatibility.
 */
export function brandedShell(args: {
  bodyHtml: string;
  preheader?: string;
  unsubscribeUrl?: string;
}): string {
  const preheader = args.preheader ?? "";
  const safeUnsubUrl = args.unsubscribeUrl ? escape(args.unsubscribeUrl) : "";
  const unsub = args.unsubscribeUrl
    ? `<p style="margin:14px 0 0;font-size:11px;color:#94a3b8;">
         You&apos;re receiving this because you opted in for daily updates from Mostly Medicine.
         <a href="${safeUnsubUrl}" style="color:#94a3b8;text-decoration:underline;">Unsubscribe</a>
         · <a href="https://mostlymedicine.com" style="color:#94a3b8;text-decoration:underline;">Mostly Medicine</a>
       </p>`
    : `<p style="margin:14px 0 0;font-size:11px;color:#94a3b8;">
         <a href="https://mostlymedicine.com" style="color:#94a3b8;text-decoration:underline;">Mostly Medicine</a>
         · Built for IMGs preparing for AMC
       </p>`;

  return `
<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Mostly Medicine</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0f172a;">
  <span style="display:none;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">${escape(preheader)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f8fafc;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.04);">
        <tr><td style="background:linear-gradient(135deg,#0f766e 0%,#7c3aed 100%);padding:24px 28px;color:#ffffff;">
          <h1 style="margin:0;font-size:20px;font-weight:700;letter-spacing:-0.01em;">
            Mostly Medicine
          </h1>
          <p style="margin:4px 0 0;font-size:12px;opacity:0.9;">AMC prep for International Medical Graduates</p>
        </td></tr>
        <tr><td style="padding:28px;">
          ${args.bodyHtml}
        </td></tr>
        <tr><td style="padding:14px 28px 22px;background:#f8fafc;border-top:1px solid #e5e7eb;">
          <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.6;">
            Mostly Medicine is an exam-prep platform. Content is for study only and does not substitute for clinical judgement or supervisor advice.
          </p>
          ${unsub}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export async function sendBranded(args: SendBrandedArgs): Promise<SendBrandedResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, skipped: "no_api_key" };

  const from = args.from ?? process.env.RESEND_FROM_BRANDED ?? FROM_DEFAULT;
  const html = brandedShell({
    bodyHtml: args.bodyHtml,
    preheader: args.preheader,
    unsubscribeUrl: args.unsubscribeUrl,
  });

  if (process.env.RESEND_DRY_RUN === "1") {
    console.log("[email/dry-run]", { to: args.to, subject: args.subject, htmlLength: html.length });
    return { ok: true, skipped: "dry_run" };
  }

  try {
    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: args.to,
        subject: args.subject,
        html,
        text: args.bodyText,
        reply_to: args.replyTo ?? process.env.RESEND_REPLY_TO ?? REPLY_TO_DEFAULT,
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error("[email/send]", res.status, errText);
      return { ok: false, error: `resend ${res.status}: ${errText.slice(0, 200)}` };
    }
    const json = (await res.json()) as { id?: string };
    return { ok: true, id: json.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "send failed";
    console.error("[email/send] threw", msg);
    return { ok: false, error: msg };
  }
}

/**
 * Generate a 32-byte hex token for unsubscribe links. Stored in
 * email_unsub_tokens; the public unsubscribe route looks it up to find the
 * user_id without exposing email in the URL.
 */
export function newUnsubToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
