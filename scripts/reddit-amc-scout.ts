#!/usr/bin/env npx ts-node
/**
 * Reddit AMC Scout — finds AMC/IMG-related questions on Reddit and uses
 * Claude (Sonnet 4.6) to draft genuine helpful replies that subtly mention
 * mostlymedicine.com when naturally relevant.
 *
 * Chetan reviews + posts manually. The script does NOT auto-post.
 *
 * Run from monorepo root:
 *
 *   ANTHROPIC_API_KEY=... \
 *     npx ts-node --project scripts/tsconfig.json --transpile-only \
 *     scripts/reddit-amc-scout.ts
 *
 * Optional env:
 *   SLACK_WEBHOOK_URL   if set, posts top 3 drafts to Slack
 *   SCOUT_MAX_POSTS     cap drafts per run (default 8)
 *
 * Output:
 *   scripts/reddit-scout-digest-YYYY-MM-DD.md   (the review-ready digest)
 *   scripts/.reddit-scout-seen.json             (dedupe cache; the GitHub
 *                                                Actions workflow commits
 *                                                this back so dedup works
 *                                                across runs)
 */
import Anthropic from "@anthropic-ai/sdk";
import { promises as fs } from "fs";
import * as path from "path";

// ── Config ───────────────────────────────────────────────────────────────
const MODEL = "claude-sonnet-4-6";

const SUBREDDIT_FEEDS: string[] = [
  "https://www.reddit.com/r/ausjdocs/new.json?limit=50",
  "https://www.reddit.com/r/IMG/new.json?limit=50",
  "https://www.reddit.com/r/IMGreddit/new.json?limit=50",
  "https://www.reddit.com/r/MedicalAustralia/new.json?limit=50",
  "https://www.reddit.com/search.json?q=AMC+exam+IMG&sort=new&limit=50",
];

const KEYWORDS: string[] = [
  "AMC",
  "CAT 1",
  "CAT 2",
  "MCAT",
  "IMG",
  "AHPRA",
  "Murtagh",
  "OSCE Australia",
  "Aussie clinical exam",
];

const MAX_AGE_DAYS = 30;
const REDDIT_THROTTLE_MS = 2000;
const MAX_RETRIES = 3;
const USER_AGENT =
  "MostlyMedicineRedditScout/1.0 (+https://mostlymedicine.com; contact: kamboj.chetan18@gmail.com)";

const MAX_POSTS = process.env.SCOUT_MAX_POSTS
  ? Math.max(1, parseInt(process.env.SCOUT_MAX_POSTS, 10))
  : 8;

const SCRIPT_DIR = path.resolve(__dirname);
const SEEN_PATH = path.join(SCRIPT_DIR, ".reddit-scout-seen.json");

// ── Env validation ───────────────────────────────────────────────────────
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_KEY) {
  console.error("Missing env: ANTHROPIC_API_KEY");
  process.exit(1);
}
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ALERT_EMAIL = process.env.ALERT_EMAIL;
const RESEND_FROM = process.env.RESEND_FROM_BRANDED ?? "Mostly Medicine <onboarding@resend.dev>";

const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });

// ── Types ────────────────────────────────────────────────────────────────
interface RedditPostData {
  id: string;
  name: string;
  title: string;
  selftext: string;
  author: string;
  subreddit: string;
  permalink: string;
  url: string;
  created_utc: number;
  num_comments: number;
  score: number;
  over_18?: boolean;
  stickied?: boolean;
}

interface RedditChild {
  kind: string;
  data: RedditPostData;
}

interface RedditListing {
  kind: string;
  data: {
    children: RedditChild[];
  };
}

interface ScoutPost {
  id: string;
  title: string;
  author: string;
  subreddit: string;
  selftext: string;
  permalink: string;
  createdUtc: number;
  score: number;
  numComments: number;
  matchedKeywords: string[];
}

interface DraftedReply {
  post: ScoutPost;
  draft: string;
}

