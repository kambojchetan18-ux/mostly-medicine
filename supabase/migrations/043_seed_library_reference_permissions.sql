-- Seed module_permissions for library and reference modules.
-- Migration 012 UPDATEs these rows but they were never INSERTed.
insert into public.module_permissions (plan, module, enabled)
values
  ('free', 'library', false),
  ('pro', 'library', true),
  ('enterprise', 'library', true),
  ('free', 'reference', false),
  ('pro', 'reference', true),
  ('enterprise', 'reference', true)
on conflict (plan, module) do nothing;
