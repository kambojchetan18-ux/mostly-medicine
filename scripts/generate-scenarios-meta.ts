#!/usr/bin/env npx ts-node
/**
 * Generate `packages/ai/src/scenarios-meta.ts` from the full scenarios data
 * in `packages/ai/src/scenarios.ts`.
 *
 * The metadata file is what gets imported into client/mobile bundles via
 * the `mobile.ts` entry. Keeping it lightweight (no historyWithoutPrompting,
 * no commentary, no exam findings, no performance guidelines) drops the
 * client chunk for /dashboard/cat2 by ~500 kB.
 *
 * Run after editing scenarios.ts:
 *   npx ts-node scripts/generate-scenarios-meta.ts
 */
import { writeFileSync } from "fs";
import path from "path";
import { scenarios } from "../packages/ai/src/scenarios";

const META_FIELDS = [
  "id",
  "mcatNumber",
  "title",
  "category",
  "subcategory",
  "difficulty",
  "source",
  "patientProfile",
  "chiefComplaint",
  "candidateInfo",
  "tasks",
  "openingStatement",
] as const;

const meta = scenarios.map((s) => {
  const out: Record<string, unknown> = {};
  for (const k of META_FIELDS) out[k] = (s as unknown as Record<string, unknown>)[k];
  return out;
});

const header = `// AUTO-GENERATED — do not edit by hand.
// Lightweight metadata view of scenarios.ts for client bundles.
// Regenerate via scripts/generate-scenarios-meta.ts after editing scenarios.ts.

export interface ScenarioMeta {
  id: number;
  mcatNumber: string;
  title: string;
  category: "C" | "D" | "M" | "D/M" | "LEO";
  subcategory: string;
  difficulty: "Easy" | "Medium" | "Hard";
  source: string;
  patientProfile: string;
  chiefComplaint: string;
  candidateInfo: string;
  tasks: string[];
  openingStatement: string;
}

export const scenariosMeta: ScenarioMeta[] = `;

const out = header + JSON.stringify(meta, null, 2) + ";\n";
const outPath = path.join(__dirname, "..", "packages", "ai", "src", "scenarios-meta.ts");
writeFileSync(outPath, out);
console.log(`[generate-scenarios-meta] wrote ${outPath} (${(out.length / 1024).toFixed(1)} kB, ${meta.length} entries)`);
