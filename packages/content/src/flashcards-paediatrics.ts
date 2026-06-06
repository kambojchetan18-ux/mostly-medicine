import type {Flashcard} from "./flashcards";

// Hand-derived seed cards covering AMC CAT 1 + CAT 2 paediatrics high-yield.
// Mirrors flashcards-gastro.ts conventions — cloze ≤2, AU-cited, no fluff.
export const paediatricsFlashcards: Flashcard[] = [
  {
    id: "fc-paeds-001",
    specialty: "paediatrics",
    subtopic: "AU immunisation schedule",
    front_md:
      "Australian Immunisation Handbook NIP schedule (key timepoints): birth = {{c1::hepatitis B monovalent}}; 2/4/6 months = DTPa-IPV-HepB-Hib + rotavirus + 13vPCV; 12 months = Hib + MenACWY + MMR + 13vPCV; 18 months = DTPa + VZV + MMR; 4 years = DTPa-IPV + MMR; 12-13 years = {{c2::HPV9 + DTPa}}.",
    back_md:
      "ATSI children additionally receive meningococcal B at 2/4/12 months (PBS-funded since 2023), and 23vPPV at 4 years. Rotavirus has strict upper age cut-offs (1st dose before 15 weeks, last by 24 weeks). Year 10 catch-up MenACWY. Influenza annually from 6 months. COVID per ATAGI age-specific advice.",
    citation: "Australian Immunisation Handbook · ATAGI · NIP",
    mark_sheet_domain: "knowledge",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-paeds-002",
    specialty: "paediatrics",
    subtopic: "Bronchiolitis",
    front_md:
      "Acute bronchiolitis in an infant <12 months — pathogen is usually {{c1::RSV}}, and management is {{c2::supportive only (minimal handling, oxygen if SpO2 <92%, NG/IV hydration)}}; salbutamol, steroids and antibiotics are NOT routinely indicated.",
    back_md:
      "PREDICT bronchiolitis guideline (ANZCOR-aligned): admit if apnoea, persistent SpO2 <92%, severe respiratory distress, poor feeding (<50% intake), social concerns. High-flow nasal cannulae for moderate disease. Salbutamol is not effective <12 months (β2 receptor immaturity) and may worsen V/Q mismatch. Most cases peak day 3-5 and resolve by day 7-10.",
    citation: "PREDICT bronchiolitis 2023 · RCH Melbourne CPG",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-paeds-003",
    specialty: "paediatrics",
    subtopic: "Croup",
    front_md:
      "Croup (laryngotracheobronchitis) — barking cough, inspiratory stridor, hoarse voice in a 6 m-6 yr child. Mild-moderate disease is treated with a single dose of {{c1::oral dexamethasone 0.15-0.6 mg/kg}}. Severe disease with stridor at rest adds {{c2::nebulised adrenaline 0.5 mL/kg of 1:1000 (max 5 mL)}}.",
    back_md:
      "Westley croup score guides severity. Minimise distress (keep child on parent's lap, avoid tongue depressor — risk of complete obstruction). Discharge after 4 hours observation if no stridor at rest. Reattend if recurrent stridor, drooling, drowsiness. Differential: epiglottitis (rare since Hib vaccine — toxic, drooling, tripod posture), bacterial tracheitis, foreign body.",
    citation: "RCH Melbourne croup CPG · ANZCOR",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-paeds-004",
    specialty: "paediatrics",
    subtopic: "Paediatric asthma acute",
    front_md:
      "Acute moderate asthma in a child ≥6 years: give {{c1::salbutamol 4-12 puffs via spacer every 20 minutes for one hour}} plus oral prednisolone {{c2::1-2 mg/kg (max 50 mg) for 3 days}}. Reassess after each burst.",
    back_md:
      "Severe/life-threatening asthma: continuous nebulised salbutamol + ipratropium, IV hydrocortisone, IV magnesium sulfate 50 mg/kg, consider aminophylline or salbutamol infusion. Children <6 years use 2-6 puffs salbutamol per dose. Spacer is equivalent to nebuliser for mild-moderate disease and preferred (less aerosolisation, less hypoxaemia rebound).",
    citation: "Australian Asthma Handbook paediatric · RCH CPG",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-paeds-005",
    specialty: "paediatrics",
    subtopic: "Febrile infant <3 months",
    front_md:
      "Any infant {{c1::<28 days old with fever ≥38.0°C}} requires admission, full septic screen (FBE, CRP, blood culture, urine, LP) and empirical IV antibiotics — {{c2::cefotaxime + amoxicillin (covering Listeria + GBS + E. coli)}}.",
    back_md:
      "Infants 1-3 months with low-risk features (well-appearing, normal urinalysis, WCC 5-15, ANC <10, CRP <20) may be observed without LP if validated low-risk pathway followed (e.g. PECARN, Step-by-Step). Add aciclovir if HSV features (vesicles, seizures, transaminitis). Do NOT delay antibiotics for LP if shocked.",
    citation: "RCH febrile infant CPG · PREDICT",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-paeds-006",
    specialty: "paediatrics",
    subtopic: "Kawasaki disease",
    front_md:
      "Kawasaki disease diagnosis: fever ≥{{c1::5 days}} plus 4 of 5 (CRASH-Burn) — Conjunctivitis (non-purulent), Rash (polymorphous), Adenopathy (cervical ≥1.5 cm), Strawberry tongue + lip cracking, Hand/foot erythema-oedema-desquamation. Treat with {{c2::IVIG 2 g/kg + high-dose aspirin 30-50 mg/kg/day}}.",
    back_md:
      "Coronary artery aneurysm is the dreaded complication (~25% untreated, <5% treated). IVIG within 10 days of fever onset. Echocardiography at diagnosis, 2 weeks, 6-8 weeks. Aspirin continued at low dose (3-5 mg/kg) until echo normal. Incomplete Kawasaki: fever ≥5 days + 2-3 criteria + raised inflammatory markers — treat empirically.",
    citation: "RCH Kawasaki CPG · AHA scientific statement",
    mark_sheet_domain: "ddx",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-paeds-007",
    specialty: "paediatrics",
    subtopic: "Paediatric anaphylaxis",
    front_md:
      "First-line in paediatric anaphylaxis is {{c1::IM adrenaline 0.01 mg/kg (max 0.5 mg) into the lateral thigh}}, repeated every {{c2::5 minutes if no response}}. Autoinjector doses: 0.15 mg for 7.5-20 kg, 0.3 mg for >20 kg.",
    back_md:
      "ABCDE, oxygen, supine with legs elevated (NEVER stand up — empty SVC syndrome). IV fluids 20 mL/kg if hypotensive. Adjuncts (steroids, antihistamines) are NOT first-line and do not replace adrenaline. Observation ≥4 hours post-resolution; longer if biphasic risk. Discharge with adrenaline autoinjector x2, ASCIA action plan, allergist referral.",
    citation: "ASCIA anaphylaxis guidelines · ANZCOR paediatric",
    mark_sheet_domain: "mgmt",
    amc_part: "both",
    ai_generated: false,
  },
  {
    id: "fc-paeds-008",
    specialty: "paediatrics",
    subtopic: "Paediatric DKA",
    front_md:
      "Paediatric DKA fluid resuscitation — only give bolus ({{c1::10 mL/kg 0.9% NaCl}}) if shocked, then replace deficit slowly over {{c2::48 hours}} to minimise cerebral oedema risk. Do NOT give bicarbonate.",
    back_md:
      "Insulin infusion 0.05-0.1 unit/kg/hour started 1 hour after fluids commenced (delays the fluid-driven osmolar shift). Cerebral oedema (mortality ~25%) presents with headache, GCS drop, bradycardia, hypertension — treat with mannitol 0.5-1 g/kg or 3% saline 3-5 mL/kg, reduce fluid rate. Monitor K+ closely; add KCl once K+ <5.5 and urine output established.",
    citation: "APEG paediatric DKA · RCH CPG",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-paeds-009",
    specialty: "paediatrics",
    subtopic: "Paediatric gastroenteritis",
    front_md:
      "First-line for mild-moderate paediatric gastroenteritis is {{c1::oral rehydration solution (Hydralyte / Gastrolyte)}}, small frequent sips. {{c2::Antimotility agents (loperamide) and anti-emetics other than single-dose ondansetron}} are not recommended.",
    back_md:
      "Severe dehydration → NG ORS preferred over IV (faster, less hyponatraemia). IV 0.9% NaCl 20 mL/kg bolus if shocked. Single oral ondansetron 0.1-0.15 mg/kg can reduce vomiting and IV need. Continue breastfeeding throughout. Zinc not routine in Australia. Red flags for admission: <6 months, severe dehydration, social concerns, bilious vomiting, blood in stool.",
    citation: "RCH gastroenteritis CPG · NHMRC",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-paeds-010",
    specialty: "paediatrics",
    subtopic: "Developmental red flags",
    front_md:
      "Developmental red flags requiring referral: {{c1::no social smile by 8 weeks, no sitting unsupported by 9 months, not walking by 18 months}}, no single words by 18 months, no two-word phrases by 2 years, and {{c2::any loss of previously acquired skill at any age}}.",
    back_md:
      "Universal screening at 6-week, 8-month, 18-month and 4-year MCH checks (varies by state). Persistent primitive reflexes after 6 months, asymmetric movement, hand preference before 18 months — all warrant neurology + developmental paediatrics referral. Don't 'wait and see' for language delay — early referral for hearing test + speech pathology.",
    citation: "RACGP Red Book · NSW Personal Health Record",
    mark_sheet_domain: "knowledge",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-paeds-011",
    specialty: "paediatrics",
    subtopic: "Failure to thrive",
    front_md:
      "Failure to thrive: weight {{c1::<3rd centile or crossing 2 major centile lines downwards}} on the WHO growth chart. Plot {{c2::weight, length/height, and head circumference}} on age-appropriate charts at every visit.",
    back_md:
      "Functional (inadequate intake) is far more common than organic. Targeted history: feeding (volumes, frequency, technique), stool/urine output, parental height, psychosocial. Examination: dysmorphism, organomegaly. Investigations only if organic suspected (FBE, U&E, LFT, TFT, coeliac serology, urinalysis, sweat test if indicated). Early dietitian + paediatrician input.",
    citation: "RACGP child health · RCH growth CPG",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-paeds-012",
    specialty: "paediatrics",
    subtopic: "ADHD",
    front_md:
      "DSM-5-TR ADHD criteria require ≥6 symptoms of inattention and/or hyperactivity-impulsivity for {{c1::≥6 months}}, in ≥{{c2::2 settings}}, before age 12, with functional impairment. First-line pharmacotherapy = stimulants (methylphenidate, dexamfetamine, lisdexamfetamine).",
    back_md:
      "Australian stimulant prescribing requires paediatrician or psychiatrist authority (state-specific). Baseline ECG only if cardiac history. Side effects: appetite suppression, sleep disturbance, growth velocity reduction, tics. Non-stimulants (atomoxetine, guanfacine) second-line. Always combine with behavioural strategies + school liaison + parent training.",
    citation: "AADPA ADHD guideline 2022 · NHMRC",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-paeds-013",
    specialty: "paediatrics",
    subtopic: "Autism screening",
    front_md:
      "The recommended screening tool for autism in toddlers aged {{c1::16-30 months}} is the {{c2::M-CHAT-R/F}}. DSM-5 ASD diagnosis requires persistent deficits in social communication AND restricted/repetitive behaviours, present from early development.",
    back_md:
      "M-CHAT positive (score ≥3) → follow-up interview, then refer to multidisciplinary diagnostic team (paediatrician + speech + psych). NDIS access available pre-diagnosis under 'developmental delay' code for under-7s. Address co-occurring intellectual disability, anxiety, sleep, GI issues. Early intervention (ESDM, ABA-derived therapies) within first 3 years has strongest evidence.",
    citation: "Autism CRC national guideline 2018 · DSM-5-TR",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-paeds-014",
    specialty: "paediatrics",
    subtopic: "Acute otitis media",
    front_md:
      "Uncomplicated AOM in a child >2 years with mild symptoms → {{c1::watchful waiting with adequate analgesia for 48 hours}} before antibiotics. First-line antibiotic when indicated is {{c2::amoxicillin 15 mg/kg TDS for 5 days}}.",
    back_md:
      "Antibiotics indicated if: <6 months age, <2 years bilateral, immunocompromise, perforation, systemically unwell, or no improvement after 48 hours observation. ATSI children → treat all AOM promptly (high CSOM/hearing loss risk). Amoxicillin-clavulanate if no response or recurrent within 30 days. Refer ENT for recurrent (≥3 episodes/6 months or ≥4/12 months) — consider grommets.",
    citation: "TG Antibiotic · RCH AOM CPG · OMA guidelines",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-paeds-015",
    specialty: "paediatrics",
    subtopic: "Paediatric URTI",
    front_md:
      "Uncomplicated URTI in a child = {{c1::viral, no antibiotics indicated}}. Safety-net advice: return if {{c2::fever >5 days, increasing work of breathing, drowsiness, dehydration, neck stiffness, non-blanching rash}}.",
    back_md:
      "AMC examiners look for: explicit fluids advice, analgesia (paracetamol 15 mg/kg q4-6h, ibuprofen 10 mg/kg q6-8h if >3 months and well-hydrated), avoid OTC cough/cold preparations <6 years (TGA warning), and written safety-net (e.g. RCH Kids Health Info handout). Use a 'red book' or e-record to document the discussion.",
    citation: "TG Antibiotic · RACGP · TGA cough/cold advisory",
    mark_sheet_domain: "safety_net",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-paeds-016",
    specialty: "paediatrics",
    subtopic: "Eczema management",
    front_md:
      "Mainstay of paediatric atopic dermatitis is {{c1::liberal daily emollients (≥250 g/week) + topical corticosteroids of appropriate potency to the affected site}}. For severe flares add {{c2::wet wrap dressings for 24-72 hours}}.",
    back_md:
      "Face/groin → mild TCS (hydrocortisone 1%). Body → moderate (methylprednisolone aceponate / mometasone) once daily for 7-14 days. Use FTU (fingertip unit) guide. Treat infection: bleach baths weekly, oral cephalexin if Staph crust. Refer dermatology for failed therapy. Address triggers: heat, soap, fragrance, dust mite, food allergens only if RAST/SPT positive with clinical correlation.",
    citation: "ASCIA eczema action plan · TG Dermatology · RCH CPG",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-paeds-017",
    specialty: "paediatrics",
    subtopic: "Iron deficiency anaemia",
    front_md:
      "Highest-risk groups for paediatric iron deficiency are {{c1::6-24 month olds, particularly preterm infants, those on prolonged unmodified cow's milk >500 mL/day, and ATSI children}}. First-line therapy is {{c2::oral elemental iron 3-6 mg/kg/day for 3 months}}.",
    back_md:
      "Cow's milk before 12 months and >500 mL/day after = major preventable cause (low iron, gut microbleed, displaces solids). Investigate with FBE + ferritin + CRP (acute phase elevates ferritin). Dietary: red meat 2-3x/week from 6 months, iron-fortified cereal, vitamin C with meals. Recheck Hb at 6 weeks; ferritin at 3 months.",
    citation: "RACGP Red Book · RCH iron deficiency CPG",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-paeds-018",
    specialty: "paediatrics",
    subtopic: "Foreign body aspiration",
    front_md:
      "Sudden onset of {{c1::choking, coughing or new unilateral wheeze in a previously well toddler}} is foreign body aspiration until proven otherwise. Investigation of choice for a stable child is {{c2::inspiratory and expiratory CXR (or lateral decubitus) — looking for air trapping and mediastinal shift}}.",
    back_md:
      "Common at 1-3 years (food: peanut, grape, hot dog; small toys). Definitive Rx = rigid bronchoscopy under GA. Do NOT perform blind finger sweep. ANZCOR paediatric BLS for unconscious choking: 5 back blows, 5 chest thrusts (infants) / abdominal thrusts (>1 year). Counsel families on age-appropriate foods + supervised eating.",
    citation: "ANZCOR paediatric BLS · RCH FB aspiration CPG",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-paeds-019",
    specialty: "paediatrics",
    subtopic: "Vaccine hesitancy",
    front_md:
      "AMC OSCE vaccine hesitancy conversation: open with {{c1::elicit specific concerns and acknowledge them without dismissing}}, use motivational interviewing, share personal recommendation as the child's GP, and offer {{c2::written info (Immunisation Handbook consumer fact sheet) plus a follow-up appointment}}.",
    back_md:
      "Avoid lecturing or fear-tactics. Validate that no parent wants to harm their child. Frame as 'protection for your baby and the community' (herd immunity). Schedule deviation: catch-up via Australian Immunisation Register catch-up calculator. No Jab No Pay/No Play affects Family Tax Benefit + childcare. Document refusal and re-offer at every visit.",
    citation: "Australian Immunisation Handbook · NCIRS · RACGP",
    mark_sheet_domain: "communication",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-paeds-020",
    specialty: "paediatrics",
    subtopic: "Child protection",
    front_md:
      "All medical practitioners in Australia are {{c1::mandatory reporters of suspected child abuse and neglect}} to the relevant state child protection agency (e.g. {{c2::DCJ in NSW, DFFH in Victoria}}). Report on reasonable suspicion — no need to be certain.",
    back_md:
      "Red flags: injuries inconsistent with developmental stage, delayed presentation, inconsistent story, multiple bruises in different stages, bruises in non-mobile infant, burns with pattern, posterior rib fractures, retinal haemorrhages. Document verbatim. Reporter identity is confidential. Familiarise with local child protection unit at major paediatric hospitals (e.g. CPU at Westmead, RCH Gatehouse).",
    citation: "AIFS mandatory reporting · RACGP child protection",
    mark_sheet_domain: "safety_net",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-paeds-021",
    specialty: "paediatrics",
    subtopic: "Minor head injury",
    front_md:
      "PECARN low-risk criteria for paediatric minor head injury (GCS 14-15) — children at very low risk of clinically important TBI and able to be discharged without CT include {{c1::no LOC, no vomiting, no severe mechanism, no signs of basal skull fracture, normal mental status, no scalp haematoma (if <2 years)}}.",
    back_md:
      "Observation 4-6 hours in ED is reasonable in equivocal cases — outperforms immediate CT for reducing radiation exposure. Sport-related concussion: AIS/SCAT-5 tool, removal from play same day, graduated return-to-learn before return-to-play, no return until asymptomatic + medical clearance. AIS 'when in doubt, sit them out'.",
    citation: "PECARN · Australian Concussion in Sport position · RCH CPG",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
];
