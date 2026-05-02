# Plan — Welcome Email Campaign for Mostly Medicine Users

> Status: PROPOSED · awaiting Chetan + Amandeep review
> No emails will be drafted or sent until both review and explicitly approve this plan.

We have **136 user emails** in `user_profiles.email`. Most of them signed up over the past two weeks during the LinkedIn launch. Right now we send them nothing. This plan turns silent signups into engaged users with a 5-touch welcome sequence — every email gated by founder review before it sends.

## Why send anything

- Activation rate is unmeasured but visibly low (most users haven't done their first MCQ session yet)
- Founder window expires 30 May 2026 — without nudges, founder Pro lapses unused → no upgrade conversation
- A warm welcome from the founder is the single highest-ROI touch a SaaS can do (open rates 60-80% for personal-sender first emails)

## The 5-email sequence

Each email is triggered by a Supabase Postgres event (`user_profiles.created_at` plus delays) or a manual admin trigger.

### Email 1 — Welcome (sent at signup + 10 minutes)
- **Subject**: "Welcome to Mostly Medicine, {{first_name}} 👋"
- **From**: Chetan Kamboj <chetan@mostlymedicine.com> (personal, not noreply)
- **Reply-to**: real inbox monitored by Chetan
- **Content arc**:
  1. Personal welcome — "I built this for IMGs like my wife."
  2. Founder's story in 4 sentences (Amandeep's AMC journey, what she said was missing, why this exists)
  3. One concrete next step — "Try the AMC MCQ module — 15 min, see your weak topic"
  4. Soft mention: founder #N badge active until 30 May
- **CTA button**: "Start your first MCQ session" → /dashboard/cat1
- **Length**: ~150 words. Plain text feel even if HTML — no marketing template.
- **Personalization tokens**: `{{first_name}}`, `{{founder_rank}}`, `{{founder_until}}`

### Email 2 — Onboarding nudge (signup + 2 days)
- **Subject**: "Your first 3 AMC MCQs — quick win"
- **Trigger**: only if user has done <3 MCQs in last 48h
- **Content**: A 90-second mini-tour. Three screenshots showing: pick a topic → answer → see the AI examiner explanation. Encourage one session.
- **CTA**: "Open AMC MCQ" → /dashboard/cat1

### Email 3 — Showcase Peer RolePlay (signup + 5 days)
- **Subject**: "The feature most IMGs underestimate"
- **Trigger**: any user who completed ≥1 MCQ (sign of activation)
- **Content**: Why CAT 2 fails most candidates → Peer RolePlay solution → invite-code sharing flow → 1 quote from Amandeep. Encourage them to invite a study partner.
- **CTA**: "Start a peer session" → /dashboard/ai-roleplay/live

### Email 4 — Founder window soft-deadline (signup + 14 days OR pro_until - 7 days, whichever later)
- **Subject**: "Your founder Pro ends in 7 days"
- **Trigger**: founder users only, fires when `pro_until` is 7 days away
- **Content**: Short. "Your Founder #N Pro access is wrapping up on {{founder_until}}. If you found Mostly Medicine useful, A$19/mo keeps Pro active. If not, no pressure — Free tier still has the MCQ basics."
- **CTA**: "Stay on Pro — A$19/mo" → /dashboard/billing
- **Why it matters**: respectful, no pressure, gives the user a clear opt-in moment

### Email 5 — Case study + ask for feedback (signup + 30 days OR after Pro ends)
- **Subject**: "{{first_name}}, what worked for you (and what didn't)?"
- **From**: Amandeep Kamboj <amandeep@mostlymedicine.com>
- **Content arc**:
  1. Amandeep introduces herself in two sentences
  2. Asks 3 specific questions: which module helped most? what's missing? what's broken?
  3. Promises a personal reply
- **CTA**: just reply to the email
- **Why this email matters**: free product research, builds Amandeep's relationship with the user base, sets up the "Mostly Medicine is built by IMGs for IMGs" narrative that GEO articles will leverage

## Review workflow

This is the part of the plan you specifically asked for.

```
        ┌─ Chetan asks: "draft email 1"
        ↓
   [Claude drafts] ─→ saves to /email-plan/drafts/01-welcome.md (frontmatter + body)
        ↓
   [Slack notification via SLACK_WEBHOOK_URL] (subject preview + GitHub link)
        ↓
        ├─ Chetan reviews on phone → 👍
        └─ Amandeep reviews on phone → 👍 (separate explicit step)
        ↓
   [Both approve via in-app approval at /dashboard/admin/email-queue]
        ↓
   [Send-now button enqueues to send_queue table]
        ↓
   [Cron pulls send_queue, sends via Resend API to a 50-user batch]
        ↓
   [Resend webhook → /api/email/webhook → updates email_events table with delivered/opened/clicked]
```

**Hard guardrails (non-negotiable):**
- No email leaves the system without **two distinct admin row updates** in `email_drafts` table — `chetan_approved_at` AND `amandeep_approved_at` both not null. If either is null, the cron skips that batch.
- First batch is **5 users** (test). Only after review of bounce + complaint signals does the rest of the cohort go.
- Every email includes a one-click unsubscribe link (CAN-SPAM / Australian Spam Act 2003 compliance).
- Sender domain is mostlymedicine.com (we already own it). SPF + DKIM + DMARC records must be set up first — Resend gives the DNS lines.

## Tech stack (open-source / freemium only, per project rule)

