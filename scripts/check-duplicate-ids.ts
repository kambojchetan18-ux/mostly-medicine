#!/usr/bin/env ts-node
/**
 * Pre-commit check: scans all question files for duplicate IDs.
 * Exit code 1 if duplicates found (blocks commit).
 *
 * Usage:
 *   npx ts-node scripts/check-duplicate-ids.ts
 *   # Or as a pre-commit hook:
 *   # Add to .husky/pre-commit or package.json scripts
 */

import * as fs from "fs";
import * as path from "path";

const CONTENT_DIR = path.resolve(__dirname, "../packages/content/src");
const ID_REGEX = /id:\s*["']([^"']+)["']/g;

function main() {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.startsWith("questions-") && f.endsWith(".ts"));
  const allIds = new Map<string, string[]>();

  for (const file of files) {
    const content = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
    let match: RegExpExecArray | null;
    while ((match = ID_REGEX.exec(content)) !== null) {
      const id = match[1];
      const existing = allIds.get(id) ?? [];
      existing.push(file);
      allIds.set(id, existing);
    }
  }

  const duplicates = [...allIds.entries()].filter(([, files]) => files.length > 1);

  if (duplicates.length === 0) {
    console.log(`✓ ${allIds.size} question IDs checked — no duplicates found.`);
    process.exit(0);
  }

  console.error(`✗ ${duplicates.length} DUPLICATE question IDs found:\n`);
  for (const [id, files] of duplicates.sort((a, b) => a[0].localeCompare(b[0]))) {
    console.error(`  ${id}  →  ${files.join(", ")}`);
  }
  console.error(`\nFix: assign unique IDs to the second occurrence of each duplicate.`);
  process.exit(1);
}

main();
