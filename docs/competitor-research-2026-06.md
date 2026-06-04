# Competitor Research — June 2026

Captured during the post-PR Mostly Medicine pricing relaunch (2026-06-04). Two research
sweeps were merged here:

1. **AMC / IMG-prep direct comp pricing sweep** (round 1)
2. **Neural Consult deep dive + adjacent AI-medical-ed round 2**

Use this as the source of truth for pricing decisions, feature gap analysis, and topic
roadmap discussions. Updated copy of this file overrides any earlier inline notes in
`STRIPE_GO_LIVE.md` or Slack threads.

---

## 1. AMC-specific direct competitors

| Competitor | Type | Annual (AUD) | Monthly (AUD) | AI / Voice? | Notes |
|---|---|---|---|---|---|
| **iatroX** | AI Q-bank | A$150 (US$99) | A$44 (US$29) | Yes — RAG NICE/CKS/SIGN/BNF + adaptive Q-bank | **Most direct AMC competitor**. Covers AMC CAT, RACGP AKT, RACP, ACEM. iOS+Android apps. 5,000+ Qs. |
| **PassGP / PassAMC** | AMC suite | not public (est. A$600–1,200) | not public | Yes — "AI Virtual Tutor" | Strongest AU IMG incumbent. Ex-AMC-examiner founder. 3,500 MCQs + 1,050 clinical cases + 7 mocks. "PassGP Promise" = 20% off forever until you pass. Claims 96.3% pass rate. |
| **GdayDoctor** | AMC OSCE + MCQ | not public | not public | Yes — voice AI patient sim, 13-domain AMC scoring | 130 OSCE stations. Direct OSCE/voice competitor. |
| **eMedici** | Q-bank | A$300 (12 mo) | A$70 | No AI | Official AMC partner (210 free Qs). 5,000+ MCQs + 240+ OSCE + 470+ cases. Strong brand authority, legacy UX. |
| **AMC Question Bank** | Q-bank | A$383 (sale) / A$560 list | A$107 sale / A$184 list | No | Money-back guarantee. Legacy text. |
| **AceAMCQ** | Q-bank bundle | n/a (6 mo A$460, 3 mo A$230) | — | No | Content-heavy. Price-aggressive bundles. |
| **PassAMCQ** | Q-bank | A$450 sale / A$700 list (12 mo) | A$150 (1 mo intense) | No | 1,600+ MCQs, mocks, analytics. Mid-tier AU brand. |
| **Amedex** | Q-bank | A$1,060 (US$690) | A$276 (US$180) | No | Premium-priced AU Q-bank. |
| **AMBOSS (AU)** | Global Q-bank + 40 OSCE | A$397 (US$259) | A$46 (US$30) | "AI features" (vague) | 4,400 AMC-aligned Qs + 15,000 topics. 5-day free trial. Big global brand. |
| **OSCELab (Auri)** | AI OSCE | A$199 (12 mo) | n/a (3 mo A$60, MCQ-only 12 mo A$60) | Yes — voice + text OSCE, live marksheet | AU-founded AI OSCE. Pass-or-extend guarantee. Most direct AU AI OSCE comp. |
| **OSCEmate** | AI OSCE | not public | not public | Yes — voice-to-voice AI patients, AMC-tuned | AU AMC-specific AI voice. Direct 1:1 feature comp. |
| **ARIMGSAS** | Live clinical course | A$4,045–A$4,495 (8-week) | — | No (live tutors) | Price ceiling for AU clinical content. |
| **Institute of Medical Education (IM500)** | Live AMC bundle | A$9,997 (one-time) | — | No | Top-end bootcamp. |
| **HEAL Australia** | Live AMC bridging | A$1,899 (12-week) | — | No | Mid-tier live bridging. |

### Round 1 takeaways

