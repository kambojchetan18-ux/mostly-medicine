-- Backfill any NULL scenario_id rows with 'unknown' before adding constraint.
update public.cat2_sessions set scenario_id = 'unknown' where scenario_id is null;

alter table public.cat2_sessions
  alter column scenario_id set not null;
