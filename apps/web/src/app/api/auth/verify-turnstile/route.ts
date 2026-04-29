import { NextRequest, NextResponse } from "next/server";

// Cloudflare Turnstile verify endpoint. Fail-closed if env vars are missing
// — refuses to act as a "bypass" if the operator forgot to configure secrets.
//
// Flow:
//   client (signup form) → Turnstile widget renders → user solves → token
//   client → POST /api/auth/verify-turnstile { token }
//   we → POST https://challenges.cloudflare.com/turnstile/v0/siteverify
//   we → 200 { ok: true }   on success
//        403 { error: "..." } on failure / missing config
const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function POST(req: NextRequest) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    // Fail-closed: never let a misconfigured deploy silently allow signups.
    return NextResponse.json(
      { error: "Turnstile not configured" },
      { status: 403 }
    );
  }

  let body: { token?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const token = body?.token;
  if (!token || typeof token !== "string") {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  // Forward client IP so Cloudflare can correlate with the widget challenge.
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";

  const params = new URLSearchParams();
  params.set("secret", secret);
  params.set("response", token);
  if (ip) params.set("remoteip", ip);

  let verifyRes: Response;
  try {
    verifyRes = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      // Don't cache verification — each token must be checked fresh.
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { error: "Turnstile verification unreachable" },
      { status: 403 }
    );
  }

  let verify: { success?: boolean; "error-codes"?: string[] } = {};
  try {
    verify = await verifyRes.json();
  } catch {
    return NextResponse.json(
      { error: "Turnstile verification malformed" },
      { status: 403 }
    );
  }

  if (!verify.success) {
    return NextResponse.json(
      { error: "Turnstile verification failed", codes: verify["error-codes"] ?? [] },
      { status: 403 }
    );
  }

  return NextResponse.json({ ok: true });
}
