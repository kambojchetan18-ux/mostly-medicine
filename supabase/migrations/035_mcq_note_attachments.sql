-- Per-question notepad attachments backed by Supabase Storage. Replaces the
-- localStorage-only v1 in AttachmentPicker so notes & attachments sync across
-- devices for the same user.

create table if not exists public.mcq_note_attachments (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  question_id  text not null,
  file_path    text not null,            -- path within the storage bucket
  file_name    text not null,
  mime_type    text not null,
  size_bytes   integer not null,
  created_at   timestamptz not null default now()
);

create index if not exists mcq_note_attachments_user_q_idx
  on public.mcq_note_attachments (user_id, question_id, created_at desc);

alter table public.mcq_note_attachments enable row level security;

drop policy if exists mcq_note_attachments_select_own on public.mcq_note_attachments;
create policy mcq_note_attachments_select_own
  on public.mcq_note_attachments for select using (auth.uid() = user_id);

drop policy if exists mcq_note_attachments_insert_own on public.mcq_note_attachments;
create policy mcq_note_attachments_insert_own
  on public.mcq_note_attachments for insert with check (auth.uid() = user_id);

drop policy if exists mcq_note_attachments_delete_own on public.mcq_note_attachments;
create policy mcq_note_attachments_delete_own
  on public.mcq_note_attachments for delete using (auth.uid() = user_id);

-- Private storage bucket. Files served via short-lived signed URLs.
insert into storage.buckets (id, name, public)
values ('mcq-attachments', 'mcq-attachments', false)
on conflict (id) do nothing;

-- Object naming convention: <user_id>/<question_id>/<uuid>-<filename>
-- The first path segment is the user_id, gating RLS on storage.objects.
drop policy if exists "mcq-attachments — owner read" on storage.objects;
create policy "mcq-attachments — owner read"
  on storage.objects for select
  using (bucket_id = 'mcq-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "mcq-attachments — owner write" on storage.objects;
create policy "mcq-attachments — owner write"
  on storage.objects for insert
  with check (bucket_id = 'mcq-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "mcq-attachments — owner delete" on storage.objects;
create policy "mcq-attachments — owner delete"
  on storage.objects for delete
  using (bucket_id = 'mcq-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);
