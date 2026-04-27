#!/usr/bin/env npx ts-node
/**
 * Extract AMC Handbook of Clinical Assessment scenarios into the
 * Scenario[] format used by packages/ai/src/scenarios.ts.
 *
 * Run from monorepo root:
 *
 *   ANTHROPIC_API_KEY=sk-ant-... npx ts-node --project scripts/tsconfig.json \
 *     --transpile-only scripts/amc-extract-scenarios.ts
 *
 * Optional flags:
 *   --pdf <path>       PDF location (default: ~/Downloads/.../AMC_Handbook_of_Clinical_Assessment.pdf)
 *   --batch N          cases per Claude call (default 6)
 *   --start N          start at condition number N (default 1)
 *   --end N            stop at condition number N (default 151)
 *   --out <path>       output JSON file (default: roleplays/data/amc-handbook-extracted.json)
 *
 * Output: writes a JSON file containing the extracted Scenario[] array.
 * Review the JSON, then a separate merge step will append it to scenarios.ts
 * (preserving the existing 11 hand-written entries).
 */
import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

const args = process.argv.slice(2);
const arg = (n: string, fallback?: string) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? args[i + 1] : fallback;
};
const num = (n: string, fallback: number) => {
  const v = arg(n);
  return v ? parseInt(v, 10) : fallback;
};

// Default to the pdftotext-extracted handbook. PDF route fails because
// Anthropic caps document blocks at 600 pages; the handbook exceeds that.
const TEXT_PATH = arg("text", "roleplays/data/amc-handbook.txt")!;
// 3 cases per batch keeps output under 8000 token cap. Sonnet was hitting
// stop_reason=max_tokens at batch=6 and truncating JSON.
const BATCH = num("batch", 3);
const START = num("start", 1);
const END = num("end", 151);
const OUT_PATH = arg("out", "roleplays/data/amc-handbook-extracted.json")!;

const KEY = process.env.ANTHROPIC_API_KEY;
if (!KEY) {
  console.error("Missing ANTHROPIC_API_KEY");
  process.exit(1);
}

if (!fs.existsSync(TEXT_PATH)) {
  console.error(`Text not found: ${TEXT_PATH}`);
  console.error('Generate it with: pdftotext -layout "<handbook.pdf>" roleplays/data/amc-handbook.txt');
  process.exit(1);
}

const anthropic = new Anthropic({ apiKey: KEY });
// Haiku 4.5 — 5x cheaper than Sonnet, plenty for structured extraction.
// Sonnet was costing ~$0.12/batch in cache reads alone with the 1.6MB handbook.
const MODEL = "claude-haiku-4-5-20251001";

// ── Schema ──────────────────────────────────────────────────────────────
const SCENARIO_SCHEMA = {
  type: "object" as const,
  properties: {
    scenarios: {
      type: "array",
      items: {
        type: "object",
        properties: {
          mcatNumber: { type: "string", description: 'e.g. "033" — pad with leading zeros to 3 digits' },
          title: { type: "string" },
          category: { type: "string", enum: ["C", "D", "M", "D/M", "LEO"] },
          subcategory: { type: "string" },
          difficulty: { type: "string", enum: ["Easy", "Medium", "Hard"] },
          patientProfile: { type: "string" },
          chiefComplaint: { type: "string" },
          candidateInfo: { type: "string" },
          tasks: { type: "array", items: { type: "string" }, minItems: 1 },
          openingStatement: { type: "string" },
          historyWithoutPrompting: { type: "string" },
          historyWithPrompting: { type: "string" },
          patientQuestions: { type: "array", items: { type: "string" } },
          physicalExaminationFindings: { type: "string" },
          aimsOfStation: { type: "string" },
          expectationsOfPerformance: { type: "array", items: { type: "string" }, minItems: 1 },
          keyIssues: { type: "array", items: { type: "string" }, minItems: 1 },
          criticalErrors: { type: "array", items: { type: "string" } },
          commentary: { type: "string" },
          underlyingDiagnosis: { type: "string" },
          differentialDiagnosis: { type: "array", items: { type: "string" } },
        },
        required: [
          "mcatNumber",
          "title",
          "category",
          "subcategory",
          "difficulty",
          "patientProfile",
          "chiefComplaint",
          "candidateInfo",
          "tasks",
          "openingStatement",
          "historyWithoutPrompting",
          "historyWithPrompting",
          "patientQuestions",
          "aimsOfStation",
          "expectationsOfPerformance",
          "keyIssues",
          "criticalErrors",
          "commentary",
          "underlyingDiagnosis",
          "differentialDiagnosis",
        ],
        additionalProperties: false,
      },
    },
  },
  required: ["scenarios"],
  additionalProperties: false,
};

