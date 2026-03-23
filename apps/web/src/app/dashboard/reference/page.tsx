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
    id: "amc",
    title: "AMC Exam Guidelines",
    subtitle: "CAT 1 & CAT 2 blueprints and marking criteria",
    icon: "📘",
    color: "border-blue-200 bg-blue-50",
    sections: [
      {
        heading: "AMC CAT 1 — Computer Adaptive Test",
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
        heading: "AMC CAT 2 — Clinical Examination",
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

  const book = referenceData.find((b) => b.id === activeBook)!;

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
