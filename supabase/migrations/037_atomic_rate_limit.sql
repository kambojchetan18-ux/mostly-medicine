-- Atomic rate-limiting function to fix TOCTOU race condition.
--
-- The old aiRateLimit() in TypeScript did a SELECT then UPSERT — two
-- concurrent requests could both read the same low count and both pass.
-- This function performs the check-and-increment in a single statement
-- so Postgres row-level locking guarantees atomicity.
--
-- Parameters:
--   p_key        — the rate-limit key (e.g. "ai:u:abc123")
--   p_window_ms  — window size in milliseconds (e.g. 60000 for 60s)
--   p_max_count  — maximum allowed calls within the window
--
-- Returns a JSON object: { "allowed": bool, "count": int, "retry_after_ms": int }
--   allowed        — true if under the limit, false if at/over
--   count          — the current attempt count (after increment if allowed)
--   retry_after_ms — ms until the window resets (0 if allowed)

CREATE OR REPLACE FUNCTION public.check_and_increment_rate_limit(
  p_key text,
  p_window_ms bigint,
  p_max_count int
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_row rate_limit_attempts%ROWTYPE;
  v_now timestamptz := now();
  v_window_start timestamptz;
  v_window_expired boolean;
  v_current_count int;
BEGIN
  -- Try to get the existing row with a row-level lock
  SELECT * INTO v_row
  FROM rate_limit_attempts
  WHERE key = p_key
  FOR UPDATE;

  IF NOT FOUND THEN
    -- No existing row — first request in this window
    INSERT INTO rate_limit_attempts (key, count, first_attempt_at, locked_until, updated_at)
    VALUES (p_key, 1, v_now, NULL, v_now)
    ON CONFLICT (key) DO UPDATE SET
      count = 1,
      first_attempt_at = v_now,
      locked_until = NULL,
      updated_at = v_now;

    RETURN jsonb_build_object('allowed', true, 'count', 1, 'retry_after_ms', 0);
  END IF;

  -- Check if the window has expired
  v_window_expired := extract(epoch from (v_now - v_row.first_attempt_at)) * 1000 > p_window_ms;

  IF v_window_expired THEN
    -- Window expired — reset and allow
    UPDATE rate_limit_attempts
    SET count = 1,
        first_attempt_at = v_now,
        locked_until = NULL,
        updated_at = v_now
    WHERE key = p_key;

    RETURN jsonb_build_object('allowed', true, 'count', 1, 'retry_after_ms', 0);
  END IF;

  -- Window still active
  v_current_count := COALESCE(v_row.count, 0);

  IF v_current_count >= p_max_count THEN
    -- Already at/over limit — deny without incrementing
    RETURN jsonb_build_object(
      'allowed', false,
      'count', v_current_count,
      'retry_after_ms', GREATEST(0,
        (p_window_ms - extract(epoch from (v_now - v_row.first_attempt_at)) * 1000)::bigint
      )
    );
  END IF;

  -- Under limit — increment and allow
  UPDATE rate_limit_attempts
  SET count = v_current_count + 1,
      updated_at = v_now
  WHERE key = p_key;

  RETURN jsonb_build_object(
    'allowed', true,
    'count', v_current_count + 1,
    'retry_after_ms', 0
  );
END;
$$;
