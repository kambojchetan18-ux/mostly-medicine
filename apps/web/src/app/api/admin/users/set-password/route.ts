import { NextRequest, NextResponse } from "next/server";
import { randomInt } from "node:crypto";
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

// 12-char temp password using a WhatsApp-friendly alphabet (no 0/O/1/l/I).
// Always contains 1 lower + 1 upper + 1 digit + 1 symbol so it satisfies any
// downstream password policy without needing a retry loop.
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

// Admin-only: directly set a target user's password via service-role.
// Bypasses email entirely — useful when SMTP is broken or a user is locked
// out and waiting on WhatsApp/SMS hand-off.
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
    passwordHint: `${password.slice(0, 3)}${"*".repeat(password.length - 3)}`,
    message: "Temporary password set. Deliver it securely via WhatsApp/SMS — it is NOT included in this response for security.",
  });
}
