import { NextResponse } from "next/server";

// Temporary diagnostic endpoint — returns ONLY whether specific env vars
// are set on the runtime. Never returns values. Safe to expose publicly:
// the names are not secrets, only the values are. Remove this route once
// the Cloudflare TURN + Groq env-var debugging is finished.

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
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
  return NextResponse.json({ runtime: "ok", env: status, cloudflareKeys });
}
