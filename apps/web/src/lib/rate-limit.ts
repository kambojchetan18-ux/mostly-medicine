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

const AI_WINDOW_MS = 15 * 60 * 1000;
const AI_MAX_REQUESTS = 30;

export async function checkAiRateLimit(
  userId: string,
  route: string
): Promise<{ allowed: boolean; retryAfterMs?: number }> {
  const key = `ai:${route}:${userId}`;
  const supabase = serviceClient();
  const now = Date.now();

  const { data } = await supabase
    .from("rate_limit_attempts")
    .select("count, first_attempt_at")
    .eq("key", key)
    .single();

  if (!data) {
    await supabase.from("rate_limit_attempts").insert({
      key,
      count: 1,
      first_attempt_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    return { allowed: true };
  }

  const elapsed = now - new Date(data.first_attempt_at).getTime();
  if (elapsed > AI_WINDOW_MS) {
    await supabase.from("rate_limit_attempts").upsert({
      key,
      count: 1,
      first_attempt_at: new Date().toISOString(),
      locked_until: null,
      updated_at: new Date().toISOString(),
    });
    return { allowed: true };
  }

  if (data.count >= AI_MAX_REQUESTS) {
    return { allowed: false, retryAfterMs: AI_WINDOW_MS - elapsed };
  }

  await supabase.from("rate_limit_attempts").update({
    count: data.count + 1,
    updated_at: new Date().toISOString(),
  }).eq("key", key);

  return { allowed: true };
}
