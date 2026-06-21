import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

export function verifyCronAuth(req: NextRequest): { ok: true } | { ok: false; status: 401 | 503 } {
  const secret = process.env.CRON_SECRET;
  if (!secret) return { ok: false, status: 503 };

  const auth = req.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret}`;

  if (auth.length !== expected.length) return { ok: false, status: 401 };

  const a = Buffer.from(auth);
  const b = Buffer.from(expected);
  if (!timingSafeEqual(a, b)) return { ok: false, status: 401 };

  return { ok: true };
}
