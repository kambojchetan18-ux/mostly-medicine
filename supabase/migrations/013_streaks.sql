-- 013_streaks.sql
-- Snapchat-style daily streak counter for AMC prep activity.
-- Stored on user_profiles so the streak follows the existing per-user row
-- and benefits from its existing RLS policies.

alter table public.user_profiles
  add column if not exists current_streak  int  not null default 0,
  add column if not exists longest_streak  int  not null default 0,
  add column if not exists last_active_date date;

-- bump_streak: idempotent per UTC day. Called from API routes after any
-- meaningful learning activity (CAT 1 attempt, roleplay turn, feedback, etc.).
--
-- Rules:
--   * If last_active_date == today  -> no-op.
--   * If last_active_date == today-1 -> current_streak += 1.
--   * Else (gap > 1 day or null)    -> current_streak = 1.
--   longest_streak is bumped whenever current_streak exceeds it.
--
-- SECURITY DEFINER so the row update bypasses the per-user UPDATE RLS policy
-- when the function is called via supabase.rpc() by an authenticated user.
-- We still gate on p_user_id = auth.uid() to prevent users from incrementing
-- another user's streak.
create or replace function public.bump_streak(p_user_id uuid)
returns table (current_streak int, longest_streak int, last_active_date date)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_today  date := (now() at time zone 'utc')::date;
  v_last   date;
  v_cur    int;
  v_long   int;
  v_new    int;
begin
  if auth.uid() is null or auth.uid() <> p_user_id then
    raise exception 'not authorized';
  end if;

  select up.last_active_date, up.current_streak, up.longest_streak
    into v_last, v_cur, v_long
  from public.user_profiles up
  where up.id = p_user_id
  for update;

  if not found then
    raise exception 'user_profiles row missing for %', p_user_id;
  end if;

  if v_last = v_today then
    -- Already counted today. No-op.
    return query select v_cur, v_long, v_last;
    return;
  end if;

  if v_last = v_today - 1 then
    v_new := coalesce(v_cur, 0) + 1;
  else
    v_new := 1;
  end if;

  update public.user_profiles
     set current_streak  = v_new,
         longest_streak  = greatest(coalesce(v_long, 0), v_new),
         last_active_date = v_today,
         updated_at      = now()
   where id = p_user_id;

  return query
    select v_new, greatest(coalesce(v_long, 0), v_new), v_today;
end;
$$;

grant execute on function public.bump_streak(uuid) to authenticated;
