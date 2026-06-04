-- Atomic rate-check RPC to eliminate the TOCTOU race in aiRateLimit().
-- Instead of SELECT count → check → UPSERT (three round-trips, race window),
-- this function does a single INSERT … ON CONFLICT DO UPDATE that atomically
-- increments the counter and returns whether the request is allowed.
--
-- The row-level lock acquired by the UPSERT serialises concurrent callers on
-- the same key, so two requests arriving simultaneously cannot both read
-- count=29 and both get through a limit of 30.

CREATE OR REPLACE FUNCTION public.atomic_rate_check(
  p_key text,
  p_max int,
  p_window_ms bigint
) RETURNS TABLE(allowed boolean, current_count int, retry_after_ms bigint)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
  v_window   interval;
  v_cutoff   timestamptz;
  v_count    int;
  v_first    timestamptz;
BEGIN
  v_window := make_interval(secs := p_window_ms / 1000.0);
  v_cutoff := now() - v_window;

  -- Atomic upsert: if the window expired, reset; otherwise increment.
  INSERT INTO public.rate_limit_attempts (key, count, first_attempt_at, locked_until, updated_at)
  VALUES (p_key, 1, now(), NULL, now())
  ON CONFLICT (key) DO UPDATE SET
    count = CASE
      WHEN rate_limit_attempts.first_attempt_at < v_cutoff THEN 1
      ELSE rate_limit_attempts.count + 1
    END,
    first_attempt_at = CASE
      WHEN rate_limit_attempts.first_attempt_at < v_cutoff THEN now()
      ELSE rate_limit_attempts.first_attempt_at
    END,
    locked_until = NULL,
    updated_at   = now()
  RETURNING rate_limit_attempts.count, rate_limit_attempts.first_attempt_at
  INTO v_count, v_first;

  IF v_count > p_max THEN
    allowed        := false;
    current_count  := v_count;
    -- How long until the current window expires
    retry_after_ms := GREATEST(
      0,
      (EXTRACT(EPOCH FROM (v_first + v_window - now())) * 1000)::bigint
    );
  ELSE
    allowed        := true;
    current_count  := v_count;
    retry_after_ms := 0;
  END IF;

  RETURN NEXT;
END;
$$;
