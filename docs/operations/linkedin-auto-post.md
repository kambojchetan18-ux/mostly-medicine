# LinkedIn Auto-Post — One-Time Setup

The `/api/cron/publish-linkedin` route fires daily at 00:00 UTC = 10:00 AEST. It picks the oldest article in `social_posts` that hasn't been posted to LinkedIn yet, generates Amandeep-voice copy via the LLM router (DeepSeek with Anthropic fallback), and posts as Amandeep using the LinkedIn UGC Posts API.

For this to work, two Vercel env vars need to be set after a one-time OAuth dance Amandeep does **once**:

- `LINKEDIN_ACCESS_TOKEN` — OAuth bearer token (60-day expiry, refresh manually before it lapses)
- `LINKEDIN_AUTHOR_URN` — Amandeep's LinkedIn person URN, format `urn:li:person:<id>`

Until those env vars are set the route returns a clean 503 "linkedin_not_configured" — safe to deploy without them.

---

## Step 1 — Create a LinkedIn App (5 min)

1. Go to https://developer.linkedin.com/ → **My Apps** → **Create app**
2. App name: `Mostly Medicine`
3. LinkedIn Page: connect to Amandeep's LinkedIn profile (or skip if no Page; not required for personal posting)
4. Logo: any 100×100 PNG
5. Legal agreement: tick
6. **Create app**
7. Once created, go to the **Auth** tab — note the **Client ID** and **Client Secret**
8. Add the redirect URL: `https://mostlymedicine.com/api/auth/linkedin/callback` (we don't have this route yet, but LinkedIn requires a real-looking URL; the Step 3 manual OAuth flow uses this URL too)

## Step 2 — Add the "Share on LinkedIn" product

In the LinkedIn App dashboard:

1. Go to the **Products** tab
2. Add **Sign In with LinkedIn using OpenID Connect** (always auto-approved)
3. Add **Share on LinkedIn** — usually auto-approved for personal posting; in rare cases LinkedIn does a 1-3 day review

The required scope for posting is `w_member_social`. Once "Share on LinkedIn" is approved, this scope becomes available.

## Step 3 — One-time OAuth flow (manual, ~5 min)

LinkedIn does not give a stable long-lived token from the dashboard — Amandeep needs to do an OAuth code exchange once. The cleanest way:

**3a. Get the authorization code**

Open this URL in a browser (replace `<CLIENT_ID>` with the app's client ID):

```
https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=<CLIENT_ID>&redirect_uri=https%3A%2F%2Fmostlymedicine.com%2Fapi%2Fauth%2Flinkedin%2Fcallback&state=mm-onetime&scope=openid%20profile%20w_member_social
```

Amandeep logs in to LinkedIn, approves the scopes. LinkedIn redirects to `https://mostlymedicine.com/api/auth/linkedin/callback?code=<CODE>&state=mm-onetime`. The callback route doesn't exist (we'd 404), but the URL bar contains the `code` parameter — copy it.

**3b. Exchange the code for an access token**

```bash
curl -X POST https://www.linkedin.com/oauth/v2/accessToken \
  -d 'grant_type=authorization_code' \
  -d 'code=<CODE_FROM_3A>' \
  -d 'client_id=<CLIENT_ID>' \
  -d 'client_secret=<CLIENT_SECRET>' \
  -d 'redirect_uri=https://mostlymedicine.com/api/auth/linkedin/callback'
```

Response includes:

```json
{ "access_token": "AQX...long_string...", "expires_in": 5184000, "scope": "openid profile w_member_social" }
```

The token is valid for ~60 days.

**3c. Get Amandeep's person URN**

```bash
curl -H "Authorization: Bearer <ACCESS_TOKEN>" https://api.linkedin.com/v2/userinfo
```

Response:

```json
{ "sub": "abc123XYZ", "name": "Amandeep Kamboj", "given_name": "Amandeep", "family_name": "Kamboj" }
```

The author URN is `urn:li:person:<sub>`, e.g. `urn:li:person:abc123XYZ`.

## Step 4 — Save to Vercel env

```bash
echo "AQX...long_string..." | vercel env add LINKEDIN_ACCESS_TOKEN production
echo "urn:li:person:abc123XYZ" | vercel env add LINKEDIN_AUTHOR_URN production
```

Then redeploy (any tiny commit triggers it, or `vercel --prod`).

## Step 5 — Smoke test

Once env vars are live and the deploy is ready:

```bash
curl https://mostlymedicine.com/api/cron/publish-linkedin
```

Expected response on success:

```json
{ "ok": true, "articleSlug": "amc-vs-plab", "linkedinPostUrn": "urn:li:share:...", "bodyPreview": "..." }
```

Check Amandeep's LinkedIn profile — the post should be live within seconds.

If the response is `{ ok: false, error: "linkedin 401: ..." }`, the access token has expired or the scope wasn't granted. Re-do Step 3.

---

## Token refresh

LinkedIn access tokens expire after 60 days. Set a calendar reminder for ~Day 55 to re-do Step 3a + 3b and update the env var. There is no automatic refresh path — LinkedIn does not issue refresh tokens for member tokens by default.

The cron route logs `linkedin 401: ...` errors clearly when the token expires, so if it stops posting, check Vercel logs first.

## Adding new articles to the queue

Whenever a new pillar page is published:

```sql
insert into social_posts (article_slug, article_title, article_url) values
  ('<slug>', '<title>', 'https://mostlymedicine.com/<slug>')
on conflict (article_slug) do nothing;
```

The next cron fire picks it up. Future enhancement: have the article-publish cron auto-insert this row.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `linkedin_not_configured` 503 | env vars not set | Step 4 above |
| `linkedin 401: ...` | token expired | Re-do Step 3a + 3b, update env, redeploy |
| `linkedin 403: ...` | scope `w_member_social` not granted | Re-do Step 3a with correct scope |
| `queue_empty` 200 | no pending articles | Insert a new social_posts row |
| Same article posted twice | `linkedin_posted_at` not stamped on prior run | Check Vercel logs for the prior run's error; manually update the column if needed |

## Manual "post this specific article now"

If you want to push a specific article ahead of the queue:

```sql
update social_posts
set created_at = now() - interval '999 days'
where article_slug = '<slug>';
```

This makes that row the oldest pending, so the next cron fire picks it up first. Reset other rows' `created_at` if needed.