| Component | Tool | Why |
|---|---|---|
| Email API | **Resend** (free 3,000/mo) | Generous free tier, simple HTTP API, good deliverability |
| Domain auth | SPF + DKIM + DMARC via Resend's DNS lines | Mandatory for Gmail/Outlook to not filter as spam |
| Storage | Supabase tables: `email_drafts`, `email_queue`, `email_events`, `unsubscribes` | Same DB, same RLS pattern |
| Trigger logic | Supabase pg_cron + a Node API route | No new infra |
| Approval UI | New `/dashboard/admin/email-queue` page | Two checkboxes per draft (Chetan + Amandeep), each gated by `auth.uid()` matching that admin's user_id |
| Reply tracking | Resend reply-to webhooks | Replies go to a real inbox |
| Unsubscribe link | Token-based at `/unsubscribe/[token]` | One click; updates `user_profiles.unsubscribed_at` |

## Schema sketch

```sql
create table email_drafts (
  id uuid primary key,
  campaign text,        -- 'welcome', 'onboarding', etc.
  subject text,
  body_html text,
  body_text text,
  trigger_logic jsonb,  -- { delay_after_signup_hours, condition_sql }
  chetan_approved_at timestamptz,
  amandeep_approved_at timestamptz,
  created_at timestamptz default now()
);
create table email_queue (
  id uuid primary key,
  draft_id uuid references email_drafts(id),
  user_id uuid references user_profiles(id),
  scheduled_for timestamptz,
  sent_at timestamptz,
  status text  -- 'queued','sent','bounced','complained','suppressed'
);
create table email_events (
  id uuid primary key,
  queue_id uuid references email_queue(id),
  event text,  -- 'delivered','opened','clicked','bounced','complained'
  meta jsonb,
  occurred_at timestamptz default now()
);
```

## Metrics to watch

| Metric | Target | Reading window |
|---|---|---|
| Open rate (Email 1) | >50% (founder voice → high) | 48h |
| Click-through rate (Email 1) | >15% | 7d |
| Activation rate (≥1 MCQ within 7d of signup) | >40% | 7d |
| Founder Pro → paid conversion | >15% | 30d |
| Unsubscribe rate | <2% | per email |
| Spam complaint rate | <0.1% | per email |

## What we DON'T do (yet)

- No mass marketing emails until we have positive Email 1 + 2 reply signal.
- No re-engagement / win-back sequences until we see actual churn data.
- No promotional product launches via email until we have content credibility (the GEO articles).
- No third-party newsletter syndication.
- No purchasing or scraping email lists. Ever. Only users who signed up to the platform.

## Engineering effort estimate

| Phase | Effort | Notes |
|---|---|---|
| Phase 1: Resend domain auth + DNS records | 30 min | Mostly DNS waiting; you do this |
| Phase 2: Schema + admin queue page | 4 hr | One Supabase migration + one new admin route |
| Phase 3: Draft Email 1 (welcome) | 1 hr | I draft, you + Amandeep review |
| Phase 4: Send Email 1 to 5-user test batch | 30 min | Manual approve, watch Resend logs |
| Phase 5: Send to remaining 131 users | 30 min | After clean test batch |
| Phase 6: Emails 2-5 + automation | ~6 hr | Same pattern repeated, with triggers |

**Total to Email 1 sent**: ~6 hours of engineering plus one DNS wait window.

## What I need from you (Chetan + Amandeep)

1. **Approve this plan** as the overall shape (or amend it)
2. **Decide the from-addresses**: `chetan@mostlymedicine.com` and `amandeep@mostlymedicine.com` — confirm both work
3. **DNS setup**: 5-min task on the domain registrar to add Resend's SPF/DKIM/DMARC lines
4. **Verify Amandeep's user account on the platform**: she needs `role: admin` so the two-key approval has someone to assign
5. **Tone preference**: my draft Email 1 below is in Chetan's voice (founder, English with one Hinglish phrase). Amandeep can review, mark up, swap her own line in. Email 5 will be in her voice.

---

## Sample Email 1 — Welcome (DRAFT FOR REVIEW ONLY · DO NOT SEND)

```
Subject: Welcome to Mostly Medicine, {{first_name}} 👋

Hi {{first_name}},

Chetan here, founder of Mostly Medicine.

I built this platform after watching my wife, Dr Amandeep, prep for the
AMC. She passed CAT 1 and CAT 2, but the prep journey nearly broke her —
not because the exam is unbeatable, but because the tools she had access
to were ten years old, scattered across PDFs, and never simulated the
actual pressure of the AMC examiner.

Mostly Medicine is what we wished she'd had. Three things that are
genuinely different about it:

1. AMC MCQs are filterable by Australian-context tag — you can drill the
   PBS / eTG questions that international textbooks miss.
2. The AI Patient RolePlay simulates examiner pressure for CAT 2.
3. Peer RolePlay lets you practise with another IMG over live video.

You're Founder #{{founder_rank}}. Your Pro access is free until
{{founder_until}} — no card needed.

Quickest 15 minutes you can spend today: pick one topic, do an MCQ
session, see your weakest area. The platform tells you exactly what
to drill next.

→ Start your first MCQ session: https://mostlymedicine.com/dashboard/cat1

If anything's broken, confusing, or could be better — just hit reply.
This email goes to my real inbox.

Bahut shukriya for being early. Whatever happens next, you have
30 days of full Pro to make this thing useful.

Chetan

PS — Amandeep will write to you in a few weeks asking what worked and
what didn't. She reads every reply.

—

Mostly Medicine · mostlymedicine.com
You're getting this because you signed up at mostlymedicine.com.
Unsubscribe in one click: {{unsubscribe_url}}
```

---

**Status of this plan**: Draft. Awaiting your + Amandeep's review. Reply with edits, or "go ahead with phase 1" to start.
