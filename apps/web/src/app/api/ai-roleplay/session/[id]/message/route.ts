import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { streamRoleplayReply } from "@/lib/ai-roleplay/roleplay";
import { checkModulePermission } from "@/lib/permissions";
import { aiRateLimit, clientKey } from "@/lib/rate-limit";
import type { CaseVariant } from "@/lib/ai-roleplay/types";
import { bumpStreak } from "@/lib/streaks";

// SSE-streamed roleplay turn. The browser reads chunks via fetch + getReader
// and renders patient text token-by-token, dropping perceived latency from
// ~3-5s (full reply blocking) to ~600ms (first token).

interface Body {
  content?: string;
}

function sse(data: object): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`);
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id: sessionId } = await ctx.params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const perm = await checkModulePermission(supabase, "acrp_solo");
  if (!perm.allowed) {
    return Response.json(
      { error: "Your plan does not include AMC Clinical AI RolePlay." },
      { status: 403 }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "AI service not configured" }, { status: 503 });
  }

  const rateKey = clientKey(req, "acrp_msg", user.id);
  const rl = await aiRateLimit(rateKey, { max: 60, windowMs: 60_000 });
  if (!rl.allowed) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }
  const userMessage = body.content?.trim();
  if (!userMessage) return Response.json({ error: "content required" }, { status: 400 });

  // ─── Load session + case (must belong to this user) ──────────────────
  const { data: session } = await supabase
    .from("acrp_sessions")
    .select("id, status, case_id, user_id")
    .eq("id", sessionId)
    .single();
  if (!session || session.user_id !== user.id) {
    return Response.json({ error: "Session not found" }, { status: 404 });
  }
  if (session.status === "completed" || session.status === "abandoned") {
    return Response.json({ error: "Session already ended" }, { status: 409 });
  }

  // Full case payload — server-side only, never streamed to client.
  const { data: caseRow } = await supabase
    .from("acrp_cases")
    .select("seed, difficulty, station_stem, patient_profile, hidden_diagnosis, clue_pool, red_flags, candidate_task, setting, emotional_tone")
    .eq("id", session.case_id)
    .single();
  if (!caseRow) return Response.json({ error: "Case not found" }, { status: 404 });

  const caseVariant: CaseVariant = {
    seed: caseRow.seed,
    difficulty: caseRow.difficulty,
    stationStem: caseRow.station_stem,
    patientProfile: caseRow.patient_profile,
    hiddenDiagnosis: caseRow.hidden_diagnosis,
    cluePool: caseRow.clue_pool ?? [],
    redFlags: caseRow.red_flags ?? [],
    candidateTask: caseRow.candidate_task,
    setting: caseRow.setting,
    emotionalTone: caseRow.emotional_tone ?? "",
  };

  const { data: history } = await supabase
    .from("acrp_messages")
    .select("role, content")
    .eq("session_id", sessionId)
    .order("created_at");
  const cleanHistory = (history ?? []).filter(
    (m): m is { role: "user" | "assistant"; content: string } =>
      m.role === "user" || m.role === "assistant"
  );

  // Persist the user turn before streaming so transcript is complete even if
  // the stream fails mid-way.
  const { error: insertUserErr } = await supabase
    .from("acrp_messages")
    .insert({ session_id: sessionId, role: "user", content: userMessage });
  if (insertUserErr) {
    return Response.json({ error: insertUserErr.message }, { status: 500 });
  }
  if (session.status !== "roleplay") {
    await supabase
      .from("acrp_sessions")
      .update({ status: "roleplay", roleplay_started_at: new Date().toISOString() })
      .eq("id", sessionId);
  }

  // Streak bump after the user turn is safely persisted. Idempotent per UTC day.
  await bumpStreak(supabase, user.id);

  // ─── Stream Claude response back as SSE ──────────────────────────────
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let full = "";
      try {
        for await (const delta of streamRoleplayReply({
          caseVariant,
          history: cleanHistory,
          newUserMessage: userMessage,
        })) {
          full += delta;
          controller.enqueue(sse({ type: "delta", text: delta }));
        }
        controller.enqueue(sse({ type: "done", reply: full }));
        // Persist assistant turn after stream completes.
        await supabase
          .from("acrp_messages")
          .insert({ session_id: sessionId, role: "assistant", content: full });
      } catch (err) {
        const message = err instanceof Error ? err.message : "AI error";
        controller.enqueue(sse({ type: "error", error: message }));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
