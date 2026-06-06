import type {Flashcard} from "./flashcards";

// Hand-derived seed cards covering AMC CAT 1 + CAT 2 infectious-diseases high-yield,
// with deliberate AU-specific emphasis (eTG Antibiotic, ASHM, NIP, NT melioidosis).
export const infectiousDiseasesFlashcards: Flashcard[] = [
  {
    id: "fc-id-001",
    specialty: "infectious_diseases",
    subtopic: "CAP empirical therapy",
    front_md:
      "eTG empirical therapy for moderate-severity community-acquired pneumonia in a non-allergic adult admitted to ward is {{c1::benzylpenicillin IV plus doxycycline PO}} (or oral amoxicillin + doxycycline if mild).",
    back_md:
      "Severe CAP (SMART-COP ≥3, ICU) → ceftriaxone + azithromycin IV. Atypical cover (doxycycline/azithromycin) is non-negotiable in moderate/severe disease. CURB-65 and SMART-COP guide disposition. Get blood cultures and a sputum Gram stain BEFORE antibiotics where feasible.",
    citation: "eTG Antibiotic v2024 · TSANZ CAP",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-id-002",
    specialty: "infectious_diseases",
    subtopic: "UTI empirical therapy",
    front_md:
      "First-line empirical therapy for uncomplicated lower UTI in a non-pregnant adult per eTG is {{c1::trimethoprim 300 mg PO daily for 3 days}} or {{c2::nitrofurantoin 100 mg PO BD for 5 days}}.",
    back_md:
      "Avoid nitrofurantoin if eGFR <45 (poor urinary concentration, neuropathy risk). Pregnancy: nitrofurantoin (avoid at term) or cefalexin; treat asymptomatic bacteriuria. Recurrent UTI (≥2/6 mo or ≥3/yr) → consider non-antibiotic prophylaxis, vaginal oestrogen post-menopause.",
    citation: "eTG Antibiotic · RACGP",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-id-003",
    specialty: "infectious_diseases",
    subtopic: "Cellulitis empirical therapy",
    front_md:
      "eTG empirical therapy for non-purulent mild cellulitis in a non-allergic adult is {{c1::flucloxacillin 500 mg PO QID}} (or di/cefalexin); IV flucloxacillin or cefazolin if severe.",
    back_md:
      "Purulent cellulitis/abscess → cover MRSA (clindamycin or trimethoprim-sulfamethoxazole) plus drainage. Mark the leading edge, elevate, treat dermatophyte tinea pedis as a portal. Failure to improve at 48 h → reconsider DVT, necrotising fasciitis, MRSA, atypical organisms.",
    citation: "eTG Antibiotic · RACGP",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-id-004",
    specialty: "infectious_diseases",
    subtopic: "Meningitis empirical therapy",
    front_md:
      "Suspected bacterial meningitis in an immunocompetent adult — give {{c1::ceftriaxone 2 g IV + dexamethasone 10 mg IV}} (add benzylpenicillin or amoxicillin if Listeria risk: >50 y, pregnant, immunocompromised).",
    back_md:
      "Do NOT delay antibiotics for LP or imaging if clinical suspicion is high. CT before LP only if focal neurology, GCS <12, seizure, immunocompromise. Dexamethasone given with/before first antibiotic dose reduces neurological sequelae in pneumococcal meningitis. Notifiable disease — phone the public health unit.",
    citation: "eTG Antibiotic · TSANZ",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-id-005",
    specialty: "infectious_diseases",
    subtopic: "Sepsis bundle",
    front_md:
      "AMC sepsis hour-1 bundle: measure {{c1::serum lactate}}, take {{c2::blood cultures before antibiotics}}, give broad-spectrum antibiotics, start 30 mL/kg crystalloid if hypotensive or lactate ≥4, and vasopressors for MAP <65 unresponsive to fluids.",
    back_md:
      "Empirical for sepsis of unknown source in an immunocompetent adult: gentamicin + flucloxacillin (or vancomycin if MRSA risk) + metronidazole, or piperacillin-tazobactam monotherapy. Source control (drain abscess, remove line) is non-negotiable.",
    citation: "Surviving Sepsis 2021 · eTG Antibiotic",
    mark_sheet_domain: "mgmt",
    amc_part: "both",
    ai_generated: false,
  },
  {
    id: "fc-id-006",
    specialty: "infectious_diseases",
    subtopic: "MRSA Australia",
    front_md:
      "In Australia, community-acquired MRSA (notably {{c1::ST93 'Queensland clone'}}) is often susceptible to clindamycin and trimethoprim-sulfamethoxazole; healthcare-associated MRSA is typically multi-resistant and requires {{c2::IV vancomycin or linezolid}} for severe disease.",
    back_md:
      "Vancomycin target trough 15-20 mg/L for serious infections; consider AUC-guided dosing. Decolonisation (mupirocin nasal + chlorhexidine wash 5 days) for recurrent skin infection or surgical prophylaxis. Always send swabs/cultures before empirical anti-MRSA cover.",
    citation: "eTG Antibiotic · AGAR surveillance",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-id-007",
    specialty: "infectious_diseases",
    subtopic: "Tuberculosis screening",
    front_md:
      "For an IMG with prior BCG vaccination, the preferred latent-TB screening test is {{c1::interferon-gamma release assay (IGRA, e.g. QuantiFERON)}} because it is unaffected by {{c2::BCG cross-reactivity}}.",
    back_md:
      "Active TB: sputum AFB ×3 + GeneXpert MTB/RIF + CXR. Standard regimen 6-month RIPE (rifampicin + isoniazid + pyrazinamide + ethambutol for 2 months, then RH for 4). Add pyridoxine to prevent INH neuropathy. Notifiable; contact tracing via state TB service.",
    citation: "eTG Antibiotic · NTAC AU · ASID",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-id-008",
    specialty: "infectious_diseases",
    subtopic: "HIV diagnosis and ART",
    front_md:
      "First-line HIV screening is a {{c1::4th-generation Ag/Ab combination assay}} (detects p24 antigen + IgG/IgM). On confirmed diagnosis ART is now started {{c2::within days, not weeks}} — same-day initiation where feasible.",
    back_md:
      "U=U: a person with sustained undetectable viral load CANNOT transmit HIV sexually. PrEP (tenofovir-emtricitabine daily) is PBS-listed for HIV-negative people at substantial risk. PEP within 72 h, ideally <24 h, of high-risk exposure — 28 days of tenofovir-emtricitabine + dolutegravir.",
    citation: "ASHM HIV · PBS · Australian STI Guidelines",
    mark_sheet_domain: "mgmt",
    amc_part: "both",
    ai_generated: false,
  },
  {
    id: "fc-id-009",
    specialty: "infectious_diseases",
    subtopic: "Hepatitis B serology",
    front_md:
      "Hep B pattern HBsAg positive, anti-HBs negative, total anti-HBc positive with {{c1::IgM anti-HBc positive}} = acute infection; the same pattern with {{c2::IgG anti-HBc positive (IgM negative)}} for >6 months = chronic infection.",
    back_md:
      "Resolved past infection = HBsAg negative, anti-HBs positive, anti-HBc positive. Vaccinated = HBsAg negative, anti-HBs positive, anti-HBc NEGATIVE. Susceptible = all negative. Isolated anti-HBc → consider occult HBV; check HBV DNA before immunosuppression.",
    citation: "ASHM hep B decision-making · RACGP",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-id-010",
    specialty: "infectious_diseases",
    subtopic: "Hepatitis C treatment",
    front_md:
      "Hep C confirmed by positive antibody + detectable HCV RNA is treated in Australia with pangenotypic DAAs — {{c1::glecaprevir-pibrentasvir 8 weeks}} or {{c2::sofosbuvir-velpatasvir 12 weeks}} — prescribed by any GP under the s100 Highly Specialised Drugs scheme.",
    back_md:
      "No specialist referral needed for non-cirrhotic patients. Always check HBsAg before starting (reactivation risk). SVR12 >95%. Re-infection in ongoing risk: re-test annually with HCV RNA, not antibody.",
    citation: "ASHM HCV consensus · PBS s100 · Hepatitis Australia",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-id-011",
    specialty: "infectious_diseases",
    subtopic: "Syphilis treatment",
    front_md:
      "Diagnosis combines a non-treponemal test (VDRL/RPR) with a treponemal test (TPPA/EIA). First-line treatment for primary, secondary or early latent syphilis is {{c1::IM benzathine penicillin G 1.8 g (2.4 million units) single dose}}; late latent or unknown duration requires {{c2::3 weekly doses}}.",
    back_md:
      "Jarisch-Herxheimer reaction in first 24 h — warn patient. Congenital syphilis is re-emerging in Australia (notably northern Australia / ATSI populations); antenatal screening at booking and at 28-32 weeks in high-prevalence areas. Notifiable; partner notification mandatory.",
    citation: "Australian STI Management Guidelines · ASHM",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-id-012",
    specialty: "infectious_diseases",
    subtopic: "Chlamydia and gonorrhoea",
    front_md:
      "NAAT is the test of choice (urine in men, self-collected vaginal swab in women). First-line for uncomplicated genital chlamydia is {{c1::doxycycline 100 mg PO BD for 7 days}}; for gonorrhoea (AU 2025) {{c2::ceftriaxone 500 mg IM single dose + azithromycin 1 g PO}}.",
    back_md:
      "Doxycycline > azithromycin for rectal chlamydia and LGV. Test of cure not routine for chlamydia but mandatory for pharyngeal gonorrhoea at 2 weeks. RETEST all positives at 3 months (re-infection rate ~20%). Partner notification within last 6 months (chlamydia) / 2 months (gonorrhoea).",
    citation: "Australian STI Management Guidelines 2025 · eTG",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-id-013",
    specialty: "infectious_diseases",
    subtopic: "Influenza",
    front_md:
      "Influenza antiviral {{c1::oseltamivir 75 mg PO BD for 5 days}} reduces severity if started within {{c2::48 hours}} of symptom onset; prioritise high-risk groups (pregnancy, immunosuppressed, chronic disease, ≥65, ATSI, residential aged care).",
    back_md:
      "Free annual influenza vaccine on the NIP for ATSI ≥6 months, pregnancy, ≥65, ≥6 months with chronic medical conditions, and all children 6 months-5 years. Diagnosis: rapid PCR multiplex (flu A/B + RSV + SARS-CoV-2). Notifiable in most states.",
    citation: "Australian Immunisation Handbook · eTG · NIP",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-id-014",
    specialty: "infectious_diseases",
    subtopic: "COVID-19 antivirals",
    front_md:
      "Oral antivirals for COVID-19 must be started within {{c1::5 days of symptom onset}}: nirmatrelvir-ritonavir (Paxlovid) PBS Authority for high-risk; molnupiravir (Lagevrio) as alternative if {{c2::drug interactions preclude Paxlovid}}.",
    back_md:
      "Paxlovid eligibility (current PBS): ≥70 y; ≥50 y with 2+ risk factors; ≥18 y immunocompromised or ATSI ≥30 with 1 risk factor. Massive ritonavir interaction profile — check statins, anticoagulants, immunosuppressants. Isolation guidelines now risk-based; mask 7 days, stay home while symptomatic.",
    citation: "PBS Schedule · Department of Health AU · NCET",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-id-015",
    specialty: "infectious_diseases",
    subtopic: "Pertussis treatment",
    front_md:
      "Pertussis treatment in adults is {{c1::azithromycin 500 mg day 1 then 250 mg days 2-5}} (or clarithromycin / cotrimoxazole); {{c2::doxycycline is NOT effective}} against Bordetella pertussis.",
    back_md:
      "Antibiotics within 21 days of cough onset reduce transmission but not symptom duration. ATAGI schedule: 6w/4m/6m/18m/4y DTPa; adolescent dTpa 12-13 y; adult dTpa with every pregnancy 20-32 wks (cocooning). Notifiable. Macrolide prophylaxis for high-risk contacts <6 mo.",
    citation: "Australian Immunisation Handbook · eTG · ATAGI",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-id-016",
    specialty: "infectious_diseases",
    subtopic: "Q fever",
    front_md:
      "Q fever (Coxiella burnetii) is an occupational risk in {{c1::abattoir workers, farmers and rural veterinarians}}; treatment is {{c2::doxycycline 100 mg BD for 14 days}}.",
    back_md:
      "Pre-vaccination workup before Q-VAX: skin test + serology — never vaccinate if previously exposed (severe local/systemic reaction). Notifiable. Chronic Q fever (endocarditis, vascular graft infection) needs prolonged doxycycline + hydroxychloroquine 18+ months.",
    citation: "eTG · ASID · Department of Health AU",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-id-017",
    specialty: "infectious_diseases",
    subtopic: "Melioidosis NT",
    front_md:
      "Melioidosis (Burkholderia pseudomallei) is endemic to the Top End of the NT and northern WA/QLD, peaking in the {{c1::wet-season monsoon}}; intensive-phase treatment is IV {{c2::ceftazidime or meropenem for 2-4 weeks}}, followed by eradication with oral cotrimoxazole 3-6 months.",
    back_md:
      "Risk factors: diabetes, hazardous alcohol use, CKD, immunosuppression, ATSI. Presentations: pneumonia, sepsis, abscesses (liver/spleen/prostate), septic arthritis. Notifiable; mortality 10-20% even with treatment. Send blood cultures and warn lab (BSL-3).",
    citation: "eTG · ASID · NT Health melioidosis guideline",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-id-018",
    specialty: "infectious_diseases",
    subtopic: "Arboviruses AU",
    front_md:
      "A returned bushwalker with polyarthralgia, fatigue and a maculopapular rash, with serology positive for {{c1::Ross River virus}}, requires {{c2::supportive care only}} — there is no specific antiviral.",
    back_md:
      "Notifiable. Arthralgia may persist months. Murray Valley encephalitis (and Japanese encephalitis since 2022 spread) → rare but severe, supportive care, ICU. Mosquito avoidance is the key prevention message: DEET, long sleeves, avoid dawn/dusk, screens.",
    citation: "Department of Health AU · ASID arboviruses",
    mark_sheet_domain: "ddx",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-id-019",
    specialty: "infectious_diseases",
    subtopic: "Dengue warning signs",
    front_md:
      "Dengue WHO warning signs (mandating admission) include {{c1::severe abdominal pain, persistent vomiting, mucosal bleeding, lethargy, hepatomegaly, rising haematocrit with falling platelets}}; treatment is {{c2::supportive — paracetamol, IV fluids, NO NSAIDs/aspirin}}.",
    back_md:
      "Returned traveller, especially SE Asia / Pacific. Diagnosis: NS1 antigen (days 1-7) + IgM/IgG serology. Severe dengue follows defervescence. Avoid aspirin/NSAIDs (bleeding risk). Notifiable. Second infection with a different serotype = higher severe-disease risk.",
    citation: "WHO Dengue · Department of Health AU · ASID",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-id-020",
    specialty: "infectious_diseases",
    subtopic: "Malaria",
    front_md:
      "Suspected malaria in a returned traveller is investigated with {{c1::thick and thin blood films plus rapid diagnostic test (RDT)}}, repeated 12-24 hourly ×3 if initial negative; {{c2::P. falciparum}} can cause severe disease and is treated with artemisinin-based combination therapy (artemether-lumefantrine or IV artesunate if severe).",
    back_md:
      "Severe falciparum (parasitaemia >2%, end-organ dysfunction, altered consciousness) — IV artesunate + ICU. Notifiable. Always escalate to ID. Counsel future travellers on chemoprophylaxis (atovaquone-proguanil, doxycycline, mefloquine) and bite avoidance.",
    citation: "eTG · ASID · Department of Health AU",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-id-021",
    specialty: "infectious_diseases",
    subtopic: "Notifiable diseases",
    front_md:
      "Common nationally notifiable diseases requiring state public-health unit notification include {{c1::TB, measles, meningococcal disease, pertussis, syphilis, HIV, hepatitis A/B/C, COVID-19, Q fever, Ross River virus, malaria}}.",
    back_md:
      "Notification is a legal obligation; phone the local PHU for urgent diseases (meningococcal, measles, foodborne outbreaks). Public-health response includes contact tracing, post-exposure prophylaxis (e.g. rifampicin/ciprofloxacin for meningococcal contacts), and outbreak control. Document the notification in the patient record.",
    citation: "Department of Health AU NNDSS · state PHU guidelines",
    mark_sheet_domain: "safety_net",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
];
