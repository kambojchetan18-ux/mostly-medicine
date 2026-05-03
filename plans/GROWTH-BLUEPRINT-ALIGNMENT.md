# Growth Blueprint Alignment — Honest Assessment

> Status: PROPOSED · awaiting Chetan's pick of which actions to ship
> Source: NotebookLM "Operation: Massive Success" deck (14 pages, May 3 2026)

The blueprint is a tight playbook for turning Mostly Medicine from "AI study tool" into "dominant IMG ecosystem in Australia". My job here: separate **what aligns** with the trajectory you've already built from **what's premature** at 146 users / 1 paid sub.

## TL;DR

The blueprint is **80% aligned** with what's been shipping. Where it diverges:
- **Premature**: the B2B Recruiter Portal in Q3, the IMG Masterclass high-ticket tier, the "package top 500 performers to RMO pools" play. You don't have 500 verified users yet.
- **Should push back**: gating the AMC Fee Calculator behind email. The calculator's openness is a deliberate SEO/GEO weapon (G'Day Doctor's biggest hidden weakness was their gated subscribe page being invisible to AI crawlers). Gating it loses that moat.
- **Quick wins missing**: AI Diagnostic Report (radar chart), streak heatmap, trust badges above-fold, AI emotional-support messages — all 1-3 hour ships, all immediately useful, all already supported by your existing data.

## What's already done (✅ vs blueprint)

| Blueprint item | Status |
|---|---|
| AMC Fee Calculator | ✅ Live, on hero + sidebar widget + dashboard tile |
| Voice-mode AI Clinical Roleplay | ✅ Live |
| AMC Handbook AI Roleplay | ✅ Live |
| Live 2-Player Peer Roleplay | ✅ Live |
| Australian Jobs Tracker | ✅ Live |
| Reference Library (Murtagh / RACGP / AMC Handbook) | ✅ Live |
| 3,000+ MCQ Bank | ✅ Live (file-based content) |
| Streak system (data layer) | ✅ Tables + RPC, no viz yet |
| XP / leaderboard | ✅ Live |
| Stripe billing AUD | ✅ Free / A$19 Pro / A$49 Enterprise |
| Founder Pro (first 100) | ✅ Capped, hard-limit fix shipped |
| MCQ daily-limit + upgrade modal | ✅ Live |
| MCQ Session results (emedici-style) | ✅ Live (per-session emedici-style page with AI Learning Points) |
| Pillar SEO pages (incl. country) | ✅ 8 live (4 + 3 country + 2 from earlier) |
| Brand-voice content engine | ✅ Daily article drafter + Amandeep social + brand carousel + Slack/email |
| Analytics dashboard (Phase 1 deep) | ✅ Live (8 sections, retention, cohorts, health score) |
| Stripe webhook → DB sync | ✅ Working (after the apex→www redirect fix) |

## What's MISSING (the alignment work)

### Quick wins (~1-3 hours each, ship this week)

#### 1. Trust badges above-fold
**Where**: Homepage hero (or dashboard top bar)
**What**: Two pill badges — "Powered by Claude AI" + "Aligned with AMC Handbook 2026"
**Why**: Pure brand authority. Low effort, immediate trust uplift on first paint. Blueprint slide 11.
**Effort**: 30 min · **Impact**: high (above-fold = every visitor)

#### 2. AI Diagnostic Report — radar chart after first roleplay
**Where**: After AMC Clinical AI RolePlay session (we already score it)
**What**: Visual radar with 4 axes (Clinical Reasoning, Handbook Accuracy, Communication, Empathy) + "Unlock Spaced Repetition to target your weak areas" CTA → /dashboard/billing
**Why**: This is the blueprint's "Aha Moment" mechanic. We score every session already; we just don't visualise it. Drives conversion at the moment of insight.
**Effort**: 2-3 hr (parse existing `feedback` JSON, render SVG radar, hook to billing)
**Impact**: very high — this is the conversion-funnel keystone

#### 3. Streak heatmap (GitHub contribution-style)
**Where**: Dashboard home or sidebar user card
**What**: 7×N grid showing daily MCQ activity, intensity-shaded
**Why**: We have `study_streaks` + `attempts.attempted_at`. Visualising it triggers daily-return behaviour (the dopamine loop in slide 8).
**Effort**: 1-2 hr · **Impact**: high (retention mechanic)

#### 4. Zero-signup MCAT scenario taste
**Where**: New public route `/try-amc-clinical-roleplay`
**What**: Pre-loaded sample scenario, runs entirely client-side OR via signup-bypassed API, 5-minute end-to-end. Ends with "Sign up to save your score + unlock 151 more scenarios."
**Why**: The blueprint's Experience node in the flywheel — drops time-to-aha-moment from "sign up + verify + navigate" to "click play".
**Effort**: 2-3 hr · **Impact**: very high — fills the activation funnel's empty top

#### 5. AI emotional-support / Mentor messages
**Where**: Inline in MCQ + RolePlay flows
**What**: When user has 2+ wrong answers in a row OR breaks a streak, AI mentor surfaces a contextual line: *"You've mastered 80% of the RACGP Red Book guidelines this week. Keep going, doctor."* (per slide 8)
**Why**: Anti-churn. Cheap to implement (one Claude call per trigger, Haiku), big retention upside.
**Effort**: 2 hr · **Impact**: medium-high (90-day retention KPI)

