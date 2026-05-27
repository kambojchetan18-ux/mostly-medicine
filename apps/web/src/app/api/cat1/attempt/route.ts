import { NextRequest, NextResponse } from "next/server";
import { createEmptyCard, fsrs, generatorParameters, Rating } from "ts-fsrs";
import { bumpStreak } from "@/lib/streaks";
import { awardXp, XP_POINTS } from "@/lib/xp";
import { enforceDailyLimit } from "@/lib/permissions";
import { createClient } from "@/lib/supabase/server";

const f = fsrs(generatorParameters({ enable_fuzz: true }));

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Free plan caps MCQ attempts per UTC day. Pro/Enterprise = unlimited.
  // checkModulePermission would already have blocked plans where mcq is
  // disabled, but we run the combined daily-limit check here.
  const limit = await enforceDailyLimit(supabase, "mcq");
  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: "daily_limit_reached",
        plan: limit.plan,
        dailyLimit: limit.dailyLimit,
        used: limit.used,
      },
      { status: 429 }
    );
  }

  const { questionId, correct, topic, sessionId, selected } = await req.json();
  if (!questionId || correct === undefined || !topic) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  // Selected option letter (A–E). Optional for backwards-compat with older
  // clients but newer Cat1Client sends it so we can re-render the picked
  // answer when the user navigates back via Previous / nav grid after a
  // logout+login.
  const selectedLabel: string | null =
    typeof selected === "string" && /^[A-E]$/.test(selected) ? selected : null;

  const rating = correct ? Rating.Good : Rating.Again;

  // Insert attempt log + read existing SR card in parallel — they're
  // independent. Cuts ~1 round-trip off the response.
  const [attemptRes, existingRes] = await Promise.all([
    supabase.from("attempts").insert({
      user_id: user.id,
      question_id: questionId,
      selected_answer: correct ? "correct" : "wrong",
      is_correct: correct,
      ...(selectedLabel ? { selected_label: selectedLabel } : {}),
      ...(typeof sessionId === "string" ? { session_id: sessionId } : {}),
    }),
    supabase
      .from("sr_cards")
      .select("*")
      .eq("user_id", user.id)
      .eq("question_id", questionId)
      .single(),
  ]);
  // Surface insert failures instead of silently swallowing them — this is the
  // class of bug that left analytics showing 0 MCQs despite XP firing.
  if (attemptRes.error) {
    console.error("[cat1/attempt] insert into attempts failed", attemptRes.error);
  }
  const existing = existingRes.data;

  const card = existing
    ? {
        stability: existing.stability,
        difficulty: existing.difficulty,
        elapsed_days: existing.elapsed_days,
        scheduled_days: existing.scheduled_days,
        reps: existing.reps,
        lapses: existing.lapses,
        state: existing.state,
        due: new Date(existing.due),
        last_review: existing.last_review ? new Date(existing.last_review) : undefined,
      }
    : createEmptyCard();

  const result = f.next(card as Parameters<typeof f.next>[0], new Date(), rating);
  const next = result.card;

  const [, tpRes] = await Promise.all([
    supabase.from("sr_cards").upsert({
      user_id: user.id,
      question_id: questionId,
      stability: next.stability,
      difficulty: next.difficulty,
      elapsed_days: next.elapsed_days,
      scheduled_days: next.scheduled_days,
      reps: next.reps,
      lapses: next.lapses,
      state: next.state,
      due: next.due.toISOString(),
      last_review: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,question_id" }),
    supabase
      .from("topic_progress")
      .select("total_attempted, total_correct")
      .eq("user_id", user.id)
      .eq("topic", topic)
      .single(),
  ]);
  const tp = tpRes.data;

  await Promise.all([
    supabase.from("topic_progress").upsert({
      user_id: user.id,
      topic,
      total_attempted: (tp?.total_attempted ?? 0) + 1,
      total_correct: (tp?.total_correct ?? 0) + (correct ? 1 : 0),
      last_attempted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,topic" }),
    bumpStreak(supabase, user.id),
    awardXp(supabase, user.id, correct ? "mcq_correct" : "mcq_incorrect", XP_POINTS[correct ? "mcq_correct" : "mcq_incorrect"]),
  ]);

  return NextResponse.json({ ok: true, due: next.due });
}
