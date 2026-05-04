import type { Metadata } from "next";
import Link from "next/link";
import AskAiTaste from "./AskAiTaste";

const SITE_URL = "https://mostlymedicine.com";
const PAGE_URL = `${SITE_URL}/ask-ai`;
const TITLE = "Ask AI — Free AMC Exam & Clinical Q&A | Mostly Medicine";
const DESCRIPTION =
  "Ask any AMC exam or clinical question and get an answer grounded in Murtagh, RACGP, the AMC Handbook and eTG. Three free questions, no signup required.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    type: "website",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: TITLE,
  description: DESCRIPTION,
  url: PAGE_URL,
  inLanguage: "en-AU",
  isPartOf: { "@type": "WebSite", name: "Mostly Medicine", url: SITE_URL },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ask AI", item: PAGE_URL },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do I need to sign up to use Ask AI?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The first three questions are free without signup. After that, sign up free (no credit card needed) to keep asking and unlock 20 MCQs/day, 1 Solo Clinical RolePlay/day, and 1 AMC Handbook RolePlay/day.",
      },
    },
    {
      "@type": "Question",
      name: "What sources does Ask AI use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ask AI is grounded in John Murtagh's General Practice, RACGP Red Book, AMC Handbook, Therapeutic Guidelines (eTG), and the Australian Medicines Handbook. It is built for International Medical Graduates preparing for the Australian Medical Council exams.",
      },
    },
    {
      "@type": "Question",
      name: "Is Ask AI a substitute for clinical advice?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Ask AI is an exam-prep and study tool. It is not a substitute for medical advice or a treating clinician. Always confirm clinical decisions with current guidelines and supervisors.",
      },
    },
    {
      "@type": "Question",
      name: "Which AI model powers Ask AI?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ask AI uses Anthropic's Claude Haiku 4.5 with prompt caching for fast, low-cost answers. Inside the dashboard, the chat is grounded in your library context for even sharper responses.",
      },
    },
  ],
};

export default function AskAiPage() {
  return (
    <main className="min-h-screen bg-[#070714] overflow-x-hidden relative text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="pointer-events-none select-none" aria-hidden>
        <div className="absolute top-[-6%] left-[15%] w-[600px] h-[600px] bg-emerald-700/15 rounded-full blur-[130px]" />
        <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-teal-700/10 rounded-full blur-[110px]" />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-6 sm:px-10 py-5 max-w-7xl mx-auto">
        <Link href="/" className="font-display font-bold text-[1.15rem] tracking-tight">
          <span className="gradient-text">Mostly</span>
          <span className="text-white"> Medicine</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/auth/login" className="hidden sm:inline text-slate-400 hover:text-white px-4 py-2 text-sm transition-colors font-medium">
            Log in
          </Link>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
          >
            Sign up free →
          </Link>
        </div>
      </nav>

      <section className="relative z-10 max-w-3xl mx-auto px-6 sm:px-10 pt-10 pb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-700/40 bg-emerald-900/30 px-3 py-1 mb-5">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">
            Free · No signup · No credit card
          </span>
        </div>
        <h1
          className="font-display font-bold text-white mb-4"
          style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
        >
          Ask AI — your{" "}
          <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
            AMC study mentor
          </span>{" "}
          on call
        </h1>
        <p className="text-base text-slate-400 leading-relaxed mb-2">
          Three free questions before signup. Answers are grounded in Murtagh, RACGP, the AMC Handbook and eTG — not a generic chatbot guessing.
        </p>
      </section>

      <section className="relative z-10 max-w-3xl mx-auto px-6 sm:px-10 pb-10">
        <AskAiTaste />
      </section>

      <section className="relative z-10 max-w-3xl mx-auto px-6 sm:px-10 pb-16">
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <p className="text-xl mb-2">📚</p>
            <p className="text-sm font-bold text-white mb-1">Source-grounded</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Murtagh · RACGP · AMC Handbook · eTG · AMH. No hallucinated guidelines.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <p className="text-xl mb-2">⚡</p>
            <p className="text-sm font-bold text-white mb-1">Claude Haiku 4.5</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sub-second replies with prompt caching. Built for IMG prep, not generic chat.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <p className="text-xl mb-2">🇦🇺</p>
            <p className="text-sm font-bold text-white mb-1">Australian context</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              PBS, eTG, RACGP. Tuned for AMC Part 1, Part 2 and AHPRA pathway questions.
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 max-w-3xl mx-auto px-6 sm:px-10 pb-20">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-7 sm:p-9 text-center">
          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">
            Inside the dashboard
          </p>
          <h2 className="font-display font-bold text-2xl text-white mb-3">
            Sign up to keep asking — and unlock the rest
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed mb-5 max-w-xl mx-auto">
            Free plan: unlimited Ask AI inside the library, 20 MCQs/day, 1 Solo Clinical AI RolePlay/day, 1 AMC Handbook AI RolePlay/day. No credit card. Pro is A$19/mo only when you want unlimited.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm px-5 py-2.5 transition"
            >
              Sign up free →
            </Link>
            <Link
              href="/amc-fee-calculator"
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-slate-200 font-semibold text-sm px-5 py-2.5 transition"
            >
              See the AMC fee calculator
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
