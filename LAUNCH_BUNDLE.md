# Mostly Medicine · Anniversary Launch Bundle

**Launch date:** Tomorrow · 5-year wedding anniversary of Chetan Kamboj (founder/builder) and Dr Amandeep Kamboj (medical co-founder).
**URL:** https://mostlymedicine.com
**Spine of every post:** A husband-and-wife team — non-doctor solo dev + practising IMG doctor — shipping the platform Amandeep wished she had three years ago. Honest, vulnerable, ambitious. No salesy gloss.

---

## 1 · Pre-launch 24-hour checklist

> Acknowledged caveats: Stripe is in test mode · AMC Peer RolePlay is being stabilized today · native APK is behind on the STT migration. The plan is **launch on free tier + waitlist Pro/Enterprise**, not a hard paywall flip.

### T-24h (tonight, ~9 pm)
- [ ] Snapshot current Supabase prod DB · keep the dump locally + in encrypted drive
- [ ] Tag git: `release/anniversary-2026-04-29` · this is the rollback anchor
- [ ] Smoke-test homepage on mobile Chrome, iOS Safari, desktop · check above-the-fold copy renders
- [ ] Confirm `NEXT_PUBLIC_SITE_URL` and OG image are correct in Vercel prod
- [ ] Take the anniversary photo (today, in good light) · two versions: warm/candid + clean/portrait. Need this for slide 1, hero post, and reel cover
- [ ] Draft all post copy into Notion / Apple Notes · do not free-type into LinkedIn tomorrow

### T-18h (tonight, ~3 am if up)
- [ ] Cloudflare TURN smoke test for AMC Peer RolePlay · run a 2-device call between Chetan's laptop and Amandeep's phone · confirm Whisper STT transcript appears on both ends
- [ ] If Peer RolePlay is still flaky, gate the feature behind `NEXT_PUBLIC_FEATURE_PEER_ROLEPLAY=waitlist` · show "Early access · join waitlist" instead of "Start session"
- [ ] Fix one small thing only · do not refactor. The launch is the deadline

### T-12h (tomorrow morning, ~7 am)
- [ ] **Stripe decision point.** Two options:
  - (a) **Stay test mode** · "Pro launches this week" framing on every CTA · waitlist form goes to Supabase `pro_waitlist` table · email capture only
  - (b) **Flip to live keys** · only if (i) all four price IDs created in live mode (ii) webhook signing secret rotated to live (iii) one real $1 test charge succeeds and refunds cleanly. If any of these are not green, default to (a).
- [ ] Update `STRIPE_GO_LIVE.md` with whichever path you chose · timestamp it
- [ ] Verify free-tier signup end-to-end · email + Google · daily MCQ limit resets · session creation works
- [ ] Check Supabase RLS one more time on `user_profiles` (recursion fix is in place — confirm `is_user_admin()` exists)

### T-6h (tomorrow noon)
- [ ] Schedule company-page LinkedIn post for 6 pm AEST (peak IMG-in-Australia engagement window · catches India morning + Australia evening · 2:30 pm IST)
- [ ] Pre-load Chetan's and Amandeep's personal posts as drafts · publish manually 30 min apart
- [ ] Pin the launch tweet/post · update LinkedIn banner to anniversary-launch art
- [ ] First 100 founders' lifetime Pro · create a Supabase view `founders_100` keyed off `users.created_at` so we can honour the offer when Stripe goes live
- [ ] DM list ready · 30 closest contacts split between Chetan (tech) and Amandeep (medical) · one-line warm message each (no copy-paste tells)

### T-2h
- [ ] One last full-flow test: cold incognito → land on home → sign up free → start an AMC MCQ session → start an AMC Handbook AI RolePlay scenario → screenshot each step. These screenshots are your "real product" proof if anyone asks
- [ ] Mobile camera ready for live story frames · battery > 80%
- [ ] Tea ready · breathe

