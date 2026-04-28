-- Add missing indexes on foreign-key columns used in hot-path queries.
-- Without these, user-scoped lookups do full table scans as the user base grows.

create index if not exists attempts_user_id_idx
  on public.attempts (user_id);

create index if not exists attempts_question_id_idx
  on public.attempts (question_id);

create index if not exists attempts_user_attempted_idx
  on public.attempts (user_id, attempted_at desc);

create index if not exists sr_cards_user_id_idx
  on public.sr_cards (user_id);

create index if not exists sr_cards_user_due_idx
  on public.sr_cards (user_id, due);

create index if not exists topic_progress_user_id_idx
  on public.topic_progress (user_id);

create index if not exists study_streaks_user_id_idx
  on public.study_streaks (user_id);

create index if not exists img_profiles_id_idx
  on public.img_profiles (id);
