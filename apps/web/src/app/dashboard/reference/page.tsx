"use client";

import { useState } from "react";

interface ReferenceEntry {
  title: string;
  content: string;
}

interface ReferenceSection {
  heading: string;
  entries: ReferenceEntry[];
}

const referenceData: {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  sections: ReferenceSection[];
}[] = [
  {
    id: "redbook",
    title: "RACGP Red Book",
    subtitle: "Guidelines for Preventive Activities in General Practice (10th Ed)",
    icon: "📕",
    color: "border-red-200 bg-red-50",
    sections: [
      {
        heading: "Cancer Screening",
        entries: [
          {
            title: "Cervical Cancer",
            content: "Cervical Screening Test (HPV-based): commence at age 25, every 5 years until age 74. No co-test needed. Women who have never been sexually active do not require screening.",
          },
          {
            title: "Breast Cancer",
            content: "BreastScreen Australia: mammogram every 2 years for women aged 50–74. Women aged 40–49 and 75+ can self-refer. BRCA1/2 carriers: annual MRI + mammogram from age 30.",
          },
          {
            title: "Colorectal Cancer",
            content: "National Bowel Cancer Screening Program: FOBT (iFOBT) every 2 years from age 50–74. Colonoscopy if positive result. Those with first-degree relative with CRC: colonoscopy at 55 or 10 years before youngest affected relative.",
          },
          {
            title: "Skin Cancer",
            content: "No national organised program. Opportunistic skin examination in high-risk individuals (fair skin, history of sunburn, family history of melanoma). Sun protection counselling for all.",
          },
        ],
      },
      {
        heading: "Cardiovascular Risk",
        entries: [
          {
            title: "Absolute CVD Risk Assessment",
            content: "Use Australian CVD Risk Calculator for adults 45–74 (or 30–74 for Aboriginal/Torres Strait Islander peoples). Assess lipids, BP, smoking, diabetes, BMI, family history. Classify as low (<10%), moderate (10–15%), high (>15%) 5-year risk.",
          },
          {
            title: "Blood Pressure",
            content: "Screen all adults ≥18 years: if normal (<120/80), recheck in 2 years. Stage 1 HTN (130–139/80–89): lifestyle + medication if high CVD risk. Stage 2 (≥140/90): medication. Target BP: <130/80 for most; <140/90 in elderly.",
          },
          {
            title: "Lipids",
            content: "Fasting lipids at age 45 (or 35 for Aboriginal/Torres Strait Islander). More frequent if risk factors. Statin therapy based on absolute CVD risk, not individual lipid values alone.",
          },
        ],
      },
      {
        heading: "Diabetes",
        entries: [
          {
            title: "Type 2 Diabetes Monitoring",
            content: "HbA1c every 3–6 months (6-monthly if well controlled). Annual: lipids, eGFR, urine ACR, foot examination, blood pressure. Retinal examination annually (biennial if no retinopathy and well controlled). Dental review annually.",
          },
          {
            title: "Diabetes Screening",
            content: "Screen adults ≥40 years (≥18 for high-risk groups: Aboriginal/TSI, Pacific Islander, family history, previous GDM, BMI >30, CVD). AUSDRISK score ≥12: offer fasting glucose or HbA1c. Repeat every 3 years if normal.",
          },
        ],
      },
      {
        heading: "Mental Health Screening",
        entries: [
          {
            title: "Depression",
            content: "Two-question screen (PHQ-2): 'Over the last 2 weeks, have you felt down, depressed or hopeless?' and 'little interest or pleasure in doing things?'. If positive, proceed to PHQ-9 for severity.",
          },
          {
            title: "Postnatal Depression",
            content: "EPDS at 6–8 weeks and 3–4 months postpartum (some recommend at 6 months also). Score ≥13 = likely PND. Score ≥10 with suicidal ideation (item 10): urgent assessment.",
          },
          {
            title: "Alcohol",
            content: "AUDIT-C: 3-question screen for hazardous/harmful drinking. Screen adults ≥18 annually. Offer brief intervention for risky drinking (>10 standard drinks/week or >4 on any occasion).",
          },
        ],
      },
      {
        heading: "Immunisation",
        entries: [
          {
            title: "Adult Vaccines (NIP)",
            content: "Influenza: annually for all ≥65, pregnant women, high-risk groups. Pneumococcal: 23vPPV at 65 (or 15vPCV + 23vPPV for high-risk). Shingles (Shingrix): 50+ years. Pertussis (dTpa): each pregnancy (28–32 weeks).",
          },
          {
            title: "HPV Vaccine",
            content: "9vHPV (Gardasil 9): 2 doses at age 12–13 (school program). Catch-up to age 25. Recommended regardless of previous Gardasil 4 vaccination.",
          },
        ],
      },
    ],
  },
  {
    id: "murtagh",
    title: "John Murtagh's General Practice",
    subtitle: "Diagnostic approach & clinical pearls",
    icon: "📗",
    color: "border-green-200 bg-green-50",
    sections: [
      {
        heading: "Diagnostic Approach",
        entries: [
          {
            title: "Murtagh's Diagnostic Model",
            content: "For every presenting complaint ask:\n1. What is the probability diagnosis?\n2. What serious disorders must not be missed?\n3. What conditions are often missed (masquerades)?\n4. Is the patient trying to tell me something else? (hidden agenda)\n5. Could this be a functional disorder?",
          },
          {
            title: "Masquerades (The Great Mimics)",
            content: "Always consider these when diagnosis is unclear:\n• Depression\n• Diabetes mellitus\n• Drugs (prescribed and illicit)\n• Anaemia\n• Thyroid disease\n• Spinal dysfunction\n• Urinary tract infection",
          },
        ],
      },
      {
        heading: "Chest Pain",
        entries: [
          {
            title: "Probability Diagnosis",
            content: "Most common: musculoskeletal (costochondritis, rib injury), anxiety/panic, GORD. Serious: ACS, PE, aortic dissection, tension pneumothorax, oesophageal rupture.",
          },
          {
            title: "Red Flags",
            content: "Radiation to arm/jaw, diaphoresis, nausea, haemodynamic instability → ACS. Tearing pain radiating to back → aortic dissection (immediate CT). Pleuritic pain + dyspnoea + risk factors → PE.",
          },
          {
            title: "Key Pearl",
            content: "All chest pain patients: do a 12-lead ECG. Troponin at 0 and 3 hours. Never discharge chest pain without a working diagnosis.",
          },
        ],
      },
      {
        heading: "Headache",
        entries: [
          {
            title: "Probability Diagnosis",
            content: "95% are primary: tension-type (most common), migraine, cluster. Secondary causes (5%) must be excluded in new-onset headache or atypical features.",
          },
          {
            title: "Red Flags (SNOOP4)",
            content: "Systemic symptoms/disease, Neurological signs, Onset sudden (thunderclap), Older age (>50 new headache), Postural change, Papilloedema, Progressive worsening, Pregnancy.",
          },
          {
            title: "Thunderclap Headache",
            content: "Worst headache of life, maximal at onset = SAH until proven otherwise. CT head (sensitivity ~93%). If CT negative, LP at ≥12 hours for xanthochromia. Never discharge without excluding SAH.",
          },
        ],
      },
      {
        heading: "Abdominal Pain",
        entries: [
          {
            title: "Probability by Location",
            content: "RUQ: biliary colic, cholecystitis, hepatitis. LUQ: pancreatitis, splenic. RLQ: appendicitis, ovarian cyst/torsion, ectopic. LLQ: diverticulitis, IBD. Epigastric: peptic ulcer, GORD, pancreatitis. Periumbilical: early appendicitis, small bowel.",
          },
          {
            title: "Don't Miss in Women",
            content: "Ectopic pregnancy (check beta-hCG in ALL women of reproductive age). Ovarian torsion (severe unilateral pain, N&V, pelvic mass). PID (fever, cervical motion tenderness).",
          },
        ],
      },
      {
        heading: "Back Pain",
        entries: [
          {
            title: "Red Flags",
            content: "Cauda equina: bilateral leg weakness, bladder/bowel dysfunction, saddle anaesthesia → EMERGENCY, urgent MRI and surgical referral.\nOther red flags: age <20 or >55 new onset, history of cancer, fever, weight loss, night pain, steroid use, trauma.",
          },
          {
            title: "Management",
            content: "Non-specific LBP: stay active (avoid bed rest), NSAIDs, physiotherapy. Most resolve in 6 weeks. Sciatica without red flags: conservative for 6 weeks before imaging. Psychosocial factors (yellow flags) are strong predictors of chronicity.",
          },
        ],
      },
    ],
  },
  {
    id: "handbook",
    title: "AMC Handbook",
    subtitle: "AMC Handbook of Clinical Assessment — MCAT Performance Guidelines",
    icon: "📙",
    color: "border-orange-200 bg-orange-50",
    sections: [
      {
        heading: "MCAT Structure & Format",
        entries: [
          {
            title: "Overview",
            content: "The AMC Multi-station Clinical Assessment Test (MCAT) is a 16-station OSCE. Each station: 2 minutes reading time + 8 minutes performance time. Candidates must pass 12 of 16 stations. Marked on a 4-point scale per domain.\n\nThe exam assesses whether internationally trained doctors can practise safely in the Australian healthcare system.",
          },
          {
            title: "Station Categories",
            content: "C — Clinical Communication (history taking, counselling, patient education, breaking bad news)\nD — Clinical Diagnosis (history + examination to reach a diagnosis)\nM — Clinical Management (investigations, treatment, follow-up)\nD/M — Integrated Diagnosis & Management\nLEO — Legal, Ethical & Organisational issues\n\nThe 16 stations span all five categories across 151 possible scenario conditions.",
          },
          {
            title: "14 Assessment Domains",
            content: "1. History-taking\n2. Physical examination\n3. Investigations\n4. Diagnosis\n5. Management\n6. Health promotion & disease prevention\n7. Communication\n8. Patient education\n9. Cultural sensitivity\n10. Medicolegal & ethical issues\n11. Emergency management\n12. Procedural skills\n13. Record keeping\n14. Teamwork & referral",
          },
          {
            title: "4-Point Marking Scale",
            content: "0 — Not attempted / completely inadequate\n1 — Below the expected standard (significant deficiencies)\n2 — At the expected standard (meets requirements with minor gaps)\n3 — Above the expected standard (exceeds requirements)\n\nEach station has a defined set of expected competencies. Critical errors = automatic fail for that station.",
          },
        ],
      },
      {
        heading: "Performance Guidelines Structure",
        entries: [
          {
            title: "Aims of Station",
            content: "Each scenario has a stated Aims of Station that tells you what the examiner is actually testing. You must satisfy the aims to pass.\n\nCommon aims: 'To assess the candidate's ability to take a focused history and establish a probable diagnosis', 'To assess communication skills in delivering difficult news', 'To assess knowledge of management of [condition]'.",
          },
          {
            title: "Examiner Instructions",
            content: "Each station includes:\n• Opening statement — what the patient says first (verbatim)\n• Patient role notes — what the patient volunteers vs what they reveal only if asked\n• Patient questions — what the patient may ask the doctor\n• Physical examination findings — provided only if the candidate performs/requests examination",
          },
          {
            title: "Expectations of Candidate Performance",
            content: "Explicitly listed competencies examiners look for:\n• Data gathering: appropriate history, targeted questions\n• Clinical reasoning: correct diagnosis, relevant differentials\n• Management: appropriate investigations and treatment\n• Communication: empathy, explanation, non-judgmental attitude\n• Safety: recognising urgency, appropriate referral",
          },
          {
            title: "Critical Errors",
            content: "Actions that automatically fail a station regardless of other performance:\n• Missing an immediately life-threatening condition\n• Prescribing a contraindicated medication\n• Breaching patient confidentiality inappropriately\n• Performing an examination without consent\n• Missing mandatory notification requirements\n• Failing to recognise a safeguarding issue",
          },
        ],
      },
      {
        heading: "Category C — Clinical Communication",
        entries: [
          {
            title: "What is Tested",
            content: "Communication-focused stations: counselling, patient education, breaking bad news, addressing concerns, sensitive histories (sexual health, mental health, substance use), informed consent.\n\nDiagnosis is usually already established — the task is what you say and how you say it.",
          },
          {
            title: "Core Skills Required",
            content: "• Establish rapport quickly (introduce, sit, eye contact)\n• Elicit ICE (Ideas, Concerns, Expectations) early\n• Explain in plain language — avoid jargon\n• Use teach-back: 'Can you tell me in your own words what we discussed?'\n• Address emotional cues: 'That sounds difficult — can you tell me more?'\n• Non-judgmental approach to sensitive topics\n• Involve patient in decision-making\n• Clear closure: summarise, safety-netting, written resources",
          },
          {
            title: "Key Scenarios (from Handbook)",
            content: "• Breastfeeding vs bottle-feeding counselling (C2)\n• SIDS counselling to bereaved parents (C5)\n• Alopecia areata — explaining diagnosis and impact (C6)\n• Globus pharyngeus — reassurance after organic causes excluded (C7)\n• Mumps orchitis — explaining fertility implications (C8)\n• Breaking bad news: malignancy, HIV, infertility\n• Informed consent for procedures\n• Alcohol use — brief intervention (FRAMES approach)",
          },
        ],
      },
      {
        heading: "Category D — Clinical Diagnosis",
        entries: [
          {
            title: "What is Tested",
            content: "History taking and/or physical examination to arrive at a probable diagnosis. You must gather data systematically, identify red flags, and communicate your clinical impression to the patient.\n\nThink: What is the most likely diagnosis? What must I not miss?",
          },
          {
            title: "History Framework",
            content: "PC → HPC (SOCRATES for pain: Site, Onset, Character, Radiation, Associated symptoms, Timing, Exacerbating/relieving, Severity) → PMH → Medications + Allergies → Family History → Social History (smoking, alcohol, occupation, travel, relationships, stress) → Systems Review → ICE",
          },
          {
            title: "Key Scenarios (from Handbook)",
            content: "• Tremor — essential tremor vs alcoholic tremor (D33)\n• Headache — tension-type, migraine, SAH red flags (D34)\n• Lethargy — hypothyroidism (D35)\n• Syncope during exertion — aortic stenosis (D36)\n• Painful penile rash — genital herpes (D37)\n\nFor each: establish onset, character, associated symptoms, social context, relevant PMH and FHx. Elicit red flags and patient concerns.",
          },
          {
            title: "Red Flags Across Presentations",
            content: "Headache: thunderclap, fever, neck stiffness, focal neuro, papilloedema → SAH/meningitis\nChest pain: radiation to jaw/arm, diaphoresis, haemodynamic instability → ACS\nSyncope: exertional, associated chest pain, family history of sudden death → cardiac cause\nBack pain: bilateral leg weakness, bladder/bowel dysfunction, fever, cancer history → serious pathology\nWeight loss: >5% unexplained → malignancy/endocrine/GI workup",
          },
        ],
      },
      {
        heading: "Category M — Clinical Management",
        entries: [
          {
            title: "What is Tested",
            content: "Given a known or stated diagnosis, manage the patient: order investigations, initiate treatment, arrange follow-up, safety-net. You may need to explain management to the patient.\n\nDemonstrate knowledge of Australian guidelines (Therapeutic Guidelines, RACGP, eTG).",
          },
          {
            title: "Investigation Framework",
            content: "Bedside first: obs, ECG, BGL, urine dipstick, peak flow\nBloods: FBC, UEC, LFT, CRP/ESR, TFTs, HbA1c, troponin, coags, LDH, beta-hCG\nImaging: CXR, USS abdomen/pelvis, CT (specify with/without contrast and area), MRI\nSpecialist: echo, spirometry, endoscopy, biopsy, swab/culture",
          },
          {
            title: "Management Principles",
            content: "• Acute: ABCDE, IV access, fluids, analgesia, specific treatment\n• Chronic: lifestyle first (diet, exercise, smoking cessation), then pharmacology\n• Always consider: contraindications, renal/hepatic adjustment, drug interactions, allergies\n• Escalation: when to admit, when to refer (urgently vs routine)\n• Safety-netting: what to watch for, when to return, emergency plan\n• Follow-up: specific timeframe and reason",
          },
        ],
      },
      {
        heading: "Category LEO — Legal, Ethical & Organisational",
        entries: [
          {
            title: "What is Tested",
            content: "Professional and legal obligations in Australian medical practice: mandatory reporting, consent, confidentiality, capacity, duty of care, death certification, driving regulations, notifiable diseases.",
          },
          {
            title: "Key Legal Obligations",
            content: "Mandatory reporting:\n• Child abuse/neglect (all states)\n• Notifiable diseases (state health dept)\n• Impaired colleague (AHPRA)\n• Unfit-to-drive patient (VicRoads/RMS etc — varies by state)\n\nConfidentiality exceptions: risk of serious harm to patient or third party, court order, statutory duty.\n\nConsent: must be informed, voluntary, capacity-verified. For minors: Gillick competence applies.",
          },
          {
            title: "Capacity Assessment",
            content: "Patient has capacity if they can:\n1. Understand the information provided\n2. Retain the information long enough to make a decision\n3. Weigh up the information\n4. Communicate their decision\n\nLack of capacity does not mean you cannot treat — substitute decision-maker or best interests applies.",
          },
        ],
      },
      {
        heading: "Exam Technique & Tips",
        entries: [
          {
            title: "Reading Time (2 minutes)",
            content: "Identify: category (C/D/M/LEO), your task, patient demographics, what you know vs what you need to find out.\n\nPlan your structure: opening → main task → ICE → close. For D stations: plan your history framework. For M stations: think investigations → management → follow-up.",
          },
          {
            title: "Common Fail Reasons",
            content: "• Spending too long on history — not getting to management or explanation\n• Missing ICE (patient's ideas, concerns, expectations)\n• Using medical jargon the patient doesn't understand\n• Missing a critical error (mandatory notification, contraindication)\n• Not safety-netting or providing a follow-up plan\n• Appearing dismissive of patient concerns",
          },
          {
            title: "Passing Strategy",
            content: "You need 12/16 stations. Prioritise:\n1. Never make a critical error\n2. Always address ICE\n3. Always safety-net and close\n4. Attempt every domain — partial marks count\n5. If you don't know the diagnosis, be honest and explain what you will do next\n6. Use Australian resources: eTG, MIMS, RACGP, state health department",
          },
        ],
      },
    ],
  },
  {
    id: "amc",
    title: "AMC Exam Guidelines",
    subtitle: "AMC MCQ & AMC Handbook AI RolePlay blueprints and marking criteria",
    icon: "📘",
    color: "border-blue-200 bg-blue-50",
    sections: [
      {
        heading: "AMC MCQ — Computer Adaptive Test",
        entries: [
          {
            title: "Format",
            content: "150 MCQs (single best answer) in 3.5 hours. Computer adaptive — difficulty adjusts based on your responses. Passing requires demonstrating consistent competency across all domains.",
          },
          {
            title: "Topic Blueprint",
            content: "Medicine (~35%): cardiology, respiratory, neurology, endocrinology, gastroenterology, renal, haematology, infectious disease.\nSurgery (~15%): acute abdomen, trauma, vascular.\nOb/Gyn (~15%), Paediatrics (~15%), Psychiatry (~10%), GP/Community (~10%).",
          },
          {
            title: "Approach",
            content: "Read the question stem carefully — what is being asked? The last sentence is the question. Eliminate clearly wrong options. For 'most appropriate/urgent': think ABCDE, then treat the diagnosis. If two answers seem correct, pick the one that is safer/more urgent.",
          },
        ],
      },
      {
        heading: "AMC Handbook AI RolePlay — Clinical Examination",
        entries: [
          {
            title: "Format",
            content: "16 clinical stations × 8 minutes each. OSCE-style. Examiner and simulated patient (actor). Domains: history taking, physical examination, clinical management, communication, procedural skills.",
          },
          {
            title: "Marking Criteria",
            content: "Each station marked on: data gathering (appropriate questions/examination), clinical reasoning (correct diagnosis/differentials), patient management (investigations/treatment), communication (empathy, explanation, consent), professional behaviour.",
          },
          {
            title: "History Taking Framework",
            content: "PC → HPC (SOCRATES for pain) → PMH → Medications + Allergies → Family History → Social History (smoking, alcohol, occupation, relationships) → Systems Review. ICE: Ideas, Concerns, Expectations. Psychosocial context always assessed.",
          },
          {
            title: "Communication Tips",
            content: "Introduce yourself and role. Check patient's name and DOB. Use open questions first, then clarify. Avoid jargon. Summarise and check understanding. Address concerns explicitly. Closure: safety netting, follow-up plan.",
          },
        ],
      },
      {
        heading: "Clinical Competencies",
        entries: [
          {
            title: "Patient Investigation",
            content: "Order investigations logically — bedside first (obs, ECG, BGL, urine dipstick), then bloods (FBC, UEC, LFT, CRP, troponin, coags), then imaging. Always justify your choice. Results interpretation is heavily tested.",
          },
          {
            title: "Emergency Management",
            content: "ABCDE approach. Airway → Breathing → Circulation → Disability (GCS, BGL) → Exposure. IV access and fluids early in unstable patients. Escalate appropriately — know when to call for help.",
          },
          {
            title: "Prescribing",
            content: "Know first-line treatments and contraindications. Common exam drugs: aspirin, GTN, morphine, metformin, ACEi, statins, antibiotics (Therapeutic Guidelines), anticoagulants. Always check allergies, renal/hepatic function, interactions.",
          },
        ],
      },
    ],
  },
];

