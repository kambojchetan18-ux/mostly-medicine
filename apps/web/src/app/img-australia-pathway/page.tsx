import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

const SITE_URL = "https://mostlymedicine.com";
const PAGE_URL = `${SITE_URL}/img-australia-pathway`;
const TITLE = "IMG Australia Pathway 2026 — EPIC, AMC, AHPRA, Internship to Fellowship";
const DESCRIPTION =
  "The complete step-by-step pathway for International Medical Graduates to practise in Australia. EPIC verification, English testing (IELTS/OET), AMC MCQ and AMC Handbook AI RolePlay, AHPRA registration, internship, RMO, registrar, and fellowship — with realistic timelines.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    type: "article",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITLE,
  description: DESCRIPTION,
  url: PAGE_URL,
  mainEntityOfPage: PAGE_URL,
  author: { "@type": "Organization", name: "Mostly Medicine", url: SITE_URL },
  publisher: { "@id": `${SITE_URL}/#organization` },
  datePublished: "2026-04-27",
  dateModified: "2026-04-27",
  inLanguage: "en-AU",
  about: [
    { "@type": "Thing", name: "International Medical Graduate" },
    { "@type": "Thing", name: "AHPRA registration" },
    { "@type": "Thing", name: "Australian Medical Council" },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "IMG Australia Pathway", item: PAGE_URL },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How long does the full IMG pathway to Australia take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "From starting EPIC verification to general AHPRA registration typically takes 18–30 months for diligent candidates. Add 1–4 more years for internship + RMO before you become eligible to start specialist training. Total time from first AMC step to consultant/fellowship completion ranges from 5 to 10 years depending on specialty.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to do internship in Australia even if I have years of experience overseas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most IMGs going through the Standard Pathway are required to complete a 12-month supervised practice equivalent to internship for general registration. Doctors with substantial experience can sometimes have this period reduced or recognised, but the default expectation is a full intern year (PGY1) at an accredited Australian hospital.",
      },
    },
    {
      "@type": "Question",
      name: "What is EPIC and why do I need it?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "EPIC (Electronic Portfolio of International Credentials) is a service run by ECFMG that verifies your primary medical qualification directly with the issuing university. AMC requires verified credentials before you can apply for AMC MCQ, so starting EPIC early (often the first 3 months of your timeline) is essential — verifications can take weeks or months depending on the university's responsiveness.",
      },
    },
    {
      "@type": "Question",
      name: "Which English test should I take — IELTS or OET?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Both are accepted. IELTS Academic requires overall 7.0 with no band below 7.0. OET requires Grade B in all four components (Reading, Writing, Listening, Speaking). OET is often easier for clinicians because it uses healthcare-specific scenarios. Pick the one closest to your strengths and pattern of previous test scores.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between Standard Pathway, Competent Authority Pathway, and Specialist Pathway?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Standard Pathway is the AMC MCQ + AMC Handbook AI RolePlay route used by the majority of IMGs. Competent Authority Pathway is for fully registered practitioners from a small list of countries (UK, Ireland, USA, Canada, NZ) who can bypass AMC exams. Specialist Pathway is for IMGs with overseas specialist qualifications who apply for assessment by an Australian medical college (e.g., RACP, RACS, RACGP) for direct specialist registration.",
      },
    },
    {
      "@type": "Question",
      name: "How do I get an internship after passing AMC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Each Australian state runs its own intern allocation process. NSW has its own portal, Victoria runs the Postgraduate Medical Council intern campaign, Queensland has the QHealth recruitment, etc. IMGs typically apply via Category 2 or 3 (after domestic graduates), so positions are competitive and often regional. Mostly Medicine's job tracker maps current intern recruitment timelines by state.",
      },
    },
    {
      "@type": "Question",
      name: "Can my family come with me?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Spouses and dependent children can join you on the same visa stream (e.g., subclass 482 dependents, then 186 PR) once you have employer sponsorship. Australian public schools and Medicare-equivalent care for visa-holders' children are widely available, which is one reason the AMC pathway is popular among IMGs with families.",
      },
    },
  ],
};

