#!/usr/bin/env npx ts-node
/**
 * Validate that all MCQ question IDs across packages/content are unique.
 *
 * Run from monorepo root:
 *   npx ts-node scripts/validate-question-ids.ts
 *
 * Exits 0 if all IDs are unique, 1 if duplicates found.
 */
import { allQuestions } from "../packages/content/src/index";

const seen = new Map<string, string[]>();

for (const q of allQuestions) {
  const locations = seen.get(q.id) ?? [];
  locations.push(`${q.topic} / ${q.subtopic}`);
  seen.set(q.id, locations);
}

const dupes = [...seen.entries()].filter(([, locs]) => locs.length > 1);

if (dupes.length === 0) {
  console.log(`All ${allQuestions.length} question IDs are unique.`);
  process.exit(0);
} else {
  console.error(`Found ${dupes.length} duplicate question ID(s):\n`);
  for (const [id, locs] of dupes) {
    console.error(`  "${id}" appears ${locs.length} times:`);
    for (const loc of locs) console.error(`    - ${loc}`);
  }
  process.exit(1);
}
