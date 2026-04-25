import { createClient } from "@supabase/supabase-js";

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
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

  if (data.count >= MAX_ATTEMPTS) {
    return { allowed: false, retryAfterMs: WINDOW_MS };
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

const AI_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const AI_MAX_REQUESTS = 60;

export async function checkAIRateLimit(userId: string, endpoint: string): Promise<{ allowed: boolean; retryAfterMs?: number }> {
  const key = `ai:${endpoint}:${userId}`;
  const supabase = serviceClient();

  const { data } = await supabase
    .from("rate_limit_attempts")
    .select("count, first_attempt_at")
    .eq("key", key)
    .single();

  if (!data) {
    await supabase.from("rate_limit_attempts").upsert({
      key,
      count: 1,
      first_attempt_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    return { allowed: true };
  }

  const windowExpired = Date.now() - new Date(data.first_attempt_at).getTime() > AI_WINDOW_MS;
  if (windowExpired) {
    await supabase.from("rate_limit_attempts").upsert({
      key,
      count: 1,
      first_attempt_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    return { allowed: true };
  }

  if (data.count >= AI_MAX_REQUESTS) {
    const retryAfterMs = AI_WINDOW_MS - (Date.now() - new Date(data.first_attempt_at).getTime());
    return { allowed: false, retryAfterMs };
  }

  await supabase.from("rate_limit_attempts").update({
    count: data.count + 1,
    updated_at: new Date().toISOString(),
  }).eq("key", key);

  return { allowed: true };
}
