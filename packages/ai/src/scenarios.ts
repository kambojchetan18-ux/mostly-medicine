// AMC Handbook of Clinical Assessment — MCAT Scenarios
// Content drawn directly from the AMC Handbook of Clinical Assessment.
// Each scenario follows the official MCAT Performance Guidelines structure.

/**
 * Every scenario must be sourced directly from the AMC Handbook of Clinical
 * Assessment or another explicitly cited authoritative publication. No field
 * may contain invented, extrapolated, or AI-generated clinical content.
 * The `source` field is mandatory and must identify the exact publication,
 * edition, and condition number so content can be audited at any time.
 */
export interface Scenario {
  id: number;
  mcatNumber: string;           // e.g. "033"
  title: string;
  category: "C" | "D" | "M" | "D/M" | "LEO";
  subcategory: string;
  difficulty: "easy" | "medium" | "hard";

  /**
   * Mandatory provenance — must reference the exact publication and page/condition.
   * Example: "AMC Handbook of Clinical Assessment (2007), Condition 033"
   * No scenario may be added without a verifiable source entry.
   */
  source: string;

  // For scenario card display
  patientProfile: string;
  chiefComplaint: string;       // short label for display

  // Candidate briefing (2-min reading time)
  candidateInfo: string;
  tasks: string[];

  // Patient simulation — Examiner Instructions
  // All fields below must be verbatim or a faithful condensation of handbook text.
  openingStatement: string;     // exact opening gambit (handbook verbatim)
  historyWithoutPrompting: string;
  historyWithPrompting: string;
  patientQuestions: string[];
  physicalExaminationFindings?: string;

  // Performance framework — sourced verbatim from handbook Performance Guidelines
  aimsOfStation: string;
  expectationsOfPerformance: string[];
  keyIssues: string[];
  criticalErrors: string[];
  commentary: string;

  // Diagnosis — as stated in handbook; no additions
  underlyingDiagnosis: string;
  differentialDiagnosis: string[];
}

