#!/usr/bin/env npx ts-node
/**
 * Merge extracted AMC handbook scenarios into packages/ai/src/scenarios.ts.
 *
 * Reads roleplays/data/amc-handbook-extracted.json, deduplicates against the
 * existing 11 hand-written scenarios in scenarios.ts (preferring the existing
 * hand-written ones for duplicates), and emits a fresh scenarios.ts containing
 * the union, with the same Scenario interface and provenance comments.
 *
 *   npx ts-node --project scripts/tsconfig.json --transpile-only \
 *     scripts/amc-merge-scenarios.ts
 */
import fs from "fs";

interface Extracted {
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

const JSON_PATH = "roleplays/data/amc-handbook-extracted.json";
const SCENARIOS_PATH = "packages/ai/src/scenarios.ts";

const extracted: Extracted[] = JSON.parse(fs.readFileSync(JSON_PATH, "utf8"));

// Parse existing scenarios.ts to find which mcatNumbers are already present.
const existingTs = fs.readFileSync(SCENARIOS_PATH, "utf8");
const existingNumbers = new Set<string>(
  Array.from(existingTs.matchAll(/mcatNumber:\s*"(\d+)"/g)).map((m) => m[1])
);
console.log(`Existing scenarios: ${existingNumbers.size} mcatNumbers found`);

// Filter out any extracted ones that already exist (existing hand-written are gold).
const toAdd = extracted.filter((s) => !existingNumbers.has(s.mcatNumber));
console.log(`Extracted: ${extracted.length}, new to add: ${toAdd.length}`);

// Build TypeScript object literals for each new scenario.
function esc(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");
}
function escArr(arr: string[]): string {
  return arr.map((s) => `\`${esc(s)}\``).join(", ");
}

const numericId = (n: string) => parseInt(n, 10);

const newEntries = toAdd
  .sort((a, b) => numericId(a.mcatNumber) - numericId(b.mcatNumber))
  .map((s) => {
    const cat = ["C", "D", "M", "D/M", "LEO"].includes(s.category) ? s.category : "D";
    const diff = ["Easy", "Medium", "Hard"].includes(s.difficulty) ? s.difficulty : "Medium";
    return `  // ── CONDITION ${s.mcatNumber} ────────────────────────────────────────────────────
  {
    id: ${numericId(s.mcatNumber)},
    mcatNumber: "${s.mcatNumber}",
    title: \`${esc(s.title)}\`,
    category: "${cat}" as const,
    subcategory: \`${esc(s.subcategory || "")}\`,
    difficulty: "${diff}" as const,
    source: "AMC Handbook of Clinical Assessment (Australian Medical Council, 2007), Condition ${s.mcatNumber}",
    patientProfile: \`${esc(s.patientProfile || "")}\`,
    chiefComplaint: \`${esc(s.chiefComplaint || "")}\`,
    candidateInfo: \`${esc(s.candidateInfo || "")}\`,
    tasks: [${escArr(s.tasks ?? [])}],
    openingStatement: \`${esc(s.openingStatement || "")}\`,
    historyWithoutPrompting: \`${esc(s.historyWithoutPrompting || "")}\`,
    historyWithPrompting: \`${esc(s.historyWithPrompting || "")}\`,
    patientQuestions: [${escArr(s.patientQuestions ?? [])}],
    ${s.physicalExaminationFindings ? `physicalExaminationFindings: \`${esc(s.physicalExaminationFindings)}\`,` : ""}
    aimsOfStation: \`${esc(s.aimsOfStation || "")}\`,
    expectationsOfPerformance: [${escArr(s.expectationsOfPerformance ?? [])}],
    keyIssues: [${escArr(s.keyIssues ?? [])}],
    criticalErrors: [${escArr(s.criticalErrors ?? [])}],
    commentary: \`${esc(s.commentary || "")}\`,
    underlyingDiagnosis: \`${esc(s.underlyingDiagnosis || "")}\`,
    differentialDiagnosis: [${escArr(s.differentialDiagnosis ?? [])}],
  },`;
  })
  .join("\n");

// Inject before the closing `]` of the scenarios array.
const closingMatch = existingTs.match(/(\];\s*\n*\nexport function getScenario)/);
if (!closingMatch) {
  console.error("Could not locate scenarios array close + getScenario in scenarios.ts");
  process.exit(1);
}

const updated = existingTs.replace(
  closingMatch[1],
  `\n${newEntries}\n${closingMatch[1]}`
);

fs.writeFileSync(SCENARIOS_PATH, updated);
console.log(`✓ Wrote ${SCENARIOS_PATH}, added ${toAdd.length} scenarios`);
console.log(`Total now: ${existingNumbers.size + toAdd.length} scenarios`);