### T-0 (launch · 6 pm AEST · 2:30 pm IST)
- [ ] Company page goes first
- [ ] 30 min later · Chetan's personal post
- [ ] 30 min after that · Amandeep's personal post
- [ ] Then Instagram carousel · then story frame 1
- [ ] DMs go out in batches of 10 over the first 2 hours

### T+6h
- [ ] Reply to every comment within 30 min · no canned answers
- [ ] First metrics check at midnight: signups, post impressions, where traffic came from
- [ ] If a post takes off, pin it and run a small comment-bait reply to keep it alive

---

## 2 · LinkedIn posts

### 2a · Chetan's personal post (≈ 360 words)

> Today is our 5-year wedding anniversary.

I have never written a post like this, so I am going to keep it honest.

Five years ago I married Dr Amandeep Kamboj. She is the doctor. I am the engineer. For the last three years, between her hospital shifts and my late-night terminals, we have been building something together — and today we are putting it out into the world.

It is called **Mostly Medicine**. mostlymedicine.com.

It is an AI-powered preparation platform for International Medical Graduates sitting the Australian Medical Council exams. AMC MCQ. AMC Handbook AI RolePlay. AMC Clinical AI RolePlay. AMC Peer RolePlay. A study library. A reference shelf with Murtagh and the RACGP Red Book. A jobs hub for the AU pathway.

I am not a doctor. I had no business building this. But every IMG dinner-table conversation in our house was the same — the MCQ banks that don't adapt to your weak topics · the clinical scenarios you can't really roleplay because your study partner does not know the rubric · the loneliness of preparing for an exam that decides your career in a country you have just moved to.

So three years ago I started writing code. Amandeep wrote the clinical brain — every scenario, every reference, every examiner-grade rubric. I wrote the platform around it. Next.js, Supabase, Stripe, Anthropic Claude. Every line. Solo.

This is not a perfect launch. We are starting on the free tier. Pro launches this week. Peer roleplay is in early access. The real progress will happen with our first 100 users, not in our heads.

But it is real. And it works. And after three years, that is enough to ship.

To Amandeep — every feature in this app is a love letter. I could not have built it without you, and there was no one else I wanted to build it for. Happy anniversary.

If you know an IMG sitting the AMC, **tag them below**. The first 100 signups get **lifetime founders' Pro** — free, forever, the moment we flip the switch.

mostlymedicine.com · free to start · no credit card.

#IMG #AMC #AustralianMedicalCouncil #SoloFounder

---

### 2b · Amandeep's personal post (≈ 350 words)

> Five years ago today I married my favourite person in the world.

Today, that same person is launching something he built for me — and for every IMG who has ever felt like the AMC pathway was designed to be lonely.

I am Dr Amandeep Kamboj. I am an IMG. I have lived this journey. Foreign medical degree, paperwork, English tests, MCQ exam, clinical exam, hospital pool applications, all of it. So I know exactly what is broken about how we currently prepare.

Two things in particular always got me:

**The MCQ banks don't think.** You buy 5 000 questions, you grind through them, and at the end you have no idea where your weakness actually is. The dashboard shows a percentage. It does not show that you keep missing endocrine emergencies, or that your obstetric flags are 40 % off, or that you have memorised Murtagh's headache chapter without ever touching pulmonary embolism.

**The clinical exam scenarios are impossible to practise.** You roleplay with a friend. Your friend reads the case. Your friend is not the patient. Your friend cannot give you examiner-grade feedback. You finish the 8 minutes feeling vaguely good, and then you walk into the real exam and discover everything you missed.

**Mostly Medicine** is the platform I wish I had had.
- AMC MCQ that adapts to your weak topics with spaced repetition
- AMC Handbook AI RolePlay — the AI plays the patient, in voice, for the full 8 minutes, and gives you examiner-grade feedback after
- AMC Clinical AI RolePlay — unlimited AI-generated cases beyond the handbook
- AMC Peer RolePlay — practise live with another candidate (early access)
- A reference shelf, a study library, a jobs hub

