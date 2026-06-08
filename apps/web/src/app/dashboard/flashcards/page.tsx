import Link from "next/link";
import StatsHeader from "./StatsHeader";
import MyLibrarySection from "./MyLibrarySection";
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
} from "@mostly-medicine/content";

const decks = [
  // Core clinical specialties
  { slug: "cardiology",         name: "Cardiology",          description: "AF · HF · ACS · HTN · valvular · AMC mark-sheet aligned",                                   count: cardiologyFlashcards.length,         citation: "Murtagh · NHFA · RACGP · AMC handbook" },
  { slug: "respiratory",        name: "Respiratory",         description: "Asthma · COPD · CAP · PE · pneumothorax · TB screening for IMGs",                          count: respiratoryFlashcards.length,        citation: "Murtagh · NACA · eTG · COPD-X · Lung Foundation AU" },
  { slug: "gastroenterology",   name: "Gastroenterology",    description: "GORD · H. pylori · IBD · coeliac · HBV/HCV · GI bleed · NBCSP",                            count: gastroFlashcards.length,             citation: "Murtagh · eTG · GESA · ASHM · NHMRC · AMC handbook" },
  { slug: "neurology",          name: "Neurology",           description: "Stroke · TIA · seizure · migraine · SAH · Bell's palsy · dementia · MS",                   count: neurologyFlashcards.length,          citation: "Murtagh · eTG · Stroke Foundation AU · Austroads" },
  { slug: "endocrine",          name: "Endocrinology",       description: "T2DM · DKA · thyroid · adrenal · hyponatraemia · hyperkalaemia · osteoporosis · PCOS",      count: endocrineFlashcards.length,          citation: "Diabetes Australia · eTG · ADIPS · Monash PCOS" },
  { slug: "obgyn",              name: "Obstetrics & Gynae",  description: "Antenatal · pre-eclampsia · GDM · PPH · contraception · NCSP · menopause · PCOS",          count: obgynFlashcards.length,              citation: "RANZCOG · SOMANZ · NCSP · Family Planning AU" },
  { slug: "paediatrics",        name: "Paediatrics",         description: "AU NIP · bronchiolitis · croup · Kawasaki · febrile infant · ADHD · autism",                 count: paediatricsFlashcards.length,        citation: "Australian Immunisation Handbook · ATAGI · RCH" },
  { slug: "psychiatry",         name: "Psychiatry",          description: "MDD · suicide · bipolar · schizophrenia · ED · PTSD · MHA · SEWB",                          count: psychiatryFlashcards.length,         citation: "RANZCP · MHA NSW/Vic · Phoenix Australia · Orygen" },
  { slug: "emergency",          name: "Emergency Medicine",  description: "ATLS · anaphylaxis · sepsis · stroke · STEMI · status epilepticus · toxicology",            count: emergencyFlashcards.length,          citation: "ANZCOR · ATLS 10th · ASCIA · Stroke Foundation" },
  // Tier 4 AU moat — no global competitor builds these
  { slug: "aboriginal-health",  name: "Aboriginal & TSI Health", description: "🇦🇺 Closing the Gap · RHD · trachoma · 715 health check · SEWB · ATSI ESKD",            count: aboriginalHealthFlashcards.length,   citation: "NACCHO · CARPA STM 8th · RHDAustralia · 13YARN" },
  { slug: "rural",              name: "Rural & Remote",      description: "🇦🇺 ACRRM · RFDS · MM categories · snake/spider · melioidosis · tropical infections",       count: ruralFlashcards.length,              citation: "ACRRM · RFDS · CARPA · NT/QLD Health" },
  { slug: "cultural-safety",    name: "Cultural Safety",     description: "🇦🇺 AHPRA 2020 Code · LGBTQI+ · refugee · TIS · FGC · MHA cultural advocate",                count: culturalSafetyFlashcards.length,     citation: "AHPRA Code · AusPATH · TIS National · OAIC" },
  { slug: "ethics",             name: "Ethics & Medico-Legal", description: "🇦🇺 AHPRA · capacity · consent · VAD · Austroads · coroner · mandatory reporting",      count: ethicsLawFlashcards.length,          citation: "Medical Board AU · Austroads · Coroners Acts · VAD" },
  { slug: "pharmacology",       name: "AU Pharmacology",     description: "🇦🇺 PBS · Authority · S8 · RTPM · Closing-the-Gap · DOAC · MTX · sick-day rules",          count: pharmacologyFlashcards.length,       citation: "PBS · TGA Poisons Standard · eTG · ASHM" },
  // Sub-specialty & wrap-up
  { slug: "infectious-diseases", name: "Infectious Diseases", description: "Sepsis · CAP · UTI · TB · HIV · HBV/HCV · syphilis · STIs · COVID · tropical",            count: infectiousDiseasesFlashcards.length, citation: "eTG Antibiotic · ASHM · ATAGI · ASID-RHN" },
  { slug: "haematology",        name: "Haem & Oncology",     description: "IDA · B12 · myeloma · lymphoma · DVT/PE · BreastScreen · NBCSP · febrile neutropenia",      count: haematologyOncologyFlashcards.length, citation: "Cancer Council AU · BreastScreen · NBCSP · eviQ" },
  { slug: "nephrology",         name: "Nephrology",          description: "CKD · AKI · nephrotic/nephritic · stones · hyperK · transplant · ATSI ESKD",               count: nephrologyFlashcards.length,         citation: "KDIGO · CKD-Australia · KHA · NACCHO" },
  { slug: "dermatology",        name: "Dermatology",         description: "Skin cancer · SunSmart · eczema · psoriasis · acne · scabies · SJS/TEN",                    count: dermatologyFlashcards.length,        citation: "ACD · TG Derm · SunSmart · Cancer Council AU" },
  { slug: "rheumatology",       name: "Rheumatology",        description: "RA · gout · septic arthritis · AS · SLE · PMR · GCA · osteoporosis",                       count: rheumatologyFlashcards.length,       citation: "ARA · TG Rheum · ANZ Bone & Mineral Society" },
  { slug: "geriatrics",         name: "Geriatrics",          description: "Frailty · falls · delirium · dementia · polypharmacy · ACAT · ACP",                          count: geriatricsFlashcards.length,         citation: "ANZSGM · My Aged Care · End-of-Life Essentials" },
  { slug: "palliative",         name: "Palliative Care",     description: "WHO ladder · opioid conversion · syringe driver · VAD · SPIKES · bereavement",              count: palliativeFlashcards.length,         citation: "Palliative Care Australia · CareSearch · VAD Acts" },
];

