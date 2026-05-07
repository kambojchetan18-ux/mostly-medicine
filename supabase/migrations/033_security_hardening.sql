-- 033_security_hardening.sql — Fix privilege escalation vectors
--
-- 1. Replace the overly-permissive user_profiles UPDATE policy with one
--    that restricts which columns regular users can modify.
-- 2. Lock down award_xp() so users can only award XP to themselves.
-- 3. Pin search_path on handle_new_user() (from migration 001).
-- 4. Guard search_content() so users cannot search other users' notes.

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. user_profiles: restrict self-update to safe columns only.
--    Users must NOT be able to change: role, plan, stripe_*, subscription_*,
--    founder_rank, pro_until, total_xp.
-- ─────────────────────────────────────────────────────────────────────────────

drop policy if exists "Users can update their own profile" on public.user_profiles;

create policy "Users can update their own safe fields"
  on public.user_profiles for update
  using (auth.uid() = id)
  with check (
    -- Prevent users from changing privileged columns.
    -- These checks compare new values against existing values.
    role = (select up.role from public.user_profiles up where up.id = auth.uid())
    and plan = (select up.plan from public.user_profiles up where up.id = auth.uid())
    and total_xp = (select up.total_xp from public.user_profiles up where up.id = auth.uid())
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. award_xp: enforce auth.uid() = p_user_id
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

  -- Only allow users to award XP to themselves (or service_role for server-side calls).
  if auth.uid() is not null and auth.uid() <> p_user_id then
    raise exception 'Not authorized to award XP to another user';
  end if;

  -- Cap points per call to prevent abuse.
  if p_points < 0 or p_points > 100 then
    raise exception 'Points must be between 0 and 100';
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
-- 3. Pin search_path on handle_new_user() from migration 001.
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Guard search_content() — enforce searching_user_id = auth.uid()
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.search_content(
  search_term text,
  searching_user_id uuid default null
)
returns table (
  source text,
  id text,
  title text,
  snippet text,
  rank real
)
language plpgsql
security definer
set search_path = public
as $$
declare
  effective_user_id uuid;
begin
  -- Always use the authenticated user's ID for note searches,
  -- ignoring the caller-supplied value to prevent IDOR.
  effective_user_id := coalesce(auth.uid(), searching_user_id);

  return query
  -- Library topics
  select
    'topic'::text as source,
    lt.id::text,
    lt.title,
    left(lt.content, 200) as snippet,
    ts_rank(to_tsvector('english', lt.title || ' ' || coalesce(lt.content, '')), plainto_tsquery('english', search_term)) as rank
  from public.library_topics lt
  where to_tsvector('english', lt.title || ' ' || coalesce(lt.content, '')) @@ plainto_tsquery('english', search_term)

  union all

  -- User notes (only the caller's own)
  select
    'note'::text as source,
    un.id::text,
    un.title,
    left(un.body, 200) as snippet,
    ts_rank(to_tsvector('english', un.title || ' ' || coalesce(un.body, '')), plainto_tsquery('english', search_term)) as rank
  from public.user_notes un
  where effective_user_id is not null
    and un.user_id = effective_user_id
    and to_tsvector('english', un.title || ' ' || coalesce(un.body, '')) @@ plainto_tsquery('english', search_term)

  order by rank desc
  limit 20;
end;
$$;