To Chetan — the love of my life and the engineer behind every feature — happy anniversary. You have built something that will quietly change a lot of lives.

To every IMG reading this: you deserve better tools. **Tag the IMG in your life** — the first 100 of you get lifetime founders' Pro.

mostlymedicine.com.

#IMG #AMCExam #IMGAustralia #InternationalMedicalGraduate

---

### 2c · Mostly Medicine company page (≈ 195 words)

> Today, Mostly Medicine goes live. mostlymedicine.com.

Built over three years by a husband-and-wife team — a software engineer and an IMG doctor — and launching on their 5-year wedding anniversary.

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

This is day 1. Pro launches this week. Every feature was built by two people who actually live this exam — one writes the clinical brain, the other writes the code.

Try it · mostlymedicine.com.

#IMG #AMC #MedicalEducation

---

## 3 · Instagram bundle

### 3a · Carousel · 8 slides

**Slide 1 — Anniversary photo (warm, candid)**
Overlay text: "5 years married. Today we launch."
Caption strip below: "Mostly Medicine · for every IMG sitting the AMC."

**Slide 2 — Two-portrait split**
Left: Chetan at laptop · Right: Amandeep in scrubs/coat
Overlay: "He writes the code. She writes the clinical brain."

**Slide 3 — The why · text-only on cream background**
"3 years ago, every dinner table conversation in our house ended with the same sentence: *'The tools for IMGs are broken.'*  So we built better ones."

**Slide 4 — AMC MCQ feature card**
Screenshot of the MCQ dashboard.
Overlay: "3 000+ MCQs · spaced repetition · weak-area targeting · free 20 a day."

**Slide 5 — AMC Handbook AI RolePlay feature card**
Screenshot mid-consultation, AI patient line visible.
Overlay: "151 official MCAT scenarios · AI plays the patient · 8-minute voice consult · examiner feedback."

**Slide 6 — Differentiator slide · text-only**
"Other banks give you questions.
We give you a patient who talks back."

**Slide 7 — Founder offer**
Bold typography: "First 100 signups · lifetime founders' Pro · free, forever."

**Slide 8 — CTA**
"mostlymedicine.com · free to start · no credit card. *Tag the IMG in your life ↓*"

**Carousel caption (single block — Hinglish allowed):**
> 5 saal pehle aaj ke din humne shaadi ki. Aaj humne Mostly Medicine launch kiya — every IMG ke liye jo AMC ki taiyari kar raha hai. Three years of late-night code · Amandeep's clinical brain · Chetan's terminal. Ek hi ghar mein doctor aur engineer mile, toh yeh ban gaya.
>
> 3 000+ MCQs · 151 MCAT scenarios · AI patient roleplay · examiner feedback · live peer practice (early access).
>
> Pehle 100 signups ko lifetime founders' Pro — free, forever.
>
> Link in bio · mostlymedicine.com · tag the IMG in your life ↓
>
> #IMG #AMC #IMGAustralia #IndianDoctor #AMCExam

---

### 3b · Reel script (75 s)

**0–3 s · Hook**
Tight close-up on Amandeep's face, voiceover: *"My husband is not a doctor. He spent three years building me an AI for my exam."*  Cut.

**3–10 s · Anniversary tie-in**
Wide shot of the two of them, anniversary candle/cake on table. Text overlay: "5 years married · today we launch."  Soft music.

**10–25 s · The problem (Amandeep speaking, B-roll cuts)**
Voiceover (Amandeep): "Every IMG who has sat the AMC knows this. The MCQ banks don't adapt. The clinical scenarios — you can't really roleplay them with a friend who doesn't know the rubric."
B-roll: hands flipping Murtagh, a friend awkwardly reading from a phone, frustrated study desk shot.

