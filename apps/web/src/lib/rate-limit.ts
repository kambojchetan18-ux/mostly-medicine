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

export function clientKey(req: NextRequest, prefix: string, userId?: string | null): string {
  if (userId) return `${prefix}:u:${userId}`;
  const fwd = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "0.0.0.0";
  const ip = fwd.split(",")[0]?.trim() || "0.0.0.0";
  return `${prefix}:ip:${ip}`;
}

export async function checkRateLimit(key: string): Promise<{ allowed: boolean; retryAfterMs?: number }> {
  const supabase = serviceClient();
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
    await supabase.from("rate_limit_attempts").delete().eq("key", key);
    return { allowed: true };
  }

  const windowExpired = Date.now() - new Date(data.first_attempt_at).getTime() > WINDOW_MS;
  if (windowExpired) {
    await supabase.from("rate_limit_attempts").delete().eq("key", key);
    return { allowed: true };
  }

  if (data.count >= MAX_ATTEMPTS) {
    return { allowed: false, retryAfterMs: WINDOW_MS - (Date.now() - new Date(data.first_attempt_at).getTime()) };
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

// Atomic rate limiter using Postgres RPC — eliminates TOCTOU race.
// Falls back to JS-side logic if the RPC doesn't exist yet (migration 044
// not applied). Defaults: 30 calls / 60s.
export async function aiRateLimit(
  key: string,
  opts: { max?: number; windowMs?: number } = {}
): Promise<{ allowed: boolean; retryAfterMs?: number; count: number; max: number }> {
  const max = opts.max ?? 30;
  const windowMs = opts.windowMs ?? 60 * 1000;
  const supabase = serviceClient();

  const { data, error } = await supabase.rpc("check_and_record_rate_limit", {
    p_key: key,
    p_max: max,
    p_window_ms: windowMs,
  });

  if (!error && data) {
    const result = data as { allowed: boolean; count: number; max: number; retryAfterMs?: number };
    return {
      allowed: result.allowed,
      retryAfterMs: result.retryAfterMs ? Math.round(result.retryAfterMs) : undefined,
      count: result.count,
      max: result.max,
    };
  }

  // Fallback: JS-side logic (pre-migration-044 or RPC error)
  const now = Date.now();
  const { data: row } = await supabase
    .from("rate_limit_attempts")
    .select("count, first_attempt_at")
    .eq("key", key)
    .single();

  const windowStart = row?.first_attempt_at ? new Date(row.first_attempt_at).getTime() : now;
  const windowExpired = now - windowStart > windowMs;
  const currentCount = !row || windowExpired ? 0 : row.count ?? 0;

  if (currentCount >= max) {
    const retryAfterMs = Math.max(0, windowStart + windowMs - now);
    return { allowed: false, retryAfterMs, count: currentCount, max };
  }

  const newCount = currentCount + 1;
  const firstAttempt = windowExpired ? new Date(now).toISOString() : row?.first_attempt_at ?? new Date(now).toISOString();
  await supabase.from("rate_limit_attempts").upsert({
    key,
    count: newCount,
    first_attempt_at: firstAttempt,
    locked_until: null,
    updated_at: new Date(now).toISOString(),
  });

  return { allowed: true, count: newCount, max };
}
