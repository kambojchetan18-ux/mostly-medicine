-- IMG Profiles — personalised readiness data extracted from uploaded CVs

create table public.img_profiles (
  id            uuid references auth.users(id) on delete cascade primary key,
  name          text,
  degree_country       text,
  graduation_year      integer,
  years_experience     integer,
  specialties          text[]    default '{}',
  amc_cat1      text    default 'not_done',   -- 'passed' | 'scheduled' | 'not_done'
  amc_cat2      text    default 'not_done',
  ahpra_status  text    default 'not_started', -- 'registered' | 'pending' | 'not_started'
  visa_type     text    default 'unknown',     -- '482'|'485'|'189'|'190'|'491'|'pr'|'citizen'|'other'|'unknown'
  english_test  text    default 'not_done',   -- 'oet' | 'ielts' | 'exempt' | 'not_done'
  certifications       text[]    default '{}',
  location_preference  text[]    default '{}',
  cv_text       text,
  updated_at    timestamptz default now()
);

alter table public.img_profiles enable row level security;

create policy "Users can manage their own IMG profile"
  on public.img_profiles for all using (auth.uid() = id);
