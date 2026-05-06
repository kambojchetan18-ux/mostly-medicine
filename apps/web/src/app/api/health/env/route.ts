import { NextResponse } from "next/server";

// This diagnostic endpoint has been removed for security reasons.
// It previously leaked infrastructure configuration details (which env vars
// are set, Cloudflare key names, etc.) without authentication.

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