**25–40 s · The build (Chetan speaking, B-roll cuts)**
Voiceover (Chetan): "So I started writing code three years ago. Next.js. Supabase. Anthropic Claude. Every line, alone, between her hospital shifts and my day job. She wrote the clinical brain. I wrote the platform around it."
B-roll: code editor, terminal, late-night desk, a coffee mug going cold.

**40–60 s · Demo · the patient AI talks**
Screen recording of AMC Handbook AI RolePlay session opening · 2-min reading screen · then voice activates · AI patient says first line out loud (e.g. "Doctor, I've had this chest pain since last night and I'm really worried"). Big captions.
Text overlay: "AI plays the patient. You do the consult. Examiner-grade feedback after."

**60–72 s · Anniversary close-up**
Both in frame. Amandeep: "Happy anniversary, baby."  Chetan: "Happy anniversary. We finally shipped it."  They clink mugs.
Text overlay: "Mostly Medicine · for every IMG sitting the AMC."

**72–75 s · CTA card**
"mostlymedicine.com · free to start · first 100 signups get lifetime founders' Pro."

**Reel caption:**
> Three years of code · one IMG doctor · one solo engineer · today is our 5-year anniversary and Mostly Medicine is live. Comment "AMC" and we'll DM the founders' link · first 100 get lifetime Pro.

**Audio:** Soft acoustic + light Hindi instrumental layer (royalty-free). Avoid trending viral audio — clashes with the tone.

---

### 3c · Story sequence · 10 frames across the day

1. **7 am** — Anniversary morning. Photo of two coffee mugs. "5 saal. Iss ghar mein doctor aur engineer rehte hain."
2. **9 am** — Throwback wedding photo. "5 years ago today."
3. **11 am** — Behind-the-scenes shot of Chetan's laptop with VS Code open on the Mostly Medicine repo. Text: "What I've been building since 2023."
4. **1 pm** — Amandeep in scrubs at home, smiling. Text: "Every scenario · every rubric · written by her."
5. **3 pm** — Teaser screen of mostlymedicine.com homepage. Text: "Going live in 3 hours."
6. **5 pm** — Countdown sticker · 1 hour to launch.
7. **6 pm** — **LIVE** — homepage screenshot · big "Launched" stamp · tap-link to mostlymedicine.com.
8. **7 pm** — Screen recording of an AMC Handbook AI RolePlay session, AI patient speaking aloud. Text: "The AI talks back."
9. **9 pm** — Repost the carousel · "Founders' offer · first 100 get lifetime Pro."
10. **11 pm** — Selfie of the two of them, tired and smiling. Text: "Day 1 done. Thank you for showing up." Q+A sticker: "Ask us anything about the build."

---

## 4 · YouTube bundle

### 4a · Long-form launch video (8 min)

**Title (≤ 70 chars):** I Built My Doctor Wife an AI for Her Exam · 3 Years · Solo

**Thumbnail copy:**
- Big text: "BUILT FOR MY WIFE"
- Sub-text: "3 years. Solo. AI for the AMC."
- Visual: Chetan + Amandeep split with a laptop screen between them showing the AI roleplay

**Hook (0:00–0:15)**
Chetan, direct to camera: "Three years ago my wife — who is a doctor — told me the tools for her exam were broken. So I started writing code. Today is our 5-year anniversary and this is the day I finally show her what I built."  Cut to logo.

**Act 1 · The problem (0:15–2:00)**
Amandeep on camera explaining the IMG journey · the MCQ grind · the impossible clinical roleplay · the Australian-specific knowledge gap · the loneliness of the pathway. Use real screenshots of competitor MCQ banks (blurred logos) showing static dashboards.

**Act 2 · The build (2:00–4:30)**
Chetan walks through what he built and how. Stack reveal at 2:30 (Next.js · Supabase · Anthropic Claude · Stripe · Cloudflare TURN). Scrolling git history. A timeline graphic of the 3-year build. Personal moments — kitchen-table whiteboarding sessions with Amandeep. Be honest about the parts that broke. Mention Stripe is going live this week and Peer RolePlay is in early access.