- AU AMC pricing range (text Q-bank, annual): **A$300 → A$1,060**, median ~A$450.
- AI voice OSCE annual: **A$134 (Geeky Medics Everything) → A$383 (rehearseMD Elite)**.
- Mostly Medicine's **previous A$190/yr Pro sat below eMedici** despite the AI voice moat —
  this was the underpricing problem the 2026-06-04 raise to A$290/yr is correcting.

---

## 2. Adjacent AI medical-ed (global) — round 2 additions

| Tool | Annual (AUD) | Monthly (AUD) | AI? | Target |
|---|---|---|---|---|
| **Neural Consult** | A$343 (US$224.99) | A$38 (US$24.99) | Yes — voice cases, GLIA RAG, AI flashcards/Q-gen | USMLE / UK MLA / MCCQE — **no AMC** |
| **Oscer.ai** | not public | not public | Yes — clinical reasoning AI tutor | AU med students (U Melb + U Syd pilots). **$5M seed from Blackbird** — funded threat. |
| **Geeky Medics** (Everything bundle) | A$134 (GBP £69.99) | A$69 | Yes — AI virtual patients with voice, 200 AI credits | Global OSCE / PLAB / NAC / USMLE |
| **rehearseMD** Pro / Elite | A$61 / A$383 | A$3.33 / A$20.83 | Yes — voice-first, examiner voice feedback | Global OSCE. AMC track supported. Closest functional comp to MM Pro. |
| **OSCE AI** | A$60 lifetime "Ready Pack" or US$15.99-$29.99/mo | — | Yes | Generic OSCE |
| **OSCEstop** | A$115 (GBP £60) | A$29 (GBP £15) | No | UK-focused reference price. |
| **Medkit** (open-source) | free / self-host | — | Yes — **Claude Opus 4.7**, voice-first | OSCE practice. Built in 3 days by a doctor-engineer for Opus 4.7 hackathon. **Forkable.** |
| **AMBOSS** clinician | A$397 (US$259) | A$46 (US$30) | "AI Features" | Global reference + Q-bank |
| **Medmastery** Basic / Pro | A$535 / A$688 | A$75 / A$37 (Pro annual) | No | CME-focused clinical skills |
| **Pulsenotes** | ~A$120 (GBP £100 implied) | A$19 (GBP £10) | No | UKMLA reference. **Direct price anchor for original A$19/mo Pro.** |
| **Sketchy Medical** | A$400-A$535 (US$349-449 6-12 mo) | — | No | USMLE Step 1/2 (visual mnemonics) |
| **Boards & Beyond** | A$252 (US$252 yearly) | A$89 (US$89) | No | USMLE Step 1 |
| **Glass Health** | $20 Lite → $200/mo Max (USD) | — | Yes — diagnostic AI + ambient scribe | **Practising clinicians, NOT exam prep.** $3.5B-tier (note: OpenEvidence ref) — proves AI-med category heat. |
| **OpenEvidence** | free for verified HCPs | — | Yes — citations | Clinical reference. **$210M raise / $3.5B valuation** — category signal. |

### Round 2 takeaways

- **Neural Consult has zero AMC content** — confirms global AI players have not built AU
  curriculum. AMC is a structural moat for MM.
- **Oscer.ai is the funded AU AI threat** ($5M seed) but currently focused on med students,
  not IMGs.
- **iatroX is the most direct same-category competitor** at A$150/yr — MM at A$290/yr asks
  +93% premium and must justify with voice OSCE + Aboriginal Health + Australian moat.
- Sketchy / B&B / Medmastery are USMLE-only — different category, not competitors.

---

## 3. Neural Consult — deep profile

### Pricing

| Tier | Price | AUD equiv |
|---|---|---|
| Starter (Free) | $0 | $0 |
| Monthly Pro | US$24.99/mo | ~A$38/mo |
| Annual Pro | US$224.99/yr (~$18.75/mo effective) | ~A$343/yr |

No AUD localisation. No lifetime. No student discount. No trial — free tier acts as trial.

### Product (8 modules)

