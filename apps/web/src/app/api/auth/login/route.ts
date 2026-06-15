import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, recordFailedAttempt, clearAttempts, aiRateLimit } from "@/lib/rate-limit";
import { getRequestId } from "@/lib/request-id";

const DAILY_EMAIL_MAX = 50;
const DAILY_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function POST(req: NextRequest) {
  const requestId = getRequestId();
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400, headers: { "X-Request-Id": requestId } });
  }

  const normalEmail = email.toLowerCase();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  // 1) Per-IP+email rate limit (existing: 5 attempts / 15 min lockout)
  const key = `${ip}:${normalEmail}`;
  const { allowed, retryAfterMs } = await checkRateLimit(key);
  if (!allowed) {
    const minutesLeft = Math.ceil((retryAfterMs ?? 0) / 60000);
    console.warn(`[auth/login] rid=${requestId} per-ip rate limit hit ip=${ip} email=${normalEmail}`);
    return NextResponse.json(
      { error: `Too many failed attempts. Try again in ${minutesLeft} minute${minutesLeft !== 1 ? "s" : ""}.` },
      { status: 429, headers: { "X-Request-Id": requestId } }
    );
  }

  // 2) Per-email daily cap (50 attempts/day regardless of IP)
  const dailyKey = `email-daily:${normalEmail}`;
  const daily = await aiRateLimit(dailyKey, { max: DAILY_EMAIL_MAX, windowMs: DAILY_WINDOW_MS });
  if (!daily.allowed) {
    const hoursLeft = Math.ceil((daily.retryAfterMs ?? 0) / 3_600_000);
    console.warn(`[auth/login] rid=${requestId} daily email cap hit email=${normalEmail} count=${daily.count}`);
    return NextResponse.json(
      { error: `Too many login attempts for this account today. Try again in ${hoursLeft} hour${hoursLeft !== 1 ? "s" : ""}.` },
      { status: 429, headers: { "X-Request-Id": requestId } }
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const { locked, attemptsLeft } = await recordFailedAttempt(key);
    if (locked) {
      console.warn(`[auth/login] rid=${requestId} account locked ip=${ip} email=${normalEmail}`);
      return NextResponse.json(
        { error: "Too many failed attempts. Your account is locked for 15 minutes." },
        { status: 429, headers: { "X-Request-Id": requestId } }
      );
    }
    const hint = attemptsLeft <= 2 ? ` (${attemptsLeft} attempt${attemptsLeft !== 1 ? "s" : ""} left before lockout)` : "";
    return NextResponse.json(
      { error: `Invalid email or password.${hint}` },
      { status: 401, headers: { "X-Request-Id": requestId } }
    );
  }

  await clearAttempts(key);
  console.info(`[auth/login] rid=${requestId} success email=${normalEmail}`);
  return NextResponse.json({ success: true }, { headers: { "X-Request-Id": requestId } });
}
