-- Migration 044: atomic rate-limit RPC to eliminate the read-then-write
-- race condition (TOCTOU) in the JS-side rate limiter.

create or replace function public.check_and_record_rate_limit(
  p_key       text,
  p_max       integer default 5,
  p_window_ms bigint  default 900000  -- 15 minutes
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_now         timestamptz := now();
  v_window_start timestamptz;
  v_count       integer;
  v_locked_until timestamptz;
  v_first       timestamptz;
begin
  -- Upsert + advisory lock via FOR UPDATE to serialize concurrent requests
  -- on the same key.
  select count, first_attempt_at, locked_until
    into v_count, v_first, v_locked_until
    from public.rate_limit_attempts
   where key = p_key
     for update;

  -- No row yet → first attempt, always allowed.
  if not found then
    insert into public.rate_limit_attempts (key, count, first_attempt_at, updated_at)
    values (p_key, 1, v_now, v_now);
    return jsonb_build_object('allowed', true, 'count', 1, 'max', p_max);
  end if;

  -- Currently locked out?
  if v_locked_until is not null and v_now < v_locked_until then
    return jsonb_build_object(
      'allowed', false,
      'count', v_count,
      'max', p_max,
      'retryAfterMs', extract(epoch from (v_locked_until - v_now)) * 1000
    );
  end if;

  -- Lockout expired → reset
  if v_locked_until is not null then
    delete from public.rate_limit_attempts where key = p_key;
    insert into public.rate_limit_attempts (key, count, first_attempt_at, updated_at)
    values (p_key, 1, v_now, v_now);
    return jsonb_build_object('allowed', true, 'count', 1, 'max', p_max);
  end if;

  -- Window expired → reset
  v_window_start := v_now - (p_window_ms || ' milliseconds')::interval;
  if v_first < v_window_start then
    update public.rate_limit_attempts
       set count = 1, first_attempt_at = v_now, updated_at = v_now, locked_until = null
     where key = p_key;
    return jsonb_build_object('allowed', true, 'count', 1, 'max', p_max);
  end if;

  -- Within window — check limit
  if v_count >= p_max then
    return jsonb_build_object(
      'allowed', false,
      'count', v_count,
      'max', p_max,
      'retryAfterMs', extract(epoch from (v_first + (p_window_ms || ' milliseconds')::interval - v_now)) * 1000
    );
  end if;

  -- Allowed — increment
  update public.rate_limit_attempts
     set count = v_count + 1, updated_at = v_now
   where key = p_key;

  return jsonb_build_object('allowed', true, 'count', v_count + 1, 'max', p_max);
end;
$$;
