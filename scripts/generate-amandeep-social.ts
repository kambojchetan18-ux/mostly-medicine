#!/usr/bin/env tsx
/**
 * Generate Amandeep-voice LinkedIn + Instagram drafts from the latest
 * published Mostly Medicine pillar article and email them to her for
 * manual review + posting.
 *
 *   pnpm tsx scripts/generate-amandeep-social.ts             # latest published
 *   pnpm tsx scripts/generate-amandeep-social.ts 04          # specific article
 *
 * Env vars (all optional except ANTHROPIC):
 *   ANTHROPIC_API_KEY=...                # required (Claude Haiku)
 *   RESEND_API_KEY=re_...                # if set, emails the drafts
 *   AMANDEEP_EMAIL=...@gmail.com         # destination
 *   ALERT_EMAIL=...                      # fallback (CC to Chetan)
 *
 * Without RESEND_API_KEY the script prints the drafts to stdout instead.
 *
 * Why a separate script (vs reusing share-draft):
 *   share-draft is for ARTICLE drafts → sent to Chetan + Amandeep for
 *   approval-before-publish. This script is for SOCIAL drafts → sent to
 *   Amandeep specifically, in HER voice, post-publish, for manual posting
 *   on her LinkedIn + Instagram. LinkedIn / IG personal-account APIs are
 *   locked down so direct auto-posting isn't an option.
 */

import { readFileSync, readdirSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import Anthropic from "@anthropic-ai/sdk";

const ROOT = resolve(__dirname, "..");
const DRAFTS_DIR = resolve(ROOT, "content-plan/drafts");
const SOCIAL_DIR = resolve(ROOT, "content-plan/social");

// Tiny .env.local loader — tsx scripts run outside Next.js so the framework's
// auto-loader doesn't fire. Reads apps/web/.env.local first, then root .env.local.
function loadDotEnv() {
  for (const path of [
    resolve(ROOT, "apps/web/.env.local"),
    resolve(ROOT, ".env.local"),
  ]) {
    if (!existsSync(path)) continue;
    const raw = readFileSync(path, "utf-8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq < 0) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim().replace(/^["'](.*)["']$/, "$1");
      if (process.env[key] === undefined) process.env[key] = value;
    }
  }
}
loadDotEnv();
const REPO = "kambojchetan18-ux/mostly-medicine";
const MODEL = "claude-haiku-4-5-20251001";

interface Frontmatter {
  title?: string;
  slug?: string;
  description?: string;
  status?: string;
  publishedUrl?: string;
  estimatedWordCount?: number;
}

function fail(msg: string): never {
  console.error(`Error: ${msg}`);
  process.exit(1);
}

function parseFrontmatter(raw: string): { fm: Frontmatter; body: string } {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { fm: {}, body: raw };
  const fm: Frontmatter = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1] as keyof Frontmatter;
    let value: string | number = kv[2].trim().replace(/^["'](.*)["']$/, "$1");
    if (key === "estimatedWordCount" && /^\d+$/.test(value)) {
      fm[key] = Number(value);
    } else {
      (fm as Record<string, unknown>)[key] = value;
    }
  }
  return { fm, body: m[2] };
}

function pickArticle(arg?: string): { path: string; fileName: string } {
  const files = readdirSync(DRAFTS_DIR).filter((f) => /^\d{2}-.+\.md$/.test(f));
  if (arg) {
    const prefix = arg.padStart(2, "0");
    const match = files.find((f) => f.startsWith(`${prefix}-`));
    if (!match) fail(`No article found with prefix ${prefix}-`);
    return { path: resolve(DRAFTS_DIR, match), fileName: match };
  }
  // Default: most recently published article (status === 'published').
  const published = files
    .map((f) => {
      const raw = readFileSync(resolve(DRAFTS_DIR, f), "utf-8");
      const { fm } = parseFrontmatter(raw);
      return { f, fm };
    })
    .filter(({ fm }) => fm.status === "published");
  if (published.length === 0) fail("No published articles found.");
  // Highest article number = latest in priority order
  published.sort((a, b) => b.f.localeCompare(a.f));
  return { path: resolve(DRAFTS_DIR, published[0].f), fileName: published[0].f };
}

