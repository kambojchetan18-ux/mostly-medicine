import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { checkModulePermission } from "@/lib/permissions";
import { generateCase, randomSeed } from "@/lib/ai-roleplay/generator";
import { buildPatientBrief, generateInviteCode } from "@/lib/ai-roleplay/patient-brief";
import type { ClinicalBlueprint, Difficulty } from "@/lib/ai-roleplay/types";

interface Body {
  blueprintId?: string;
  category?: string;
  difficulty?: Difficulty;
  random?: boolean;
  hostRole?: "doctor" | "patient";
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const perm = await checkModulePermission(supabase, "acrp_live");
  if (!perm.allowed) return NextResponse.json({ error: "upgrade_required", plan: perm.plan }, { status: 403 });
  if (!process.env.ANTHROPIC_API_KEY) return NextResponse.json({ error: "AI not configured" }, { status: 503 });

  let body: Body;
  try {
    body = await req.json();
  } catch {
    body = {};
  }
  const hostRole: "doctor" | "patient" = body.hostRole === "patient" ? "patient" : "doctor";

  // Pick blueprint
  let q = supabase
    .from("acrp_blueprints")
    .select("id, slug, family_name, category, difficulty, presentation_cluster, hidden_diagnoses, distractor_diagnoses, red_flags, candidate_tasks, setting_options, age_bands, source_ids");
  if (body.blueprintId) q = q.eq("id", body.blueprintId);
  else {
    if (body.category) q = q.eq("category", body.category);
    if (body.difficulty) q = q.eq("difficulty", body.difficulty);
  }
  const { data: bps } = await q;
  if (!bps?.length) return NextResponse.json({ error: "No blueprints found" }, { status: 404 });
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

  // Generate variant + brief (server-side only)
  const variant = await generateCase({
    blueprint,
    difficulty: body.difficulty ?? (picked.difficulty as Difficulty),
    seed: randomSeed(),
  });
  const brief = buildPatientBrief(variant);

  const service = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Save case
  const { data: caseRow, error: caseErr } = await service
    .from("acrp_cases")
    .insert({
      blueprint_id: picked.id,
      seed: variant.seed,
      difficulty: variant.difficulty,
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
  if (caseErr || !caseRow) return NextResponse.json({ error: caseErr?.message ?? "Save failed" }, { status: 500 });

  // Create live session with unique invite code
  let inviteCode = generateInviteCode();
  for (let i = 0; i < 4; i++) {
    const { count } = await service
      .from("acrp_live_sessions")
      .select("id", { count: "exact", head: true })
      .eq("invite_code", inviteCode);
    if (!count) break;
    inviteCode = generateInviteCode();
  }

  const { data: sess, error: sessErr } = await service
    .from("acrp_live_sessions")
    .insert({
      invite_code: inviteCode,
      host_user_id: user.id,
      case_id: caseRow.id,
      host_role: hostRole,
      status: "waiting",
      patient_brief: brief,
    })
    .select("id, invite_code")
    .single();
  if (sessErr || !sess) return NextResponse.json({ error: sessErr?.message ?? "Save failed" }, { status: 500 });

  return NextResponse.json({ sessionId: sess.id, inviteCode: sess.invite_code, hostRole });
}
