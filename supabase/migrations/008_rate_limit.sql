-- rate_limit_attempts: persistent rate limiting across serverless instances
create table if not exists public.rate_limit_attempts (
  key              text not null,
  count            integer not null default 0,
  first_attempt_at timestamptz not null default now(),
  locked_until     timestamptz,
  updated_at       timestamptz default now(),
  primary key (key)
);

-- RLS enabled with no policies — only accessible via service_role key (server-side only)
alter table public.rate_limit_attempts enable row level security;

-- Cleanup old entries automatically (> 1 hour)
create index if not exists rate_limit_key_idx on public.rate_limit_attempts (key);
create index if not exists rate_limit_locked_idx on public.rate_limit_attempts (locked_until) where locked_until is not null;
