#!/usr/bin/env node
// Validates that every question id in packages/content/src/questions-*.ts is
// globally unique across all topic files. Exits non-zero on any duplicate so
// it can be wired into pre-push hooks / CI.
//
// Run from monorepo root:
//   node scripts/check-question-ids.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.join(__dirname, "..", "packages", "content", "src");
const re = /id:\s*"([^"]+)"/g;

const seen = new Map(); // id -> [file, ...]
let totalIds = 0;

for (const f of fs.readdirSync(contentDir)) {
  if (!/^questions.*\.ts$/.test(f)) continue;
  const src = fs.readFileSync(path.join(contentDir, f), "utf-8");
  let m;
  while ((m = re.exec(src)) !== null) {
    totalIds++;
    const id = m[1];
    const list = seen.get(id);
    if (list) list.push(f);
    else seen.set(id, [f]);
  }
}

const dupes = [...seen.entries()].filter(([, files]) => files.length > 1);
console.log(`Total ids: ${totalIds}`);
console.log(`Unique ids: ${seen.size}`);
console.log(`Duplicate ids: ${dupes.length}`);

if (dupes.length > 0) {
  console.error("\nDUPLICATE QUESTION IDS:");
  for (const [id, files] of dupes.slice(0, 25)) {
    console.error(`  ${id} → ${files.join(", ")}`);
  }
  if (dupes.length > 25) console.error(`  …and ${dupes.length - 25} more`);
  process.exit(1);
}
console.log("✓ all question ids are unique");
