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

  // If the host already has a session in 'waiting' status (no guest yet),
  // reuse it ONLY when the chosen role matches — otherwise abandon the
  // stale session and create a fresh one with the new role. Reusing with a
  // mismatched role caused the bug where the host thought they were Doctor
  // but the DB still had them as Patient, so guests saw the wrong role too.
  {
    const { data: existing } = await supabase
      .from("acrp_live_sessions")
      .select("id, invite_code, host_role")
      .eq("host_user_id", user.id)
      .eq("status", "waiting")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (existing && existing.host_role === hostRole) {
      return NextResponse.json({
        sessionId: existing.id,
        inviteCode: existing.invite_code,
        hostRole,
        reused: true,
      });
    }
    if (existing && existing.host_role !== hostRole) {
      // Mark the stale waiting session as abandoned so it stops polluting
      // the host's "waiting" history.
      await supabase
        .from("acrp_live_sessions")
        .update({ status: "abandoned", ended_at: new Date().toISOString() })
        .eq("id", existing.id);
    }
  }

  // Pick blueprint
  let q = supabase
    .from("acrp_blueprints")
    .select("id, slug, family_name, category, difficulty, presentation_cluster, hidden_diagnoses, distractor_diagnoses, red_flags, candidate_tasks, setting_options, age_bands, source_ids");
  if (body.blueprintId) q = q.eq("id", body.blueprintId);
  else {
    if (body.category) q = q.eq("category", body.category);
    if (body.difficulty) q = q.eq("difficulty", body.difficulty);
  }
  const { data: bps, error: bpErr } = await q;
  if (bpErr) {
    console.error("[live/create] blueprint lookup error", bpErr);
    return NextResponse.json({ error: bpErr.message }, { status: 500 });
  }
  if (!bps?.length) return NextResponse.json({ error: "No blueprints found" }, { status: 404 });
  const picked = body.blueprintId ? bps[0] : bps[Math.floor(Math.random() * bps.length)];

  const service = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Try the cached pool first — every blueprint has 3+ pre-generated cases
  // from acrp-prefill-cases. Live mode doesn't need fresh content; reuse keeps
  // create fast (no Claude call) and works even if Anthropic credits are low.
  const targetDifficulty = (body.difficulty ?? picked.difficulty) as Difficulty;
  const { data: cachedCases } = await service
    .from("acrp_cases")
    .select("id, difficulty, station_stem, patient_profile, hidden_diagnosis, clue_pool, red_flags, candidate_task, setting, emotional_tone, seed")
    .eq("blueprint_id", picked.id)
    .eq("difficulty", targetDifficulty)
    .limit(20);

  let caseId: string | null = null;
  let variantForBrief: import("@/lib/ai-roleplay/types").CaseVariant | null = null;

  if (cachedCases && cachedCases.length > 0) {
    const hit = cachedCases[Math.floor(Math.random() * cachedCases.length)];
    caseId = hit.id;
    variantForBrief = {
      seed: hit.seed,
      difficulty: hit.difficulty,
      stationStem: hit.station_stem,
      patientProfile: hit.patient_profile,
      hiddenDiagnosis: hit.hidden_diagnosis,
      cluePool: hit.clue_pool ?? [],
      redFlags: hit.red_flags ?? [],
      candidateTask: hit.candidate_task,
      setting: hit.setting,
      emotionalTone: hit.emotional_tone ?? "",
    };
  }

  // Cache miss → generate a fresh CaseVariant. This is the only path that
  // costs Claude credits.
  if (!caseId || !variantForBrief) {
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

    let variant;
    try {
      variant = await generateCase({
        blueprint,
        difficulty: targetDifficulty,
        seed: randomSeed(),
      });
    } catch (err) {
      console.error("[live/create] generateCase failed", err);
      const message = err instanceof Error ? err.message : "Case generation failed";
      return NextResponse.json({ error: message }, { status: 500 });
    }

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
    if (caseErr || !caseRow) {
      console.error("[live/create] case save failed", caseErr);
      return NextResponse.json({ error: caseErr?.message ?? "Save failed" }, { status: 500 });
    }
    caseId = caseRow.id;
    variantForBrief = variant;
  }

  const brief = buildPatientBrief(variantForBrief);

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
      case_id: caseId,
      host_role: hostRole,
      status: "waiting",
      patient_brief: brief,
    })
    .select("id, invite_code")
    .single();
  if (sessErr || !sess) {
    console.error("[live/create] session save failed", sessErr);
    return NextResponse.json({ error: sessErr?.message ?? "Save failed" }, { status: 500 });
  }

  return NextResponse.json({ sessionId: sess.id, inviteCode: sess.invite_code, hostRole });
}
