# Competitor Deep-Dive: G'Day Doctor (gdaydoctor.com.au)

*Written 2026-05-02 by Claude (research agent), commissioned by Chetan Kamboj.*

## TL;DR

G'Day Doctor is a static, SEO-driven IMG course shop selling a **one-time A$797 lifetime AMC MCQ bundle** (1,700 questions + 50hr video + 5 mocks) plus a newer **AI-OSCE product**, but ships with zero named founder, zero verifiable pass-rate proof, and AI-tell blog content. Their moat is content volume + decade-old "lifetime" pricing psychology; their gap is human credibility and clinical-roleplay depth. **Single highest-leverage move for Mostly Medicine: turn Amandeep's named-founder story + Anthropic-grade roleplay into a video-anchored landing page that out-trusts G'Day on every dimension SEO can't fix.**

---

## Section 1 — G'Day Doctor product breakdown

Source URLs visited: `gdaydoctor.com.au/`, `/courses`, `/blog`, `/amc-mcq-exam-preparation`, `/resources/sample-questions`, `/indian-doctor-australia`, `/contact`, `/blog/amc-mcq-high-yield-topics-prioritise-study-plan`, `/robots.txt`, `/sitemap.xml`, `/sitemap-0.xml`. Several routes (`/subscribe`, `/osce`, `/osce/pricing`, `/clinical-detective`, `/audio-lectures`) are client-side rendered and return only "Loading session…" to crawlers — that itself is a finding (see Dimension 6).

### 1. Offering / curriculum
**Do:** Two paid products. AMC MCQ course = 1,700+ MCQs, 50+ hours of "expert-led" video tutorials, 5 full-length mock exams, "24/7 support". AMC Clinical OSCE (positioned as NEW) = 130 stations across 6 clinical domains with an "AI voice patient", 13-domain scoring on the AMC 7-point scale, 20 audio lectures, full mock OSCE exams. They also run free engagement hooks: 25 sample MCQs, 1 free OSCE station, 4 free audio lectures, a daily "Clinical Detective" case (with leaderboard/archive/stats — gamified retention loop) and a "Daily Brain Teaser".
**Don't:** No live classes, no peer/2-player roleplay, no spaced-repetition recall layer that's visible, no published examiner-feedback rubric beyond the 7-point scale claim, no question-by-question Australian-context tagging surfaced.

### 2. Pricing & monetization
**Do:** AMC MCQ is **A$797 one-time, lifetime access** (anchored against $997 with a "save $200 this month" urgency frame). Free trial advertised "no credit card required". OSCE pricing is hidden behind a redirect (`/osce/pricing` → "Redirecting to pricing…" client-rendered, never reaches a static price). They lean on the lifetime/one-time format that converts heavily for cost-anxious IMGs facing AMC fees of A$2,790+.
**Don't:** No subscription/SaaS pricing visible, no per-month entry tier, no refund policy on the public page, no AUD/INR/USD multi-currency, no enterprise/coaching-academy tier. The "subscribe" page (`/subscribe?course=amc-part1-mcq`) is a JS-only flow — invisible to crawlers and to anyone with JS issues.

### 3. Brand & positioning
**Do:** Position as the "AMC-focused, IMG community, 2026-updated" prep platform. Audience is segmented hard by source country — separate landing pages for Indian, Pakistani, Filipino, Nigerian, MENA, UK/Ireland, Singapore, Canadian, South African doctors (8 country pages). Operating entity is Gday LMS Pty Ltd, ABN 25 693 545 854, Victoria. Implicit promise: "we know your country pathway".
**Don't:** **No founder name anywhere.** No team photos, no clinician credentials, no LinkedIn link, no candidate-named pass story. Social presence appears to be `@gdaylms` Facebook + Instagram only (no founder personal brand). Trust comes purely from ABN, "thousands successful" claims, and government-website citations.

### 4. Signup / activation UX
**Do:** Multiple low-friction entry points — sample MCQs (25 free), 1 free OSCE station, free audio lectures, and the daily Clinical Detective case work as gateway drugs. The freebie-counter ("Free Questions Used 0 / 25") is a competent micro-commitment device.
**Don't:** Subscribe page is a client-side React redirect that fails to render server-side — so search engines, AI crawlers, and link previews all see "Loading session…" instead of pricing. Anyone on slow mobile or with hydration issues hits a blank wall at the highest-intent moment in the funnel.

