import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Always fetch fresh progress data — the page reads per-user mutable state
// (attempts, topic_progress, streaks). Without this, Next.js statically
// renders the page at build time and the "In Progress" stats stay at zero
// even after the user completes MCQs.
export const dynamic = "force-dynamic";

// Thresholds for topic status
const COMPLETED_MIN = 20;   // ≥20 attempts = completed at least one full quiz
const IN_PROGRESS_MIN = 1;  // 1–19 attempts = in progress

function statusBadge(attempted: number) {
  if (attempted === 0) return null;
  if (attempted >= COMPLETED_MIN) {
    return (
      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
        Completed
      </span>
    );
  }
  return (
    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
      In Progress
    </span>
  );
}

function accuracyColor(pct: number) {
  return pct >= 75 ? "text-green-600" : pct >= 55 ? "text-yellow-600" : "text-red-600";
}

function barColor(pct: number) {
  return pct >= 75 ? "bg-green-500" : pct >= 55 ? "bg-yellow-400" : "bg-red-400";
}

export default async function ProgressPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // All queries in parallel — no sequential round trips
  const [topicsRes, streakRes, dueRes, totalRes] = await Promise.all([
    supabase.from("topic_progress").select("*").eq("user_id", user.id).order("total_attempted", { ascending: false }),
    supabase.from("study_streaks").select("*").eq("user_id", user.id).single(),
    supabase.from("sr_cards").select("question_id", { count: "exact", head: true }).eq("user_id", user.id).lte("due", new Date().toISOString()),
    supabase.from("attempts").select("is_correct").eq("user_id", user.id),
  ]);

  const topics = topicsRes.data ?? [];
  const streak = streakRes.data;
  const dueCount = dueRes.count ?? 0;
  const allAttempts = totalRes.data ?? [];
  const totalAttempted = allAttempts.length;
  const totalCorrect = allAttempts.filter((a) => a.is_correct).length;
  const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  const weakTopics = topics
    .filter((t) => t.total_attempted >= 5 && t.total_correct / t.total_attempted < 0.6)
    .map((t) => ({
      topic: t.topic,
      accuracy: Math.round((t.total_correct / t.total_attempted) * 100),
      attempted: t.total_attempted,
    }))
    .sort((a, b) => a.accuracy - b.accuracy);

  const completedCount = topics.filter((t) => t.total_attempted >= COMPLETED_MIN).length;
  const inProgressCount = topics.filter((t) => t.total_attempted >= IN_PROGRESS_MIN && t.total_attempted < COMPLETED_MIN).length;

  if (totalAttempted === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <div className="text-5xl mb-4">📊</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">No progress yet</h2>
        <p className="text-gray-500 text-sm mb-6">Complete an AMC MCQ quiz to start tracking your progress and weak areas.</p>
        <Link
          href="/dashboard/cat1"
          className="inline-block bg-brand-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-brand-700 transition text-sm"
        >
          Start Practising →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">My Progress</h2>
        <p className="text-gray-500 text-sm">AMC MCQ performance across all topics · spaced repetition tracking</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-brand-600 mb-1">{totalAttempted}</p>
          <p className="text-xs text-gray-500">Questions Attempted</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center">
          <p className={`text-3xl font-bold mb-1 ${accuracyColor(overallAccuracy)}`}>{overallAccuracy}%</p>
          <p className="text-xs text-gray-500">Overall Accuracy</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-orange-500 mb-1">🔥 {streak?.current_streak ?? 0}</p>
          <p className="text-xs text-gray-500">Day Streak</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-purple-600 mb-1">{dueCount}</p>
          <p className="text-xs text-gray-500">Cards Due Today</p>
        </div>
      </div>

      {/* Module status summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-green-700">{completedCount}</p>
          <p className="text-xs text-green-600 font-medium mt-0.5">Topics Completed</p>
          <p className="text-[10px] text-green-500 mt-0.5">≥20 questions done</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-amber-700">{inProgressCount}</p>
          <p className="text-xs text-amber-600 font-medium mt-0.5">In Progress</p>
          <p className="text-[10px] text-amber-500 mt-0.5">Started, keep going</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-gray-500">{Math.max(0, 14 - completedCount - inProgressCount)}</p>
          <p className="text-xs text-gray-500 font-medium mt-0.5">Not Started</p>
          <p className="text-[10px] text-gray-400 mt-0.5">of 14 topics</p>
        </div>
      </div>

      {/* Due cards CTA */}
      {dueCount > 0 && (
        <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="font-semibold text-brand-800 text-sm">
              🧠 {dueCount} question{dueCount > 1 ? "s" : ""} due for review
            </p>
            <p className="text-xs text-brand-600 mt-0.5">Spaced repetition keeps your memory sharp</p>
          </div>
          <Link
            href="/dashboard/cat1"
            className="bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-700 transition whitespace-nowrap"
          >
            Review Now →
          </Link>
        </div>
      )}

      {/* Weak areas */}
      {weakTopics.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6">
          <p className="font-semibold text-red-800 text-sm mb-3">⚠️ Weak Areas — Focus Here</p>
          <div className="space-y-3">
            {weakTopics.map((t) => (
              <div key={t.topic} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-gray-700">{t.topic}</span>
                    <span className="text-red-600 font-semibold">{t.accuracy}%</span>
                  </div>
                  <div className="h-1.5 bg-red-100 rounded-full overflow-hidden">
                    <div className="h-1.5 bg-red-400 rounded-full" style={{ width: `${t.accuracy}%` }} />
                  </div>
                </div>
                <Link
                  href="/dashboard/cat1"
                  className="text-xs text-red-700 font-semibold border border-red-300 px-3 py-1 rounded-lg hover:bg-red-100 transition whitespace-nowrap"
                >
                  Practise
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All topics */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="font-semibold text-gray-800 text-sm">All Topics</p>
          <Link href="/dashboard/cat1" className="text-xs text-brand-600 hover:text-brand-700 font-medium">
            Practice →
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {topics.map((t) => {
            const accuracy = t.total_attempted > 0 ? Math.round((t.total_correct / t.total_attempted) * 100) : 0;
            return (
              <div key={t.topic} className="px-5 py-3.5">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm font-medium text-gray-800 truncate">{t.topic}</span>
                    {statusBadge(t.total_attempted)}
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-2">
                    <span className="text-xs text-gray-400">{t.total_correct}/{t.total_attempted}</span>
                    <span className={`text-sm font-bold ${accuracyColor(accuracy)}`}>{accuracy}%</span>
                  </div>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all ${barColor(accuracy)}`}
                    style={{ width: `${accuracy}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-400">
          Longest streak: {streak?.longest_streak ?? 0} days · Last study: {streak?.last_study_date ?? "never"}
        </p>
      </div>
    </div>
  );
}
