create table if not exists content_posts (
  id uuid primary key default gen_random_uuid(),
  platform text not null check (platform in ('instagram', 'linkedin', 'youtube')),
  post_date date not null,
  post_type text not null default 'text',
  caption text not null default '',
  slides jsonb,
  hashtags text[] default '{}',
  status text not null default 'draft' check (status in ('draft', 'approved', 'posted')),
  posted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists content_posts_date_idx on content_posts (post_date);
create index if not exists content_posts_platform_idx on content_posts (platform);
create index if not exists content_posts_status_idx on content_posts (status);

alter table content_posts enable row level security;

create policy "Admin full access on content_posts" on content_posts
  using (exists (select 1 from user_profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from user_profiles where id = auth.uid() and role = 'admin'));