### 5. Content quality / pedagogical approach
**Do:** 13 long-form blog posts (5–20 min read) covering AMC-MCQ strategy, OSCE format, exam fees, country pathways. Most-recent 2026-05-01 update on majority of pages — they actively refresh. Some traction on individual posts (`AMC Exam Fees 2025-2026` shows 1,080 views, `AMC MCQ Pass Standard Changes 2026` shows 229).
**Don't:** Blog content is **almost certainly AI-written and unedited**. The "AMC MCQ High-Yield Topics" post (2,200–2,400 words) has no citations, no PBS/eTG/Murtagh references, "The GdayDoctor Team" generic byline, AI-tell phrasing ("Here's how to prioritise…"), formulaic table structures, no exam stats despite claiming "based on exam analysis". Sample-question explanations not visible without signup. No author bylines or photos. No medical-reviewer attribution.

### 6. SEO / GEO discoverability
**Do:** robots.txt is open: `User-agent: *  Allow: /` — AI crawlers (GPTBot, ClaudeBot, PerplexityBot) inherit blanket allow. Sitemap published, 45 URLs, country-pathway pages well-structured for `[nationality] doctor australia` queries. Clinical Detective + leaderboard creates daily-content-freshness signals.
**Don't:** **No `/llms.txt`** (404 confirmed). No schema.org pricing on the public-facing AMC MCQ page that's visible to crawlers (the dynamic `/subscribe` page that holds pricing is invisible to bots). The 4 highest-converting pages (`/subscribe`, `/osce`, `/osce/pricing`, `/clinical-detective`) are all client-side-only — meaning Google sees zero pricing, zero OSCE feature copy, zero leaderboard content. This is a structural GEO weakness MM can exploit immediately.

### 7. Social proof & trust signals
**Do:** Three named testimonials on the AMC MCQ page (Dr Raj Patel India→Melbourne, Dr Sarah Ahmed Egypt→Sydney, Dr Chen Wei China→Brisbane). Citations to amc.org.au and ahpra.gov.au. ABN/ACN/GST disclosed. "Thousands of successful IMGs" claim repeated.
**Don't:** **Zero verifiable trust artefacts.** No testimonial photos, no LinkedIn links on testimonials, no video testimonials, no founder face. The three testimonials look stock-generated (one-per-continent, neat name patterns). No published pass-rate of *their* candidates. No medical-reviewer named. No partnership badges with universities/hospitals. No press coverage. No before/after candidate stories.

### 8. Mobile experience
**Do:** Site loads on mobile, navigation present, responsive layout inferred from page structure.
**Don't:** Could not assess deeply — many key flows (`/subscribe`, `/osce`, pricing) failed even on a server-side fetch, suggesting the JS-heavy SPA is brittle on flaky-3G mobile. No native app referenced anywhere in the sitemap (`/audio-lectures` exists but there's no Play Store/App Store mention). This is a clear MM advantage given Mostly Medicine has a native Expo Android app already.

### 9. Differentiation moats
**Do:** Country-of-origin landing pages (8 of them) — durable SEO real estate that compounds. The lifetime-one-time price psychology converts well versus subscription fatigue. Clinical Detective daily case as engagement loop. They've been around long enough to rank ("AMC Exam Fees 2025-2026" pulling 1,080 views).
**Don't:** Their "AI voice patient" OSCE claim is a copyable feature with weaker AI than Mostly Medicine's Anthropic Claude Sonnet/Opus stack. They have no peer-roleplay (live 2-player video) at all. No founder-personal-brand moat. No proprietary content (no Murtagh/RACGP licensing visible). No published research, no white papers, no conference talks. Their moat is mostly "first to brand in the cheap-IMG-prep niche", not technical or relational.

---

## Section 2 — Comparison table (Mostly Medicine vs G'Day Doctor)

