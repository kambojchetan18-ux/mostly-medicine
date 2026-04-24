-- Add missing indexes on frequently queried FK columns
create index if not exists attempts_user_id_idx on attempts(user_id);
create index if not exists sr_cards_user_id_idx on sr_cards(user_id);
create index if not exists sr_cards_due_idx on sr_cards(user_id, due);
create index if not exists topic_progress_user_id_idx on topic_progress(user_id);
create index if not exists user_case_progress_user_id_idx on user_case_progress(user_id);
create index if not exists user_notes_user_id_idx on user_notes(user_id);
