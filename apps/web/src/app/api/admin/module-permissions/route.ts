import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

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

  if (error) {
    console.error("[admin/module-permissions GET]", error.message);
    return NextResponse.json({ error: "Failed to load module permissions" }, { status: 500 });
  }
  return NextResponse.json({ permissions: data });
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await assertAdmin(supabase, user.id))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { plan, module, enabled, daily_limit } = await req.json();
  if (!plan || !module) return NextResponse.json({ error: "plan and module required" }, { status: 400 });

  const VALID_PLANS = ["free", "pro", "enterprise"];
  const VALID_MODULES = ["mcq", "roleplay", "acrp_solo", "acrp_live"];
  if (!VALID_PLANS.includes(plan)) {
    return NextResponse.json({ error: `Invalid plan. Must be one of: ${VALID_PLANS.join(", ")}` }, { status: 400 });
  }
  if (!VALID_MODULES.includes(module)) {
    return NextResponse.json({ error: `Invalid module. Must be one of: ${VALID_MODULES.join(", ")}` }, { status: 400 });
  }

  const { error } = await supabase.from("module_permissions").upsert(
    { plan, module, enabled, daily_limit, updated_at: new Date().toISOString() },
    { onConflict: "plan,module" }
  );
  if (error) {
    console.error("[admin/module-permissions PATCH]", error.message);
    return NextResponse.json({ error: "Failed to update module permissions" }, { status: 500 });
  }

  // Bust any cached dashboard pages so the new permissions are visible to
  // free/pro users on their very next request, not after the natural cache
  // window. dashboard/layout.tsx is already force-dynamic so this is mostly
  // belt-and-suspenders, but explicit revalidation also covers any nested
  // page that might add its own caching later.
  revalidatePath("/dashboard", "layout");

  return NextResponse.json({ success: true });
}
