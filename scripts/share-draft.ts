#!/usr/bin/env tsx
/**
 * Share a content-plan draft for review via Slack and/or email.
 *
 *   pnpm tsx scripts/share-draft.ts 04
 *
 * Channels (each gated by env var, both can fire together):
 *   SLACK_WEBHOOK_URL=https://hooks.slack.com/...   → rich Slack card
 *   RESEND_API_KEY=re_xxxx + ALERT_EMAIL=you@x.com → branded HTML email
 *
 * If neither env var is set, prints a JSON preview to stdout (useful for
 * sanity-checking format without sending). The drafter cron runs this
 * automatically after each new draft lands so Chetan + Amandeep get a
 * phone-friendly review prompt without opening a laptop.
 */

import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(__dirname, "..");
const DRAFTS_DIR = resolve(ROOT, "content-plan/drafts");
const REPO = "kambojchetan18-ux/mostly-medicine";

interface Frontmatter {
  title?: string;
  slug?: string;
  description?: string;
  status?: string;
  publishedAt?: string;
  estimatedWordCount?: number | string;
  author?: string;
}

function fail(msg: string): never {
  console.error(`Error: ${msg}`);
  process.exit(1);
}

function findDraft(prefix: string): string {
  const files = readdirSync(DRAFTS_DIR).filter((f) => f.startsWith(`${prefix}-`));
  if (files.length === 0) fail(`No draft found with prefix ${prefix}- in ${DRAFTS_DIR}`);
  if (files.length > 1) fail(`Multiple drafts match ${prefix}-: ${files.join(", ")}`);
  return resolve(DRAFTS_DIR, files[0]);
}

function parseFrontmatter(raw: string): { fm: Frontmatter; body: string } {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { fm: {}, body: raw };
  const fmRaw = m[1];
  const body = m[2];
  const fm: Frontmatter = {};
  for (const line of fmRaw.split("\n")) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1] as keyof Frontmatter;
    let value: string | number = kv[2].trim();
    if (typeof value === "string") {
      value = value.replace(/^["'](.*)["']$/, "$1");
      if (key === "estimatedWordCount" && /^\d+$/.test(value)) {
        fm[key] = Number(value);
        continue;
      }
    }
    (fm as Record<string, unknown>)[key] = value;
  }
  return { fm, body };
}

function extractQuickAnswer(body: string): string | null {
  const match = body.match(/^>\s*\*?(.+?)\*?$/m);
  if (!match) return null;
  return match[1].trim().slice(0, 600);
}

