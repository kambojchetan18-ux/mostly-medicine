import type {Flashcard} from "./flashcards";

// Hand-derived seed cards covering AMC CAT 1 + CAT 2 psychiatry high-yield.
// Mirrors flashcards-gastro.ts conventions — cloze ≤2, AU-cited, no fluff.
export const psychiatryFlashcards: Flashcard[] = [
  {
    id: "fc-psych-001",
    specialty: "psychiatry",
    subtopic: "MDD SIGECAPS",
    front_md:
      "Major depressive disorder per DSM-5 requires ≥5 symptoms over ≥2 weeks including {{c1::depressed mood or anhedonia}}; remember as SIGECAPS — {{c2::Sleep, Interest, Guilt, Energy, Concentration, Appetite, Psychomotor, Suicidality}}.",
    back_md:
      "PHQ-9 ≥10 has ~88% sensitivity/specificity for moderate depression and is the AU screening default. Exclude bipolar (always ask about prior elevated mood) and organic mimics (TSH, B12, folate, FBE, U&E, LFT). Document functional impact for diagnosis.",
    citation: "RACGP Red Book · TG Psychotropics",
    mark_sheet_domain: "ddx",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-psych-002",
    specialty: "psychiatry",
    subtopic: "MDD first-line pharmacotherapy",
    front_md:
      "First-line SSRIs for adult MDD in Australia per TG Psychotropics are {{c1::sertraline or escitalopram}}; counsel on a delay of {{c2::2-4 weeks}} for onset and early-treatment suicidality, especially in <25s.",
    back_md:
      "Sertraline is preferred in perinatal/cardiac patients (lowest QT effect, safe in breastfeeding). Escitalopram dose-dependent QT prolongation — max 20 mg, 10 mg if elderly. Review at 1-2 weeks, then 4 weeks. Continue 6-12 months after remission for first episode.",
    citation: "TG Psychotropics · RACGP",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-psych-003",
    specialty: "psychiatry",
    subtopic: "Suicide risk assessment",
    front_md:
      "Dynamic suicide risk factors (modifiable) include {{c1::hopelessness, current plan/means/intent, recent loss, intoxication}}; static factors (historical) include {{c2::prior attempt, family history, male sex, chronic illness}}.",
    back_md:
      "Hopelessness is the single strongest predictor of completed suicide (Beck). Always ask directly — asking does NOT increase risk. Escalation: imminent risk → do not leave alone, call mental health triage / CAT team, consider Mental Health Act assessment for involuntary admission if refusing.",
    citation: "RACGP suicide prevention · TG Psychotropics",
    mark_sheet_domain: "safety_net",
    amc_part: "both",
    ai_generated: false,
  },
  {
    id: "fc-psych-004",
    specialty: "psychiatry",
    subtopic: "GAD",
    front_md:
      "GAD diagnosis = excessive worry on most days for ≥{{c1::6 months}} with ≥3 of restlessness, fatigue, poor concentration, irritability, muscle tension, sleep disturbance; screen with {{c2::GAD-7 ≥10}} for moderate severity.",
    back_md:
      "First-line management is CBT (structured 8-12 sessions). Pharmacotherapy: SSRI (escitalopram, sertraline) or SNRI (venlafaxine, duloxetine). AVOID benzodiazepines for chronic anxiety — dependence within 4 weeks, rebound, falls in elderly. Short course (≤2 weeks) only for crisis.",
    citation: "TG Psychotropics · RACGP",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-psych-005",
    specialty: "psychiatry",
    subtopic: "Panic disorder",
    front_md:
      "A panic attack is a discrete episode peaking within {{c1::10 minutes}}; panic disorder requires recurrent attacks plus ≥1 month of {{c2::anticipatory worry or behavioural change (avoidance)}}.",
    back_md:
      "First-line is CBT with interoceptive exposure + breathing retraining (slow diaphragmatic, not paper-bag — risks hypoxia). SSRI start low (e.g. sertraline 25 mg) — panic patients are exquisitely sensitive to activation. Exclude organic mimics: thyroid, phaeo, arrhythmia, substance.",
    citation: "TG Psychotropics · RACGP",
    mark_sheet_domain: "ddx",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-psych-006",
    specialty: "psychiatry",
    subtopic: "Bipolar mania vs hypomania",
    front_md:
      "Mania vs hypomania is distinguished by {{c1::marked functional impairment, psychotic features, or need for hospitalisation}} (mania) and a duration of ≥{{c2::7 days for mania, 4 days for hypomania}}.",
    back_md:
      "Screen with the Mood Disorder Questionnaire (MDQ) in any patient presenting with depression. Bipolar I = mania ± depression; Bipolar II = hypomania + depression. Antidepressant monotherapy risks manic switch — always pair with a mood stabiliser if bipolar suspected.",
    citation: "TG Psychotropics · RANZCP bipolar CPG",
    mark_sheet_domain: "ddx",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-psych-007",
    specialty: "psychiatry",
    subtopic: "Bipolar maintenance",
    front_md:
      "First-line maintenance pharmacotherapy for bipolar I disorder per RANZCP is {{c1::lithium}}; baseline + ongoing monitoring includes {{c2::U&E (eGFR), TFT, Ca, ECG, weight, lithium level}}.",
    back_md:
      "Target trough lithium level 0.6-0.8 mmol/L (acute 0.8-1.0). Toxicity > 1.5 mmol/L (tremor, ataxia, confusion, seizure). Avoid NSAIDs, ACEi, thiazides (raise level). Acute mania: olanzapine, risperidone or quetiapine; add lithium/valproate. Lithium reduces suicide risk independent of mood effect.",
    citation: "RANZCP bipolar CPG · TG Psychotropics",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-psych-008",
    specialty: "psychiatry",
    subtopic: "Schizophrenia diagnosis",
    front_md:
      "DSM-5 schizophrenia requires ≥2 symptoms (≥1 of delusions, hallucinations, disorganised speech) for ≥{{c1::1 month active phase}}, with total disturbance lasting ≥{{c2::6 months}}.",
    back_md:
      "Positive symptoms = hallucinations, delusions, formal thought disorder. Negative = avolition, alogia, flat affect, anhedonia — often more disabling and poorly responsive to antipsychotics. Exclude substance-induced (urine drug screen) and organic (CT brain, TFT, syphilis if indicated).",
    citation: "RANZCP schizophrenia CPG · DSM-5",
    mark_sheet_domain: "ddx",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-psych-009",
    specialty: "psychiatry",
    subtopic: "Clozapine",
    front_md:
      "Treatment-resistant schizophrenia (failed ≥2 adequate antipsychotic trials) → {{c1::clozapine}}; mandatory monitoring is {{c2::weekly FBE for 18 weeks then monthly, lifelong}} due to agranulocytosis risk.",
    back_md:
      "AU clozapine prescriber + dispenser must be registered with the monitoring service (Clopine/Clozaril Connect). Other risks: myocarditis (first 4 weeks — troponin, CRP, ECG), constipation/ileus (can be fatal), seizures, hypersalivation, weight gain, diabetes. Single missed dose >48h → restart titration.",
    citation: "TG Psychotropics · RANZCP",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-psych-010",
    specialty: "psychiatry",
    subtopic: "First episode psychosis",
    front_md:
      "Early intervention in first episode psychosis follows the {{c1::EPPIC model}} — assertive community follow-up, low-dose antipsychotic, and structured {{c2::family psychoeducation}} to reduce expressed emotion.",
    back_md:
      "Duration of untreated psychosis predicts outcome — refer to local headspace / EPYS early. Use lowest effective dose of a second-generation antipsychotic (e.g. aripiprazole, risperidone). Avoid haloperidol first-line (EPS). Address tobacco, cannabis, suicide risk and metabolic baseline.",
    citation: "Orygen EPPIC · RANZCP early psychosis",
    mark_sheet_domain: "mgmt",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-psych-011",
    specialty: "psychiatry",
    subtopic: "Anorexia nervosa",
    front_md:
      "Anorexia nervosa diagnostic features: BMI <{{c1::17.5 (or <85% expected)}}, intense fear of weight gain, and body image distortion; medical admission criteria include {{c2::HR <40, SBP <80, K+ <3.0, BMI <14}} (MARSIPAN).",
    back_md:
      "Refeeding syndrome = drop in phosphate, magnesium, potassium within 72 h of refeeding — monitor daily bloods, start low (e.g. 20 kcal/kg/day), prophylactic thiamine 100 mg + Pabrinex. Bradycardia and prolonged QT are leading causes of in-hospital death.",
    citation: "MARSIPAN · RANZCP eating disorders CPG",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-psych-012",
    specialty: "psychiatry",
    subtopic: "Bulimia nervosa",
    front_md:
      "Bulimia nervosa = recurrent binge eating + compensatory behaviours (vomiting, laxatives, exercise) ≥{{c1::once per week for 3 months}}; first-line treatment is {{c2::CBT-E plus fluoxetine 60 mg}}.",
    back_md:
      "Fluoxetine is the only SSRI with TGA indication for bulimia (higher dose than depression). Examine for Russell's sign (knuckle calluses), parotid hypertrophy, dental erosion, hypokalaemic alkalosis. Eating Disorder Plan (EDP) gives 40 Medicare-rebated psychology sessions/year.",
    citation: "RANZCP eating disorders CPG · MBS EDP",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-psych-013",
    specialty: "psychiatry",
    subtopic: "Alcohol screening",
    front_md:
      "AUDIT-C is positive at {{c1::≥4 in men, ≥3 in women}}; CAGE positive at {{c2::≥2 of Cut down, Annoyed, Guilty, Eye-opener}}.",
    back_md:
      "Brief intervention uses FRAMES — Feedback, Responsibility, Advice, Menu, Empathy, Self-efficacy. Document standard drinks/week (NHMRC: ≤10/week and ≤4/day to reduce harm). Pharmacotherapy for relapse prevention: naltrexone (craving), acamprosate (abstinence maintenance), disulfiram (selected).",
    citation: "RACGP Red Book · NHMRC alcohol guidelines",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-psych-014",
    specialty: "psychiatry",
    subtopic: "Alcohol withdrawal",
    front_md:
      "Severity of alcohol withdrawal is scored with {{c1::CIWA-Ar}}; IV {{c2::thiamine 300 mg must precede any glucose}} to prevent Wernicke's encephalopathy.",
    back_md:
      "Benzodiazepine of choice is diazepam (long-acting) — switch to oxazepam if significant liver disease (no active metabolites). Watch for seizures (6-48 h), DTs (48-96 h, mortality up to 5%). Magnesium replacement reduces seizure risk. Refer to D&A service for relapse prevention.",
    citation: "TG Psychotropics · NHMRC alcohol withdrawal",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-psych-015",
    specialty: "psychiatry",
    subtopic: "PTSD",
    front_md:
      "PTSD per DSM-5 requires symptoms ≥{{c1::1 month}} after trauma across four clusters — intrusion, avoidance, negative cognition/mood, and hyperarousal; first-line treatment is {{c2::trauma-focused CBT or EMDR}}.",
    back_md:
      "Pharmacotherapy second-line: sertraline or paroxetine (TGA-indicated for PTSD). Prazosin 1-5 mg nocte for nightmares (alpha-1 antagonist). AVOID benzodiazepines — worsen extinction learning. ADF / first responders → Phoenix Australia guidelines and Open Arms referral.",
    citation: "Phoenix Australia PTSD CPG · TG Psychotropics",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-psych-016",
    specialty: "psychiatry",
    subtopic: "Adult ADHD",
    front_md:
      "Adult ADHD diagnosis requires ≥{{c1::5 inattentive or hyperactive/impulsive symptoms}} with onset before age {{c2::12}}, persistence into adulthood, and impairment in ≥2 settings.",
    back_md:
      "Stimulants (methylphenidate, dexamphetamine, lisdexamfetamine) require an AU state Authority/Permit; usually only psychiatrists or paediatricians can initiate (some states allow shared-care). Atomoxetine (SNRI) is the main non-stimulant — useful for tic, anxiety or substance-use comorbidity. ECG/BP baseline.",
    citation: "RANZCP ADHD CPG · TG Psychotropics",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-psych-017",
    specialty: "psychiatry",
    subtopic: "OCD",
    front_md:
      "OCD = obsessions and/or compulsions consuming >{{c1::1 hour/day}} or causing marked distress/impairment; first-line treatment is {{c2::CBT with exposure and response prevention (ERP)}} ± SSRI.",
    back_md:
      "SSRIs for OCD often need higher doses than for depression (e.g. sertraline up to 200 mg, fluoxetine up to 80 mg) and a longer trial (10-12 weeks). Clomipramine is an effective second-line. Screen for tics and hoarding subtype. Y-BOCS scores severity.",
    citation: "TG Psychotropics · RANZCP",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-psych-018",
    specialty: "psychiatry",
    subtopic: "Mental Health Act",
    front_md:
      "Involuntary treatment under the AU Mental Health Act (e.g. NSW MHA 2007 / Vic MHWA 2022) requires {{c1::mental illness, serious risk to self/others or significant decline, and no less restrictive option}}; voluntary engagement is always preferred.",
    back_md:
      "NSW: Schedule 1 form by a medical practitioner enables involuntary transport to a declared facility for assessment by an authorised psychiatrist. Vic: Assessment Order then Temporary Treatment Order. Patient retains right to MHT review, second opinion, communication, and legal representation.",
    citation: "NSW MHA 2007 · Vic MHWA 2022 · RANZCP",
    mark_sheet_domain: "knowledge",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-psych-019",
    specialty: "psychiatry",
    subtopic: "Capacity assessment",
    front_md:
      "Decision-specific capacity (AU common law + state guardianship Acts) requires the patient to {{c1::understand, retain, weigh, and communicate}} the decision; capacity is {{c2::presumed in adults}} and assessed for the specific decision at hand.",
    back_md:
      "Mental illness does not automatically remove capacity. If lacking, decisions move to advance care directive, then enduring guardian/Person Responsible (state-specific hierarchy), then Guardianship Tribunal. Document the four-step assessment and the specific decision in the notes.",
    citation: "AMA · NSW Guardianship Act · Vic Medical Treatment Planning Act",
    mark_sheet_domain: "communication",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-psych-020",
    specialty: "psychiatry",
    subtopic: "Confidentiality + duty to warn",
    front_md:
      "Confidentiality may be lawfully breached when there is a {{c1::serious and imminent threat to an identifiable third party}} (AU equivalent of Tarasoff); document {{c2::the risk, who was warned, and the clinical reasoning}}.",
    back_md:
      "Privacy Act 1988 + state health records Acts permit disclosure to prevent serious threat to life/health/safety. Notify police, the at-risk person where practicable, and senior clinician/MDO. Mandatory reporting (child protection, firearms, drivers licensing) is separate and absolute.",
    citation: "AMA Code of Ethics · Privacy Act 1988 · RANZCP",
    mark_sheet_domain: "communication",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-psych-021",
    specialty: "psychiatry",
    subtopic: "Postpartum mental health",
    front_md:
      "Postpartum {{c1::psychosis}} is an acute-onset emergency (usually <2 weeks postpartum) with mood lability, confusion and psychotic features; postpartum {{c2::depression}} is more insidious, screened with EPDS ≥13.",
    back_md:
      "Postpartum psychosis carries high infanticide and suicide risk — admit (ideally Mother-Baby Unit), urgent psychiatry, antipsychotic ± lithium ± ECT. Sertraline is preferred SSRI in lactation. Always ask about baby-care thoughts and whether the mother feels safe to be alone with the infant.",
    citation: "COPE perinatal CPG · RANZCP perinatal",
    mark_sheet_domain: "safety_net",
    amc_part: "both",
    ai_generated: false,
  },
  {
    id: "fc-psych-022",
    specialty: "psychiatry",
    subtopic: "Communication + cultural safety",
    front_md:
      "Breaking bad news in psychiatry uses {{c1::SPIKES — Setting, Perception, Invitation, Knowledge, Emotions, Strategy/Summary}}; for Aboriginal and Torres Strait Islander patients, frame mental health within the {{c2::social and emotional wellbeing (SEWB)}} model.",
    back_md:
      "SEWB encompasses connection to body, mind/emotions, family/kin, community, culture, Country, and spirituality — not just absence of illness. Offer Aboriginal Health Worker / Liaison Officer, ask about Sorry Business, normalise stigma, and use plain English. Document cultural considerations in the plan.",
    citation: "Gee SEWB framework · RACGP · RANZCP cultural safety",
    mark_sheet_domain: "communication",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
];
