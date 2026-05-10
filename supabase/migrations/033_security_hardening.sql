-- Security hardening migration
-- Fixes: privilege escalation via user_profiles UPDATE, award_xp auth bypass,
-- leaderboard PII exposure to anon, and email/unsubscribe middleware bypass.

-- 1. Restrict user_profiles UPDATE to prevent role/plan self-escalation.
--    Users should only be able to update display fields, not sensitive ones.
drop policy if exists "Users can update their own profile" on public.user_profiles;

create policy "Users can update own non-sensitive fields"
  on public.user_profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    AND role = (select up.role from public.user_profiles up where up.id = auth.uid())
    AND plan = (select up.plan from public.user_profiles up where up.id = auth.uid())
    AND founder_rank is not distinct from (select up.founder_rank from public.user_profiles up where up.id = auth.uid())
    AND pro_until is not distinct from (select up.pro_until from public.user_profiles up where up.id = auth.uid())
    AND stripe_customer_id is not distinct from (select up.stripe_customer_id from public.user_profiles up where up.id = auth.uid())
    AND stripe_subscription_id is not distinct from (select up.stripe_subscription_id from public.user_profiles up where up.id = auth.uid())
    AND subscription_status is not distinct from (select up.subscription_status from public.user_profiles up where up.id = auth.uid())
    AND total_xp is not distinct from (select up.total_xp from public.user_profiles up where up.id = auth.uid())
  );

-- 2. Fix award_xp to only allow self-awarding (not awarding to other users)
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

  -- Authorization: users can only award XP to themselves
  if auth.uid() is null or auth.uid() <> p_user_id then
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

-- 3. Remove anon access to leaderboard (PII exposure)
revoke select on public.leaderboard_weekly from anon;
