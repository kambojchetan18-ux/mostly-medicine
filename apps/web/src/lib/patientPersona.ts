// Deterministic patient-persona generation for AMC RolePlay UI.
//
// Goals:
//   - Given the existing scenario.patientProfile / chiefComplaint strings
//     in packages/ai/src/scenarios.ts, extract age + sex without any
//     manual data migration.
//   - Generate a stable display name (first + last) so every render of
//     the same scenario shows the same Margaret Johnson, every render of
//     scenario 42 shows the same patient. Seed = scenario id + title.
//   - Names cover South-Asian, East-Asian, European, Anglo-AU, Middle
//     Eastern and Indigenous Australian patterns so the case list looks
//     like Australia, not a US sitcom.
//   - Pure functions. No network, no Dicebear, no React — used by both
//     server and client components.

export type PatientSex = "female" | "male" | "unknown";

export interface PatientPersona {
  /** Full display name "First Last" — deterministic from seed. */
  name: string;
  /** First name only — for shorter labels. */
  firstName: string;
  /** Last name only. */
  lastName: string;
  /** Age in years, parsed from profile. `null` when no integer found. */
  age: number | null;
  /** Patient sex if parseable, else "unknown". */
  sex: PatientSex;
  /** Stable seed string used by the Dicebear avatar. */
  avatarSeed: string;
  /** Short demographic label e.g. "72-year-old woman" — null if unparseable. */
  demographic: string | null;
}

// Curated name lists. Length is intentionally a prime-ish odd number to
// avoid alignment artefacts when hashing into them.
const FEMALE_FIRST: readonly string[] = [
  "Margaret", "Sarah", "Priya", "Anjali", "Emma", "Olivia", "Mei", "Linh",
  "Aisha", "Fatima", "Sophia", "Hannah", "Mia", "Layla", "Rachel", "Jasmine",
  "Lucy", "Grace", "Chloe", "Yara", "Saanvi", "Wen", "Ruby", "Daisy", "Bella",
  "Indira", "Marni", "Tara", "Sienna", "Elena", "Nour", "Hiroko", "Maya",
  "Charlotte", "Amelia", "Isabella", "Ava", "Zara", "Nadia", "Vivian", "Lily",
];

const MALE_FIRST: readonly string[] = [
  "James", "Michael", "David", "Robert", "William", "Liam", "Noah", "Ethan",
  "Arjun", "Vikram", "Hiroshi", "Kenji", "Ahmed", "Omar", "Hassan", "Jamal",
  "Wei", "Jun", "Chen", "Raj", "Sanjay", "Daniel", "Matthew", "Andrew",
  "Joshua", "Benjamin", "Tom", "Jack", "Oliver", "Henry", "Luke", "Aaron",
  "Jirra", "Yidaki", "Mustafa", "Ali", "Karim", "Felipe", "Diego", "Sergio",
];

const LAST_NAMES: readonly string[] = [
  "Smith", "Johnson", "Brown", "Williams", "Jones", "Patel", "Singh", "Khan",
  "Nguyen", "Tran", "Chen", "Wang", "Li", "Kim", "Park", "Lee", "Wilson",
  "Taylor", "Anderson", "Thompson", "Martin", "Garcia", "Rodriguez", "Lopez",
  "Hassan", "Ahmed", "Yilmaz", "Wright", "Murphy", "Walsh", "O'Connor", "Ryan",
  "Sharma", "Verma", "Kaur", "Bose", "Tanaka", "Suzuki", "Yamamoto", "Liu",
];

// Word -> sex lookup. Tokens are matched case-insensitively against a small
// window around the age token in `parseAgeSex`.
const FEMALE_TOKENS = new Set([
  "woman", "female", "girl", "lady", "she", "her", "mother", "mum", "mom",
  "daughter", "wife", "primigravida", "multigravida", "nulliparous", "g0p0",
  "g1p0", "g1p1", "g2p1", "puerperium", "pregnant", "gravida",
]);

