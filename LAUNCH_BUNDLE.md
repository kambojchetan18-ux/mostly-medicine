# Mostly Medicine · Launch Bundle (LinkedIn + Instagram only)

**Launch:** Tomorrow · https://mostlymedicine.com
**Founders:** Chetan Kamboj (engineer · solo founder · Sydney) + Dr Amandeep Kamboj (medical co-founder · just passed AMC, currently in Gurugram doing clinical recency)
**Spine:** Product-led launch. The anniversary is private. Posts focus on the IMG problem, what we built, what's live, and what's coming. Honest day-1 tone. No wedding photos, no anniversary emojis, no love-letter copy.

---

## 1 · Pre-launch checklist (compressed)

### Tonight
- [ ] Tag git: `release/launch-2026-04-29`
- [ ] Smoke-test homepage on mobile Chrome + iOS Safari
- [ ] Confirm Vercel env vars: `CLOUDFLARE_TURN_KEY_ID`, `CLOUDFLARE_TURN_API_TOKEN`, `GROQ_API_KEY` are visible at runtime — hit `https://mostlymedicine.com/api/health/env` and check all three say `true`. If any `false` → Vercel Redeploy with build cache UNCHECKED
- [ ] Take 2-3 product screenshots for posts: AMC MCQ session · AMC Handbook AI RolePlay mid-consult · examiner feedback page

### Tomorrow morning
- [ ] **Stripe decision:** stay test mode + waitlist (default) OR flip live keys (only if all 4 prices configured + webhook signed + $1 test charge succeeds). Default to test mode — anniversary is not a deadline for payments.
- [ ] Pre-load all post copy as drafts in Notion / Apple Notes · do not free-type into LinkedIn
- [ ] Schedule company-page LinkedIn post for **6 pm AEST** (peak IMG-in-AU + India morning)

### Launch (6 pm AEST · 2:30 pm IST)
1. Mostly Medicine **company-page** LinkedIn post first
2. +30 min → **Chetan's** personal LinkedIn post
3. +30 min → **Amandeep's** personal LinkedIn post
4. Then **Instagram carousel** + **Reel**
5. DMs in batches of 10 over the first 2 hours

### Post-launch
- [ ] Reply to every comment within 30 min
- [ ] First metrics check at midnight: signups, post impressions, traffic source

---

## 2 · LinkedIn posts

### 2a · Chetan's personal post (~280 words)

> Today I'm launching something I've been quietly building for three years.

**Mostly Medicine** · mostlymedicine.com.

It's an AI-powered preparation platform for International Medical Graduates sitting the Australian Medical Council exams.

I'm not a doctor. My wife and co-founder Dr Amandeep Kamboj is — she just passed her AMC and is now doing clinical recency in India. She lived the journey: the MCQ banks that don't adapt to your weak topics · the clinical scenarios you can't really roleplay because a study partner doesn't know the rubric · the loneliness of preparing for an exam that decides your career in a country you haven't even moved to yet.

She wrote the clinical brain — every scenario, every reference, every examiner-grade rubric. I wrote the platform around it. Solo. Next.js, Supabase, Stripe, Anthropic Claude. Three years.

What's live today:
· **AMC MCQ** — 3 000+ questions · spaced repetition · weak-area targeting
· **AMC Handbook AI RolePlay** — 151 official MCAT scenarios · the AI plays the patient by voice for the full 8 minutes · examiner-grade feedback after
· **AMC Clinical AI RolePlay** — unlimited AI-generated cases beyond the handbook
· **AMC Peer RolePlay** — live 2-player video roleplay (early access)
· Library · Reference (Murtagh · RACGP Red Book · AMC Handbook 2026) · Australian Jobs hub

This is day 1. Pro launches this week. The real product will be shaped by the first 100 users, not by us.

If you know an IMG sitting the AMC, **tag them below**. **First 100 signups get lifetime founders' Pro** — free, forever.

mostlymedicine.com · free to start · no credit card.

#IMG #AMC #AustralianMedicalCouncil #InternationalMedicalGraduate

---

### 2b · Amandeep's personal post (~290 words)

