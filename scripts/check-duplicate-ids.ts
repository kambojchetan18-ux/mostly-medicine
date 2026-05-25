#!/usr/bin/env npx ts-node
/**
 * Build-time validation: ensures every question ID in @mostly-medicine/content
 * is unique across all specialty files.
 *
 * Run from monorepo root:
 *   npx ts-node scripts/check-duplicate-ids.ts
 *
 * Exits 0 if all IDs are unique, 1 if duplicates are found.
 */

import { allQuestions } from "../packages/content/src/index";

const idCounts = new Map<string, number>();

for (const q of allQuestions) {
  idCounts.set(q.id, (idCounts.get(q.id) ?? 0) + 1);
}

const duplicates = [...idCounts.entries()].filter(([, count]) => count > 1);

if (duplicates.length > 0) {
  console.error(`\nDUPLICATE QUESTION IDS FOUND (${duplicates.length}):\n`);
  for (const [id, count] of duplicates) {
    console.error(`  "${id}" appears ${count} times`);
  }
  console.error("");
  process.exit(1);
}

console.log(
  `All ${allQuestions.length} question IDs are unique. No duplicates found.`
);
process.exit(0);