const SYSTEM_PROMPT = `You are Dr Amandeep Kamboj. Real biographical context to ground every post:

- You're an International Medical Graduate (IMG) who recently passed the Australian Medical Council (AMC) exams — both Part 1 (MCQ) and Part 2 (Clinical / MCAT).
- You're currently completing recency-of-practice in Gurugram, India before returning to Sydney to practise medicine in Australia.
- Your husband Chetan Kamboj is the engineer-founder of Mostly Medicine (https://mostlymedicine.com), a study platform built specifically because you struggled to find adequate prep tools as an IMG.
- Your voice: warm, candid, evidence-based, never salesy. You write as a working doctor talking to other working doctors. You don't preach. You share what you actually went through.
- You are emotionally invested in IMG success. You know how brutal the AMC pathway is, the financial pressure, the family separation, the years of preparation.
- You write in clear English. Occasional Hinglish words feel natural ("bahut", "yaar") but only sparingly when it lands.

Your job: turn a Mostly Medicine pillar article into TWO platform-tailored drafts that Amandeep would actually post:

1. **LinkedIn post** (200-280 words):
   - Personal, candid hook in your first 1-2 lines
   - 2-4 substantive bullets or paragraphs distilling the article's most useful insight
   - One concrete data point or stat from the article
   - End with an invitation to discuss / share their own experience (NOT "DM me", NOT "click here")
   - Include the article URL exactly once, naturally placed
   - Hashtags at the end: #IMG #AMCExam #IMGAustralia #InternationalMedicalGraduate plus any topic-specific (e.g. #PLAB, #IELTSvsOET, #AHPRA)

2. **Instagram caption** (120-180 words):
   - Punchier than LinkedIn — Instagram users skim
   - Hook in first line (visible above the "more" cut)
   - 3-5 short lines with line breaks for visual rhythm
   - Emoji used sparingly (1-2 per post max) — never the spammy emoji-stuffed style
   - End with the article URL on its own line
   - Suggest a SHORT image concept (1 sentence) for Amandeep / her designer to create or pick — e.g. "Photo of stethoscope on AMC handbook with a pull-quote stat overlaid in white sans-serif"
   - Hashtag block (10-15 hashtags) on the LAST line, mix high-volume + niche

Output STRICT JSON only — no prose around it:
{
  "linkedin": "<full LinkedIn post text>",
  "instagram_caption": "<full IG caption text>",
  "instagram_image_concept": "<one-sentence visual brief>"
}`;

let _anth: Anthropic | null = null;
function client() {
  if (!_anth) _anth = new Anthropic();
  return _anth;
}

interface SocialDrafts {
  linkedin: string;
  instagram_caption: string;
  instagram_image_concept: string;
}

async function generateDrafts(fm: Frontmatter, body: string): Promise<SocialDrafts> {
  if (!process.env.ANTHROPIC_API_KEY) fail("ANTHROPIC_API_KEY not set.");
  const trimmed = body.length > 12000 ? body.slice(0, 12000) + "\n[...truncated]" : body;
  const userMessage = `Pillar article details:

Title: ${fm.title}
Meta description: ${fm.description}
Live URL: ${fm.publishedUrl ?? `https://mostlymedicine.com/${fm.slug}`}

Article body (markdown):
---
${trimmed}
---

Generate the LinkedIn + Instagram drafts now. Strict JSON only.`;
  const response = await client().messages.create({
    model: MODEL,
    max_tokens: 1500,
    temperature: 0.4,
    system: [
      { type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } },
    ] as unknown as Anthropic.TextBlockParam[],
    messages: [{ role: "user", content: userMessage }],
  });
  const text = response.content
    .filter((b) => b.type === "text")
    .map((b) => (b as Anthropic.TextBlock).text)
    .join("");
  const trimmedRes = text.trim().replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(trimmedRes);
  } catch {
    const match = trimmedRes.match(/\{[\s\S]*\}/);
    if (!match) fail(`Couldn't parse JSON from Claude response: ${trimmedRes.slice(0, 200)}`);
    parsed = JSON.parse(match[0]);
  }
  if (typeof parsed.linkedin !== "string" || typeof parsed.instagram_caption !== "string" || typeof parsed.instagram_image_concept !== "string") {
    fail("Claude response missing required fields.");
  }
  return parsed as unknown as SocialDrafts;
}

