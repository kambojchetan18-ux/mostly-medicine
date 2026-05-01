-- 013_security_hardening.sql
-- Fixes critical RLS and function security issues found in code review.

-- ══════════════════════════════════════════════════════════════════════════
-- 1) CRITICAL: Restrict user_profiles self-UPDATE to safe columns only.
--    Previously any authenticated user could SET role='admin' or plan='enterprise'.
-- ══════════════════════════════════════════════════════════════════════════

drop policy if exists "Users can update their own profile" on public.user_profiles;

create policy "Users can update own safe columns"
  on public.user_profiles for update
  using  (auth.uid() = id)
  with check (
    -- Prevent users from changing sensitive columns via self-update.
    -- role, plan, and billing fields must remain unchanged.
    role = (select role from public.user_profiles where id = auth.uid())
    and plan = (select plan from public.user_profiles where id = auth.uid())
  );

-- ══════════════════════════════════════════════════════════════════════════
-- 2) Fix award_xp: only allow self-award and cap points.
-- ══════════════════════════════════════════════════════════════════════════

create or replace function public.award_xp(
  p_user_id uuid,
  p_source  text,
  p_points  integer
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Only the authenticated user can award XP to themselves
  if auth.uid() is null or auth.uid() <> p_user_id then
    raise exception 'not authorized';
  end if;
  -- Cap points to prevent abuse
  if p_points < 1 or p_points > 200 then
    raise exception 'invalid points value';
  end if;

  insert into public.xp_events (user_id, source, points)
  values (p_user_id, p_source, p_points);

  update public.user_profiles
  set total_xp = coalesce(total_xp, 0) + p_points,
      updated_at = now()
  where id = p_user_id;
end;
$$;

-- ══════════════════════════════════════════════════════════════════════════
-- 3) Revoke anon access from leaderboard view if it exists.
-- ══════════════════════════════════════════════════════════════════════════

do $$ begin
  revoke select on public.leaderboard_weekly from anon;
exception when undefined_table then null;
end $$;

-- ══════════════════════════════════════════════════════════════════════════
-- 4) Add billing_events defense-in-depth.
-- ══════════════════════════════════════════════════════════════════════════

do $$ begin
  revoke all on public.billing_events from anon, authenticated;
exception when undefined_table then null;
end $$;

-- ══════════════════════════════════════════════════════════════════════════
-- 5) Add CHECK constraint on mcq_sessions.status if the table exists.
-- ══════════════════════════════════════════════════════════════════════════

do $$ begin
  alter table public.mcq_sessions
    add constraint mcq_sessions_status_check
    check (status in ('active', 'completed', 'abandoned'));
exception
  when undefined_table then null;
  when duplicate_object then null;
end $$;