**Act 3 · The demo (4:30–6:30)**
Screen recording of the platform.
- 4:30 · AMC MCQ — start a session, weak-area targeting in action
- 5:15 · AMC Handbook AI RolePlay — pick a scenario, 2-min reading screen, then voice consult, then examiner feedback page
- 6:00 · AMC Clinical AI RolePlay — generate a fresh case
- 6:15 · Library + Reference + Jobs hub · 5-second flash each

**Close (6:30–7:30)**
Both founders on camera. Anniversary moment. The "first 100 lifetime Pro" offer. Honest about being day 1.

**CTA (7:30–8:00)**
"mostlymedicine.com · link in description · subscribe for the weekly build log · tag an IMG in the comments."

**Description (paste-ready):**
> Mostly Medicine is live · mostlymedicine.com.
> Built over three years by Chetan Kamboj (engineer · solo founder) and Dr Amandeep Kamboj (IMG doctor · clinical co-founder), launched on their 5-year wedding anniversary.
> AMC MCQ · AMC Handbook AI RolePlay · AMC Clinical AI RolePlay · AMC Peer RolePlay (early access) · Library · Reference · Jobs hub.
> First 100 signups get lifetime founders' Pro.
> Chapters:
> 0:00 The hook
> 0:15 The problem with current AMC prep
> 2:00 The 3-year build
> 4:30 Live demo
> 6:30 Why we launched today
> 7:30 How to get founders' Pro

---

### 4b · Three YouTube Shorts (60 s each)

**Short A · "I built my doctor-wife an AI for her exam"**
Hook (0–3 s): Chetan to camera — "My wife is a doctor. I'm not. She told me her exam prep tools were broken, so I spent three years building her better ones. Today is our 5-year anniversary."
Mid (3–45 s): rapid-fire screen flashes — MCQ dashboard · scenario list · AI patient · examiner feedback page · 5-second each, captions on every cut.
Close (45–60 s): "mostlymedicine.com · free to start · first 100 signups get lifetime Pro · tag an IMG."

**Short B · "The patient AI talks"**
Hook (0–3 s): Black screen, audio only — AI patient voice: *"Doctor, I've had this chest pain since last night and I'm really worried."*  Caption: "This is an AI."
Mid (3–45 s): Screen recording — start the scenario · 2-min reading · voice consult begins · examiner feedback rolls in. No talking head, just product.
Close (45–60 s): "AMC Handbook AI RolePlay · 151 scenarios · examiner-grade feedback · mostlymedicine.com."

**Short C · "The 5-year build, in 60 seconds"**
Hook (0–3 s): Wedding photo · then a 2023 desk shot · then a 2026 launch shot. Text: "5 years married · 3 years building · 1 launch day."
Mid (3–50 s): Whip-cut montage of the build journey · git commit count flashing up · Amandeep at the whiteboard · late-night coffee · first scenario passing examiner rubric · voice activation working · Cloudflare TURN smoke test · the day the homepage said "Ace the AMC."
Close (50–60 s): Both on camera, anniversary moment, "Happy anniversary. We shipped it. mostlymedicine.com."

---

## 5 · Hashtag bank

### LinkedIn (10 — restraint matters here)
`#IMG` `#AMC` `#AustralianMedicalCouncil` `#InternationalMedicalGraduate` `#MedicalEducation` `#HealthTech` `#SoloFounder` `#Anthropic` `#NextJS` `#StartupIndia`

### Instagram (30)
`#IMG` `#AMC` `#AMCExam` `#AMCMCQ` `#AMCClinical` `#IMGAustralia` `#IMGDoctor` `#InternationalMedicalGraduate` `#IndianDoctor` `#PakistaniDoctor` `#SriLankanDoctor` `#BangladeshiDoctor` `#FilipinoDoctor` `#MedicalRegistration` `#AustraliaJobs` `#RMO` `#GPRegistrar` `#MurtaghGP` `#RACGP` `#MedicalStudent` `#FutureDoctor` `#DoctorsOfInstagram` `#WomenInMedicine` `#MedTwitter` `#HealthcareInnovation` `#AIInMedicine` `#FoundersJourney` `#MadeWithClaude` `#StartupCouple` `#AnniversaryLaunch`

