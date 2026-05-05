import type { Metadata } from "next";
import Link from "next/link";
import PillarPageNav from "@/components/PillarPageNav";
import SiteFooter from "@/components/SiteFooter";

const SITE_URL = "https://mostlymedicine.com";
const PAGE_URL = `${SITE_URL}/blog`;
const TITLE = "Blog — Honest AMC + AHPRA Guides for IMGs | Mostly Medicine";
const DESCRIPTION =
  "Long-form, founder-written guides for International Medical Graduates: AMC pass rates, AHPRA registration, IELTS vs OET, recency of practice, study plans. Updated monthly.";

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

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  category: "AMC" | "AHPRA" | "English" | "OSCE";
}

// Sorted newest first. When a new pillar article is published, add a row here.
const posts: BlogPost[] = [
  {
    slug: "ahpra-recency-of-practice",
    title: "Recency of Practice and AMC: What Order Should an IMG Do Things In? (2026)",
    description:
      "AMC Part 1 first, then English, AMC Part 2, AHPRA, and finally recency in Australia — but real exceptions exist. The IMG order-of-operations no one explains.",
    publishedAt: "2026-05-04",
    category: "AHPRA",
  },
  {
    slug: "ielts-vs-oet",
    title: "IELTS vs OET for AHPRA in 2026: Which English Test Should an IMG Doctor Take?",
    description:
      "OET Medicine is easier for working clinicians, IELTS Academic is cheaper and more flexible — both are AHPRA-accepted. Pick by daily English habits, not price.",
    publishedAt: "2026-05-03",
    category: "English",
  },
  {
    slug: "ahpra-registration-for-imgs",
    title: "AHPRA Registration for International Medical Graduates: 2026 Step-by-Step Guide",
    description:
      "The complete step-by-step guide to AHPRA registration for IMGs in 2026 — pathways, EPIC verification, English language requirements, fees, timelines, and the mistakes that cost applicants months.",
    publishedAt: "2026-05-03",
    category: "AHPRA",
  },
  {
    slug: "amc-part-1-study-plan",
    title: "AMC Part 1 Study Plan: A Realistic 16-Week Schedule for Working IMGs (2026)",
    description:
      "A 16-week AMC Part 1 prep plan built for working IMGs — 2 hours on weekdays, 6 on weekends, 3000+ MCQs, 3 timed mocks. Based on what actually works across 136 Mostly Medicine users.",
    publishedAt: "2026-05-03",
    category: "AMC",
  },
  {
    slug: "amc-pass-rates-by-country",
    title: "AMC Pass Rates by Country (2024-2026): What the Data Actually Shows IMGs",
    description:
      "AMC Part 1 first-attempt pass rates sit around 60-70%, with country-level variation driven by years-since-graduation and structured prep, not innate ability.",
    publishedAt: "2026-05-02",
    category: "AMC",
  },
  {
    slug: "amc-vs-plab",
    title: "AMC vs PLAB in 2026: Which Exam Should an IMG Take First (Australia or UK)?",
    description:
      "AMC and PLAB lead to different countries, not different leagues. Compare cost, format, pass rates, registration steps and time-to-PR — and pick the one you actually want to live in.",
    publishedAt: "2026-05-02",
    category: "AMC",
  },
  {
    slug: "osce-guide",
    title: "OSCE Guide for IMGs (2026): How to Prepare for the AMC Clinical Exam",
    description:
      "A complete OSCE preparation guide for IMGs sitting the AMC Clinical Exam — communication frameworks, history mnemonics, day-of-exam strategy, and the Australian-context pitfalls that cost candidates marks.",
    publishedAt: "2026-05-04",
    category: "OSCE",
  },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Blog", item: PAGE_URL },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Mostly Medicine Blog",
  url: PAGE_URL,
  description: DESCRIPTION,
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "en-AU",
  blogPost: posts.map((p) => ({
    "@type": "BlogPosting",
    headline: p.title,
    description: p.description,
    datePublished: p.publishedAt,
    url: `${SITE_URL}/${p.slug}`,
    author: { "@id": `${SITE_URL}/#founder` },
  })),
};

const CATEGORY_STYLES: Record<BlogPost["category"], string> = {
  AMC: "text-indigo-300 bg-indigo-900/40 border-indigo-700/40",
  AHPRA: "text-emerald-300 bg-emerald-900/40 border-emerald-700/40",
  English: "text-amber-300 bg-amber-900/40 border-amber-700/40",
  OSCE: "text-violet-300 bg-violet-900/40 border-violet-700/40",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
}

export default function BlogIndexPage() {
  // Sort newest first by publishedAt (defensive — `posts` is already ordered).
  const sortedPosts = [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return (
    <main className="min-h-screen bg-[#070714] overflow-x-hidden relative text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />

      <div className="pointer-events-none select-none" aria-hidden>
        <div className="absolute top-[-6%] left-[15%] w-[600px] h-[600px] bg-emerald-700/15 rounded-full blur-[130px]" />
        <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-violet-700/10 rounded-full blur-[110px]" />
      </div>

      <PillarPageNav />

      <section className="relative z-10 max-w-3xl mx-auto px-6 sm:px-10 pt-12 pb-8">
        <p className="text-xs uppercase tracking-widest text-emerald-300 font-bold mb-3">
          Blog &middot; AMC + AHPRA + IMG Pathway
        </p>
        <h1
          className="font-display font-bold text-white mb-4"
          style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
        >
          Honest guides for IMGs preparing for AMC
        </h1>
        <p className="text-base text-slate-400 leading-relaxed mb-2">
          Long-form, founder-written, evidence-cited. Every article is reviewed by Dr Amandeep Kamboj, an AMC pass-graduate IMG. We update guides every 6 months as standards shift.
        </p>
      </section>

      <section className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 pb-16">
        <div className="grid gap-4 md:gap-5">
          {sortedPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/${post.slug}`}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] hover:border-emerald-500/40 hover:bg-white/[0.06] p-6 sm:p-7 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${CATEGORY_STYLES[post.category]}`}
                >
                  {post.category}
                </span>
                <span className="text-xs text-slate-500">{formatDate(post.publishedAt)}</span>
              </div>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-white mb-2 group-hover:text-emerald-200 transition-colors leading-tight">
                {post.title}
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed mb-3">
                {post.description}
              </p>
              <p className="text-xs font-semibold text-emerald-300 group-hover:text-emerald-200">
                Read the article &rarr;
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative z-10 max-w-3xl mx-auto px-6 sm:px-10 pb-20">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-7 sm:p-9 text-center">
          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">
            More on the way
          </p>
          <h2 className="font-display font-bold text-2xl text-white mb-3">
            Get the next article in your inbox
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed mb-5 max-w-xl mx-auto">
            Sign up free (no credit card) and we&apos;ll send a daily Mostly Daily teaser plus the next pillar guide as it goes live. Unsubscribe anytime.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm px-5 py-2.5 transition"
            >
              Sign up free &rarr;
            </Link>
            <Link
              href="/ask-ai"
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-slate-200 font-semibold text-sm px-5 py-2.5 transition"
            >
              Try Ask AI (3 free questions)
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
