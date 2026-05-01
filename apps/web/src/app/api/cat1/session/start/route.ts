import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface StartBody {
  topic?: string | null;
  targetCount?: number;
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

  const targetCount = Math.max(1, Math.min(100, Number(body.targetCount) || 20));
  const topic = typeof body.topic === "string" && body.topic.trim() ? body.topic.trim() : null;

  const { data, error } = await supabase
    .from("mcq_sessions")
    .insert({
      user_id: user.id,
      topic,
      target_count: targetCount,
      status: "active",
    })
    .select("id, started_at")
    .single();
  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Insert failed" }, { status: 500 });
  }
  return NextResponse.json({ sessionId: data.id, startedAt: data.started_at });
}