export default function ImgAustraliaPathwayPage() {
  return (
    <main className="min-h-screen bg-[#070714] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <nav className="max-w-4xl mx-auto px-6 sm:px-10 py-6 flex items-center justify-between">
        <Link href="/" className="font-display font-bold text-lg">
          <span className="gradient-text">Mostly</span> Medicine
        </Link>
        <Link
          href="/auth/signup"
          className="bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold"
        >
          Start free
        </Link>
      </nav>

      <article className="max-w-3xl mx-auto px-6 sm:px-10 pb-24 prose prose-invert prose-headings:font-display prose-h1:text-4xl sm:prose-h1:text-5xl prose-h2:text-2xl sm:prose-h2:text-3xl prose-a:text-brand-400 hover:prose-a:text-brand-300">
        <header className="mt-8 mb-12">
          <p className="text-xs uppercase tracking-widest text-brand-400 font-bold mb-3">
            IMG Pathway · Updated 2026
          </p>
          <h1 className="font-display font-bold mb-4">
            The Complete IMG Pathway to Practising Medicine in Australia
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            From your first EPIC verification step to fellowship as a
            consultant — every gate, every timeline, every common detour.
            Built for International Medical Graduates planning their move to
            Australia in 2026 and beyond.
          </p>
        </header>

        <section>
          <h2>Three pathways to Australian medical registration</h2>
          <p>
            Before mapping the journey, identify which pathway applies to you.
            The Medical Board of Australia (administered by AHPRA) recognises
            three:
          </p>
          <ul>
            <li>
              <strong>Standard Pathway</strong> — AMC MCQ + AMC Handbook AI RolePlay. Used by
              the majority of IMGs without specialist qualifications. This
              page focuses on this pathway.
            </li>
            <li>
              <strong>Competent Authority Pathway</strong> — for doctors
              fully registered in the UK, Ireland, USA, Canada, or New Zealand.
              Bypasses AMC exams but still requires AHPRA process and a period
              of supervised practice.
            </li>
            <li>
              <strong>Specialist Pathway</strong> — for IMGs with overseas
              specialist qualifications (consultant-equivalent). Application
              is to the relevant Australian college (RACP, RACS, RACGP, ACEM,
              etc.) for assessment as &quot;substantially comparable&quot; or
              &quot;partially comparable&quot;.
            </li>
          </ul>
        </section>

        <section>
          <h2>Standard Pathway — the 9 steps</h2>
          <p>
            Follow these in order. Some can run in parallel (English testing
            and EPIC verification, for example). Use the timelines as
            realistic, not aspirational.
          </p>

          <h3>Step 1 — Confirm eligibility (week 0)</h3>
          <p>
            Your primary medical qualification must be from a school listed
            in the World Directory of Medical Schools and your training must
            be at least 4 years (typically MBBS or equivalent). Check the AMC
            and AHPRA websites for current eligibility lists.
          </p>

          <h3>Step 2 — Start EPIC verification (months 0–3)</h3>
          <p>
            Open an EPIC account at ECFMG and request verification of your
            primary medical qualification. The university you graduated from
            will be contacted directly. This step is the slowest variable —
            some universities respond in 2 weeks, others take 3+ months. Start
            it before anything else.
          </p>

          <h3>Step 3 — English language proficiency (months 1–4)</h3>
          <p>
            Sit IELTS Academic (overall 7.0, no band below 7.0) or OET (Grade
            B in all four components). Native-English IMGs from countries
            recognised by AHPRA may be exempt; verify your country&apos;s
            status before paying for tests. Plan for one re-sit in your
            timeline budget — many strong clinicians underestimate Writing.
          </p>

          <h3>Step 4 — AMC portfolio &amp; AMC MCQ booking (months 2–5)</h3>
          <p>
            Open an AMC portfolio account, link your EPIC verification,
            upload identity documents and English test results. Once
            credentials clear, you can book{" "}
            <Link href="/amc-cat1">AMC MCQ</Link>. AMC MCQ is held in
            test windows (typically 4 per year) at Pearson VUE centres
            globally.
          </p>

          <h3>Step 5 — Pass AMC MCQ (months 4–10)</h3>
          <p>
            Allow 4–8 months of focused preparation between booking and
            sitting. Most IMGs sit AMC MCQ between months 8 and 12 of their
            total timeline. Pass mark is set by modified Angoff
            standard-setting; results release 4–6 weeks after the test
            window closes. See the{" "}
            <Link href="/amc-cat1">AMC MCQ deep-dive guide</Link> for the full
            study schedule.
          </p>

          <h3>Step 6 — Pass AMC Handbook AI RolePlay / MCAT (months 10–18)</h3>
          <p>
            Once AMC MCQ is passed, book{" "}
            <Link href="/amc-cat2">AMC Handbook AI RolePlay (MCAT)</Link>. AMC Handbook AI RolePlay is in-person at
            the AMC&apos;s Melbourne National Test Centre or approved sites
            (Sydney, Brisbane, Perth, Adelaide). Capacity is limited — book
            the next available slot the moment your AMC MCQ result is
            released. Allow 3–6 months of clinical roleplay practice.
          </p>

          <h3>Step 7 — AHPRA general registration application (months 18–22)</h3>
          <p>
            With both AMC parts passed, apply to AHPRA for general
            registration with conditions (you must be supervised in your
            first year of Australian practice). Documentation includes:
            certified ID, AMC certificate, EPIC verification, CV, English
            results, criminal record check from every country lived in for
            6+ months in the past 10 years, and proof of professional
            indemnity insurance.
          </p>

          <h3>Step 8 — Secure internship / first job (months 18–24)</h3>
          <p>
            Each state runs its own intern allocation. IMGs are typically in
            Category 2 or 3 (after domestic graduates), so regional and
            outer-metro hospitals are the most realistic first roles. Common
            first roles for IMGs:
          </p>
          <ul>
            <li>
              <strong>Junior House Officer / Intern (PGY1)</strong> in a
              regional or outer-metro hospital.
            </li>
            <li>
              <strong>Resident Medical Officer (RMO / PGY2+)</strong> if you
              already hold equivalent intern experience.
            </li>
            <li>
              <strong>Hospital Medical Officer (HMO)</strong> in Victoria,
              equivalent grade.
            </li>
          </ul>
          <p>
            Visa: most IMGs enter on a subclass 482 (Temporary Skill
            Shortage) employer-sponsored visa, transitioning to subclass 186
            (Employer Nomination Scheme — permanent residency) after 2–3
            years.
          </p>

          <h3>Step 9 — Specialist training / fellowship (years 2–8+)</h3>
          <p>
            Once you have completed an Australian intern year and 1–2 RMO
            years, you can apply to a specialist college training program.
            Major colleges include:
          </p>
          <ul>
            <li>
              <strong>RACGP / ACRRM</strong> — General Practice (3–4 years).
            </li>
            <li>
              <strong>RACP</strong> — Internal Medicine, Paediatrics (basic
              + advanced training, 6+ years).
            </li>
            <li>
              <strong>RACS</strong> — Surgery (5+ years SET program).
            </li>
            <li>
              <strong>ACEM</strong> — Emergency Medicine (5+ years).
            </li>
            <li>
              <strong>RANZCP</strong> — Psychiatry (5 years).
            </li>
            <li>
              <strong>RANZCOG</strong> — Obstetrics &amp; Gynaecology
              (6 years).
            </li>
            <li>
              <strong>ANZCA</strong> — Anaesthesia (5 years).
            </li>
            <li>
              <strong>RANZCR</strong> — Radiology / Radiation Oncology (5
              years).
            </li>
          </ul>
        </section>

        <section>
          <h2>Realistic timelines (year-by-year)</h2>
          <ul>
            <li>
              <strong>Year 1:</strong> EPIC verification, English test, AMC MCQ
              study and pass.
            </li>
            <li>
              <strong>Year 2:</strong> AMC Handbook AI RolePlay prep and pass, AHPRA application,
              first job offer.
            </li>
            <li>
              <strong>Year 2–3:</strong> Australian intern year (PGY1) under
              supervision.
            </li>
            <li>
              <strong>Year 3–5:</strong> RMO years, exam prep for college
              entry (e.g., RACP basic training entry, RACS GSSE, RACGP entry
              assessment).
            </li>
            <li>
              <strong>Year 4–10:</strong> Specialist training; final
              fellowship exam; consultant role.
            </li>
          </ul>
          <p>
            Most IMGs complete the licensing portion (steps 1–7) in 18–30
            months. Specialty training adds 3–8 years, depending on the
            college.
          </p>
        </section>

        <section>
          <h2>Visa &amp; permanent residency</h2>
          <p>
            The two visa subclasses most IMGs use:
          </p>
          <ul>
            <li>
              <strong>Subclass 482 (Temporary Skill Shortage):</strong>{" "}
              employer-sponsored, valid up to 4 years. Family included as
              dependents. Allows full-time medical work.
            </li>
            <li>
              <strong>Subclass 186 (Employer Nomination Scheme):</strong>{" "}
              permanent residency. Eligible after 2–3 years on 482 with the
              same employer (or via direct entry stream for some specialties).
            </li>
          </ul>
          <p>
            Regional rural roles often have additional incentives: relocation
            allowances, accelerated PR, and DPA (Distribution Priority Area)
            classification benefits.
          </p>
        </section>

        <section>
          <h2>Common detours and how to avoid them</h2>
          <ol>
            <li>
              <strong>EPIC stuck for months</strong> — start it on day one and
              follow up your university registrar weekly.
            </li>
            <li>
              <strong>Failing the English Writing band</strong> — practise
              healthcare-style writing weekly even before you book.
            </li>
            <li>
              <strong>Failing AMC MCQ by 1–2 marks</strong> — almost always
              means insufficient practice volume; minimum 3,000 MCQs is
              non-negotiable.
            </li>
            <li>
              <strong>Failing AMC Handbook AI RolePlay on communication</strong> — get
              examiner-grade feedback after every roleplay; do not just rack
              up volume.
            </li>
            <li>
              <strong>No internship offer in metro</strong> — apply to
              regional and rural hospitals; they are excellent training and
              accelerate your PR.
            </li>
            <li>
              <strong>Missing visa lodgement deadlines</strong> — engage a
              registered migration agent the moment you have a job offer.
            </li>
          </ol>
        </section>

        <section>
          <h2>How Mostly Medicine helps at every step</h2>
          <ul>
            <li>
              <Link href="/dashboard/cat1">
                <strong>AMC MCQ question bank</strong>
              </Link>{" "}
              with 4,400+ MCQs and analytics targeting weak areas.
            </li>
            <li>
              <Link href="/dashboard/cat2">
                <strong>AMC Handbook AI RolePlay scenarios</strong>
              </Link>{" "}
              with examiner-grade feedback against AMC marking domains.
            </li>
            <li>
              <Link href="/dashboard/jobs">
                <strong>Australian medical job tracker</strong>
              </Link>{" "}
              — RMO pools, GP pathway, intern recruitment by state.
            </li>
            <li>
              <Link href="/dashboard/profile">
                <strong>IMG CV builder</strong>
              </Link>{" "}
              tailored to Australian recruitment formats.
            </li>
            <li>
              <Link href="/dashboard/reference">
                <strong>Reference library</strong>
              </Link>{" "}
              with searchable Murtagh, RACGP Red Book, and AMC Handbook
              summaries.
            </li>
          </ul>
          <p>
            <Link
              href="/auth/signup"
              className="inline-block mt-4 bg-brand-600 hover:bg-brand-500 text-white px-7 py-3.5 rounded-2xl font-bold no-underline"
            >
              Start your AMC journey free →
            </Link>
          </p>
        </section>

        <section>
          <h2>Frequently asked questions</h2>

          <h3>How long does the full pathway take?</h3>
          <p>
            18–30 months from EPIC start to AHPRA registration. Add an intern
            year and 1–2 RMO years before specialty training. Total to
            consultant: 5–10 years.
          </p>

          <h3>Do I need internship even with overseas experience?</h3>
          <p>
            Most IMGs require a 12-month supervised practice period
            equivalent to internship, though credit may be granted for
            substantial prior experience.
          </p>

          <h3>What is EPIC?</h3>
          <p>
            Electronic Portfolio of International Credentials, run by ECFMG.
            Verifies your primary medical qualification with the issuing
            university. Required before AMC.
          </p>

          <h3>IELTS or OET?</h3>
          <p>
            Both accepted. OET is healthcare-specific and often easier for
            clinicians; IELTS is more widely available globally.
          </p>

          <h3>What is the difference between the three pathways?</h3>
          <p>
            Standard = AMC route (most IMGs). Competent Authority = direct
            from UK/Ireland/US/Canada/NZ. Specialist = direct college
            assessment for overseas-trained specialists.
          </p>

          <h3>How do I get an internship in Australia?</h3>
          <p>
            Apply via state-specific intern campaigns. IMGs are typically
            allocated after domestic graduates, so regional placements are
            the most realistic entry point.
          </p>

          <h3>Can my family come with me?</h3>
          <p>
            Yes — spouses and dependent children join on the same visa
            stream. Public schools and Medicare-equivalent care available.
          </p>
        </section>

        <footer className="mt-16 pt-8 border-t border-slate-800 text-sm text-slate-500">
          <p>
            This guide is provided for educational purposes by Mostly Medicine.
            For official information, refer to{" "}
            <a href="https://www.amc.org.au" target="_blank" rel="noopener">
              amc.org.au
            </a>
            ,{" "}
            <a href="https://www.ahpra.gov.au" target="_blank" rel="noopener">
              ahpra.gov.au
            </a>
            , and{" "}
            <a href="https://www.ecfmg.org/epic" target="_blank" rel="noopener">
              ecfmg.org/epic
            </a>
            . Last updated: April 2026.
          </p>
        </footer>
      </article>
    <SiteFooter />
    </main>
  );
}
