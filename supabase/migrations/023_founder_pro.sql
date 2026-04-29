-- Founder Pro launch promo:
-- The first 100 user_profiles rows automatically receive Pro access for 30 days.
-- We persist this as (founder_rank, pro_until) on user_profiles so it survives
-- restarts, is visible in admin, and short-circuits with Stripe upgrades.
--
-- The plan-effective check is: user has Pro IF
--   plan IN ('pro','enterprise') OR pro_until > NOW().
-- When the user later subscribes via Stripe, syncSubscriptionToProfile sets
-- plan = 'pro' which short-circuits true regardless of pro_until — so this is
-- additive and never conflicts with paid Stripe state.

alter table public.user_profiles
  add column if not exists pro_until     timestamptz null,
  add column if not exists founder_rank  integer     null;

-- Make founder_rank uniquely 1..100 (defends against the rare double-write
-- race below in handle_new_user_profile).
create unique index if not exists user_profiles_founder_rank_unique
  on public.user_profiles (founder_rank)
  where founder_rank is not null;


-- Helper: is this user effectively Pro right now (paid OR within founder window)?
-- SECURITY DEFINER + pinned search_path so RLS + schema-shadowing tricks can't
-- subvert it. Mirrors the convention from 022_pin_function_search_paths.sql.
create or replace function public.is_user_effectively_pro(p_user_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_plan       text;
  v_pro_until  timestamptz;
begin
  select plan, pro_until
    into v_plan, v_pro_until
    from public.user_profiles
    where id = p_user_id;

  if v_plan in ('pro', 'enterprise') then
    return true;
  end if;

  if v_pro_until is not null and v_pro_until > now() then
    return true;
  end if;

  return false;
end;
$$;


-- Replace the on-signup trigger function to award founder slots.
-- Logic:
--   1. Insert the user_profiles row (existing behaviour).
--   2. Take a session-scoped advisory lock keyed to a constant so two
--      concurrent signups serialise on the COUNT->UPDATE step. Cheap (no
--      table lock) and released at txn end via _xact variant.
--   3. If fewer than 100 founder rows already exist, set founder_rank to
--      MAX(founder_rank)+1 and pro_until to NOW()+30d for THIS row.
--      The COALESCE+MAX read is now race-free thanks to the advisory lock,
--      and the unique index on founder_rank is a backstop.
create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_count       integer;
  v_next_rank   integer;
begin
  insert into public.user_profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;

  -- Serialise the founder-slot award. Arbitrary constant key.
  perform pg_advisory_xact_lock(7426891234);

  select count(*) into v_count
    from public.user_profiles
    where founder_rank is not null;

  if v_count < 100 then
    select coalesce(max(founder_rank), 0) + 1 into v_next_rank
      from public.user_profiles
      where founder_rank is not null;

    update public.user_profiles
      set founder_rank = v_next_rank,
          pro_until    = now() + interval '30 days'
      where id = new.id
        and founder_rank is null;
  end if;

  return new;
end;
$$;

-- Trigger already exists from migration 007; recreate to be safe.
drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
  after insert on auth.users
  for each row execute procedure public.handle_new_user_profile();


-- Backfill existing user_profiles rows in created_at order so early adopters
-- aren't penalised for having signed up before the migration ran.
do $$
declare
  r record;
  v_rank integer := 0;
begin
  -- Lock against concurrent signups during backfill.
  perform pg_advisory_xact_lock(7426891234);

  select coalesce(max(founder_rank), 0) into v_rank
    from public.user_profiles
    where founder_rank is not null;

  for r in
    select id
      from public.user_profiles
      where founder_rank is null
      order by created_at asc
  loop
    exit when v_rank >= 100;
    v_rank := v_rank + 1;
    update public.user_profiles
      set founder_rank = v_rank,
          pro_until    = now() + interval '30 days'
      where id = r.id;
  end loop;
end$$;
