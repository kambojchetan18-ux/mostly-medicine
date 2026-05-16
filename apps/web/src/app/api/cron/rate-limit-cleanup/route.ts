import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

// Daily cleanup of stale rate-limit rows. The rate_limit_attempts table
// accumulates one row per (key, window) pair; rows older than 24 h are
// never consulted again and just bloat the table.
//
// Triggered by Vercel Cron via vercel.json ("0 5 * * *").
// Protected by CRON_SECRET — Vercel sets the Authorization header
// automatically when the env var is configured on the project.

export const dynamic = "force-dynamic";
export const maxDuration = 30;

function service() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sb = service();
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await sb
    .from("rate_limit_attempts")
    .delete()
    .lt("updated_at", cutoff)
    .select("id");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, deleted: data?.length ?? 0 });
}