export default function FlashcardsHubPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Flashcards</h1>
        <p className="mt-2 text-sm text-gray-600">
          AMC-blueprint cloze cards. AU-guideline cited. Reviewing packaged decks is free for
          everyone; AI generation and Anki import have daily caps on Free —{" "}
          <Link href="/dashboard/billing" className="font-semibold text-emerald-700 hover:underline">
            Pro is unlimited
          </Link>
          .
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 ring-1 ring-emerald-200">
            ✨ Generate: 3 / day Free · ∞ Pro
          </span>
          <span className="rounded-full bg-sky-50 px-2.5 py-1 text-sky-700 ring-1 ring-sky-200">
            📦 Anki import: 1 / day Free · ∞ Pro
          </span>
          <span className="rounded-full bg-rose-50 px-2.5 py-1 text-rose-700 ring-1 ring-rose-200">
            🃏 Review: 5 / day Free · ∞ Pro
          </span>
        </div>
      </header>

      <StatsHeader />

      {/* AI generation + Anki import — surfaced first so users see the
          "make your own" path before scrolling to packaged decks. */}
      <section className="mb-6 grid gap-3 sm:grid-cols-2">
        <Link
          href="/dashboard/flashcards/generate"
          className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 transition hover:border-emerald-400 hover:bg-emerald-100"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <h3 className="text-base font-bold text-gray-900">Generate from notes</h3>
          </div>
          <p className="mt-1.5 text-xs text-gray-600">
            Paste a lecture, RACGP guideline, or your revision notes → AU-cited cloze cards in
            seconds. Powered by Claude Sonnet 4.6.
          </p>
        </Link>
        <Link
          href="/dashboard/flashcards/import"
          className="rounded-2xl border border-sky-200 bg-sky-50 p-4 transition hover:border-sky-400 hover:bg-sky-100"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">📦</span>
            <h3 className="text-base font-bold text-gray-900">Import existing deck (.apkg)</h3>
          </div>
          <p className="mt-1.5 text-xs text-gray-600">
            Drag-drop your existing AnKing / Lyonsy / personal Anki deck. Notes + media land in
            your library with FSRS-5 scheduling.
          </p>
        </Link>
      </section>

      <MyLibrarySection />

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
        Packaged decks
      </h2>
      <section className="space-y-4">
        {decks.map((d) => (
          <Link
            key={d.slug}
            href={`/dashboard/flashcards/${d.slug}`}
            className="block rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-brand-500/40 hover:bg-gray-50"
          >
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl font-bold text-gray-900">{d.name}</h2>
              <span className="text-xs uppercase tracking-wider text-gray-500">
                {d.count} cards
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-600">{d.description}</p>
            <p className="mt-3 text-xs text-gray-500">Sourced: {d.citation}</p>
          </Link>
        ))}
      </section>

      <p className="mt-10 text-xs text-gray-500">
        More decks (respiratory, GI, neuro, endo, OBGYN, paeds, pharm, ethics) coming as we
        validate the format with you. Comment on the launch reel if you want a specialty
        bumped up.
      </p>
    </div>
  );
}
