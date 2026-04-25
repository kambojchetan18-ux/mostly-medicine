#!/usr/bin/env npx ts-node
/**
 * AI Clinical RolePlay Cases — pre-fill case cache pool
 *
 * For each blueprint that has fewer than TARGET_CASES_PER_BLUEPRINT cases
 * stored, generate the difference. Once filled, every user click on a
 * blueprint card returns an existing case (instant + zero AI cost).
 *
 * Run from monorepo root after blueprint synthesis is done:
 *
 *   set -a && source apps/web/.env.local && set +a && \
 *   npx ts-node --project scripts/tsconfig.json --transpile-only \
 *     scripts/acrp-prefill-cases.ts
 *
 * Optional flags:
 *   --target 5     fill each blueprint to N cases (default 3)
 *   --category "..."  only one category
 *   --slug foo     only one blueprint
 */
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

const MODEL = "claude-haiku-4-5-20251001";

const args = process.argv.slice(2);
const arg = (n: string) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const TARGET = arg("target") ? parseInt(arg("target")!, 10) : 3;
const ONLY_CATEGORY = arg("category");
const ONLY_SLUG = arg("slug");

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

// ── Inline schema + prompt to keep script self-contained ────────────────
const clueItem = {
  type: "object" as const,
  properties: {
    trigger: { type: "string" },
    reveal: { type: "string" },
    significance: { type: "string", enum: ["key", "supporting", "distractor"] },
  },
  required: ["trigger", "reveal", "significance"],
  additionalProperties: false,
};

const CASE_VARIANT_SCHEMA = {
  type: "object" as const,
  properties: {
    seed: { type: "string" },
    difficulty: { type: "string", enum: ["easy", "medium", "hard"] },
    stationStem: {
      type: "object",
      properties: {
        presentingComplaint: { type: "string" },
        setting: { type: "string" },
        candidateTask: { type: "string" },
        visiblePatientContext: { type: "string" },
      },
      required: ["presentingComplaint", "setting", "candidateTask", "visiblePatientContext"],
      additionalProperties: false,
    },
    patientProfile: {
      type: "object",
      properties: {
        name: { type: "string" },
        ageBand: { type: "string" },
        gender: { type: "string" },
        occupation: { type: "string" },
        emotionalTone: { type: "string" },
        personalityNotes: { type: "string" },
        speechStyle: { type: "string" },
      },
      required: ["name", "ageBand", "gender", "emotionalTone", "personalityNotes", "speechStyle"],
      additionalProperties: false,
    },
    hiddenDiagnosis: { type: "string" },
    cluePool: { type: "array", items: clueItem, minItems: 6 },
    redFlags: { type: "array", items: { type: "string" } },
    candidateTask: { type: "string" },
    setting: { type: "string" },
    emotionalTone: { type: "string" },
  },
  required: [
    "seed",
    "difficulty",
    "stationStem",
    "patientProfile",
    "hiddenDiagnosis",
    "cluePool",
    "redFlags",
    "candidateTask",
    "setting",
    "emotionalTone",
  ],
  additionalProperties: false,
};

const CASE_GENERATION_SYSTEM_PROMPT = `You are an AMC examiner creating a fresh original clinical roleplay case.

You receive a blueprint describing a presentation family. Generate ONE concrete case variant that:
- Picks ONE hidden diagnosis from hiddenDiagnoses.
- Differs in setting, demographics, wording, and clue arrangement.
- Builds a cluePool of at least 6 entries: mix of key / supporting / distractor.
- Sets one realistic emotionalTone.
- Uses Australian medical context (PBS, Medicare, RACGP, paracetamol not acetaminophen).

STEM — single narrative paragraph in visiblePatientContext:
- 3-6 sentences weaving setting, patient (name, age, brief demographic), presenting complaint in patient-natural language, immediately visible context (observations on arrival, who brought them, etc).
- Never name the hidden diagnosis or use words that give it away.
- presentingComplaint and setting are internal only — short labels.

TASK — non-directive (no diagnosis hints):
✗ BAD: "Take a gynaecological history…"
✓ GOOD: "Take a focused history, perform an appropriate examination, explain your working diagnosis and differentials, and outline an immediate management plan."
Steer the candidate via subtle clues in the STEM, never via the task wording.

CLUE POOL — critical formatting rules (these get spoken by the patient at runtime):
- Each "reveal" is the patient's spoken words ONLY — plain English, ≤2 sentences.
- NEVER include stage directions in reveal text. No "*pauses*", "*sighs*", "*winces*", "*voice trembling*", "*takes a shaky breath*", or anything in asterisks.
- NEVER include parenthetical action notes like "(crying)" or "(touches abdomen)".
- The reveal should be SHORT — what a real exam patient would say in 1-2 short sentences. Save brevity; don't pre-empt other clues.

OTHER RULES:
- DO NOT copy phrasing from any source.
- Echo the seed string verbatim.
- Each clue's "trigger" describes the question/action that unlocks it.`;

