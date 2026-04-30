import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Check admin
  const { data: profile } = await supabase.from("user_profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data, error } = await supabase
    .from("user_profiles")
    .select("id, email, full_name, avatar_url, plan, role, created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ users: data });
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("user_profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { userId, plan, role } = await req.json();
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  // Self-demotion guard — prevent admins from accidentally removing their own admin role
  if (userId === user.id && role && role !== "admin") {
    return NextResponse.json({ error: "Cannot demote yourself" }, { status: 400 });
  }

  // Validate plan
  const VALID_PLANS = ["free", "pro", "enterprise"];
  if (plan && !VALID_PLANS.includes(plan)) {
    return NextResponse.json({ error: `Invalid plan. Must be one of: ${VALID_PLANS.join(", ")}` }, { status: 400 });
  }

  // Validate role
  const VALID_ROLES = ["user", "admin"];
  if (role && !VALID_ROLES.includes(role)) {
    return NextResponse.json({ error: `Invalid role. Must be one of: ${VALID_ROLES.join(", ")}` }, { status: 400 });
  }

  const updates: Record<string, string> = { updated_at: new Date().toISOString() };
  if (plan) updates.plan = plan;
  if (role) updates.role = role;

  const { error } = await supabase.from("user_profiles").update(updates).eq("id", userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
