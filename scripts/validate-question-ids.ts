#!/usr/bin/env npx ts-node
/**
 * Validate question ID uniqueness across all content files.
 *
 * Run from the monorepo root:
 *
 *   npx ts-node --skip-project --transpile-only \
 *     --compiler-options '{"module":"node16","moduleResolution":"node16","esModuleInterop":true}' \
 *     scripts/validate-question-ids.ts
 *
 * Exits 0 if all IDs are unique, 1 if duplicates are found.
 */

import { allQuestions } from "../packages/content/src/index";

const seen = new Map<string, { topic: string; index: number }>();
const duplicates: { id: string; occurrences: { topic: string }[] }[] = [];

for (let i = 0; i < allQuestions.length; i++) {
  const q = allQuestions[i];
  const prev = seen.get(q.id);
  if (prev) {
    // Check if we already have an entry for this id in duplicates
    const existing = duplicates.find((d) => d.id === q.id);
    if (existing) {
      existing.occurrences.push({ topic: q.topic });
    } else {
      duplicates.push({
        id: q.id,
        occurrences: [{ topic: prev.topic }, { topic: q.topic }],
      });
    }
  } else {
    seen.set(q.id, { topic: q.topic, index: i });
  }
}

if (duplicates.length > 0) {
  console.error(`\n  DUPLICATE QUESTION IDS FOUND: ${duplicates.length}\n`);
  for (const dup of duplicates) {
    const topics = dup.occurrences.map((o) => o.topic).join(", ");
    console.error(`  ${dup.id}  (topics: ${topics})`);
  }
  console.error("");
  process.exit(1);
} else {
  console.log(`All ${allQuestions.length} question IDs are unique.`);
  process.exit(0);
}
