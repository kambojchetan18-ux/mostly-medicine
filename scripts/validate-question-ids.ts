/**
 * validate-question-ids.ts
 *
 * Checks for duplicate question IDs across all content files in
 * packages/content/src/. Exits with code 1 if duplicates are found.
 *
 * Usage:
 *   npx ts-node scripts/validate-question-ids.ts
 */

import * as path from "path";

// ── Colour helpers (no dependencies) ────────────────────────────────
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

// ── Import every question array with its source file ────────────────
import { seedQuestions } from "../packages/content/src/questions";
import { cardiovascularQuestions } from "../packages/content/src/questions-cardiovascular";
import { respiratoryQuestions } from "../packages/content/src/questions-respiratory";
import { gastroQuestions } from "../packages/content/src/questions-gastro";
import { neurologyQuestions } from "../packages/content/src/questions-neurology";
import { endocrineQuestions } from "../packages/content/src/questions-endocrine";
import { psychiatryQuestions } from "../packages/content/src/questions-psychiatry";
import { paediatricsQuestions } from "../packages/content/src/questions-paediatrics";
import { obsgynQuestions } from "../packages/content/src/questions-obsgyn";
import { emergencyQuestions } from "../packages/content/src/questions-emergency";
import { renalQuestions } from "../packages/content/src/questions-renal";
import { rheumatologyQuestions } from "../packages/content/src/questions-rheumatology";
import { infectiousQuestions } from "../packages/content/src/questions-infectious";
import { surgeryQuestions } from "../packages/content/src/questions-surgery";
import { pharmacologyQuestions } from "../packages/content/src/questions-pharmacology";
import { dermatologyQuestions } from "../packages/content/src/questions-dermatology";

import type { MCQuestion } from "../packages/content/src/questions";

// ── Map each array to its source filename ───────────────────────────
const questionSources: { file: string; questions: MCQuestion[] }[] = [
  { file: "questions.ts", questions: seedQuestions },
  { file: "questions-cardiovascular.ts", questions: cardiovascularQuestions },
  { file: "questions-respiratory.ts", questions: respiratoryQuestions },
  { file: "questions-gastro.ts", questions: gastroQuestions },
  { file: "questions-neurology.ts", questions: neurologyQuestions },
  { file: "questions-endocrine.ts", questions: endocrineQuestions },
  { file: "questions-psychiatry.ts", questions: psychiatryQuestions },
  { file: "questions-paediatrics.ts", questions: paediatricsQuestions },
  { file: "questions-obsgyn.ts", questions: obsgynQuestions },
  { file: "questions-emergency.ts", questions: emergencyQuestions },
  { file: "questions-renal.ts", questions: renalQuestions },
  { file: "questions-rheumatology.ts", questions: rheumatologyQuestions },
  { file: "questions-infectious.ts", questions: infectiousQuestions },
  { file: "questions-surgery.ts", questions: surgeryQuestions },
  { file: "questions-pharmacology.ts", questions: pharmacologyQuestions },
  { file: "questions-dermatology.ts", questions: dermatologyQuestions },
];

// ── Scan for duplicates ─────────────────────────────────────────────
const CONTENT_DIR = path.resolve(__dirname, "../packages/content/src");

// id -> list of files where it appears
const idMap = new Map<string, string[]>();
let totalQuestions = 0;

for (const { file, questions } of questionSources) {
  for (const q of questions) {
    totalQuestions++;
    const existing = idMap.get(q.id);
    if (existing) {
      existing.push(file);
    } else {
      idMap.set(q.id, [file]);
    }
  }
}

// ── Report ──────────────────────────────────────────────────────────
const duplicates = new Map<string, string[]>();
for (const [id, files] of idMap) {
  if (files.length > 1) {
    duplicates.set(id, files);
  }
}

console.log(
  `\n${BOLD}${CYAN}Question ID Validator${RESET}`
);
console.log(
  `${CYAN}Scanned ${questionSources.length} files, ${totalQuestions} questions total${RESET}\n`
);

if (duplicates.size === 0) {
  console.log(
    `${GREEN}${BOLD}All ${totalQuestions} question IDs are unique.${RESET}\n`
  );
  process.exit(0);
} else {
  console.log(
    `${RED}${BOLD}Found ${duplicates.size} duplicate ID(s):${RESET}\n`
  );

  for (const [id, files] of duplicates) {
    console.log(`  ${YELLOW}${BOLD}${id}${RESET}`);
    for (const file of files) {
      console.log(`    ${RED}- ${path.join(CONTENT_DIR, file)}${RESET}`);
    }
    console.log();
  }

  console.log(
    `${RED}${BOLD}Validation failed.${RESET} Fix the duplicate IDs above and re-run.\n`
  );
  process.exit(1);
}
