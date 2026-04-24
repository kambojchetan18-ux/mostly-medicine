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

  if (error) {
    console.error("[admin/module-permissions GET]", error.message);
    return NextResponse.json({ error: "Failed to fetch permissions" }, { status: 500 });
  }
  return NextResponse.json({ permissions: data });
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await assertAdmin(supabase, user.id))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { plan, module, enabled, daily_limit } = await req.json();
  if (!plan || typeof plan !== "string" || !module || typeof module !== "string") {
    return NextResponse.json({ error: "plan and module required" }, { status: 400 });
  }

  const { error } = await supabase.from("module_permissions").upsert(
    { plan, module, enabled: !!enabled, daily_limit: typeof daily_limit === "number" ? daily_limit : null, updated_at: new Date().toISOString() },
    { onConflict: "plan,module" }
  );
  if (error) {
    console.error("[admin/module-permissions PATCH]", error.message);
    return NextResponse.json({ error: "Failed to update permissions" }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
