#!/usr/bin/env npx ts-node
/**
 * AMC CAT1 Question Generator
 *
 * Generates high-quality AMC CAT1 MCQ questions using Claude API.
 * Run from the monorepo root:
 *
 *   ANTHROPIC_API_KEY=sk-ant-... npx ts-node scripts/generate-questions.ts
 *
 * Output: appends generated questions to the appropriate topic file in
 *         packages/content/src/questions-<topic>.ts
 *
 * Each batch generates 25 questions per topic. Run multiple times to build
 * up to 3000+ questions.
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── Topic configuration ──────────────────────────────────────────────────────
interface TopicConfig {
  topic: string;
  subtopics: string[];
  outputFile: string;
  varName: string;
  idPrefix: string;
  targetCount: number; // How many to generate this run
}

const TOPIC_CONFIGS: TopicConfig[] = [
  {
    topic: "Cardiovascular",
    subtopics: ["Atrial Fibrillation", "Heart Failure", "STEMI/NSTEMI", "Hypertension", "Valvular Disease", "Peripheral Arterial Disease", "DVT/PE", "Arrhythmias", "Cardiomyopathy", "Aortic Disease", "Pericarditis", "Endocarditis", "Cardiac Risk Factors", "Lipid Management", "Syncope"],
    outputFile: "packages/content/src/questions-cardiovascular.ts",
    varName: "cardiovascularQuestionsGenerated",
    idPrefix: "cv-gen",
    targetCount: 200,
  },
  {
    topic: "Respiratory",
    subtopics: ["Asthma", "COPD", "Pneumonia", "Pulmonary Embolism", "Lung Cancer", "Pleural Disease", "Tuberculosis", "OSA", "Bronchiectasis", "Interstitial Lung Disease", "Pneumothorax", "Sarcoidosis", "Respiratory Failure", "Smoking Cessation"],
    outputFile: "packages/content/src/questions-respiratory.ts",
    varName: "respiratoryQuestionsGenerated",
    idPrefix: "resp-gen",
    targetCount: 175,
  },
  {
    topic: "Gastroenterology",
    subtopics: ["Liver Disease", "IBD", "Colorectal Cancer", "Peptic Ulcer", "Upper GI Bleed", "Pancreatitis", "Gallstones/Biliary", "Hepatitis", "Coeliac Disease", "IBS", "Diverticular Disease", "Colorectal Surgery", "Haemorrhoids", "Jaundice", "Nutrition"],
    outputFile: "packages/content/src/questions-gastro.ts",
    varName: "gastroQuestionsGenerated",
    idPrefix: "gi-gen",
    targetCount: 175,
  },
  {
    topic: "Neurology",
    subtopics: ["Stroke", "TIA", "Epilepsy", "Parkinson's Disease", "Multiple Sclerosis", "Headache", "Dementia", "Peripheral Neuropathy", "Meningitis", "Spinal Cord", "Muscle Disease", "Movement Disorders", "Vertigo", "Cranial Nerves"],
    outputFile: "packages/content/src/questions-neurology.ts",
    varName: "neurologyQuestionsGenerated",
    idPrefix: "neuro-gen",
    targetCount: 175,
  },
  {
    topic: "Endocrinology",
    subtopics: ["Diabetes Type 1", "Diabetes Type 2", "DKA/HHS", "Thyroid Disease", "Adrenal Disorders", "Pituitary Disease", "Parathyroid", "Metabolic Syndrome", "Calcium Disorders", "Obesity", "Polycystic Ovary Syndrome"],
    outputFile: "packages/content/src/questions-endocrine.ts",
    varName: "endocrineQuestionsGenerated",
    idPrefix: "endo-gen",
    targetCount: 150,
  },
  {
    topic: "Psychiatry",
    subtopics: ["Depression", "Anxiety", "Bipolar Disorder", "Psychosis", "Suicide Risk Assessment", "Substance Use", "PTSD", "OCD", "Eating Disorders", "Personality Disorders", "ADHD", "Dementia", "Delirium", "Intellectual Disability", "Child Psychiatry"],
    outputFile: "packages/content/src/questions-psychiatry.ts",
    varName: "psychiatryQuestionsGenerated",
    idPrefix: "psych-gen",
    targetCount: 175,
  },
  {
    topic: "Paediatrics",
    subtopics: ["Neonatology", "Growth and Development", "Respiratory (Paediatric)", "Fever and Sepsis", "Gastrointestinal (Paediatric)", "Neurology (Paediatric)", "Child Abuse", "Immunisation", "Asthma (Paediatric)", "Cardiac (Paediatric)", "Haematology (Paediatric)", "Endocrine (Paediatric)"],
    outputFile: "packages/content/src/questions-paediatrics.ts",
    varName: "paediatricsQuestionsGenerated",
    idPrefix: "paeds-gen",
    targetCount: 150,
  },
  {
    topic: "Obstetrics & Gynaecology",
    subtopics: ["Antenatal Care", "Labour and Delivery", "Postpartum", "Pre-eclampsia", "Gestational Diabetes", "Ectopic Pregnancy", "Miscarriage", "Menstrual Disorders", "Contraception", "Gynaecological Oncology", "Infertility", "Menopause"],
    outputFile: "packages/content/src/questions-obsgyn.ts",
    varName: "obsgynQuestionsGenerated",
    idPrefix: "og-gen",
    targetCount: 125,
  },
  {
    topic: "Emergency Medicine",
    subtopics: ["Anaphylaxis", "Sepsis and Shock", "Poisoning and Overdose", "Trauma", "Burns", "Airway Emergencies", "Cardiac Arrest", "Neurological Emergencies", "Metabolic Emergencies", "Environmental Emergencies", "Paediatric Emergencies"],
    outputFile: "packages/content/src/questions-emergency.ts",
    varName: "emergencyQuestionsGenerated",
    idPrefix: "em-gen",
    targetCount: 125,
  },
  {
    topic: "Renal",
    subtopics: ["AKI", "CKD", "Glomerulonephritis", "Nephrotic Syndrome", "UTI/Pyelonephritis", "Renal Calculi", "Electrolyte Disorders", "BPH/Urological", "Haemodialysis", "Hyponatraemia", "Hyperkalaemia"],
    outputFile: "packages/content/src/questions-renal.ts",
    varName: "renalQuestionsGenerated",
    idPrefix: "renal-gen",
    targetCount: 125,
  },
  {
    topic: "Rheumatology",
    subtopics: ["Rheumatoid Arthritis", "SLE", "Gout", "Osteoarthritis", "Ankylosing Spondylitis", "Psoriatic Arthritis", "Osteoporosis", "Polymyalgia Rheumatica", "Vasculitis", "Fibromyalgia", "Reactive Arthritis", "Septic Arthritis", "Crystal Arthropathy"],
    outputFile: "packages/content/src/questions-rheumatology.ts",
    varName: "rheumatologyQuestionsGenerated",
    idPrefix: "rheum-gen",
    targetCount: 100,
  },
  {
    topic: "Infectious Disease",
    subtopics: ["HIV/AIDS", "STIs", "Respiratory Infections", "Tropical Medicine", "Antimicrobial Stewardship", "Hepatitis", "Skin Infections", "Food-borne Illness", "Vector-borne Disease", "Immunisation Preventable"],
    outputFile: "packages/content/src/questions-infectious.ts",
    varName: "infectiousQuestionsGenerated",
    idPrefix: "inf-gen",
    targetCount: 100,
  },
  {
    topic: "Surgery",
    subtopics: ["General Surgery", "Colorectal", "Hepatobiliary", "Vascular", "Breast", "Endocrine Surgery", "Trauma Surgery", "Head and Neck", "Perioperative Care", "Wound Management"],
    outputFile: "packages/content/src/questions-surgery.ts",
    varName: "surgeryQuestionsGenerated",
    idPrefix: "surg-gen",
    targetCount: 100,
  },
  {
    topic: "Pharmacology",
    subtopics: ["Drug Interactions", "Adverse Effects", "Prescribing in Special Populations", "Antibiotics", "Analgesics", "Cardiovascular Drugs", "CNS Drugs", "Anticoagulation", "Drug Overdose/Toxicology", "Medication Review"],
    outputFile: "packages/content/src/questions-pharmacology.ts",
    varName: "pharmacologyQuestionsGenerated",
    idPrefix: "pharm-gen",
    targetCount: 125,
  },
];

// ── Question generation prompt ───────────────────────────────────────────────
function buildPrompt(config: TopicConfig, batchIndex: number, batchSize: number): string {
  return `You are an expert AMC (Australian Medical Council) CAT1 exam question writer.

Generate exactly ${batchSize} high-quality AMC CAT1 MCQ questions for the topic "${config.topic}".

REQUIREMENTS:
- Each question must be a realistic AMC CAT1 style scenario (clinical vignette)
- Follow Australian clinical practice guidelines (Therapeutic Guidelines, RACGP, AMC Handbook)
- Each question has EXACTLY 5 options (A through E), single best answer
- Subtopics to cover (spread across): ${config.subtopics.join(", ")}
- Mix of difficulties: ~30% easy, ~50% medium, ~20% hard
- IDs must start with "${config.idPrefix}-b${batchIndex}-" followed by 001, 002, etc.
- References should be "amc", "murtagh", or "racgp-redbook"

OUTPUT FORMAT (valid TypeScript array, NO markdown, NO backticks):
[
  {
    id: "${config.idPrefix}-b${batchIndex}-001",
    topic: "${config.topic}",
    subtopic: "Specific Subtopic",
    stem: "Clinical vignette question stem...",
    options: [
      { label: "A", text: "Option A text" },
      { label: "B", text: "Option B text" },
      { label: "C", text: "Option C text" },
      { label: "D", text: "Option D text" },
      { label: "E", text: "Option E text" },
    ],
    correctAnswer: "A",
    explanation: "Detailed explanation with clinical reasoning, guideline references, and key learning points...",
    reference: "amc",
    difficulty: "medium",
  },
  ...
]

Generate exactly ${batchSize} questions. Output only the TypeScript array starting with [ and ending with ].`;
}

// ── File update helpers ──────────────────────────────────────────────────────
function getExistingIds(filePath: string): Set<string> {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const matches = content.match(/id: "([^"]+)"/g) ?? [];
    return new Set(matches.map((m) => m.replace(/id: "|"/g, "")));
  } catch {
    return new Set();
  }
}

function appendQuestionsToFile(
  filePath: string,
  varName: string,
  questionsTs: string
): void {
  const fullPath = path.join(process.cwd(), filePath);

  if (!fs.existsSync(fullPath)) {
    // Create new file
    const content = `import type { MCQuestion } from "./questions";\n\nexport const ${varName}: MCQuestion[] = ${questionsTs};\n`;
    fs.writeFileSync(fullPath, content, "utf-8");
    console.log(`Created: ${filePath}`);
    return;
  }

  // Append to existing array
  let existing = fs.readFileSync(fullPath, "utf-8");

  // Find the closing ]; of the last exported array
  const lastBracket = existing.lastIndexOf("];");
  if (lastBracket === -1) {
    console.warn(`Could not find closing ]; in ${filePath} — skipping`);
    return;
  }

  // Parse generated questions array
  let parsed: string;
  try {
    // Clean up the generated TS array string
    parsed = questionsTs
      .trim()
      .replace(/^\[/, "")
      .replace(/\]$/, "")
      .trim();
  } catch (e) {
    console.error("Failed to parse questions:", e);
    return;
  }

  // Insert before the closing ];
  const updated =
    existing.slice(0, lastBracket) +
    ",\n  " +
    parsed +
    "\n" +
    existing.slice(lastBracket);

  fs.writeFileSync(fullPath, updated, "utf-8");
  console.log(`Updated: ${filePath}`);
}

// ── Main generation loop ─────────────────────────────────────────────────────
async function generateForTopic(config: TopicConfig, batchSize = 25): Promise<void> {
  const fullPath = path.join(process.cwd(), config.outputFile);
  const existingIds = getExistingIds(fullPath);
  const currentCount = existingIds.size;

  if (currentCount >= config.targetCount) {
    console.log(`✓ ${config.topic}: Already at ${currentCount}/${config.targetCount} — skipping`);
    return;
  }

  const needed = config.targetCount - currentCount;
  const batches = Math.ceil(needed / batchSize);

  console.log(`\n📝 Generating ${needed} questions for ${config.topic} (${batches} batches of ${batchSize})`);

  for (let b = 0; b < batches; b++) {
    const thisBatchSize = Math.min(batchSize, needed - b * batchSize);
    const batchIndex = Math.floor(currentCount / batchSize) + b + 1;

    console.log(`  Batch ${b + 1}/${batches} (${thisBatchSize} questions)...`);

    try {
      const response = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 8000,
        messages: [
          {
            role: "user",
            content: buildPrompt(config, batchIndex, thisBatchSize),
          },
        ],
      });

      const raw = response.content[0].type === "text" ? response.content[0].text : "";

      // Extract the array
      const arrayMatch = raw.match(/\[[\s\S]*\]/);
      if (!arrayMatch) {
        console.error(`  ✗ Batch ${b + 1}: Could not extract array from response`);
        console.error("  Response preview:", raw.slice(0, 200));
        continue;
      }

      appendQuestionsToFile(config.outputFile, config.varName, arrayMatch[0]);
      console.log(`  ✓ Batch ${b + 1} added`);

      // Rate limiting: wait 1s between batches
      if (b < batches - 1) await new Promise((r) => setTimeout(r, 1000));
    } catch (err) {
      console.error(`  ✗ Batch ${b + 1} failed:`, err);
    }
  }
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("Error: ANTHROPIC_API_KEY environment variable not set");
    console.error("Usage: ANTHROPIC_API_KEY=sk-ant-... npx ts-node scripts/generate-questions.ts");
    process.exit(1);
  }

  console.log("🚀 AMC CAT1 Question Generator");
  console.log("================================");
  console.log(`Target: ~3000 questions across ${TOPIC_CONFIGS.length} topics\n`);

  for (const config of TOPIC_CONFIGS) {
    await generateForTopic(config);
  }

  console.log("\n✅ Generation complete!");
  console.log("Next steps:");
  console.log("  1. Run: pnpm build (to verify TypeScript compiles)");
  console.log("  2. Deploy to Vercel");
}

main().catch(console.error);
