-- 033_security_hardening.sql — Fix privilege-escalation RLS gaps + harden RPC functions
--
-- Issues addressed:
--   1. user_profiles UPDATE policy lets users set their own plan/role (privilege escalation)
--   2. award_xp() callable by any authenticated user for any user_id (XP manipulation)
--   3. award_xp() search_path missing pg_temp
--   4. bump_streak() search_path missing pg_temp
--   5. handle_new_user_profile() search_path missing pg_temp

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Restrict user_profiles UPDATE policy to safe columns only
--    Old policy allowed users to UPDATE any column (including plan, role).
--    New approach: trigger-based guard that prevents non-service-role callers
--    from changing protected columns.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.guard_user_profiles_update()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  -- Service-role and admin bypass — they can change anything
  if current_setting('role', true) = 'service_role' then
    return new;
  end if;

  -- Regular users cannot change protected columns
  if new.plan is distinct from old.plan then
    raise exception 'cannot modify plan';
  end if;
  if new.role is distinct from old.role then
    raise exception 'cannot modify role';
  end if;
  if new.stripe_customer_id is distinct from old.stripe_customer_id then
    raise exception 'cannot modify stripe_customer_id';
  end if;
  if new.stripe_subscription_id is distinct from old.stripe_subscription_id then
    raise exception 'cannot modify stripe_subscription_id';
  end if;
  if new.total_xp is distinct from old.total_xp then
    raise exception 'cannot modify total_xp';
  end if;
  if new.founder_rank is distinct from old.founder_rank then
    raise exception 'cannot modify founder_rank';
  end if;
  if new.pro_until is distinct from old.pro_until then
    raise exception 'cannot modify pro_until';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_guard_user_profiles_update on public.user_profiles;
create trigger trg_guard_user_profiles_update
  before update on public.user_profiles
  for each row execute function public.guard_user_profiles_update();

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. award_xp: add auth.uid() check + fix search_path
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
  if p_user_id is null or p_source is null or p_points is null then
    return;
  end if;

  -- Only the user themselves (or service_role) can award XP
  if current_setting('role', true) <> 'service_role'
     and (auth.uid() is null or auth.uid() <> p_user_id) then
    raise exception 'not authorized';
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
-- 3. Fix search_path on bump_streak
-- ─────────────────────────────────────────────────────────────────────────────
alter function public.bump_streak(uuid) set search_path = public, pg_temp;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Fix search_path on handle_new_user_profile
-- ─────────────────────────────────────────────────────────────────────────────
alter function public.handle_new_user_profile() set search_path = public, pg_temp;
