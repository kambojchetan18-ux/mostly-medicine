#!/usr/bin/env npx ts-node
/**
 * AI Clinical RolePlay Cases — Source ingestion
 *
 * Reads each PDF in roleplays/source-pdfs/, asks Claude to extract structured
 * metadata (topic, category, complaint cluster, diagnoses, clues, red flags,
 * management themes), and upserts a single row per file into public.acrp_sources.
 *
 * The PDF text is NEVER stored. Only structured tags are persisted.
 *
 * Run from monorepo root:
 *
 *   ANTHROPIC_API_KEY=sk-ant-... \
 *   NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=eyJ... \
 *   npx ts-node scripts/acrp-ingest.ts
 *
 * Optional flags:
 *   --limit N   process only the first N PDFs (default: all)
 *   --only foo  process only files whose name contains "foo"
 *   --redo      re-process even if a row already exists for the filename
 */
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// ── Config ──────────────────────────────────────────────────────────────
const PDF_DIR = path.resolve(__dirname, "../roleplays/source-pdfs");
const MODEL = "claude-sonnet-4-6";
// Anthropic API caps requests at 32MB. base64 inflates by ~33% so the raw
// PDF must be under ~22MB to stay safely below the encoded ceiling.
const MAX_PDF_BYTES = 22 * 1024 * 1024;

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(`--${name}`);
const arg = (name: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const LIMIT = arg("limit") ? parseInt(arg("limit")!, 10) : Infinity;
const ONLY = arg("only");
const REDO = flag("redo");

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!ANTHROPIC_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing env: ANTHROPIC_API_KEY / NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// ── Inline schema + prompt (kept self-contained for ts-node) ────────────
const ACRP_CATEGORIES = [
  "Endocrine & Metabolic",
  "Infectious Diseases",
  "Respiratory & Sleep",
  "Hematology & Oncology",
  "General Medicine Symptoms",
  "Emergency Presentations",
  "Travel & Sexual Health",
  "Renal & Urinary",
];

const SOURCE_METADATA_SCHEMA = {
  type: "object" as const,
  properties: {
    title: { type: "string" },
    topic: { type: "string" },
    category: { type: "string", enum: ACRP_CATEGORIES },
    complaintCluster: { type: "array", items: { type: "string" } },
    diagnosisFamily: { type: "array", items: { type: "string" } },
    clues: { type: "array", items: { type: "string" } },
    redFlags: { type: "array", items: { type: "string" } },
    managementThemes: { type: "array", items: { type: "string" } },
    notes: { type: "string" },
  },
  required: [
    "title",
    "topic",
    "category",
    "complaintCluster",
    "diagnosisFamily",
    "clues",
    "redFlags",
    "managementThemes",
  ],
  additionalProperties: false,
};

const INGESTION_SYSTEM_PROMPT = `You are a clinical content tagger for an AMC-style examination prep platform.

You receive a source PDF (a clinical teaching case, lecture, or reference). Your job is to extract structured metadata that will later be used to *inspire* fresh roleplay cases — never to reproduce the source.

Rules:
- Return ONLY structured tags via the tool call. Do not include the source's wording.
- Identify the underlying topic family, presentation cluster, and diagnosis options.
- Tag red flags that a candidate must elicit.
- Treat each PDF as background reference; do not summarise it for the learner.
- Choose category from the fixed enum.
- Be concise: short noun phrases, not sentences.`;

interface Extraction {
  title: string;
  topic: string;
  category: string;
  complaintCluster: string[];
  diagnosisFamily: string[];
  clues: string[];
  redFlags: string[];
  managementThemes: string[];
  notes?: string;
}

// ── Per-PDF extraction ──────────────────────────────────────────────────
async function extractMetadata(filename: string, buf: Buffer): Promise<Extraction> {
  // SDK 0.32 supports cache_control + PDF document blocks at runtime but the
  // types lag — cast through unknown to avoid noisy errors. Drop on SDK upgrade.
  const params = {
    model: MODEL,
    max_tokens: 1500,
    temperature: 0.2,
    system: [
      {
        type: "text",
        text: INGESTION_SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    tools: [
      {
        name: "save_source_metadata",
        description: "Save structured tags extracted from this source PDF.",
        input_schema: SOURCE_METADATA_SCHEMA,
      },
    ],
    tool_choice: { type: "tool", name: "save_source_metadata" },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "document",
            source: {
              type: "base64",
              media_type: "application/pdf",
              data: buf.toString("base64"),
            },
          },
          {
            type: "text",
            text: `Tag this source PDF (filename: ${filename}). Use the save_source_metadata tool. Choose category from the enum strictly.`,
          },
        ],
      },
    ],
  };
  const response = (await anthropic.messages.create(
    params as unknown as Parameters<typeof anthropic.messages.create>[0]
  )) as Anthropic.Message;

  const toolUse = response.content.find((b) => b.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error(`No tool_use block in response for ${filename}`);
  }
  return toolUse.input as Extraction;
}

// ── Main loop ───────────────────────────────────────────────────────────
async function main() {
  if (!fs.existsSync(PDF_DIR)) {
    console.error(`PDF directory not found: ${PDF_DIR}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(PDF_DIR)
    .filter((f) => f.toLowerCase().endsWith(".pdf"))
    .filter((f) => (ONLY ? f.toLowerCase().includes(ONLY.toLowerCase()) : true))
    .sort();

  console.log(`Found ${files.length} PDFs in ${PDF_DIR}`);
  console.log(`Limit: ${LIMIT === Infinity ? "all" : LIMIT}, Redo: ${REDO}, Only: ${ONLY ?? "<none>"}`);

  let processed = 0;
  let skipped = 0;
  let errors = 0;

  for (const filename of files) {
    if (processed >= LIMIT) break;

    if (!REDO) {
      const { data: existing } = await supabase
        .from("acrp_sources")
        .select("id")
        .eq("filename", filename)
        .maybeSingle();
      if (existing) {
        skipped++;
        continue;
      }
    }

    const fullPath = path.join(PDF_DIR, filename);
    const stat = fs.statSync(fullPath);
    if (stat.size > MAX_PDF_BYTES) {
      console.warn(`[skip] ${filename} — ${(stat.size / 1024 / 1024).toFixed(1)}MB exceeds API limit`);
      skipped++;
      continue;
    }

    try {
      console.log(`[${processed + 1}] ${filename} (${(stat.size / 1024 / 1024).toFixed(1)}MB)`);
      const buf = fs.readFileSync(fullPath);
      const extracted = await extractMetadata(filename, buf);

      const { error } = await supabase.from("acrp_sources").upsert(
        {
          filename,
          title: extracted.title,
          topic: extracted.topic,
          category: extracted.category,
          complaint_cluster: extracted.complaintCluster,
          diagnosis_family: extracted.diagnosisFamily,
          clues: extracted.clues,
          red_flags: extracted.redFlags,
          management_themes: extracted.managementThemes,
          notes: extracted.notes ?? null,
        },
        { onConflict: "filename" }
      );

      if (error) throw error;
      processed++;
      console.log(`     → ${extracted.category} / ${extracted.topic}`);
    } catch (err) {
      errors++;
      console.error(`[error] ${filename}:`, err instanceof Error ? err.message : err);
    }
  }

  console.log(`\nDone. processed=${processed} skipped=${skipped} errors=${errors}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
