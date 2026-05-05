import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClient as createCookieClient } from "@/lib/supabase/server";

// Track a PWA install event or a standalone-mode heartbeat.
// Auth-bypassed — anonymous installs still count. We attach user_id when
// the cookie session has one (most installs happen post-signup, this lets
// us correlate installs to user records).
//
// Idempotent: the unique (session_id, event_type, event_date) index in
// pwa_installs absorbs duplicate pings for the same browser on the same
// day. ON CONFLICT DO NOTHING returns silently.

interface Payload {
  session_id?: unknown;
  event_type?: unknown;
  platform_hint?: unknown;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const sessionId = typeof body.session_id === "string" ? body.session_id.slice(0, 64) : null;
  const eventType = typeof body.event_type === "string" ? body.event_type : null;
  const platformHint = typeof body.platform_hint === "string" ? body.platform_hint.slice(0, 32) : null;

  if (!sessionId || !eventType || !["installed", "heartbeat"].includes(eventType)) {
    return NextResponse.json({ ok: false, error: "bad_payload" }, { status: 400 });
  }

  // Capture user_id when the request carries an authed cookie session.
  let userId: string | null = null;
  try {
    const cookieClient = await createCookieClient();
    const { data } = await cookieClient.auth.getUser();
    userId = data.user?.id ?? null;
  } catch {
    // Anonymous install — fine, we just won't link to a user.
  }

  const userAgent = req.headers.get("user-agent")?.slice(0, 280) ?? null;

  const service = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await service.from("pwa_installs").insert({
    session_id: sessionId,
    user_id: userId,
    event_type: eventType,
    platform_hint: platformHint,
    user_agent: userAgent,
  });

  // 23505 = unique violation = already counted today. Treat as success.
  if (error && error.code !== "23505") {
    console.error("[pwa-install] insert failed", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
