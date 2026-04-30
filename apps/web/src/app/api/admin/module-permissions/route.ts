import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

async function assertAdmin(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data } = await supabase.from("user_profiles").select("role").eq("id", userId).single();
  return data?.role === "admin";
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await assertAdmin(supabase, user.id))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data, error } = await supabase
    .from("module_permissions")
    .select("*")
    .order("plan")
    .order("module");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ permissions: data });
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await assertAdmin(supabase, user.id))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { plan, module, enabled, daily_limit } = await req.json();
  if (!plan || !module) return NextResponse.json({ error: "plan and module required" }, { status: 400 });

  // Validate plan
  const VALID_PLANS = ["free", "pro", "enterprise"];
  if (!VALID_PLANS.includes(plan)) {
    return NextResponse.json({ error: `Invalid plan. Must be one of: ${VALID_PLANS.join(", ")}` }, { status: 400 });
  }

  // Validate module name — alphanumeric + underscores/hyphens, reasonable length
  if (typeof module !== "string" || !/^[a-zA-Z0-9_-]{1,64}$/.test(module)) {
    return NextResponse.json({ error: "Invalid module name" }, { status: 400 });
  }

  // Validate enabled
  if (typeof enabled !== "boolean") {
    return NextResponse.json({ error: "enabled must be a boolean" }, { status: 400 });
  }

  // Validate daily_limit — must be a non-negative integer or null
  if (daily_limit !== null && daily_limit !== undefined) {
    if (!Number.isInteger(daily_limit) || daily_limit < 0) {
      return NextResponse.json({ error: "daily_limit must be a non-negative integer or null" }, { status: 400 });
    }
  }

  const { error } = await supabase.from("module_permissions").upsert(
    { plan, module, enabled, daily_limit: daily_limit ?? null, updated_at: new Date().toISOString() },
    { onConflict: "plan,module" }
  );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
