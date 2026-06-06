import type {Flashcard} from "./flashcards";

// Hand-derived seed cards covering AMC CAT 1 + CAT 2 obstetrics & gynaecology high-yield.
// Mirrors flashcards-gastro.ts conventions — cloze ≤2, AU-cited, no fluff.
export const obgynFlashcards: Flashcard[] = [
  {
    id: "fc-obgyn-001",
    specialty: "obstetrics_gynaecology",
    subtopic: "Pregnancy dating",
    front_md:
      "Naegele's rule for estimated date of delivery: take the {{c1::first day of the last menstrual period}}, add 1 year, subtract 3 months, then add {{c2::7 days}}.",
    back_md:
      "Accuracy assumes a regular 28-day cycle. First-trimester dating ultrasound (CRL between 7-13+6 weeks) is more accurate than LMP and should override the menstrual estimate if the discrepancy is >7 days in T1. Re-dating after T1 is uncommon — the booking USS is the gold standard.",
    citation: "RANZCOG antenatal care · Murtagh 8th ed",
    mark_sheet_domain: "knowledge",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-obgyn-002",
    specialty: "obstetrics_gynaecology",
    subtopic: "Antenatal schedule",
    front_md:
      "Routine AU antenatal visit milestones — booking {{c1::8-10 weeks}}, combined first-trimester screening 11-13+6, anomaly scan 19-20, OGTT {{c2::24-28 weeks}}, GBS swab 35-37.",
    back_md:
      "Visit cadence: 4-weekly to 28, fortnightly to 36, weekly to delivery for a low-risk primip. Anti-D 250 IU at 28 + 34 weeks for all Rh-negative women regardless of antibody status. Whooping cough (dTpa) and influenza vaccination offered every pregnancy after 20 weeks.",
    citation: "RANZCOG antenatal care guideline · NSW Maternity 2024",
    mark_sheet_domain: "knowledge",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-obgyn-003",
    specialty: "obstetrics_gynaecology",
    subtopic: "First-trimester screening",
    front_md:
      "Combined first-trimester screening (11-13+6 weeks) integrates maternal age, {{c1::nuchal translucency on USS, PAPP-A and free β-hCG}}. NIPT (cell-free fetal DNA) is offered from {{c2::10 weeks}} as a more sensitive alternative for T21/T18/T13.",
    back_md:
      "NIPT detection rate for T21 >99% with FPR <0.1%, but is not MBS-rebated — patient pays ~$400-500. Combined first-trimester screening remains MBS-funded. NIPT screen-positive results still require diagnostic CVS or amniocentesis for karyotype before any termination decision.",
    citation: "RANZCOG prenatal screening · MBS",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-obgyn-004",
    specialty: "obstetrics_gynaecology",
    subtopic: "Booking bloods",
    front_md:
      "Routine first-visit antenatal bloods include {{c1::FBE, blood group + antibody screen, rubella IgG, syphilis, HIV, hep B sAg, hep C antibody}} plus MSU and ferritin. {{c2::Hep B sAg}} positive triggers neonatal HBIG + vaccine within 12 hours of birth.",
    back_md:
      "Universal screening for HIV/HBV/HCV/syphilis is recommended in every pregnancy (RACGP/RANZCOG). Add varicella IgG if uncertain history. Vitamin D and thyroid function only if risk factors. Asymptomatic bacteriuria on MSU is treated to prevent pyelonephritis + preterm labour.",
    citation: "RANZCOG antenatal · RACGP Red Book",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-obgyn-005",
    specialty: "obstetrics_gynaecology",
    subtopic: "Periconceptional folate",
    front_md:
      "Periconceptional folic acid dose for low-risk women is {{c1::0.5 mg daily from at least 1 month pre-conception until 12 weeks gestation}}. High-risk women (T1DM, epilepsy on valproate/carbamazepine, prior NTD, BMI >30) need {{c2::5 mg daily}}.",
    back_md:
      "Folate reduces NTD risk ~70%. Iodine 150 µg daily is also recommended preconception through breastfeeding (NHMRC). Vitamin A supplementation is contraindicated (teratogenic). Counsel patients on diabetes optimisation (HbA1c <6.5%) before conception.",
    citation: "NHMRC · RANZCOG preconception care",
    mark_sheet_domain: "mgmt",
    amc_part: "both",
    ai_generated: false,
  },
  {
    id: "fc-obgyn-006",
    specialty: "obstetrics_gynaecology",
    subtopic: "Pre-eclampsia diagnosis",
    front_md:
      "Pre-eclampsia after 20 weeks gestation: BP ≥ {{c1::140/90}} on two occasions ≥4 hours apart, plus proteinuria (PCR ≥30 mg/mmol) OR end-organ dysfunction — including renal, hepatic (raised transaminases), neurological, haematological ({{c2::platelets <100}}), or fetal growth restriction.",
    back_md:
      "SOMANZ criteria allow diagnosis without proteinuria if end-organ involvement present. Severe features: BP ≥160/110, platelets <100, transaminases >2× ULN, creatinine >90, pulmonary oedema, headache/visual disturbance, eclampsia. HELLP variant carries ~1% maternal mortality.",
    citation: "SOMANZ HTN in pregnancy 2023 · RANZCOG",
    mark_sheet_domain: "ddx",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-obgyn-007",
    specialty: "obstetrics_gynaecology",
    subtopic: "Pre-eclampsia management",
    front_md:
      "First-line antihypertensives in pregnancy are {{c1::labetalol, nifedipine, or methyldopa}}. For severe pre-eclampsia or eclampsia, {{c2::IV magnesium sulfate 4 g loading then 1 g/hour}} is given for seizure prophylaxis.",
    back_md:
      "ACEi/ARBs and atenolol are contraindicated (fetal renal injury, IUGR). Delivery is the only cure — timing balances maternal risk vs prematurity. Aim BP <140/90. Continue MgSO4 24 hours postpartum or 24 hours after last seizure. Monitor for Mg toxicity: loss of patellar reflex, RR <12.",
    citation: "SOMANZ 2023 · RANZCOG eclampsia",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-obgyn-008",
    specialty: "obstetrics_gynaecology",
    subtopic: "Gestational diabetes",
    front_md:
      "ADIPS GDM diagnostic thresholds on 75 g OGTT at 24-28 weeks: fasting ≥ {{c1::5.1 mmol/L}}, 1 hour ≥ 10.0, 2 hour ≥ {{c2::8.5 mmol/L}} — any one value is diagnostic.",
    back_md:
      "First-line therapy is medical nutrition therapy + SMBG (fasting <5.0, 2-hour postprandial <6.7). Add metformin or insulin if targets not met after 1-2 weeks. Postnatal 75 g OGTT at 6-12 weeks to detect persisting T2DM. Lifetime T2DM risk ~50% — annual screening recommended.",
    citation: "ADIPS GDM 2014 · RANZCOG · RACGP Red Book",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-obgyn-009",
    specialty: "obstetrics_gynaecology",
    subtopic: "Primary PPH",
    front_md:
      "Causes of primary PPH (>500 mL vaginal / >1000 mL Caesarean within 24 h) — the {{c1::4 Ts}}: Tone (atony, ~70%), Trauma, Tissue (retained products), Thrombin (coagulopathy). First-line for atony is {{c2::bimanual uterine compression and IV oxytocin 5-10 IU}}.",
    back_md:
      "Stepwise: oxytocin → ergometrine 250 µg IM (avoid in HTN/pre-eclampsia) → carboprost 250 µg IM (avoid in asthma) → misoprostol 800 µg PR. Add tranexamic acid 1 g IV early (WOMAN trial). Surgical: Bakri balloon, B-Lynch suture, uterine artery ligation, hysterectomy as last resort. Activate massive transfusion protocol if estimated blood loss >1500 mL.",
    citation: "RANZCOG PPH · WOMAN trial · NSW Maternity",
    mark_sheet_domain: "mgmt",
    amc_part: "both",
    ai_generated: false,
  },
  {
    id: "fc-obgyn-010",
    specialty: "obstetrics_gynaecology",
    subtopic: "Postpartum mental health",
    front_md:
      "Screen all women at the 6-week postnatal visit with the {{c1::Edinburgh Postnatal Depression Scale}}; a score ≥ {{c2::13}} or any positive response to the self-harm item warrants urgent perinatal mental health referral.",
    back_md:
      "Baby blues: ~50-80%, peaks day 3-5, resolves <2 weeks, reassurance only. Postnatal depression: 10-15%, persists >2 weeks, treat with CBT ± sertraline (preferred in breastfeeding). Postpartum psychosis: 1-2/1000, abrupt onset days-weeks, psychiatric emergency — admit to mother-baby unit, lithium/antipsychotic.",
    citation: "COPE perinatal MH guideline · RANZCP",
    mark_sheet_domain: "communication",
    amc_part: "both",
    ai_generated: false,
  },
  {
    id: "fc-obgyn-011",
    specialty: "obstetrics_gynaecology",
    subtopic: "LARC counselling",
    front_md:
      "First-line contraception per AU guidelines (Tier 1, >99% efficacy) are {{c1::LARCs — copper IUD (5-10 yr), Mirena IUS (8 yr), or Implanon NXT etonogestrel implant (3 yr)}}. Counselling must include {{c2::fitting/insertion procedure, expected bleeding pattern, return-to-fertility on removal}}.",
    back_md:
      "Mirena reduces menstrual loss ~90% and is first-line for HMB. Copper IUD is hormone-free but increases period volume ~20%. Implanon: irregular bleeding in ~50%, weight neutral, return to fertility within days of removal. STI screen before IUD insertion. Quick-start rule: any LARC can be inserted any cycle day if pregnancy reasonably excluded.",
    citation: "FSRH UK + adopted by RANZCOG · Family Planning AU",
    mark_sheet_domain: "communication",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-obgyn-012",
    specialty: "obstetrics_gynaecology",
    subtopic: "COCP contraindications",
    front_md:
      "UKMEC category 4 (absolute) contraindications to the combined oral contraceptive pill include {{c1::migraine with aura, current breast cancer, smoker ≥35 years smoking ≥15/day, BP ≥160/100, known VTE / thrombophilia}}, and {{c2::<6 weeks postpartum if breastfeeding}}.",
    back_md:
      "Category 3 (risks outweigh benefits) covers BMI ≥35, controlled hypertension, smoker ≥35 <15/day, immobility, age >50. Progestogen-only options (POP, implant, DMPA, LNG-IUS) are safe in nearly all of these. Always check BP and BMI before prescribing COCP and document UKMEC category in notes.",
    citation: "UKMEC 2016 · Family Planning AU",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-obgyn-013",
    specialty: "obstetrics_gynaecology",
    subtopic: "Emergency contraception",
    front_md:
      "Emergency contraception windows in Australia: {{c1::levonorgestrel 1.5 mg up to 72 hours}}, ulipristal acetate 30 mg up to 120 hours, and {{c2::copper IUD up to 5 days}} after unprotected intercourse (or 5 days post-ovulation — most effective).",
    back_md:
      "Copper IUD failure rate <0.1% — by far the most effective EC. LNG-EC efficacy drops with BMI >26; UPA preferred or double-dose LNG. UPA delays the resumption of hormonal contraception by 5 days (progestogen blocks the action). Provide ongoing contraception and STI screen at the same consult.",
    citation: "Family Planning AU EC · RANZCOG",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-obgyn-014",
    specialty: "obstetrics_gynaecology",
    subtopic: "Cervical screening",
    front_md:
      "Australian National Cervical Screening Program: primary {{c1::HPV test every 5 years from age 25 to 74}}. Self-collection from a vaginal swab is offered as an {{c2::equally valid option}} for all eligible women.",
    back_md:
      "Pathway: HPV not detected → routine recall 5y. HPV 16/18 detected → direct colposcopy. Other oncogenic HPV → reflex LBC; LSIL/normal → 12-month repeat HPV; HSIL → colposcopy. Exit screening at 70-74 with two negative HPV tests. Symptomatic bleeding always warrants co-test regardless of screening interval.",
    citation: "NCSP 2022 · Cancer Council AU",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-obgyn-015",
    specialty: "obstetrics_gynaecology",
    subtopic: "Menopause + MHT",
    front_md:
      "Menopause is diagnosed clinically after {{c1::12 months of amenorrhoea}} in a woman of typical age (45-55). FSH is {{c2::unreliable in perimenopause}} (fluctuates) and not required for diagnosis.",
    back_md:
      "Menopausal hormone therapy is first-line for moderate-severe vasomotor symptoms in healthy women within 10 years of menopause (timing hypothesis). Oestrogen + progestogen if uterus present; oestrogen alone if hysterectomised. Topical vaginal oestrogen is safe for GSM even in breast cancer survivors (after MDT discussion). Re-review annually.",
    citation: "AMS MHT position statement · RACGP",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-obgyn-016",
    specialty: "obstetrics_gynaecology",
    subtopic: "PCOS Rotterdam",
    front_md:
      "Rotterdam diagnostic criteria for PCOS require {{c1::2 of 3}} after exclusion of mimics (thyroid, hyperprolactinaemia, CAH, Cushing): oligo-/anovulation, clinical or biochemical hyperandrogenism, and polycystic ovaries on USS ({{c2::≥20 follicles per ovary or ovarian volume >10 mL}}).",
    back_md:
      "AU/International PCOS guideline (Monash 2023) updated USS thresholds upward. Screen all PCOS women for metabolic syndrome — fasting lipids, OGTT, BP. First-line for menstrual regulation = COCP. Metformin for impaired glucose tolerance or weight management. Letrozole first-line for ovulation induction (NOT clomiphene since 2018).",
    citation: "International PCOS Guideline 2023 (Monash) · RANZCOG",
    mark_sheet_domain: "ddx",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-obgyn-017",
    specialty: "obstetrics_gynaecology",
    subtopic: "Endometriosis",
    front_md:
      "Classic triad of endometriosis: {{c1::cyclical pelvic pain, secondary dysmenorrhoea, deep dyspareunia}} — often with subfertility. First-line empirical Rx (no need for laparoscopy first) is {{c2::NSAIDs + COCP continuous, or progestogen (dienogest, LNG-IUS)}}.",
    back_md:
      "Laparoscopy is the diagnostic + therapeutic gold standard (visual + biopsy + excision/ablation) — reserve for failed medical Rx, fertility workup, or suspicious mass. GnRH analogues with add-back HRT for severe refractory disease. Adenomyosis is a related diagnosis (boggy tender uterus, MRI/USS).",
    citation: "RANZCOG endometriosis · National Action Plan AU 2018",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-obgyn-018",
    specialty: "obstetrics_gynaecology",
    subtopic: "Heavy menstrual bleeding",
    front_md:
      "Stepwise medical management of HMB without structural pathology: {{c1::LNG-IUS (Mirena)}} first-line, then tranexamic acid 1 g TDS during menses, NSAIDs, COCP, oral progestogens, with {{c2::endometrial ablation or hysterectomy}} reserved for failed medical therapy.",
    back_md:
      "Investigate all HMB: FBE + ferritin + TFTs + coagulation screen if menarcheal/family Hx. Pelvic USS for structural lesions (fibroids, polyps). Endometrial biopsy if age >45, persistent intermenstrual bleeding, or risk factors for endometrial cancer (obesity, PCOS, tamoxifen).",
    citation: "NICE HMB · RANZCOG",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-obgyn-019",
    specialty: "obstetrics_gynaecology",
    subtopic: "Ectopic pregnancy",
    front_md:
      "Suspect ectopic pregnancy in any positive βhCG with an empty uterus on TVUS and serum βhCG > {{c1::1500 IU/L (discriminatory zone)}}. Methotrexate is appropriate for {{c2::haemodynamically stable patients with βhCG <5000, no fetal heartbeat, mass <3.5 cm, no significant pain}}.",
    back_md:
      "Surgical management (laparoscopic salpingectomy preferred over salpingotomy if contralateral tube healthy) for ruptured, unstable, or methotrexate-contraindicated cases. Anti-D 250 IU IM to all Rh-negative women. Repeat βhCG weekly until <5 IU/L. Counsel re recurrence risk ~10% and future fertility.",
    citation: "RANZCOG ectopic · NSW Maternity",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-obgyn-020",
    specialty: "obstetrics_gynaecology",
    subtopic: "Miscarriage management",
    front_md:
      "Three accepted management options for confirmed first-trimester miscarriage are {{c1::expectant (up to 2 weeks), medical (misoprostol 800 µg PV ± mifepristone), or surgical (suction D&C)}}. {{c2::Anti-D 250 IU IM}} is required for all Rh-negative women regardless of method.",
    back_md:
      "Confirm non-viability with TVUS (CRL ≥7 mm no FH, or MSD ≥25 mm empty sac, or no growth after 7-14 days). Provide written info, follow-up urine βhCG at 3 weeks, and emotional support — refer to Pink Elephants or SANDS. Recurrent miscarriage (≥3) warrants thrombophilia screen + karyotype + uterine imaging.",
    citation: "RANZCOG early pregnancy loss · NSW EPAS",
    mark_sheet_domain: "mgmt",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-obgyn-021",
    specialty: "obstetrics_gynaecology",
    subtopic: "Pregnancy loss counselling",
    front_md:
      "AMC OSCE pregnancy loss counselling: open with {{c1::acknowledge the loss + offer condolences, use the language of 'baby' if she has}} (mirror her words), warn-shot before USS findings, and avoid {{c2::'at least you can try again' / minimising language}}.",
    back_md:
      "Structure (SPIKES): Setting (private, sit at eye level, tissues), Perception, Invitation, Knowledge (clear non-medical language), Empathy ('I am so sorry'), Strategy + Summary. Discuss management options non-directively. Offer chaplain/cultural support and written info. Document partner present and consent. Arrange GP and EPAS follow-up.",
    citation: "AMC clinical examiner notes · COPE · SANDS AU",
    mark_sheet_domain: "communication",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
];
