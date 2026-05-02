-- Founder cap leak fix:
-- Original 023_founder_pro trigger checked count < 100 and then used
-- MAX(founder_rank) + 1. When a founder is deleted, count drops to 99
-- but MAX is still 100, so the next signup got rank 101 — overshooting
-- the cap. Tighten by clamping the next rank to <= 100.
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

  perform pg_advisory_xact_lock(7426891234);

  select count(*) into v_count
    from public.user_profiles
    where founder_rank is not null;

  if v_count < 100 then
    select coalesce(max(founder_rank), 0) + 1 into v_next_rank
      from public.user_profiles
      where founder_rank is not null;

    -- Hard cap: never assign a rank above 100, even if a previous founder
    -- was deleted leaving max(founder_rank) at 100 with count = 99.
    if v_next_rank <= 100 then
      update public.user_profiles
        set founder_rank = v_next_rank,
            pro_until    = now() + interval '30 days'
        where id = new.id
          and founder_rank is null;
    end if;
  end if;

  return new;
end;
$$;

-- Revoke any rows that already slipped past the cap from the old trigger.
update public.user_profiles
  set founder_rank = null,
      pro_until    = null
  where founder_rank > 100;
