import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
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

  if (error) {
    console.error("[admin/users] list error", error.message);
    return NextResponse.json({ error: "Failed to load users." }, { status: 500 });
  }
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

  const VALID_PLANS = ["free", "pro", "enterprise"];
  const VALID_ROLES = ["user", "admin"];

  if (plan && !VALID_PLANS.includes(plan)) {
    return NextResponse.json({ error: "Invalid plan. Must be: free, pro, or enterprise" }, { status: 400 });
  }
  if (role && !VALID_ROLES.includes(role)) {
    return NextResponse.json({ error: "Invalid role. Must be: user or admin" }, { status: 400 });
  }

  const updates: Record<string, string> = { updated_at: new Date().toISOString() };
  if (plan) updates.plan = plan;
  if (role) updates.role = role;

  const { error } = await supabase.from("user_profiles").update(updates).eq("id", userId);
  if (error) {
    console.error("[admin/users] update error", error.message);
    return NextResponse.json({ error: "Failed to update user." }, { status: 500 });
  }

  const svc = createServiceClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  await svc.from("admin_audit_log").insert({
    admin_id: user.id,
    action: "update_user",
    target_type: "user_profile",
    target_id: userId,
    details: { plan: plan || undefined, role: role || undefined },
  });

  return NextResponse.json({ success: true });
}
