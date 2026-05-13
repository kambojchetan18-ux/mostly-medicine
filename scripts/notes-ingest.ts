#!/usr/bin/env npx ts-node
/**
 * Notes / Clinical PDFs → library_topics upsert.
 *
 * Reads non-AMEDEX, non-recall, non-CV clinical PDFs from ~/Downloads, sends
 * each to Claude with vision, extracts a structured library_topic row, and
 * upserts into public.library_topics keyed on the `source` field (which we set
 * to the filename, so re-runs are idempotent).
 *
 * Run from monorepo root:
 *   npx ts-node --project scripts/tsconfig.json --transpile-only scripts/notes-ingest.ts
 *
 * Flags:
 *   --pdf-dir <path>    dir containing PDFs (default ~/Downloads)
 *   --filter <regex>    only PDFs matching this regex (default: clinical-notes set)
 *   --dry-run           extract but do not upsert
 *   --limit N           process at most N PDFs
 *   --redo              re-process even if a row exists
 *   --model <id>        claude model (default claude-haiku-4-5-20251001)
 */
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import os from "os";
import path from "path";
import { execSync } from "child_process";

const args = process.argv.slice(2);
const flag = (n: string) => args.includes(`--${n}`);
const arg = (n: string, fallback?: string) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? args[i + 1] : fallback;
};

const PDF_DIR = arg("pdf-dir", path.join(os.homedir(), "Downloads"))!;
// Default: include "notes" PDFs and clinical case / PE / condition study PDFs.
// Excludes AMEDEX (handled by obg-extract-mcqs.ts), recall files, CVs, etc.
const DEFAULT_FILTER =
  "^(?!AMEDEX|Dr_Amandeep|Max |Australia|Gmail|.*[Rr]ecall|.*QBank|Amc mcq imp).+\\.pdf$";
const FILTER = new RegExp(arg("filter", DEFAULT_FILTER)!, "i");
const DRY = flag("dry-run");
const LIMIT = parseInt(arg("limit", "999")!, 10);
const REDO = flag("redo");
const MODEL = arg("model", "claude-haiku-4-5-20251001")!;

// Load envs
function loadEnv() {
  if (process.env.ANTHROPIC_API_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) return;
  try {
    const envText = fs.readFileSync("apps/web/.env.local", "utf-8");
    for (const line of envText.split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)=(.+)$/);
      if (m) {
        const k = m[1];
        const v = m[2].replace(/^"|"$/g, "").trim();
        if (!process.env[k]) process.env[k] = v;
      }
    }
  } catch {}
}
loadEnv();