export default function ReferencePage() {
  const [activeBook, setActiveBook] = useState<string>("redbook");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [openEntries, setOpenEntries] = useState<Record<string, boolean>>({});

  const book = referenceData.find((b) => b.id === activeBook) ?? referenceData[0]!;

  function toggleSection(key: string) {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function toggleEntry(key: string) {
    setOpenEntries((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Reference Library</h2>
      <p className="text-gray-500 text-sm mb-6">Clinical guidelines and exam resources for your AMC preparation.</p>

      {/* Book tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {referenceData.map((b) => (
          <button
            key={b.id}
            onClick={() => setActiveBook(b.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition ${
              activeBook === b.id
                ? "bg-brand-600 text-white border-brand-600"
                : "bg-white text-gray-700 border-gray-200 hover:border-brand-400 hover:bg-brand-50"
            }`}
          >
            <span>{b.icon}</span>
            {b.title}
          </button>
        ))}
      </div>

      {/* Book content */}
      <div className={`border rounded-2xl overflow-hidden ${book.color}`}>
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-bold text-gray-900 text-lg">{book.title}</h3>
          <p className="text-sm text-gray-500">{book.subtitle}</p>
        </div>

        <div className="divide-y divide-gray-200">
          {book.sections.map((section) => {
            const sectionKey = `${book.id}-${section.heading}`;
            const isOpen = openSections[sectionKey] ?? true;

            return (
              <div key={sectionKey}>
                <button
                  onClick={() => toggleSection(sectionKey)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/40 transition"
                >
                  <span className="font-semibold text-gray-800">{section.heading}</span>
                  <span className="text-gray-400">{isOpen ? "▲" : "▼"}</span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-4 space-y-2">
                    {section.entries.map((entry) => {
                      const entryKey = `${sectionKey}-${entry.title}`;
                      const entryOpen = openEntries[entryKey] ?? false;

                      return (
                        <div key={entryKey} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                          <button
                            onClick={() => toggleEntry(entryKey)}
                            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition"
                          >
                            <span className="font-medium text-gray-800 text-sm">{entry.title}</span>
                            <span className="text-gray-400 text-xs">{entryOpen ? "▲" : "▼"}</span>
                          </button>
                          {entryOpen && (
                            <div className="px-4 pb-4">
                              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                {entry.content}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
