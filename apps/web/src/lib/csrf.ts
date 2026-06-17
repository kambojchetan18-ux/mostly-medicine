import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ORIGINS = [
  "https://www.mostlymedicine.com",
  "https://mostlymedicine.com",
];

export function validateOrigin(req: NextRequest): NextResponse | null {
  if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") {
    return null;
  }

  // Skip for Bearer token auth (mobile app / API clients)
  if (req.headers.get("authorization")?.startsWith("Bearer ")) {
    return null;
  }

  const origin = req.headers.get("origin");

  // In development, allow localhost
  if (process.env.NODE_ENV === "development") {
    return null;
  }

  // Vercel preview deployments
  if (origin && /^https:\/\/.*\.vercel\.app$/.test(origin)) {
    return null;
  }

  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null;
}