const MALE_TOKENS = new Set([
  "man", "male", "boy", "gentleman", "he", "him", "father", "dad", "son",
  "husband", "prostate", "testicular", "scrotal", "phimosis",
]);

// Cheap deterministic 32-bit hash (Cyrb53-like). Good enough to pick name
// indices from a small list; we don't need cryptographic strength.
function hashString(seed: string): number {
  let h1 = 0xdeadbeef ^ seed.length;
  let h2 = 0x41c6ce57 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    const ch = seed.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h2 >>> 0) * 0x100000000 + (h1 >>> 0);
}

function pick<T>(list: readonly T[], hash: number, offset: number): T {
  // Mix in the offset so first/last/avatar all derive from different bits
  // of the same parent hash without trivial correlation.
  const mixed = (hash + offset * 2654435761) >>> 0;
  return list[mixed % list.length];
}

function parseAgeSex(profileText: string): { age: number | null; sex: PatientSex } {
  if (!profileText) return { age: null, sex: "unknown" };
  const text = profileText.toLowerCase();

  // Prefer the "(\d+)[- ]year[- ]old" pattern; fall back to "age (\d+)".
  let age: number | null = null;
  const yrOld = /(\d{1,3})[\s-]?year[s]?[\s-]?old/i.exec(profileText);
  if (yrOld) {
    age = parseInt(yrOld[1], 10);
  } else {
    const ageOf = /age[d]?\s+(\d{1,3})/i.exec(profileText);
    if (ageOf) age = parseInt(ageOf[1], 10);
  }
  if (age !== null && (age < 0 || age > 120)) age = null;

  // Sex: tokenise the profile and look for the first hit. We check female
  // tokens first because pregnancy-specific words are strongly gendered
  // and would otherwise be missed by "man" appearing earlier as a substring.
  const tokens = text.split(/[^a-z']+/).filter(Boolean);
  let sex: PatientSex = "unknown";
  for (const t of tokens) {
    if (FEMALE_TOKENS.has(t)) { sex = "female"; break; }
    if (MALE_TOKENS.has(t))   { sex = "male"; break; }
  }
  return { age, sex };
}

/**
 * Build a deterministic patient persona from the scenario's textual brief.
 *
 * @param idOrSeed  Scenario id, mcatNumber, or any stable string. Used as
 *                  the entropy source for both name selection and avatar.
 * @param profile   Free-text patient brief (scenario.patientProfile is
 *                  the standard source; chiefComplaint works as fallback).
 * @param displayName  Optional override — if the scenario data already
 *                  carries a name, prefer it over the generated one.
 */
export function buildPatientPersona(
  idOrSeed: string | number,
  profile: string,
  displayName?: string | null
): PatientPersona {
  const seedBase = `${idOrSeed}::${profile.slice(0, 60)}`;
  const hash = hashString(seedBase);

  const { age, sex } = parseAgeSex(profile);

  // Pick a sex bucket for the name — fall back to female so "unknown" still
  // looks like a real person rather than a placeholder.
  const firstList = sex === "male" ? MALE_FIRST : FEMALE_FIRST;
  let firstName = pick(firstList, hash, 1);
  let lastName = pick(LAST_NAMES, hash, 2);

  // Honour an explicit name if the scenario already had one (future-proof
  // for when we extend scenarios.ts with manual overrides).
  if (displayName && displayName.trim()) {
    const parts = displayName.trim().split(/\s+/);
    if (parts.length >= 2) {
      firstName = parts[0];
      lastName = parts.slice(1).join(" ");
    } else if (parts.length === 1) {
      firstName = parts[0];
    }
  }

  const demographic =
    age !== null
      ? `${age}-year-old ${sex === "male" ? "man" : sex === "female" ? "woman" : "patient"}`
      : null;

  return {
    name: `${firstName} ${lastName}`,
    firstName,
    lastName,
    age,
    sex,
    avatarSeed: seedBase,
    demographic,
  };
}
