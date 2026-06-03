-- Drop the legacy `profiles` table and its trigger.
--
-- Migration 001 created `public.profiles` with a trigger `on_auth_user_created`
-- that fires `handle_new_user()` on every signup to insert a row. Migration 007
-- replaced it with `user_profiles` + `handle_new_user_profile()`, but the old
-- table and trigger were never removed. Migration 026 dropped the foreign keys
-- pointing at `profiles`, leaving it fully orphaned. No application code
-- references it — all auth/profile logic uses `user_profiles`.

-- 1. Drop the trigger that fires on auth.users INSERT
drop trigger if exists on_auth_user_created on auth.users;

-- 2. Drop the function (CASCADE drops any remaining dependency)
drop function if exists public.handle_new_user() cascade;

-- 3. Drop the table (CASCADE drops RLS policies + indexes)
drop table if exists public.profiles cascade;
