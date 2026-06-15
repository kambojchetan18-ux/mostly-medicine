import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, recordFailedAttempt } from "@/lib/rate-limit";
import { getRequestId } from "@/lib/request-id";

export async function POST(req: NextRequest) {
  const requestId = getRequestId();
  let body: { email?: string; password?: string; name?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400, headers: { "X-Request-Id": requestId } }); }
  const { email, password, name } = body;

  if (!email || !password || !name) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400, headers: { "X-Request-Id": requestId } });
  }

  // Rate limit by IP — max 5 signup attempts per 15 min
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const key = `signup:${ip}`;
  const { allowed, retryAfterMs } = await checkRateLimit(key);
  if (!allowed) {
    const minutesLeft = Math.ceil((retryAfterMs ?? 0) / 60000);
    console.warn(`[auth/signup] rid=${requestId} rate limit hit ip=${ip}`);
    return NextResponse.json(
      { error: `Too many signup attempts. Try again in ${minutesLeft} minute${minutesLeft !== 1 ? "s" : ""}.` },
      { status: 429, headers: { "X-Request-Id": requestId } }
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  });

  if (error) {
    await recordFailedAttempt(key);
    console.warn(`[auth/signup] rid=${requestId} failed: ${error.message}`);
    return NextResponse.json({ error: error.message }, { status: 400, headers: { "X-Request-Id": requestId } });
  }

  console.info(`[auth/signup] rid=${requestId} success email=${email}`);
  return NextResponse.json({ success: true }, { headers: { "X-Request-Id": requestId } });
}