> I just passed my AMC. Here's what I wish I'd had — and what we just launched.

I am Dr Amandeep Kamboj. I am an IMG. I have lived this pathway. Foreign degree, paperwork, English tests, MCQ exam, clinical exam, all of it. I just finished my exams and I am now doing clinical recency in India before moving back to Sydney.

Two things really got me during prep:

**The MCQ banks don't think.** You buy 5 000 questions, you grind through them, and at the end you have no idea where your weakness actually is. The dashboard shows a percentage. It does not show that you keep missing endocrine emergencies, or that your obstetric flags are 40 % off, or that you have memorised Murtagh's headache chapter without ever touching pulmonary embolism.

**The clinical scenarios are impossible to practise.** You roleplay with a friend. Your friend reads the case. Your friend is not the patient. Your friend cannot give you examiner-grade feedback. You finish the 8 minutes feeling vaguely good, and then you walk into the real exam and discover everything you missed.

So my husband and co-founder, Chetan, spent the last three years quietly building **Mostly Medicine** — mostlymedicine.com.

· **AMC MCQ** that adapts to your weak topics
· **AMC Handbook AI RolePlay** — AI plays the patient by voice, examiner feedback after
· **AMC Clinical AI RolePlay** — unlimited cases beyond the handbook
· **AMC Peer RolePlay** — practise with a real partner (early access)
· Library · Reference shelf · Jobs hub for the AU pathway

This is the platform I wish I'd had. It now exists for the IMG coming after me.

**Tag the IMG in your life** — the first 100 of you get lifetime founders' Pro.

mostlymedicine.com.

#IMG #AMCExam #IMGAustralia #InternationalMedicalGraduate

---

### 2c · Mostly Medicine company-page post (~190 words)

> Today, Mostly Medicine goes live. mostlymedicine.com.

Built over three years by a software engineer and an IMG doctor who has just passed her AMC.

For International Medical Graduates preparing for the Australian Medical Council pathway:

· **AMC MCQ** — 3 000+ questions · spaced repetition · weak-area targeting
· **AMC Handbook AI RolePlay** — 151 official MCAT scenarios · AI patient, voice-driven · examiner-grade feedback
· **AMC Clinical AI RolePlay** — unlimited AI-generated cases beyond the handbook
· **AMC Peer RolePlay** — live 2-player video roleplay (early access)
· **Library** — AI-powered notes search · upload your own material
· **Reference** — Murtagh · RACGP Red Book · AMC Handbook 2026
· **Australian Jobs** — RMO pools · GP pathway · application tracker

Free to start · no credit card · cancel anytime.

Aligned with AMC Handbook 2026 · powered by Claude AI.

This is day 1. Pro launches this week. Every feature was built by two people who actually live this exam — one wrote the clinical brain, the other wrote the code.

Try it · mostlymedicine.com.

#IMG #AMC #MedicalEducation

---

## 3 · Instagram

### 3a · Carousel · 6 slides

**Slide 1 — Hook · text on cream**
"3 years.
Built for every IMG sitting the AMC.
Today it's live."

**Slide 2 — The problem · text on cream**
"The MCQ banks don't adapt to your weak topics.
The clinical scenarios are impossible to roleplay with a friend who doesn't know the rubric.
That's what we set out to fix."

**Slide 3 — AMC MCQ feature card**
Screenshot of the MCQ dashboard. Overlay: "3 000+ MCQs · spaced repetition · weak-area targeting · free 20 a day."

**Slide 4 — AMC Handbook AI RolePlay feature card**
Screenshot mid-consultation, AI patient line visible. Overlay: "151 official MCAT scenarios · AI plays the patient · 8-minute voice consult · examiner feedback."

**Slide 5 — Differentiator · text on cream**
"Other banks give you questions.
We give you a patient who talks back."

**Slide 6 — CTA · text on cream**
"mostlymedicine.com
free to start · no credit card
First 100 signups · lifetime founders' Pro"