function buildEmailHtml(drafts: SocialDrafts, fm: Frontmatter): string {
  const title = fm.title ?? "Article";
  const liveUrl = fm.publishedUrl ?? `https://mostlymedicine.com/${fm.slug}`;
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#0f172a;font-family:-apple-system,system-ui,Segoe UI,Helvetica,Arial,sans-serif;color:#e2e8f0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:24px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#111827;border-radius:16px;overflow:hidden;border:1px solid #1f2937;">
        <tr><td style="padding:28px 28px 22px 28px;background:linear-gradient(135deg,#0d9488 0%,#7c3aed 50%,#ec4899 100%);">
          <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:rgba(255,255,255,0.9);">📱 Social drafts ready — Amandeep's voice</p>
          <h1 style="margin:8px 0 0 0;font-size:20px;line-height:1.3;color:#fff;">${esc(title)}</h1>
          <p style="margin:6px 0 0 0;font-size:13px;color:rgba(255,255,255,0.85);"><a href="${esc(liveUrl)}" style="color:#fff;text-decoration:underline;">${esc(liveUrl)}</a></p>
        </td></tr>

        <tr><td style="padding:22px 28px 6px 28px;">
          <p style="margin:0 0 8px 0;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#7dd3fc;">LinkedIn post</p>
          <div style="background:#1e293b;border-radius:10px;padding:14px 16px;white-space:pre-wrap;font-size:14px;line-height:1.55;color:#e2e8f0;">${esc(drafts.linkedin)}</div>
          <p style="margin:8px 0 0 0;font-size:11px;color:#64748b;">→ Tap-and-hold to select all, copy, paste into LinkedIn mobile.</p>
        </td></tr>

        <tr><td style="padding:18px 28px 6px 28px;">
          <p style="margin:0 0 8px 0;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#f472b6;">Instagram caption</p>
          <div style="background:#1e293b;border-radius:10px;padding:14px 16px;white-space:pre-wrap;font-size:14px;line-height:1.55;color:#e2e8f0;">${esc(drafts.instagram_caption)}</div>
        </td></tr>

        <tr><td style="padding:14px 28px 22px 28px;">
          <p style="margin:0 0 6px 0;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#fbbf24;">Suggested image concept</p>
          <div style="background:#0b1220;border-left:3px solid #fbbf24;padding:10px 14px;font-size:13px;font-style:italic;color:#fde68a;line-height:1.5;">${esc(drafts.instagram_image_concept)}</div>
          <p style="margin:10px 0 0 0;font-size:12px;color:#64748b;">Use Canva / phone camera + text overlay. Keep it personal — your face, your stethoscope, your handwritten notes are higher engagement than stock images.</p>
        </td></tr>

        <tr><td style="padding:14px 28px;background:#0b1220;border-top:1px solid #1f2937;">
          <p style="margin:0;font-size:11px;color:#475569;">Auto-generated daily at ~10am AEST after the latest article publishes. Reply with edits if any draft misses your voice.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

async function sendEmail(drafts: SocialDrafts, fm: Frontmatter, to: string, cc: string | null): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("⚠️  RESEND_API_KEY not set — printing drafts instead of emailing.");
    return;
  }
  const html = buildEmailHtml(drafts, fm);
  const from = process.env.RESEND_FROM ?? "Mostly Medicine Drafts <onboarding@resend.dev>";
  const body: Record<string, unknown> = {
    from,
    to,
    subject: `📱 Social drafts: ${fm.title ?? fm.slug}`,
    html,
  };
  if (cc) body.cc = cc;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`✗ Resend ${res.status}: ${text}`);
    return;
  }
  console.log(`✓ Emailed Amandeep at ${to}${cc ? ` (cc ${cc})` : ""}`);
}

function saveLocally(drafts: SocialDrafts, fm: Frontmatter): string {
  if (!existsSync(SOCIAL_DIR)) mkdirSync(SOCIAL_DIR, { recursive: true });
  const date = new Date().toISOString().slice(0, 10);
  const slug = fm.slug ?? "article";
  const file = resolve(SOCIAL_DIR, `${date}-${slug}.md`);
  const content = `---
articleSlug: "${fm.slug ?? ""}"
articleTitle: "${fm.title ?? ""}"
articleUrl: "${fm.publishedUrl ?? `https://mostlymedicine.com/${fm.slug}`}"
generatedAt: "${new Date().toISOString()}"
status: "pending-review"
---

# Social drafts — ${fm.title ?? "Article"}

## LinkedIn (Amandeep)

${drafts.linkedin}

---

## Instagram caption (Amandeep)

${drafts.instagram_caption}

### Suggested image concept

${drafts.instagram_image_concept}
`;
  writeFileSync(file, content, "utf-8");
  return file;
}

async function main() {
  const arg = process.argv[2];
  const { path, fileName } = pickArticle(arg);
  console.log(`📝 Picked article: ${fileName}`);
  const raw = readFileSync(path, "utf-8");
  const { fm, body } = parseFrontmatter(raw);
  if (fm.status !== "published") {
    console.warn(`⚠️  Article status is '${fm.status}', not 'published'. Generating drafts anyway.`);
  }

  console.log("🤖 Generating drafts via Claude…");
  const drafts = await generateDrafts(fm, body);

  const savedAt = saveLocally(drafts, fm);
  console.log(`✓ Saved drafts to ${savedAt}`);

  const amandeepEmail = process.env.AMANDEEP_EMAIL;
  const ccEmail = process.env.ALERT_EMAIL ?? null;
  if (amandeepEmail && process.env.RESEND_API_KEY) {
    await sendEmail(drafts, fm, amandeepEmail, ccEmail !== amandeepEmail ? ccEmail : null);
  } else {
    console.log("\n──────── LinkedIn ────────");
    console.log(drafts.linkedin);
    console.log("\n──────── Instagram caption ────────");
    console.log(drafts.instagram_caption);
    console.log("\n──────── Image concept ────────");
    console.log(drafts.instagram_image_concept);
    if (!amandeepEmail) console.log("\n(set AMANDEEP_EMAIL to email automatically.)");
  }
}

main().catch((err) => fail(err instanceof Error ? err.message : String(err)));
