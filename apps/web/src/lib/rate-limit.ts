const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

interface Attempt {
  count: number;
  firstAttempt: number;
  lockedUntil: number | null;
}

const attempts = new Map<string, Attempt>();

export function checkRateLimit(key: string): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now();
  const entry = attempts.get(key);

  if (entry) {
    // If locked, check if lockout has expired
    if (entry.lockedUntil) {
      if (now < entry.lockedUntil) {
        return { allowed: false, retryAfterMs: entry.lockedUntil - now };
      }
      // Lockout expired — reset
      attempts.delete(key);
    } else if (now - entry.firstAttempt > WINDOW_MS) {
      // Window expired — reset
      attempts.delete(key);
    }
  }

  return { allowed: true };
}

export function recordFailedAttempt(key: string): { locked: boolean; attemptsLeft: number } {
  const now = Date.now();
  const entry = attempts.get(key) ?? { count: 0, firstAttempt: now, lockedUntil: null };

  entry.count += 1;

  if (entry.count >= MAX_ATTEMPTS) {
    entry.lockedUntil = now + WINDOW_MS;
    attempts.set(key, entry);
    return { locked: true, attemptsLeft: 0 };
  }

  attempts.set(key, entry);
  return { locked: false, attemptsLeft: MAX_ATTEMPTS - entry.count };
}

export function clearAttempts(key: string): void {
  attempts.delete(key);
}