| Dimension | Mostly Medicine | G'Day Doctor | Verdict |
|---|---|---|---|
| **Offering** | 3,000+ MCQs, 151 MCAT scenarios, AMC Handbook AI RolePlay, AMC Clinical AI RolePlay (voice mode), Peer RolePlay (live 2-player video), reference library (Murtagh, RACGP Red Book), AMC Fee Calculator, Australian Jobs tracker | 1,700 MCQs, 130 OSCE stations (AI voice), 50hr video, 5 mocks, 20 audio lectures, daily Clinical Detective | **MM ahead** on MCQ volume, roleplay depth, peer feature; **G'Day ahead** on video lectures (50hr) and gamified daily case |
| **Pricing** | A$0 free / A$19 mo Pro / A$49 mo Enterprise (yearly ~17% off); AUD-native billing | A$797 one-time lifetime (anchored vs $997); no monthly tier visible | **Tied / different** — MM lower entry, G'Day lower lifetime TCO if user converts. Different buyer psychology |
| **Brand & positioning** | Named founder Chetan Kamboj + medical reviewer Dr Amandeep Kamboj (AMC-pass IMG, MBBS); founder-built-because-wife-suffered story | No named founder, "Gday LMS Pty Ltd", anonymous "GdayDoctor Team" byline | **MM far ahead** — this is G'Day's biggest gap |
| **Activation UX** | Free tier, no card required, 30-day Founder Pro promo (now closed) | 25 free MCQs, 1 free OSCE, 4 free audio lectures, daily case loop | **G'Day slightly ahead** on free hooks variety; MM ahead on time-to-value (no JS rendering blockers) |
| **Content quality** | Long-form drafts citing real sources (Murtagh, eTG, AMC stats page, AHPRA, MJA, BMC Med Ed); named author + medical reviewer; first-party data ("136 active users") | AI-tell blog content, no citations, generic team byline, no Australian-specific therapeutic references | **MM far ahead** — G'Day cannot compete on E-E-A-T without a named clinician |
| **SEO / GEO** | Schema.org FAQ on homepage, llms.txt + llms-full.txt published, server-rendered pricing in `BillingClient.tsx`, ~136 active users, blog drafts with citation hooks ("AI-citation hook 1/2/3/4/5") | Open robots.txt, 45-URL sitemap, 8 country-pathway pages, **no llms.txt**, pricing invisible to crawlers (CSR), AI-tell blog content | **MM ahead on GEO/AI-citability**; **G'Day ahead on country-pathway SEO breadth** (8 country pages MM doesn't have) |
| **Social proof** | Named medical reviewer (Dr Amandeep), founder name, internal data ("n=136"), but no public testimonial videos yet | Three text testimonials (likely stock), no photos, no LinkedIn, no founder face | **MM ahead on credibility skeleton; tied on visible social proof** until MM ships testimonials |
| **Mobile experience** | Native Expo Android app on Samsung S918B, voice mic via Groq Whisper, web responsive, server-side rendering | Web-only SPA, no native app, key pricing/OSCE pages fail SSR | **MM far ahead** |
| **Moats** | Anthropic Claude Sonnet/Opus roleplay, Peer RolePlay 2-player video over WebRTC + Cloudflare TURN, founder-couple narrative, real first-party usage data | 8 country-pathway pages, lifetime-pricing brand, daily Clinical Detective gamification | **Different** — MM's moats are technical + relational; G'Day's are content-volume + price-psychology |

**Net:** Mostly Medicine is technically and pedagogically ahead, content-credibility ahead, and mobile ahead. G'Day Doctor is ahead on country-segmented SEO breadth, on the lifetime-pricing psychology that some IMG cohorts prefer, and on engagement-loop gamification (Clinical Detective).

---

## Section 3 — Top 8 actions ranked by impact-vs-effort

### 1. Ship the Amandeep + Chetan founder video on the homepage hero
**Current:** `apps/web/src/app/page.tsx` shows a polished but founderless hero ("AI-powered exam preparation for International Medical Graduates"). No founder face above the fold. G'Day has no founder face at all — this is a free moat.
**Do:** Record a 60-second iPhone-shot video of Chetan + Amandeep saying "She passed AMC, this is the platform we wish she'd had". Embed above the bento grid. Add transcript with schema.org `VideoObject`.
**Effort:** Small. **Impact:** Immediate — every visitor sees what G'Day cannot legally claim because they have no clinician founder.

