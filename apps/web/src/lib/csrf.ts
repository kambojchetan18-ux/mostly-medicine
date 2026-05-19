import type { NextRequest } from "next/server";

const ALLOWED_ORIGINS = new Set([
  "https://mostlymedicine.com",
  "https://www.mostlymedicine.com",
]);

export function validateOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false;

  if (ALLOWED_ORIGINS.has(origin)) return true;

  try {
    const url = new URL(origin);
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") return true;
  } catch {
    return false;
  }

  return false;
}
