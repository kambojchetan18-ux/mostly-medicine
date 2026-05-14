import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";
import { allQuestions } from "@mostly-medicine/content";

export const dynamic = "force-dynamic";

const MODEL = "claude-haiku-4-5-20251001";

let _anth: Anthropic | null = null;
function anth() {
  if (!_anth) _anth = new Anthropic();
  return _anth;
}

function service() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

interface LearningPoint {
  questionId: string;
  isCorrect: boolean;
  points: string[];
}

export async function POST(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: session } = await supabase
    .from("mcq_sessions")
    .select("id, user_id, status, started_at, target_count, topic")
    .eq("id", id)
    .single();
  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
  if (session.user_id !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Idempotent — if already completed, just return the existing data so the
  // client redirect to /results/[id] works either way.
  if (session.status === "completed") {
    return NextResponse.json({ ok: true, sessionId: id, cached: true });
  }

  const { data: attempts } = await supabase
    .from("attempts")
    .select("question_id, is_correct, attempted_at")
    .eq("session_id", id)
    .order("attempted_at", { ascending: true });

  const list = attempts ?? [];
  const correctCount = list.filter((a) => a.is_correct).length;
  const total = list.length;
  const scorePct = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  const startedAtMs = new Date(session.started_at as string).getTime();
  const endedAtMs = Date.now();

  // Active duration = sum of per-question gaps in the attempts table, with
  // each gap capped at MAX_GAP_SEC. This filters out wall-clock idle time
  // (e.g. user opens the quiz at 8:32am, walks away, finishes at 7pm — the
  // raw elapsed would otherwise show 10+ hours / 20-min-per-question and
  // misrepresent the actual time-on-task). The first question's gap is
  // approximated from the average of the remaining gaps so we don't
  // under-count single-attempt sessions.
  const MAX_GAP_SEC = 5 * 60;
  let durationSeconds = 0;
  if (list.length >= 2) {
    const times = list.map((a) => new Date(a.attempted_at as string).getTime());
    const gaps: number[] = [];
    for (let i = 1; i < times.length; i++) {
      const gap = Math.max(0, Math.round((times[i] - times[i - 1]) / 1000));
      gaps.push(Math.min(MAX_GAP_SEC, gap));
    }
    const sumGaps = gaps.reduce((s, g) => s + g, 0);
    const avgGap = Math.round(sumGaps / gaps.length);
    // The unobserved Q1 gap is approximated as the average per-question gap.
    durationSeconds = sumGaps + avgGap;
  } else if (list.length === 1) {
    // Single-question session — no gaps to measure; use a sane default.
    durationSeconds = 60;
  }
  // Final safety: never exceed wall-clock time, never below 0.
  const wallClockSec = Math.max(0, Math.round((endedAtMs - startedAtMs) / 1000));
  durationSeconds = Math.max(0, Math.min(durationSeconds, wallClockSec));

  // Percentile vs all completed sessions across all users (service role bypass
  // RLS so we can read everyone's score_pct). Cheap aggregate query.
  const svc = service();
  const { data: peerRows } = await svc
    .from("mcq_sessions")
    .select("score_pct")
    .eq("status", "completed")
    .not("score_pct", "is", null);
  const peerScores = (peerRows ?? []).map((r) => r.score_pct as number).filter((n) => Number.isFinite(n));
  let percentile = 50;
  if (peerScores.length >= 5) {
    const beat = peerScores.filter((s) => s < scorePct).length;
    percentile = Math.round((beat / peerScores.length) * 100);
  }

  // Mark the session completed FIRST so the user is never blocked by a slow
  // or failing AI call. Empty learning_points are populated below in a
  // bounded follow-up; if that step also fails the user still gets a valid
  // results page.
  await supabase
    .from("mcq_sessions")
    .update({
      status: "completed",
      ended_at: new Date(endedAtMs).toISOString(),
      duration_seconds: durationSeconds,
      questions_answered: total,
      correct_count: correctCount,
      score_pct: scorePct,
      percentile,
      learning_points: [],
    })
    .eq("id", id);

  // Best-effort AI learning points — bounded to 8s so we never starve the
  // route's overall budget on a Vercel cold start. Falls back silently.
  if (total > 0 && process.env.ANTHROPIC_API_KEY) {
    try {
      const learningPoints = await Promise.race<LearningPoint[]>([
        generateLearningPoints(list, session.topic ?? null),
        new Promise<LearningPoint[]>((_, reject) =>
          setTimeout(() => reject(new Error("learning_points_timeout")), 8000),
        ),
      ]);
      if (learningPoints.length > 0) {
        await supabase
          .from("mcq_sessions")
          .update({ learning_points: learningPoints })
          .eq("id", id);
      }
    } catch (err) {
      console.error("[cat1/session/end] learning points skipped:", (err as Error).message);
    }
  }

  return NextResponse.json({ ok: true, sessionId: id });
}

async function generateLearningPoints(
  attempts: Array<{ question_id: string | null; is_correct: boolean | null }>,
  topic: string | null,
): Promise<LearningPoint[]> {
  const items = attempts
    .filter((a) => a.question_id)
    .map((a) => {
      const q = allQuestions.find((x) => x.id === a.question_id);
      return {
        id: a.question_id as string,
        isCorrect: !!a.is_correct,
        stem: q?.stem ?? "(question text not found)",
        correctAnswer: q?.options?.find((o) => o.label === q.correctAnswer)?.text ?? "",
      };
    });
  if (items.length === 0) return [];

  const userMessage = `You are an AMC examiner. Generate 2-3 short, examiner-style learning points per question for this AMC MCQ recall session${topic ? ` on ${topic}` : ""}. Focus on the high-yield clinical pearl, not the answer mechanics.

Return STRICT JSON only — array of objects with shape: {"questionId": string, "isCorrect": boolean, "points": [string, ...]}. No prose around the JSON. Each point should be 1 sentence, evidence-based, AMC-aligned.

Questions in this session:
${items
  .map(
    (q, i) =>
      `[${i + 1}] id=${q.id} | ${q.isCorrect ? "Correct" : "Wrong"} | Stem: ${q.stem.slice(0, 240)} | Correct answer: ${q.correctAnswer.slice(0, 120)}`,
  )
  .join("\n\n")}`;

  const response = await anth().messages.create({
    model: MODEL,
    max_tokens: 1500,
    temperature: 0.3,
    system: [
      {
        type: "text",
        text: "You are an AMC clinical examiner generating concise, evidence-based learning points for medical candidates. Always reply with strict JSON only.",
        cache_control: { type: "ephemeral" },
      },
    ] as unknown as Anthropic.TextBlockParam[],
    messages: [{ role: "user", content: userMessage }],
  });
  const text = response.content
    .filter((b) => b.type === "text")
    .map((b) => (b as Anthropic.TextBlock).text)
    .join("");
  return parseLearningPoints(text);
}

function parseLearningPoints(text: string): LearningPoint[] {
  const trimmed = text.trim().replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
  try {
    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    const match = trimmed.match(/\[[\s\S]*\]/);
    if (match) {
      try {
        const parsed = JSON.parse(match[0]);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  }
}