const SYSTEM = `You are extracting clinical assessment scenarios from the AMC Handbook of Clinical Assessment (Australian Medical Council, 2007). The PDF you received is the full handbook with 151 numbered Conditions.

For each requested condition number, extract ALL fields from the handbook VERBATIM or as a faithful condensation. NEVER invent, extrapolate, or add clinical content not in the source.

Field guide:
- mcatNumber: zero-padded 3-digit, e.g. "033"
- title: the full handbook title
- category: top-level letter — C (Communication), D (Diagnosis), M (Management), D/M (combined), LEO (Legal/Ethical)
- subcategory: full subcategory line as printed in the handbook (e.g. "2-A The Diagnostic Process — History-taking and Problem-Solving")
- difficulty: your reasonable judgment from the case complexity ("Easy", "Medium", "Hard")
- patientProfile: brief identity line shown to candidate
- chiefComplaint: short label for the case (the patient's own words, ≤6 words)
- candidateInfo: the full candidate-info paragraph from "Candidate's Tasks" section
- tasks: bulleted list of tasks
- openingStatement: verbatim opening line from "Opening Gambit"/"Patient's Opening" section
- historyWithoutPrompting: what the patient volunteers
- historyWithPrompting: what the patient reveals only when asked (combine all "if asked" sections)
- patientQuestions: any questions the simulated patient may ask the doctor
- physicalExaminationFindings: only fill if the handbook lists exam findings
- aimsOfStation: from "Aims of Station" / "Aims of this Station"
- expectationsOfPerformance: bulleted list from "Performance Guidelines — Expectations"
- keyIssues: from "Key Issues"
- criticalErrors: from "Critical Errors" (empty array if none listed)
- commentary: from "Commentary"
- underlyingDiagnosis: as stated in the handbook
- differentialDiagnosis: from any differential diagnosis list

Rules:
- Stay faithful to the source. Light condensation OK; invention NOT.
- If a field is genuinely absent in the handbook, return an empty string or empty array — never make something up.
- Pad mcatNumber to 3 digits.
- Return all requested cases in one call via the save_scenarios tool.`;

interface ExtractedScenario {
  mcatNumber: string;
  title: string;
  category: string;
  subcategory: string;
  difficulty: string;
  patientProfile: string;
  chiefComplaint: string;
  candidateInfo: string;
  tasks: string[];
  openingStatement: string;
  historyWithoutPrompting: string;
  historyWithPrompting: string;
  patientQuestions: string[];
  physicalExaminationFindings?: string;
  aimsOfStation: string;
  expectationsOfPerformance: string[];
  keyIssues: string[];
  criticalErrors: string[];
  commentary: string;
  underlyingDiagnosis: string;
  differentialDiagnosis: string[];
}

function sliceForRange(handbookLines: string[], from: number, to: number): string {
  // Estimate line range for the requested case numbers. The handbook is roughly
  // uniformly distributed across 151 conditions; we send a generous window to
  // ensure full coverage including overlapping sections (Candidate Info,
  // Performance Guidelines, Details all reference the same condition).
  const TOTAL = handbookLines.length;
  const PER_CASE = TOTAL / 151;
  const BUFFER_BEFORE = Math.floor(PER_CASE * 1.5);
  const BUFFER_AFTER = Math.floor(PER_CASE * 1.5);
  const start = Math.max(0, Math.floor((from - 1) * PER_CASE) - BUFFER_BEFORE);
  const end = Math.min(TOTAL, Math.ceil(to * PER_CASE) + BUFFER_AFTER);
  return handbookLines.slice(start, end).join("\n");
}