1. **Clinical Case Simulator** — voice + text AI patient, 100+ MD-written scenarios.
   Filterable by organ system or rotation. Examiner-style feedback on interview skills,
   diagnostic reasoning, correctness.
2. **AI Medical Search (GLIA)** — RAG over uploads + web + curated medical AI. Markets a
   "100% USMLE Accuracy" benchmark.
3. **Exam Question Generator** — MCQs from any topic or uploaded lecture.
4. **Flashcard Hub** — AI-generated, **Anki-compatible export**.
5. **AI Notebook** — editable summaries + AI-generated podcasts (NotebookLM-style).
6. **Study Sessions** — bundles summaries + flashcards + MCQs + sim into a playlist.
7. **File Drive** — central storage.
8. **GLIA Medical Tutor** — voice-or-text AI tutor.

### "Mastery Flow" pedagogy

Verbatim marketing scaffold: **Introduce → Drill → Recognition in Context → Simulate Real
Life**. Adopt-or-adapt for MM's onboarding UX.

### Target exam

USMLE / UK MLA / MCCQE / NEETPG. **NCLEX, PANCE, APMLE** as adjacent verticals (Q1 2026
nursing blitz, May-June 2026 podiatry push).

**No AMC. No Australia content.** Verified by direct page reads + blog index sweep.

### Brand / funding

- Founded 2023. **No external funding** (Vaark Ventures is physician-run angel only).
- Founders: 3 US residents (Theros / Aguiar / Soetikno) at MGH / Northwestern / Stanford.
- Advisors include Dale Sanders + David Liebovitz MD + Michael McDowell MD.
- AI tech stack **not disclosed publicly** (brand: "GLIA").
- Claims: 50k+ students across partner institutions; 582,021 board Qs taken; 10,500
  patients simulated; 1.2M flashcards.
- Social: IG ~20.5k, X ~19k.

### What MM does NOT have that Neural Consult does (priority-ranked for AMC IMGs)

1. **HIGH — Anki export of flashcards.** IMGs are heavy Anki users. Major retention play.
2. **HIGH — Upload-your-own-lecture → MCQ/card/summary generation.** Neural Consult's wedge.
3. **HIGH — Examiner-style scoring rubric for OSCE.** MM has this; needs louder surfacing.
4. **MEDIUM — AI Notebook with podcast generation** (NotebookLM-style).
5. **MEDIUM — "Mastery Flow" pedagogy framing** in onboarding UX.
6. **MEDIUM — Public benchmark page** ("100% USMLE accuracy" → MM equivalent for AMC).
7. **LOW — Filter cases by organ system AND by rotation.**

### What MM has that Neural Consult does NOT

