#!/usr/bin/env tsx
/**
 * Generate a brand-voice 8-slide carousel deck from a published Mostly
 * Medicine pillar article — short, crisp, comprehension-focused. Designed
 * to be:
 *   - Posted as a LinkedIn carousel (8 slides ≤ LinkedIn's 10-slide cap)
 *   - Posted as an Instagram carousel (same 8-slide format)
 *   - Exported later as a downloadable PDF lead magnet on the website
 *
 * Brand voice (NOT first-person Amandeep — see generate-amandeep-social.ts
 * for that):
 *   - Neutral, evidence-led, "the data shows" / "we found" / "candidates who..."
 *   - No "I" / "my" / "Amandeep" / "my wife" anywhere
 *   - Each slide is a discrete punch-fact a reader can absorb in 3 seconds
 *
 * Usage:
 *   pnpm tsx scripts/generate-carousel.ts          # latest published article
 *   pnpm tsx scripts/generate-carousel.ts 04       # specific article number
 *
 * Env vars (all optional except ANTHROPIC):
 *   ANTHROPIC_API_KEY                # required (Claude Haiku)
 *   RESEND_API_KEY + ALERT_EMAIL     # if both set, emails the deck
 */

import { readFileSync, readdirSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import Anthropic from "@anthropic-ai/sdk";

const ROOT = resolve(__dirname, "..");
const DRAFTS_DIR = resolve(ROOT, "content-plan/drafts");
const CAROUSEL_DIR = resolve(ROOT, "content-plan/carousels");
const REPO = "kambojchetan18-ux/mostly-medicine";
const MODEL = "claude-haiku-4-5-20251001";

// Inline .env.local loader so this script works outside Next.js shell.
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

interface Frontmatter {
  title?: string;
  slug?: string;
  description?: string;
  status?: string;
  publishedUrl?: string;
}

interface Slide {
  n: number;
  headline: string;        // ≤ 8 words, big text on the slide
  subhead: string;         // ≤ 20 words, supporting line
  source?: string;         // optional inline citation (e.g. "amc.org.au/statistics")
  visual: string;          // 1-sentence visual brief
  role: "cover" | "stat" | "comparison" | "insight" | "myth" | "cta";
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
    const value = kv[2].trim().replace(/^["'](.*)["']$/, "$1");
    (fm as Record<string, unknown>)[key] = value;
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
  const published = files
    .map((f) => {
      const raw = readFileSync(resolve(DRAFTS_DIR, f), "utf-8");
      const { fm } = parseFrontmatter(raw);
      return { f, fm };
    })
    .filter(({ fm }) => fm.status === "published");
  if (published.length === 0) fail("No published articles found.");
  published.sort((a, b) => b.f.localeCompare(a.f));
  return { path: resolve(DRAFTS_DIR, published[0].f), fileName: published[0].f };
}

const SYSTEM_PROMPT = `You generate brand-voice carousel decks for Mostly Medicine — the AMC exam-prep platform for International Medical Graduates (IMGs).

VOICE:
- Neutral, evidence-led, third-person. "Candidates who…" / "The data shows…" / "Most IMGs find…"
- Never use "I", "my", "we" (well, "we" only inside "Mostly Medicine internal data shows")
- Never personal anecdotes, never Amandeep, never Chetan
- Treat the reader as a working IMG — busy, smart, sceptical of marketing fluff
- Cite real sources inline (amc.org.au, ahpra.gov.au, gmc-uk.org, etc.) — don't invent stats
- One idea per slide, no padding

FORMAT — return STRICT JSON only, no prose around it:
{
  "deckTitle": "<5-7 word deck title for the cover>",
  "deckSubtitle": "<one-sentence promise of what the reader will learn>",
  "slides": [
    {
      "n": 1,
      "role": "cover",
      "headline": "<≤8 words, the hook>",
      "subhead": "<≤20 words, what the deck delivers>",
      "visual": "<1-sentence visual brief — minimal, brand-aligned (gradient bg, sans-serif, tabular-nums for stats)>"
    },
    {
      "n": 2,
      "role": "stat" | "comparison" | "insight" | "myth",
      "headline": "<≤8 words>",
      "subhead": "<≤20 words>",
      "source": "<optional inline citation e.g. 'amc.org.au'>",
      "visual": "<1-sentence visual brief>"
    },
    ... 5-6 more middle slides ...
    {
      "n": 8,
      "role": "cta",
      "headline": "<≤8 words — call to action>",
      "subhead": "<≤15 words — one line + URL>",
      "visual": "<1-sentence — minimal CTA card with URL prominent>"
    }
  ]
}

DECK STRUCTURE (exactly 8 slides):
- Slide 1: cover — the punchy hook (counter-intuitive truth, surprising stat, common myth)
- Slides 2-3: 1-2 hard stats with sources
- Slides 4-5: a comparison table OR 2 myth-busts
- Slide 6: an insight / behavioural pattern
- Slide 7: a concrete tactic / next step
- Slide 8: CTA — "Full breakdown:" + the article URL

QUALITY BAR:
- Each slide independently makes sense if scrolled to randomly
- Text is short enough to read on a phone in a swipe
- No emoji except sparingly in CTA slide
- No hashtags inside slides — those go in the post caption (handled separately)`;

let _anth: Anthropic | null = null;
function client() {
  if (!_anth) _anth = new Anthropic();
  return _anth;
}

interface Deck {
  deckTitle: string;
  deckSubtitle: string;
  slides: Slide[];
}

async function generateDeck(fm: Frontmatter, body: string): Promise<Deck> {
  if (!process.env.ANTHROPIC_API_KEY) fail("ANTHROPIC_API_KEY not set.");
  const trimmed = body.length > 12000 ? body.slice(0, 12000) + "\n[...truncated]" : body;
  const userMessage = `Pillar article:

Title: ${fm.title}
Meta description: ${fm.description}
Live URL: ${fm.publishedUrl ?? `https://mostlymedicine.com/${fm.slug}`}

Body:
---
${trimmed}
---

Generate the 8-slide carousel deck now. Strict JSON only.`;
  const response = await client().messages.create({
    model: MODEL,
    max_tokens: 2000,
    temperature: 0.3,
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
    if (!match) fail(`Couldn't parse JSON from Claude: ${trimmedRes.slice(0, 200)}`);
    parsed = JSON.parse(match[0]);
  }
  if (typeof parsed.deckTitle !== "string" || !Array.isArray(parsed.slides)) {
    fail("Claude response missing required fields.");
  }
  return parsed as unknown as Deck;
}

function buildEmailHtml(deck: Deck, fm: Frontmatter): string {
  const title = fm.title ?? "Article";
  const liveUrl = fm.publishedUrl ?? `https://mostlymedicine.com/${fm.slug}`;
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const slideHtml = deck.slides.map((s) => `
    <div style="background:#1e293b;border-radius:12px;padding:16px 18px;margin:0 0 10px 0;border-left:3px solid #14b8a6;">
      <p style="margin:0 0 4px 0;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#5eead4;">Slide ${s.n} · ${esc(s.role)}</p>
      <p style="margin:0 0 6px 0;font-size:18px;font-weight:700;color:#fff;line-height:1.25;">${esc(s.headline)}</p>
      <p style="margin:0 0 8px 0;font-size:14px;color:#cbd5e1;line-height:1.5;">${esc(s.subhead)}</p>
      ${s.source ? `<p style="margin:0 0 8px 0;font-size:11px;color:#64748b;font-style:italic;">Source: ${esc(s.source)}</p>` : ""}
      <p style="margin:0;font-size:11px;color:#fbbf24;line-height:1.4;"><strong style="color:#fde68a;">🎨 Visual:</strong> ${esc(s.visual)}</p>
    </div>
  `).join("");
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#0f172a;font-family:-apple-system,system-ui,Segoe UI,Helvetica,Arial,sans-serif;color:#e2e8f0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:24px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;background:#111827;border-radius:16px;overflow:hidden;border:1px solid #1f2937;">
        <tr><td style="padding:28px 28px 22px 28px;background:linear-gradient(135deg,#0d9488 0%,#7c3aed 50%,#ec4899 100%);">
          <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:rgba(255,255,255,0.9);">📊 Carousel deck ready — brand voice</p>
          <h1 style="margin:8px 0 0 0;font-size:22px;line-height:1.25;color:#fff;">${esc(deck.deckTitle)}</h1>
          <p style="margin:6px 0 0 0;font-size:13px;color:rgba(255,255,255,0.85);">${esc(deck.deckSubtitle)}</p>
          <p style="margin:10px 0 0 0;font-size:12px;color:rgba(255,255,255,0.85);">Source article: <a href="${esc(liveUrl)}" style="color:#fff;text-decoration:underline;">${esc(liveUrl)}</a></p>
        </td></tr>
        <tr><td style="padding:22px 24px 6px 24px;">
          ${slideHtml}
        </td></tr>
        <tr><td style="padding:14px 28px 22px 28px;border-top:1px solid #1f2937;background:#0b1220;">
          <p style="margin:0 0 6px 0;font-size:13px;font-weight:600;color:#cbd5e1;">How to use this deck</p>
          <ul style="margin:0;padding-left:18px;font-size:12px;color:#94a3b8;line-height:1.55;">
            <li>Build each slide in Canva / Figma using the visual brief — minimal, brand-aligned</li>
            <li>Post as <strong style="color:#cbd5e1;">LinkedIn carousel</strong> (8 slides, max 10 supported)</li>
            <li>Same 8 slides work as <strong style="color:#cbd5e1;">Instagram carousel</strong></li>
            <li>Export as PDF for a downloadable lead-magnet on the site</li>
          </ul>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function buildSlackMessage(deck: Deck, fm: Frontmatter) {
  const liveUrl = fm.publishedUrl ?? `https://mostlymedicine.com/${fm.slug}`;
  const slideBlocks = deck.slides.flatMap((s) => [
    { type: "section", text: { type: "mrkdwn", text: `*Slide ${s.n} · ${s.role}*\n*${s.headline}*\n${s.subhead}${s.source ? `\n_Source: ${s.source}_` : ""}\n🎨 ${s.visual}` } },
  ]);
  return {
    text: `📊 Carousel deck — ${deck.deckTitle}`,
    blocks: [
      { type: "header", text: { type: "plain_text", text: `📊 ${deck.deckTitle}`, emoji: true } },
      { type: "section", text: { type: "mrkdwn", text: `_${deck.deckSubtitle}_\n${liveUrl}` } },
      { type: "divider" },
      ...slideBlocks,
      {
        type: "context",
        elements: [
          { type: "mrkdwn", text: "Build each slide in Canva → post as LinkedIn or Instagram carousel → export as PDF lead-magnet" },
        ],
      },
    ],
  };
}

async function sendSlack(deck: Deck, fm: Frontmatter, url: string): Promise<void> {
  const message = buildSlackMessage(deck, fm);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`✗ Slack ${res.status}: ${text}`);
    return;
  }
  console.log(`✓ Posted carousel deck to Slack`);
}

async function sendEmail(deck: Deck, fm: Frontmatter): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ALERT_EMAIL;
  const cc = process.env.AMANDEEP_EMAIL;
  if (!apiKey || !to) {
    console.log("⚠️  RESEND_API_KEY or ALERT_EMAIL not set — printing deck instead of emailing.");
    return;
  }
  const html = buildEmailHtml(deck, fm);
  const from = process.env.RESEND_FROM ?? "Mostly Medicine Drafts <onboarding@resend.dev>";
  const body: Record<string, unknown> = {
    from,
    to,
    subject: `📊 Carousel deck: ${deck.deckTitle}`,
    html,
  };
  if (cc && cc !== to) body.cc = cc;
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
  console.log(`✓ Emailed deck to ${to}${cc ? ` (cc ${cc})` : ""}`);
}

