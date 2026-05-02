# Plan — Search Console + Bing Webmaster Tools setup

> Status: ACTION-READY · Chetan to execute, ~25 min total

These two free tools are non-negotiable for AI search visibility:
- **ChatGPT browse mode** uses Bing's index → without Bing Webmaster Tools we're invisible to GPT browse
- **Google AI Overviews / Gemini** use Google's index → Search Console submission halves our typical indexing time
- Both expose direct "submit URL for indexing" buttons that bypass passive crawling

## Step 1 — Google Search Console (~12 min)

### A. Create property
1. Go to https://search.google.com/search-console (use `kamboj.chetan18@gmail.com`)
2. Click **Add property**
3. Choose **Domain** (covers all subdomains — recommended over URL prefix). Enter `mostlymedicine.com`
4. Google will show a DNS TXT record like: `google-site-verification=xxxxxxx`

### B. Verify ownership via DNS
Login to your domain registrar (where mostlymedicine.com lives — Vercel? Cloudflare? GoDaddy? Namecheap?).
1. Open the DNS records section
2. Add a new **TXT** record:
   - Host/Name: `@` (or leave blank — varies by registrar)
   - Value: `google-site-verification=xxxxxxx` (the exact string Google gave you)
   - TTL: default (3600s is fine)
3. Save → wait 1-5 min → click **Verify** in Search Console
4. Once verified, you own the property

### C. Submit sitemap
1. Search Console sidebar → **Sitemaps**
2. Enter: `sitemap.xml` (Google appends to your domain → `https://www.mostlymedicine.com/sitemap.xml`)
3. **Submit**
4. Status should turn "Success" within minutes; "Discovered URLs" populates over the next 24-48h

### D. Request indexing for top URLs (priority, do this manually)
For each of the highest-priority URLs, paste the URL into the search box at the TOP of Search Console:
- https://mostlymedicine.com/
- https://mostlymedicine.com/amc
- https://mostlymedicine.com/amc-cat1
- https://mostlymedicine.com/amc-cat2
- https://mostlymedicine.com/amc-pass-rates-by-country
- https://mostlymedicine.com/amc-vs-plab
- https://mostlymedicine.com/amc-fee-calculator
- https://mostlymedicine.com/img-australia-pathway

For each one: → click "Request Indexing" → wait for confirmation. Limit ~10 manual requests/day; do the rest tomorrow.

### E. Email notifications
Settings → Email preferences → enable **Mostly issues only** (won't spam you, but pings on critical errors).

---

## Step 2 — Bing Webmaster Tools (~5 min)

### A. Create / import
1. Go to https://www.bing.com/webmasters/ (sign in with same Microsoft account or create one)
2. **Add site** → enter `https://www.mostlymedicine.com`
3. **OR easier**: click **Import from Google Search Console** if you set GSC up first — saves verification

### B. Verify (if not imported)
Bing accepts the same DNS TXT record method as Google, OR a meta tag in your HTML head, OR an XML file upload. Easiest is the DNS TXT. Add `<value Bing gives you>` as a TXT record alongside the Google one.

### C. Submit sitemap
Sidebar → **Sitemaps** → Submit → `https://www.mostlymedicine.com/sitemap.xml`

### D. Submit URLs for indexing
Sidebar → **URL Submission** → paste up to 10 URLs at once. Same list as above.

### E. Configure crawl & alerts
Bing's defaults are fine; enable email for critical issues only.

---

## Step 3 — IndexNow API (bonus, ~2 min, fully automated for future)

Bing's IndexNow protocol lets us **push new URLs automatically** when we publish — no manual submission ever again.

I can wire this into the auto-publisher cron (one-time code change, ~15 min):
1. Get Bing IndexNow API key (free, no signup) — they generate it on first call
2. Host the key file at `/api/indexnow-<key>.txt` (a simple Next.js route)
3. After every auto-published article, POST to `https://www.bing.com/indexnow` with the new URL
4. Bing pings ALL participating engines (Yandex, DuckDuckGo, Naver) automatically

Bata jab ready ho — main code add kar dunga.

---

## What "Verified + indexed" looks like (proof states)

After ~48 hours in Search Console, you should see:
- **Coverage**: green "Indexed" rows for the 8 priority URLs
- **Performance**: impressions for queries like "amc pass rate", "amc vs plab", "amc fee calculator"
- **Top queries**: organic search terms that triggered impressions

Once impressions show up, AI engines that source from Google/Bing (ChatGPT browse, Gemini, AI Overviews) will start citing within 1-2 weeks.

---

## Realistic milestones

| Week | What you should see |
|---|---|
| Week 1 | All priority URLs indexed in both consoles |
| Week 2 | First impressions in Search Console for niche queries |
| Week 3 | First clicks from Google. Possibly first Perplexity citation. |
| Week 4 | AI Overviews starts summarising for at least one IMG-specific query |
| Week 6 | ChatGPT (with browse) cites mostlymedicine.com for AMC questions |
| Month 3 | Established as a recognised AMC source — citations across engines |

## What can break this

- **Robots.txt blocking** → already verified open for AI crawlers ✅
- **Slow site** → check PageSpeed Insights monthly
- **Duplicate content** → don't republish drafts on multiple URLs
- **Thin content** → all our pillar articles are 2,500+ words ✅
- **Missing canonical** → all pillar pages have `<link rel="canonical">` ✅

---

**Status of this plan**: action-ready. Reply with "indexnow chalu kar de" to wire the auto-submission code, or just execute Steps 1-2 manually first.
