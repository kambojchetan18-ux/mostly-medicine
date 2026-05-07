#!/usr/bin/env npx ts-node
/**
 * Validates that all question IDs across specialty files are unique.
 * Run: npx ts-node scripts/validate-question-ids.ts
 * Exit code 1 if duplicates found, 0 if clean.
 */
import * as fs from "fs";
import * as path from "path";

const CONTENT_DIR = path.resolve(__dirname, "../packages/content/src");

const idRegex = /^\s*id:\s*["'`]([^"'`]+)["'`]/;

function extractIds(filePath: string): { id: string; line: number }[] {
  const lines = fs.readFileSync(filePath, "utf-8").split("\n");
  const ids: { id: string; line: number }[] = [];
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(idRegex);
    if (match) ids.push({ id: match[1], line: i + 1 });
  }
  return ids;
}

const files = fs
  .readdirSync(CONTENT_DIR)
  .filter((f) => f.startsWith("questions-") && f.endsWith(".ts"))
  .sort();

const globalIds = new Map<string, { file: string; line: number }[]>();
let totalQuestions = 0;

for (const file of files) {
  const fullPath = path.join(CONTENT_DIR, file);
  const ids = extractIds(fullPath);
  totalQuestions += ids.length;
  for (const { id, line } of ids) {
    const existing = globalIds.get(id) ?? [];
    existing.push({ file, line });
    globalIds.set(id, existing);
  }
}

const duplicates = [...globalIds.entries()].filter(([, locs]) => locs.length > 1);

console.log(`Scanned ${files.length} files, ${totalQuestions} questions, ${globalIds.size} unique IDs`);

if (duplicates.length > 0) {
  console.error(`\n${duplicates.length} DUPLICATE IDs found:\n`);
  for (const [id, locs] of duplicates) {
    console.error(`  ${id}:`);
    for (const { file, line } of locs) {
      console.error(`    ${file}:${line}`);
    }
  }
  process.exit(1);
} else {
  console.log("All question IDs are unique.");
  process.exit(0);
}
