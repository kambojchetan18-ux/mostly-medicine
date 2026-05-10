-- Atomic rate limiting, search_content fix, and handle_new_user search_path pin.

-- 1. Atomic rate limit function — eliminates TOCTOU race condition.
--    Single call that atomically reads, increments, and returns the decision.
create or replace function public.check_and_increment_rate_limit(
  p_key text,
  p_max int,
  p_window_ms bigint
) returns table(allowed boolean, current_count int, retry_after_ms bigint)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
  v_window_start timestamptz;
  v_count int;
  v_first_attempt timestamptz;
begin
  -- Lock the row for this key to prevent concurrent reads
  select rl.count, rl.first_attempt_at
  into v_count, v_first_attempt
  from public.rate_limit_attempts rl
  where rl.key = p_key
  for update;

  -- No existing row or window expired: start fresh
  if not found or (extract(epoch from (v_now - v_first_attempt)) * 1000) > p_window_ms then
    insert into public.rate_limit_attempts (key, count, first_attempt_at, updated_at)
    values (p_key, 1, v_now, v_now)
    on conflict (key) do update set
      count = 1,
      first_attempt_at = v_now,
      locked_until = null,
      updated_at = v_now;

    return query select true::boolean, 1, 0::bigint;
    return;
  end if;

  -- Window still active: check if over limit
  if v_count >= p_max then
    v_window_start := v_first_attempt;
    return query select
      false::boolean,
      v_count,
      greatest(0, (p_window_ms - (extract(epoch from (v_now - v_window_start)) * 1000)::bigint))::bigint;
    return;
  end if;

  -- Under limit: increment
  update public.rate_limit_attempts
  set count = v_count + 1, updated_at = v_now
  where key = p_key;

  return query select true::boolean, (v_count + 1), 0::bigint;
end;
$$;

revoke all on function public.check_and_increment_rate_limit(text, int, bigint) from public;
grant execute on function public.check_and_increment_rate_limit(text, int, bigint) to service_role;

-- 2. Fix search_content — escape LIKE metacharacters to prevent pattern injection.
--    Find the existing function and recreate with escaped query.
create or replace function public.search_content(
  search_query text,
  p_user_id uuid default null
) returns table(
  type text,
  id text,
  title text,
  snippet text,
  url text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  q text;
begin
  -- Escape LIKE metacharacters
  q := replace(replace(replace(search_query, '\', '\\'), '%', '\%'), '_', '\_');

  return query
  -- Library topics
  select 'topic'::text as type,
         lt.id::text,
         lt.title,
         left(lt.content, 120) as snippet,
         '/dashboard/library/' || lt.slug as url
  from public.library_topics lt
  where lt.title ilike '%' || q || '%'
     or lt.content ilike '%' || q || '%'

  union all

  -- User notes (only the user's own)
  select 'note'::text as type,
         un.id::text,
         un.filename as title,
         left(coalesce(un.ai_summary, un.extracted_text), 120) as snippet,
         '/dashboard/library/notes' as url
  from public.user_notes un
  where (p_user_id is not null and un.user_id = p_user_id)
    and (un.filename ilike '%' || q || '%'
         or un.extracted_text ilike '%' || q || '%'
         or un.ai_summary ilike '%' || q || '%')

  limit 20;
end;
$$;

-- 3. Pin search_path on original handle_new_user() to prevent schema shadow attacks.
alter function public.handle_new_user() set search_path = public, pg_temp;
