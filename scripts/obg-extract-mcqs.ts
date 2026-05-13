#!/usr/bin/env npx ts-node
/**
 * Extract MCQs from AMEDEX 2025 scanned-slide PDFs (and similar MCQ banks).
 *
 * The PDFs are image-only (scanned slide decks) so pdftotext does not work —
 * we send each chunk to Claude as a document block and rely on vision OCR.
 *
 * Run from monorepo root:
 *   npx ts-node --project scripts/tsconfig.json --transpile-only \
 *     scripts/obg-extract-mcqs.ts
 *
 * Flags:
 *   --pdf-dir <path>          dir containing the PDFs (default ~/Downloads)
 *   --out-dir <path>          chunk output dir (default roleplays/data/mcq-extracted)
 *   --pages-per-chunk N       pages per Claude call (default 35)
 *   --filter <regex>          only PDFs whose filename matches this regex
 *                             (default: "AMEDEX 2025 (OBS|GYNAECOLOGY)")
 *   --topic-label "<label>"   override topic label written to each MCQ
 *                             (default inferred from filename)
 *   --model <id>              claude model (default claude-haiku-4-5-20251001)
 *   --max-chunks N            safety cap on total chunks processed this run
 *   --redo                    reprocess chunks even if json exists
 */
import Anthropic from "@anthropic-ai/sdk";
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
const OUT_DIR = arg("out-dir", "roleplays/data/mcq-extracted")!;
const PAGES_PER_CHUNK = parseInt(arg("pages-per-chunk", "35")!, 10);
const FILTER = new RegExp(arg("filter", "AMEDEX 2025 (OBS|GYNAECOLOGY)")!, "i");
const TOPIC_OVERRIDE = arg("topic-label");
const MODEL = arg("model", "claude-haiku-4-5-20251001")!;
const MAX_CHUNKS = parseInt(arg("max-chunks", "999")!, 10);
const REDO = flag("redo");

// Load ANTHROPIC_API_KEY from apps/web/.env.local if not already in env.
if (!process.env.ANTHROPIC_API_KEY) {
  try {
    const envText = fs.readFileSync("apps/web/.env.local", "utf-8");
    const m = envText.match(/^ANTHROPIC_API_KEY=(.+)$/m);
    if (m) process.env.ANTHROPIC_API_KEY = m[1].replace(/^"|"$/g, "").trim();
  } catch {}
}
const KEY = process.env.ANTHROPIC_API_KEY;
if (!KEY) {
  console.error("Missing ANTHROPIC_API_KEY");
  process.exit(1);
}
const anthropic = new Anthropic({ apiKey: KEY });

// Map a filename hint to a canonical topic label used inside questions-*.ts files.
function topicFromFilename(filename: string): string {
  const lower = filename.toLowerCase();
  if (/obs|gynae|gyne|gyn /.test(lower)) return "Obstetrics & Gynaecology";
  if (/cvs|cardio/.test(lower)) return "Cardiovascular";
  if (/derm/.test(lower)) return "Dermatology";
  if (/endo|breast/.test(lower)) return "Endocrinology";
  if (/ethics/.test(lower)) return "Ethics & Professionalism";
  if (/git|gastro/.test(lower)) return "Gastroenterology";
  if (/haemat|hemat/.test(lower)) return "Haematology";
  if (/immun/.test(lower)) return "Immunology";
  if (/infect/.test(lower)) return "Infectious Disease";
  if (/neuro/.test(lower)) return "Neurology";
  if (/nutrition|metabol/.test(lower)) return "Nutrition & Metabolism";
  if (/oncol/.test(lower)) return "Oncology";
  if (/optha|ent\b/.test(lower)) return "Ophthalmology & ENT";
  if (/ortho/.test(lower)) return "Orthopaedics";
  if (/paediatric|paediatr|pediatric/.test(lower)) return "Paediatrics";
  if (/pharmac/.test(lower)) return "Pharmacology";
  if (/psych/.test(lower)) return "Psychiatry";
  if (/public health/.test(lower)) return "Public Health";
  if (/resp/.test(lower)) return "Respiratory";
  if (/urology/.test(lower)) return "Urology";
  if (/emergen/.test(lower)) return "Emergency Medicine";
  return "General Medicine";
}

