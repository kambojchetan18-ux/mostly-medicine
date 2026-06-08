// Shared slug → deck map for the mobile flashcards tab. Mirrors the deck
// list on apps/web/src/app/dashboard/flashcards/page.tsx so the two clients
// stay in lockstep — descriptions are shorter here to fit a phone row.
import {
  cardiologyFlashcards,
  respiratoryFlashcards,
  gastroFlashcards,
  neurologyFlashcards,
  endocrineFlashcards,
  obgynFlashcards,
  paediatricsFlashcards,
  psychiatryFlashcards,
  emergencyFlashcards,
  aboriginalHealthFlashcards,
  ruralFlashcards,
  culturalSafetyFlashcards,
  ethicsLawFlashcards,
  pharmacologyFlashcards,
  dermatologyFlashcards,
  rheumatologyFlashcards,
  geriatricsFlashcards,
  palliativeFlashcards,
  infectiousDiseasesFlashcards,
  haematologyOncologyFlashcards,
  nephrologyFlashcards,
  type Flashcard,
} from '@mostly-medicine/content';

export type Deck = {
  slug: string;
  name: string;
  description: string;
  citation: string;
  cards: Flashcard[];
};

export const DECKS: Deck[] = [
  // Core clinical specialties
  { slug: 'cardiology',          name: 'Cardiology',              description: 'AF · HF · ACS · HTN · valvular',                  citation: 'Murtagh · NHFA · RACGP',                  cards: cardiologyFlashcards },
  { slug: 'respiratory',         name: 'Respiratory',             description: 'Asthma · COPD · CAP · PE · pneumothorax',         citation: 'NACA · eTG · COPD-X',                     cards: respiratoryFlashcards },
  { slug: 'gastroenterology',    name: 'Gastroenterology',        description: 'GORD · IBD · coeliac · HBV/HCV · GI bleed',       citation: 'eTG · GESA · ASHM',                       cards: gastroFlashcards },
  { slug: 'neurology',           name: 'Neurology',               description: 'Stroke · TIA · seizure · migraine · dementia',    citation: 'Stroke Foundation AU · eTG · Austroads',  cards: neurologyFlashcards },
  { slug: 'endocrine',           name: 'Endocrinology',           description: 'T2DM · DKA · thyroid · adrenal · PCOS',           citation: 'Diabetes Australia · eTG · ADIPS',        cards: endocrineFlashcards },
  { slug: 'obgyn',               name: 'Obstetrics & Gynae',      description: 'Antenatal · pre-eclampsia · GDM · NCSP',          citation: 'RANZCOG · SOMANZ · NCSP',                 cards: obgynFlashcards },
  { slug: 'paediatrics',         name: 'Paediatrics',             description: 'AU NIP · bronchiolitis · croup · febrile infant', citation: 'AU Immunisation Handbook · ATAGI · RCH',  cards: paediatricsFlashcards },
  { slug: 'psychiatry',          name: 'Psychiatry',              description: 'MDD · suicide · bipolar · schizophrenia · MHA',   citation: 'RANZCP · MHA · Phoenix · Orygen',         cards: psychiatryFlashcards },
  { slug: 'emergency',           name: 'Emergency Medicine',      description: 'ATLS · anaphylaxis · sepsis · STEMI · toxicology', citation: 'ANZCOR · ATLS 10 · ASCIA',                cards: emergencyFlashcards },
  // Tier 4 AU moat
  { slug: 'aboriginal-health',   name: 'Aboriginal & TSI Health', description: 'Closing the Gap · RHD · 715 check · SEWB',        citation: 'NACCHO · CARPA STM 8 · RHDAustralia',     cards: aboriginalHealthFlashcards },
  { slug: 'rural',               name: 'Rural & Remote',          description: 'ACRRM · RFDS · MM categories · tropical',         citation: 'ACRRM · RFDS · CARPA',                    cards: ruralFlashcards },
  { slug: 'cultural-safety',     name: 'Cultural Safety',         description: 'AHPRA 2020 · LGBTQI+ · refugee · TIS',            citation: 'AHPRA · AusPATH · TIS National',          cards: culturalSafetyFlashcards },
  { slug: 'ethics',              name: 'Ethics & Medico-Legal',   description: 'Capacity · consent · VAD · Austroads · coroner',  citation: 'Medical Board AU · Austroads · VAD',      cards: ethicsLawFlashcards },
  { slug: 'pharmacology',        name: 'AU Pharmacology',         description: 'PBS · S8 · RTPM · CTG · DOAC · sick-day rules',   citation: 'PBS · TGA · eTG · ASHM',                  cards: pharmacologyFlashcards },
  // Sub-specialty
  { slug: 'infectious-diseases', name: 'Infectious Diseases',     description: 'Sepsis · CAP · UTI · TB · HIV · STIs · COVID',    citation: 'eTG Antibiotic · ASHM · ATAGI',           cards: infectiousDiseasesFlashcards },
  { slug: 'haematology',         name: 'Haem & Oncology',         description: 'IDA · myeloma · DVT/PE · BreastScreen · NBCSP',   citation: 'Cancer Council AU · NBCSP · eviQ',        cards: haematologyOncologyFlashcards },
  { slug: 'nephrology',          name: 'Nephrology',              description: 'CKD · AKI · stones · hyperK · transplant',        citation: 'KDIGO · CKD-Australia · KHA',             cards: nephrologyFlashcards },
  { slug: 'dermatology',         name: 'Dermatology',             description: 'Skin cancer · SunSmart · eczema · scabies',       citation: 'ACD · TG Derm · SunSmart',                cards: dermatologyFlashcards },
  { slug: 'rheumatology',        name: 'Rheumatology',            description: 'RA · gout · septic arthritis · SLE · PMR',        citation: 'ARA · TG Rheum · ANZBMS',                 cards: rheumatologyFlashcards },
  { slug: 'geriatrics',          name: 'Geriatrics',              description: 'Frailty · falls · delirium · polypharmacy · ACP', citation: 'ANZSGM · My Aged Care · EoL Essentials',  cards: geriatricsFlashcards },
  { slug: 'palliative',          name: 'Palliative Care',         description: 'WHO ladder · opioid conversion · VAD · SPIKES',   citation: 'Palliative Care AU · CareSearch · VAD',   cards: palliativeFlashcards },
];

export const DECK_BY_SLUG: Record<string, Deck> = Object.fromEntries(
  DECKS.map((d) => [d.slug, d]),
);
