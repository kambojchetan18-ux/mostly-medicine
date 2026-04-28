import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function service() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let body: { userId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { userId } = body;
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  // Defensive guard: an admin must never be able to delete themselves
  // (locks them out and breaks the admin-bootstrap invariant) or another
  // admin (privilege-escalation / griefing risk between co-admins). The
  // client disables these buttons too — server enforcement is the source
  // of truth.
  if (userId === user.id) {
    return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
  }

  const svc = service();
  const { data: targetProfile } = await svc
    .from("user_profiles")
    .select("role")
    .eq("id", userId)
    .single();
  if (targetProfile?.role === "admin") {
    return NextResponse.json({ error: "Cannot delete another admin" }, { status: 400 });
  }

  // auth.users delete cascades to user_profiles, attempts, sr_cards, img_profiles,
  // smart_explanations, etc. via ON DELETE CASCADE FKs in the migrations.
  const { error: delErr } = await svc.auth.admin.deleteUser(userId);
  if (delErr) {
    return NextResponse.json({ error: delErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
