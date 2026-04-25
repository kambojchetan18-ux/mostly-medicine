#!/usr/bin/env npx ts-node
/**
 * Build-time validation for question bank integrity.
 * Checks for duplicate IDs, invalid answer keys, and inconsistent difficulty values.
 *
 *   npx ts-node --project scripts/tsconfig.json --transpile-only scripts/validate-questions.ts
 */

import { allQuestions } from "../packages/content/src/index";

const VALID_DIFFICULTIES = new Set(["easy", "medium", "hard"]);
const VALID_LABELS = new Set(["A", "B", "C", "D", "E"]);

let errors = 0;

// Check for duplicate IDs
const idMap = new Map<string, number>();
for (const q of allQuestions) {
  const count = (idMap.get(q.id) ?? 0) + 1;
  idMap.set(q.id, count);
}
for (const [id, count] of idMap) {
  if (count > 1) {
    console.error(`[DUPLICATE ID] "${id}" appears ${count} times`);
    errors++;
  }
}

// Check each question for validity
for (const q of allQuestions) {
  if (!VALID_DIFFICULTIES.has(q.difficulty)) {
    console.error(`[INVALID DIFFICULTY] ${q.id}: "${q.difficulty}" (must be easy/medium/hard)`);
    errors++;
  }

  const optionLabels = new Set(q.options.map((o) => o.label));
  if (!optionLabels.has(q.correctAnswer)) {
    console.error(`[INVALID ANSWER] ${q.id}: correctAnswer "${q.correctAnswer}" not in option labels [${[...optionLabels].join(", ")}]`);
    errors++;
  }

  for (const opt of q.options) {
    if (!VALID_LABELS.has(opt.label)) {
      console.error(`[INVALID LABEL] ${q.id}: option label "${opt.label}" not in A-E`);
      errors++;
    }
  }

  if (!q.stem.trim()) {
    console.error(`[EMPTY STEM] ${q.id}`);
    errors++;
  }

  if (!q.topic.trim()) {
    console.error(`[EMPTY TOPIC] ${q.id}`);
    errors++;
  }
}

// Summary
const topics = new Set(allQuestions.map((q) => q.topic));
console.log(`\nValidated ${allQuestions.length} questions across ${topics.size} topics`);
console.log(`Unique IDs: ${idMap.size}`);
if (errors > 0) {
  console.error(`\n${errors} error(s) found!`);
  process.exit(1);
} else {
  console.log("All checks passed.");
}
