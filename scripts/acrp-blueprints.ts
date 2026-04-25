#!/usr/bin/env npx ts-node
/**
 * AI Clinical RolePlay Cases — Blueprint synthesis
 *
 * Reads tagged rows from acrp_sources, groups them by category, and asks
 * Claude to synthesise reusable presentation-family blueprints. One Claude
 * call per category produces multiple blueprints (one per cluster found).
 *
 * Source PDFs are NOT re-read — only the structured metadata extracted in
 * the ingestion step is sent to the model. Sources are reference material
 * that informs the blueprint shape; no source wording is reproduced.
 *
 * Run from monorepo root (after acrp-ingest.ts has populated acrp_sources):
 *
 *   ANTHROPIC_API_KEY=sk-ant-... \
 *   NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=eyJ... \
 *   npx ts-node scripts/acrp-blueprints.ts
 *
 * Optional flags:
 *   --category "Endocrine & Metabolic"   only synthesise this category
 *   --redo                                regenerate even if blueprints exist
 *   --difficulty easy|medium|hard         force a difficulty (default: mixed)
 */
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

// ── Config ──────────────────────────────────────────────────────────────
const MODEL = "claude-sonnet-4-6";

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(`--${name}`);
const arg = (name: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const ONLY_CATEGORY = arg("category");
const REDO = flag("redo");
const FORCE_DIFFICULTY = arg("difficulty") as "easy" | "medium" | "hard" | undefined;

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!ANTHROPIC_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing env: ANTHROPIC_API_KEY / NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// ── Schemas + prompts (inline for ts-node) ──────────────────────────────
const ACRP_CATEGORIES = [
  "Endocrine & Metabolic",
  "Infectious Diseases",
  "Respiratory & Sleep",
  "Hematology & Oncology",
  "General Medicine Symptoms",
  "Emergency Presentations",
  "Travel & Sexual Health",
  "Renal & Urinary",
];

const diagnosisItem = {
  type: "object" as const,
  properties: {
    name: { type: "string" },
    prevalence: { type: "string", enum: ["common", "uncommon", "rare"] },
    mustNotMiss: { type: "boolean" },
  },
  required: ["name", "prevalence"],
  additionalProperties: false,
};

const BLUEPRINT_BATCH_SCHEMA = {
  type: "object" as const,
  properties: {
    blueprints: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        properties: {
          slug: { type: "string" },
          familyName: { type: "string" },
          category: { type: "string", enum: ACRP_CATEGORIES },
          difficulty: { type: "string", enum: ["easy", "medium", "hard"] },
          presentationCluster: { type: "array", items: { type: "string" } },
          hiddenDiagnoses: { type: "array", items: diagnosisItem, minItems: 2 },
          distractorDiagnoses: { type: "array", items: diagnosisItem },
          redFlags: { type: "array", items: { type: "string" } },
          candidateTasks: { type: "array", items: { type: "string" } },
          settingOptions: { type: "array", items: { type: "string" } },
          ageBands: { type: "array", items: { type: "string" } },
          sourceFilenames: {
            type: "array",
            items: { type: "string" },
            description: "Filenames of source rows that informed this blueprint",
          },
        },
        required: [
          "slug",
          "familyName",
          "category",
          "difficulty",
          "presentationCluster",
          "hiddenDiagnoses",
          "distractorDiagnoses",
          "redFlags",
          "candidateTasks",
          "settingOptions",
          "ageBands",
          "sourceFilenames",
        ],
        additionalProperties: false,
      },
    },
  },
  required: ["blueprints"],
  additionalProperties: false,
};

const BLUEPRINT_SYSTEM_PROMPT = `You are a clinical curriculum designer building reusable AMC-style case blueprints.

You receive structured metadata from multiple source cases that share a category. You must synthesise multiple blueprints — one per distinct presentation family you can identify in the input.

A blueprint is a generator seed. It defines:
- the presentation cluster (overlapping symptoms across the sources)
- a pool of candidate hidden diagnoses with prevalence
- distractor diagnoses learners may consider
- red flags that any well-formed case in this family must allow eliciting
- candidate tasks (history, focused exam, counselling, management)
- setting and demographic variables for randomisation

Rules:
- Hidden-diagnosis pool must contain at least one "must-not-miss" diagnosis where clinically appropriate.
- presentationCluster items should be patient-language symptoms, not diagnoses.
- Do not echo any verbatim phrasing from the sources — synthesise.
- Slug must be kebab-case and globally unique within this category.
- Tag each blueprint with sourceFilenames it draws from.
- Aim for 3-8 blueprints per category, depending on how many distinct families the sources cover.`;

interface BlueprintOut {
  slug: string;
  familyName: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  presentationCluster: string[];
  hiddenDiagnoses: Array<{ name: string; prevalence: string; mustNotMiss?: boolean }>;
  distractorDiagnoses: Array<{ name: string; prevalence: string; mustNotMiss?: boolean }>;
  redFlags: string[];
  candidateTasks: string[];
  settingOptions: string[];
  ageBands: string[];
  sourceFilenames: string[];
}

