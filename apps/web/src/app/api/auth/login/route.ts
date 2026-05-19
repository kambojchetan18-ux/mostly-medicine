import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, recordFailedAttempt, clearAttempts, aiRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const ipEmailKey = `${ip}:${email.toLowerCase()}`;

  const { allowed, retryAfterMs } = await checkRateLimit(ipEmailKey);
  if (!allowed) {
    const minutesLeft = Math.ceil((retryAfterMs ?? 0) / 60000);
    return NextResponse.json(
      { error: `Too many failed attempts. Try again in ${minutesLeft} minute${minutesLeft !== 1 ? "s" : ""}.` },
      { status: 429 }
    );
  }

  const emailKey = `login-email:${email.toLowerCase()}`;
  const emailRl = await aiRateLimit(emailKey, { max: 15, windowMs: 60 * 60 * 1000 });
  if (!emailRl.allowed) {
    const minutesLeft = Math.ceil((emailRl.retryAfterMs ?? 0) / 60000);
    return NextResponse.json(
      { error: `Too many login attempts for this account. Try again in ${minutesLeft} minute${minutesLeft !== 1 ? "s" : ""}.` },
      { status: 429 }
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const { locked, attemptsLeft } = await recordFailedAttempt(ipEmailKey);
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

  await clearAttempts(ipEmailKey);
  await clearAttempts(emailKey);
  return NextResponse.json({ success: true });
}
