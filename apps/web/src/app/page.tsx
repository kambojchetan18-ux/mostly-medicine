import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the AMC exam?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Australian Medical Council (AMC) exam is the assessment pathway for International Medical Graduates (IMGs) seeking medical registration in Australia. It has two parts: AMC MCQ (a 150-question MCQ exam) and AMC Handbook AI RolePlay (a multi-station clinical assessment, also called the MCAT).",
      },
    },
    {
      "@type": "Question",
      name: "How do I prepare for AMC MCQ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AMC MCQ covers all clinical disciplines. Effective preparation includes high-volume MCQ practice (3,000+ questions), spaced repetition for retention, and reviewing core texts like Murtagh's General Practice and the RACGP Red Book. Mostly Medicine offers an AI-powered MCQ bank with explanations and weak-area targeting.",
      },
    },
    {
      "@type": "Question",
      name: "What is the AMC Handbook AI RolePlay (MCAT) clinical exam?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AMC Handbook AI RolePlay is a multi-station OSCE-style clinical exam (around 16 stations) that tests applied clinical skills: history-taking, examination, counselling, procedural skills, and clinical reasoning. Mostly Medicine provides 151+ AI-driven patient roleplays based on official MCAT blueprints with examiner-grade feedback.",
      },
    },
    {
      "@type": "Question",
      name: "Is Mostly Medicine free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Mostly Medicine offers a free tier with sample MCQs, limited clinical roleplays, and full reference library access. No credit card is required to start. Pro and Enterprise plans unlock the complete MCQ bank and unlimited AI roleplays.",
      },
    },
    {
      "@type": "Question",
      name: "Who is Mostly Medicine for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Mostly Medicine is built for International Medical Graduates (IMGs) preparing for AMC registration in Australia — including doctors trained in India, Pakistan, Sri Lanka, Bangladesh, the Philippines, the Middle East, and elsewhere outside Australia/New Zealand.",
      },
    },
    {
      "@type": "Question",
      name: "Is the content aligned with the AMC Handbook 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All MCQ content and clinical roleplay scenarios are aligned with the AMC Handbook of Multiple Choice Questions and the official MCAT blueprint, updated for the 2026 examination cycle.",
      },
    },
  ],
};

const stats = [
  { value: "151",   label: "MCAT scenarios"     },
  { value: "3000+", label: "Practice MCQs"      },
  { value: "AI",    label: "Examiner feedback"  },
  { value: "Free",  label: "to get started"     },
];

const features = [
  {
    href:     "/dashboard/cat1",
    emoji:    "🧠",
    tag:      "AMC PART 1",
    tagColor: "text-indigo-300 bg-indigo-900/40 border-indigo-700/40",
    title:    "AMC MCQ",
    desc:     "3 000+ MCQs with spaced repetition, AI explanations, and weak-area targeting. Train smarter, not harder.",
    gradient: "from-indigo-950/80 via-violet-950/60 to-slate-900/80",
    border:   "border-indigo-800/30",
    glow:     "hover:shadow-[0_0_60px_rgba(99,102,241,0.15)]",
    span:     "md:col-span-2",
    size:     "text-2xl",
  },
  {
    href:     "/dashboard/cat2",
    emoji:    "🩺",
    tag:      "AMC PART 2",
    tagColor: "text-pink-300 bg-pink-900/40 border-pink-700/40",
    title:    "AMC Handbook AI RolePlay",
    desc:     "AI patient roleplays. Official MCAT scenarios. Examiner-grade feedback after every consultation.",
    gradient: "from-pink-950/80 via-rose-950/60 to-slate-900/80",
    border:   "border-pink-800/30",
    glow:     "hover:shadow-[0_0_60px_rgba(236,72,153,0.15)]",
    span:     "",
    size:     "text-2xl",
  },
  {
    href:     "/dashboard/reference",
    emoji:    "📖",
    tag:      "RESOURCES",
    tagColor: "text-emerald-300 bg-emerald-900/40 border-emerald-700/40",
    title:    "Reference",
    desc:     "Murtagh · RACGP Red Book · AMC Handbook summary at your fingertips.",
    gradient: "from-emerald-950/70 to-slate-900/80",
    border:   "border-emerald-800/30",
    glow:     "hover:shadow-[0_0_50px_rgba(52,211,153,0.12)]",
    span:     "",
    size:     "text-xl",
  },
  {
    href:     "/dashboard/library",
    emoji:    "📚",
    tag:      "LIBRARY",
    tagColor: "text-amber-300 bg-amber-900/40 border-amber-700/40",
    title:    "Study Library",
    desc:     "AI-powered notes search. Upload your own material.",
    gradient: "from-amber-950/70 to-slate-900/80",
    border:   "border-amber-800/30",
    glow:     "hover:shadow-[0_0_50px_rgba(251,191,36,0.12)]",
    span:     "",
    size:     "text-xl",
  },
  {
    href:     "/dashboard/jobs",
    emoji:    "💼",
    tag:      "CAREERS",
    tagColor: "text-cyan-300 bg-cyan-900/40 border-cyan-700/40",
    title:    "Australian Jobs",
    desc:     "RMO pools · GP pathway · application tracker for IMGs.",
    gradient: "from-cyan-950/70 to-slate-900/80",
    border:   "border-cyan-800/30",
    glow:     "hover:shadow-[0_0_50px_rgba(34,211,238,0.12)]",
    span:     "",
    size:     "text-xl",
  },
];

