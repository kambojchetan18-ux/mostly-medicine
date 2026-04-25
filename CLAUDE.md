# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Medical education platform for IMGs (International Medical Graduates) preparing for AMC CAT 1 & CAT 2 exams in Australia. Turborepo monorepo with a Next.js web app and an Expo React Native mobile app sharing packages.

## Structure
```
mostly-medicine/
├── apps/
│   ├── mobile/     # Expo + React Native (Android/iOS)
│   └── web/        # Next.js + Tailwind (Vercel)
├── packages/
│   ├── ai/         # @mostly-medicine/ai — Anthropic SDK wrappers + clinical scenarios
│   ├── content/    # @mostly-medicine/content — 3000+ MCQ questions + recalls by specialty
│   └── ui/         # @mostly-medicine/ui — shared components
├── supabase/       # DB migrations + edge functions
└── turbo.json
```

## Commands
```bash
pnpm dev           # all apps
pnpm dev:web       # web only
pnpm dev:mobile    # mobile only (then adb reverse tcp:8081 tcp:8081 for Samsung S918B)
pnpm build         # turbo build all
pnpm format        # prettier across monorepo

# Android APK
eas build -p android --profile preview     # internal APK
eas build -p android --profile production  # Play Store

# Supabase
supabase start                             # local dev
SUPABASE_DB_PASSWORD=xxx supabase db push  # push migrations to remote

# Stripe billing — required env vars (test-mode keys for dev, live for prod)
#   STRIPE_SECRET_KEY                     # sk_test_... or sk_live_...
#   STRIPE_WEBHOOK_SECRET                 # whsec_... (from dashboard webhook)
#   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY    # pk_test_... or pk_live_...
#   STRIPE_PRICE_PRO_MONTHLY              # price_... (Pro monthly subscription)
#   STRIPE_PRICE_PRO_YEARLY               # price_...
#   STRIPE_PRICE_ENTERPRISE_MONTHLY       # price_...
#   STRIPE_PRICE_ENTERPRISE_YEARLY        # price_...
#
# Stripe dashboard setup (one-time):
#   1) Create products in Stripe (Pro, Enterprise) with monthly + yearly prices
#   2) Copy each price_id into the env vars above (Vercel + .env.local)
#   3) Add webhook endpoint: POST https://mostlymedicine.com/api/billing/webhook
#      Subscribe to: checkout.session.completed,
#                    customer.subscription.{created,updated,deleted},
#                    invoice.payment_failed
#      Copy the signing secret -> STRIPE_WEBHOOK_SECRET
#   4) Test with Stripe test cards (4242 4242 4242 4242) before flipping to live mode

# AI Clinical RolePlay — offline content build (run once, or after adding PDFs)
# 1) Drop new PDFs into roleplays/source-pdfs/ (gitignored)
# 2) Ingest each PDF into acrp_sources (metadata only, never the PDF text)
ANTHROPIC_API_KEY=... NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
  npx ts-node scripts/acrp-ingest.ts            # flags: --limit N --only foo --redo
# 3) Synthesise blueprints from sources (one Claude call per category)
ANTHROPIC_API_KEY=... NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
  npx ts-node scripts/acrp-blueprints.ts        # flags: --category "..." --redo --difficulty easy|medium|hard
```

## Architecture

### Auth flow
- **Web**: `@supabase/ssr` server-side only. Use `createClient()` from `@/lib/supabase/server` in Server Components/API routes, `createClient()` from `@/lib/supabase/client` in Client Components. Never use `@supabase/auth-helpers-nextjs`.
- **Mobile**: `supabase.auth` from `@/lib/supabase` (direct JS client). Auth gate in `app/_layout.tsx` redirects unauthenticated users to `/auth/login`.

### AI / Anthropic SDK
- `packages/ai/` exports `createClinicalRoleplay()` and scenario data — **do not import `@anthropic-ai/sdk` in mobile**, it's Node.js only. Mobile calls the web's Next.js API routes instead.
- All Claude API calls must use `cache_control` for prompt caching. System prompts live in `apps/web/src/lib/prompts.ts`.

### Content
- `packages/content/` contains all MCQ questions split by specialty (e.g. `questions-cardiovascular.ts`) and spaced repetition recall cards (`recalls.ts`).
- Questions use `difficulty: 'easy' | 'medium' | 'hard'` (lowercase). Do not use title case variants.
- Question IDs must be unique across all specialty files — no validation script exists yet.

### Database
- Migrations in `supabase/migrations/` numbered sequentially (001–008).
- Key tables: `user_profiles` (plan + role, auto-created on signup via trigger), `module_permissions` (per-plan feature flags), `rate_limit_attempts` (persistent rate limiting), `img_profiles` (CV data), `attempts`, `sr_cards` (spaced repetition).
- Rate limiting (`apps/web/src/lib/rate-limit.ts`) uses Supabase via `SUPABASE_SERVICE_ROLE_KEY` — bypasses RLS. Required in both `.env.local` and Vercel env vars.
- Admin access is gated by `user_profiles.role = 'admin'`.

### Web routes
- `app/api/` — API routes for auth, AI (CAT1 MCQ, CAT2 roleplay, library chat, CV analysis), admin CRUD
- `app/dashboard/` — protected pages: cat1, cat2, recalls, library, jobs, progress, profile, admin

### Mobile tabs
- `(tabs)/index` — CAT 1 MCQ practice (uses `school` icon, not `brain`)
- `(tabs)/cat2` — CAT 2 roleplay with voice input + TTS
- `(tabs)/recalls`, `library`, `jobs`, `progress`, `roleplay`

## Critical mobile gotchas
- **WeakRef polyfill in `apps/mobile/index.js`** — must stay, Hermes on Samsung S918B lacks it, crashes `@react-navigation/core` v7
- **Custom `apps/mobile/metro.config.js`** — forces monorepo root for react/react-native/react-dom/scheduler. Do not simplify.
- **CAT 1 tab icon** — must use `school`/`school-outline` (Ionicons). `brain`/`brain-outline` are invalid.
- EAS secrets store `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` — not in `eas.json`.

## Key rules
- **pnpm only** — never npm or yarn. Always install from monorepo root.
- Shared code goes in `packages/`, never duplicated across apps.
- TypeScript strict mode — avoid `any`.
- All Anthropic SDK calls must include `cache_control` on the system prompt.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only — never expose to client.
