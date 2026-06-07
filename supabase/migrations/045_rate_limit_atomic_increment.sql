-- Atomic rate-limit increment — closes the TOCTOU race in the Node.js
-- check-then-act pattern by doing the read + increment + conditional lock
-- in a single SQL statement with row-level locking.
create or replace function public.increment_rate_limit(
  p_key          text,
  p_max          integer,
  p_locked_until timestamptz,
  p_now          timestamptz default now()
)
returns table(new_count integer) language plpgsql security definer as $$
declare
  v_count integer;
begin
  -- Upsert with advisory-style row lock: INSERT on first attempt,
  -- UPDATE with count+1 on subsequent. The FOR UPDATE in the CTE
  -- serialises concurrent callers on the same key.
  insert into public.rate_limit_attempts (key, count, first_attempt_at, locked_until, updated_at)
  values (p_key, 1, p_now, null, p_now)
  on conflict (key) do update
    set count       = rate_limit_attempts.count + 1,
        locked_until = case
                         when rate_limit_attempts.count + 1 >= p_max then p_locked_until
                         else rate_limit_attempts.locked_until
                       end,
        updated_at   = p_now
  returning rate_limit_attempts.count into v_count;

  return query select v_count;
end;
$$;

-- Only callable via service_role (no anon/authenticated access).
revoke execute on function public.increment_rate_limit from anon, authenticated;
