#!/usr/bin/env ts-node
/**
 * Validates that all MCQ question IDs are unique across specialty files.
 * Run: npx ts-node scripts/validate-question-ids.ts
 * Exit code 1 if duplicates found.
 */
import { allQuestions } from "@mostly-medicine/content";

const seen = new Map<string, string>();
const duplicates: Array<{ id: string; firstTopic: string; secondTopic: string }> = [];

for (const q of allQuestions) {
  const existing = seen.get(q.id);
  if (existing) {
    duplicates.push({ id: q.id, firstTopic: existing, secondTopic: q.topic });
  } else {
    seen.set(q.id, q.topic);
  }
}

if (duplicates.length > 0) {
  console.error(`\n❌ Found ${duplicates.length} duplicate question ID(s):\n`);
  for (const d of duplicates) {
    console.error(`  ID: ${d.id}`);
    console.error(`    First:  ${d.firstTopic}`);
    console.error(`    Second: ${d.secondTopic}\n`);
  }
  process.exit(1);
} else {
  console.log(`✅ All ${seen.size} question IDs are unique.`);
  process.exit(0);
}
