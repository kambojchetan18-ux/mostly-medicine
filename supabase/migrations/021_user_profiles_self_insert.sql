-- Allow a user to INSERT their own user_profiles row exactly once.
--
-- Background: migration 007 added an `on_auth_user_created_profile` trigger
-- that auto-inserts the row at signup using SECURITY DEFINER (bypasses RLS).
-- That covers the happy path. The new /onboarding fallback page (added in the
-- bot-signup hardening branch) needs a path for the user themselves to insert
-- their row if the trigger ever fails or for legacy users.
--
-- The PK on `id` (referencing auth.users.id) already enforces "exactly once"
-- per user — duplicates raise unique_violation.

drop policy if exists "Users can insert their own profile" on public.user_profiles;
create policy "Users can insert their own profile"
  on public.user_profiles for insert
  with check (auth.uid() = id);
