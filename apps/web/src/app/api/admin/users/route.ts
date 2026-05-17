import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Service-role client used to mutate user_profiles columns that
// authenticated users no longer have column-level UPDATE on (role, plan,
// stripe_*, etc.) after migration 040. Only call AFTER an admin check
// has passed on the user-context client above.
function serviceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

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

const ALLOWED_PLANS = new Set(["free", "pro", "enterprise"]);
const ALLOWED_ROLES = new Set(["user", "admin"]);

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("user_profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { userId, plan, role } = await req.json();
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  // Whitelist values — refusing arbitrary strings prevents an admin (or a
  // compromised admin session) from setting role to gibberish that would
  // bypass plan-gating logic, or 'superadmin' that future code might honour.
  if (plan !== undefined && !ALLOWED_PLANS.has(plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }
  if (role !== undefined && !ALLOWED_ROLES.has(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  // Role-change guardrails:
  //   - Admins cannot change their own role (prevents accidental self-demotion
  //     locking the org out of admin access).
  //   - Admins cannot demote ANOTHER admin via this endpoint — privilege
  //     battles between admins should require a fresh login + explicit DB
  //     edit, not a single PATCH. Mirrors set-password's guard.
  if (role !== undefined) {
    if (userId === user.id) {
      return NextResponse.json({ error: "Cannot change your own role" }, { status: 403 });
    }
    const { data: target } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", userId)
      .single();
    if (target?.role === "admin" && role !== "admin") {
      return NextResponse.json({ error: "Cannot demote another admin" }, { status: 403 });
    }
  }

  const updates: Record<string, string> = { updated_at: new Date().toISOString() };
  if (plan !== undefined) updates.plan = plan;
  if (role !== undefined) updates.role = role;

  // Use the service-role client for the mutation — after migration 040,
  // `authenticated` users (which includes this admin's session) can no
  // longer column-update `plan` / `role` even on their own row. Admin
  // identity has already been verified above.
  const svc = serviceClient();
  const { error } = await svc.from("user_profiles").update(updates).eq("id", userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
