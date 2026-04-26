#!/usr/bin/env npx ts-node
/**
 * Validates that all question IDs are unique across specialty files.
 * Run: npx ts-node scripts/validate-question-ids.ts
 * Exit code 1 if duplicates found.
 */
import { allQuestions } from "../packages/content/src";

const seen = new Map<string, string[]>();

for (const q of allQuestions) {
  const existing = seen.get(q.id);
  if (existing) {
    existing.push(q.topic);
  } else {
    seen.set(q.id, [q.topic]);
  }
}

const duplicates = [...seen.entries()].filter(([, topics]) => topics.length > 1);

if (duplicates.length === 0) {
  console.log(`✓ All ${allQuestions.length} question IDs are unique.`);
  process.exit(0);
} else {
  console.error(`✗ Found ${duplicates.length} duplicate question IDs:\n`);
  for (const [id, topics] of duplicates.slice(0, 30)) {
    console.error(`  ${id}  →  appears in: ${[...new Set(topics)].join(", ")}`);
  }
  if (duplicates.length > 30) {
    console.error(`  ... and ${duplicates.length - 30} more`);
  }
  console.error(`\nTotal questions: ${allQuestions.length}, Duplicates: ${duplicates.length}`);
  process.exit(1);
}
