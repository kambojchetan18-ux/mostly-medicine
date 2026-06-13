import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, recordFailedAttempt, clearAttempts } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = body.password;

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const key = `${ip}:${email}`;

  // Per-IP+email rate limit (5 attempts / 15 min window)
  const { allowed, retryAfterMs } = await checkRateLimit(key);
  if (!allowed) {
    const minutesLeft = Math.ceil((retryAfterMs ?? 0) / 60000);
    return NextResponse.json(
      { error: `Too many failed attempts. Try again in ${minutesLeft} minute${minutesLeft !== 1 ? "s" : ""}.` },
      { status: 429 }
    );
  }

  // Account-level rate limit — 50 attempts/day per email regardless of IP
  const accountKey = `login-daily:${email}`;
  const dailyCheck = await checkRateLimit(accountKey, { maxAttempts: 50, windowMs: 24 * 60 * 60 * 1000 });
  if (!dailyCheck.allowed) {
    return NextResponse.json(
      { error: "This account has been temporarily locked due to too many login attempts today. Please try again tomorrow or reset your password." },
      { status: 429 }
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    await recordFailedAttempt(accountKey);
    const { locked, attemptsLeft } = await recordFailedAttempt(key);
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

  await clearAttempts(key);
  return NextResponse.json({ success: true });
}
