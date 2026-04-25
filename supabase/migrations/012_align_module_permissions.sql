-- Align module_permissions with the billing UI tiers (Free / Pro / Enterprise).
-- Also drops the duplicate `cat2` key in favour of the original `roleplay` key
-- so the AMC Handbook RolePlay route maps to a single permission flag.

delete from module_permissions where module = 'cat2';

-- Free tier — MCQ + spaced repetition recalls (limited daily) + reference (read-only)
update module_permissions set enabled = true,  daily_limit = 20   where plan = 'free' and module = 'mcq';
update module_permissions set enabled = true,  daily_limit = 10   where plan = 'free' and module = 'recalls';
update module_permissions set enabled = true,  daily_limit = null where plan = 'free' and module = 'library';
update module_permissions set enabled = true,  daily_limit = null where plan = 'free' and module = 'reference';
update module_permissions set enabled = false, daily_limit = null where plan = 'free' and module = 'roleplay';
update module_permissions set enabled = false, daily_limit = null where plan = 'free' and module = 'cases';
update module_permissions set enabled = false, daily_limit = null where plan = 'free' and module = 'acrp_solo';
update module_permissions set enabled = false, daily_limit = null where plan = 'free' and module = 'acrp_live';

-- Pro tier — everything except the live 2-player module
update module_permissions set enabled = true,  daily_limit = null where plan = 'pro' and module = 'mcq';
update module_permissions set enabled = true,  daily_limit = null where plan = 'pro' and module = 'recalls';
update module_permissions set enabled = true,  daily_limit = null where plan = 'pro' and module = 'library';
update module_permissions set enabled = true,  daily_limit = null where plan = 'pro' and module = 'reference';
update module_permissions set enabled = true,  daily_limit = null where plan = 'pro' and module = 'roleplay';
update module_permissions set enabled = true,  daily_limit = null where plan = 'pro' and module = 'cases';
update module_permissions set enabled = true,  daily_limit = 30   where plan = 'pro' and module = 'acrp_solo';
update module_permissions set enabled = false, daily_limit = null where plan = 'pro' and module = 'acrp_live';

-- Enterprise — everything, no caps
update module_permissions set enabled = true, daily_limit = null where plan = 'enterprise';
