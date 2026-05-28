-- Drop the legacy on_auth_user_created trigger that inserts into the dead
-- profiles table. user_profiles (migration 007) is the canonical profile table.
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
