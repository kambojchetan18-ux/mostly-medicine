#!/usr/bin/env npx ts-node
/**
 * Merge extracted MCQ JSONs (from scripts/obg-extract-mcqs.ts) into the
 * per-specialty questions-*.ts files in packages/content/src/.
 *
 * Reads every JSON in roleplays/data/mcq-extracted/, groups by topic, and
 * appends new MCQs (deduplicated against existing IDs + stem signatures) to
 * the appropriate questions-<topic>.ts file just before its closing `];`.
 *
 *   npx ts-node --project scripts/tsconfig.json --transpile-only scripts/mcq-merge.ts
 *
 * Flags:
 *   --in-dir <path>    extracted JSON dir (default roleplays/data/mcq-extracted)
 *   --dry-run          print plan but do not write files
 *   --id-prefix <s>    id prefix used in new entries (default "amedex")
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";

const args = process.argv.slice(2);
const flag = (n: string) => args.includes(`--${n}`);
const arg = (n: string, fallback?: string) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? args[i + 1] : fallback;
};

const IN_DIR = arg("in-dir", "roleplays/data/mcq-extracted")!;
const DRY = flag("dry-run");
const ID_PREFIX = arg("id-prefix", "amedex")!;
const CONTENT_DIR = "packages/content/src";

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

// Map canonical topic label to (file, id prefix shorthand) in packages/content/src.
const TOPIC_TO_FILE: Record<string, { file: string; tag: string }> = {
  "Obstetrics & Gynaecology": { file: "questions-obsgyn.ts", tag: "og" },
  Endocrinology: { file: "questions-endocrine.ts", tag: "endo" },
  Gastroenterology: { file: "questions-gastro.ts", tag: "gi" },
  Neurology: { file: "questions-neurology.ts", tag: "neuro" },
  Respiratory: { file: "questions-respiratory.ts", tag: "resp" },
  Cardiovascular: { file: "questions-cardiovascular.ts", tag: "cv" },
  Paediatrics: { file: "questions-paediatrics.ts", tag: "paeds" },
  Psychiatry: { file: "questions-psychiatry.ts", tag: "psych" },
  "Infectious Disease": { file: "questions-infectious.ts", tag: "inf" },
  Pharmacology: { file: "questions-pharmacology.ts", tag: "pharm" },
  "Emergency Medicine": { file: "questions-emergency.ts", tag: "em" },
  Rheumatology: { file: "questions-rheumatology.ts", tag: "rheum" },
  Dermatology: { file: "questions-dermatology.ts", tag: "derm" },
  // Specialties without a dedicated file get routed to surgery as a catch-all
  // for now (renal/orthopaedic land here unless the user wants new files).
  Orthopaedics: { file: "questions-surgery.ts", tag: "ortho" },
  Urology: { file: "questions-surgery.ts", tag: "uro" },
  Haematology: { file: "questions-cardiovascular.ts", tag: "haem" }, // closest existing pool
  "Ophthalmology & ENT": { file: "questions-surgery.ts", tag: "ent" },
  Oncology: { file: "questions-cardiovascular.ts", tag: "onc" },
  Immunology: { file: "questions-infectious.ts", tag: "immuno" },
  "Nutrition & Metabolism": { file: "questions-endocrine.ts", tag: "nut" },
  "Ethics & Professionalism": { file: "questions-psychiatry.ts", tag: "ethics" },
  "Public Health": { file: "questions-infectious.ts", tag: "ph" },
  "General Medicine": { file: "questions-cardiovascular.ts", tag: "gm" },
};

function normaliseStem(stem: string): string {
  return stem
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9 ]/g, "")
    .trim()
    .slice(0, 200);
}

function stemSig(stem: string): string {
  return crypto.createHash("sha1").update(normaliseStem(stem)).digest("hex").slice(0, 12);
}

function escapeForTemplate(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

function renderMcq(m: ExtractedMcq, id: string): string {
  const optionLines = m.options
    .map((o) => `      { label: ${JSON.stringify(o.label)}, text: \`${escapeForTemplate(o.text)}\` },`)
    .join("\n");
  return `  {
    id: ${JSON.stringify(id)},
    topic: ${JSON.stringify(m.topic ?? "")},
    subtopic: ${JSON.stringify(m.subtopic)},
    stem: \`${escapeForTemplate(m.stem)}\`,
    options: [
${optionLines}
    ],
    correctAnswer: ${JSON.stringify(m.correctAnswer)},
    explanation: \`${escapeForTemplate(m.explanation)}\`,
    reference: "amc",
    difficulty: ${JSON.stringify(m.difficulty)},
  },`;
}

function loadExistingIds(filePath: string): { ids: Set<string>; sigs: Set<string>; raw: string } {
  const raw = fs.readFileSync(filePath, "utf-8");
  const idMatches = Array.from(raw.matchAll(/id:\s*"([^"]+)"/g)).map((m) => m[1]);
  const stems: string[] = [];
  // Stems live inside backticks: stem: `...`
  const re = /stem:\s*`((?:\\`|[^`])*)`/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw)) !== null) {
    const decoded = m[1].replace(/\\`/g, "`").replace(/\\\\/g, "\\");
    stems.push(decoded);
  }
  return {
    ids: new Set(idMatches),
    sigs: new Set(stems.map(stemSig)),
    raw,
  };
}

function nextIdGenerator(existingIds: Set<string>, tag: string): () => string {
  // Find max numeric suffix matching `${tag}-${ID_PREFIX}-NNNN`.
  const re = new RegExp(`^${tag}-${ID_PREFIX}-(\\d+)$`);
  let max = 0;
  existingIds.forEach((id) => {
    const m = id.match(re);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  });
  let n = max;
  return () => {
    n++;
    return `${tag}-${ID_PREFIX}-${n.toString().padStart(4, "0")}`;
  };
}

function appendToFile(filePath: string, blockToInsert: string) {
  const raw = fs.readFileSync(filePath, "utf-8");
  // Find the last `];` that closes the questions array.
  const lastClose = raw.lastIndexOf("];");
  if (lastClose < 0) throw new Error(`No closing ']'; in ${filePath}`);
  const before = raw.slice(0, lastClose).trimEnd();
  const after = raw.slice(lastClose);
  // Add a trailing comma to the last existing entry, but NOT to an empty array
  // (where `before` ends with `[` — happens for freshly-created topic files).
  const lastChar = before.slice(-1);
  const beforeWithComma = lastChar === "[" || lastChar === "," ? before : `${before},`;
  const updated = `${beforeWithComma}\n${blockToInsert}\n${after}`;
  fs.writeFileSync(filePath, updated);
}

function main() {
  if (!fs.existsSync(IN_DIR)) {
    console.error(`No input dir: ${IN_DIR}`);
    process.exit(1);
  }

  const chunkFiles = fs.readdirSync(IN_DIR).filter((f) => f.endsWith(".json")).sort();
  if (chunkFiles.length === 0) {
    console.error(`No chunk JSONs in ${IN_DIR}`);
    process.exit(1);
  }

  // Group all extracted MCQs by topic.
  const byTopic = new Map<string, ExtractedMcq[]>();
  for (const fn of chunkFiles) {
    const fp = path.join(IN_DIR, fn);
    let parsed: ExtractedMcq[];
    try {
      parsed = JSON.parse(fs.readFileSync(fp, "utf-8"));
    } catch (err) {
      console.error(`[skip] ${fn}: ${(err as Error).message}`);
      continue;
    }
    for (const m of parsed) {
      const topic = m.topic ?? "General Medicine";
      if (!byTopic.has(topic)) byTopic.set(topic, []);
      byTopic.get(topic)!.push(m);
    }
  }

  console.log("=== Extracted by topic ===");
  for (const [topic, list] of byTopic) {
    console.log(`  ${topic}: ${list.length} candidates`);
  }

  // Per topic: route → file, dedupe → append.
  let grandAdded = 0;
  let grandSkipped = 0;
  for (const [topic, list] of byTopic) {
    const route = TOPIC_TO_FILE[topic];
    if (!route) {
      console.log(`[warn] No route for topic "${topic}", skipping ${list.length} MCQs.`);
      continue;
    }
    const filePath = path.join(CONTENT_DIR, route.file);
    if (!fs.existsSync(filePath)) {
      console.log(`[warn] File missing: ${filePath}, skipping ${list.length} MCQs from "${topic}"`);
      continue;
    }
    const { ids, sigs } = loadExistingIds(filePath);
    const nextId = nextIdGenerator(ids, route.tag);
    const newSeenSigs = new Set<string>();
    const newRendered: string[] = [];

    for (const m of list) {
      const sig = stemSig(m.stem);
      if (sigs.has(sig) || newSeenSigs.has(sig)) {
        grandSkipped++;
        continue;
      }
      newSeenSigs.add(sig);
      const id = nextId();
      newRendered.push(renderMcq(m, id));
    }

    console.log(`\n→ ${topic} → ${route.file}: +${newRendered.length} new, ${list.length - newRendered.length} skipped (duplicates)`);
    grandAdded += newRendered.length;
    if (newRendered.length === 0) continue;

    const block = newRendered.join("\n");
    if (DRY) {
      console.log(`  [dry-run] would append ${newRendered.length} entries to ${filePath}`);
    } else {
      appendToFile(filePath, block);
      console.log(`  ✓ appended to ${filePath}`);
    }
  }

  console.log(`\n=== TOTAL: +${grandAdded} added, ${grandSkipped} skipped (dupes) ===`);
}

main();
