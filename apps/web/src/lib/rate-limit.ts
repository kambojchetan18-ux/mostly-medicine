import { createClient } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Best-effort client IP extractor for AI endpoint rate limiting. Vercel
// always sets x-forwarded-for; first hop is the originating client.
export function clientKey(req: NextRequest, prefix: string, userId?: string | null): string {
  if (userId) return `${prefix}:u:${userId}`;
  const fwd = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "0.0.0.0";
  const ip = fwd.split(",")[0]?.trim() || "0.0.0.0";
  return `${prefix}:ip:${ip}`;
}

export async function checkRateLimit(key: string): Promise<{ allowed: boolean; retryAfterMs?: number }> {
  const supabase = serviceClient();
  const now = new Date();

  const { data } = await supabase
    .from("rate_limit_attempts")
    .select("count, first_attempt_at, locked_until")
    .eq("key", key)
    .single();

  if (!data) return { allowed: true };

  if (data.locked_until) {
    const lockedUntil = new Date(data.locked_until).getTime();
    if (Date.now() < lockedUntil) {
      return { allowed: false, retryAfterMs: lockedUntil - Date.now() };
    }
    // Lockout expired — clean up
    await supabase.from("rate_limit_attempts").delete().eq("key", key);
    return { allowed: true };
  }

  const windowExpired = Date.now() - new Date(data.first_attempt_at).getTime() > WINDOW_MS;
  if (windowExpired) {
    await supabase.from("rate_limit_attempts").delete().eq("key", key);
    return { allowed: true };
  }

  return { allowed: true };
}

export async function recordFailedAttempt(key: string): Promise<{ locked: boolean; attemptsLeft: number }> {
  const supabase = serviceClient();
  const now = new Date().toISOString();

  const { data } = await supabase
    .from("rate_limit_attempts")
    .select("count, first_attempt_at")
    .eq("key", key)
    .single();

  const currentCount = data?.count ?? 0;
  const firstAttempt = data?.first_attempt_at ?? now;
  const newCount = currentCount + 1;
  const lockedUntil = newCount >= MAX_ATTEMPTS
    ? new Date(Date.now() + WINDOW_MS).toISOString()
    : null;

  await supabase.from("rate_limit_attempts").upsert({
    key,
    count: newCount,
    first_attempt_at: firstAttempt,
    locked_until: lockedUntil,
    updated_at: now,
  });

  return {
    locked: newCount >= MAX_ATTEMPTS,
    attemptsLeft: Math.max(0, MAX_ATTEMPTS - newCount),
  };
}

export async function clearAttempts(key: string): Promise<void> {
  const supabase = serviceClient();
  await supabase.from("rate_limit_attempts").delete().eq("key", key);
}

// Per-IP / per-user "calls in a rolling window" limiter for AI endpoints.
// Cheap and good enough to block runaway scripts hitting Anthropic on our
// dime. Uses an atomic Postgres function (check_and_increment_rate_limit)
// so that concurrent requests cannot both read the same low count and slip
// through — fixing the old TOCTOU race where a SELECT-then-UPSERT pattern
// let two simultaneous requests both pass.
//
// Defaults: 30 calls / 60s. Tuned so a chatty student typing fast still
// works but a `for i in {1..1000}` loop is stopped.
export async function aiRateLimit(
  key: string,
  opts: { max?: number; windowMs?: number } = {}
): Promise<{ allowed: boolean; retryAfterMs?: number; count: number; max: number }> {
  const max = opts.max ?? 30;
  const windowMs = opts.windowMs ?? 60 * 1000;
  const supabase = serviceClient();

  const { data, error } = await supabase.rpc("check_and_increment_rate_limit", {
    p_key: key,
    p_window_ms: windowMs,
    p_max_count: max,
  });

  if (error) {
    // If the RPC fails (e.g. function not deployed yet), allow the request
    // rather than blocking legitimate users. Log for observability.
    console.error("[aiRateLimit] RPC error, allowing request:", error.message);
    return { allowed: true, count: 0, max };
  }

  const result = data as { allowed: boolean; count: number; retry_after_ms: number };
  return {
    allowed: result.allowed,
    retryAfterMs: result.retry_after_ms > 0 ? result.retry_after_ms : undefined,
    count: result.count,
    max,
  };
}
