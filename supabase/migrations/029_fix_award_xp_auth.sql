-- 029_fix_award_xp_auth.sql
-- Security & hygiene fixes for award_xp, bump_streak, and legacy trigger.

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Fix: award_xp() allowed any authenticated user to award XP to any user.
--    Add authorization check so users can only award XP to themselves.
--    Also pin search_path to include pg_temp (matching 022's pattern).
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.award_xp(
  p_user_id uuid,
  p_source  text,
  p_points  int
) returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_recent_count int;
begin
  -- Auth gate: users can only award XP to themselves.
  if auth.uid() is null or auth.uid() <> p_user_id then
    raise exception 'not authorized';
  end if;

  if p_user_id is null or p_source is null or p_points is null then
    return;
  end if;

  -- Idempotency window: skip if same (user, source) hit in the last 60s.
  select count(*) into v_recent_count
  from public.xp_events
  where user_id = p_user_id
    and source = p_source
    and created_at > now() - interval '60 seconds';

  if v_recent_count > 0 then
    return;
  end if;

  insert into public.xp_events (user_id, source, points)
  values (p_user_id, p_source, p_points);

  update public.user_profiles
  set total_xp = coalesce(total_xp, 0) + p_points,
      updated_at = now()
  where id = p_user_id;
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Pin bump_streak search_path to include pg_temp (matching 022's pattern).
--    Original in 013_streaks.sql used `search_path = public` without pg_temp.
-- ─────────────────────────────────────────────────────────────────────────────
alter function public.bump_streak(uuid) set search_path = public, pg_temp;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Drop legacy trigger that inserts into abandoned 'profiles' table on every
--    signup. The active trigger is on_auth_user_created_profile (migration 007).
-- ─────────────────────────────────────────────────────────────────────────────
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
