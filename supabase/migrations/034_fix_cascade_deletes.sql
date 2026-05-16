-- Change acrp_live_sessions.host_user_id from ON DELETE CASCADE to ON DELETE SET NULL
-- so deleting a host's account preserves the session record (and guest's transcript).
-- Also requires making host_user_id nullable.

alter table public.acrp_live_sessions
  alter column host_user_id drop not null;

alter table public.acrp_live_sessions
  drop constraint if exists acrp_live_sessions_host_user_id_fkey;

alter table public.acrp_live_sessions
  add constraint acrp_live_sessions_host_user_id_fkey
  foreign key (host_user_id) references auth.users(id) on delete set null;