**Carousel caption:**
> Mostly Medicine is live · AI-powered AMC exam prep for International Medical Graduates · mostlymedicine.com.
>
> 3 000+ MCQs that adapt to your weak topics · 151 AMC Handbook scenarios with an AI patient who talks back · examiner-grade feedback · live peer roleplay (early access) · reference shelf · Australian jobs hub.
>
> Built by a software engineer and an IMG doctor who just passed her AMC. Day 1 today · Pro this week · the first 100 signups get lifetime founders' Pro.
>
> Tag the IMG in your life ↓
>
> #IMG #AMC #IMGAustralia #IndianDoctor #AMCExam #InternationalMedicalGraduate #MedicalEducation #DoctorsOfInstagram

---

### 3b · Reel script · 60 s · product-led, no anniversary scenes

**0–4 s · Hook · screen recording of homepage**
Big text overlay: "AI prep for the AMC."  Voiceover (Chetan): "If you're an IMG sitting the AMC, this might change how you study."

**4–18 s · The problem · B-roll**
Hands flipping a textbook · MCQ bank dashboard with static percentages · a phone showing a study group's awkward roleplay screenshot.
Voiceover: "MCQ banks that don't adapt. Clinical scenarios you can't really practise. We've all been through it."

**18–42 s · The product demo · screen recording**
- AMC MCQ session opening · weak-area targeting visible · 4 s
- AMC Handbook AI RolePlay · pick a scenario · 2-min reading screen · 6 s
- Voice consult begins · AI patient says first line aloud (subtitle): "Doctor, I've had this chest pain since last night and I'm really worried." · 8 s
- Examiner feedback page · score breakdown · 6 s

**42–55 s · What's live**
Text overlay grid: "AMC MCQ · AMC Handbook AI RolePlay · AMC Clinical AI RolePlay · AMC Peer RolePlay (early access) · Library · Reference · Jobs hub"
Voiceover: "Day 1 today. Pro launches this week. First 100 signups get lifetime Pro."

**55–60 s · CTA**
Big text: "mostlymedicine.com · free to start"  Subtle small text below: "Built by Chetan Kamboj + Dr Amandeep Kamboj"

**Reel caption:**
> Mostly Medicine is live · AI exam prep for IMGs sitting the AMC · mostlymedicine.com. Comment "AMC" and we'll DM the founders' link · first 100 get lifetime Pro.

**Audio:** Soft instrumental · royalty-free · no trending viral audio (clashes with the tone).

---

### 3c · Stories · 5 frames across the day

1. **8 am** — Homepage screenshot. Text: "Going live today."
2. **2 pm** — Screen recording of the AMC Handbook AI RolePlay session, AI patient speaking aloud. Text: "The patient AI talks back."
3. **6 pm (LIVE)** — Homepage with a "Launched" stamp · tap-link to mostlymedicine.com. Text: "We're live."
4. **8 pm** — Repost the carousel · "First 100 signups get lifetime Pro."
5. **10 pm** — Single screenshot of MCQ dashboard with first signup numbers visible. Text: "Day 1 · thank you for showing up." Q+A sticker: "Ask us anything about the build."

---

## 4 · Hashtag bank

### LinkedIn (10)
`#IMG` `#AMC` `#AustralianMedicalCouncil` `#InternationalMedicalGraduate` `#MedicalEducation` `#HealthTech` `#SoloFounder` `#Anthropic` `#NextJS` `#StartupIndia`

### Instagram (25)
`#IMG` `#AMC` `#AMCExam` `#AMCMCQ` `#AMCClinical` `#IMGAustralia` `#IMGDoctor` `#InternationalMedicalGraduate` `#IndianDoctor` `#PakistaniDoctor` `#SriLankanDoctor` `#FilipinoDoctor` `#MedicalRegistration` `#AustraliaJobs` `#RMO` `#GPRegistrar` `#MurtaghGP` `#RACGP` `#FutureDoctor` `#DoctorsOfInstagram` `#WomenInMedicine` `#HealthcareInnovation` `#AIInMedicine` `#MedTwitter` `#MostlyMedicine`

---

## 5 · 24-hour engagement playbook

### 5a · Communities to seed