### YouTube (15)
`#IMG` `#AMC` `#AMCExam2026` `#AMCMCQ` `#AMCClinical` `#IMGAustralia` `#MedicalRegistrationAustralia` `#IndianDoctorsAbroad` `#AustralianHealthcare` `#MedicalEducation` `#HealthTechStartup` `#SoloFounder` `#AIRoleplay` `#MostlyMedicine` `#FoundersStory`

---

## 6 · First 24-hour engagement playbook

### 6a · Communities to seed (8)

| # | Community | Where | How to seed |
|---|---|---|---|
| 1 | **r/IMGreddit** | reddit.com/r/IMGreddit | Long-form launch post · lead with the personal anniversary story · disclose Chetan is the founder · offer 50 of the founders'-Pro spots to subreddit members. Title: *"After 3 years of solo coding for my IMG wife, we launched mostlymedicine.com today (our 5-year anniversary)"* |
| 2 | **r/medicalschool** (Australia threads) | reddit.com/r/medicalschool | Reply only to AMC-related threads · do not top-post · be useful first |
| 3 | **r/ausjdocs** | reddit.com/r/ausjdocs | One launch comment in a relevant weekly thread · do not spam |
| 4 | **AMC MCQ Examination Preparation Group** | Facebook · search "AMC MCQ Examination Preparation" | Post the carousel · Amandeep's account, not Chetan's. Doctors trust doctors. |
| 5 | **AMC Clinical Examination Australia** | Facebook · search "AMC Clinical Exam Preparation" | Same approach as #4 — Amandeep posts, leads with the clinical-roleplay pain point |
| 6 | **IMG Doctors in Australia** | Facebook private group · ~50k+ members | Mod-approved post · personal-tone · screenshot of one scenario as proof |
| 7 | **Indian Doctors in Australia (IDIA)** | Facebook + WhatsApp distribution | DM the admin · ask for a one-time pinned share · offer founders'-Pro spots |
| 8 | **AMC Aspirants WhatsApp groups** | Personal network · Amandeep has 4–5 of these from her own AMC days | Drop a one-line + link · "*launching today, free tier is fully working, Pro this week*" |

> **Rule of seeding:** Amandeep posts in medical communities. Chetan posts in tech/founder communities (Indie Hackers, r/SideProject, Hacker News *Show HN*, /r/microsaas, Pioneer). Different audiences, different angles, same product link.

### 6b · DM templates (two versions)

**Chetan's tech network · personal network DM**
> Bro, today is our 5-year anniversary and I'm finally launching the thing I've been quietly building for 3 years — mostlymedicine.com. AI exam prep for IMGs (my wife is one). Free tier fully works · would mean a lot if you could try the demo and share it with anyone you know prepping for the AMC. First 100 signups get lifetime Pro. No pressure if not relevant — just wanted you to see it before the rest of the internet did.

**Amandeep's medical network DM**
> Hi __, 5 saal ho gaye humari shaadi ko aaj. Chetan ne pichle 3 saal AMC IMGs ke liye ek tool banaya hai — mostlymedicine.com. AI patient roleplay, MCQ jo actually weak topics target karta hai, examiner-grade feedback. I helped with the clinical side. Agar aapke circle mein koi AMC ki taiyari kar raha hai, please share. Pehle 100 signups ko lifetime free Pro mil raha hai.

### 6c · Comment-bait + reply strategy

