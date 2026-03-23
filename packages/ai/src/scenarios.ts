export interface Scenario {
  id: number;
  title: string;
  category: string;
  patientProfile: string;
  chiefComplaint: string;
  underlyingDiagnosis: string;
  redFlags: string[];
  murtaghPearls: string[];
  amcMarkingCriteria: string[];
  redBookGuidelines?: string[];
}

export const scenarios: Scenario[] = [
  {
    id: 1,
    title: "Chest Pain",
    category: "Cardiovascular",
    patientProfile: "55-year-old male, smoker, hypertensive",
    chiefComplaint: "central crushing chest pain radiating to left arm for 2 hours",
    underlyingDiagnosis: "Acute MI (STEMI)",
    redFlags: ["radiation to arm/jaw", "diaphoresis", "nausea", "hypotension"],
    murtaghPearls: [
      "Use SOCRATES for pain assessment",
      "Consider aortic dissection if tearing pain radiates to back",
      "ECG is essential — do not delay",
    ],
    amcMarkingCriteria: [
      "Appropriate history taking (SOCRATES)",
      "Identifies red flags",
      "Requests ECG and troponin",
      "Initiates emergency management: aspirin, GTN, oxygen",
      "Communicates clearly with patient",
    ],
    redBookGuidelines: [
      "Cardiovascular risk assessment in men >45",
      "Smoking cessation counselling",
    ],
  },
  {
    id: 2,
    title: "Shortness of Breath",
    category: "Respiratory",
    patientProfile: "68-year-old female with long-term smoking history",
    chiefComplaint: "worsening breathlessness over 3 days with productive cough",
    underlyingDiagnosis: "Acute exacerbation of COPD",
    redFlags: ["cyanosis", "accessory muscle use", "SpO2 < 88%", "altered consciousness"],
    murtaghPearls: [
      "Differentiate cardiac vs respiratory cause",
      "Assess severity: RR, SpO2, speech",
      "Steroid and bronchodilator are key",
    ],
    amcMarkingCriteria: [
      "Elicits smoking history and baseline function",
      "Identifies acute-on-chronic deterioration",
      "Requests CXR, spirometry review, ABG if severe",
      "Prescribes bronchodilators and systemic steroids",
    ],
  },
  {
    id: 3,
    title: "Abdominal Pain",
    category: "Gastroenterology",
    patientProfile: "32-year-old female",
    chiefComplaint: "right lower quadrant pain for 18 hours, nausea, low-grade fever",
    underlyingDiagnosis: "Appendicitis",
    redFlags: ["guarding", "rebound tenderness", "fever > 38.5", "peritonism"],
    murtaghPearls: [
      "Rovsing sign, psoas sign, obturator sign",
      "Always consider ectopic pregnancy in females of reproductive age",
      "Alvarado score for risk stratification",
    ],
    amcMarkingCriteria: [
      "Takes menstrual and sexual history",
      "Examines for peritoneal signs",
      "Orders FBC, CRP, beta-hCG, USS",
      "Surgical referral if high suspicion",
    ],
  },
  {
    id: 4,
    title: "Headache",
    category: "Neurology",
    patientProfile: "29-year-old male",
    chiefComplaint: "sudden severe headache 'worst of my life' with neck stiffness",
    underlyingDiagnosis: "Subarachnoid haemorrhage",
    redFlags: ["thunderclap onset", "neck stiffness", "photophobia", "vomiting", "LOC"],
    murtaghPearls: [
      "Thunderclap headache = SAH until proven otherwise",
      "CT head then LP if CT negative",
      "Kernig and Brudzinski signs",
    ],
    amcMarkingCriteria: [
      "Recognises thunderclap onset",
      "Assesses meningism",
      "Emergency referral/imaging",
      "Does not give analgesia and send home without investigation",
    ],
  },
  {
    id: 5,
    title: "Diabetes Follow-up",
    category: "Endocrinology",
    patientProfile: "58-year-old male, known T2DM on metformin",
    chiefComplaint: "routine follow-up, HbA1c 9.2%, feels 'a bit tired'",
    underlyingDiagnosis: "Poorly controlled T2DM with potential complications",
    redFlags: ["polyuria", "polydipsia", "weight loss", "foot changes", "vision changes"],
    murtaghPearls: [
      "Assess complications: retinopathy, nephropathy, neuropathy, feet",
      "Check BP, lipids, eGFR, urine ACR",
      "Motivational interviewing for lifestyle",
    ],
    amcMarkingCriteria: [
      "Reviews current medications and adherence",
      "Performs complication screen",
      "Adjusts treatment (consider SGLT2i or GLP-1)",
      "RACGP Red Book preventive activities",
      "Addresses cardiovascular risk",
    ],
    redBookGuidelines: [
      "Annual HbA1c, lipids, eGFR, urine ACR",
      "Biennial retinal screening",
      "Annual foot examination",
    ],
  },
  {
    id: 6,
    title: "Postnatal Depression",
    category: "Psychiatry",
    patientProfile: "28-year-old female, 6 weeks postpartum, first baby",
    chiefComplaint: "feels overwhelmed, not bonding with baby, tearful most days",
    underlyingDiagnosis: "Postnatal depression",
    redFlags: ["thoughts of harming self or baby", "psychosis", "severe functional impairment"],
    murtaghPearls: [
      "Use Edinburgh Postnatal Depression Scale (EPDS)",
      "Distinguish baby blues (< 2 weeks) vs PND vs postpartum psychosis",
      "Safety assessment is paramount",
    ],
    amcMarkingCriteria: [
      "Non-judgmental, empathic approach",
      "Administers or references EPDS",
      "Assesses safety (self-harm, harm to baby)",
      "Discusses treatment: psychotherapy, medication if needed",
      "Involves support network, GP follow-up plan",
    ],
    redBookGuidelines: [
      "EPDS screening at 6 weeks and 6 months postpartum",
      "Assess social support and domestic violence",
    ],
  },
];

export function getScenario(id: number): Scenario | undefined {
  return scenarios.find((s) => s.id === id);
}
