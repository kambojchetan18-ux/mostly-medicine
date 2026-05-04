-- Tracks LinkedIn (and later Instagram) auto-posts per published article.
-- Cron picks the oldest row where linkedin_posted_at IS NULL, generates
-- Amandeep-voice copy via runChat, posts via LinkedIn UGC API, stamps the
-- result columns. Idempotent on re-fire — same article never posts twice.
create table if not exists public.social_posts (
  id                       uuid primary key default gen_random_uuid(),
  article_slug             text not null unique,
  article_title            text not null,
  article_url              text not null,
  created_at               timestamptz not null default now(),
  linkedin_posted_at       timestamptz,
  linkedin_post_urn        text,
  linkedin_error           text,
  linkedin_attempted_at    timestamptz,
  instagram_posted_at      timestamptz,
  instagram_post_id        text,
  instagram_error          text,
  instagram_attempted_at   timestamptz
);

create index if not exists social_posts_linkedin_pending_idx
  on public.social_posts (created_at)
  where linkedin_posted_at is null;

create index if not exists social_posts_instagram_pending_idx
  on public.social_posts (created_at)
  where instagram_posted_at is null;

alter table public.social_posts enable row level security;

-- All reads + writes from cron via service role; no end-user policies needed.

-- Seed with the 7 articles published so far. ON CONFLICT keeps it idempotent
-- if the migration is re-run.
insert into public.social_posts (article_slug, article_title, article_url) values
  ('amc-vs-plab', 'AMC vs PLAB in 2026: Which Exam Should an IMG Take First (Australia or UK)?', 'https://mostlymedicine.com/amc-vs-plab'),
  ('amc-part-1-study-plan', 'AMC Part 1 Study Plan: A Realistic 16-Week Schedule for Working IMGs (2026)', 'https://mostlymedicine.com/amc-part-1-study-plan'),
  ('amc-pass-rates-by-country', 'AMC Pass Rates by Country (2024-2026): What the Data Actually Shows IMGs', 'https://mostlymedicine.com/amc-pass-rates-by-country'),
  ('ahpra-registration-for-imgs', 'AHPRA Registration for International Medical Graduates: 2026 Step-by-Step Guide', 'https://mostlymedicine.com/ahpra-registration-for-imgs'),
  ('ahpra-recency-of-practice', 'Recency of Practice and AMC: What Order Should an IMG Do Things In? (2026)', 'https://mostlymedicine.com/ahpra-recency-of-practice'),
  ('ielts-vs-oet', 'IELTS vs OET for AHPRA in 2026: Which English Test Should an IMG Doctor Take?', 'https://mostlymedicine.com/ielts-vs-oet'),
  ('osce-guide', 'OSCE Guide for IMGs (2026): How to Prepare for the AMC Clinical Exam', 'https://mostlymedicine.com/osce-guide')
on conflict (article_slug) do nothing;
