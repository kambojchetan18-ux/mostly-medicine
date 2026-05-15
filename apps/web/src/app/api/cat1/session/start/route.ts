import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkModulePermission } from "@/lib/permissions";

export const dynamic = "force-dynamic";

interface StartBody {
  topic?: string | null;
  targetCount?: number;
  questionIds?: string[];
  // True when the client is starting a Mock Exam paper. The route enforces
  // module_permissions.mock_exam.daily_limit and writes is_mock=true on
  // the row so subsequent runs can cap correctly.
  mock?: boolean;
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
  const isMock = body.mock === true;

  // Mock-only daily cap. Free + Pro default to 1 paper/day (admin-tunable
  // via /dashboard/admin → module_permissions.mock_exam.daily_limit);
  // Enterprise = null = unlimited.
  if (isMock) {
    const perm = await checkModulePermission(supabase, "mock_exam");
    if (!perm.allowed) {
      return NextResponse.json(
        { error: "mock_exam_disabled", plan: perm.plan },
        { status: 403 },
      );
    }
    if (perm.dailyLimit != null) {
      const startOfDay = new Date();
      startOfDay.setUTCHours(0, 0, 0, 0);
      const { count } = await supabase
        .from("mcq_sessions")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_mock", true)
        .gte("created_at", startOfDay.toISOString());
      const used = count ?? 0;
      if (used >= perm.dailyLimit) {
        return NextResponse.json(
          {
            error: "mock_daily_limit_reached",
            plan: perm.plan,
            dailyLimit: perm.dailyLimit,
            used,
          },
          { status: 429 },
        );
      }
    }
  }

  const { data, error } = await supabase
    .from("mcq_sessions")
    .insert({
      user_id: user.id,
      topic,
      target_count: targetCount,
      status: "active",
      is_mock: isMock,
      ...(questionIds ? { question_ids: questionIds } : {}),
    })
    .select("id, started_at")
    .single();
  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Insert failed" }, { status: 500 });
  }
  return NextResponse.json({ sessionId: data.id, startedAt: data.started_at });
}
