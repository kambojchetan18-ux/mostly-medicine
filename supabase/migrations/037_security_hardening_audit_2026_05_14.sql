-- Security hardening from 2026-05-14 audit:
--   1. handle_new_user() — pin search_path so a malicious schema can't shadow
--      `public` while the SECURITY DEFINER trigger runs (migration 022 fixed
--      the others; this one was missed).
--   2. award_xp() — block one authenticated user from minting XP to a
--      different user_id. Service-role callers (auth.uid() IS NULL) keep
--      their bypass for cron / admin paths.
--   3. leaderboard_weekly view — revoke anon SELECT so the public landing
--      pages can't enumerate user names + avatars without a session.

-- 1. handle_new_user() search_path
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

-- 2. award_xp() identity check
create or replace function public.award_xp(
  p_user_id uuid,
  p_source  text,
  p_points  int
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_recent_count int;
  v_caller_uid   uuid := auth.uid();
begin
  if p_user_id is null or p_source is null or p_points is null then
    return;
  end if;

  -- Authenticated callers may only award XP to themselves. Service-role
  -- (auth.uid() IS NULL) keeps its existing bypass so cron / admin paths
  -- can backfill.
  if v_caller_uid is not null and v_caller_uid <> p_user_id then
    raise exception 'award_xp: caller % is not the target user %', v_caller_uid, p_user_id
      using errcode = '42501';
  end if;

  -- Idempotency window: skip if same (user, source) hit in the last 60s.
  select count(*) into v_recent_count
  from public.xp_events
  where user_id = p_user_id
    and source  = p_source
    and created_at >= now() - interval '60 seconds';
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

revoke all on function public.award_xp(uuid, text, int) from public;
grant execute on function public.award_xp(uuid, text, int) to authenticated, service_role;

-- 3. leaderboard_weekly — revoke anon, keep authenticated
revoke select on public.leaderboard_weekly from anon;
grant  select on public.leaderboard_weekly to authenticated;