| Common comment | How to reply |
|---|---|
| *"Is this just another MCQ bank?"* | "Fair question. The MCQs are 1 of 7 modules. The differentiator is the AI patient — you actually do the 8-minute consult by voice and get examiner-grade feedback. None of the MCQ banks have that. Try the free tier and tell me if it feels different." |
| *"How is this different from PassAMCQ / AceAMCQ / Melbourne Q-Bank?"* | "Those are excellent MCQ banks. We respect them. Where we go further: AI-driven patient roleplay (voice, 8-min, examiner rubric), live peer practice with another candidate, and AI-generated cases beyond the official handbook so you don't run out of variety." |
| *"How accurate is the AI examiner?"* | "Built on Anthropic Claude with the AMC Handbook 2026 rubric in the prompt. Every scenario was reviewed by my co-founder Dr Amandeep Kamboj. We're not perfect on day 1 — we'll improve fast based on user feedback. Honest answer." |
| *"Is the data safe? My exam recalls etc"* | "Yes. Supabase with row-level security. Your sessions are private to your account. We don't train models on user data." |
| *"Where's the mobile app?"* | "Web works perfectly on mobile browsers right now. Native app is coming after we land the next backend update." |
| *"Stripe didn't work / payment failed"* | "Pro launches this week — we're keeping the free tier wide open until then. Drop your email at /waitlist and you'll be the first to upgrade (and qualify for lifetime founders' Pro)." |

### 6d · Influencer + micro-creator outreach (5)

1. **Dr Sanjay Saint / Dr Karan Raj-style AU IMG creators** — search YouTube for "AMC clinical exam tips" · find creators with 5–50k subs who post AMC content · DM with the founders' story angle and a free Enterprise account
2. **Dr Jovita Kumar (Instagram @doctor.jovita)** type — Indian-origin AU-practising doctor creators who post IMG advice · Amandeep DMs from her account, doctor-to-doctor
3. **IMG SOS (imgsos.com.au)** — established AMC prep brand. Pitch a co-promotion · their audience is exactly ours · positioning: complementary not competitive
4. **Geeky Medics (UK-based but huge AU IMG following)** — pitch a guest article or shared resource page about AMC roleplay practice
5. **LinkedIn micro-creators in AU healthcare** — search "AMC IMG" on LinkedIn · find people with 2–10k followers posting weekly · 5 personalised DMs per day for week 1 · offer free founder Pro + invite them to a behind-the-build conversation

---

## 7 · 7-day content calendar

| Day | LinkedIn | Instagram | YouTube / Shorts |
|---|---|---|---|
| **Day 1 · Launch** | All 3 anniversary posts (Chetan, Amandeep, company) | 8-slide carousel + 75 s reel + 10-frame story sequence | Long-form launch video + Short A ("I built my wife an AI") |
| **Day 2 · Demo deep dive** | Chetan: a single screenshot of AMC Handbook AI RolePlay mid-consult + 100 words on the technical challenge of voice-driven patient simulation | IG carousel · "5 things the AI patient does that a study partner can't" | Short B ("The patient AI talks") |
| **Day 3 · Amandeep's IMG journey** | Amandeep's 400-word post on her own AMC pathway · the moments that nearly broke her · what she'd tell a 2020-Amandeep | IG reel · Amandeep on-camera, 60 s, telling the same story · ending with the platform | Repurpose this into a 2-min YouTube video · "An IMG doctor's honest exam-prep story" |
| **Day 4 · Behind the build** | Chetan: technical post · the architecture · Anthropic Claude + Supabase + Cloudflare TURN · for the dev audience · expect lower IMG engagement, that's fine | IG stories: build-process screenshots · git commit graph · whiteboard photos | Short · 60 s code-screen montage with voiceover |
| **Day 5 · First testimonials** | Repost first 3 user comments / DMs (with permission) · "what users said in week 1" · keep it raw and screenshotted | IG carousel · 5 user quotes · cream background · simple typography | Short · text-on-screen of the best user quote with a 5-second product clip behind |
| **Day 6 · Metric reveal** | Chetan: transparent post · "1 week in: X signups · Y MCQs answered · Z scenarios completed · here's what surprised us." Numbers above all else. | IG single-image post · big numbers · same metrics | Long-form (5 min) · "1 week of running a launched product · what we got right and wrong" |
| **Day 7 · Pivot or double-down** | Look at the data and pick: if scenario module dominated → go all-in on AI RolePlay messaging. If MCQ dominated → lead with adaptive-MCQ next week. Announce direction. | IG carousel · the 1-week recap + week-ahead roadmap | Short · a 60 s "what's next" teaser of the most-requested feature |

