#!/usr/bin/env npx ts-node
/**
 * Validates that all question IDs across specialty files are unique.
 * Run: npx ts-node scripts/validate-question-ids.ts
 * Exit code 1 if duplicates found.
 */

import { allQuestions } from "../packages/content/src";

const seen = new Map<string, number>();
const duplicates: string[] = [];

for (const q of allQuestions) {
  const count = (seen.get(q.id) ?? 0) + 1;
  seen.set(q.id, count);
  if (count === 2) duplicates.push(q.id);
}

if (duplicates.length > 0) {
  console.error(`\n❌ Found ${duplicates.length} duplicate question IDs:\n`);
  for (const id of duplicates.slice(0, 20)) {
    console.error(`  - ${id}`);
  }
  if (duplicates.length > 20) {
    console.error(`  ... and ${duplicates.length - 20} more`);
  }
  process.exit(1);
} else {
  console.log(`✅ All ${allQuestions.length} question IDs are unique.`);
}