const SYSTEM = `You are extracting Australian Medical Council (AMC) CAT1-style multiple-choice questions from scanned lecture-slide PDFs.

The slides contain numbered MCQ cases — typically a clinical vignette/stem, 4-5 lettered options, an indicated correct answer, and an explanation/teaching point.

For EACH complete MCQ visible in the PDF, extract:
- stem: the full clinical vignette/question (verbatim or lightly condensed for clarity — keep all clinical details, numbers, lab values)
- options: the 4-5 answer choices labelled A, B, C, D (and E if present)
- correctAnswer: the indicated correct option letter (A/B/C/D/E)
- explanation: the teaching point or rationale provided in the slides — be thorough, include differentials and key learning points
- subtopic: a short specific topic label (e.g. "Pre-eclampsia", "Postpartum Haemorrhage", "Asthma exacerbation", "DKA")
- difficulty: your judgment based on case complexity — "easy" (recognition), "medium" (reasoning), or "hard" (multi-step / rare / nuanced)

Rules:
- Stay faithful to the slide content. Light rewording for clarity OK; NEVER invent clinical facts.
- If an MCQ is incomplete (stem only, no answer visible, options cut off), SKIP it — do not guess.
- If the slide is a notes/teaching slide without a discrete MCQ, skip it.
- Skip any "recalls" sections that just list topic names without full MCQs.
- Skip cover pages, blank pages, table-of-contents slides.
- Return all extracted MCQs from this chunk in a single tool call.`;

const MCQ_SCHEMA = {
  type: "object" as const,
  properties: {
    mcqs: {
      type: "array",
      items: {
        type: "object",
        properties: {
          stem: { type: "string" },
          options: {
            type: "array",
            items: {
              type: "object",
              properties: {
                label: { type: "string", enum: ["A", "B", "C", "D", "E"] },
                text: { type: "string" },
              },
              required: ["label", "text"],
              additionalProperties: false,
            },
            minItems: 2,
            maxItems: 5,
          },
          correctAnswer: { type: "string", enum: ["A", "B", "C", "D", "E"] },
          explanation: { type: "string" },
          subtopic: { type: "string" },
          difficulty: { type: "string", enum: ["easy", "medium", "hard"] },
        },
        required: ["stem", "options", "correctAnswer", "explanation", "subtopic", "difficulty"],
        additionalProperties: false,
      },
    },
  },
  required: ["mcqs"],
  additionalProperties: false,
};

interface ExtractedMcq {
  stem: string;
  options: { label: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  subtopic: string;
  difficulty: "easy" | "medium" | "hard";
  topic?: string;
  sourcePdf?: string;
  sourcePages?: string;
}

function sh(cmd: string): string {
  return execSync(cmd, { encoding: "utf-8" }).trim();
}

function pageCount(pdfPath: string): number {
  const out = sh(`pdfinfo "${pdfPath}"`);
  const m = out.match(/Pages:\s+(\d+)/);
  if (!m) throw new Error(`Could not read page count of ${pdfPath}`);
  return parseInt(m[1], 10);
}

function buildChunk(pdfPath: string, firstPage: number, lastPage: number, outPath: string) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "mcq-chunk-"));
  try {
    const pattern = path.join(tmp, "p-%d.pdf");
    sh(`pdfseparate -f ${firstPage} -l ${lastPage} "${pdfPath}" "${pattern}"`);
    const pages: string[] = [];
    for (let p = firstPage; p <= lastPage; p++) {
      const f = path.join(tmp, `p-${p}.pdf`);
      if (fs.existsSync(f)) pages.push(f);
    }
    sh(`pdfunite ${pages.map((p) => `"${p}"`).join(" ")} "${outPath}"`);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

async function extractChunk(chunkPath: string): Promise<ExtractedMcq[]> {
  const buf = fs.readFileSync(chunkPath);
  const b64 = buf.toString("base64");

  const params: any = {
    model: MODEL,
    max_tokens: 8000,
    temperature: 0.1,
    system: [
      { type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } },
    ],
    tools: [
      {
        name: "save_mcqs",
        description: "Save the extracted MCQs from this PDF chunk.",
        input_schema: MCQ_SCHEMA,
      },
    ],
    tool_choice: { type: "tool", name: "save_mcqs" },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "document",
            source: { type: "base64", media_type: "application/pdf", data: b64 },
          },
          { type: "text", text: "Extract all complete MCQs visible in this chunk." },
        ],
      },
    ],
  };

  const response: any = await anthropic.messages.create(params);
  const toolUse = response.content.find((b: any) => b.type === "tool_use");
  if (!toolUse) {
    console.error("  [warn] No tool_use in response. stop_reason:", response.stop_reason);
    return [];
  }
  return (toolUse.input?.mcqs as ExtractedMcq[]) ?? [];
}

