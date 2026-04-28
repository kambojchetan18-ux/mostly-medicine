#!/usr/bin/env npx ts-node
/**
 * Validates that all question IDs are unique across specialty files.
 * Run: npx ts-node scripts/check-duplicate-ids.ts
 * Exit code 1 if duplicates found (CI-friendly).
 */

import * as fs from "fs";
import * as path from "path";

const CONTENT_DIR = path.resolve(__dirname, "../packages/content/src");

const files = fs
  .readdirSync(CONTENT_DIR)
  .filter((f) => f.startsWith("questions-") && f.endsWith(".ts"));

const allIds: { id: string; file: string; line: number }[] = [];
const idRegex = /id:\s*"([^"]+)"/g;

for (const file of files) {
  const content = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    let match;
    idRegex.lastIndex = 0;
    while ((match = idRegex.exec(lines[i])) !== null) {
      allIds.push({ id: match[1], file, line: i + 1 });
    }
  }
}

const seen = new Map<string, { file: string; line: number }>();
const duplicates: { id: string; locations: { file: string; line: number }[] }[] = [];

for (const entry of allIds) {
  const existing = seen.get(entry.id);
  if (existing) {
    const dup = duplicates.find((d) => d.id === entry.id);
    if (dup) {
      dup.locations.push({ file: entry.file, line: entry.line });
    } else {
      duplicates.push({
        id: entry.id,
        locations: [existing, { file: entry.file, line: entry.line }],
      });
    }
  } else {
    seen.set(entry.id, { file: entry.file, line: entry.line });
  }
}

console.log(`Scanned ${files.length} files, ${allIds.length} total question IDs.`);

if (duplicates.length === 0) {
  console.log("No duplicate question IDs found.");
  process.exit(0);
} else {
  console.error(`\nFOUND ${duplicates.length} DUPLICATE QUESTION IDs:\n`);
  for (const d of duplicates) {
    console.error(`  "${d.id}":`);
    for (const loc of d.locations) {
      console.error(`    - ${loc.file}:${loc.line}`);
    }
  }
  process.exit(1);
}
