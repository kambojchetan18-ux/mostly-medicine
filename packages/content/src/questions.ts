export interface MCQuestion {
  id: string;
  topic: string;
  subtopic: string;
  stem: string;
  options: { label: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  reference: "murtagh" | "amc" | "racgp-redbook" | "other";
  difficulty: "easy" | "medium" | "hard";
}

// Seed questions — expand via Supabase database
export const seedQuestions: MCQuestion[] = [
  {
    id: "q-001",
    topic: "Cardiovascular",
    subtopic: "Ischaemic Heart Disease",
    stem: "A 58-year-old man presents with sudden onset central chest pain radiating to his left arm for 90 minutes. He is diaphoretic and pale. His ECG shows ST elevation in leads II, III, and aVF. Which artery is most likely occluded?",
    options: [
      { label: "A", text: "Left anterior descending artery" },
      { label: "B", text: "Right coronary artery" },
      { label: "C", text: "Left circumflex artery" },
      { label: "D", text: "Left main coronary artery" },
      { label: "E", text: "Posterior descending artery" },
    ],
    correctAnswer: "B",
    explanation: "ST elevation in II, III, aVF = inferior STEMI. The inferior wall is supplied by the RCA in 80% of cases (right-dominant circulation). Left circumflex supplies inferior wall in left-dominant systems (~20%).",
    reference: "amc",
    difficulty: "medium",
  },
  {
    id: "q-002",
    topic: "Respiratory",
    subtopic: "Asthma",
    stem: "A 22-year-old woman with known asthma presents to ED with wheeze and SOB. Her PEFR is 40% of predicted. She has not improved after 3 doses of salbutamol. What is the MOST appropriate next step?",
    options: [
      { label: "A", text: "Discharge with oral prednisolone" },
      { label: "B", text: "IV magnesium sulphate" },
      { label: "C", text: "Add ipratropium bromide nebuliser" },
      { label: "D", text: "Intubate and ventilate" },
      { label: "E", text: "Repeat salbutamol every 20 minutes" },
    ],
    correctAnswer: "C",
    explanation: "PEFR 33-50% = moderate-severe attack. After 3 rounds of salbutamol without improvement, add ipratropium bromide (anticholinergic). Magnesium is for life-threatening asthma (PEFR <33%). Intubation is last resort.",
    reference: "amc",
    difficulty: "medium",
  },
  {
    id: "q-003",
    topic: "Endocrinology",
    subtopic: "Diabetes",
    stem: "According to RACGP Red Book guidelines, which of the following is recommended for a 52-year-old man with well-controlled Type 2 Diabetes?",
    options: [
      { label: "A", text: "HbA1c every 6 months, annual retinal review, annual foot exam" },
      { label: "B", text: "HbA1c annually, biennial retinal review, 5-yearly foot exam" },
      { label: "C", text: "HbA1c every 3 months, 6-monthly retinal review, annual foot exam" },
      { label: "D", text: "HbA1c every 6 months, biennial retinal review, annual foot exam" },
      { label: "E", text: "HbA1c annually, annual retinal review, annual foot exam" },
    ],
    correctAnswer: "A",
    explanation: "RACGP Red Book: HbA1c 6-monthly for T2DM. Annual dilated retinal exam (biennial if well-controlled and no retinopathy). Annual comprehensive foot examination. Annual urine ACR and eGFR.",
    reference: "racgp-redbook",
    difficulty: "easy",
  },
  {
    id: "q-004",
    topic: "Neurology",
    subtopic: "Headache",
    stem: "A 35-year-old woman presents with a sudden severe headache she describes as 'the worst headache of my life'. She has neck stiffness and photophobia. CT head is normal. What is the NEXT most important investigation?",
    options: [
      { label: "A", text: "MRI brain with contrast" },
      { label: "B", text: "Lumbar puncture" },
      { label: "C", text: "EEG" },
      { label: "D", text: "Carotid Doppler" },
      { label: "E", text: "Discharge with analgesics and review in 24 hours" },
    ],
    correctAnswer: "B",
    explanation: "Thunderclap headache + normal CT = LP is mandatory to exclude subarachnoid haemorrhage (SAH). CT misses up to 5% of SAH. LP looks for xanthochromia (yellow CSF) at 12 hours post-onset. Never discharge without excluding SAH.",
    reference: "murtagh",
    difficulty: "medium",
  },
  {
    id: "q-005",
    topic: "Psychiatry",
    subtopic: "Postnatal Depression",
    stem: "A 27-year-old woman at 8 weeks postpartum scores 14 on the Edinburgh Postnatal Depression Scale (EPDS). She denies thoughts of self-harm. What is the MOST appropriate initial management?",
    options: [
      { label: "A", text: "Immediate psychiatric admission" },
      { label: "B", text: "Prescribe sertraline and review in 4 weeks" },
      { label: "C", text: "Reassure her this is normal baby blues and review in 2 weeks" },
      { label: "D", text: "Psychoeducation, social support, referral for CBT, close GP follow-up" },
      { label: "E", text: "Benzodiazepine for short-term anxiety relief" },
    ],
    correctAnswer: "D",
    explanation: "EPDS ≥10 suggests PND. Score 10-12: mild. Score 13+: moderate-severe. Without safety concerns, first-line is psychoeducation, social support, and psychological therapy (CBT/IPT). Medication (sertraline) is added for moderate-severe PND. Admission only for safety concerns or psychosis.",
    reference: "racgp-redbook",
    difficulty: "medium",
  },
];