async function processPdf(pdfPath: string): Promise<{ pdf: string; chunks: number; mcqs: number }> {
  const filename = path.basename(pdfPath);
  const base = filename.replace(/\.pdf$/i, "").replace(/\s+/g, "_").replace(/[()]/g, "");
  const topic = TOPIC_OVERRIDE || topicFromFilename(filename);
  const total = pageCount(pdfPath);
  const chunks: Array<{ from: number; to: number }> = [];
  for (let p = 1; p <= total; p += PAGES_PER_CHUNK) {
    chunks.push({ from: p, to: Math.min(p + PAGES_PER_CHUNK - 1, total) });
  }
  console.log(`\n=== ${filename} — ${total} pages → ${chunks.length} chunks · topic="${topic}" ===`);

  let pdfMcqTotal = 0;
  for (const c of chunks) {
    if (globalChunkBudget-- <= 0) {
      console.log("  Max-chunks budget exhausted. Stopping.");
      break;
    }
    const tag = `${base}__${c.from}-${c.to}`;
    const outJson = path.join(OUT_DIR, `${tag}.json`);
    if (!REDO && fs.existsSync(outJson)) {
      const existing = JSON.parse(fs.readFileSync(outJson, "utf-8")) as ExtractedMcq[];
      pdfMcqTotal += existing.length;
      console.log(`  [skip] ${tag} (${existing.length} MCQs cached)`);
      continue;
    }

    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "mcq-build-"));
    const chunkPdf = path.join(tmpDir, `${tag}.pdf`);
    try {
      buildChunk(pdfPath, c.from, c.to, chunkPdf);
      const sizeMb = fs.statSync(chunkPdf).size / 1024 / 1024;
      process.stdout.write(`  [run]  ${tag} (${sizeMb.toFixed(1)} MB) … `);
      const t0 = Date.now();
      const mcqs = await extractChunk(chunkPdf);
      const tagged: ExtractedMcq[] = mcqs.map((m) => ({
        ...m,
        topic,
        sourcePdf: filename,
        sourcePages: `${c.from}-${c.to}`,
      }));
      const dt = ((Date.now() - t0) / 1000).toFixed(1);
      fs.writeFileSync(outJson, JSON.stringify(tagged, null, 2));
      console.log(`${tagged.length} MCQs in ${dt}s`);
      pdfMcqTotal += tagged.length;
    } catch (err) {
      console.error(`\n  [fail] ${tag}:`, (err as Error).message);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  }
  return { pdf: filename, chunks: chunks.length, mcqs: pdfMcqTotal };
}

let globalChunkBudget = MAX_CHUNKS;

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const allPdfs = fs
    .readdirSync(PDF_DIR)
    .filter((f) => FILTER.test(f))
    .map((f) => path.join(PDF_DIR, f))
    .sort();

  if (allPdfs.length === 0) {
    console.error(`No PDFs matched filter ${FILTER}`);
    process.exit(1);
  }
  console.log(`Filter: ${FILTER}`);
  console.log(`Model: ${MODEL} · pages/chunk: ${PAGES_PER_CHUNK} · max-chunks: ${MAX_CHUNKS}`);
  console.log(`Will process ${allPdfs.length} PDFs:`);
  allPdfs.forEach((p) => console.log(`  • ${path.basename(p)}`));

  const summary: { pdf: string; chunks: number; mcqs: number }[] = [];
  for (const pdf of allPdfs) {
    summary.push(await processPdf(pdf));
    if (globalChunkBudget <= 0) break;
  }

  console.log("\n=== SUMMARY ===");
  let total = 0;
  for (const s of summary) {
    console.log(`  ${s.pdf}: ${s.mcqs} MCQs across ${s.chunks} chunks`);
    total += s.mcqs;
  }
  console.log(`\nTotal MCQs extracted: ${total}`);
  console.log(`Chunks JSON in: ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