1. AMC-specific syllabus alignment.
2. Voice + text mode for OSCE (Neural Consult is voice-only).
3. Spaced repetition recalls (Neural Consult flashcards aren't SRS-native).
4. Mobile app (Neural Consult is web + WebCatalog wrapper only).
5. Mock exam mode (Neural Consult has none).
6. AU-specific content (the structural moat — see topic roadmap below).

### Velocity / strategic risk

- Last blog: 2026-06-02. 20 posts indexed. Big content blitz Jan 2026.
- Vertical-expansion thesis: same engine, new exam. Medicine → Nursing → PA → Podiatry.
- **AMC is plausibly their next vertical (Q3-Q4 2026)**. MM should move fast on AU-specific
  SEO + content moats before they show up.

---

## 4. Topic roadmap (AMC IMG impact ranked)

### Tier 1 — must-have, high-yield AMC core

1. Internal / General Medicine
2. Surgery (general + sub)
3. Obstetrics & Gynaecology
4. Paediatrics
5. Psychiatry
6. Emergency Medicine
7. General Practice / Primary Care
8. Population Health (AU-weighted)

### Tier 2 — high-yield AMC sub-specialties

9. Cardiology
10. Respiratory
11. Gastroenterology
12. Endocrinology
13. Nephrology
14. Neurology
15. Infectious Diseases (AU tropical + Aboriginal-health considerations)
16. Haematology / Oncology

### Tier 3 — examinable, lower frequency

17. Dermatology
18. Ophthalmology
19. ENT
20. Orthopaedics
21. Anaesthetics / Pain
22. Rheumatology
23. Geriatrics / Aged Care
24. Palliative Care

### Tier 4 — AMC differentiators (the structural moat)

> No US/UK AI platform will ever invest in these because the addressable market is too
> small for them. **MM owns this by default — market it loudly.**

25. **Aboriginal & Torres Strait Islander Health** (heavily weighted in AMC; zero coverage
    in Neural Consult, AMBOSS, Sketchy)
26. **Medico-legal & Ethics (AU context)** — informed consent under AU law, mandatory
    reporting
27. **AU Pharmacology** — PBS, TGA-approved drugs, dosing conventions
28. **Rural & Remote Medicine** (RACGP & ACRRM emphasis)
29. **Medicare / AHPRA / RACGP pathway awareness**
30. **Cultural Safety**

---

## 5. Strategic positioning recommendation

> "Mostly Medicine — the only AI medical exam platform built **by IMGs, for IMGs, for the
> Australian Medical Council**. Aboriginal health, AU pharmacology, rural medicine,
> AMC-style voice OSCE. Everything Neural Consult and AMBOSS forgot because they were
> built for Americans."

### Risks

1. **Neural Consult could spin an AMC vertical** in weeks given their template-driven
   feature factory (Podiatry shipped Q2 2026, Nursing Q1). AMC plausibly Q3-Q4 2026. Move
   fast on AU SEO + content moats.
2. **Oscer.ai is the funded AU AI threat** ($5M Blackbird seed, U Melb + U Syd). Currently
   med students, but could pivot to AMC.
3. **iatroX explicitly markets AMC + AKT** with iOS/Android apps. Closest direct
   competitor. Differentiate on: voice OSCE depth + Aboriginal health + IMG-specific
   journey (visa, AHPRA, exam booking) + AU pharmacology + price below Neural Consult.
4. **OSCELab + OSCEmate** are AU-founded AI OSCE plays — narrower threat (OSCE only) but
   voice-driven and growing.

---

## 6. Sources (full URL list)

Sweep dates: 2026-06-04.

- https://www.amcquestionbank.com/
- https://aceamcq.com/
- https://passamcq.com/
- https://emedici.com/products/clinical-medicine
- https://amedex.com.au/shop
- https://www.arimgsas.com.au/product/8-week/
- https://imemedical.com/products/amc-exam-preparation-platinum-program
- https://www.heal.edu.au/international-medical-graduates/amc-clinical-bridging-courses/
- https://www.amboss.com/us/pricing
- https://www.amboss.com/int/au/amc
- https://www.medmastery.com/pricing
- https://www.pulsenotes.com/
- https://app.geekymedics.com/purchase/bundles/
- https://www.rehearsemd.com/pricing
- https://osce.ai/pricing/
- https://oscelab.com/en/pricing
- https://oscestop.education/subscription/
- https://oscemate.com.au/
- https://taleen-ai-landing-page.vercel.app/
- https://gdaydoctor.com.au/blog/amc-exam-fees-2025-2026-complete-cost-breakdown-imgs
- https://www.neuralconsult.com/
- https://www.neuralconsult.com/nursing
- https://www.neuralconsult.com/features/case-simulator
- https://www.neuralconsult.com/blogs
- https://tracxn.com/d/companies/neuralconsult/
- https://www.iatrox.com/
- https://www.passgp.au/passamc
- https://gdaydoctor.com.au/
- https://www.oscer.ai/
- https://www.businessnewsaustralia.com/articles/medtech-oscer-raises--5m-in-seed-round-backed-by-blackbird
- https://github.com/bedriyan/medkit-app
- https://help.sketchy.com/content/sketchy-medical-price-update
- https://www.boardsbeyond.com/Pricing
- https://glass.health/
- https://www.openevidence.com/