interface BlueprintRow {
  id: string;
  slug: string;
  family_name: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  presentation_cluster: string[];
  hidden_diagnoses: unknown[];
  distractor_diagnoses: unknown[];
  red_flags: string[];
  candidate_tasks: string[];
  setting_options: string[];
  age_bands: string[];
  source_ids: string[];
}

interface CaseVariantOut {
  seed: string;
  difficulty: "easy" | "medium" | "hard";
  stationStem: { presentingComplaint: string; setting: string; candidateTask: string; visiblePatientContext: string };
  patientProfile: Record<string, unknown>;
  hiddenDiagnosis: string;
  cluePool: unknown[];
  redFlags: string[];
  candidateTask: string;
  setting: string;
  emotionalTone: string;
}

function randomSeed(): string {
  return Math.random().toString(36).slice(2, 10);
}

async function generateOne(bp: BlueprintRow, seed: string): Promise<CaseVariantOut> {
  const blueprint = {
    slug: bp.slug,
    familyName: bp.family_name,
    category: bp.category,
    difficulty: bp.difficulty,
    presentationCluster: bp.presentation_cluster ?? [],
    hiddenDiagnoses: bp.hidden_diagnoses ?? [],
    distractorDiagnoses: bp.distractor_diagnoses ?? [],
    redFlags: bp.red_flags ?? [],
    candidateTasks: bp.candidate_tasks ?? [],
    settingOptions: bp.setting_options ?? [],
    ageBands: bp.age_bands ?? [],
  };
  const userMessage = `BLUEPRINT (do not echo back):
${JSON.stringify(blueprint, null, 2)}

Difficulty: ${bp.difficulty}
Seed: ${seed}

Generate one fresh original case from this blueprint. Pick ONE hidden diagnosis from hiddenDiagnoses. Vary setting, demographics, wording, and clue arrangement. Echo the seed string back verbatim in your output.`;

  const params = {
    model: MODEL,
    max_tokens: 4000,
    temperature: 0.7,
    system: [
      { type: "text", text: CASE_GENERATION_SYSTEM_PROMPT, cache_control: { type: "ephemeral" } },
    ],
    tools: [
      { name: "save_case_variant", description: "Save the case variant.", input_schema: CASE_VARIANT_SCHEMA },
    ],
    tool_choice: { type: "tool", name: "save_case_variant" },
    messages: [{ role: "user", content: userMessage }],
  };
  const response = (await anthropic.messages.create(
    params as unknown as Parameters<typeof anthropic.messages.create>[0]
  )) as Anthropic.Message;
  const tool = response.content.find((b) => b.type === "tool_use");
  if (!tool || tool.type !== "tool_use") throw new Error("No tool_use in response");
  return tool.input as CaseVariantOut;
}

async function main() {
  let q = supabase
    .from("acrp_blueprints")
    .select("id, slug, family_name, category, difficulty, presentation_cluster, hidden_diagnoses, distractor_diagnoses, red_flags, candidate_tasks, setting_options, age_bands, source_ids")
    .order("category");
  if (ONLY_CATEGORY) q = q.eq("category", ONLY_CATEGORY);
  if (ONLY_SLUG) q = q.eq("slug", ONLY_SLUG);

  const { data: bps, error } = await q;
  if (error) throw error;
  if (!bps?.length) {
    console.error("No blueprints found");
    process.exit(1);
  }

  console.log(`Pre-filling cache pool: ${bps.length} blueprints, target ${TARGET} cases each`);

  let generated = 0;
  let skipped = 0;
  let errors = 0;

  for (const raw of bps) {
    const bp = raw as BlueprintRow;
    const { count } = await supabase
      .from("acrp_cases")
      .select("id", { count: "exact", head: true })
      .eq("blueprint_id", bp.id)
      .eq("difficulty", bp.difficulty);
    const existing = count ?? 0;
    const needed = Math.max(0, TARGET - existing);
    if (needed === 0) {
      skipped++;
      console.log(`[skip] ${bp.slug} — already has ${existing} cases`);
      continue;
    }

    console.log(`→ ${bp.slug} (${bp.difficulty}) — has ${existing}, generating ${needed}`);
    for (let i = 0; i < needed; i++) {
      const seed = randomSeed();
      try {
        const v = await generateOne(bp, seed);
        const { error: insErr } = await supabase.from("acrp_cases").insert({
          blueprint_id: bp.id,
          seed: v.seed,
          difficulty: v.difficulty,
          station_stem: v.stationStem,
          patient_profile: v.patientProfile,
          hidden_diagnosis: v.hiddenDiagnosis,
          clue_pool: v.cluePool,
          red_flags: v.redFlags,
          candidate_task: v.candidateTask,
          setting: v.setting,
          emotional_tone: v.emotionalTone,
        });
        if (insErr) throw insErr;
        generated++;
        console.log(`   ✓ #${i + 1}: ${v.hiddenDiagnosis}`);
      } catch (err) {
        errors++;
        console.error(`   ✗ #${i + 1}:`, err instanceof Error ? err.message : err);
      }
    }
  }

  console.log(`\nDone. generated=${generated} skipped=${skipped} errors=${errors}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