function buildSlackMessage(fm: Frontmatter, quickAnswer: string | null, fileName: string) {
  const title = fm.title ?? fileName;
  const slug = fm.slug ?? fileName.replace(/\.md$/, "");
  const status = fm.status ?? "draft";
  const wc = fm.estimatedWordCount ?? "—";
  const githubUrl = `https://github.com/${REPO}/blob/main/content-plan/drafts/${fileName}`;

  return {
    text: `📝 New article draft ready for review — *${title}*`,
    blocks: [
      { type: "header", text: { type: "plain_text", text: `📝 ${title}`, emoji: true } },
      {
        type: "context",
        elements: [
          { type: "mrkdwn", text: `*Slug:* \`${slug}\`` },
          { type: "mrkdwn", text: `*Words:* ${wc}` },
          { type: "mrkdwn", text: `*Status:* ${status}` },
          ...(fm.author ? [{ type: "mrkdwn", text: `*Author:* ${fm.author}` }] : []),
        ],
      },
      ...(fm.description
        ? [{
            type: "section",
            text: { type: "mrkdwn", text: `*Meta description:*\n>${fm.description.replace(/\n/g, "\n>")}` },
          }]
        : []),
      ...(quickAnswer
        ? [{
            type: "section",
            text: { type: "mrkdwn", text: `*Quick-answer hook:*\n>${quickAnswer.replace(/\n/g, "\n>")}` },
          }]
        : []),
      { type: "divider" },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "Review on GitHub", emoji: true },
            url: githubUrl,
            style: "primary",
          },
          {
            type: "button",
            text: { type: "plain_text", text: "Approve / Publish", emoji: true },
            url: `mailto:?subject=${encodeURIComponent(`Publish: ${title}`)}&body=${encodeURIComponent(`Reply 'publish kar de article ${slug}' to Claude Code to render this draft as a Next.js page route.`)}`,
          },
          {
            type: "button",
            text: { type: "plain_text", text: "Request changes", emoji: true },
            url: `mailto:?subject=${encodeURIComponent(`Revise: ${title}`)}&body=${encodeURIComponent(`What needs to change in ${slug}?`)}`,
          },
        ],
      },
      {
        type: "context",
        elements: [
          { type: "mrkdwn", text: `_Auto-shared from /content-plan/drafts/${fileName}_` },
        ],
      },
    ],
  };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildEmailHtml(fm: Frontmatter, quickAnswer: string | null, fileName: string): string {
  const title = fm.title ?? fileName;
  const slug = fm.slug ?? fileName.replace(/\.md$/, "");
  const wc = fm.estimatedWordCount ?? "—";
  const githubUrl = `https://github.com/${REPO}/blob/main/content-plan/drafts/${fileName}`;
  const editUrl = `https://github.com/${REPO}/edit/main/content-plan/drafts/${fileName}`;
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#0f172a;font-family:-apple-system,system-ui,Segoe UI,Helvetica,Arial,sans-serif;color:#e2e8f0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:24px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#111827;border-radius:16px;overflow:hidden;border:1px solid #1f2937;">
        <tr><td style="padding:28px 28px 20px 28px;background:linear-gradient(135deg,#0d9488 0%,#7c3aed 50%,#ec4899 100%);">
          <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:rgba(255,255,255,0.9);">📝 Draft ready for review</p>
          <h1 style="margin:8px 0 0 0;font-size:22px;line-height:1.25;color:#fff;">${escapeHtml(title)}</h1>
        </td></tr>
        <tr><td style="padding:22px 28px;">
          <p style="margin:0 0 12px 0;font-size:13px;color:#94a3b8;">
            <strong style="color:#cbd5e1;">Slug:</strong> ${escapeHtml(slug)}<br>
            <strong style="color:#cbd5e1;">Words:</strong> ${escapeHtml(String(wc))}<br>
            ${fm.author ? `<strong style="color:#cbd5e1;">Author:</strong> ${escapeHtml(fm.author)}` : ""}
          </p>
          ${fm.description ? `<div style="background:#1e293b;border-radius:10px;padding:12px 14px;margin:10px 0;">
            <p style="margin:0 0 4px 0;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;">Meta description</p>
            <p style="margin:0;font-size:14px;color:#e2e8f0;line-height:1.5;">${escapeHtml(fm.description)}</p>
          </div>` : ""}
          ${quickAnswer ? `<div style="background:#0c4a6e;border-radius:10px;padding:12px 14px;margin:10px 0;border-left:3px solid #38bdf8;">
            <p style="margin:0 0 4px 0;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#7dd3fc;">Quick-answer hook</p>
            <p style="margin:0;font-size:14px;color:#e0f2fe;line-height:1.5;font-style:italic;">${escapeHtml(quickAnswer)}</p>
          </div>` : ""}
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:18px 0 0 0;">
            <tr>
              <td style="padding-right:8px;"><a href="${githubUrl}" style="display:inline-block;background:#14b8a6;color:#fff;text-decoration:none;font-weight:600;font-size:13px;padding:10px 18px;border-radius:9px;">📖 Review on GitHub</a></td>
              <td style="padding-right:8px;"><a href="${editUrl}" style="display:inline-block;background:#1e293b;color:#cbd5e1;text-decoration:none;font-weight:600;font-size:13px;padding:10px 18px;border-radius:9px;border:1px solid #334155;">✏️ Edit on phone</a></td>
            </tr>
          </table>
          <p style="margin:18px 0 0 0;font-size:12px;color:#64748b;line-height:1.5;">
            <strong style="color:#94a3b8;">Approve:</strong> reply to Claude Code with <code style="background:#1e293b;color:#86efac;padding:2px 6px;border-radius:4px;font-family:monospace;">publish kar de article ${escapeHtml(slug)}</code>
          </p>
        </td></tr>
        <tr><td style="padding:14px 28px;background:#0b1220;border-top:1px solid #1f2937;">
          <p style="margin:0;font-size:11px;color:#475569;text-align:center;">Auto-shared from /content-plan/drafts/${escapeHtml(fileName)}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

async function sendSlack(
  fm: Frontmatter, quickAnswer: string | null, fileName: string, url: string,
): Promise<void> {
  const message = buildSlackMessage(fm, quickAnswer, fileName);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Slack returned ${res.status}: ${text}`);
  }
}

async function sendEmail(
  fm: Frontmatter, quickAnswer: string | null, fileName: string,
  apiKey: string, to: string,
): Promise<void> {
  const title = fm.title ?? fileName;
  const html = buildEmailHtml(fm, quickAnswer, fileName);
  // Resend free tier without a verified custom domain only allows sending TO
  // the verified account email FROM onboarding@resend.dev — that's exactly
  // the use case here (notify Chetan + Amandeep). When mostlymedicine.com
  // is verified later, swap the from address to alerts@mostlymedicine.com.
  const from = process.env.RESEND_FROM ?? "Mostly Medicine Drafts <onboarding@resend.dev>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: `📝 Draft ready: ${title}`,
      html,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend returned ${res.status}: ${text}`);
  }
}

