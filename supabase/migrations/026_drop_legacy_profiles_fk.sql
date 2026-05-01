-- Five tables had user_id FKs pointing at public.profiles (1 row, legacy)
-- instead of public.user_profiles (136 rows, active). Every insert from a
-- real signed-up user failed FK validation — silently for tables wrapped
-- in Promise.all without error checks (the 0-MCQs bug).
-- xp_events already points at user_profiles, which is why XP fired even
-- when nothing else did.
-- RLS policies already restrict user_id to auth.uid() so the FK is
-- redundant. Drop it everywhere; integrity stays intact.

alter table public.attempts          drop constraint if exists attempts_user_id_fkey;
alter table public.sr_cards          drop constraint if exists sr_cards_user_id_fkey;
alter table public.topic_progress    drop constraint if exists topic_progress_user_id_fkey;
alter table public.study_streaks     drop constraint if exists study_streaks_user_id_fkey;
alter table public.roleplay_sessions drop constraint if exists roleplay_sessions_user_id_fkey;
