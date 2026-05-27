import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [topicsRes, streakRes, dueRes, totalRes, correctRes] = await Promise.all([
    supabase.from("topic_progress").select("*").eq("user_id", user.id).order("total_attempted", { ascending: false }),
    supabase.from("study_streaks").select("*").eq("user_id", user.id).single(),
    supabase.from("sr_cards").select("question_id").eq("user_id", user.id).lte("due", new Date().toISOString()),
    supabase.from("attempts").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("attempts").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("is_correct", true),
  ]);

  const topics = topicsRes.data ?? [];
  const streak = streakRes.data;
  const dueCount = dueRes.data?.length ?? 0;
  const totalAttempted = totalRes.count ?? 0;
  const totalCorrect = correctRes.count ?? 0;

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
      accuracy: t.total_attempted > 0 ? Math.round((t.total_correct / t.total_attempted) * 100) : 0,
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
