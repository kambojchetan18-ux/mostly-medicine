import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { generateCase, randomSeed } from "@/lib/ai-roleplay/generator";
import type { ClinicalBlueprint, Difficulty } from "@/lib/ai-roleplay/types";

interface GenerateRequest {
  blueprintId?: string;
  category?: string;
  difficulty?: Difficulty;
  random?: boolean;
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "AI service not configured. Please add ANTHROPIC_API_KEY." },
      { status: 503 }
    );
  }

  let body: GenerateRequest;
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  // ─── Pick a blueprint ─────────────────────────────────────────────────
  let bpQuery = supabase
    .from("acrp_blueprints")
    .select("id, slug, family_name, category, difficulty, presentation_cluster, hidden_diagnoses, distractor_diagnoses, red_flags, candidate_tasks, setting_options, age_bands, source_ids");

  if (body.blueprintId) {
    bpQuery = bpQuery.eq("id", body.blueprintId);
  } else {
    if (body.category) bpQuery = bpQuery.eq("category", body.category);
    if (body.difficulty) bpQuery = bpQuery.eq("difficulty", body.difficulty);
  }

  const { data: bps, error: bpErr } = await bpQuery;
  if (bpErr) {
    return NextResponse.json({ error: bpErr.message }, { status: 500 });
  }
  if (!bps || bps.length === 0) {
    return NextResponse.json({ error: "No matching blueprint found" }, { status: 404 });
  }

  const picked = body.blueprintId ? bps[0] : bps[Math.floor(Math.random() * bps.length)];

  const blueprint: ClinicalBlueprint = {
    slug: picked.slug,
    familyName: picked.family_name,
    category: picked.category,
    difficulty: picked.difficulty,
    presentationCluster: picked.presentation_cluster ?? [],
    hiddenDiagnoses: picked.hidden_diagnoses ?? [],
    distractorDiagnoses: picked.distractor_diagnoses ?? [],
    redFlags: picked.red_flags ?? [],
    candidateTasks: picked.candidate_tasks ?? [],
    settingOptions: picked.setting_options ?? [],
    ageBands: picked.age_bands ?? [],
    sourceIds: picked.source_ids ?? [],
  };

  // ─── Generate fresh CaseVariant ───────────────────────────────────────
  const seed = randomSeed();
  const difficulty: Difficulty = body.difficulty ?? (picked.difficulty as Difficulty);

  let variant;
  try {
    variant = await generateCase({ blueprint, difficulty, seed });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    console.error("[ai-roleplay/generate]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }

  // ─── Persist with service role (bypass RLS) so the case is reusable ──
  const service = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: saved, error: saveErr } = await service
    .from("acrp_cases")
    .insert({
      blueprint_id: picked.id,
      seed,
      difficulty,
      station_stem: variant.stationStem,
      patient_profile: variant.patientProfile,
      hidden_diagnosis: variant.hiddenDiagnosis,
      clue_pool: variant.cluePool,
      red_flags: variant.redFlags,
      candidate_task: variant.candidateTask,
      setting: variant.setting,
      emotional_tone: variant.emotionalTone,
    })
    .select("id")
    .single();

  if (saveErr || !saved) {
    console.error("[ai-roleplay/generate] save error", saveErr);
    return NextResponse.json({ error: saveErr?.message ?? "Save failed" }, { status: 500 });
  }

  // ─── Return ONLY the reading-screen view, never the hidden diagnosis ──
  return NextResponse.json({
    caseId: saved.id,
    blueprintId: picked.id,
    difficulty,
    stationStem: variant.stationStem,
    patientName: variant.patientProfile.name,
    candidateTask: variant.candidateTask,
    setting: variant.setting,
    // Intentionally NOT exposed to client:
    //   variant.hiddenDiagnosis, variant.cluePool, variant.redFlags
    // Those are read server-side during roleplay/feedback only.
  });
}
