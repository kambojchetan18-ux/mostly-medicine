import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ResultsClient, {
  type ResultsPayload,
  type AttemptRow,
  type LearningPoint,
} from "./ResultsClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Session results — Mostly Medicine" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SessionResultsPage({ params }: PageProps) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Pull session, attempts and profile in parallel — RLS on each table
  // already restricts to the owning user, so an unauthorised id returns
  // null and we redirect below.
  const [sessionRes, attemptsRes, profileRes] = await Promise.all([
    supabase
      .from("mcq_sessions")
      .select(
        "id, user_id, topic, target_count, status, started_at, ended_at, duration_seconds, questions_answered, score_pct, correct_count, percentile, learning_points"
      )
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("attempts")
      .select("id, question_id, is_correct, attempted_at")
      .eq("session_id", id)
      .order("attempted_at", { ascending: true }),
    supabase
      .from("user_profiles")
      .select("full_name, email, founder_rank, pro_until, current_streak")
      .eq("id", user.id)
      .maybeSingle(),
  ]);

  const session = sessionRes.data;
  if (!session) redirect("/dashboard/cat1");
  if (session.user_id !== user.id) redirect("/dashboard/cat1");

  if (session.status !== "completed") {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <div className="rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-pink-50 p-8 text-center shadow-sm">
          <p className="text-3xl">⏳</p>
          <h1 className="mt-3 text-xl font-bold text-gray-900">
            Session still in progress
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Your AMC recall isn&apos;t finished yet. Jump back in and complete the
            remaining questions to unlock your scorecard.
          </p>
          <Link
            href="/dashboard/cat1"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg"
          >
            ← Back to CAT 1
          </Link>
        </div>
      </div>
    );
  }

  const attempts = (attemptsRes.data ?? []) as AttemptRow[];
  const learningPoints = Array.isArray(session.learning_points)
    ? (session.learning_points as LearningPoint[])
    : [];

  const profile = profileRes.data ?? null;
  const founderActive =
    !!profile?.founder_rank &&
    !!profile?.pro_until &&
    Date.parse(profile.pro_until) > Date.now();

  const payload: ResultsPayload = {
    session: {
      id: session.id,
      topic: session.topic ?? null,
      startedAt: session.started_at,
      endedAt: session.ended_at,
      durationSeconds: session.duration_seconds ?? 0,
      questionsAnswered: session.questions_answered ?? attempts.length,
      targetCount: session.target_count ?? attempts.length,
      scorePct: typeof session.score_pct === "number" ? session.score_pct : 0,
      correctCount:
        typeof session.correct_count === "number"
          ? session.correct_count
          : attempts.filter((a) => a.is_correct).length,
      percentile:
        typeof session.percentile === "number" ? session.percentile : null,
    },
    attempts,
    learningPoints,
    user: {
      fullName: profile?.full_name ?? null,
      email: profile?.email ?? user.email ?? "",
      founderRank: founderActive ? profile?.founder_rank ?? null : null,
      currentStreak: profile?.current_streak ?? 0,
    },
  };

  return <ResultsClient data={payload} />;
}
