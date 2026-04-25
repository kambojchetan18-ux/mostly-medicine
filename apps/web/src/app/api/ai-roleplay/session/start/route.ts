import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { caseId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  if (!body.caseId) return NextResponse.json({ error: "caseId required" }, { status: 400 });

  // If an active session already exists for this user+case, reuse it.
  const { data: existing } = await supabase
    .from("acrp_sessions")
    .select("id, status")
    .eq("user_id", user.id)
    .eq("case_id", body.caseId)
    .in("status", ["reading", "roleplay"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) {
    if (existing.status === "reading") {
      await supabase
        .from("acrp_sessions")
        .update({ status: "roleplay", roleplay_started_at: new Date().toISOString() })
        .eq("id", existing.id);
    }
    return NextResponse.json({ sessionId: existing.id, resumed: true });
  }

  const { data: created, error } = await supabase
    .from("acrp_sessions")
    .insert({
      user_id: user.id,
      case_id: body.caseId,
      status: "roleplay",
      roleplay_started_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error || !created) {
    console.error("[session/start]", error);
    return NextResponse.json({ error: error?.message ?? "Could not create session" }, { status: 500 });
  }

  return NextResponse.json({ sessionId: created.id, resumed: false });
}
