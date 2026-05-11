import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [topicsRes, streakRes, dueRes, statsRes] = await Promise.all([
    supabase.from("topic_progress").select("*").eq("user_id", user.id).order("total_attempted", { ascending: false }),
    supabase.from("study_streaks").select("*").eq("user_id", user.id).single(),
    supabase.from("sr_cards").select("question_id", { count: "exact", head: true }).eq("user_id", user.id).lte("due", new Date().toISOString()),
    supabase.rpc("get_attempt_stats", { p_user_id: user.id }).maybeSingle(),
  ]);

  const topics = topicsRes.data ?? [];
  const streak = streakRes.data;
  const dueCount = dueRes.count ?? 0;
  const stats = statsRes.data as { total: number; correct: number } | null;
  const totalAttempted = Number(stats?.total ?? 0);
  const totalCorrect = Number(stats?.correct ?? 0);

  // Weak topics: < 60% accuracy, min 5 attempts
  const weakTopics = topics
    .filter((t) => t.total_attempted >= 5 && t.total_correct / t.total_attempted < 0.6)
    .map((t) => ({
      topic: t.topic,
      accuracy: Math.round((t.total_correct / t.total_attempted) * 100),
      attempted: t.total_attempted,
    }))
    .sort((a, b) => a.accuracy - b.accuracy);

  return NextResponse.json({
    topics: topics.map((t) => ({
      topic: t.topic,
      attempted: t.total_attempted,
      correct: t.total_correct,
      accuracy: Math.round((t.total_correct / t.total_attempted) * 100),
      lastAttempted: t.last_attempted_at,
    })),
    weakTopics,
    streak: {
      current: streak?.current_streak ?? 0,
      longest: streak?.longest_streak ?? 0,
      lastStudy: streak?.last_study_date ?? null,
    },
    dueCount,
    totalAttempted,
    totalCorrect,
    overallAccuracy: totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0,
  });
}