interface SeenCache {
  ids: string[];
  updatedAt: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function todayIso(): string {
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

async function loadSeen(): Promise<Set<string>> {
  try {
    const raw = await fs.readFile(SEEN_PATH, "utf8");
    const parsed = JSON.parse(raw) as SeenCache;
    return new Set(parsed.ids ?? []);
  } catch {
    return new Set<string>();
  }
}

async function saveSeen(seen: Set<string>): Promise<void> {
  // Cap cache at 5000 ids to keep file small
  const ids = Array.from(seen).slice(-5000);
  const payload: SeenCache = { ids, updatedAt: new Date().toISOString() };
  await fs.writeFile(SEEN_PATH, JSON.stringify(payload, null, 2), "utf8");
}

// ── Reddit fetch w/ retry + throttle ─────────────────────────────────────
let lastFetchAt = 0;
async function throttle(): Promise<void> {
  const elapsed = Date.now() - lastFetchAt;
  if (elapsed < REDDIT_THROTTLE_MS) {
    await sleep(REDDIT_THROTTLE_MS - elapsed);
  }
  lastFetchAt = Date.now();
}

async function fetchRedditJson(url: string): Promise<RedditListing | null> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    await throttle();
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
      });
      if (res.status === 429) {
        const backoffMs = 2000 * Math.pow(2, attempt);
        console.warn(`  [429] rate-limited on ${url} — backing off ${backoffMs}ms`);
        await sleep(backoffMs);
        continue;
      }
      if (res.status === 404) {
        console.warn(`  [404] ${url} — subreddit may not exist, skipping`);
        return null;
      }
      if (!res.ok) {
        console.warn(`  [${res.status}] ${url} — skipping`);
        return null;
      }
      const json = (await res.json()) as RedditListing;
      return json;
    } catch (err) {
      const backoffMs = 2000 * Math.pow(2, attempt);
      console.warn(
        `  [error] ${url} attempt ${attempt + 1}: ${err instanceof Error ? err.message : String(err)} — retrying in ${backoffMs}ms`,
      );
      await sleep(backoffMs);
    }
  }
  console.warn(`  [give-up] ${url} after ${MAX_RETRIES} attempts`);
  return null;
}

// ── Filtering ────────────────────────────────────────────────────────────
function matchKeywords(text: string): string[] {
  const lower = text.toLowerCase();
  const hits: string[] = [];
  for (const kw of KEYWORDS) {
    // Word-ish boundary match for short uppercase tokens like "AMC", "IMG"
    const needle = kw.toLowerCase();
    if (lower.includes(needle)) hits.push(kw);
  }
  return hits;
}

function isFresh(createdUtc: number): boolean {
  const ageMs = Date.now() - createdUtc * 1000;
  return ageMs <= MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
}

function listingToPosts(listing: RedditListing | null): ScoutPost[] {
  if (!listing?.data?.children) return [];
  const out: ScoutPost[] = [];
  for (const child of listing.data.children) {
    if (child.kind !== "t3") continue;
    const d = child.data;
    if (d.stickied) continue;
    if (d.over_18) continue;
    const haystack = `${d.title}\n${d.selftext ?? ""}`;
    const matched = matchKeywords(haystack);
    if (matched.length === 0) continue;
    if (!isFresh(d.created_utc)) continue;
    out.push({
      id: d.id,
      title: d.title,
      author: d.author,
      subreddit: d.subreddit,
      selftext: d.selftext ?? "",
      permalink: `https://www.reddit.com${d.permalink}`,
      createdUtc: d.created_utc,
      score: d.score,
      numComments: d.num_comments,
      matchedKeywords: matched,
    });
  }
  return out;
}

// ── Claude draft ─────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an experienced International Medical Graduate (IMG) and clinical educator who helps fellow IMGs prepare for the Australian Medical Council exams (AMC CAT 1 MCQ and CAT 2 / Clinical OSCE).

You are drafting a Reddit reply for a human reviewer (Dr Chetan, founder of mostlymedicine.com — a free study platform for AMC candidates). Your reply will be reviewed and posted manually; do NOT include any preamble, meta commentary, or sign-off referencing this prompt.

Voice & rules:
- Sound like a real human peer — warm, plain English, slightly casual, no corporate or AI-marketing tone.
- Lead with concrete, useful advice that directly answers what the OP asked. Specific resources beat vague encouragement.
- Length: 200-400 words. No headers, minimal bullet points (only if they genuinely aid scanning).
- Reference Australian clinical context where relevant (Murtagh, RACGP guidelines, PBS, Medicare, AMC handbook, OSCE format).
- Mention mostlymedicine.com ONLY when it is a natural, helpful answer to what the OP is asking — e.g. they're hunting for free MCQs, recall banks, or roleplay practice. If the OP's question is about visas, employment, or anything unrelated to study material, do NOT mention the site at all. Better to leave it out than to feel forced.
- When you do mention it, do so once, briefly, in a "I've been using…" or "you might also find … useful" register. Never copy-paste a tagline.
- Never claim credentials you don't have, never make medical claims that aren't standard, never link off-platform paid resources.
- Do NOT use em-dashes or hyphens used as em-dashes. Use commas or full stops instead.
- Output ONLY the reply text. No quotes, no "Here's a draft:" header.`;

async function draftReply(post: ScoutPost): Promise<string> {
  const userMessage = `Subreddit: r/${post.subreddit}
Post title: ${post.title}

Post body:
${post.selftext.trim() || "(no body — title-only post)"}

Matched keywords: ${post.matchedKeywords.join(", ")}

