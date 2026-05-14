import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface ResumeBody {
  topic?: string | null;
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
    .select("id, started_at, target_count, topic")
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

  // Question IDs already answered in this session — to be excluded from the
  // next quiz pool by the client.
  const { data: attempts } = await supabase
    .from("attempts")
    .select("question_id")
    .eq("session_id", session.id);

  const attemptedIds = (attempts ?? [])
    .map((a) => a.question_id)
    .filter((id): id is string => typeof id === "string" && id.length > 0);

  return NextResponse.json({
    active: true,
    sessionId: session.id,
    startedAt: session.started_at,
    targetCount: session.target_count,
    attemptedIds,
  });
}