function saveLocally(deck: Deck, fm: Frontmatter): string {
  if (!existsSync(CAROUSEL_DIR)) mkdirSync(CAROUSEL_DIR, { recursive: true });
  const date = new Date().toISOString().slice(0, 10);
  const slug = fm.slug ?? "article";
  const file = resolve(CAROUSEL_DIR, `${date}-${slug}.md`);
  const slideMd = deck.slides.map((s) => `### Slide ${s.n} · ${s.role}

**${s.headline}**

${s.subhead}
${s.source ? `\n_Source: ${s.source}_\n` : ""}
🎨 **Visual:** ${s.visual}
`).join("\n");
  const content = `---
articleSlug: "${fm.slug ?? ""}"
articleTitle: "${fm.title ?? ""}"
articleUrl: "${fm.publishedUrl ?? `https://mostlymedicine.com/${fm.slug}`}"
generatedAt: "${new Date().toISOString()}"
deckTitle: "${deck.deckTitle}"
deckSubtitle: "${deck.deckSubtitle}"
status: "pending-design"
---

# ${deck.deckTitle}

> ${deck.deckSubtitle}

Source: ${fm.publishedUrl ?? `https://mostlymedicine.com/${fm.slug}`}

${slideMd}

---

## How to use

1. Open Canva / Figma → create a new 1080×1080 (Instagram) or 1200×1500 (LinkedIn) carousel
2. For each slide above, build the visual described in the **🎨 Visual** brief
3. Use brand-aligned typography (sans-serif, tabular-nums for stats)
4. Post as LinkedIn carousel (max 10 slides, 8 is the sweet spot)
5. Same deck works for Instagram carousel
6. Export the deck as PDF for a free downloadable lead-magnet on /amc-cheatsheets/<slug>
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

  console.log("🤖 Generating carousel deck via Claude…");
  const deck = await generateDeck(fm, body);

  const savedAt = saveLocally(deck, fm);
  console.log(`✓ Saved deck to ${savedAt}`);

  const slackUrl = process.env.SLACK_WEBHOOK_URL;
  let didSendAnything = false;
  if (slackUrl) {
    try { await sendSlack(deck, fm, slackUrl); didSendAnything = true; }
    catch (err) { console.error("✗ Slack failed:", err instanceof Error ? err.message : String(err)); }
  }
  if (process.env.RESEND_API_KEY && process.env.ALERT_EMAIL) {
    await sendEmail(deck, fm);
    didSendAnything = true;
  }
  if (!didSendAnything) {
    console.log(`\n──────── ${deck.deckTitle} ────────`);
    console.log(`> ${deck.deckSubtitle}\n`);
    for (const s of deck.slides) {
      console.log(`Slide ${s.n} (${s.role})`);
      console.log(`  ${s.headline}`);
      console.log(`  ${s.subhead}`);
      if (s.source) console.log(`  Source: ${s.source}`);
      console.log(`  🎨 ${s.visual}\n`);
    }
  }
}

main().catch((err) => fail(err instanceof Error ? err.message : String(err)));
