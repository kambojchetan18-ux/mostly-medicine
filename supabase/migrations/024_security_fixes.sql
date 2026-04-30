-- 024_security_fixes.sql — Security hardening from code review 2026-04-30
--
-- 1. award_xp() — enforce auth.uid() = p_user_id (prevent XP spoofing)
-- 2. leaderboard_weekly — revoke anon access (privacy)
-- 3. handle_new_user() — pin search_path (search_path hijack prevention)

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Harden award_xp() — only allow users to award XP to themselves
-- ─────────────────────────────────────────────────────────────────────────────
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
begin
  if p_user_id is null or p_source is null or p_points is null then
    return;
  end if;

  -- Only allow users to award XP to themselves
  if auth.uid() is distinct from p_user_id then
    raise exception 'award_xp: not authorized';
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

revoke all on function public.award_xp(uuid, text, int) from public;
grant execute on function public.award_xp(uuid, text, int) to authenticated, service_role;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Revoke anon access to leaderboard (privacy — user names + plans)
-- ─────────────────────────────────────────────────────────────────────────────
revoke select on public.leaderboard_weekly from anon;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Pin search_path on handle_new_user (search_path hijack prevention)
-- ─────────────────────────────────────────────────────────────────────────────
alter function public.handle_new_user() set search_path = public, pg_temp;
