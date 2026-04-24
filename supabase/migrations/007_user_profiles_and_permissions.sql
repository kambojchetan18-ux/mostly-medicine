-- user_profiles: extended auth profile with plan + role
create table if not exists public.user_profiles (
  id           uuid references auth.users(id) on delete cascade primary key,
  email        text,
  full_name    text,
  avatar_url   text,
  plan         text not null default 'free' check (plan in ('free', 'pro', 'enterprise')),
  role         text not null default 'user' check (role in ('user', 'admin')),
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

alter table public.user_profiles enable row level security;

create policy "Users can view their own profile"
  on public.user_profiles for select using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.user_profiles for update using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.user_profiles for select
  using (exists (select 1 from public.user_profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "Admins can update all profiles"
  on public.user_profiles for update
  using (exists (select 1 from public.user_profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Auto-create user_profiles row on signup
create or replace function public.handle_new_user_profile()
returns trigger language plpgsql security definer as $$
begin
  insert into public.user_profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
  after insert on auth.users
  for each row execute procedure public.handle_new_user_profile();

-- Backfill existing auth users who don't have a user_profiles row yet
insert into public.user_profiles (id, email, full_name)
select
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1))
from auth.users u
where not exists (select 1 from public.user_profiles p where p.id = u.id)
on conflict (id) do nothing;


-- module_permissions: which modules are enabled per plan, with optional daily limit
create table if not exists public.module_permissions (
  plan         text not null check (plan in ('free', 'pro', 'enterprise')),
  module       text not null,
  enabled      boolean not null default true,
  daily_limit  integer,
  updated_at   timestamptz default now(),
  primary key (plan, module)
);

alter table public.module_permissions enable row level security;

create policy "Public can read module permissions"
  on public.module_permissions for select using (true);

create policy "Admins can manage module permissions"
  on public.module_permissions for all
  using (exists (select 1 from public.user_profiles where id = auth.uid() and role = 'admin'));

-- Default permissions seed
insert into public.module_permissions (plan, module, enabled, daily_limit) values
  ('free',       'mcq',       true,  20),
  ('free',       'roleplay',  false, null),
  ('free',       'recalls',   true,  10),
  ('pro',        'mcq',       true,  null),
  ('pro',        'roleplay',  true,  null),
  ('pro',        'recalls',   true,  null),
  ('enterprise', 'mcq',       true,  null),
  ('enterprise', 'roleplay',  true,  null),
  ('enterprise', 'recalls',   true,  null)
on conflict (plan, module) do nothing;