const KEY = process.env.ANTHROPIC_API_KEY;
const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!KEY || !SB_URL || !SB_KEY) {
  console.error("Missing env: ANTHROPIC_API_KEY / NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const anthropic = new Anthropic({ apiKey: KEY });
const supabase = createClient(SB_URL, SB_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const SYSTEM = `You are a clinical content editor for an AMC exam-prep platform (mostlymedicine.com), helping International Medical Graduates prepare for AMC CAT 1 (MCQ) and CAT 2 (clinical) exams in Australia.

You receive a clinical study PDF — could be a teaching slide deck, a physical examination guide, a case study, or condition notes. Your job is to transform it into ONE library_topic row that students will read inside the app's Library tab.

For each PDF, produce:
- title: short, descriptive, exam-relevant title (≤80 chars). E.g. "Acute Abdomen — Approach to RLQ Pain", "Scaphoid Fracture — Diagnosis & Management"
- system: the body system or domain — choose a single short label like "Cardiology", "Orthopaedics", "Obstetrics & Gynaecology", "Gastroenterology", "Emergency Medicine", "Neurology", "Endocrinology", "Respiratory", "Psychiatry", "Paediatrics", "Public Health"
- summary: a 1-2 sentence elevator summary of the topic, ≤200 chars
- content: a JSON object with these keys:
    - overview: 1-2 paragraph plain-prose overview of the topic (no markdown)
    - key_points: array of 5-12 high-yield bullet points (concise — each ≤180 chars)
    - amc_relevance: 1-2 sentences on why this matters for AMC exams (CAT 1 / CAT 2)
    - red_flags: array of clinical red flags the candidate must elicit (may be empty)
    - reference: short citation back to the source ("AMEDEX 2025 OBS slide deck", "Clinical study notes", etc.)
- amc_exam_type: array containing one or both of "CAT 1", "CAT 2" — based on whether the content is more MCQ-relevant (CAT 1) or clinical roleplay-relevant (CAT 2)
- difficulty: "Easy", "Medium", or "Hard" — title-case

Rules:
- Stay faithful to the source. Light condensation OK; never invent clinical facts.
- Write for an AMC candidate (clear, evidence-based, Australia-relevant where applicable).
- Output ONLY via the save_topic tool — no other text.`;

const TOPIC_SCHEMA = {
  type: "object" as const,
  properties: {
    title: { type: "string" },
    system: { type: "string" },
    summary: { type: "string" },
    content: {
      type: "object",
      properties: {
        overview: { type: "string" },
        key_points: { type: "array", items: { type: "string" }, minItems: 3 },
        amc_relevance: { type: "string" },
        red_flags: { type: "array", items: { type: "string" } },
        reference: { type: "string" },
      },
      required: ["overview", "key_points", "amc_relevance", "red_flags", "reference"],
      additionalProperties: false,
    },
    amc_exam_type: { type: "array", items: { type: "string", enum: ["CAT 1", "CAT 2"] }, minItems: 1 },
    difficulty: { type: "string", enum: ["Easy", "Medium", "Hard"] },
  },
  required: ["title", "system", "summary", "content", "amc_exam_type", "difficulty"],
  additionalProperties: false,
};

interface Topic {
  title: string;
  system: string;
  summary: string;
  content: {
    overview: string;
    key_points: string[];
    amc_relevance: string;
    red_flags: string[];
    reference: string;
  };
  amc_exam_type: ("CAT 1" | "CAT 2")[];
  difficulty: "Easy" | "Medium" | "Hard";
}

function sh(cmd: string): string {
  return execSync(cmd, { encoding: "utf-8" }).trim();
}

function pageCount(pdfPath: string): number {
  const out = sh(`pdfinfo "${pdfPath}"`);
  const m = out.match(/Pages:\s+(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

async function extractTopic(pdfPath: string): Promise<Topic> {
  const buf = fs.readFileSync(pdfPath);
  const b64 = buf.toString("base64");

  const params: any = {
    model: MODEL,
    max_tokens: 3000,
    temperature: 0.1,
    system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
    tools: [
      {
        name: "save_topic",
        description: "Save the extracted library topic row.",
        input_schema: TOPIC_SCHEMA,
      },
    ],
    tool_choice: { type: "tool", name: "save_topic" },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "document",
            source: { type: "base64", media_type: "application/pdf", data: b64 },
          },
          { type: "text", text: "Extract a library_topic row for this clinical PDF." },
        ],
      },
    ],
  };

  const response: any = await anthropic.messages.create(params);
  const toolUse = response.content.find((b: any) => b.type === "tool_use");
  if (!toolUse) throw new Error(`No tool_use; stop_reason=${response.stop_reason}`);
  return toolUse.input as Topic;
}

async function main() {
  const allFiles = fs
    .readdirSync(PDF_DIR)
    .filter((f) => FILTER.test(f))
    .filter((f) => /\.pdf$/i.test(f))
    .sort();

  console.log(`Filter: ${FILTER}`);
  console.log(`Found ${allFiles.length} candidate PDFs (limit: ${LIMIT}, model: ${MODEL}, dry-run: ${DRY})`);

  let processed = 0;
  let inserted = 0;
  let skipped = 0;
  let failed = 0;

  for (const filename of allFiles) {
    if (processed >= LIMIT) break;
    const pdfPath = path.join(PDF_DIR, filename);
    const sizeMb = fs.statSync(pdfPath).size / 1024 / 1024;
    const pages = pageCount(pdfPath);

    // Skip oversized PDFs — single-shot doesn't fit. Will need split.
    if (sizeMb > 30 || pages > 95) {
      console.log(`[skip] ${filename} (${sizeMb.toFixed(1)} MB, ${pages} pages) — too large for single call`);
      skipped++;
      continue;
    }

    // Dedup by source = filename.
    if (!REDO) {
      const { data } = await supabase.from("library_topics").select("id").eq("source", filename).maybeSingle();
      if (data) {
        console.log(`[skip] ${filename} — already in library_topics (id=${data.id})`);
        skipped++;
        continue;
      }
    }

    process.stdout.write(`[run]  ${filename} (${sizeMb.toFixed(1)} MB, ${pages}p) … `);
    try {
      const t0 = Date.now();
      const topic = await extractTopic(pdfPath);
      const dt = ((Date.now() - t0) / 1000).toFixed(1);

      if (DRY) {
        console.log(`✓ ${dt}s — ${topic.title} (${topic.system}, ${topic.difficulty})`);
        console.log(`       summary: ${topic.summary}`);
      } else {
        if (REDO) {
          await supabase.from("library_topics").delete().eq("source", filename);
        }
        const { error } = await supabase.from("library_topics").insert({
          title: topic.title,
          source: filename,
          system: topic.system,
          summary: topic.summary,
          content: topic.content,
          amc_exam_type: topic.amc_exam_type,
          difficulty: topic.difficulty,
        });
        if (error) throw error;
        console.log(`✓ ${dt}s — inserted "${topic.title}" (${topic.system})`);
        inserted++;
      }
      processed++;
    } catch (err) {
      console.log(`✗ ${(err as Error).message}`);
      failed++;
    }
  }

  console.log(`\n=== Done. processed=${processed} inserted=${inserted} skipped=${skipped} failed=${failed} ===`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