### Medium-effort (1-2 weeks)

#### 6. Lead capture on AMC Fee Calculator — but DO NOT gate
**Push back vs blueprint**: the deck says "Gate the diagnostic results behind email capture" (slide 5). I'd argue gating the Calculator itself loses our SEO/GEO moat (G'Day Doctor's calculator IS gated which is why it's invisible to AI crawlers).

**Better path**: Keep the calculator fully open. After result is shown, soft-prompt: *"Email me a personalised AMC pathway plan based on this total"* — captures email **without** locking the public from the result. Same lead funnel, no SEO cost.

**Effort**: 1 day · **Impact**: high (email list growth without giving up open content)

#### 7. Live Peer matchmaking (find-a-partner queue)
**Where**: AMC Peer RolePlay module
**What**: Currently invite-code only. Add "Find a partner" button → user joins a queue → auto-paired with another waiting candidate within 60s, fall-through to AI if nobody waiting.
**Why**: Q2 of the blueprint roadmap (Community & Live). Drives organic viral growth — paired users invite their cohort.
**Effort**: 1 week (queue table + worker + UI) · **Impact**: high

#### 8. AI emotional-support tied to spaced-repetition mastery
**Where**: Daily push (web/mobile) when user crosses module mastery thresholds
**What**: Combination of #5 + streak heatmap. "Your cardiology accuracy went from 62% → 78% this week" type messaging.
**Effort**: 3-4 days · **Impact**: medium-high

### Higher lift (1-3 months — defer until volume justifies)

#### 9. B2B Recruiter Portal MVP
**Blueprint's Q3 ambition**: dedicated recruiter view of top-10% candidates with AI-verified clinical communication scores → place into RMO/GP roles → revenue from placement fees.

**Reality check**: At 146 users with 1 paid sub, you don't have 500 vetted, exam-ready candidates yet. Recruiters need supply BEFORE they'll engage. Build this when you cross ~500 active users with at least 50 having completed 5+ roleplays each.

**Premature now**, but the data architecture (track AI-verified empathy/reasoning scores per user) can be built earlier — that's a 2-week job that lays groundwork for Q3-Q4.

#### 10. IMG Masterclass tier (high-ticket anchor)
**Blueprint's tier**: A premium yearly subscription (likely A$1,500-2,500) for cohort-style live coaching, dedicated study cohorts, priority job placement.

**Reality check**: Cohort pricing requires real cohorts. You don't have a community yet at 146 users. Add this when you have evidence Pro→Enterprise upgrade demand exists. Right now your data shows 1 paid sub total — adding a third tier won't fix that until #2 (AI Diagnostic) is shipped and the conversion funnel actually works.

**Defer to Q3-Q4**.

#### 11. Top-500 IMG package to recruiters
**Defer until you have 1000+ users + 100+ with verified high empathy/reasoning scores.**

## What I'd ship THIS WEEK (ranked by impact × effort)

1. ✨ **AI Diagnostic Report (radar chart)** — 2-3 hr — keystone of the conversion funnel
2. ✨ **Trust badges above-fold** — 30 min — pure brand authority lift
3. ✨ **Streak heatmap on dashboard** — 1-2 hr — daily-return mechanic
4. ✨ **AI Emotional Support messages** — 2 hr — retention lever
5. ✨ **Zero-signup MCAT scenario taste page** — 2-3 hr — fills the empty top of funnel

**Total: ~10 hours of focused work for 5 high-impact alignment ships.**

The B2B portal, Masterclass tier, and recruiter pitches are correctly placed in Q3-Q4 of the blueprint roadmap — not because the strategy is wrong, but because they need user volume that doesn't exist yet. Build the dopamine loop and conversion funnel first. The premium tier and B2B revenue follow naturally from a working core.

## What I'd push back on

| Blueprint claim | My honest counter |
|---|---|
| "Gate calculator behind email capture" | Loses SEO/GEO moat. Soft email prompt AFTER result is better. |
| "Q3 launch B2B Recruiter Portal" | Need 500+ users first. Closer to month 9-12 realistically. |
| "Package top 500 performing IMGs" | You have 146 total. Premise breaks at current scale. |
| "Anchor against A$6,690 stakes for premium yearly" | Reasonable framing, but yearly tier needs at least 100 monthly Pros first to validate. |

## What's NEXT after blueprint Phase 1

Once the 5 quick wins are live AND the conversion funnel is converting (Free→Pro >5%):

1. Validate IMG Masterclass demand via wait-list landing page (zero build, just CTA)
2. Build the verified-score data layer (groundwork for B2B portal)
3. Manual recruiter outreach to 5 RMO pools — validate willingness to pay for placement
4. Then build the portal with confirmed demand

---

## Decision needed

**Which of the 5 quick wins should I start tonight / tomorrow?**

Pick any combo — I'll launch agents in parallel for independent ones. My vote (in order of impact):

1. **AI Diagnostic Report** (the keystone)
2. **Streak heatmap** (retention)
3. **Zero-signup scenario taste** (fill the empty funnel top)
4. **AI Emotional Support messages** (anti-churn)
5. **Trust badges** (brand polish)

Or just say "all 5" and I'll ship them across 2-3 commits over the next 24-48 hours.

The B2B Portal and IMG Masterclass go in the Q3-Q4 backlog explicitly — not abandoned, just sequenced.
