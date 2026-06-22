import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

export function verifyCronAuth(req: NextRequest): NextResponse | null {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "CRON_SECRET not configured" },
      { status: 503 }
    );
  }

  const auth = req.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret}`;

  if (auth.length !== expected.length) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const match = timingSafeEqual(
    Buffer.from(auth, "utf8"),
    Buffer.from(expected, "utf8")
  );

  if (!match) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
