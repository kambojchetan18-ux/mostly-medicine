import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, recordFailedAttempt, clearAttempts } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const ipEmailKey = `login:${ip}:${email.toLowerCase()}`;
  const emailOnlyKey = `login:email:${email.toLowerCase()}`;

  const [ipCheck, emailCheck] = await Promise.all([
    checkRateLimit(ipEmailKey),
    checkRateLimit(emailOnlyKey),
  ]);
  if (!ipCheck.allowed || !emailCheck.allowed) {
    const retryMs = Math.max(ipCheck.retryAfterMs ?? 0, emailCheck.retryAfterMs ?? 0);
    const minutesLeft = Math.ceil(retryMs / 60000);
    return NextResponse.json(
      { error: `Too many failed attempts. Try again in ${minutesLeft} minute${minutesLeft !== 1 ? "s" : ""}.` },
      { status: 429 }
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const [{ locked, attemptsLeft }] = await Promise.all([
      recordFailedAttempt(ipEmailKey),
      recordFailedAttempt(emailOnlyKey),
    ]);
    if (locked) {
      return NextResponse.json(
        { error: "Too many failed attempts. Your account is locked for 15 minutes." },
        { status: 429 }
      );
    }
    const hint = attemptsLeft <= 2 ? ` (${attemptsLeft} attempt${attemptsLeft !== 1 ? "s" : ""} left before lockout)` : "";
    return NextResponse.json(
      { error: `Invalid email or password.${hint}` },
      { status: 401 }
    );
  }

  await Promise.all([clearAttempts(ipEmailKey), clearAttempts(emailOnlyKey)]);
  return NextResponse.json({ success: true });
}
