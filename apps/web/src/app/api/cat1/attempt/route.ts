import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createEmptyCard, fsrs, generatorParameters, Rating } from "ts-fsrs";

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

  // Update streak (conditional update prevents race conditions)
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const { data: streak } = await supabase
    .from("study_streaks")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!streak) {
    await supabase.from("study_streaks").upsert({
      user_id: user.id,
      current_streak: 1,
      longest_streak: 1,
      last_study_date: today,
    }, { onConflict: "user_id" });
  } else if (streak.last_study_date !== today) {
    const newStreak = streak.last_study_date === yesterday ? streak.current_streak + 1 : 1;
    // Only update if last_study_date hasn't changed since we read it (prevents race)
    await supabase.from("study_streaks").update({
      current_streak: newStreak,
      longest_streak: Math.max(newStreak, streak.longest_streak),
      last_study_date: today,
      updated_at: new Date().toISOString(),
    }).eq("user_id", user.id).eq("last_study_date", streak.last_study_date);
  }

  return NextResponse.json({ ok: true, due: next.due });
}
