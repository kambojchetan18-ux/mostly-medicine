import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface StartBody {
  topic?: string | null;
  targetCount?: number;
  // Optional: client passes the ordered list of question ids it has just
  // sampled. Persisting them lets us rebuild the same paper after a refresh
  // / logout instead of re-shuffling on every visit.
  questionIds?: string[];
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: StartBody = {};
  try {
    body = await req.json();
  } catch {
    /* empty body is fine */
  }

  // Cap raised from 100 → 2000 to allow Pro "practice the whole specialty"
  // sessions; UI gates large counts to plan === pro/enterprise.
  const targetCount = Math.max(1, Math.min(2000, Number(body.targetCount) || 20));
  const topic = typeof body.topic === "string" && body.topic.trim() ? body.topic.trim() : null;
  const questionIds = Array.isArray(body.questionIds)
    ? body.questionIds.filter((x): x is string => typeof x === "string").slice(0, 2000)
    : null;

  const { data, error } = await supabase
    .from("mcq_sessions")
    .insert({
      user_id: user.id,
      topic,
      target_count: targetCount,
      status: "active",
      ...(questionIds ? { question_ids: questionIds } : {}),
    })
    .select("id, started_at")
    .single();
  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Insert failed" }, { status: 500 });
  }
  return NextResponse.json({ sessionId: data.id, startedAt: data.started_at });
}
