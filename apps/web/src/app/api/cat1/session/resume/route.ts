import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface ResumeBody {
  topic?: string | null;
  // Optional: client tells us the session size it wants. If the existing
  // active session has a smaller target_count (e.g. an older 20-count row
  // created before Pro's full-pool option), we bump it here so the resumed
  // session's stored size matches what the user is about to attempt.
  desiredTargetCount?: number;
}

// Returns the user's latest still-active mcq_session for the given topic
// (or for the "all topics" pool when topic is null) along with the set of
// question_ids they have already answered in that session. The Cat1 client
// filters those out of the question pool so the next quiz picks up where the
// user left off instead of restarting at question 1.
//
// If there is no active session, the client should fall back to /session/start.
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: ResumeBody = {};
  try {
    body = await req.json();
  } catch {
    /* empty body is fine */
  }
  const topic = typeof body.topic === "string" && body.topic.trim() ? body.topic.trim() : null;

  // Find the most recent active session matching this topic. Topic match must
  // be exact OR both null (the "mixed pool" sessions).
  const sessionQuery = supabase
    .from("mcq_sessions")
    .select("id, started_at, target_count, topic, question_ids")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("started_at", { ascending: false })
    .limit(1);

  const { data: rows } = topic
    ? await sessionQuery.eq("topic", topic)
    : await sessionQuery.is("topic", null);

  const session = rows?.[0];
  if (!session) {
    return NextResponse.json({ active: false });
  }

  // Full attempt history for this session, including the picked option
  // letter so the client can re-render the user's original choice when
  // they navigate to a previously-answered question.
  const { data: attemptRows } = await supabase
    .from("attempts")
    .select("question_id, is_correct, selected_label, attempted_at")
    .eq("session_id", session.id)
    .order("attempted_at", { ascending: true });

  const attempts = (attemptRows ?? [])
    .filter((a) => typeof a.question_id === "string" && a.question_id.length > 0)
    .map((a) => ({
      questionId: a.question_id as string,
      isCorrect: !!a.is_correct,
      selected: typeof a.selected_label === "string" ? a.selected_label : null,
    }));

  // Bump target_count if the client is about to attempt more than the row
  // currently stores. Capped at 2000 to match session/start.
  let effectiveTargetCount = session.target_count ?? 0;
  const desired = Number(body.desiredTargetCount) || 0;
  if (desired > effectiveTargetCount && desired <= 2000) {
    effectiveTargetCount = desired;
    await supabase
      .from("mcq_sessions")
      .update({ target_count: desired })
      .eq("id", session.id);
  }

  const persistedIds = Array.isArray(session.question_ids)
    ? (session.question_ids as string[])
    : [];

  return NextResponse.json({
    active: true,
    sessionId: session.id,
    startedAt: session.started_at,
    targetCount: effectiveTargetCount,
    questionIds: persistedIds,
    attempts,
    // Kept for backwards compatibility with older client builds.
    attemptedIds: attempts.map((a) => a.questionId),
  });
}
