import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, recordFailedAttempt, clearAttempts, checkDailyEmailLimit, recordDailyEmailAttempt } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const dailyCheck = await checkDailyEmailLimit(normalizedEmail);
  if (!dailyCheck.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts for this account today. Please try again tomorrow or reset your password." },
      { status: 429 }
    );
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const key = `${ip}:${normalizedEmail}`;

  const { allowed, retryAfterMs } = await checkRateLimit(key);
  if (!allowed) {
    const minutesLeft = Math.ceil((retryAfterMs ?? 0) / 60000);
    return NextResponse.json(
      { error: `Too many failed attempts. Try again in ${minutesLeft} minute${minutesLeft !== 1 ? "s" : ""}.` },
      { status: 429 }
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    await recordDailyEmailAttempt(normalizedEmail);
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
