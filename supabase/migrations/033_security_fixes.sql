-- Security fixes: award_xp auth check, leaderboard access, dead trigger cleanup

-- 1. Secure award_xp: prevent users from awarding XP to other users
create or replace function public.award_xp(
  p_user_id uuid,
  p_source text,
  p_points int default 10
) returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if auth.uid() is null or auth.uid() <> p_user_id then
    raise exception 'not authorized';
  end if;

  insert into public.xp_events (user_id, source, points)
  values (p_user_id, p_source, p_points);
end;
$$;

-- 2. Revoke anon access to leaderboard (only authenticated users should see it)
revoke select on public.leaderboard_weekly from anon;

-- 3. Drop the dead legacy trigger that creates orphan rows in profiles table
drop trigger if exists on_auth_user_created on auth.users;

-- 4. Pin search_path on legacy handle_new_user if it still exists
do $$
begin
  if exists (select 1 from pg_proc where proname = 'handle_new_user') then
    execute 'alter function public.handle_new_user() set search_path = public, pg_temp';
  end if;
end $$;