export default async function HomePage() {
  // If a logged-in user lands on / (e.g. by tapping the "Mostly Medicine"
  // wordmark in the dashboard mobile top bar), send them to /dashboard.
  // This prevents a confusing flash of the marketing page and — more
  // importantly — sidesteps the mobile-web edge case where a fresh GET to /
  // (after a bare→www 308 hop) could leave the browser in a state where the
  // next nav into /dashboard re-runs middleware without the freshly-set
  // cookies and bounces to /auth/login. Doing the redirect here keeps the
  // user on a single logged-in origin.
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      redirect("/dashboard");
    }
  } catch (err) {
    // next/navigation's redirect() throws a special error to short-circuit
    // rendering — re-throw it. Any other error (e.g. Supabase env missing
    // in a preview build) should NOT break the public marketing page.
    if (err && typeof err === "object" && "digest" in err && typeof (err as { digest?: string }).digest === "string" && (err as { digest: string }).digest.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
  }

  return (
    <main className="min-h-screen bg-[#070714] overflow-x-hidden relative text-white">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Ambient blobs */}
      <div className="pointer-events-none select-none" aria-hidden>
        <div className="absolute top-[-8%] left-[18%]  w-[700px] h-[700px] bg-violet-700/18 rounded-full blur-[130px] animate-float" />
        <div className="absolute top-[8%]  right-[12%] w-[480px] h-[480px] bg-pink-700/12 rounded-full blur-[110px] animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-[8%] left-[32%] w-[560px] h-[560px] bg-indigo-800/12 rounded-full blur-[120px] animate-[float_11s_ease-in-out_infinite]" style={{ animationDelay: "4s" }} />
      </div>

      {/* Floating emoji decorations */}
      <div className="pointer-events-none select-none hidden lg:block" aria-hidden>
        {[
          { e: "🩺", c: "top-[14%] left-[7%]  text-4xl", d: "0s"   },
          { e: "💊", c: "top-[24%] right-[6%] text-3xl", d: "1.5s" },
          { e: "🧬", c: "top-[58%] left-[4%]  text-3xl", d: "3s"   },
          { e: "🫀", c: "top-[68%] right-[5%] text-4xl", d: "2s"   },
          { e: "🧠", c: "top-[44%] left-[1%]  text-2xl", d: "1s"   },
        ].map((f, i) => (
          <span key={i} className={`absolute opacity-[0.12] animate-float ${f.c}`} style={{ animationDelay: f.d }}>
            {f.e}
          </span>
        ))}
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 sm:px-10 py-5 max-w-7xl mx-auto">
        <div className="font-display font-bold text-[1.15rem] tracking-tight">
          <span className="gradient-text">Mostly</span>
          <span className="text-white"> Medicine</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/auth/login"
            className="hidden sm:inline text-slate-400 hover:text-white px-4 py-2 text-sm transition-colors font-medium"
          >
            Log in
          </Link>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-glow-teal hover:shadow-[0_0_40px_rgba(20,184,166,0.5)]"
          >
            Get started →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 pt-16 pb-24 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2.5 bg-brand-900/30 border border-brand-700/40 rounded-full px-5 py-2 text-xs text-brand-300 font-semibold mb-10 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse shrink-0" />
          AMC Handbook 2026 · AI-Powered Roleplays · Official MCAT Scenarios
        </div>

        {/* Headline */}
        <h1 className="text-hero font-display font-bold text-white mb-6">
          Ace the{" "}
          <span className="gradient-text">AMC.</span>
        </h1>

        <p className="text-subhero text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          AI-powered exam preparation for International Medical Graduates.
          <br className="hidden sm:block" />
          Clinical roleplays · 3 000+ MCQs · Handbook-aligned · Free to start.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
          <Link
            href="/auth/signup"
            className="group inline-flex items-center justify-center gap-2 px-9 py-4 rounded-2xl font-display font-bold text-lg text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #db2777 70%, #ea580c 100%)",
              boxShadow: "0 8px 40px rgba(124,58,237,0.35)",
            }}
          >
            Start for free
            <span className="group-hover:translate-x-1 transition-transform text-xl">🚀</span>
          </Link>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center gap-2 px-9 py-4 rounded-2xl font-semibold text-lg text-slate-300 border border-slate-700 hover:bg-white/5 hover:border-slate-500 transition-all backdrop-blur-sm"
          >
            Log in
          </Link>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 sm:gap-12">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display font-bold text-2xl gradient-text">{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5 tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bento grid */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10 pb-28">
        <div className="text-center mb-10">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.25em] mb-3">Everything you need</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
            Your complete <span className="gradient-text">AMC toolkit</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className={`
                group relative overflow-hidden rounded-3xl p-7 border backdrop-blur-sm
                bg-gradient-to-br ${f.gradient} ${f.border}
                transition-all duration-300 hover:scale-[1.02] ${f.glow} ${f.span}
              `}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
              <div className="relative z-10">
                <div className="text-5xl mb-5 group-hover:scale-110 transition-transform duration-300 inline-block">
                  {f.emoji}
                </div>
                <div className="mb-3">
                  <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full border tracking-widest uppercase ${f.tagColor}`}>
                    {f.tag}
                  </span>
                </div>
                <h3 className={`font-display font-bold text-white mb-2 ${f.size}`}>{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-slate-600 group-hover:text-slate-300 transition-colors">
                  Explore
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 pb-24 text-center">
        <div
          className="rounded-3xl p-10 sm:p-14 border border-violet-800/25 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(109,40,217,0.15) 0%, rgba(219,39,119,0.10) 60%, rgba(15,15,30,0.7) 100%)" }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />
          <div className="absolute inset-0 blur-3xl opacity-20 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, #7c3aed 0%, transparent 70%)" }} />

          <p className="text-5xl mb-5">🎓</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
            Ready to pass the AMC?
          </h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto text-base leading-relaxed">
            Join IMGs using AI-powered tools to prepare smarter. Start free — no credit card needed.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl font-display font-bold text-lg text-white hover:opacity-90 transition-all hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #db2777)",
              boxShadow: "0 8px 40px rgba(124,58,237,0.4)",
            }}
          >
            Create free account ✨
          </Link>
          <p className="text-xs text-slate-600 mt-5">No credit card · Instant access · Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900/80 py-8 text-center">
        <p className="font-display font-bold text-sm mb-1">
          <span className="gradient-text">Mostly Medicine</span>
          <span className="text-slate-700"> · AMC Exam Preparation</span>
        </p>
        <p className="text-xs text-slate-700 mt-1">
          Built for IMGs · Powered by Claude AI · Aligned with AMC Handbook 2026
        </p>
      </footer>
    </main>
  );
}
