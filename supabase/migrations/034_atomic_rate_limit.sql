-- Atomic rate limiter RPC — fixes TOCTOU race in aiRateLimit().
-- A single INSERT ... ON CONFLICT DO UPDATE guarantees that two concurrent
-- requests cannot both read the same count and both pass.

create or replace function public.check_and_increment_rate_limit(
  p_key       text,
  p_max       int,
  p_window_ms int
)
returns table (allowed boolean, current_count int, retry_after_ms int)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_window interval := (p_window_ms || ' milliseconds')::interval;
  v_row    record;
begin
  -- 1. Purge expired rows for this key so the window resets cleanly.
  delete from rate_limit_attempts
  where key = p_key
    and first_attempt_at + v_window < now();

  -- 2. Atomic upsert: insert a fresh row OR increment an existing one,
  --    but only when the count is still below the limit.
  insert into rate_limit_attempts (key, count, first_attempt_at, locked_until, updated_at)
  values (p_key, 1, now(), null, now())
  on conflict (key) do update
    set count      = rate_limit_attempts.count + 1,
        updated_at = now()
    where rate_limit_attempts.count < p_max
  returning rate_limit_attempts.count, rate_limit_attempts.first_attempt_at
  into v_row;

  -- 3. If the RETURNING clause gave us a row, the request was allowed.
  if v_row is not null then
    return query select
      true::boolean,
      v_row.count::int,
      0::int;
    return;
  end if;

  -- 4. The upsert matched nothing (count >= p_max) — read current state
  --    to compute retry_after_ms for the caller.
  select r.count, r.first_attempt_at
  into v_row
  from rate_limit_attempts r
  where r.key = p_key;

  return query select
    false::boolean,
    coalesce(v_row.count, 0)::int,
    greatest(
      0,
      extract(epoch from (v_row.first_attempt_at + v_window - now()))::int * 1000
    )::int;
end;
$$;

-- Only the service_role key may call this function (server-side only).
revoke all on function public.check_and_increment_rate_limit(text, int, int) from public;
revoke all on function public.check_and_increment_rate_limit(text, int, int) from anon;
revoke all on function public.check_and_increment_rate_limit(text, int, int) from authenticated;
grant  execute on function public.check_and_increment_rate_limit(text, int, int) to service_role;
