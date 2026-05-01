-- 014_fk_and_constraints.sql
-- Re-add FK constraints dropped in migration 026 (which doesn't exist in this branch,
-- but this is forward-compatible). Also adds unique constraint on stripe_subscription_id.

-- ══════════════════════════════════════════════════════════════════════════
-- 1) Unique constraint on stripe_subscription_id (prevent duplicate subs)
-- ══════════════════════════════════════════════════════════════════════════

do $$ begin
  alter table public.user_profiles
    add constraint user_profiles_stripe_subscription_id_unique
    unique (stripe_subscription_id);
exception
  when undefined_column then null;
  when duplicate_object then null;
end $$;

-- ══════════════════════════════════════════════════════════════════════════
-- 2) Re-add FK constraints to auth.users with ON DELETE CASCADE
--    (safe to run even if the FK already exists — catches duplicate_object)
-- ══════════════════════════════════════════════════════════════════════════

do $$ begin
  alter table public.attempts
    add constraint attempts_user_id_fk
    foreign key (user_id) references auth.users(id) on delete cascade;
exception
  when undefined_table then null;
  when undefined_column then null;
  when duplicate_object then null;
end $$;

do $$ begin
  alter table public.sr_cards
    add constraint sr_cards_user_id_fk
    foreign key (user_id) references auth.users(id) on delete cascade;
exception
  when undefined_table then null;
  when undefined_column then null;
  when duplicate_object then null;
end $$;

do $$ begin
  alter table public.topic_progress
    add constraint topic_progress_user_id_fk
    foreign key (user_id) references auth.users(id) on delete cascade;
exception
  when undefined_table then null;
  when undefined_column then null;
  when duplicate_object then null;
end $$;

do $$ begin
  alter table public.study_streaks
    add constraint study_streaks_user_id_fk
    foreign key (user_id) references auth.users(id) on delete cascade;
exception
  when undefined_table then null;
  when undefined_column then null;
  when duplicate_object then null;
end $$;

do $$ begin
  alter table public.roleplay_sessions
    add constraint roleplay_sessions_user_id_fk
    foreign key (user_id) references auth.users(id) on delete cascade;
exception
  when undefined_table then null;
  when undefined_column then null;
  when duplicate_object then null;
end $$;