---

## 8 · Risk callouts · what NOT to say tomorrow

- **Do not** claim Stripe is live unless you have flipped it and seen one real test charge succeed. The fallback message on every CTA: *"Pro launches this week · join the waitlist."*
- **Do not** promise AMC Peer RolePlay works perfectly. Frame it as **early access** · explicit phrase: *"early access · pre-orders for partner-mode are open."*
- **Do not** advertise the native APK. The mobile app is behind on the STT migration. Web works on mobile browsers · point all mobile traffic to `mostlymedicine.com`.
- **Do not** name competitors negatively. Say "we go further with AI patient roleplay" not "PassAMCQ is just a static bank."
- **Do not** claim AMC endorsement, AHPRA endorsement, or any official affiliation. Use "**aligned with AMC Handbook 2026**" — that is the existing approved phrasing.
- **Do not** claim 100 % accuracy on AI feedback. Use "examiner-grade feedback" — strong but honest. Also: "this is day 1, we will improve fast based on your feedback."
- **Do not** quote pass-rate guarantees. We have no longitudinal data yet. Wait until we do.
- **Do not** use medical jargon you cannot defend. Anything clinical in copy must pass Amandeep's review before it ships.
- **Do not** publish patient images, even AI-generated ones, that look like a real person.
- **Do not** leave the comment threads unattended for more than 30 min on launch day. Silence kills momentum.

---

## 9 · Email blast templates

### 9a · Short version (cold-warm contacts · 80 words)

**Subject:** Today is our 5-year anniversary · we shipped Mostly Medicine

> Hi __,
>
> Today is our 5-year wedding anniversary, and I'm finally launching what I've been quietly building for 3 years.
>
> **Mostly Medicine** — AI-powered AMC exam prep for International Medical Graduates. mostlymedicine.com.
>
> Free to start · no credit card · the first 100 signups get lifetime founders' Pro.
>
> If you know a doctor preparing for the AMC, forward this. That's the whole ask.
>
> Chetan + Amandeep

### 9b · Longer version (close friends + family · 220 words)

**Subject:** 5 years married · 3 years building · today we launch

> Hi __,
>
> Today Amandeep and I have been married 5 years.
>
> Three of those five years, between her hospital shifts and my late-night terminals, I have been quietly building a thing called **Mostly Medicine** — an AI-powered exam-prep platform for International Medical Graduates sitting the Australian Medical Council exams.
>
> Today, on our anniversary, it goes live · **mostlymedicine.com**.
>
> I am not a doctor. I had no business building this. But every dinner-table conversation in our house circled back to the same problem — the tools for IMG doctors are broken. The MCQ banks don't adapt. The clinical scenarios are impossible to roleplay with a friend who doesn't know the rubric. So three years ago I started writing code, and Amandeep wrote the clinical brain.
>
> What I'd love from you:
>
> 1) **Try it** — the free tier is fully working · sign up at mostlymedicine.com
> 2) **Forward this email** to anyone you know who is preparing for the AMC, or is in healthcare in Australia
> 3) **Reply** if you have feedback · I genuinely want to hear it
>
> First 100 signups get lifetime founders' Pro. After that, it's $19/month · $190/year.
>
> Thank you for being part of how we got here.
>
> Chetan + Amandeep
> mostlymedicine.com

---

*End of bundle · prepared 2026-04-28 for launch on 2026-04-29.*