| # | Community | How to seed |
|---|---|---|
| 1 | r/IMGreddit | Long-form launch post · disclose Chetan is the founder · 50 of the founders'-Pro spots reserved for subreddit members. Title: "We just launched mostlymedicine.com — AI exam prep for IMGs sitting the AMC" |
| 2 | r/ausjdocs | One launch comment in a relevant weekly thread · do not spam |
| 3 | AMC MCQ Examination Preparation Group · Facebook | Amandeep posts · doctor-to-doctor angle |
| 4 | AMC Clinical Examination Australia · Facebook | Same · Amandeep posts · lead with the AI patient roleplay differentiator |
| 5 | IMG Doctors in Australia · Facebook | Mod-approved post · screenshot of one scenario as proof |
| 6 | Indian Doctors in Australia (IDIA) | DM admin · ask for one-time pinned share · founders'-Pro spots offered |
| 7 | AMC Aspirants WhatsApp groups | Drop a one-line + link · "launching today, free tier fully working, Pro this week" |

> **Rule:** Amandeep posts in medical communities (doctors trust doctors). Chetan posts in tech/founder communities (Indie Hackers, r/SideProject, *Show HN*).

### 5b · DM templates

**Tech network DM (English):**
> Today I'm launching the thing I've been quietly building for 3 years — mostlymedicine.com. AI exam prep for IMGs sitting the AMC. Free tier fully works · would mean a lot if you could try it and share with anyone you know in healthcare. First 100 signups get lifetime Pro.

**Medical network DM (Hinglish):**
> Hi __, mai aur Chetan ne mostlymedicine.com launch kiya hai aaj — AMC IMGs ke liye AI patient roleplay, MCQ jo weak topics target karta hai, examiner-grade feedback. Agar aapke circle mein koi AMC ki taiyari kar raha hai, please share. Pehle 100 signups ko lifetime free Pro mil raha hai.

### 5c · Comment-bait reply matrix

| Common comment | Reply |
|---|---|
| "Is this just another MCQ bank?" | "Fair question. The MCQs are 1 of 7 modules. The differentiator is the AI patient — you actually do the 8-minute consult by voice and get examiner-grade feedback. None of the MCQ banks have that. Try the free tier and tell me if it feels different." |
| "How is this different from PassAMCQ / AceAMCQ / Melbourne Q-Bank?" | "Those are excellent MCQ banks. Where we go further: AI-driven patient roleplay (voice, 8-min, examiner rubric), live peer practice with another candidate, and AI-generated cases beyond the official handbook so you don't run out of variety." |
| "How accurate is the AI examiner?" | "Built on Anthropic Claude with the AMC Handbook 2026 rubric in the prompt. Every scenario was reviewed by my co-founder Dr Amandeep Kamboj. Day 1 — we'll improve fast based on user feedback." |
| "Is the data safe?" | "Yes. Supabase with row-level security. Your sessions are private to your account. We don't train models on user data." |
| "Where's the mobile app?" | "Web works perfectly on mobile browsers right now. Native app drops next week after the next backend update." |
| "Stripe didn't work / payment failed" | "Pro launches this week — free tier is wide open until then. Drop your email at /waitlist and you'll qualify for lifetime founders' Pro." |

---

## 6 · Risk callouts · what NOT to say tomorrow

- **Do not** claim Stripe is live unless you've test-charged successfully · fallback message on every CTA: *"Pro launches this week · join the waitlist."*
- **Do not** promise AMC Peer RolePlay works perfectly · frame as **early access**.
- **Do not** advertise the native APK · the mobile build is behind on the STT migration · point all mobile traffic to mostlymedicine.com.
- **Do not** name competitors negatively · say "we go further with AI patient roleplay" not "PassAMCQ is just a static bank".
- **Do not** claim AMC, AHPRA, or any official endorsement · use **"aligned with AMC Handbook 2026"** — the existing approved phrasing.
- **Do not** quote pass-rate guarantees · we have no longitudinal data yet.
- **Do not** lead with the anniversary · keep it private. The launch story is the **product** and the **IMG problem we solved**, not our wedding date.
- **Do not** publish AI-generated patient images that look like real people.
- **Do not** leave comment threads unattended for more than 30 min on launch day.

---

*Bundle ends here · prepared 2026-04-28 for launch on 2026-04-29.*
