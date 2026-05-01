import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createEmptyCard, fsrs, generatorParameters, Rating } from "ts-fsrs";
import { bumpStreak } from "@/lib/streaks";
import { awardXp, XP_POINTS } from "@/lib/xp";
import { enforceDailyLimit } from "@/lib/permissions";

const f = fsrs(generatorParameters({ enable_fuzz: true }));

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

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

  const { questionId, correct, topic } = await req.json();
  if (!questionId || correct === undefined || !topic) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const rating = correct ? Rating.Good : Rating.Again;

  // Insert attempt log + read existing SR card in parallel — they're
  // independent. Cuts ~1 round-trip off the response.
  const [attemptRes, existingRes] = await Promise.all([
    supabase.from("attempts").insert({
      user_id: user.id,
      question_id: questionId,
      selected_answer: correct ? "correct" : "wrong",
      is_correct: correct,
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

  // Three independent reads in parallel — sr_card upsert, topic_progress
  // current row, and study_streaks current row. The previous code awaited
  // each sequentially, which added ~3 round-trips to the response.
  const [, tpRes, streakRes] = await Promise.all([
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
    supabase
      .from("study_streaks")
      .select("*")
      .eq("user_id", user.id)
      .single(),
  ]);
  const tp = tpRes.data;
  const streak = streakRes.data;

  // Now compute the writes that depend on the read snapshots above and
  // fire them in parallel as well.
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  // Supabase query builders are thenable but not actual Promises, so we
  // type them as PromiseLike for Promise.all.
  const writes: PromiseLike<unknown>[] = [
    supabase.from("topic_progress").upsert({
      user_id: user.id,
      topic,
      total_attempted: (tp?.total_attempted ?? 0) + 1,
      total_correct: (tp?.total_correct ?? 0) + (correct ? 1 : 0),
      last_attempted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,topic" }),
    // user_profiles streak counter — idempotent per UTC day (RPC).
    bumpStreak(supabase, user.id),
    // XP award — RPC, idempotent within 60s for same (user, source).
    awardXp(supabase, user.id, correct ? "mcq_correct" : "mcq_incorrect", XP_POINTS[correct ? "mcq_correct" : "mcq_incorrect"]),
  ];

  if (!streak) {
    writes.push(
      supabase.from("study_streaks").insert({
        user_id: user.id,
        current_streak: 1,
        longest_streak: 1,
        last_study_date: today,
      })
    );
  } else if (streak.last_study_date !== today) {
    const newStreak = streak.last_study_date === yesterday ? streak.current_streak + 1 : 1;
    writes.push(
      supabase.from("study_streaks").update({
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, streak.longest_streak),
        last_study_date: today,
        updated_at: new Date().toISOString(),
      }).eq("user_id", user.id)
    );
  }

  await Promise.all(writes);

  return NextResponse.json({ ok: true, due: next.due });
}
