import { NextRequest, NextResponse } from "next/server";
import { randomInt } from "node:crypto";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

function service() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

function generateTempPassword(): string {
  const lower  = "abcdefghjkmnpqrstuvwxyz";
  const upper  = "ABCDEFGHJKMNPQRSTUVWXYZ";
  const digit  = "23456789";
  const symbol = "!@#$%&*";
  const all    = lower + upper + digit + symbol;
  const pick = (s: string) => s[randomInt(0, s.length)];
  const required = [pick(lower), pick(upper), pick(digit), pick(symbol)];
  const rest = Array.from({ length: 8 }, () => pick(all));
  const arr = [...required, ...rest];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(0, i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join("");
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  const user = auth.user;

  let body: { userId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { userId } = body;
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const svc = service();
  const { data: target, error: lookupErr } = await svc.auth.admin.getUserById(userId);
  if (lookupErr || !target?.user) {
    return NextResponse.json({ error: lookupErr?.message ?? "User not found" }, { status: 404 });
  }

  // Refuse to overwrite another admin's password — this route is for unblocking
  // regular users in onboarding emergencies, not for privilege-takeover.
  const { data: targetProfile } = await svc
    .from("user_profiles")
    .select("role")
    .eq("id", userId)
    .single();
  if (targetProfile?.role === "admin" && userId !== user.id) {
    return NextResponse.json({ error: "Refusing to set another admin's password" }, { status: 403 });
  }

  const password = generateTempPassword();
  const { error: updErr } = await svc.auth.admin.updateUserById(userId, { password });
  if (updErr) {
    return NextResponse.json({ error: updErr.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    email: target.user.email ?? null,
    password,
  });
}
