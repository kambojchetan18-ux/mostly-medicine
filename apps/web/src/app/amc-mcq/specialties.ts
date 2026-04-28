import type { MCQuestion } from "@mostly-medicine/content";
import { allQuestions } from "@mostly-medicine/content";

/**
 * Per-specialty static metadata used by the auto-generated landing pages.
 *
 *  - `slug`     URL slug (`/amc-mcq/<slug>`).
 *  - `topic`    Exact value of `MCQuestion.topic` in @mostly-medicine/content.
 *  - `name`     Display name in headings and list items.
 *  - `short`    Short noun used inline (e.g. "AMC <short> MCQ practice").
 *  - `intro`    ~300-word specialty-flavoured intro paragraph(s).
 *  - `faqs`     5 FAQ Q/A pairs, hand-crafted per specialty.
 */
export interface SpecialtyConfig {
  slug: string;
  topic: string;
  name: string;
  short: string;
  tagline: string;
  intro: string[];
  faqs: { question: string; answer: string }[];
}

export const SPECIALTIES: SpecialtyConfig[] = [
  {
    slug: "cardiology",
    topic: "Cardiovascular",
    name: "Cardiology",
    short: "Cardiology",
    tagline:
      "Master ECG interpretation, ACS pathways, heart failure pharmacotherapy and atrial fibrillation management for AMC MCQ.",
    intro: [
      "Cardiology is one of the highest-yield specialties on the AMC MCQ paper. Australian examiners expect International Medical Graduates to confidently distinguish STEMI from NSTEMI, recognise atrial fibrillation on a rhythm strip, apply the CHA₂DS₂-VASc score, and prescribe guideline-directed therapy for HFrEF — all within seconds of reading a clinical vignette. Around 10–15% of every AMC MCQ paper centres on cardiovascular medicine, making it the single most common scoring lane for IMGs.",
      "Mostly Medicine’s cardiology question bank is mapped tightly to the Heart Foundation of Australia and Cardiac Society of Australia and New Zealand (CSANZ) guidelines, the same evidence base AMC examiners cite when writing items. You will see scenarios on inferior STEMI artery localisation, the timing of primary PCI versus thrombolysis, dual antiplatelet duration, ARNI initiation in HFrEF, SGLT2 inhibitor uptake in heart failure, and rate- versus rhythm-control trade-offs in AF. Each MCQ uses the same five-option, single-best-answer format the AMC uses on exam day.",
      "Beyond raw recall, AMC cardiology questions reward clinical reasoning. Expect vignettes that blend ECG patterns with vital signs, risk factors and bedside findings — then ask for the most appropriate next investigation or the single best management step. Practising 200+ Australian-aligned cardiology MCQs, with an explanation written by clinicians, is the fastest way to lock down this material before exam day. Sign up free to unlock the full bank, AI-generated explanations, and spaced-repetition review of every cardiology card you flag.",
    ],
    faqs: [
      {
        question: "How many cardiology questions appear in AMC MCQ?",
        answer:
          "Cardiovascular medicine typically accounts for 15–20 of the 150 questions in AMC MCQ, making it one of the highest-weighted specialties. Strong cardiology performance is consistently associated with passing the exam.",
      },
      {
        question: "Which Australian guidelines should I focus on for AMC cardiology?",
        answer:
          "Heart Foundation of Australia guidelines (ACS, hypertension, lipids), CSANZ position statements on atrial fibrillation and heart failure, and the Therapeutic Guidelines: Cardiovascular handbook are the core references AMC examiners draw from.",
      },
      {
        question: "Do I need to interpret ECGs in AMC MCQ?",
        answer:
          "Yes — expect at least 3–5 ECG-based vignettes in AMC MCQ. You should be able to confidently identify STEMI territories, AF, atrial flutter, complete heart block, ventricular tachycardia, and the WPW pattern, plus electrolyte changes such as hyperkalaemia.",
      },
      {
        question: "What anticoagulation knowledge is tested?",
        answer:
          "AMC tests CHA₂DS₂-VASc and HAS-BLED scoring, DOAC dosing in renal impairment, warfarin bridging around procedures, and anticoagulation choice in valvular versus non-valvular AF. Expect at least one question on DOAC reversal agents (idarucizumab, andexanet alfa).",
      },
      {
        question: "Are sample cardiology MCQs free?",
        answer:
          "Yes. The Mostly Medicine free tier gives you 5 sample cardiology MCQs with full explanations on this page. Signing up unlocks the entire 200+ cardiology bank, AI-tutor follow-ups, and spaced-repetition recall scheduling.",
      },
    ],
  },
  {
    slug: "respiratory",
    topic: "Respiratory",
    name: "Respiratory Medicine",
    short: "Respiratory",
    tagline:
      "Asthma, COPD, pneumonia, PE and interstitial lung disease — the AMC MCQ respiratory questions every IMG must master.",
    intro: [
      "Respiratory medicine sits beside cardiology as one of the heaviest content domains on AMC MCQ, with 12–18 questions per paper drawn from acute asthma, COPD exacerbations, community-acquired pneumonia (CAP), pulmonary embolism, lung cancer, and interstitial lung disease. Every Australian intern is expected to recognise life-threatening asthma, calculate a CURB-65, escalate to non-invasive ventilation in COPD, and triage suspected PE — so AMC examiners test these skills relentlessly.",
      "The Mostly Medicine respiratory bank is mapped to the Australian Asthma Handbook, the COPD-X Plan from Lung Foundation Australia, and the Therapeutic Guidelines: Respiratory volume. You’ll practise items on stepwise asthma escalation, the role of magnesium sulphate in life-threatening asthma, optimal NIV settings for hypercapnic respiratory failure, indications for long-term oxygen therapy, the Wells score for PE, and CT-PA versus V/Q scanning. Smoking cessation pharmacotherapy (varenicline, nicotine replacement) and pneumococcal vaccination scheduling come up almost every paper.",
      "AMC vignettes in respiratory are renowned for blending bedside signs (silent chest, paradoxical breathing, accessory muscle use) with arterial blood gas results and chest X-ray findings, then asking for the single best next step. The fastest way to internalise the patterns is to practise 250+ respiratory MCQs in random order, with worked explanations after every attempt. Sign up free to unlock the full bank and start tracking your weak subtopics.",
    ],
    faqs: [
      {
        question: "How are asthma severity grades tested in AMC MCQ?",
        answer:
          "Expect vignettes asking you to classify asthma severity (mild, moderate, severe, life-threatening) using PEF percentage predicted, ability to speak, oxygen saturation and accessory muscle use — then choose the appropriate escalation step from the Australian Asthma Handbook.",
      },
      {
        question: "Which COPD framework do AMC questions follow?",
        answer:
          "AMC follows the COPD-X Plan published by Lung Foundation Australia, not the GOLD criteria. Memorise the C–O–P–D–X mnemonic and the indications for triple inhaler therapy plus long-term oxygen.",
      },
      {
        question: "Is pulmonary embolism heavily tested?",
        answer:
          "Yes. Expect at least one vignette using the Wells score, plus one on either DOAC versus LMWH choice for acute PE or massive PE thrombolysis criteria. Pregnancy-related VTE has appeared on recent papers.",
      },
      {
        question: "Do I need to interpret chest X-rays?",
        answer:
          "AMC MCQ includes radiology stems described in text rather than image-based questions for most items, but you should be able to recognise pneumothorax, lobar consolidation, pleural effusion and Kerley B lines from a written description.",
      },
      {
        question: "How many respiratory MCQs come with the free tier?",
        answer:
          "Five sample respiratory MCQs with full explanations are visible on this page. Signing up unlocks the full 250+ respiratory bank with spaced repetition.",
      },
    ],
  },
  {
    slug: "gastroenterology",
    topic: "Gastroenterology",
    name: "Gastroenterology",
    short: "Gastroenterology",
    tagline:
      "Liver disease, IBD, GI bleeds, coeliac disease and pancreatitis — high-yield AMC MCQ GI practice for IMGs.",
    intro: [
      "Gastroenterology contributes 10–14 questions to the AMC MCQ paper and is dense with high-yield, well-defined teaching points: chronic liver disease scoring, upper GI bleeding triage, inflammatory bowel disease step-up therapy, coeliac disease serology, acute pancreatitis severity, and colorectal cancer screening intervals under the National Bowel Cancer Screening Program. AMC examiners love to test your ability to choose the next investigation in a deteriorating cirrhotic patient or the right antibiotic in spontaneous bacterial peritonitis.",
      "The Mostly Medicine gastroenterology bank reflects RACGP, Gastroenterological Society of Australia (GESA) and Therapeutic Guidelines content, including Australian-specific items such as the iFOBT NBCSP screening pathway, hepatitis B/C cascade-of-care milestones, and the differing endoscopic surveillance intervals for Barrett’s oesophagus. You will encounter MCQs on Child-Pugh and MELD scoring, terlipressin in variceal bleeding, the timing of cholecystectomy after gallstone pancreatitis, biological therapy choice in Crohn’s disease, and lactose-versus-coeliac differential.",
      "AMC GI vignettes commonly bundle abnormal LFT patterns with risk factors (alcohol, hepatitis serology, drug history) and ask for the next investigation or definitive diagnosis. Practising 250+ Australian-aligned GI MCQs is the most efficient way to recognise these patterns. Sign up free to unlock the full bank and see your weak subtopics highlighted automatically.",
    ],
    faqs: [
      {
        question: "What hepatology content is tested in AMC MCQ?",
        answer:
          "Common stems include alcoholic hepatitis (Maddrey’s discriminant function), cirrhosis decompensation, hepatic encephalopathy management, hepatorenal syndrome, hepatitis B serology interpretation, and HCC surveillance with 6-monthly ultrasound + AFP.",
      },
      {
        question: "Which IBD therapies should I know?",
        answer:
          "Know step-up therapy from 5-ASA → thiopurine → anti-TNF (infliximab, adalimumab) → vedolizumab/ustekinumab, plus the indications for surgery in toxic megacolon and refractory disease. PBS criteria for biologics have appeared in recent recalls.",
      },
      {
        question: "How are GI bleeds tested?",
        answer:
          "Expect vignettes on the Glasgow-Blatchford score, urgent endoscopy timing (<24h for upper GI bleeds), pre-endoscopy IV PPI and erythromycin, and terlipressin + ceftriaxone for confirmed variceal bleeding.",
      },
      {
        question: "Is the National Bowel Cancer Screening Program in scope?",
        answer:
          "Yes. Know that iFOBT is offered free every two years to Australians aged 50–74 (expanding to 45+) and that a positive iFOBT mandates colonoscopy within 30–120 days.",
      },
      {
        question: "Are pancreatitis severity scores tested?",
        answer:
          "Yes. The modified Glasgow (Imrie) score and APACHE-II are commonly referenced. Recognise persistent organ failure beyond 48 hours as the defining feature of severe acute pancreatitis.",
      },
    ],
  },
  {
    slug: "neurology",
    topic: "Neurology",
    name: "Neurology",
    short: "Neurology",
    tagline:
      "Stroke, epilepsy, MS, headache and neuromuscular disease — AMC MCQ neurology practice mapped to Australian guidelines.",
    intro: [
      "Neurology contributes 10–14 questions to AMC MCQ, ranging from acute stroke triage and thrombolysis windows to first-seizure management, multiple sclerosis disease-modifying therapy, migraine prophylaxis, and peripheral neuropathy work-up. The AMC blueprint expects every IMG to confidently localise a lesion to the cortex, brainstem, spinal cord or peripheral nerve based on a focused history and examination findings.",
      "Mostly Medicine’s neurology bank is mapped to the Stroke Foundation Clinical Guidelines, Therapeutic Guidelines: Neurology, and the Australian and New Zealand Association of Neurologists (ANZAN) consensus statements. You’ll see vignettes on tPA eligibility windows, thrombectomy for large-vessel occlusion, antiplatelet versus anticoagulation choice in cardioembolic stroke, status epilepticus algorithms, and natalizumab/ocrelizumab indications in relapsing-remitting MS. Headache vignettes regularly test the SNOOP red flags and the differential between cluster, migraine, tension and medication-overuse headache.",
      "AMC neurology stems are notorious for blending a focused neurological exam (cranial nerve findings, dysarthria pattern, sensory level, brisk reflexes) with imaging clues, then demanding the single best next step. Practising 250+ Australian-aligned neurology MCQs builds the pattern-recognition speed you need on exam day. Sign up free to unlock the full bank.",
    ],
    faqs: [
      {
        question: "What is the AMC stroke thrombolysis window?",
        answer:
          "Intravenous alteplase is recommended within 4.5 hours of symptom onset for eligible patients per Stroke Foundation guidelines. Endovascular thrombectomy is offered up to 24 hours for selected large-vessel occlusion patients with favourable imaging.",
      },
      {
        question: "How is first-seizure management tested?",
        answer:
          "Expect vignettes on whether to start an antiepileptic after a single unprovoked seizure (generally no, unless EEG/MRI abnormalities or high recurrence risk), driving restrictions under Austroads (6 months off private driving), and pregnancy planning with valproate avoidance.",
      },
      {
        question: "Which headache red flags should I memorise?",
        answer:
          "Use SNOOP: Systemic symptoms, Neurological signs, Onset sudden (thunderclap), Older age >50, Pattern change. Any positive flag mandates urgent imaging and CSF if SAH is suspected.",
      },
      {
        question: "Is peripheral neuropathy on the AMC blueprint?",
        answer:
          "Yes. Common stems cover diabetic peripheral neuropathy, B12 deficiency subacute combined degeneration, alcohol-related neuropathy, Guillain-Barré syndrome (rising paralysis + albuminocytological dissociation), and carpal tunnel syndrome.",
      },
      {
        question: "How many neurology MCQs are free on this page?",
        answer:
          "Five sample neurology MCQs with explanations are shown below. The full 250+ bank unlocks with a free Mostly Medicine account.",
      },
    ],
  },
  {
    slug: "endocrinology",
    topic: "Endocrinology",
    name: "Endocrinology",
    short: "Endocrinology",
    tagline:
      "Diabetes, thyroid, adrenal and pituitary disease — AMC MCQ endocrinology MCQs aligned with Australian guidelines.",
    intro: [
      "Endocrinology contributes around 10 questions to the AMC MCQ paper, with type 2 diabetes management, thyroid disease, adrenal insufficiency and osteoporosis dominating the blueprint. Australian examiners are particularly strict on which medications are PBS-subsidised at which HbA1c thresholds — a quirk that catches many IMGs trained in other systems.",
      "The Mostly Medicine endocrinology bank is mapped to the RACGP General Practice Management of Type 2 Diabetes handbook, the Australian Diabetes Society (ADS) algorithms, the Endocrine Society of Australia thyroid guidance, and Therapeutic Guidelines: Endocrinology. You’ll practise items on metformin contraindications, GLP-1 agonist and SGLT2 inhibitor sequencing, hypothyroidism dosing in pregnancy, the short Synacthen test interpretation, primary hyperaldosteronism screening (aldosterone:renin ratio), and pheochromocytoma plasma metanephrine testing.",
      "AMC endocrine vignettes tend to combine a biochemistry result (TSH, free T4, HbA1c, calcium, cortisol) with a clinical presentation, then ask for the next investigation or treatment. Practising 200+ Australian-aligned endocrinology MCQs cements the patterns. Sign up free to unlock the full bank with worked explanations and spaced-repetition review.",
    ],
    faqs: [
      {
        question: "How is type 2 diabetes management tested?",
        answer:
          "Expect stems on metformin first-line therapy, second-line choice based on cardiovascular and renal risk (SGLT2i, GLP-1 RA), HbA1c targets (general 53 mmol/mol; tighter or relaxed in specific groups), and PBS authority criteria for newer agents.",
      },
      {
        question: "What thyroid topics are high-yield?",
        answer:
          "Subclinical hypothyroidism management thresholds, levothyroxine titration in pregnancy (increase by 25–30% in T1), thyroid storm management, and the differential between Graves’ disease, toxic multinodular goitre and silent thyroiditis using uptake scans.",
      },
      {
        question: "Are adrenal disorders tested heavily?",
        answer:
          "Two–three questions per paper typically: Addisonian crisis management with IV hydrocortisone + fluids, screening for primary hyperaldosteronism in resistant hypertension, and pheochromocytoma work-up with plasma free metanephrines.",
      },
      {
        question: "What about osteoporosis?",
        answer:
          "Know the indications for DXA scanning, the FRAX tool, when to start bisphosphonates (T-score ≤ −2.5 or after a minimal-trauma fracture), and the duration before considering a drug holiday (5 years oral, 3 years IV zoledronate).",
      },
      {
        question: "How many endocrinology MCQs are free?",
        answer:
          "Five sample endocrinology MCQs with explanations on this page. The full 200+ bank unlocks with a free Mostly Medicine account.",
      },
    ],
  },
  {
    slug: "psychiatry",
    topic: "Psychiatry",
    name: "Psychiatry",
    short: "Psychiatry",
    tagline:
      "Depression, anxiety, psychosis, suicide risk and Mental Health Act — AMC MCQ psychiatry practice for IMGs.",
    intro: [
      "Psychiatry contributes 10–12 questions to AMC MCQ, and IMGs commonly underestimate it. The blueprint includes major depressive disorder, generalised anxiety, schizophrenia and first-episode psychosis, bipolar disorder, suicide risk assessment, eating disorders, dementia and delirium differentiation, and the legal frameworks around involuntary treatment under each state’s Mental Health Act.",
      "Mostly Medicine’s psychiatry bank is mapped to the RANZCP clinical practice guidelines, Therapeutic Guidelines: Psychotropic, and the SafeScript real-time prescription monitoring system used across Australia. You’ll see MCQs on first-line SSRI choice (sertraline, escitalopram), augmentation strategies in treatment-resistant depression, ECT indications, atypical antipsychotic selection (and metabolic monitoring), lithium toxicity recognition, clozapine titration, and the Mental State Examination structure.",
      "AMC psychiatry vignettes regularly ask you to weigh capacity, risk, and the threshold for involuntary admission — a uniquely Australian medico-legal flavour. Practising 200+ Australian-aligned psychiatry MCQs builds confidence in this nuanced area. Sign up free to unlock the full bank and start tracking your weak subtopics.",
    ],
    faqs: [
      {
        question: "How is suicide risk assessment tested?",
        answer:
          "Expect vignettes asking you to grade risk (low/moderate/high) based on intent, plan, means, prior attempts, and protective factors, then choose between outpatient follow-up, urgent CATT review, or inpatient admission under the Mental Health Act.",
      },
      {
        question: "What antidepressant choices are first-line?",
        answer:
          "SSRIs (sertraline, escitalopram) are first-line for major depression in adults and adolescents. Mirtazapine is preferred when sleep or appetite is poor. Avoid SSRIs in mania; switch to mood stabilisers for bipolar depression.",
      },
      {
        question: "Are antipsychotics heavily tested?",
        answer:
          "Yes. Know first-line atypicals (olanzapine, risperidone, aripiprazole), metabolic monitoring intervals, clozapine indication after 2 failed antipsychotic trials, and clozapine’s major adverse effects (agranulocytosis, myocarditis, constipation).",
      },
      {
        question: "Do I need to know the Mental Health Act?",
        answer:
          "AMC tests broad principles, not state-specific clauses. Know the criteria for involuntary admission (mental illness, risk to self/others, no less restrictive option) and that decisions must be reviewed by an authorised psychiatrist within 24–72 hours depending on jurisdiction.",
      },
      {
        question: "How many psychiatry MCQs are free?",
        answer:
          "Five sample psychiatry MCQs with explanations on this page. The full 200+ bank unlocks with a free Mostly Medicine account.",
      },
    ],
  },
  {
    slug: "paediatrics",
    topic: "Paediatrics",
    name: "Paediatrics",
    short: "Paediatrics",
    tagline:
      "Fever, growth, immunisations, asthma and child protection — AMC MCQ paediatrics MCQs aligned with RCH and NIP.",
    intro: [
      "Paediatrics is one of the broadest disciplines on AMC MCQ, contributing 10–14 questions on neonatal jaundice, fever in the febrile child, growth and development milestones, paediatric asthma, immunisations under the National Immunisation Program, child protection, anaphylaxis, and common congenital conditions. Australian examiners are strict on dose-per-kilogram calculations and weight-based fluid resuscitation.",
      "Mostly Medicine’s paediatrics bank is mapped to the Royal Children’s Hospital (RCH) Melbourne Clinical Practice Guidelines, the National Immunisation Program (NIP) schedule, and Therapeutic Guidelines: Paediatric. You’ll practise items on the febrile infant work-up under 3 months, croup severity grading, bronchiolitis management (high-flow nasal cannula, when not to give bronchodilators), the maintenance fluid 4-2-1 rule, paediatric BLS algorithms, and the differential between Kawasaki disease and adenovirus.",
      "AMC paediatric vignettes commonly mix vital signs with weight, age and immunisation status, then ask for the most appropriate antibiotic dose, fluid volume or referral pathway. Practising 200+ Australian-aligned paediatric MCQs is the fastest way to internalise these patterns. Sign up free to unlock the full bank.",
    ],
    faqs: [
      {
        question: "How are febrile infants tested?",
        answer:
          "Any infant under 3 months with fever ≥38 °C requires full septic work-up (FBE, CRP, blood culture, urine MCS, LP if <1 month or unwell-appearing) and empirical IV antibiotics per RCH guidelines.",
      },
      {
        question: "What immunisations should I know?",
        answer:
          "Know the National Immunisation Program (NIP) schedule from birth to school age, including BCG for at-risk infants, the 13-valent and 23-valent pneumococcal vaccines, and HPV vaccination at age 12–13 (now extended to age 25 catch-up).",
      },
      {
        question: "How is paediatric asthma graded?",
        answer:
          "Mild, moderate, severe and life-threatening grading uses ability to speak, oxygen saturation, accessory muscle use, and conscious state. Treatment escalates from inhaled salbutamol → systemic steroids → IV magnesium → PICU referral per the Australian Asthma Handbook.",
      },
      {
        question: "Do I need to know child protection law?",
        answer:
          "Yes. All Australian doctors are mandatory reporters of suspected child abuse or neglect to the relevant state child protection service. AMC tests scenarios where you must escalate without parental consent.",
      },
      {
        question: "How many paediatric MCQs are free?",
        answer:
          "Five sample paediatric MCQs with explanations on this page. The full 200+ bank unlocks with a free Mostly Medicine account.",
      },
    ],
  },
  {
    slug: "obstetrics-gynaecology",
    topic: "Obstetrics & Gynaecology",
    name: "Obstetrics & Gynaecology",
    short: "Obstetrics & Gynaecology",
    tagline:
      "Antenatal care, ectopic, contraception, menopause and gynae cancer — AMC MCQ O&G MCQs for IMGs.",
    intro: [
      "Obstetrics & Gynaecology contributes 10–12 questions to AMC MCQ, covering antenatal care milestones, ectopic pregnancy, postpartum haemorrhage, pre-eclampsia, gestational diabetes, contraception choice, abnormal uterine bleeding, menopause, and gynaecological cancer screening under the National Cervical Screening Program (NCSP).",
      "Mostly Medicine’s O&G bank is mapped to the RANZCOG clinical guidelines, RACGP’s antenatal handbook, the Australian Pregnancy Care Guidelines, and Therapeutic Guidelines: Obstetrics & Gynaecology. You’ll see items on first-trimester screening pathways (combined first-trimester screening vs NIPT), gestational diabetes diagnosis (75 g OGTT thresholds at 24–28 weeks), magnesium sulphate for severe pre-eclampsia, anti-D prophylaxis, the LARC-first contraception philosophy, and the 5-yearly HPV-based NCSP.",
      "AMC O&G vignettes commonly bundle a positive β-hCG with vital signs, ultrasound findings and Rh status, then ask for the most appropriate next investigation or management. Practising 150+ Australian-aligned O&G MCQs is the fastest path to fluency. Sign up free to unlock the full bank with explanations.",
    ],
    faqs: [
      {
        question: "How is ectopic pregnancy tested?",
        answer:
          "Expect vignettes mixing positive β-hCG with PV bleeding and pelvic pain, then asking when to choose methotrexate versus laparoscopic salpingectomy/salpingostomy. Know that haemodynamic instability mandates surgery, not medical management.",
      },
      {
        question: "What antenatal screening should I know?",
        answer:
          "Routine bloods at booking (FBE, blood group + antibody screen, rubella, syphilis, HIV, hepatitis B, hepatitis C), 11–13+6 week combined first-trimester screening or NIPT, 18–20 week morphology scan, and 24–28 week 75 g OGTT and FBE.",
      },
      {
        question: "How is pre-eclampsia managed?",
        answer:
          "BP ≥140/90 with proteinuria or end-organ involvement after 20 weeks. Severe disease (BP ≥160/110, neurological symptoms) requires magnesium sulphate, antihypertensive (labetalol, hydralazine, nifedipine), and timely delivery.",
      },
      {
        question: "What is the current cervical screening program?",
        answer:
          "The National Cervical Screening Program offers a 5-yearly HPV-based test from age 25 to 74, replacing the 2-yearly Pap smear since 2017. Self-collection has been universally available since 2022.",
      },
      {
        question: "How many O&G MCQs are free?",
        answer:
          "Five sample O&G MCQs with explanations on this page. The full 150+ bank unlocks with a free Mostly Medicine account.",
      },
    ],
  },
  {
    slug: "emergency-medicine",
    topic: "Emergency Medicine",
    name: "Emergency Medicine",
    short: "Emergency Medicine",
    tagline:
      "Anaphylaxis, sepsis, trauma, toxicology and resuscitation — AMC MCQ emergency medicine MCQs for IMGs.",
    intro: [
      "Emergency medicine contributes 10–12 questions to AMC MCQ, and the topic is heavily weighted because every Australian intern works ED rotations. Expect vignettes on anaphylaxis adrenaline dosing, sepsis recognition (qSOFA, lactate), severe asthma, hyperkalaemia, toxicology (paracetamol, tricyclic, opioid), trauma primary survey, and acute coronary syndrome triage.",
      "Mostly Medicine’s emergency bank is mapped to the Australian Resuscitation Council (ARC) algorithms, Therapeutic Guidelines: Antibiotic and Toxicology, and the Royal Australasian College of Emergency Medicine (ACEM) guidelines. You’ll see MCQs on adult and paediatric BLS/ALS algorithms, the modified ABC of trauma, the Westmead Rumack-Matthew nomogram for paracetamol overdose, sodium bicarbonate in TCA toxicity, naloxone titration, hypertonic saline for symptomatic hyponatraemia, and DKA management.",
      "AMC emergency vignettes prize speed and decision-making over depth. Stems are typically dense (vital signs, brief history, key bedside finding) and demand the single best immediate action. Practising 150+ Australian-aligned emergency MCQs trains exam-day muscle memory. Sign up free to unlock the full bank.",
    ],
    faqs: [
      {
        question: "What anaphylaxis dose does AMC test?",
        answer:
          "IM adrenaline 0.01 mg/kg (max 0.5 mg) into the anterolateral thigh, repeat every 5 minutes if needed. Add IV fluids, oxygen, and salbutamol for bronchospasm. Antihistamines and steroids are adjuncts, never first-line.",
      },
      {
        question: "How is sepsis recognition tested?",
        answer:
          "Use qSOFA (RR ≥22, altered mentation, SBP ≤90) for bedside screening, lactate >2 mmol/L for hypoperfusion, and the Sepsis-6 bundle (cultures, antibiotics within 1 h, IV fluids, lactate, urine output, oxygen).",
      },
      {
        question: "What toxicology vignettes are high-yield?",
        answer:
          "Paracetamol (Rumack-Matthew nomogram, NAC dosing), tricyclic antidepressants (sodium bicarbonate for QRS ≥100 ms), beta-blocker overdose (glucagon, high-dose insulin), and opioid (naloxone titration, watch for re-narcotisation).",
      },
      {
        question: "How is trauma primary survey assessed?",
        answer:
          "ATLS-style ABCDE: Airway with C-spine control, Breathing with high-flow O₂, Circulation with two large-bore IV lines and tranexamic acid within 3 h, Disability (GCS, pupils, glucose), Exposure (full undress + warm).",
      },
      {
        question: "How many emergency MCQs are free?",
        answer:
          "Five sample emergency MCQs with explanations on this page. The full 150+ bank unlocks with a free Mostly Medicine account.",
      },
    ],
  },
  {
    slug: "nephrology",
    topic: "Renal",
    name: "Nephrology",
    short: "Nephrology",
    tagline:
      "AKI, CKD, electrolytes, glomerulonephritis and dialysis — AMC MCQ nephrology MCQs for IMGs.",
    intro: [
      "Nephrology contributes 6–9 questions to AMC MCQ, dominated by acute kidney injury (AKI), chronic kidney disease staging, electrolyte disturbances, glomerulonephritis, and renal replacement therapy. Australian examiners expect IMGs to confidently calculate eGFR, recognise pre-renal vs intrinsic vs post-renal AKI from the urea:creatinine ratio and urinalysis, and adjust drug doses accordingly.",
      "Mostly Medicine’s renal bank is mapped to the KDIGO guidelines (used by the Australian and New Zealand Society of Nephrology), Therapeutic Guidelines: Kidney/Urinary, and the Caring for Australasians with Renal Impairment (CARI) recommendations. You’ll practise items on AKI staging by KDIGO criteria, the contrast-induced AKI prevention bundle, hyperkalaemia ECG changes and treatment ladder (calcium gluconate → insulin/dextrose → salbutamol → dialysis), SIADH versus cerebral salt wasting, the differential for nephrotic versus nephritic syndrome, and dialysis indications using the AEIOU mnemonic.",
      "AMC renal vignettes typically pair a creatinine trend with electrolytes, urine output and fluid status, then ask for the next investigation or management. Practising 130+ Australian-aligned nephrology MCQs cements pattern recognition. Sign up free to unlock the full bank.",
    ],
    faqs: [
      {
        question: "How is AKI staged in AMC MCQ?",
        answer:
          "KDIGO criteria: Stage 1 = creatinine ×1.5–1.9 baseline; Stage 2 = ×2–2.9; Stage 3 = ×3 or absolute creatinine ≥354 µmol/L, or RRT initiated. Urine output thresholds <0.5 mL/kg/h define each stage.",
      },
      {
        question: "What electrolyte disturbances are high-yield?",
        answer:
          "Hyperkalaemia (ECG, treatment ladder), hyponatraemia (SIADH, cerebral salt wasting, hypovolaemic), hypercalcaemia of malignancy (IV fluids ± zoledronate), and hypomagnesaemia (often missed in refractory hypokalaemia).",
      },
      {
        question: "Are dialysis indications tested?",
        answer:
          "Yes. AEIOU: Acidosis (refractory), Electrolytes (hyperkalaemia >6.5 unresponsive), Ingestion (lithium, salicylates, methanol), Overload (refractory pulmonary oedema), Uraemia (encephalopathy, pericarditis).",
      },
      {
        question: "What about glomerulonephritis?",
        answer:
          "Distinguish nephritic (haematuria, hypertension, modest proteinuria — e.g. IgA, post-strep, anti-GBM) from nephrotic (proteinuria >3.5 g/day, hypoalbuminaemia, oedema — e.g. minimal change, FSGS, membranous, diabetic).",
      },
      {
        question: "How many nephrology MCQs are free?",
        answer:
          "Five sample nephrology MCQs with explanations on this page. The full 130+ bank unlocks with a free Mostly Medicine account.",
      },
    ],
  },
  {
    slug: "rheumatology",
    topic: "Rheumatology",
    name: "Rheumatology",
    short: "Rheumatology",
    tagline:
      "RA, gout, SLE, vasculitis and PMR — AMC MCQ rheumatology MCQs aligned with Australian guidelines.",
    intro: [
      "Rheumatology contributes 5–8 questions to AMC MCQ, covering rheumatoid arthritis, seronegative spondyloarthropathies, crystal arthropathies (gout, pseudogout), systemic lupus erythematosus, vasculitis (GCA, ANCA-associated), polymyalgia rheumatica, and osteoporosis (overlapping with endocrinology).",
      "Mostly Medicine’s rheumatology bank is mapped to the Australian Rheumatology Association (ARA) guidelines, Therapeutic Guidelines: Rheumatology, and PBS criteria for biologic DMARDs. You’ll see items on the 2010 ACR/EULAR criteria for RA, methotrexate dosing and folic acid supplementation, anti-TNF screening (latent TB, hepatitis B), gout flare management (NSAIDs, colchicine, prednisolone) and urate-lowering therapy initiation, and the temporal artery biopsy timing for suspected GCA.",
      "AMC rheumatology vignettes typically mix joint distribution patterns (small vs large, symmetric vs asymmetric, axial vs peripheral) with serology (RF, CCP, ANA, ANCA) and imaging clues, then ask for the most likely diagnosis or first-line therapy. Practising 125+ Australian-aligned rheumatology MCQs is the fastest path to confidence. Sign up free to unlock the full bank.",
    ],
    faqs: [
      {
        question: "How is rheumatoid arthritis diagnosed?",
        answer:
          "Use the 2010 ACR/EULAR classification criteria: joint distribution, serology (RF, anti-CCP), acute-phase reactants (ESR, CRP), and symptom duration. Score ≥6/10 confirms RA.",
      },
      {
        question: "What gout management is tested?",
        answer:
          "Acute flare: NSAID, colchicine 1.2 mg then 0.6 mg one hour later, or prednisolone. Urate-lowering therapy: allopurinol from low dose (50–100 mg) titrated to target urate <0.36 mmol/L, with prophylactic colchicine for the first 6 months.",
      },
      {
        question: "How is GCA managed?",
        answer:
          "High-dose prednisolone (40–60 mg/day) immediately on suspicion — do not delay for biopsy. Aspirin 100 mg daily reduces ischaemic complications. Tocilizumab is PBS-listed for relapsing or refractory disease.",
      },
      {
        question: "Are autoantibodies heavily tested?",
        answer:
          "Yes. Know ANA (sensitive but not specific for SLE), anti-dsDNA (specific for SLE), anti-Smith (specific), anti-Ro/La (Sjögren’s, neonatal lupus), anti-Jo1 (myositis), anti-Scl70 (diffuse scleroderma), and ANCA patterns (c-ANCA for GPA, p-ANCA for MPA/EGPA).",
      },
      {
        question: "How many rheumatology MCQs are free?",
        answer:
          "Five sample rheumatology MCQs with explanations on this page. The full 125+ bank unlocks with a free Mostly Medicine account.",
      },
    ],
  },
  {
    slug: "infectious-disease",
    topic: "Infectious Disease",
    name: "Infectious Disease",
    short: "Infectious Disease",
    tagline:
      "HIV, TB, sepsis, STIs and tropical disease — AMC MCQ ID MCQs aligned with Australian Therapeutic Guidelines.",
    intro: [
      "Infectious disease contributes 6–9 questions to AMC MCQ, with HIV, tuberculosis, sepsis, sexually transmitted infections, traveller’s fever, hepatitis B/C, antibiotic stewardship, and Australian-specific tropical conditions (melioidosis, Murray Valley encephalitis) all in scope. Australian examiners are strict on the empirical antibiotic recommendations from Therapeutic Guidelines: Antibiotic, the most-cited reference on the AMC blueprint.",
      "Mostly Medicine’s ID bank is mapped to ASID and ASHM consensus guidelines, the Australian Immunisation Handbook, and Therapeutic Guidelines: Antibiotic. You’ll practise items on HIV testing windows and PrEP/PEP eligibility, the four-drug TB regimen and DOT in remote Aboriginal communities, the empirical antibiotic for community-acquired pneumonia (benzylpenicillin + doxycycline or moxifloxacin), the syphilis treatment ladder, and contact tracing under public health legislation.",
      "AMC ID vignettes tend to weave travel history, occupational exposure, and pregnancy status into the stem, then ask for the most appropriate empirical antibiotic, vaccine or notification step. Practising 125+ Australian-aligned infectious disease MCQs builds the breadth you need. Sign up free to unlock the full bank.",
    ],
    faqs: [
      {
        question: "What HIV testing windows are tested?",
        answer:
          "Fourth-generation antigen/antibody combo tests are reliable from 4 weeks post-exposure. PEP must commence within 72 hours of exposure (ideally <24 h) and continues for 28 days. PrEP is PBS-listed for at-risk individuals.",
      },
      {
        question: "How is community-acquired pneumonia treated?",
        answer:
          "Per Therapeutic Guidelines: low severity → amoxicillin 1 g 8-hourly + doxycycline; moderate severity → IV benzylpenicillin + doxycycline or oral moxifloxacin; severe (ICU) → IV ceftriaxone + azithromycin or moxifloxacin.",
      },
      {
        question: "What STI screening should I know?",
        answer:
          "Annual HIV, syphilis, gonorrhoea, chlamydia testing in MSM and other at-risk groups; genital examination plus first-pass urine NAAT for chlamydia/gonorrhoea; and contact tracing through PartnerLetter or public health units for notifiable infections.",
      },
      {
        question: "Are tropical diseases tested?",
        answer:
          "Yes. Know malaria diagnosis (thick + thin films × 3, antigen test) and treatment by species, dengue with warning signs, melioidosis (high mortality, requires IV ceftazidime/meropenem then prolonged eradication), and rickettsial illnesses such as Queensland tick typhus.",
      },
      {
        question: "How many ID MCQs are free?",
        answer:
          "Five sample infectious disease MCQs with explanations on this page. The full 125+ bank unlocks with a free Mostly Medicine account.",
      },
    ],
  },
  {
    slug: "surgery",
    topic: "Surgery",
    name: "Surgery",
    short: "Surgery",
    tagline:
      "Acute abdomen, hernia, vascular and post-op care — AMC MCQ surgical MCQs for IMGs.",
    intro: [
      "Surgery contributes 6–9 questions to AMC MCQ, focused on the acute abdomen (appendicitis, cholecystitis, diverticulitis, bowel obstruction), hernia recognition, breast lumps, vascular emergencies (AAA, acute limb ischaemia), perioperative care, and post-operative complications. Australian intern-level surgery is heavily protocolised, and AMC examiners expect IMGs to recognise surgical red flags and choose the right imaging modality.",
      "Mostly Medicine’s surgery bank is mapped to RACS curriculum content, eTG (Therapeutic Guidelines), and ANZ surgical society guidelines. You’ll practise items on the Alvarado score for appendicitis, the timing of cholecystectomy after cholecystitis, the criteria for sigmoid volvulus decompression, AAA screening (one-off ultrasound for men 65–74 with risk factors), the 6 Ps of acute limb ischaemia, perioperative anticoagulant management, and ileus versus mechanical obstruction differentiation.",
      "AMC surgical vignettes typically combine vital signs, abdominal exam findings and a key investigation result (lactate, lipase, ultrasound), then ask for the most appropriate immediate management or operation. Practising 125+ Australian-aligned surgical MCQs builds confidence with the surgical decision tree. Sign up free to unlock the full bank.",
    ],
    faqs: [
      {
        question: "How is appendicitis tested?",
        answer:
          "Expect classical history (peri-umbilical to RIF migration), Alvarado score interpretation, USS first-line in children/pregnancy and CT in adults with diagnostic uncertainty, and laparoscopic appendicectomy as definitive treatment.",
      },
      {
        question: "What bowel obstruction stems are common?",
        answer:
          "Differentiate small bowel (vomiting early, central pain, ladder pattern) from large bowel (distension, late vomiting, peripheral haustra). Volvulus, hernia incarceration and adhesions dominate. CT is the imaging of choice.",
      },
      {
        question: "Is AAA screening tested?",
        answer:
          "Yes. Know the recommendation for one-off abdominal ultrasound in men aged 65–74 with cardiovascular risk factors. Symptomatic AAA ≥5.5 cm or rapidly expanding requires elective repair; ruptured AAA needs immediate theatre.",
      },
      {
        question: "What perioperative anticoagulation should I know?",
        answer:
          "Bridge warfarin patients with LMWH for high-thrombosis risk (mechanical valves, recent VTE). DOACs are stopped 24–48 h pre-op based on renal function and bleeding risk. Aspirin is usually continued for cardiac stents.",
      },
      {
        question: "How many surgical MCQs are free?",
        answer:
          "Five sample surgical MCQs with explanations on this page. The full 125+ bank unlocks with a free Mostly Medicine account.",
      },
    ],
  },
  {
    slug: "pharmacology",
    topic: "Pharmacology",
    name: "Pharmacology",
    short: "Pharmacology",
    tagline:
      "Prescribing, drug interactions, PBS rules and SafeScript — AMC MCQ pharmacology MCQs for IMGs.",
    intro: [
      "Pharmacology contributes 6–8 questions to AMC MCQ, with a uniquely Australian flavour: PBS authority criteria, SafeScript real-time prescription monitoring, S8 controlled drug regulations, and the Australian Medicines Handbook (AMH) recommendations all feature heavily. IMGs trained outside Australia commonly underestimate this domain.",
      "Mostly Medicine’s pharmacology bank is mapped to the AMH, Therapeutic Guidelines, and the PBS Schedule. You’ll practise items on opioid prescribing under SafeScript, anticoagulant choice and reversal, paediatric dosing, pregnancy/lactation drug categories, drug interactions (warfarin + macrolide, SSRIs + tramadol, MAOI + tyramine), and adverse drug reaction reporting via the TGA.",
      "AMC pharmacology vignettes typically present a patient on a polypharmacy regimen with a new symptom, then ask which medication is most likely responsible or what to substitute. Practising 150+ Australian-aligned pharmacology MCQs is the fastest path to mastery. Sign up free to unlock the full bank.",
    ],
    faqs: [
      {
        question: "What is SafeScript and is it tested?",
        answer:
          "SafeScript is Australia’s real-time prescription monitoring system covering Schedule 4D and Schedule 8 drugs (e.g. opioids, benzodiazepines, gabapentinoids). Doctors must check it before prescribing or dispensing. AMC tests scenarios where SafeScript review changes management.",
      },
      {
        question: "How are drug interactions tested?",
        answer:
          "Common stems: warfarin + macrolides/fluconazole, SSRIs + tramadol/MAOI (serotonin syndrome), statins + amiodarone (myopathy), digoxin + verapamil (toxicity), and lithium + NSAIDs/ACE inhibitors.",
      },
      {
        question: "What PBS rules should I know?",
        answer:
          "Know the difference between Streamlined Authority, Telephone Authority, and Restricted Benefit listings. Common authority drugs include biologics, novel anticoagulants in specific indications, and high-dose opioids beyond 100 mg oral morphine equivalent per day.",
      },
      {
        question: "Are pregnancy categories on the AMC blueprint?",
        answer:
          "Yes. The TGA uses Australian categories A, B1–B3, C, D, X (not the FDA letters). Know which drugs are absolutely contraindicated (Category X: thalidomide, isotretinoin, valproate in epilepsy where alternatives exist).",
      },
      {
        question: "How many pharmacology MCQs are free?",
        answer:
          "Five sample pharmacology MCQs with explanations on this page. The full 150+ bank unlocks with a free Mostly Medicine account.",
      },
    ],
  },
];

const SLUG_INDEX = new Map<string, SpecialtyConfig>(
  SPECIALTIES.map((s) => [s.slug, s]),
);

export function getSpecialtyBySlug(slug: string): SpecialtyConfig | undefined {
  return SLUG_INDEX.get(slug);
}

export function getQuestionsForSpecialty(topic: string): MCQuestion[] {
  return allQuestions.filter((q) => q.topic === topic);
}

export function getCountsBySpecialty(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const s of SPECIALTIES) {
    counts[s.slug] = allQuestions.filter((q) => q.topic === s.topic).length;
  }
  return counts;
}

export const SITE_URL = "https://mostlymedicine.com";
