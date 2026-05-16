import { NextRequest, NextResponse } from "next/server";

// Diagnostic endpoint — returns ONLY whether specific env vars are set.
// Protected by CRON_SECRET to prevent infrastructure enumeration.

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const want = [
    "CLOUDFLARE_TURN_KEY_ID",
    "CLOUDFLARE_TURN_API_TOKEN",
    "GROQ_API_KEY",
    "STRIPE_SECRET_KEY",
    "ANTHROPIC_API_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "NEXT_PUBLIC_SUPABASE_URL",
  ];
  const status: Record<string, boolean> = {};
  for (const k of want) status[k] = Boolean(process.env[k]);
  // Also list any CLOUDFLARE_ keys present so a typo (CLOUDFARE_*, etc.)
  // is obvious.
  const cloudflareKeys = Object.keys(process.env)
    .filter((k) => k.startsWith("CLOUDFLARE_") || k.startsWith("CLOUDFARE_") || k.startsWith("CF_"))
    .sort();
  // Hidden gotcha we hit twice: Vercel UI sometimes pastes a trailing '\n'
  // (or other whitespace) into NEXT_PUBLIC_SUPABASE_URL. The URL still
  // 'looks set' — every truthy check passes — but the realtime WebSocket
  // URL becomes wss://...supabase.co\n/realtime/v1/... which fails. Surface
  // length + last codepoint so the corruption is detectable from the phone.
  const v = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const lastCode = v.length > 0 ? v.charCodeAt(v.length - 1) : null;
  const supabaseUrlHealth = {
    length: v.length,
    lastCharCode: lastCode,
    trailingWhitespace: lastCode !== null && (lastCode <= 32 || lastCode === 0x7f),
    looksValid: /^https?:\/\/[a-z0-9-]+\.supabase\.co$/.test(v),
  };
  return NextResponse.json({
    runtime: "ok",
    env: status,
    cloudflareKeys,
    supabaseUrlHealth,
  });
}
