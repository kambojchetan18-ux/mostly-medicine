# Reddit AMC Scout

Finds fresh AMC / IMG / AHPRA posts on Reddit and uses Claude (Sonnet 4.6)
to draft a genuine, helpful reply that subtly mentions mostlymedicine.com
when it is naturally relevant. **The script does NOT auto-post** — Chetan
reviews each draft and posts manually via the "Reply on Reddit" link.

## What it does

1. Pulls newest posts (no auth, public `.json` endpoint) from:
   - `r/ausjdocs`
   - `r/IMG`
   - `r/IMGreddit`
   - `r/MedicalAustralia`
   - Reddit search for `AMC exam IMG`
2. Filters posts where title or body matches AMC keywords
   (`AMC`, `CAT 1`, `CAT 2`, `MCAT`, `IMG`, `AHPRA`, `Murtagh`, …) and
   discards anything older than 30 days.
3. Dedupes against `scripts/.reddit-scout-seen.json` (gitignored) so each
   post is only drafted once across runs.
4. For each fresh post, calls Claude Sonnet 4.6 (with prompt caching
   on the system prompt) to draft a 200-400 word reply.
5. Writes a review-ready markdown digest to
   `scripts/reddit-scout-digest-YYYY-MM-DD.md`.
6. If `SLACK_WEBHOOK_URL` is set, posts the top 3 drafts to Slack.

## Run it

From the monorepo root:

```bash
ANTHROPIC_API_KEY=sk-ant-... \
  npx ts-node --project scripts/tsconfig.json --transpile-only \
  scripts/reddit-amc-scout.ts
```

## Env vars

| Var                   | Required | Notes                                                     |
| --------------------- | -------- | --------------------------------------------------------- |
| `ANTHROPIC_API_KEY`   | yes      | Claude API key (Sonnet 4.6 for drafting).                 |
| `SLACK_WEBHOOK_URL`   | no       | If set, posts the top 3 drafts to Slack via webhook.      |
| `RESEND_API_KEY`      | no       | If set, emails the top 3 drafts via Resend.               |
| `ALERT_EMAIL`         | no       | Recipient for the email digest (required if Resend set).  |
| `RESEND_FROM_BRANDED` | no       | Branded From — defaults to `onboarding@resend.dev`.       |
| `SCOUT_MAX_POSTS`     | no       | Cap drafts per run (default 8).                           |

No Reddit auth needed — the public `.json` endpoint is read-only.

## Output

- `scripts/reddit-scout-digest-YYYY-MM-DD.md` — review-ready digest with
  OP's question, drafted reply, and a "Reply on Reddit →" link.
- `scripts/.reddit-scout-seen.json` — local dedupe cache (capped at 5000
  ids; gitignored).
- Console summary at the end of each run.

## Politeness / safety

- 1 request per 2 seconds to Reddit (no API key needed but we do not hammer).
- Exponential backoff on 429s (max 3 retries).
- Skips NSFW and stickied posts.
- The Claude system prompt instructs the draft to avoid forced marketing,
  to mention mostlymedicine.com only when naturally relevant, and to never
  claim credentials.

## Production schedule — GitHub Actions (no laptop needed)

`.github/workflows/reddit-scout.yml` runs the scout daily at **23:00 UTC
= 09:00 AEST** (10:00 during AEDT). It commits the day's digest markdown
and the dedup cache back to the repo so each run sees what was already
drafted.

### Required GitHub Secrets

Add these in **Settings → Secrets and variables → Actions → New repository
secret**:

| Secret                | Required | Value                                                  |
| --------------------- | -------- | ------------------------------------------------------ |
| `ANTHROPIC_API_KEY`   | yes      | `sk-ant-...`                                           |
| `SLACK_WEBHOOK_URL`   | no       | `https://hooks.slack.com/services/...`                 |
| `RESEND_API_KEY`      | no       | `re_...`                                               |
| `ALERT_EMAIL`         | no       | `kamboj.chetan18@gmail.com`                            |
| `RESEND_FROM_BRANDED` | no       | `Mostly Medicine <info@mostlymedicine.com>` once domain verified |

### Manual trigger

GitHub → **Actions** → **Reddit AMC Scout** → **Run workflow**. Useful
when you want a fresh batch right before a posting session.

### Local one-off run

```bash
ANTHROPIC_API_KEY=sk-ant-... \
  npx ts-node --project scripts/tsconfig.json --transpile-only \
  scripts/reddit-amc-scout.ts
```