export const scenarios: Scenario[] = [
  // ── CONDITION 033 ────────────────────────────────────────────────────────
  {
    id: 33,
    mcatNumber: "033",
    title: "Tremor in a 40-year-old man",
    category: "D",
    subcategory: "2-A The Diagnostic Process — History-taking and Problem-Solving",
    difficulty: "medium",
    source: "AMC Handbook of Clinical Assessment (Australian Medical Council, 2007), Condition 033",
    patientProfile: "40-year-old male storeman, married with two teenage children, smoker (10–15 cigarettes/day), drinks up to five 375 mL cans full-strength beer on most days",
    chiefComplaint: "the shakes",

    candidateInfo: "You are a doctor in general practice. Your next patient is a 40-year-old man who has come to see you complaining of 'the shakes'. Your tasks are to take a focused history, identify probable diagnosis and differential diagnoses, state the essential physical examination findings to be sought, and state the appropriate investigations.",
    tasks: [
      "Take a focused history regarding the tremor",
      "Identify the probable diagnosis and differential diagnoses",
      "State the essential physical signs you would look for",
      "State the appropriate investigations",
    ],

    openingStatement: "I've got the shakes doctor. I spill my drink sometimes.",
    historyWithoutPrompting:
      "I have had the shakes since my early 20s. It happens when I get nervous about something, but it hasn't been a problem until recently (6–12 months). Sometimes my head shakes and I often spill my drink when I put a glass to my mouth. I feel much better after a couple of beers. Recently I heard something about Parkinson's disease which can cause the shakes, so I thought I should see a doctor.",
    historyWithPrompting:
      "It doesn't seem to bother me when I get up in the morning and doesn't stop me going to sleep. It can go away for a few days then comes back. Seems to be when I am doing something with my hands like using a knife and fork, or writing. The newspaper shakes when I am trying to read it. Sometimes I have trouble lighting a cigarette. My right hand is the worst. I don't have any stiffness and I don't have trouble moving from one position to another, nor in walking. I can control the shakes by gripping things firmly. My hands and fingers shake if I hold my arms out in front of my body. My voice can be occasionally shaky but only of minor degree. Shakes were first noted in dominant right hand; left hand less affected and not until recently. I am a tense and nervy person — stress makes the shakes worse. I like a few beers especially at weekends but never get drunk. I deny any other symptoms affecting the central nervous system, cardiovascular, respiratory, gastrointestinal or urinary systems. I have some diminished libido and difficulty maintaining an erection if this opportunity is provided to say so. No loss of weight. Family history: father died from lung cancer aged 58, he also used to get the shakes and was a non-drinker. Mother died of stroke aged 62 years, had Parkinson's disease. (Be reluctant to confirm or reveal the true level of alcohol intake. If the doctor controls the interview too early by only asking questions and not listening, just answer questions asked. If the doctor facilitates the story and maintains an open-ended approach, continue to amplify your symptoms.)",
    patientQuestions: [],

    physicalExaminationFindings:
      "Physical examination — provide when specifically requested: Check for hepatomegaly and stigmata of chronic liver disease, cerebellar signs, increased muscle tone, tachycardia, cardiomegaly. After six minutes the examiner should ask the candidate: What are your differential diagnoses? (Expected: Benign/essential tremor, effects of heavy drinking, Parkinson disease, cerebellar disease, thyrotoxicosis.) At this stage, what is the most likely diagnosis? (Expected: Benign tremor or alcoholic tremor.) What essential physical signs would you look for? (Expected: Hepatomegaly, stigmata of chronic liver disease, cerebellar signs, increased muscle tone, tachycardia, cardiomegaly.) What investigations would you advise? (Expected: FBE, liver function tests, possibly thyroid function tests.)",

    aimsOfStation:
      "To assess the candidate's skill in defining a presenting symptom of tremor, making a probability diagnosis from the history and selecting with discrimination which aspects of physical examination and investigations will clarify the diagnosis.",
    expectationsOfPerformance: [
      "By process of listening (open-ended approach followed by direct questioning), develop the two most likely diagnostic pathways: benign tremor and tremor associated with heavy drinking",
      "Consider other differential diagnoses: Parkinsonism and thyrotoxicosis (much less likely from history)",
      "Seek past, family and social histories",
      "Approach patient with non-judgmental attitude — be reassuring about the likelihood of a benign tremor",
      "Investigations: Full Blood Examination (FBE), liver function tests, possibly thyroid function tests",
      "Physical examination: check for hepatomegaly and stigmata of chronic liver disease, cerebellar signs, increased muscle tone, tachycardia, cardiomegaly",
    ],
    keyIssues: [
      "Approach to patient — establishing trust and confidence by non-judgmental attitude, listening to concerns and being reassuring",
      "History — comprehensive but focused, using appropriate communication skills",
      "Diagnosis must include benign essential tremor AND alcoholic tremor",
    ],
    criticalErrors: [
      "Failure to indicate the most likely diagnosis is essential tremor",
      "Failure to advise liver function tests",
    ],
    underlyingDiagnosis:
      "Benign essential tremor (primary). Important differential: alcoholic tremor — patient drinks up to five 375 mL cans of full-strength beer daily. Father also had similar tremor (autosomal dominant pattern). Parkinson disease and thyrotoxicosis are less likely.",
    differentialDiagnosis: [
      "Benign essential tremor (most likely)",
      "Alcoholic tremor",
      "Parkinson disease",
      "Cerebellar disease",
      "Thyrotoxicosis",
    ],
    commentary:
      "Essential tremor is one of the most common neurological disorders. An autosomal dominant family history is present in 50–60% of patients. The characteristic finding is a postural and kinetic tremor of the upper limbs interfering with fine manual tasks. Head tremor is also present in 40%. Patients with benign essential tremor often drink alcohol as a means of controlling the tremor as alcohol has an ameliorating effect in 50% of cases. In this case, the patient may also be suffering from effects of prolonged heavy drinking — liver function tests are essential.",
  },

  // ── CONDITION 034 ────────────────────────────────────────────────────────
  {
    id: 34,
    mcatNumber: "034",
    title: "Headache in a 35-year-old woman",
    category: "D",
    subcategory: "2-A The Diagnostic Process — History-taking and Problem-Solving",
    difficulty: "medium",
    source: "AMC Handbook of Clinical Assessment (Australian Medical Council, 2007), Condition 034",
    patientProfile: "35-year-old female telecommunications manager, first visit to this doctor",
    chiefComplaint: "recurrent headaches, recently worsening",

    candidateInfo: "You are a doctor. Your next patient is a 35-year-old woman who has come to see you about headaches. Your tasks are to take a history, perform a focused physical examination, arrive at a diagnosis and differential diagnosis, and counsel the patient.",
    tasks: [
      "Take a focused history",
      "Perform a focused physical examination (state key components)",
      "Arrive at a diagnosis and differential diagnosis",
      "Counsel the patient appropriately",
    ],

    openingStatement: "I want to find out what is causing my headaches.",
    historyWithoutPrompting:
      "I have been suffering from intermittent headaches for at least five years. Attacks occur irregularly every few months, lasting a few days. They are temporarily relieved by Panadol, up to six a day at a maximum. I have not previously sought advice. In the past few months, the headaches have occurred more often — every few days — and now last longer, for most of the day.",
    historyWithPrompting:
      "The headache has not increased in intensity — only in frequency and duration. It feels like a tight band or pressure around or on top of my head, or a dull ache, not pulsating. It affects the forehead and both temples and radiates to the back of the head. It usually starts in the morning and lasts all day, getting worse by evening, not interfering with sleep. The pain reduces after taking Panadol, after my evening meal, and with rest and local heat. On a scale from 1 to 10, the pain rates about 3 to 4. Headaches are NOT accompanied by nausea, vomiting, visual disturbance, photophobia, or associated with menstrual cycle. NOT related to posture, exercise or position of head or neck. I can continue to work and household duties during attacks. I have had no time off work. I am very busy, rushing through work, domestic and family duties, and have less relaxation time now. I am a perfectionist by nature and finding it more difficult to cope with all the activities of my growing family. I have a dual income and no financial problems. I recently saw a TV documentary about a person who had a cerebral tumour — I am now seriously worried about having a cerebral tumour. Indicate the site of headache (forehead, temples, and occiput) if asked. I am prepared to be reassured by the doctor if history and physical examination are adequate; if not, press the doctor to have tests or be referred to a specialist. Menstrual cycle normal. Panadol 500 mg 1–2 tablets, not more than three times daily. No drug sensitivities. Nonsmoker. Alcohol occasionally at weekends.",
    patientQuestions: [],

    physicalExaminationFindings:
      "EXAMINER INFORMS CANDIDATE: No abnormalities are found on physical examination. Physical examination should include: inspection of head and neck and testing for neck stiffness; neurological exam which must include ophthalmoscopy; cardiovascular exam which must include blood pressure measurement.",

    aimsOfStation:
      "To assess the candidate's communication skills in defining the nature of the patient's headache. In addition, knowledge of types and causes of headache and the essential components of an appropriately focused physical examination are tested.",
    expectationsOfPerformance: [
      "Use facilitation, active listening and relevant enquiry to fully define the nature of the headache and its associations — avoid taking immediate control with a series of direct closed questions",
      "Communicate understanding and concern that there is a recent change in a chronic problem",
      "Facilitate disclosure of relevant psychosocial history and hidden worry about brain tumour (from TV documentary)",
      "Characteristics of headaches including assessment of severity",
      "Recent change in chronic condition",
      "Identify patient's acute concern that a serious cause may be present (cerebral tumour)",
      "Recognise typical characteristics of tension headache",
      "Identify relevant psychosocial and environmental factors (lifestyle stress, perfectionist personality)",
      "Physical examination: inspect head and neck, test for neck stiffness, neurological exam including ophthalmoscopy, BP measurement",
      "Diagnosis: tension headache (muscle contraction headache) is the most likely. State other differentials",
      "Referral for CT brain or MRI would detract from overall performance but is allowable to diminish patient concern",
      "Arrange follow-up to assess therapeutic effect",
    ],
    keyIssues: [
      "Use of communication skills to elicit the most relevant and important points in history",
      "Focused physical examination in a patient complaining of longstanding headache",
      "Confidence in diagnosis of tension headache based on typical history, normal examination, and lifestyle factors",
      "Investigations unnecessary at this stage (but allowable to diminish concern)",
      "Arrange follow-up to assess therapeutic effect of this initial assessment",
    ],
    criticalErrors: [
      "Failure to request blood pressure and ophthalmoscopy findings",
      "Failure to indicate the most likely cause is tension headache and that a serious cause is most unlikely",
    ],
    underlyingDiagnosis:
      "Tension headache (muscle contraction headache). Patient has hidden concern about cerebral tumour due to TV documentary. Normal physical examination. No investigations required at this stage.",
    differentialDiagnosis: [
      "Tension headache (most likely)",
      "Migraine",
      "Cluster headache",
      "Raised intracranial pressure (excluded by history and normal examination)",
      "Cervical spondylosis",
    ],
    commentary:
      "The candidate who takes immediate control of the interview by asking a series of direct questions about site, duration, intensity etc. may successfully reach the diagnosis of tension headache, but is likely to overlook the patient's recent concern about a serious cause and miss the real cause (lifestyle factors). The initial response should be to facilitate the history given by the patient with an open-ended approach, listening, and encouraging the patient to tell the whole story including concerns and life situation. The initial response from the candidate should be to facilitate the history given by the patient with an open-ended approach.",
  },

  // ── CONDITION 035 ────────────────────────────────────────────────────────
  {
    id: 35,
    mcatNumber: "035",
    title: "Lethargy in a 50-year-old woman",
    category: "D",
    subcategory: "2-A The Diagnostic Process — History-taking and Problem-Solving",
    difficulty: "medium",
    source: "AMC Handbook of Clinical Assessment (Australian Medical Council, 2007), Condition 035",
    patientProfile: "50-year-old widow, has come to stay with her daughter because she was unable to carry on living alone",
    chiefComplaint: "lethargy, tiredness, feeling unwell",

    candidateInfo: "You are a doctor. Your next patient is a 50-year-old woman who has been brought in for a check-up by her daughter. Your tasks are to take a history, select and perform appropriate components of physical examination, arrive at a diagnosis and differential diagnosis, and state the appropriate investigations.",
    tasks: [
      "Take a focused history",
      "Select and perform appropriate components of physical examination",
      "Arrive at a diagnosis and differential diagnosis",
      "State the appropriate investigations",
    ],

    openingStatement: "My daughter wants me to have a check-up because she says I am always tired.",
    historyWithoutPrompting:
      "I have not felt well lately — be vague about the duration. I feel weak, especially my arms and legs. I also feel lethargic. My daughter says I am not interested in anything, go to sleep during the day and can't be bothered talking to people. My voice has become 'croaky' — people say it has changed over the past year. I am always constipated and this seems to be getting worse. My periods stopped last year and were scanty and irregular for a year before that. I have put on weight. (Present as apathetic and lacking expression. Be slow to react with a croaky, husky, thick voice and poor memory. Respond slowly to the doctor's questions. Show paucity of body movements.)",
    historyWithPrompting:
      "No history of thyroid surgery. I feel cold all the time. My hair has become thinner. I find it hard to concentrate. My memory is not good. I am able to manage my own personal care but everything is an effort and takes longer. I get constipated if I don't take Coloxyl regularly. My joints feel stiff and the muscles are sore. I wake up early in the morning and can't get back to sleep. Answer in the negative to any other questions about health except indicate gradually going downhill. I have come to stay with my daughter because I was unable to carry on living alone. Past medical history and family history: nothing of note; parents died from old age. Current medications: 'Tonic' obtained from Pharmacist by daughter; aspirin irregularly for rheumatism; Dioctyl sodium 120 mg (Coloxyl) 1 or 2 tablets daily, taken for about a year.",
    patientQuestions: [],

    physicalExaminationFindings:
      "Provide these findings when specifically requested: Appearance — looks tired and dull, expressionless face, coarse features and skin. Overweight — BMI 29 kg/m². Pulse rate 56/min regular, blood pressure 130/70 mmHg. Thyroid not palpable. Skin dry, sparse axillary hair. Cold hands and feet. Power and tone reduced in arms and legs. Reflexes sluggish with delayed ankle jerks. At six minutes the examiner will ask the candidate for the diagnosis/differential diagnosis and proposed investigation.",

    aimsOfStation:
      "To assess the candidate's history-taking skills and diagnostic acumen in a patient with the symptoms and signs of hypothyroidism. The case is deliberately presented as an undifferentiated problem but the patient's initial unprompted statements should lead to the correct diagnostic pathway with confirmation of suspected hypothyroidism by a focused selective physical examination.",
    expectationsOfPerformance: [
      "This case requires the patient to reveal symptoms of hypothyroidism in a slow and hesitant but positive manner — in response to appropriate history-taking",
      "Diagnosis/differential diagnosis: candidate should strongly suspect hypothyroidism as indicated by pattern recognition from symptoms and signs",
      "Other possibilities such as depression, anaemia, early dementia may be mentioned but should be considered unlikely",
      "Investigations: MUST request thyroid function tests AND full blood examination",
      "Choice and sequence of physical examination should be focused and selective",
    ],
    keyIssues: [
      "History",
      "Choice and sequence of examination",
      "Diagnosis/differential diagnosis",
      "Appropriate investigations — must include thyroid function tests (TFTs) and FBE",
    ],
    criticalErrors: [
      "Failure to consider hypothyroidism in differential diagnosis",
    ],
    underlyingDiagnosis:
      "Hypothyroidism (spontaneous atrophic). Pathology is destructive lymphoid infiltration of the thyroid gland. Diagnosis confirmed by elevation of serum TSH with lowered T4 levels. Responds well to thyroxine treatment starting at low dose (50 mcg daily).",
    differentialDiagnosis: [
      "Hypothyroidism (most likely)",
      "Depression",
      "Anaemia",
      "Early dementia",
    ],
    commentary:
      "Spontaneous atrophic hypothyroidism often gives gradually progressive symptoms as in this case. The condition is an organ-specific immune disorder. Diagnosis is suspected by the constellation of symptoms and signs exhibited in this patient and would be confirmed by elevation of serum TSH with lowered T4 levels. The condition responds well to thyroxine treatment, beginning with a low dose (50 mcg daily) and increasing slowly to the dose required to restore TSH to normal.",
  },

  // ── CONDITION 036 ────────────────────────────────────────────────────────
  {
    id: 36,
    mcatNumber: "036",
    title: "Syncope in a 52-year-old man",
    category: "D",
    subcategory: "2-A The Diagnostic Process — History-taking and Problem-Solving",
    difficulty: "hard",
    source: "AMC Handbook of Clinical Assessment (Australian Medical Council, 2007), Condition 036",
    patientProfile: "52-year-old male technician, active tennis player, previously well",
    chiefComplaint: "sudden loss of consciousness whilst playing tennis",

    candidateInfo: "You are a doctor. Your next patient is a 52-year-old man who lost consciousness whilst playing tennis yesterday. Your tasks are to take a focused history, perform a selective physical examination (or state what you would examine), and state the investigations you would order.",
    tasks: [
      "Take a focused history regarding the loss of consciousness",
      "Perform a focused physical examination (state key components)",
      "State the investigations you would order",
      "Discuss the likely diagnosis with the patient",
    ],

    openingStatement: "I was playing tennis yesterday when I suddenly blacked out. My friends thought I was dead!",
    historyWithoutPrompting:
      "I was enjoying my usual Sunday morning game of tennis. It was a hot day. I had been serving and the game was pretty fast — when I suddenly blacked out. There was no warning and I must have 'come to' pretty quickly because my friends told me they were about to start pushing on my chest. They couldn't tell whether I was breathing or not and they said they couldn't feel my pulse. Anyway I woke up and felt that nothing had happened except for this graze on my elbow. I decided not to play on although I felt ok.",
    historyWithPrompting:
      "I feel well today. This was the first such attack. I have not had any previous fainting or dizzy spells. No convulsions or fitting from my friend's description. Before or after the attack: no palpitations or awareness of heart beating abnormally, no vertigo, no headache, no disturbance of vision, no numbness or tingling. No one said anything about my colour. No loss of control of bladder or bowel function during the attack. I get short of breath whilst playing tennis and this has been more noticeable lately — I have attributed this to my age. I don't get short of breath lying down or at night. I also have some 'muscle soreness' in my chest — sometimes comes on when I am playing, been noticed over recent months. Occurs if a game is strenuous or prolonged. It is a tight feeling. It stops when I stop playing between games. I don't feel it anywhere else. There has been no swelling of ankles. Negative responses to all questions reviewing body systems. (DO NOT reveal the chest soreness or the excessive shortness of breath on exertion without proper enquiry from the doctor.) My last cholesterol check was three or four years ago — told it was in the 'high normal' range and advised to reduce intake of fatty foods. Blood pressure always normal. No regular medication. Accept what the doctor says about the cause of symptoms.",
    patientQuestions: [],

    physicalExaminationFindings:
      "Provide on request — limit examination requests to cardiovascular and central nervous systems. Cardiovascular examination: pulse 70/min regular; blood pressure 118/88 mmHg lying and standing; jugular venous pressure normal; auscultation of neck — systolic bruit (transmitted) over both carotid arteries at base of neck, loudest on right; heart — prominent left ventricular impulse, apex beat not displaced, ejection systolic murmur (3/6) best heard over aortic area, radiates to neck and apex. Neurological examination: normal. There are no other abnormal physical findings. After six minutes ask the candidate the most likely diagnosis, then direct the candidate to discuss this with the patient.",

    aimsOfStation:
      "To assess the candidate's ability to take a focused history regarding transient loss of consciousness with possible causes in mind. The candidate should also know the essential components of a selective physical examination which should identify a probable cause and be able to specify the investigations which would confirm the diagnosis.",
    expectationsOfPerformance: [
      "Elicit the triad of symptoms raising high index of suspicion of aortic stenosis: syncope, exertional dyspnoea, and angina on exertion (chest muscle soreness)",
      "Exclude symptoms suggestive of other causes, particularly epilepsy",
      "Physical examination: request cardiovascular examination — pulse, blood pressure, presence of carotid and cardiac murmurs",
      "Choice of investigations: ECG and echocardiogram (X-ray chest and FBE also acceptable); Holter monitoring and coronary angiography are NOT appropriate at this stage",
      "Diagnosis opinion to patient: loss of consciousness most likely due to an abnormality in one of the heart valves (may use term aortic stenosis with explanation) which requires investigation by ECG and echocardiogram, and referral to a cardiologist",
    ],
    keyIssues: [
      "History must elicit details of syncope, exertional dyspnoea and chest discomfort",
      "Examination must request pulse, blood pressure, presence of carotid and cardiac murmurs",
      "Choice of investigations must include ECG and echocardiogram",
      "Diagnosis must recognise that this patient's syncope has a serious underlying cause",
    ],
    criticalErrors: [
      "Failure to ask about cardiovascular symptoms",
      "Failure to request examination findings for both carotid and cardiac bruits",
    ],
    underlyingDiagnosis:
      "Aortic stenosis — classic triad of exertional syncope, exertional dyspnoea, and exertional angina (presented as chest muscle soreness). Ejection systolic murmur (3/6) radiating to neck confirms diagnosis. Requires urgent ECG, echocardiogram, and cardiologist referral.",
    differentialDiagnosis: [
      "Aortic stenosis (most likely — classic triad)",
      "Vasovagal/vasodepressor syncope",
      "Cardiac arrhythmia",
      "Epilepsy",
      "Carotid sinus syncope",
    ],
    commentary:
      "This middle-aged patient with syncope evinces the triad of symptoms classical of aortic stenosis. Taking a careful history, including an eyewitness account, is critically important in syncope. The absence of palpitations is against cardiac arrhythmia but could still be possible. A lack of understanding of the condition would be exhibited if a candidate requests a whole range of investigations such as full blood count, electrolytes, blood glucose, carotid Doppler studies, electroencephalogram, Holter or loop monitoring, and coronary angiography. The candidate is expected to use appropriate questioning to try to exclude epilepsy and other neurological causes.",
  },

  // ── CONDITION 037 ────────────────────────────────────────────────────────
  {
    id: 37,
    mcatNumber: "037",
    title: "A painful penile rash in a 23-year-old man",
    category: "D",
    subcategory: "2-A The Diagnostic Process — History-taking and Problem-Solving",
    difficulty: "medium",
    source: "AMC Handbook of Clinical Assessment (Australian Medical Council, 2007), Condition 037",
    patientProfile: "23-year-old male carpenter, no steady partner, heterosexual",
    chiefComplaint: "painful penile rash with blisters",

    candidateInfo: "You are a doctor in general practice. Your next patient is a 23-year-old man who has come to see you about a problem with his penis. Your tasks are to take a history, arrive at a diagnosis, organise appropriate investigations and counselling.",
    tasks: [
      "Take an appropriate history including sexual history",
      "Arrive at a diagnosis and differential diagnosis",
      "Organise appropriate investigations",
      "Counsel and educate the patient",
    ],

    openingStatement: "I've got a problem with my penis, doctor.",
    historyWithoutPrompting:
      "I have had penile pain for two days. It started as intermittent tingling, but is now constant. I have noticed today a lumpy penile rash with blisters.",
    historyWithPrompting:
      "I have had no serious past illnesses and am on no medications. I have no allergies. There is no history of mental illness. Sexual history: I have no steady partner. I am heterosexual and last had sex with a woman I met at a disco a week ago. (Do NOT volunteer information about sexual behaviour unless asked specifically by the doctor.)",
    patientQuestions: [
      "What is wrong with me?",
      "What is the cause?",
      "Can I pass it on?",
      "How can it be treated?",
      "Will I be cured?",
    ],

    aimsOfStation:
      "To assess ability to diagnose and manage genital herpes. This patient has penile herpes simplex. The patient also needs to be assessed in terms of other possible sexually transmissible infections.",
    expectationsOfPerformance: [
      "Take an appropriate sexual history",
      "Identify the vesicular penile rash as most likely due to genital herpes simplex",
      "Confirm diagnosis by viral testing (virological swab)",
      "Assess risk of and test for other sexually transmissible infections: VDRL/syphilis, chlamydial, gonococcal and HIV testing",
      "Counsel to reduce risk of transmission — essential",
      "Management: first clinical episode treated with five-day course of oral aciclovir or similar agent; topical treatments (povidone-iodine, topical lignocaine); supportive treatment (rest, salt baths, ice packs, analgesics, loose clothing)",
      "All testing needs to be done with informed consent",
      "Explain that HSV-2 is a chronic condition with recurrences in approximately 50% of cases",
    ],
    keyIssues: [
      "Ability to identify rash as herpes simplex",
      "Ability to take a sexual history and investigate possible concomitant sexually transmissible infections",
      "Counselling to reduce risk of further transmission of herpes simplex virus",
      "Ability to treat herpes infection",
    ],
    criticalErrors: [
      "Failure to assess for other sexually transmissible infections",
    ],
    underlyingDiagnosis:
      "Genital herpes simplex (HSV-2). Primary attack — vesicular rash on penis. Important to screen for concomitant STIs. Recurrence occurs in approximately 50% of cases.",
    differentialDiagnosis: [
      "Genital herpes simplex HSV-2 (most likely)",
      "Syphilis",
      "Other STIs — gonorrhoea, chlamydia",
      "Allergic contact dermatitis",
    ],
    commentary:
      "HSV-2 is largely associated with genital infection and is most common in young, sexually active adults. Condoms reduce the risk of transmission. The first (primary) attack lasts around two weeks. Recurrence occurs in about 50% and may be associated with shooting pains in the buttocks and legs. Recurrences often occur at times of stress and tiredness. HSV infection may be associated with other sexually transmissible infections — screening is essential.",
  },

  // ── CONDITION 006 ────────────────────────────────────────────────────────
  {
    id: 6,
    mcatNumber: "006",
    title: "Hair loss in a 38-year-old man",
    category: "C",
    subcategory: "1-A Communication, Counselling and Patient Education",
    difficulty: "easy",
    source: "AMC Handbook of Clinical Assessment (Australian Medical Council, 2007), Condition 006",
    patientProfile: "38-year-old male newsagent, married with two children. General health excellent, non-smoker, no alcohol. No past medical history or significant family history including baldness.",
    chiefComplaint: "hair loss",

    candidateInfo: "You are a doctor in general practice. Your next patient is a 38-year-old male newsagent presenting with hair loss. Your tasks are to take a history, reach a probable diagnosis, counsel and educate the patient, and discuss treatment options.",
    tasks: [
      "Take a relevant history",
      "Reach a probable diagnosis",
      "Counsel and educate the patient about the condition",
      "Discuss treatment options",
    ],

    openingStatement: "What is happening to my hair?",
    historyWithoutPrompting:
      "I work long hours with the usual stress associated with running a small business, but otherwise have no social or family problems. I am worried about my appearance because of my contact with customers. I am concerned about the cause of the hair loss and am very anxious to have treatment and also to be assured of effectiveness of treatment. (Become impatient if simple reassurance is the main advice given.)",
    historyWithPrompting:
      "General health is excellent. No other medical problems. No significant family history including baldness. No medications. If asked about specific symptoms: no thyroid symptoms, no recent major illness or stress trigger you can identify, no skin problems elsewhere.",
    patientQuestions: [
      "Will I go completely bald?",
      "Will it improve?",
      "How long will it last?",
      "What can be done about it?",
      "Is treatment effective?",
      "Should I see a specialist?",
      "Could it have anything to do with my glands? OR with my thyroid gland?",
    ],

    aimsOfStation:
      "To assess the candidate's ability to deal with a cosmetic problem, almost certainly alopecia areata, for which treatment and prognosis are uncertain.",
    expectationsOfPerformance: [
      "Recognise the patient has alopecia areata and is concerned about his appearance",
      "Explain the nature of the condition — emphasise the possibility of improvement or return to normal, but acknowledge the natural history is unpredictable in individual cases",
      "Achieve patient understanding and acceptance of his condition based on correct information",
      "Answer the patient's questions directly with supportive explanation",
      "Initial management: topical medication to stimulate hair regrowth — use one agent for 3–6 months before changing. Options: potent topical corticosteroid (e.g. betamethasone dipropionate 0.05%); intralesional corticosteroid (triamcinolone acetonide 10 mg/mL); topical dithranol; topical minoxidil (5% lotion) in cases not otherwise responding",
      "Oral corticosteroids may be used if topical treatment is ineffective, tapering dosage over two months",
      "Consider early referral to dermatologist for confirmation of diagnosis and reinforcement of advice",
      "Arrange appropriate follow-up",
    ],
    keyIssues: [
      "Effective communication skills — appropriate language, verbal and non-verbal communication, good interpersonal skills",
      "Showing empathy, sensitivity and perceptiveness, as well as being honest and generating trust and confidence",
      "Place of topical and systemic treatment and prognosis",
    ],
    criticalErrors: [],
    underlyingDiagnosis:
      "Alopecia areata — a chronically relapsing autoimmune disease with extremely variable natural history. Approximately 33% chance of complete regrowth within six months, 50% chance within one year. The hair follicle is never destroyed, so potential for regrowth always remains.",
    differentialDiagnosis: [
      "Alopecia areata (most likely)",
      "Androgenetic alopecia",
      "Thyroid disease (to exclude)",
      "Alopecia universalis (severe variant)",
    ],
    commentary:
      "Alopecia areata is a descriptive term for one or more discrete circular areas of hair loss. The condition is a chronically relapsing autoimmune disease with an extremely variable natural history. Patches on the scalp may regrow spontaneously, remain unaltered or enlarge and coalesce into alopecia totalis. The aetiology is unknown, but a family history is present in 20% of cases. There may be a specific trigger such as a febrile illness or severe emotional stress. The doctor must be empathic, sensitive and perceptive, while honest about the uncertain prognosis.",
  },

  // ── CONDITION 007 ────────────────────────────────────────────────────────
  {
    id: 7,
    mcatNumber: "007",
    title: "An unusual feeling in the throat in a 30-year-old man",
    category: "C",
    subcategory: "1-A Communication, Counselling and Patient Education",
    difficulty: "medium",
    source: "AMC Handbook of Clinical Assessment (Australian Medical Council, 2007), Condition 007",
    patientProfile: "30-year-old man, happily married with two children. Parents and siblings in good health. Apart from vasectomy two years ago, past medical history clear. Smokes 10–15 cigarettes daily. Drinks socially at weekends.",
    chiefComplaint: "unusual feeling in the throat — 'a knot'",

    candidateInfo: "You are a doctor. Your next patient is a 30-year-old man complaining of an unusual feeling in his throat. Your tasks are to take a focused history, select appropriate investigations and counsel the patient about the diagnosis.",
    tasks: [
      "Take a focused history",
      "Select appropriate investigations",
      "Counsel and educate the patient",
    ],

    openingStatement: "I keep getting a lump in my throat. It feels like a knot.",
    historyWithoutPrompting:
      "I have become concerned since a recent vomiting episode. I have had no previous worry about my health and no idea what the nature of my complaint is, but now wish to have it thoroughly investigated. Over the last 4–6 weeks: my throat tightens up; I have excessive saliva; I clear my throat repeatedly; a few days ago it was very bad and I vomited; it occurs mostly after my evening meal; the feeling lasts 3–4 hours, usually until I go to bed; I swallow more often when I have it; there is definitely no difficulty swallowing solids or liquids which go down easily without discomfort; when my throat tightens, my voice can 'catch', and my eyes water; my voice is otherwise unaffected.",
    historyWithPrompting:
      "No hoarseness of the voice. No sore throat, cough, or nasal or postnasal discharge. No loss of weight, appetite change, abdominal pain or regurgitation (water brash). No shortness of breath, palpitations, chest pain or dizzy spells. No aggravation of symptoms brought on by lying down. I sleep well, have no other symptoms and do not take any medications. I feel fit; have no past history of anxiety or other psychiatric illness; do not feel depressed or anxious; have no particular worries about everyday life, wife and children; I am conscientious and hardworking but not a worrier. I have felt annoyed in the past few months when having to work weekends — I feel I should be with my family. A cousin died from cancer of the larynx three months ago — he had been a heavy smoker and drinker in adult life and I grew apart from him. I was upset by his death but no more than I would expect for normal grief. (If the doctor reassures you without discussing the possibility of any investigations, say: 'You don't seem to be taking my complaint seriously.' If the doctor advises multiple investigations all to be done at once, say: 'Isn't there just a simple test to check my throat?')",
    patientQuestions: [],

    physicalExaminationFindings:
      "After five minutes the examiner should say to the candidate: 'Physical examination of this patient is completely normal. You should now discuss the problem with the patient as stated in your tasks.'",

    aimsOfStation:
      "To assess the candidate's ability to take a satisfactory history about globus pharyngeus disorder and to display perspective in selecting appropriate investigations, and skill in counselling and educating a patient about the condition.",
    expectationsOfPerformance: [
      "Take focused history to exclude dysphagia, hoarseness, and any disturbance in general health — and reveal patient's hidden concern about laryngeal cancer (related to cousin's death)",
      "The diagnosis of globus disorder (subject to laryngoscopy) should be made",
      "Choice of investigations: Laryngoscopy and pharyngoscopy MUST be done; Chest X-ray with thoracic inlet views and barium swallow are acceptable; Upper gastrointestinal endoscopy may be suggested for reassurance; Bronchoscopy is NOT indicated",
      "Patient counselling: explain the most likely diagnosis as a nonserious condition with transient change in sensation or function of the throat; condition is brought on by emotional factors; condition needs limited investigations; investigations are unlikely to reveal any serious process",
      "Physical examination is completely normal (examiner will confirm this)",
    ],
    keyIssues: [
      "Ability to take a focused history",
      "Ability to discuss a probable functional disorder with a concerned patient",
    ],
    criticalErrors: [
      "Failure to request laryngoscopy or upper pharyngeal/oesophageal endoscopy",
      "Failure to indicate to the patient that serious disease is extremely unlikely",
    ],
    underlyingDiagnosis:
      "Globus pharyngeus disorder (globus hystericus). A physiological symptom associated with altered mood states, often grief, but not associated with any specific psychiatric disorder. Physical examination completely normal. Laryngoscopy required to confirm and exclude other causes.",
    differentialDiagnosis: [
      "Globus pharyngeus (most likely)",
      "Gastro-oesophageal reflux",
      "Retrosternal goitre",
      "Carcinoma of laryngopharynx",
      "Oesophageal webs (sideropenic dysphagia)",
    ],
    commentary:
      "Globus pharyngeus disorder is a physiological symptom associated with altered mood states, often grief. The patient's cousin recently died from laryngeal cancer — the role of normal grief and worry about cancer is largely unrecognised by the patient. Elevated cricopharyngeal pressure or abnormal hypopharyngeal motility may exist at the time of the symptoms. The same sensation may result from gastro-oesophageal reflux or from frequent swallowing and mouth dryness. Other causes of upper oesophageal or laryngeal compression must be excluded.",
  },

  // ── CONDITION 008 ────────────────────────────────────────────────────────
  {
    id: 8,
    mcatNumber: "008",
    title: "Pain in the testis following mumps in a 25-year-old man",
    category: "C",
    subcategory: "1-A Communication, Counselling and Patient Education",
    difficulty: "medium",
    source: "AMC Handbook of Clinical Assessment (Australian Medical Council, 2007), Condition 008",
    patientProfile: "25-year-old man, married with one son aged 5. Patient and wife would like to have another child. Has a younger son. Recovering from mumps contracted from older son.",
    chiefComplaint: "painful and tender left testicle following mumps",

    candidateInfo: "You are a doctor. Your patient is a 25-year-old man who had mumps one week ago and has now developed a painful left testicle. He has examined you and will now advise him about his condition. Your tasks are to advise the patient about mumps orchitis, its natural history, management, prognosis and preventive medicine aspects.",
    tasks: [
      "Advise the patient about mumps orchitis — its connection to mumps, natural history, and prognosis",
      "Advise on management including pain control",
      "Address concerns about fertility, sexual function and the other testicle",
      "Address preventive medicine concerns (other son's immunisation)",
    ],

    openingStatement: "Doctor, I had mumps and now my testicle really hurts.",
    historyWithoutPrompting:
      "I thought I was recovering from mumps, having noticed the onset of facial swelling about a week ago. I contracted the disease from my older son aged five years. I am now consulting the doctor about a painful and very tender left testicle. Analgesics (Panadol) have had little effect. I am in quite severe pain and feel most unwell. I am anxious about possible sterility (my wife and I would like to have a daughter), whether the other testis will also be affected, possible impotence, my infectivity (I have a wife and a younger son) and how long I will be away from work.",
    historyWithPrompting:
      "I am cooperative and willing to accept the doctor's advice if presented clearly. Regarding what I know: I need explanation of how mumps causes this; I know analgesics haven't worked well; I am most worried about sterility and impotence.",
    patientQuestions: [
      "What is the connection between the mumps and this trouble?",
      "What can I take for the pain?",
      "Are there any antibiotics or other drugs for this condition?",
      "Will it affect both of my testicles?",
      "Will we be able to have another child, if we decide to?",
      "Will my sex life be affected?",
      "What will happen to the testicle eventually?",
      "When will I be able to go back to work?",
      "Why wasn't my son affected in this way?",
      "Will our younger son get mumps too?",
      "Are there any other complications of mumps?",
    ],

    aimsOfStation:
      "To assess the candidate's knowledge of mumps orchitis including natural history, management, prognosis and preventive medicine aspects, and communication skills in dealing with an unwell and anxious patient.",
    expectationsOfPerformance: [
      "Explain how mumps causes orchitis — viral aetiology, inflammatory response in the testis",
      "Pain management: stronger analgesics containing codeine compound",
      "Antibiotics are NOT indicated at this stage",
      "Discuss fertility: unlikely to be affected as usually only one testis involved — sterility can rarely follow if BOTH testicles are severely affected",
      "Wife can still have another child — fertility not likely to be affected",
      "No problems with sexual life anticipated",
      "Testis may possibly reduce in size but usually remains fully functional; function of the other testis is usually unaffected",
      "Return to work: 7–10 days, depending on how rapidly the pain and swelling persist",
      "Orchitis — inflammation of the testicle — is extremely rare in childhood (explains why son aged 5 was not affected)",
      "Younger son: if already immunised with MMR vaccines, he is at minimal risk; if not immunised, should be immunised",
      "Other complications of mumps: very occasionally mild meningitis (inflammation of the coverings of the brain)",
    ],
    keyIssues: [
      "Knowledge of mumps orchitis — natural history, management, prognosis and preventive aspects",
      "Effective communication with an anxious, unwell patient",
    ],
    criticalErrors: [],
    underlyingDiagnosis:
      "Mumps orchitis. Viral aetiology. Left testis acutely inflamed. Usually unilateral — fertility unlikely to be affected. Antibiotics NOT indicated.",
    differentialDiagnosis: [
      "Mumps orchitis (confirmed by context and history)",
      "Bacterial epididymo-orchitis (unlikely given mumps context)",
    ],
    commentary:
      "Mumps orchitis occurs in post-pubertal males and is extremely rare in childhood. Usually unilateral. The feared complication of sterility only occurs if BOTH testicles are severely damaged, which is rare. Fertility is usually preserved. The candidate needs strong knowledge of mumps complications and preventive medicine (MMR vaccine) alongside compassionate communication with an anxious patient. Antibiotics are NEVER appropriate for mumps orchitis.",
  },

  // ── CONDITION 002 ────────────────────────────────────────────────────────
  {
    id: 2,
    mcatNumber: "002",
    title: "Advice on breastfeeding versus bottle-feeding for a 28-year-old pregnant woman",
    category: "C",
    subcategory: "1-A Communication, Counselling and Patient Education",
    difficulty: "easy",
    source: "AMC Handbook of Clinical Assessment (Australian Medical Council, 2007), Condition 002",
    patientProfile: "28-year-old pregnant woman, expecting first baby in five weeks. Always hoped to breastfeed but has doubts after mother's comment that formula-fed babies grow better.",
    chiefComplaint: "breastfeeding versus bottle-feeding advice",

    candidateInfo: "You are a doctor in general practice. Your next patient is a 28-year-old pregnant woman expecting her first baby in five weeks. She has come with a question about infant feeding — her mother has told her that formula-fed babies grow better than breastfed babies. Your task is to advise her appropriately.",
    tasks: [
      "Advise the patient about the advantages and disadvantages of breastfeeding and bottle-feeding",
      "Address her mother's claim about formula feeding",
      "Advise on safe bottle-feed preparation if relevant",
      "Answer any questions from the patient",
    ],

    openingStatement: "My mother feels that bottle-fed babies gain more weight than breastfed babies and therefore are more healthy. What do you think, doctor?",
    historyWithoutPrompting:
      "I have only five weeks to go and although I always hoped to breastfeed my infant, I have had some doubts about its value recently when my mother mentioned that formula-fed babies grow better than babies who have been breastfed. I have come to discuss this. I realise that I may have to defend what the doctor says to me (about breastfeeding being advantageous), and my own previously held ideas about breastfeeding, against the ideas of my mother with whose opinions I have to live.",
    historyWithPrompting:
      "If not covered, ask: What are the advantages of breastfeeding? I would have thought it is easier to breastfeed. Is there anything special about breast milk? I always thought there was. Do you have to prepare bottle feeds in any special way? Are the formula feeds safe? I thought they contained cow's milk and what if you are allergic to cow's milk?",
    patientQuestions: [
      "What are the advantages of breastfeeding? I would have thought it is easier to breastfeed.",
      "Is there anything special about breast milk? I always thought there was.",
      "Do you have to prepare bottle feeds in any special way?",
      "Are the formula feeds safe? I thought they contained cow's milk and what if you are allergic to cow's milk?",
    ],

    aimsOfStation:
      "To assess the candidate's ability to advise a young expectant mother on the advantages and disadvantages of breastfeeding and bottle-feeding. This scenario tests the candidate's ability to identify the conflict the young mother has in trying to respect what her mother has told her, while knowing that this advice is contrary to her own feelings. It also tests ability to discuss logically the advantages and disadvantages of the different feeding methods as well as testing knowledge on safe bottle-feed preparation.",
    expectationsOfPerformance: [
      "Be nonjudgmental — avoid comments like 'Where on earth did your mother get such an idea?'; rather ask 'Why do you think your mother made such a recommendation?'",
      "Discuss that while breastfeeding is the optimal method of feeding the human infant, a variety of reasons may prevent breastfeeding in practice: illness in the mother; failure to establish lactation (hormonally based); possible illness in the baby (e.g. cleft palate); prematurity; previous extensive breast surgery; heightened anxiety in the mother",
      "Explain that if breastfeeding is unsuccessful, formula-feeding is a safe and very effective alternative",
      "Discuss that formulas are designed to contain the same nutritional components as breast milk but exact reproduction is difficult",
      "Advise there is no advantage of formula-feeding over breastfeeding",
      "Discuss specific advantages of breastfeeding: practical advantages of feeding almost whenever and wherever; increased resistance of baby to infection from immunological constituents (lymphocytes and antibodies); satisfaction derived from feeding and developing a close relationship with the infant",
      "Weight gain is not the only criterion for success — excess weight gain in first 12 months may in fact be detrimental in later life",
      "Stress importance of optimal formula-feeding: sterility is essential; bottles to be washed clean with a bottlebrush; bottles and teats stored in solution (e.g. Milton) then rinsed before use; use cooled boiled water; follow explicit makeup instructions on can; no added scoops; only one day's feed at a time prepared in advance; each feed should contain approximately 30 mL more than anticipated, discard excess",
    ],
    keyIssues: [
      "Empathic answering of this young mother-to-be's questions",
      "Recognition that she is uncomfortable with what her mother has told her but is seeking reassurance and support for her own view",
      "Satisfactory explanation of the advantages and disadvantages of different feeding methods",
      "Candidates should know how formula feeds are prepared",
    ],
    criticalErrors: [],
    underlyingDiagnosis:
      "No underlying illness. Scenario concerns patient education and counselling about infant feeding. Breastfeeding is optimal; formula is a safe and effective alternative when breastfeeding is not possible.",
    differentialDiagnosis: [],
    commentary:
      "Ability to discuss impartially and accurately the relative merits, indications, contraindications and techniques of infant feeding by breastfeeding and by formula-feeding is a requisite for all medical graduates. Good communication skills are paramount.",
  },

  // ── CONDITION 005 ────────────────────────────────────────────────────────
  {
    id: 5,
    mcatNumber: "005",
    title: "Counselling a family after sudden infant death syndrome (SIDS)",
    category: "C",
    subcategory: "1-A Communication, Counselling and Patient Education",
    difficulty: "hard",
    source: "AMC Handbook of Clinical Assessment (Australian Medical Council, 2007), Condition 005",
    patientProfile: "Aunt of infant Andrew, who died apparently from SIDS the day before. Family members have come on behalf of the young single mother who is too distressed to attend. The aunt is the family spokesperson.",
    chiefComplaint: "sudden infant death — family seeking explanation and guidance",

    candidateInfo: "You are a doctor. A family member (the aunt of baby Andrew) has come on behalf of the young single mother whose infant died yesterday, apparently of SIDS. The mother is too distressed to attend. Your tasks are to counsel the family, explain what has happened and what will happen, and arrange support.",
    tasks: [
      "Counsel the family about SIDS and what is known about it",
      "Explain the necessary statutory requirements (police and Coroner notification)",
      "Address the family's questions with empathy",
      "Arrange follow-up contact and support",
    ],

    openingStatement: "We can't understand why Andrew has died!",
    historyWithoutPrompting:
      "We have come on behalf of Andrew's mother who is too distressed to speak. We desperately need to understand why Andrew died, what happens next, and how we can support the family.",
    historyWithPrompting:
      "Andrew had some snuffles — should those snuffles have been treated? Would that have saved him? We are devastated and feel so alone.",
    patientQuestions: [
      "Why do the police have to be involved? Do they think my sister killed her baby?",
      "Why does he have to have an autopsy?",
      "When will we get further information and results of this?",
      "When can we arrange his funeral?",
      "We feel so alone. Is there anyone we can talk to about this?",
      "Should the snuffles have been treated?",
    ],

    aimsOfStation:
      "To assess the candidate's ability in approach to the family and providing empathic counselling in this tragic situation of presumed sudden infant death syndrome (SIDS) where there are no suspicious circumstances. Candidates should outline the statutory requirements (i.e. notifying police and coroner) in a caring and sympathetic manner.",
    expectationsOfPerformance: [
      "Explain that the most likely cause of Andrew's death is SIDS — frequency has fallen from 1 in 500 to approximately 1 in 1000 live births; peak incidence at about four months of age; there are no certain known causes",
      "Explain there can be other causes of sudden infant death (e.g. overwhelming infection) but Andrew's history does not suggest this",
      "Andrew's snuffles were NOT a warning sign — no suggestion that medical treatment would have influenced the outcome",
      "Police and Coroner MUST be notified by law because the death was sudden and unexplained",
      "Role of Police Officer is to assist the Coroner — required to interview all people concerned including the baby's GP",
      "Autopsy is required in all cases — done by very experienced pathologists to find what causes SIDS and exclude other causes of death; tissues will be removed for examination under the microscope",
      "Offer to contact the Coroner to obtain information on initial findings after the autopsy",
      "The Coroner will decide if an inquest needs to be held — with SIDS this is generally not necessary",
      "Offer to contact the local SIDS Support Group",
      "Future management: Follow-up contact with family and with Coroner/pathologist to confirm diagnosis; liaise with support group in counselling the mother when results are available",
    ],
    keyIssues: [
      "Appropriate empathic explanation",
      "Ability to explain the involvement of appropriate authorities and support groups",
      "Offering to arrange for continuing follow-up, contact and support with the family",
    ],
    criticalErrors: [
      "Failure to display empathy in counselling",
      "Failure to recognise and explain need for coronial notification and autopsy",
    ],
    underlyingDiagnosis:
      "Sudden Infant Death Syndrome (SIDS) — presumed. Frequency approximately 1 in 1000 live births. Peak incidence four months. No certain known causes. Autopsy required by law.",
    differentialDiagnosis: [
      "SIDS (most likely)",
      "Overwhelming infection",
      "Other causes of sudden infant death",
    ],
    commentary:
      "Empathy in communication is essential in these tragic circumstances, together with accurate knowledge of legislative requirements. All deaths under these circumstances must be reported to the Coroner and the police must take statements. The caring practitioner will offer to liaise with the Coroner on behalf of the parents. The caring practitioner will offer to keep contact with the grieving couple or parent until confident that this tragic event has been accepted.",
  },
];

export function getScenario(id: number): Scenario | undefined {
  return scenarios.find((s) => s.id === id);
}
