import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, recordFailedAttempt } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  // Rate limit by IP — max 5 signup attempts per 15 min
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const key = `signup:${ip}`;
  const { allowed, retryAfterMs } = await checkRateLimit(key);
  if (!allowed) {
    const minutesLeft = Math.ceil((retryAfterMs ?? 0) / 60000);
    return NextResponse.json(
      { error: `Too many signup attempts. Try again in ${minutesLeft} minute${minutesLeft !== 1 ? "s" : ""}.` },
      { status: 429 }
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  });

  if (error) {
    console.error("[signup error]", error.message);
    await recordFailedAttempt(key);
    return NextResponse.json({ error: "Signup failed. Please try again." }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
