import type { NextRequest } from "next/server";

const ALLOWED_ORIGINS = new Set([
  "https://mostlymedicine.com",
  "https://www.mostlymedicine.com",
]);

if (process.env.NODE_ENV === "development") {
  ALLOWED_ORIGINS.add("http://localhost:3000");
  ALLOWED_ORIGINS.add("http://localhost:3001");
}

export function checkOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  return ALLOWED_ORIGINS.has(origin);
}