async function extractBatch(handbookLines: string[], from: number, to: number): Promise<ExtractedScenario[]> {
  const range = Array.from({ length: to - from + 1 }, (_, i) => from + i)
    .map((n) => n.toString().padStart(3, "0"))
    .join(", ");
  const slice = sliceForRange(handbookLines, from, to);

  const params = {
    model: MODEL,
    max_tokens: 8000,
    temperature: 0.1,
    system: [
      {
        type: "text",
        text: SYSTEM,
        cache_control: { type: "ephemeral" },
      },
    ],
    tools: [
      {
        name: "save_scenarios",
        description: "Save the extracted scenarios.",
        input_schema: SCENARIO_SCHEMA,
      },
    ],
    tool_choice: { type: "tool", name: "save_scenarios" },
    messages: [
      {
        role: "user",
        content: `=== AMC HANDBOOK SLICE (covers conditions ${range} and surrounding context) ===\n\n${slice}\n\n=== END SLICE ===\n\nExtract conditions ${range}. Return them in order via the save_scenarios tool.`,
      },
    ],
  };
  const response = (await anthropic.messages.create(
    params as unknown as Parameters<typeof anthropic.messages.create>[0]
  )) as Anthropic.Message;
  const tool = response.content.find((b) => b.type === "tool_use");
  if (!tool || tool.type !== "tool_use") throw new Error("No tool_use in response");
  const raw = tool.input as { scenarios?: ExtractedScenario[] } | ExtractedScenario[];
  // Claude occasionally returns the array directly or under a different key.
  let scenarios: ExtractedScenario[] | undefined;
  if (Array.isArray(raw)) scenarios = raw;
  else if (Array.isArray((raw as { scenarios?: ExtractedScenario[] }).scenarios))
    scenarios = (raw as { scenarios: ExtractedScenario[] }).scenarios;
  if (!scenarios) {
    console.error(`   raw tool input keys: ${Object.keys(raw as object).join(", ")}`);
    throw new Error(`No scenarios array — stop_reason=${response.stop_reason}`);
  }
  return scenarios;
}

async function main() {
  console.log(`Loading handbook text: ${TEXT_PATH}`);
  const handbook = fs.readFileSync(TEXT_PATH, "utf8");
  const handbookLines = handbook.split("\n");
  console.log(`Size: ${(handbook.length / 1024).toFixed(0)}KB, ${handbookLines.length} lines`);

  // Resume support — load already-extracted scenarios if file exists.
  const outAbs = path.resolve(OUT_PATH);
  fs.mkdirSync(path.dirname(outAbs), { recursive: true });
  let extracted: ExtractedScenario[] = [];
  if (fs.existsSync(outAbs)) {
    extracted = JSON.parse(fs.readFileSync(outAbs, "utf8"));
    console.log(`Resumed: already have ${extracted.length} scenarios in ${OUT_PATH}`);
  }
  const have = new Set(extracted.map((s) => s.mcatNumber));

  for (let from = START; from <= END; from += BATCH) {
    const to = Math.min(from + BATCH - 1, END);
    const allHave = Array.from({ length: to - from + 1 }, (_, i) =>
      (from + i).toString().padStart(3, "0")
    ).every((n) => have.has(n));
    if (allHave) {
      console.log(`[skip] conditions ${from}-${to} — already extracted`);
      continue;
    }

    console.log(`\n→ Extracting conditions ${from}-${to}…`);
    try {
      const batch = await extractBatch(handbookLines, from, to);
      for (const s of batch) {
        if (have.has(s.mcatNumber)) continue;
        extracted.push(s);
        have.add(s.mcatNumber);
        console.log(`   ✓ ${s.mcatNumber} — ${s.title}`);
      }
      // Save after each batch so a crash doesn't lose work.
      fs.writeFileSync(outAbs, JSON.stringify(extracted, null, 2));
    } catch (err) {
      console.error(`[error] batch ${from}-${to}:`, err instanceof Error ? err.message : err);
    }
  }

  console.log(`\nDone. ${extracted.length} scenarios saved to ${OUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