### 2. Build 3 video testimonials of real IMG passers (named, photo, LinkedIn-linked)
**Current:** MM has no video testimonials on the public site. G'Day has 3 unverifiable text testimonials.
**Do:** Reach out to Amandeep's AMC cohort + the existing 136 platform users. Offer A$100 Amazon voucher + 1 year free Pro for a 90-second Loom-style video: country, pass result, what helped. Anchor on the homepage and on `/amc-pass-rates-by-country` blog. Each must include LinkedIn URL + photo.
**Effort:** Medium (outreach + edit). **Impact:** 30 days — collapses the social-proof gap permanently.

### 3. Publish 8 country-pathway pages (mirror G'Day's structural SEO play, but with citations)
**Current:** MM has the AMC pillar + a few drafts but no `/img-india-australia`, `/img-pakistan-australia`, `/img-philippines-australia` etc. G'Day has 8 such pages getting indexed.
**Do:** One pillar page per country: India, Pakistan, Sri Lanka, Bangladesh, Philippines, Egypt, Iran, Nigeria. ~2,500 words each, named author (Chetan), medical reviewer (Amandeep), citation to AHPRA + AMC stats + country-medical-council. Use the country-specific framing from the existing `04-amc-pass-rates-by-country.md` draft. **Each page must out-cite G'Day** — they have zero source links per page.
**Effort:** Large (8 pages × 2.5k words). **Impact:** 90 days — durable SEO real estate; each page is a permanent funnel.

### 4. Add a public llms.txt-equivalent for the courses + pricing page
**Current:** MM already has `llms.txt` and `llms-full.txt` (excellent). What's missing is the *price + product* canonical surface in those files — `BillingClient.tsx` has the live A$19/A$49 numbers but they're not in `llms.txt`.
**Do:** Update `llms.txt` to explicitly state "Pro A$19/mo or A$190/yr; Enterprise A$49/mo or A$490/yr" and "AMC MCQ included in Pro tier — no lifetime/one-time option". This becomes the canonical answer when ChatGPT/Claude/Perplexity is asked "how much is Mostly Medicine vs G'Day Doctor".
**Effort:** Small. **Impact:** Immediate — directly competes for AI-engine quote share where G'Day is invisible (their pricing is JS-rendered, AI engines see "Loading session…").

### 5. Ship a public "compare us" page: `/mostly-medicine-vs-gday-doctor`
**Current:** No comparison page exists. Search-volume for `gday doctor review` and `gday doctor vs ...` is small but conversion-intent is extreme.
**Do:** Build an honest comparison page following the Section 2 table above. Key wedges: named founder, peer roleplay, native mobile app, AUD subscription with cancel-anytime vs A$797 lifetime risk. Cite both sites' URLs. Schema.org `Product` markup. Don't trash-talk — let the table speak.
**Effort:** Medium. **Impact:** 30 days — captures bottom-of-funnel queries that G'Day cannot rebut.

### 6. Daily-question engagement loop (their "Clinical Detective" copy, but better)
**Current:** MM has 3,000 MCQs but no daily-cadence engagement loop visible from the public homepage. G'Day's `/clinical-detective` + leaderboard + archive + stats is a decent retention pattern.
**Do:** Ship `/daily-amc` — one MCQ a day, public (no signup), with explanation visible only to logged-in users. Email opt-in for daily delivery. Leaderboard optional. This becomes the "AMC question of the day" canonical link IMGs share in WhatsApp groups — distribution moat.
**Effort:** Medium. **Impact:** 90 days — retention + viral-loop; matches G'Day's only genuinely sticky product.

### 7. Fix the homepage CTA: most visitors are *not* returning users
**Current:** Page.tsx line 194 routes signed-out users to `/auth/login` ("Log in to continue"). Comment says "most clickers are returning users" — that may have been true at 30 users, less so at 136+ and definitely not after the LinkedIn launch (2026-05-01). G'Day defaults to "Sign Up" / "Try Free Sample" / "Enroll Now".
**Do:** A/B test homepage CTA: "Log in" (current) vs "Try 25 free MCQs — no signup" (matches G'Day's freebie-counter pattern). Track signup conversion, not click-through. Decide in 14 days.
**Effort:** Small. **Impact:** Immediate — one of the cheapest tests with potentially the biggest funnel impact.

