#!/usr/bin/env tsx
/**
 * Post a content-plan draft to Slack for review.
 *
 *   SLACK_WEBHOOK_URL=https://hooks.slack.com/...  pnpm tsx scripts/share-draft.ts 04
 *
 * Argument is the zero-padded article number (matches the prefix on
 * /content-plan/drafts/NN-<slug>.md). The script reads the file, parses
 * the YAML frontmatter, and posts a rich Slack message with:
 *   - Title, word count, status
 *   - Quick-Answer box content (so reviewer sees the headline claim)
 *   - GitHub blob link (review on phone)
 *   - Approve / Reject buttons (visual only — clicking just opens a mailto)
 *
 * If SLACK_WEBHOOK_URL is missing, the script prints the message body to
 * stdout instead of failing — useful for previewing.
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

async function main() {
  const arg = process.argv[2];
  if (!arg) fail("Usage: tsx scripts/share-draft.ts <article-number>  (e.g. 04)");
  const prefix = arg.padStart(2, "0");

  const filePath = findDraft(prefix);
  const fileName = filePath.split("/").pop() ?? "";
  const raw = readFileSync(filePath, "utf-8");
  const { fm, body } = parseFrontmatter(raw);
  const quickAnswer = extractQuickAnswer(body);
  const message = buildSlackMessage(fm, quickAnswer, fileName);

  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) {
    console.log("⚠️  SLACK_WEBHOOK_URL not set. Preview only:");
    console.log(JSON.stringify(message, null, 2));
    console.log(`\nGitHub URL: https://github.com/${REPO}/blob/main/content-plan/drafts/${fileName}`);
    return;
  }
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });
  if (!res.ok) {
    const text = await res.text();
    fail(`Slack returned ${res.status}: ${text}`);
  }
  console.log(`✓ Posted to Slack: ${fileName}`);
}

main().catch((err) => fail(err instanceof Error ? err.message : String(err)));
