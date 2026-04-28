-- Remove the deprecated "cases" and "recalls" modules from module_permissions.
-- The corresponding pages (apps/web/src/app/dashboard/cases & .../recalls) and
-- the packages/content/src/recalls.ts content file have been deleted from the
-- web app. Mobile cleanup is handled by a separate agent.
--
-- Safe to re-run: simple unconditional delete.

delete from module_permissions where module in ('cases', 'recalls');
