-- 036_security_fixes.sql — Security hardening
-- 1. award_xp(): add caller-identity check + fix search_path
-- 2. leaderboard_weekly: revoke anon access
-- 3. handle_new_user(): pin search_path

-- ─────────────────────────────────────────────────────────────────────────────
-- Fix 1 & 4: Recreate award_xp() with auth.uid() identity check and
--            secure search_path (public, pg_temp).
--
-- Previously any authenticated user could call award_xp(other_user_id, ...)
-- and grant XP to arbitrary accounts. Now the function raises an exception
-- unless the caller's auth.uid() matches p_user_id.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.award_xp(
  p_user_id uuid,
  p_source  text,
  p_points  int default 10
) returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_recent_count int;
begin
  -- Caller-identity check: only the owning user (or service_role, which
  -- bypasses RLS and has auth.uid() = NULL handled by service_role grant)
  -- may award XP to this account.
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

-- Preserve existing grants (unchanged from 014)
revoke all on function public.award_xp(uuid, text, int) from public;
grant execute on function public.award_xp(uuid, text, int) to authenticated, service_role;

-- ─────────────────────────────────────────────────────────────────────────────
-- Fix 2: Revoke anonymous access to the weekly leaderboard.
-- The view was granted to both anon and authenticated in 014; anon should
-- not be able to enumerate user names / avatars / XP.
-- ─────────────────────────────────────────────────────────────────────────────
revoke select on public.leaderboard_weekly from anon;

-- ─────────────────────────────────────────────────────────────────────────────
-- Fix 3: Pin handle_new_user() search_path.
-- The original trigger function (001) uses SECURITY DEFINER but did not set
-- search_path, allowing a malicious schema-search-path hijack.
-- ─────────────────────────────────────────────────────────────────────────────
alter function public.handle_new_user() set search_path = public, pg_temp;
