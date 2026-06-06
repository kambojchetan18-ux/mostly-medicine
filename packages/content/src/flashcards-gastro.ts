import type {Flashcard} from "./flashcards";

// Hand-derived seed cards covering AMC CAT 1 + CAT 2 gastroenterology high-yield.
// Mirrors flashcards-cardiology.ts conventions — cloze ≤2, AU-cited, no fluff.
export const gastroFlashcards: Flashcard[] = [
  {
    id: "fc-gastro-001",
    specialty: "gastroenterology",
    subtopic: "GORD red flags",
    front_md:
      "AMC clinical: red flags in a dyspepsia/GORD presentation that mandate {{c1::urgent upper endoscopy}} include weight loss, dysphagia, melaena, anaemia, persistent vomiting, and new symptoms in a patient aged {{c2::≥55}}.",
    back_md:
      "Mnemonic ALARM: Anaemia, Loss of weight, Anorexia, Recent onset/progressive, Melaena/haematemesis. RACGP and eTG both gate routine PPI trials below 55 unless red flags are present.",
    citation: "RACGP Red Book · eTG Gastrointestinal",
    mark_sheet_domain: "safety_net",
    amc_part: "both",
    ai_generated: false,
  },
  {
    id: "fc-gastro-002",
    specialty: "gastroenterology",
    subtopic: "GORD step-down",
    front_md:
      "After 8 weeks of standard-dose PPI for uncomplicated GORD, the goal is {{c1::step down to the lowest effective dose or on-demand PPI}} — not indefinite full-dose therapy.",
    back_md:
      "PBS Authority restricts continuous high-dose PPI beyond 8 weeks without documented oesophagitis. Long-term PPI is linked to B12/Mg deficiency, fracture risk, and C. difficile. Lifestyle: weight loss, avoid late meals, head-of-bed elevation.",
    citation: "PBS Schedule · Murtagh 8th ed · eTG GI",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-gastro-003",
    specialty: "gastroenterology",
    subtopic: "H. pylori testing",
    front_md:
      "For a 32-year-old with uncomplicated dyspepsia and no red flags, the preferred non-invasive H. pylori test is the {{c1::urea breath test or faecal antigen}} — perform {{c2::after 2 weeks off PPI and 4 weeks off antibiotics}}.",
    back_md:
      "Serology cannot distinguish past from current infection and is not recommended for primary diagnosis or test-of-cure. Endoscopic biopsy + rapid urease test reserved for patients undergoing OGD anyway.",
    citation: "eTG Gastrointestinal · RACGP",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-gastro-004",
    specialty: "gastroenterology",
    subtopic: "H. pylori triple therapy",
    front_md:
      "First-line H. pylori eradication in Australia per eTG is {{c1::esomeprazole 20 mg + amoxicillin 1 g + clarithromycin 500 mg, all BD for 7 days}}.",
    back_md:
      "Penicillin-allergic: substitute metronidazole 400 mg BD. Retest cure with UBT or faecal antigen ≥4 weeks after completion. Second-line (after clarithromycin failure) = PPI + amoxicillin + metronidazole + bismuth.",
    citation: "eTG Gastrointestinal v2024",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-gastro-005",
    specialty: "gastroenterology",
    subtopic: "IBD UC vs Crohn",
    front_md:
      "Continuous mucosal inflammation from the rectum proximally, limited to the {{c1::colon}}, with crypt abscesses and goblet-cell loss → {{c2::ulcerative colitis}}.",
    back_md:
      "Crohn's is patchy, transmural, can involve anywhere mouth-to-anus (terminal ileum classic), with skip lesions, fistulae, granulomas, and perianal disease. Smoking worsens Crohn's but is paradoxically protective in UC.",
    citation: "GESA IBD Toolkit · Murtagh 8th ed",
    mark_sheet_domain: "ddx",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-gastro-006",
    specialty: "gastroenterology",
    subtopic: "IBD biologics",
    front_md:
      "For moderate-to-severe IBD failing thiopurines, PBS-subsidised biologic options include {{c1::infliximab, adalimumab, vedolizumab, ustekinumab}} — TB screening with {{c2::IGRA + CXR}} is mandatory before commencement.",
    back_md:
      "Hep B serology, HIV and varicella status also required. Anti-TNF therapy reactivates latent TB. Vedolizumab (gut-selective α4β7) and ustekinumab (IL-12/23) preferred when systemic immunosuppression must be minimised.",
    citation: "PBS Authority · GESA position statement",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-gastro-007",
    specialty: "gastroenterology",
    subtopic: "IBS Rome IV",
    front_md:
      "Rome IV diagnostic criteria for IBS: recurrent abdominal pain ≥{{c1::1 day per week in the last 3 months}}, associated with ≥2 of — related to defecation, change in stool frequency, change in stool form.",
    back_md:
      "Rome IV dropped 'discomfort' (too vague) and tightened the frequency from 3 days/month to weekly. IBS-C, IBS-D, IBS-M and IBS-U subtypes. Diagnosis is positive — full coeliac serology and FBE/CRP/faecal calprotectin to exclude mimics.",
    citation: "Rome Foundation IV · GESA IBS",
    mark_sheet_domain: "knowledge",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-gastro-008",
    specialty: "gastroenterology",
    subtopic: "Low-FODMAP",
    front_md:
      "First-line dietary intervention for IBS, with the strongest AU evidence base (Monash University), is the {{c1::3-phase low-FODMAP diet}} delivered by an {{c2::Accredited Practising Dietitian}}.",
    back_md:
      "Phase 1 elimination 2-6 weeks, phase 2 systematic reintroduction, phase 3 personalisation. Self-directed indefinite restriction risks micronutrient deficiency and dysbiosis — always refer to APD via Chronic Disease Management plan.",
    citation: "Monash University · GESA IBS",
    mark_sheet_domain: "mgmt",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-gastro-009",
    specialty: "gastroenterology",
    subtopic: "Coeliac diagnosis",
    front_md:
      "First-line serology for coeliac disease in an immunocompetent adult is {{c1::anti-tTG IgA plus total IgA}}. The patient must remain on a {{c2::gluten-containing diet}} for the test to be valid.",
    back_md:
      "Selective IgA deficiency (1:200 prevalence) gives false-negative IgA serology → use IgG-DGP or IgG-tTG. Confirm with duodenal biopsy (Marsh ≥2) before lifelong gluten-free diet. HLA DQ2/DQ8 useful only to rule out (>99% NPV).",
    citation: "GESA coeliac · Murtagh 8th ed",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-gastro-010",
    specialty: "gastroenterology",
    subtopic: "Dermatitis herpetiformis",
    front_md:
      "Intensely pruritic symmetrical vesicles on extensor surfaces (elbows, knees, buttocks) with granular IgA on direct immunofluorescence = {{c1::dermatitis herpetiformis}}, the cutaneous manifestation of {{c2::coeliac disease}}.",
    back_md:
      "Treat with strict gluten-free diet ± dapsone for rapid symptom relief. Even asymptomatic GI patients have enteropathy on biopsy. Check G6PD before starting dapsone (haemolysis risk).",
    citation: "AAD · GESA coeliac",
    mark_sheet_domain: "ddx",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-gastro-011",
    specialty: "gastroenterology",
    subtopic: "Hepatitis B serology",
    front_md:
      "Hep B pattern HBsAg negative, anti-HBs positive, anti-HBc negative → {{c1::vaccine-induced immunity}}. Same pattern with anti-HBc positive → {{c2::resolved past infection}}.",
    back_md:
      "Quick table: Acute = HBsAg+ / IgM anti-HBc+. Chronic = HBsAg+ >6 months / IgG anti-HBc+. Window period = anti-HBc IgM+ only. Susceptible = all markers negative. Isolated anti-HBc+ → occult infection vs false positive; consider HBV DNA.",
    citation: "ASHM hep B decision-making · RACGP",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-gastro-012",
    specialty: "gastroenterology",
    subtopic: "Hepatitis B serology",
    front_md:
      "Hep B serology HBsAg positive, IgM anti-HBc positive, HBeAg positive, anti-HBs negative → {{c1::acute hepatitis B with high infectivity}}.",
    back_md:
      "HBeAg positive = active viral replication and high transmissibility (relevant to needlestick counselling and antenatal management). Pregnant women HBV DNA >200,000 IU/mL get tenofovir from 28 weeks to prevent vertical transmission, plus HBIG + vaccine to the neonate at birth.",
    citation: "ASHM hep B · RACGP antenatal",
    mark_sheet_domain: "investigations",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-gastro-013",
    specialty: "gastroenterology",
    subtopic: "Hepatitis C diagnosis",
    front_md:
      "Initial test for hepatitis C is the {{c1::anti-HCV antibody}}; a positive result is confirmed and active infection established by {{c2::HCV RNA PCR}}.",
    back_md:
      "Antibody persists lifelong after spontaneous clearance or successful treatment — does not equal current infection. All MBS-funded antibody-positive patients qualify for one-off HCV RNA + genotype. Document discussion of partner notification at diagnosis.",
    citation: "ASHM hep C consensus · RACGP",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-gastro-014",
    specialty: "gastroenterology",
    subtopic: "Hepatitis C DAA",
    front_md:
      "Standard PBS-listed DAA regimens for non-cirrhotic adults with hepatitis C in Australia are pangenotypic — {{c1::glecaprevir-pibrentasvir for 8 weeks}} or {{c2::sofosbuvir-velpatasvir for 12 weeks}}.",
    back_md:
      "GPs can prescribe under the s100 Highly Specialised Drugs scheme — no specialist referral required for non-cirrhotic patients. SVR12 (sustained virological response at 12 weeks) >95% across genotypes. Test HBsAg before starting (HBV reactivation risk).",
    citation: "PBS Schedule · ASHM HCV monograph",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-gastro-015",
    specialty: "gastroenterology",
    subtopic: "Haemochromatosis",
    front_md:
      "The most common cause of hereditary haemochromatosis in Australia is {{c1::homozygous HFE C282Y}}, with a carrier rate of approximately {{c2::1 in 200}} in Anglo-Celtic Australians.",
    back_md:
      "Diagnostic workflow: fasting transferrin saturation >45% + ferritin elevated → HFE genotyping. Treatment is weekly venesection 500 mL until ferritin <50, then maintenance 3-4×/year. Screen first-degree relatives.",
    citation: "RACGP Red Book · GESA haemochromatosis",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-gastro-016",
    specialty: "gastroenterology",
    subtopic: "Wilson's disease",
    front_md:
      "A young adult with new neuropsychiatric symptoms, deranged LFTs and {{c1::low serum caeruloplasmin and Kayser-Fleischer rings on slit-lamp}} should be investigated for {{c2::Wilson's disease}}.",
    back_md:
      "Confirm with 24-hour urinary copper (>100 µg) and liver biopsy copper. ATP7B mutation testing for family screening. Treat with penicillamine or trientine ± zinc. Untreated Wilson's is fatal; presents 5-35 years.",
    citation: "AASLD · GESA · Murtagh 8th",
    mark_sheet_domain: "ddx",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-gastro-017",
    specialty: "gastroenterology",
    subtopic: "Upper GI bleed Glasgow-Blatchford",
    front_md:
      "A Glasgow-Blatchford score of {{c1::0}} in upper GI bleeding identifies a very-low-risk patient suitable for {{c2::outpatient management without endoscopy}}.",
    back_md:
      "GBS uses urea, Hb, SBP, HR, melaena, syncope, hepatic disease, cardiac failure — pre-endoscopy and bedside-computable. Higher scores predict need for transfusion, endoscopic intervention, or death. Rockall is calculated post-endoscopy.",
    citation: "BSG UGI bleed · TG Gastrointestinal",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-gastro-018",
    specialty: "gastroenterology",
    subtopic: "Variceal bleed",
    front_md:
      "Acute variceal haemorrhage in a known cirrhotic — pre-endoscopic management includes {{c1::IV terlipressin (or octreotide) plus IV ceftriaxone}} and urgent OGD within 12 hours.",
    back_md:
      "Antibiotics cut mortality independent of bleeding control (SBP risk). Restrictive transfusion target Hb 70-80. Endoscopic band ligation is first-line; TIPSS reserved for refractory bleeding. Add carvedilol or propranolol for secondary prevention.",
    citation: "Baveno VII · GESA portal hypertension",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-gastro-019",
    specialty: "gastroenterology",
    subtopic: "NBCSP",
    front_md:
      "Under the National Bowel Cancer Screening Program, an average-risk Australian is mailed an iFOBT every {{c1::2 years from age 45 to 74}} (lowered from 50 in 2024).",
    back_md:
      "Positive iFOBT → colonoscopy within 30 days target. NBCSP cuts CRC mortality by ~25% with full participation; only ~44% of kits are currently returned. RACGP recommends opportunistic prompting at every consult in the age band.",
    citation: "Department of Health AU · NBCSP 2024 update · RACGP Red Book",
    mark_sheet_domain: "knowledge",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-gastro-020",
    specialty: "gastroenterology",
    subtopic: "CRC high-risk surveillance",
    front_md:
      "A patient with one first-degree relative diagnosed with CRC under age 55 is in NHMRC Category {{c1::2}} and should start colonoscopy every 5 years from age {{c2::50 (or 10 years earlier than the affected relative)}}.",
    back_md:
      "Category 1 = average risk, iFOBT 45-74. Category 2 = moderately increased (~3× risk). Category 3 = potentially high (FAP, Lynch suspected) — refer to familial cancer service. Lynch screening starts age 25 with annual colonoscopy.",
    citation: "NHMRC CRC surveillance · Cancer Council AU",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-gastro-021",
    specialty: "gastroenterology",
    subtopic: "Safety net GI bleed",
    front_md:
      "AMC clinical safety-net for a patient discharged after a low-risk UGI bleed: 'If you pass any {{c1::black tarry stool, fresh blood, or vomit anything resembling coffee grounds}}, or you feel light-headed when standing — return to ED immediately, do not drive yourself.'",
    back_md:
      "Specific descriptors + specific action + transport advice = full safety-net marks. Document the conversation. Arrange GP follow-up within 1 week for PPI step-down review and H. pylori testing if not already done.",
    citation: "AMC clinical examiner notes · eTG GI",
    mark_sheet_domain: "safety_net",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
];
