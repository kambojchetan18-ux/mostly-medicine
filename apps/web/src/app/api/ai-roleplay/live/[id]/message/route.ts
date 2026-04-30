import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { bumpStreak } from "@/lib/streaks";

export const maxDuration = 30;

// Persist a transcript snippet from the speaker's local STT.
// Both clients also subscribe to acrp_live_messages via Realtime to render it.
export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { content?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const content = body.content?.trim();
  if (!content) return NextResponse.json({ error: "content required" }, { status: 400 });

  const { data: session } = await supabase
    .from("acrp_live_sessions")
    .select("id, host_user_id, guest_user_id, host_role, status")
    .eq("id", id)
    .single();
  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

  let role: "doctor" | "patient";
  if (session.host_user_id === user.id) {
    role = session.host_role as "doctor" | "patient";
  } else if (session.guest_user_id === user.id) {
    role = session.host_role === "doctor" ? "patient" : "doctor";
  } else {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (session.status !== "roleplay") {
    return NextResponse.json({ error: "Session not in roleplay phase" }, { status: 409 });
  }

  const { error } = await supabase
    .from("acrp_live_messages")
    .insert({ session_id: id, sender_role: role, sender_user_id: user.id, content });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await bumpStreak(supabase, user.id);

  return NextResponse.json({ ok: true });
}