interface SourceRow {
  id: string;
  filename: string;
  title: string;
  topic: string | null;
  category: string | null;
  complaint_cluster: string[];
  diagnosis_family: string[];
  clues: string[];
  red_flags: string[];
  management_themes: string[];
}

// ── Synthesise blueprints for a single category ─────────────────────────
async function synthesiseForCategory(category: string, sources: SourceRow[]): Promise<BlueprintOut[]> {
  const compactSources = sources.map((s) => ({
    filename: s.filename,
    title: s.title,
    topic: s.topic,
    complaintCluster: s.complaint_cluster,
    diagnosisFamily: s.diagnosis_family,
    clues: s.clues,
    redFlags: s.red_flags,
    managementThemes: s.management_themes,
  }));

  const userMessage = `Category: ${category}

Tagged source metadata (${sources.length} sources):
${JSON.stringify(compactSources, null, 2)}

Synthesise 3-8 reusable blueprints covering distinct presentation families found in these sources. ${
    FORCE_DIFFICULTY ? `Set difficulty to "${FORCE_DIFFICULTY}" for all blueprints.` : "Mix difficulties (easy/medium/hard) sensibly across the set."
  }`;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 8000,
    temperature: 0.3,
    system: [
      {
        type: "text",
        text: BLUEPRINT_SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    tools: [
      {
        name: "save_blueprints",
        description: "Save the synthesised blueprints for this category.",
        input_schema: BLUEPRINT_BATCH_SCHEMA,
      },
    ],
    tool_choice: { type: "tool", name: "save_blueprints" },
    messages: [{ role: "user", content: userMessage }],
  });

  const toolUse = response.content.find((b) => b.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error(`No tool_use block for category ${category}`);
  }
  const out = toolUse.input as { blueprints: BlueprintOut[] };
  return out.blueprints;
}

// ── Main ────────────────────────────────────────────────────────────────
async function main() {
  const { data: sources, error: sErr } = await supabase
    .from("acrp_sources")
    .select("id, filename, title, topic, category, complaint_cluster, diagnosis_family, clues, red_flags, management_themes")
    .order("category");
  if (sErr) throw sErr;
  if (!sources || sources.length === 0) {
    console.error("No rows in acrp_sources — run acrp-ingest.ts first.");
    process.exit(1);
  }

  const byCategory = new Map<string, SourceRow[]>();
  for (const s of sources as SourceRow[]) {
    if (!s.category) continue;
    if (ONLY_CATEGORY && s.category !== ONLY_CATEGORY) continue;
    const list = byCategory.get(s.category) ?? [];
    list.push(s);
    byCategory.set(s.category, list);
  }

  if (byCategory.size === 0) {
    console.error("No sources matched the filter.");
    process.exit(1);
  }

  console.log(`Synthesising blueprints across ${byCategory.size} categories…`);

  let totalSaved = 0;
  for (const [category, list] of byCategory) {
    if (!REDO) {
      const { count } = await supabase
        .from("acrp_blueprints")
        .select("id", { count: "exact", head: true })
        .eq("category", category);
      if ((count ?? 0) > 0) {
        console.log(`[skip] ${category} — ${count} blueprints already exist (use --redo)`);
        continue;
      }
    }

    console.log(`\n→ ${category}: synthesising from ${list.length} sources`);
    try {
      const blueprints = await synthesiseForCategory(category, list);
      const filenameToId = new Map(list.map((s) => [s.filename, s.id]));

      for (const bp of blueprints) {
        const sourceIds = bp.sourceFilenames
          .map((fn) => filenameToId.get(fn))
          .filter((id): id is string => Boolean(id));

        const { error } = await supabase.from("acrp_blueprints").upsert(
          {
            slug: bp.slug,
            family_name: bp.familyName,
            category: bp.category,
            difficulty: bp.difficulty,
            presentation_cluster: bp.presentationCluster,
            hidden_diagnoses: bp.hiddenDiagnoses,
            distractor_diagnoses: bp.distractorDiagnoses,
            red_flags: bp.redFlags,
            candidate_tasks: bp.candidateTasks,
            setting_options: bp.settingOptions,
            age_bands: bp.ageBands,
            source_ids: sourceIds,
            blueprint: bp,
          },
          { onConflict: "slug" }
        );
        if (error) throw error;
        totalSaved++;
        console.log(`   ✓ ${bp.slug} (${bp.difficulty}) — ${bp.hiddenDiagnoses.length} hidden dx`);
      }
    } catch (err) {
      console.error(`[error] ${category}:`, err instanceof Error ? err.message : err);
    }
  }

  console.log(`\nDone. ${totalSaved} blueprints saved.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