async function main() {
  const arg = process.argv[2];
  if (!arg) fail("Usage: tsx scripts/share-draft.ts <article-number>  (e.g. 04)");
  const prefix = arg.padStart(2, "0");

  const filePath = findDraft(prefix);
  const fileName = filePath.split("/").pop() ?? "";
  const raw = readFileSync(filePath, "utf-8");
  const { fm, body } = parseFrontmatter(raw);
  const quickAnswer = extractQuickAnswer(body);

  const slackUrl = process.env.SLACK_WEBHOOK_URL;
  const apiKey = process.env.RESEND_API_KEY;
  const alertEmail = process.env.ALERT_EMAIL;

  // No channel configured — preview to stdout so the user can sanity-check
  // the message shape locally without sending anything.
  if (!slackUrl && !(apiKey && alertEmail)) {
    console.log("⚠️  No channel configured (set SLACK_WEBHOOK_URL and/or RESEND_API_KEY+ALERT_EMAIL).");
    console.log("Preview:");
    console.log(JSON.stringify(buildSlackMessage(fm, quickAnswer, fileName), null, 2));
    console.log(`\nGitHub URL: https://github.com/${REPO}/blob/main/content-plan/drafts/${fileName}`);
    return;
  }

  // Fan out — fail-soft so a single channel failure doesn't block the other.
  const sent: string[] = [];
  const errors: string[] = [];
  if (slackUrl) {
    try { await sendSlack(fm, quickAnswer, fileName, slackUrl); sent.push("Slack"); }
    catch (err) { errors.push(`Slack: ${err instanceof Error ? err.message : String(err)}`); }
  }
  if (apiKey && alertEmail) {
    try { await sendEmail(fm, quickAnswer, fileName, apiKey, alertEmail); sent.push(`Email (${alertEmail})`); }
    catch (err) { errors.push(`Email: ${err instanceof Error ? err.message : String(err)}`); }
  }
  if (sent.length > 0) console.log(`✓ Sent to: ${sent.join(", ")}`);
  if (errors.length > 0) console.error(`✗ Failures:\n  ${errors.join("\n  ")}`);
  if (sent.length === 0) process.exit(1);
}

main().catch((err) => fail(err instanceof Error ? err.message : String(err)));
