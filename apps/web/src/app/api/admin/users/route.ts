import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { aiRateLimit, clientKey } from "@/lib/rate-limit";

const PAGE_SIZE = 50;

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("user_profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const rl = await aiRateLimit(clientKey(req, "admin-users", user.id), { max: 60, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const page = Math.max(0, parseInt(req.nextUrl.searchParams.get("page") ?? "0", 10) || 0);
  const q = req.nextUrl.searchParams.get("q")?.trim();

  let query = supabase
    .from("user_profiles")
    .select("id, email, full_name, avatar_url, plan, role, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

  if (q && q.length >= 2) {
    query = query.or(`email.ilike.%${q}%,full_name.ilike.%${q}%`);
  }

  const { data, error, count } = await query;

  if (error) return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  return NextResponse.json({ users: data, total: count, page, pageSize: PAGE_SIZE });
}

const ALLOWED_PLANS = new Set(["free", "pro", "enterprise"]);
const ALLOWED_ROLES = new Set(["user", "admin"]);

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("user_profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const rl = await aiRateLimit(clientKey(req, "admin-users-patch", user.id), { max: 30, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const { userId, plan, role } = await req.json();
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  if (plan !== undefined && !ALLOWED_PLANS.has(plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }
  if (role !== undefined && !ALLOWED_ROLES.has(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

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

  const { error } = await supabase.from("user_profiles").update(updates).eq("id", userId);
  if (error) return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  return NextResponse.json({ success: true });
}
