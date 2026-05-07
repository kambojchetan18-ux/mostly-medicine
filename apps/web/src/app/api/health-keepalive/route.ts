import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

// Daily keepalive ping. Hits the database with a single tiny read so the
// Supabase free-tier project does not auto-pause after 7 days of inactivity.
// Triggered by Vercel Cron via vercel.json. The request is also safe to curl
// for manual liveness checks.
//
// Auth model:
//   - If CRON_SECRET is set on the Vercel project, requests must carry
//     Authorization: Bearer <CRON_SECRET>. Vercel cron sends this header
//     automatically.
//   - If CRON_SECRET is not set, the route is open. This is a graceful
//     default so the founder can wire the cron up first and add the secret
//     later without a 401 storm.

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type KeepaliveOk = {
  ok: true;
  timestamp: string;
  supabase: "alive";
};

type KeepaliveErr = {
  ok: false;
  error: string;
};

export async function GET(req: NextRequest): Promise<NextResponse<KeepaliveOk | KeepaliveErr>> {
  try {
    const secret = process.env.CRON_SECRET;
    if (!secret) {
      return NextResponse.json<KeepaliveErr>(
        { ok: false, error: "CRON_SECRET not configured" },
        { status: 503 }
      );
    }
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json<KeepaliveErr>(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceKey) {
      console.error("[health-keepalive] missing Supabase env vars");
      return NextResponse.json<KeepaliveErr>(
        { ok: false, error: "Supabase env vars missing" },
        { status: 500 }
      );
    }

    const sb = createServiceClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // One small read to keep the DB warm. Service-role bypasses RLS, so this
    // works regardless of how restrictive the policies are.
    const { error } = await sb
      .from("module_permissions")
      .select("*", { count: "exact", head: true })
      .limit(1);

    if (error) {
      console.error("[health-keepalive] supabase read failed:", error.message);
      return NextResponse.json<KeepaliveErr>(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json<KeepaliveOk>({
      ok: true,
      timestamp: new Date().toISOString(),
      supabase: "alive",
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown error";
    console.error("[health-keepalive] unhandled error:", msg);
    return NextResponse.json<KeepaliveErr>(
      { ok: false, error: msg },
      { status: 500 }
    );
  }
}
