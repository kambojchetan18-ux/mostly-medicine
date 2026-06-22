-- billing_events: user_id is queried when looking up a user's billing history
create index if not exists billing_events_user_id_idx
  on public.billing_events (user_id);

-- mcq_note_attachments: standalone question_id index for admin/analytics queries
-- (composite user_id + question_id already exists for per-user lookups)
create index if not exists mcq_note_attachments_question_id_idx
  on public.mcq_note_attachments (question_id);