Draft a reply (200-400 words) following the rules in the system prompt.`;

  // cache_control supported at runtime in @anthropic-ai/sdk@0.32.x but the
  // published types don't expose it — cast through TextBlockParam[].
  const systemBlocks = [
    {
      type: "text",
      text: SYSTEM_PROMPT,
      cache_control: { type: "ephemeral" },
    },
  ] as unknown as Anthropic.TextBlockParam[];

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1200,
    temperature: 0.7,
    system: systemBlocks,
    messages: [{ role: "user", content: userMessage }],
  });

  const textBlock = response.content.find(
    (b): b is Anthropic.TextBlock => b.type === "text",
  );
  if (!textBlock) throw new Error("No text block in Claude response");
  return textBlock.text.trim();
}

// ── Output ───────────────────────────────────────────────────────────────
function buildDigestMarkdown(drafts: DraftedReply[]): string {
  const date = todayIso();
  const lines: string[] = [];
  lines.push(`# Reddit AMC Scout — ${date}`);
  lines.push("");
  lines.push(
    `Found **${drafts.length}** fresh AMC/IMG-related posts. Review each draft, edit if needed, and post manually via the "Reply on Reddit" link.`,
  );
  lines.push("");
  drafts.forEach((d, i) => {
    const created = new Date(d.post.createdUtc * 1000).toISOString();
    lines.push(`---`);
    lines.push("");
    lines.push(`## ${i + 1}. r/${d.post.subreddit} — ${d.post.title}`);
    lines.push("");
    lines.push(`- **Author:** u/${d.post.author}`);
    lines.push(`- **Posted:** ${created}`);
    lines.push(
      `- **Score:** ${d.post.score} | **Comments:** ${d.post.numComments}`,
    );
    lines.push(`- **Matched:** ${d.post.matchedKeywords.join(", ")}`);
    lines.push(`- **Link:** ${d.post.permalink}`);
    lines.push("");
    lines.push(`### OP's question`);
    lines.push("");
    const body = d.post.selftext.trim() || "_(title-only post)_";
    lines.push(`> ${body.split("\n").join("\n> ")}`);
    lines.push("");
    lines.push(`### Drafted reply`);
    lines.push("");
    lines.push(d.draft);
    lines.push("");
    lines.push(`[Reply on Reddit →](${d.post.permalink})`);
    lines.push("");
  });
  return lines.join("\n");
}

