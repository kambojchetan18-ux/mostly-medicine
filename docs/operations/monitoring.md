# Mostly Medicine — Operations & Monitoring Runbook

A short field guide for keeping the site alive when the founder is offline.
Last updated: 2026-05-04.

---

## What auto-pauses if I disappear?

| Service | Pause behaviour | Action to recover |
|---|---|---|
| Supabase (free tier) | Project auto-pauses after **~7 days** of zero activity. Site returns 503 on any DB read. | Log into Supabase dashboard → click **Restore / Resume**. The keepalive cron (below) is designed to prevent this. |
| Vercel (hobby tier) | Project does **not** pause from inactivity, but free-tier limits apply (bandwidth, function invocations, build minutes). Overages get throttled — verify current limits in dashboard. | Upgrade plan, or reduce usage, when limits approach. |
| Domain (registrar) | Domain expires once a year unless auto-renew is on. DNS goes dark on expiry. | Check registrar dashboard yearly. Enable auto-renew + email reminders. |
| Anthropic / Groq / Stripe / Resend | These don't pause, but they can rate-limit, drain credits, or fail webhook delivery. See "Where to check costs" below. | Top up credits, rotate keys, replay failed webhooks from each dashboard. |

---

## What the keepalive cron does

A daily Vercel cron pings `/api/health-keepalive` at **06:00 UTC** (17:00 AEDT / 16:00 AEST).
The route runs one tiny `module_permissions` read against Supabase using the
service-role key, which is enough activity for Supabase's free tier to
consider the project "alive" and skip the auto-pause.

Source files:
- Route handler: `/Users/chetan_home/mostly-medicine/apps/web/src/app/api/health-keepalive/route.ts`
- Cron config: `/Users/chetan_home/mostly-medicine/apps/web/vercel.json`

### Verifying it runs

1. Open Vercel dashboard → the `mostly-medicine` (or `web`) project → **Crons** tab.
   You should see `/api/health-keepalive` listed with the next-run timestamp.
2. Click into it to see recent invocations + status codes (200 = healthy).
3. For function logs, go to the **Logs** tab and filter by path
   `/api/health-keepalive`. A successful run prints nothing; failures print
   `[health-keepalive] ...` to `console.error`.

### Manual check (any time)

```
curl https://mostlymedicine.com/api/health-keepalive
# expect: {"ok":true,"timestamp":"...","supabase":"alive"}
```

If `CRON_SECRET` is set on the project, manual curls need
`-H "Authorization: Bearer <secret>"` or they'll 401.

---

## Where to check costs

Visit these dashboards monthly. None of them email you when usage spikes by
default — verify each one has billing alerts enabled in its own settings.

| Service | Where | What to watch |
|---|---|---|
| Anthropic | console.anthropic.com → Usage | Daily token spend, cache hit rate |
| Groq | console.groq.com → Usage | Whisper STT minutes (used by Peer RolePlay) |
| Vercel | vercel.com → Settings → Billing | Function invocations, bandwidth, build minutes |
| Supabase | supabase.com → Project → Settings → Usage | DB size, egress, auth MAU |
| Stripe | dashboard.stripe.com → Balance + Payments | Failed payments, dispute count, webhook delivery health |
| Domain registrar | (whichever registrar holds mostlymedicine.com) | Renewal date, auto-renew status |
| Resend | resend.com → Logs + Domains | Bounce rate, deliverability, DNS records still valid |

---

## Symptoms → likely cause

| Symptom | Likely cause | First step |
|---|---|---|
| Site loads but login fails with 503 / network errors | Supabase project paused | Supabase dashboard → Resume project |
| Login works but every page errors after a deploy | Env var missing in production | Vercel → Settings → Environment Variables → diff against `.env.local` |
| AI chat / CAT 1 / CAT 2 returns "AI service unavailable" | Anthropic key revoked, out of credit, or model deprecated | Anthropic console → Usage + API keys |
| Live RolePlay transcript stays blank | `GROQ_API_KEY` missing or out of free credit | Groq console → Keys + Billing |
| Stripe upgrade flow shows price errors | A `STRIPE_PRICE_*` env var is missing or pointing at wrong mode (test vs live) | Vercel env vars → confirm all four price IDs match the live-mode prices |
| User pays but plan doesn't upgrade | Stripe webhook signature mismatch or endpoint unreachable | Stripe dashboard → Developers → Webhooks → inspect failed deliveries, retry |
| "Email failed to send" on signup | Resend domain unverified or API key rotated | Resend dashboard → Domains + API Keys |
| Site is fully down (DNS error in browser) | Domain expired or DNS misconfigured | Registrar dashboard → renewal status; then Vercel → Domains |
| Deploys succeed but the site shows the old version | Vercel caching or wrong production branch | Vercel → Deployments → Promote the latest deploy to production |
| `/api/health-keepalive` returns 500 daily | Supabase paused, env vars missing, or RLS issue on `module_permissions` | Curl the route, read the JSON `error` field, check Vercel logs |

---

## Setting CRON_SECRET

Generate a 32-byte hex secret with `openssl rand -hex 32`, then add it to
Vercel under **Settings → Environment Variables** as `CRON_SECRET` (Production
+ Preview), and redeploy. Once present, both `/api/health-keepalive` and the
existing `/api/cron/billing-resync` route will require
`Authorization: Bearer <secret>`. Vercel's cron runner sends this header
automatically — you only need to set the var, no further wiring. Until the
secret is set, the keepalive route stays open so daily pings still succeed.

---

## When in doubt

- Vercel logs are the fastest signal — filter by status `>= 500` for the past 24h.
- Supabase logs (Project → Logs → Postgres) catch DB-level failures the app swallows.
- For anything not listed here, **verify in the relevant dashboard** before
  changing code or env vars in production.
