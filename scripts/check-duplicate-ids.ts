import * as fs from "fs";
import * as path from "path";

const CONTENT_DIR = path.join(__dirname, "..", "packages", "content", "src");

function extractIds(filePath: string): string[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const ids: string[] = [];
  const regex = /id:\s*["']([^"']+)["']/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    ids.push(match[1]);
  }
  return ids;
}

const files = fs
  .readdirSync(CONTENT_DIR)
  .filter((f) => f.startsWith("questions-") && f.endsWith(".ts"));

const allIds: Map<string, string[]> = new Map();
let duplicateCount = 0;

for (const file of files) {
  const filePath = path.join(CONTENT_DIR, file);
  const ids = extractIds(filePath);
  for (const id of ids) {
    const sources = allIds.get(id) ?? [];
    sources.push(file);
    allIds.set(id, sources);
  }
}

for (const [id, sources] of allIds) {
  if (sources.length > 1) {
    console.error(`DUPLICATE: "${id}" found in: ${sources.join(", ")}`);
    duplicateCount++;
  }
}

if (duplicateCount > 0) {
  console.error(`\n${duplicateCount} duplicate question ID(s) found.`);
  process.exit(1);
} else {
  console.log(`All ${allIds.size} question IDs are unique across ${files.length} files.`);
  process.exit(0);
}