### 8. Publish first-party pass-rate data
**Current:** `04-amc-pass-rates-by-country.md` draft references "n=136 active users" but no public dashboard. G'Day claims "thousands successful" with zero verification.
**Do:** Build `/pass-rates` — a transparent live page: "X candidates have used Mostly Medicine, Y self-reported a pass, Z% first-attempt rate". Update monthly. Show the methodology (self-reported, opt-in, cohort-defined). This is the only metric G'Day cannot fake without lying.
**Effort:** Medium (needs a self-report flow + simple aggregation). **Impact:** 90 days — becomes the most-shared link on r/AusDoctors and IMG WhatsApp groups; becomes the AI-engine canonical answer to "does Mostly Medicine actually work".

---

## Section 4 — Three things G'Day does that we should NOT copy

1. **Lifetime / one-time A$797 pricing.** It looks attractive but it caps LTV, kills the recurring-revenue narrative for any future fundraise, and creates a refund-and-stale-content liability (you owe them updates forever). MM's A$19 monthly is healthier; resist the urge to mirror.
2. **AI-written team-byline blog content with no citations.** It's cheap to scale but actively harms E-E-A-T in 2026 — Google's helpful-content-update + AI-content classifiers + LLM source-quality ranking all penalise this. MM's content-plan drafts already cite Murtagh, eTG, AMC stats, MJA, BMC Med Ed; keep that rigour and let G'Day burn their domain authority on slop.
3. **Anonymous founder + stock-pattern testimonials.** This is G'Day's structural ceiling. As soon as a competitor (us) ships a named clinician + verifiable testimonial videos, G'Day becomes uninvestable in the eyes of any IMG who reads the About page. Don't ever publish a testimonial without a real name + photo + LinkedIn.

---

## Section 5 — Honest assessment

**Are they ahead, behind, or differently positioned?**

**Differently positioned, with MM clearly ahead on the dimensions that compound.**

G'Day Doctor is ahead on three things that don't compound: (a) country-pathway SEO breadth (8 indexed pages, MM has 0–2), (b) brand age in the niche, and (c) the lifetime-pricing psychology that converts a specific cost-anxious sub-segment of IMGs.

Mostly Medicine is ahead on every dimension that does compound: (a) **named clinician founder** with a real story (Amandeep's AMC pass, recency-of-practice in Gurugram, Sydney return) — this is the single most valuable asset and G'Day structurally cannot replicate it without rebranding; (b) **technical depth** — Anthropic Claude roleplay, Peer RolePlay over Cloudflare WebRTC, native Expo Android app — all things G'Day's static-PHP-feeling stack cannot match; (c) **content-credibility skeleton** — citation-rich drafts, llms.txt, schema.org, server-rendered pricing visible to AI engines while G'Day's pricing is invisible behind a "Loading session…" JS gate; (d) **AUD-native subscription** with a free tier and the legitimacy of a real Stripe webhook flow.

The honest read: **G'Day is the established but stagnant incumbent in the cheap-IMG-prep niche, optimised for an SEO + paid-ads world circa 2022.** Mostly Medicine is the AI-native, founder-led, mobile-first challenger optimised for a 2026+ world where AI engines, video testimonials, and named clinical authority decide who gets quoted. The race is won not by closing G'Day's SEO breadth gap (we'll never out-publish a 4-year-old anonymous content farm), but by widening the credibility, technical, and AI-citability gap until G'Day cannot show up in the same conversations as MM. Actions 1, 2, 4, 5, 8 above are exactly that play.

---

*End of report. Total ~2,000 words. Sources: all `gdaydoctor.com.au` URLs cited inline; MM context from `apps/web/public/llms.txt`, `apps/web/public/llms-full.txt`, `apps/web/src/app/page.tsx`, `apps/web/src/app/dashboard/billing/BillingClient.tsx`, `content-plan/drafts/04-amc-pass-rates-by-country.md`.*
