import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { checkModulePermission } from "@/lib/permissions";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const perm = await checkModulePermission(supabase, "acrp_live");
  if (!perm.allowed) return NextResponse.json({ error: "upgrade_required" }, { status: 403 });

  let body: { inviteCode?: string };
  try {
    body = await req.json();
  } catch {
    body = {};
  }
  const code = body.inviteCode?.trim().toUpperCase();
  if (!code) return NextResponse.json({ error: "inviteCode required" }, { status: 400 });

  // Use service role for the initial lookup — RLS only lets participants SELECT,
  // so a brand-new guest can't see the row otherwise.
  const service = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
  const { data: session } = await service
    .from("acrp_live_sessions")
    .select("id, host_user_id, guest_user_id, status, host_role, invite_code")
    .eq("invite_code", code)
    .maybeSingle();
  if (!session) return NextResponse.json({ error: "Invalid code" }, { status: 404 });

  // Host re-opening their own session → just return it
  if (session.host_user_id === user.id) {
    return NextResponse.json({ sessionId: session.id, role: session.host_role, alreadyHost: true });
  }

  // Already paired with someone else
  if (session.guest_user_id && session.guest_user_id !== user.id) {
    return NextResponse.json({ error: "Session already full" }, { status: 409 });
  }

  // Claim guest seat — reuse the service client created above.
  if (!session.guest_user_id) {
    const { error } = await service
      .from("acrp_live_sessions")
      .update({ guest_user_id: user.id })
      .eq("id", session.id)
      .is("guest_user_id", null); // race-safe: only claim if seat still null
    if (error) {
      console.error("[live/join] claim error", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  const guestRole = session.host_role === "doctor" ? "patient" : "doctor";
  return NextResponse.json({ sessionId: session.id, role: guestRole, alreadyHost: false });
}
