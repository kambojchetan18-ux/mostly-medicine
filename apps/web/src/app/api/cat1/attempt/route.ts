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

  // Upsert attempt log
  await supabase.from("attempts").insert({
    user_id: user.id,
    question_id: questionId,
    selected_answer: correct ? "correct" : "wrong",
    is_correct: correct,
  });

  // Get or create SR card
  const { data: existing } = await supabase
    .from("sr_cards")
    .select("*")
    .eq("user_id", user.id)
    .eq("question_id", questionId)
    .single();

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

  await supabase.from("sr_cards").upsert({
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
  }, { onConflict: "user_id,question_id" });

  // Upsert topic progress
  const { data: tp } = await supabase
    .from("topic_progress")
    .select("total_attempted, total_correct")
    .eq("user_id", user.id)
    .eq("topic", topic)
    .single();

  await supabase.from("topic_progress").upsert({
    user_id: user.id,
    topic,
    total_attempted: (tp?.total_attempted ?? 0) + 1,
    total_correct: (tp?.total_correct ?? 0) + (correct ? 1 : 0),
    last_attempted_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id,topic" });

  // Update streak
  const today = new Date().toISOString().split("T")[0];
  const { data: streak } = await supabase
    .from("study_streaks")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!streak) {
    await supabase.from("study_streaks").insert({
      user_id: user.id,
      current_streak: 1,
      longest_streak: 1,
      last_study_date: today,
    });
  } else if (streak.last_study_date !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const newStreak = streak.last_study_date === yesterday ? streak.current_streak + 1 : 1;
    await supabase.from("study_streaks").update({
      current_streak: newStreak,
      longest_streak: Math.max(newStreak, streak.longest_streak),
      last_study_date: today,
      updated_at: new Date().toISOString(),
    }).eq("user_id", user.id);
  }

  // Bump the user_profiles streak counter (idempotent per UTC day).
  await bumpStreak(supabase, user.id);

  // Award XP — never blocks the response
  const xpSource = correct ? "mcq_correct" : "mcq_incorrect";
  await awardXp(supabase, user.id, xpSource, XP_POINTS[xpSource]);

  return NextResponse.json({ ok: true, due: next.due });
}
