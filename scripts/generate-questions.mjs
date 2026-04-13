#!/usr/bin/env node
/**
 * AMC CAT1 Question Generator (ESM)
 * Usage: node scripts/generate-questions.mjs
 * Requires ANTHROPIC_API_KEY in environment (loads from apps/web/.env.local)
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

// Load ANTHROPIC_API_KEY from .env.local if not already set
if (!process.env.ANTHROPIC_API_KEY) {
  try {
    const envFile = fs.readFileSync(path.join(ROOT, "apps/web/.env.local"), "utf-8");
    const match = envFile.match(/ANTHROPIC_API_KEY=(.+)/);
    if (match) process.env.ANTHROPIC_API_KEY = match[1].replace(/^"|"$/g, "").trim();
  } catch {}
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("Error: ANTHROPIC_API_KEY not found in env or apps/web/.env.local");
  process.exit(1);
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── Topic batches ────────────────────────────────────────────────────────────
const BATCHES = [
  {
    topic: "Cardiovascular",
    subtopics: ["Atrial Fibrillation", "Heart Failure", "STEMI/NSTEMI", "Hypertension", "Valvular Disease", "Peripheral Arterial Disease", "DVT/PE", "Arrhythmias", "Cardiomyopathy", "Aortic Disease"],
    file: "packages/content/src/questions-cardiovascular.ts",
    idPrefix: "cv",
    target: 300,
  },
  {
    topic: "Respiratory",
    subtopics: ["Asthma", "COPD", "Pneumonia", "Pulmonary Embolism", "Lung Cancer", "Pleural Disease", "Tuberculosis", "OSA", "Bronchiectasis", "Interstitial Lung Disease"],
    file: "packages/content/src/questions-respiratory.ts",
    idPrefix: "resp",
    target: 250,
  },
  {
    topic: "Gastroenterology",
    subtopics: ["Liver Disease", "IBD", "Colorectal Cancer", "Peptic Ulcer/GORD", "Upper GI Bleed", "Pancreatitis", "Gallstones", "Hepatitis B/C", "Coeliac Disease", "IBS"],
    file: "packages/content/src/questions-gastro.ts",
    idPrefix: "gi",
    target: 250,
  },
  {
    topic: "Neurology",
    subtopics: ["Stroke/TIA", "Epilepsy", "Parkinson's Disease", "Multiple Sclerosis", "Headache", "Dementia", "Peripheral Neuropathy", "Meningitis/Encephalitis", "Spinal Cord", "Vertigo"],
    file: "packages/content/src/questions-neurology.ts",
    idPrefix: "neuro",
    target: 250,
  },
  {
    topic: "Endocrinology",
    subtopics: ["Diabetes Management", "DKA/HHS", "Thyroid Disease", "Adrenal Disorders", "Pituitary Disease", "Parathyroid/Calcium", "Metabolic Syndrome", "PCOS"],
    file: "packages/content/src/questions-endocrine.ts",
    idPrefix: "endo",
    target: 200,
  },
  {
    topic: "Psychiatry",
    subtopics: ["Depression", "Anxiety/Panic", "Bipolar Disorder", "Psychosis/Schizophrenia", "Suicide Assessment", "Substance Use", "PTSD", "OCD", "Eating Disorders", "Personality Disorders"],
    file: "packages/content/src/questions-psychiatry.ts",
    idPrefix: "psych",
    target: 200,
  },
  {
    topic: "Paediatrics",
    subtopics: ["Neonatology", "Developmental Paediatrics", "Paediatric Respiratory", "Fever/Sepsis", "Paediatric GI", "Paediatric Neurology", "Child Protection", "Immunisation", "Paediatric Emergencies"],
    file: "packages/content/src/questions-paediatrics.ts",
    idPrefix: "paeds",
    target: 200,
  },
  {
    topic: "Obstetrics & Gynaecology",
    subtopics: ["Antenatal Care", "Labour/Delivery", "Obstetric Complications", "Gynaecological Oncology", "Menstrual Disorders", "Contraception", "Infertility", "Menopause"],
    file: "packages/content/src/questions-obsgyn.ts",
    idPrefix: "og",
    target: 150,
  },
  {
    topic: "Emergency Medicine",
    subtopics: ["Anaphylaxis", "Septic Shock", "Poisoning/Overdose", "Major Trauma", "Burns", "Cardiac Arrest", "Respiratory Emergency", "Metabolic Emergency"],
    file: "packages/content/src/questions-emergency.ts",
    idPrefix: "em",
    target: 150,
  },
  {
    topic: "Renal",
    subtopics: ["AKI", "CKD", "Glomerulonephritis", "Nephrotic/Nephritic", "UTI/Pyelonephritis", "Renal Calculi", "Electrolytes", "BPH/Urological"],
    file: "packages/content/src/questions-renal.ts",
    idPrefix: "renal",
    target: 150,
  },
  {
    topic: "Rheumatology",
    subtopics: ["Rheumatoid Arthritis", "SLE/Connective Tissue", "Gout/Crystal", "Osteoarthritis", "Spondyloarthropathy", "Osteoporosis", "Vasculitis", "Inflammatory Myopathy"],
    file: "packages/content/src/questions-rheumatology.ts",
    idPrefix: "rheum",
    target: 125,
  },
  {
    topic: "Infectious Disease",
    subtopics: ["HIV/AIDS", "STIs/Sexual Health", "Respiratory Infections", "Tropical Medicine", "Skin/Soft Tissue Infection", "CNS Infections", "Hepatitis", "Antimicrobial Prescribing"],
    file: "packages/content/src/questions-infectious.ts",
    idPrefix: "inf",
    target: 125,
  },
  {
    topic: "Surgery",
    subtopics: ["Acute Abdomen", "Colorectal Surgery", "Hepatobiliary Surgery", "Vascular Surgery", "Breast Surgery", "Thyroid/Parathyroid Surgery", "Trauma Surgery", "Perioperative Care"],
    file: "packages/content/src/questions-surgery.ts",
    idPrefix: "surg",
    target: 125,
  },
  {
    topic: "Pharmacology",
    subtopics: ["Drug Interactions", "Adverse Drug Reactions", "Prescribing in Renal/Hepatic Impairment", "Antibiotics", "Cardiovascular Pharmacology", "CNS/Psych Drugs", "Anticoagulation", "Overdose/Toxicology"],
    file: "packages/content/src/questions-pharmacology.ts",
    idPrefix: "pharm",
    target: 150,
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function countExistingQuestions(filePath) {
  const fullPath = path.join(ROOT, filePath);
  try {
    const content = fs.readFileSync(fullPath, "utf-8");
    return (content.match(/id: "/g) || []).length;
  } catch {
    return 0;
  }
}

function appendQuestions(filePath, questionsArray) {
  const fullPath = path.join(ROOT, filePath);

  if (!fs.existsSync(fullPath)) {
    console.warn(`  File not found: ${filePath}`);
    return 0;
  }

  let existing = fs.readFileSync(fullPath, "utf-8");
  const lastBracket = existing.lastIndexOf("];");
  if (lastBracket === -1) {
    console.warn(`  No ]; found in ${filePath}`);
    return 0;
  }

  // Serialize each question as TypeScript object
  const serialised = questionsArray
    .map((q) => {
      const optionsTs = q.options
        .map((o) => `      { label: "${o.label}", text: ${JSON.stringify(o.text)} }`)
        .join(",\n");
      return `  {
    id: ${JSON.stringify(q.id)},
    topic: ${JSON.stringify(q.topic)},
    subtopic: ${JSON.stringify(q.subtopic)},
    stem: ${JSON.stringify(q.stem)},
    options: [
${optionsTs},
    ],
    correctAnswer: ${JSON.stringify(q.correctAnswer)},
    explanation: ${JSON.stringify(q.explanation)},
    reference: ${JSON.stringify(q.reference)},
    difficulty: ${JSON.stringify(q.difficulty)},
  }`;
    })
    .join(",\n");

  const updated =
    existing.slice(0, lastBracket) + ",\n" + serialised + "\n" + existing.slice(lastBracket);

  fs.writeFileSync(fullPath, updated, "utf-8");
  return questionsArray.length;
}

function buildPrompt(topic, subtopics, idPrefix, batchNum, count) {
  return `You are an expert AMC (Australian Medical Council) CAT1 exam question writer with deep knowledge of Australian clinical guidelines.

Generate exactly ${count} high-quality AMC CAT1 MCQ questions for the topic "${topic}".

STRICT REQUIREMENTS:
1. Each question MUST be a realistic clinical vignette (2-5 sentences with patient age, sex, symptoms, examination findings, investigations)
2. Questions follow Australian clinical practice (Therapeutic Guidelines, RACGP, AMC Handbook 2007, eTG)
3. Each question has EXACTLY 5 options (A through E), one single best answer
4. Subtopics to cover (spread evenly): ${subtopics.join(", ")}
5. Difficulty mix: 30% easy, 50% medium, 20% hard
6. Explanations must be detailed with clinical reasoning (3-5 sentences)
7. All IDs must be "${idPrefix}-b${batchNum}-001" through "${idPrefix}-b${batchNum}-${String(count).padStart(3, "0")}"

OUTPUT: Return ONLY a valid JSON array. No markdown, no commentary, no backticks.
Each object MUST have: id, topic, subtopic, stem, options (array of {label, text}), correctAnswer, explanation, reference, difficulty

[
  {
    "id": "${idPrefix}-b${batchNum}-001",
    "topic": "${topic}",
    "subtopic": "specific subtopic",
    "stem": "A 55-year-old woman presents with...",
    "options": [
      {"label": "A", "text": "..."},
      {"label": "B", "text": "..."},
      {"label": "C", "text": "..."},
      {"label": "D", "text": "..."},
      {"label": "E", "text": "..."}
    ],
    "correctAnswer": "B",
    "explanation": "Detailed clinical explanation...",
    "reference": "amc",
    "difficulty": "medium"
  }
]`;
}

// ── Main ─────────────────────────────────────────────────────────────────────
const BATCH_SIZE = 20; // 20 questions per API call

async function generateBatch(config, batchNum, count) {
  const prompt = buildPrompt(config.topic, config.subtopics, config.idPrefix, batchNum, count);

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 16000,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  // Extract JSON array
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) {
    throw new Error("No JSON array found in response");
  }

  const parsed = JSON.parse(match[0]);
  if (!Array.isArray(parsed)) throw new Error("Parsed result is not an array");

  return parsed;
}

async function main() {
  console.log("🚀 AMC CAT1 Question Generator");
  console.log("=================================");

  let totalGenerated = 0;

  for (const config of BATCHES) {
    const current = countExistingQuestions(config.file);
    const needed = Math.max(0, config.target - current);

    if (needed === 0) {
      console.log(`✓ ${config.topic}: ${current}/${config.target} — skipping`);
      continue;
    }

    console.log(`\n📝 ${config.topic}: ${current} → ${config.target} (need ${needed})`);

    const batches = Math.ceil(needed / BATCH_SIZE);
    let topicGenerated = 0;

    for (let b = 0; b < batches; b++) {
      const batchCount = Math.min(BATCH_SIZE, needed - b * BATCH_SIZE);
      const batchNum = Math.floor(current / BATCH_SIZE) + b + 1;

      process.stdout.write(`  Batch ${b + 1}/${batches} (${batchCount} questions)... `);

      try {
        const questions = await generateBatch(config, batchNum, batchCount);
        const added = appendQuestions(config.file, questions);
        topicGenerated += added;
        totalGenerated += added;
        console.log(`✓ ${added} added`);
      } catch (err) {
        console.log(`✗ Failed: ${err.message}`);
      }

      // Small delay between batches
      if (b < batches - 1) await new Promise((r) => setTimeout(r, 800));
    }

    const finalCount = countExistingQuestions(config.file);
    console.log(`  ${config.topic}: ${finalCount} total questions`);
  }

  console.log(`\n✅ Done! Generated ${totalGenerated} new questions`);
  console.log("Run 'pnpm build' to verify compilation.");
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