async function postToSlack(drafts: DraftedReply[]): Promise<void> {
  if (!SLACK_WEBHOOK_URL) return;
  const top = drafts.slice(0, 3);
  const summaryLines: string[] = [];
  summaryLines.push(
    `*Reddit AMC Scout — ${todayIso()}* — ${drafts.length} drafts ready for review`,
  );
  summaryLines.push("");
  top.forEach((d, i) => {
    const snippet = d.draft.length > 280 ? `${d.draft.slice(0, 280)}...` : d.draft;
    summaryLines.push(`*${i + 1}. r/${d.post.subreddit} — ${d.post.title}*`);
    summaryLines.push(`<${d.post.permalink}|Reply on Reddit>`);
    summaryLines.push("```");
    summaryLines.push(snippet);
    summaryLines.push("```");
    summaryLines.push("");
  });
  if (drafts.length > top.length) {
    summaryLines.push(
      `_…and ${drafts.length - top.length} more in today's digest file._`,
    );
  }
  try {
    const res = await fetch(SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: summaryLines.join("\n") }),
    });
    if (!res.ok) {
      console.warn(`  [slack] webhook returned ${res.status} — skipping`);
    } else {
      console.log("  [slack] digest summary posted");
    }
  } catch (err) {
    console.warn(
      `  [slack] post failed: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}

async function postToEmail(drafts: DraftedReply[], digestMarkdown: string): Promise<void> {
  if (!RESEND_API_KEY || !ALERT_EMAIL) return;
  const top = drafts.slice(0, 3);
  const subject = `🔍 Reddit AMC Scout — ${drafts.length} draft${drafts.length === 1 ? "" : "s"} ready (${todayIso()})`;
  const cardsHtml = top
    .map((d, i) => {
      const safeTitle = d.post.title
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      const safeDraft = d.draft
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      return `<div style="margin:16px 0;padding:14px 16px;border:1px solid #e2e8f0;border-radius:10px;background:#f8fafc;">
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#7c3aed;text-transform:uppercase;letter-spacing:0.06em;">${i + 1}. r/${d.post.subreddit}</p>
        <p style="margin:0 0 8px;font-size:15px;font-weight:700;color:#0f172a;">${safeTitle}</p>
        <p style="margin:0 0 10px;font-size:12px;"><a href="${d.post.permalink}" style="color:#0f766e;text-decoration:underline;">Open thread on Reddit &rarr;</a></p>
        <pre style="margin:0;padding:10px 12px;background:#0f172a;color:#e2e8f0;border-radius:8px;font-size:12px;line-height:1.55;white-space:pre-wrap;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;">${safeDraft}</pre>
      </div>`;
    })
    .join("");
  const moreCount = drafts.length - top.length;
  const moreNote = moreCount > 0
    ? `<p style="margin:12px 0 0;font-size:13px;color:#64748b;">…and ${moreCount} more draft${moreCount === 1 ? "" : "s"} in today&apos;s digest file (committed to <code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;">scripts/reddit-scout-digest-${todayIso()}.md</code>).</p>`
    : "";
  const bodyHtml = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0f172a;max-width:640px;margin:0 auto;padding:20px;">
    <h2 style="margin:0 0 6px;font-size:20px;color:#0f766e;">🔍 Reddit AMC Scout</h2>
    <p style="margin:0 0 14px;font-size:13px;color:#64748b;">${todayIso()} &middot; ${drafts.length} draft${drafts.length === 1 ? "" : "s"} ready for manual review.</p>
    <p style="margin:0 0 14px;font-size:13px;color:#334155;line-height:1.55;">Top 3 below. Reply only when the post is genuinely answerable and the Mostly Medicine mention is contextual — Reddit's spam filter is unforgiving.</p>
    ${cardsHtml}
    ${moreNote}
  </div>`;
  // bodyText is the whole markdown digest as a plain-text fallback so
  // recipients on email clients that strip HTML still see everything.
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: ALERT_EMAIL,
        subject,
        html: bodyHtml,
        text: digestMarkdown,
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.warn(`  [email] Resend returned ${res.status}: ${errText.slice(0, 200)}`);
    } else {
      console.log(`  [email] digest sent to ${ALERT_EMAIL}`);
    }
  } catch (err) {
    console.warn(
      `  [email] send failed: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}

// ── Main ─────────────────────────────────────────────────────────────────
async function main(): Promise<void> {
  console.log(`Reddit AMC Scout — ${todayIso()}`);
  console.log(`Model: ${MODEL} | Feeds: ${SUBREDDIT_FEEDS.length} | Max drafts: ${MAX_POSTS}`);
  console.log("");

  const seen = await loadSeen();
  console.log(`Seen cache: ${seen.size} previously processed post IDs`);

  // 1) Pull all feeds
  const candidates = new Map<string, ScoutPost>();
  for (const feed of SUBREDDIT_FEEDS) {
    console.log(`Fetching ${feed}`);
    const listing = await fetchRedditJson(feed);
    const posts = listingToPosts(listing);
    for (const p of posts) {
      if (seen.has(p.id)) continue;
      if (!candidates.has(p.id)) candidates.set(p.id, p);
    }
    console.log(`  → ${posts.length} matched, ${candidates.size} unique fresh so far`);
  }

  if (candidates.size === 0) {
    console.log("\nNo fresh AMC-related posts found. Nothing to draft.");
    return;
  }

  // 2) Sort newest-first, cap at MAX_POSTS
  const queue = Array.from(candidates.values())
    .sort((a, b) => b.createdUtc - a.createdUtc)
    .slice(0, MAX_POSTS);

  console.log(`\nDrafting ${queue.length} replies via Claude (${MODEL})…`);
  const drafts: DraftedReply[] = [];
  for (const post of queue) {
    try {
      console.log(`  • r/${post.subreddit} — ${post.title.slice(0, 70)}`);
      const draft = await draftReply(post);
      drafts.push({ post, draft });
      seen.add(post.id);
    } catch (err) {
      console.error(
        `    ✗ draft failed for ${post.id}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  if (drafts.length === 0) {
    console.log("\nNo drafts produced. Exiting without writing digest.");
    return;
  }

  // 3) Write digest
  const digestPath = path.join(SCRIPT_DIR, `reddit-scout-digest-${todayIso()}.md`);
  const md = buildDigestMarkdown(drafts);
  await fs.writeFile(digestPath, md, "utf8");
  console.log(`\nDigest written: ${digestPath}`);

  // 4) Persist seen cache
  await saveSeen(seen);
  console.log(`Seen cache updated: ${SEEN_PATH} (${seen.size} ids)`);

  // 5) Optional Slack post
  await postToSlack(drafts);

  // 6) Optional email digest
  await postToEmail(drafts, md);

  // 6) Console summary
  console.log("\n=== Summary ===");
  drafts.forEach((d, i) => {
    console.log(`${i + 1}. r/${d.post.subreddit}: ${d.post.title}`);
    console.log(`   ${d.post.permalink}`);
  });
  console.log(`\nDone. ${drafts.length} draft(s) ready for manual review.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
