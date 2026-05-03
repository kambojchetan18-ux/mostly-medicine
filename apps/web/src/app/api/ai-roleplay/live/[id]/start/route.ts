import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Host advances the session into reading or roleplay phase. Guests can also
// trigger a transition once both are present — the order is enforced by the
// allowed list below.
const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  waiting: ["reading"],
  reading: ["roleplay"],
  roleplay: ["completed", "abandoned"],
};

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { to?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const target = body.to;
  if (!target) return NextResponse.json({ error: "to required" }, { status: 400 });

  const { data: session } = await supabase
    .from("acrp_live_sessions")
    .select("id, host_user_id, guest_user_id, status")
    .eq("id", id)
    .single();
  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
  if (session.host_user_id !== user.id && session.guest_user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const allowed = ALLOWED_TRANSITIONS[session.status] ?? [];
  if (!allowed.includes(target)) {
    return NextResponse.json({ error: `Cannot move ${session.status} → ${target}` }, { status: 409 });
  }
  if (target === "reading" && !session.guest_user_id) {
    return NextResponse.json({ error: "Guest hasn't joined yet" }, { status: 409 });
  }

  const updates: Record<string, unknown> = { status: target };
  const now = new Date().toISOString();
  if (target === "reading") updates.reading_started_at = now;
  if (target === "roleplay") updates.roleplay_started_at = now;
  if (target === "completed" || target === "abandoned") updates.ended_at = now;

  const { error } = await supabase.from("acrp_live_sessions").update(updates).eq("id", id);
  if (error) {
    console.error("[live/start]", error.message);
    return NextResponse.json({ error: "Failed to start session" }, { status: 500 });
  }
  return NextResponse.json({ status: target });
}
