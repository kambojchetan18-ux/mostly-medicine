import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import HeroMiniCalc from "@/components/HeroMiniCalc";
import TrustBadges from "@/components/TrustBadges";

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
    href:     "/dashboard/ai-roleplay",
    emoji:    "🎙️",
    tag:      "BEYOND HANDBOOK",
    tagColor: "text-fuchsia-300 bg-fuchsia-900/40 border-fuchsia-700/40",
    title:    "AMC Clinical AI RolePlay",
    desc:     "Voice-mode consultations with AI patients. Synthesised cases beyond the handbook. Unlimited reps.",
    gradient: "from-fuchsia-950/80 via-purple-950/60 to-slate-900/80",
    border:   "border-fuchsia-800/30",
    glow:     "hover:shadow-[0_0_60px_rgba(217,70,239,0.15)]",
    span:     "md:col-span-2",
    size:     "text-2xl",
  },
  {
    href:     "/dashboard/ai-roleplay/live",
    emoji:    "🎥",
    tag:      "LIVE · 2-PLAYER",
    tagColor: "text-rose-300 bg-rose-900/40 border-rose-700/40",
    title:    "AMC Peer RolePlay",
    desc:     "Pair up with another candidate over live video and roleplay AMC scenarios. Real candidate, real feedback.",
    gradient: "from-rose-950/80 via-pink-950/60 to-slate-900/80",
    border:   "border-rose-800/30",
    glow:     "hover:shadow-[0_0_60px_rgba(244,63,94,0.15)]",
    span:     "",
    size:     "text-2xl",
  },
  {
    href:     "/amc-fee-calculator",
    emoji:    "💰",
    tag:      "COST PLANNER",
    tagColor: "text-cyan-300 bg-cyan-900/40 border-cyan-700/40",
    title:    "AMC Fee Calculator",
    desc:     "See your real total cost in AUD/USD/INR — CAT 1, CAT 2, IELTS, EPIC, AHPRA. Live calculator. No signup.",
    gradient: "from-cyan-950/80 via-sky-950/60 to-slate-900/80",
    border:   "border-cyan-800/30",
    glow:     "hover:shadow-[0_0_60px_rgba(34,211,238,0.15)]",
    span:     "md:col-span-2",
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
  // Detect auth state so the marketing CTAs route smartly — logged-in
  // visitors get sent to /dashboard, signed-out visitors keep the
  // /auth/signup signup flow. We no longer redirect logged-in users away
  // from / entirely (Chetan's ask): the homepage stays accessible so they
  // can hit the AMC fee calculator card without leaving the marketing
  // surface, but every primary CTA on the page routes to dashboard.
  let isLoggedIn = false;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    isLoggedIn = !!user;
  } catch {
    // Auth check failure (env missing in preview build, etc.) should not
    // break the public marketing page.
  }
  // Primary CTA defaults to LOGIN for signed-out visitors — most clickers
  // are returning users (per Chetan's UX feedback: signup-first is
  // frustrating for repeat visitors). New users can click "Sign up free"
  // from the login page. Logged-in users skip auth entirely → /dashboard.
  const primaryCta = isLoggedIn ? "/dashboard" : "/auth/login";
  const secondaryCta = isLoggedIn ? "/amc-fee-calculator" : "/auth/signup";

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
          {!isLoggedIn && (
            <Link
              href="/auth/signup"
              className="hidden sm:inline text-slate-400 hover:text-white px-4 py-2 text-sm transition-colors font-medium"
            >
              Sign up free
            </Link>
          )}
          <Link
            href={primaryCta}
            className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-glow-teal hover:shadow-[0_0_40px_rgba(20,184,166,0.5)]"
          >
            {isLoggedIn ? "Open dashboard →" : "Log in →"}
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10 pt-16 pb-24">

        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-12 items-center">

          {/* Hero text column — centered on mobile, left-aligned on md+ */}
          <div className="md:col-span-3 text-center md:text-left">
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

            <p className="text-subhero text-slate-400 max-w-2xl mx-auto md:mx-0 mb-10 leading-relaxed">
              AI-powered exam preparation for International Medical Graduates.
              <br className="hidden sm:block" />
              Clinical roleplays · 3 000+ MCQs · Handbook-aligned · Free to start.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-10 md:mb-0">
              <Link
                href={primaryCta}
                className="group inline-flex items-center justify-center gap-2 px-9 py-4 rounded-2xl font-display font-bold text-lg text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, #7c3aed 0%, #db2777 70%, #ea580c 100%)",
                  boxShadow: "0 8px 40px rgba(124,58,237,0.35)",
                }}
              >
                {isLoggedIn ? "Continue your prep" : "Log in to continue"}
                <span className="group-hover:translate-x-1 transition-transform text-xl">🚀</span>
              </Link>
              <Link
                href={secondaryCta}
                className="inline-flex items-center justify-center gap-2 px-9 py-4 rounded-2xl font-semibold text-lg text-slate-300 border border-slate-700 hover:bg-white/5 hover:border-slate-500 transition-all backdrop-blur-sm"
              >
                {isLoggedIn ? "Cost calculator" : "New here? Sign up free"}
              </Link>
            </div>

            <TrustBadges />
          </div>

          {/* Mini calculator — right column on md+, below CTAs on mobile */}
          <div className="md:col-span-2 flex justify-center md:justify-end">
            <HeroMiniCalc />
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 sm:gap-12 mt-14">
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
            href={primaryCta}
            className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl font-display font-bold text-lg text-white hover:opacity-90 transition-all hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #db2777)",
              boxShadow: "0 8px 40px rgba(124,58,237,0.4)",
            }}
          >
            {isLoggedIn ? "Open my dashboard ✨" : "Log in to continue ✨"}
          </Link>
          {!isLoggedIn && (
            <Link
              href="/auth/signup"
              className="block mt-4 text-sm text-slate-400 hover:text-white transition-colors underline-offset-4 hover:underline"
            >
              First time here? Sign up free →
            </Link>
          )}
          <p className="text-xs text-slate-600 mt-5">
            {isLoggedIn ? "Welcome back — pick up where you left off." : "No credit card · Instant access · Cancel anytime"}
          </p>
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
