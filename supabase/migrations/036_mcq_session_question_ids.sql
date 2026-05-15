-- Persist the question pool per session so a logout+login doesn't reshuffle
-- the user's quiz. Also store the picked option letter on each attempt so
-- "Previous" / navigator-jump can re-render the user's original choice
-- after a fresh sign-in (the existing selected_answer column only stored
-- "correct"/"wrong").

alter table public.mcq_sessions
  add column if not exists question_ids text[];

alter table public.attempts
  add column if not exists selected_label text;

create index if not exists attempts_session_question_idx
  on public.attempts (session_id, question_id);
