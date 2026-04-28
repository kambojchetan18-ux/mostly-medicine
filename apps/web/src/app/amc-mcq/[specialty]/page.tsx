import type { Metadata } from "next";
import type { MCQuestion } from "@mostly-medicine/content";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  SITE_URL,
  SPECIALTIES,
  getQuestionsForSpecialty,
  getSpecialtyBySlug,
} from "../specialties";

interface PageProps {
  params: { specialty: string };
}

export function generateStaticParams() {
  return SPECIALTIES.map((s) => ({ specialty: s.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const spec = getSpecialtyBySlug(params.specialty);
  if (!spec) {
    return {
      title: "Specialty not found — Mostly Medicine",
    };
  }
  const count = getQuestionsForSpecialty(spec.topic).length;
  const roundedCount = Math.max(50, Math.floor(count / 50) * 50);
  const title = `AMC ${spec.name} MCQ Practice — ${roundedCount}+ Questions for IMGs`;
  const description = `${spec.tagline} ${roundedCount}+ Australian-aligned MCQs with worked explanations for AMC MCQ.`;
  const pageUrl = `${SITE_URL}/amc-mcq/${spec.slug}`;
  return {
    title,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: "article",
    },
  };
}

function SampleQuestion({ q, index }: { q: MCQuestion; index: number }) {
  return (
    <article className="not-prose mb-8 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
      <div className="mb-3 flex items-center gap-3">
        <span className="rounded-full bg-violet-900/40 border border-violet-700/40 text-violet-300 text-xs font-bold uppercase tracking-widest px-3 py-1">
          Question {index + 1}
        </span>
        <span className="text-xs uppercase tracking-widest text-slate-500">
          {q.subtopic} · {q.difficulty}
        </span>
      </div>
      <p className="text-slate-100 leading-relaxed mb-4">{q.stem}</p>
      <ol className="space-y-2 mb-4">
        {q.options.map((opt) => {
          const isCorrect = opt.label === q.correctAnswer;
          return (
            <li
              key={opt.label}
              className={`flex gap-3 rounded-lg border px-4 py-2 text-sm ${
                isCorrect
                  ? "border-emerald-700/40 bg-emerald-900/20 text-emerald-200"
                  : "border-slate-800 bg-slate-950/40 text-slate-300"
              }`}
            >
              <span className="font-bold w-5 shrink-0">{opt.label}.</span>
              <span>{opt.text}</span>
              {isCorrect ? (
                <span className="ml-auto text-xs uppercase tracking-widest text-emerald-300 shrink-0">
                  Correct
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
      <details className="group rounded-lg border border-slate-800 bg-slate-950/60 p-4">
        <summary className="cursor-pointer list-none text-sm font-bold text-violet-300 group-open:text-violet-200">
          Show explanation
        </summary>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          {q.explanation}
        </p>
      </details>
    </article>
  );
}

export default function SpecialtyMcqPage({ params }: PageProps) {
  const spec = getSpecialtyBySlug(params.specialty);
  if (!spec) notFound();

  const allForSpecialty = getQuestionsForSpecialty(spec.topic);
  const totalCount = allForSpecialty.length;
  const roundedCount = Math.max(50, Math.floor(totalCount / 50) * 50);
  const samples = allForSpecialty.slice(0, 5);
  const pageUrl = `${SITE_URL}/amc-mcq/${spec.slug}`;
  const title = `AMC ${spec.name} MCQ Practice — ${roundedCount}+ Questions for IMGs`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "AMC MCQ Practice",
        item: `${SITE_URL}/amc-mcq`,
      },
      { "@type": "ListItem", position: 3, name: spec.name, item: pageUrl },
    ],
  };

  const learningResourceSchema = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: title,
    description: spec.tagline,
    url: pageUrl,
    inLanguage: "en-AU",
    learningResourceType: "Practice question bank",
    educationalLevel: "Postgraduate medical",
    educationalUse: "AMC MCQ examination preparation",
    teaches: spec.name,
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "International Medical Graduate",
    },
    provider: { "@type": "Organization", name: "Mostly Medicine", url: SITE_URL },
    hasPart: samples.map((q, idx) => ({
      "@type": "Question",
      position: idx + 1,
      name: q.stem,
      acceptedAnswer: {
        "@type": "Answer",
        text:
          q.options.find((o) => o.label === q.correctAnswer)?.text ?? "",
      },
      suggestedAnswer: q.options.map((o) => ({
        "@type": "Answer",
        text: `${o.label}. ${o.text}`,
      })),
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: spec.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <main className="min-h-screen bg-[#070714] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(learningResourceSchema),
        }}
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

      <article className="max-w-3xl mx-auto px-6 sm:px-10 pb-24 prose prose-invert prose-headings:font-display prose-h1:text-4xl sm:prose-h1:text-5xl prose-h2:text-2xl sm:prose-h2:text-3xl prose-a:text-violet-400 hover:prose-a:text-violet-300">
        <header className="mt-8 mb-12">
          <p className="text-xs uppercase tracking-widest text-violet-400 font-bold mb-3">
            AMC MCQ · {spec.name}
          </p>
          <h1 className="font-display font-bold mb-4">
            AMC {spec.name} MCQ Practice — {roundedCount}+ Questions for IMGs
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            {spec.tagline}
          </p>
          <p className="text-slate-500 text-sm mt-4">
            {totalCount} questions in the full bank · 5 free samples below ·
            Spaced repetition + AI explanations on the free tier.
          </p>
          <div className="not-prose mt-6 flex gap-3">
            <Link
              href="/auth/signup"
              className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-3 rounded-xl text-sm font-bold no-underline"
            >
              Unlock full {spec.short} bank
            </Link>
            <Link
              href="/amc-mcq"
              className="border border-slate-700 hover:border-slate-500 text-slate-200 px-6 py-3 rounded-xl text-sm font-bold no-underline"
            >
              All specialties
            </Link>
          </div>
        </header>

        <section>
          <h2>Why {spec.name} matters in AMC MCQ</h2>
          {spec.intro.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </section>

        <section>
          <h2>5 free {spec.short} sample MCQs</h2>
          <p>
            Below are five sample questions taken straight from the Mostly
            Medicine {spec.short.toLowerCase()} bank. The correct answer is
            highlighted, with the worked explanation tucked inside a collapsed
            panel so you can self-test first.
          </p>
          {samples.length === 0 ? (
            <p className="not-prose text-slate-400">
              Sample questions for this specialty are being prepared. Check
              back soon, or browse all specialties below.
            </p>
          ) : (
            samples.map((q, idx) => (
              <SampleQuestion key={q.id} q={q} index={idx} />
            ))
          )}
        </section>

        <section>
          <h2>Want the other {Math.max(0, totalCount - samples.length)}+ {spec.short.toLowerCase()} MCQs?</h2>
          <p>
            The full {spec.short.toLowerCase()} bank, AI-generated follow-up
            questions, weak-area analytics and spaced repetition are free to
            access — no credit card required.
          </p>
          <p className="not-prose">
            <Link
              href="/auth/signup"
              className="inline-block mt-2 bg-brand-600 hover:bg-brand-500 text-white px-7 py-3.5 rounded-2xl font-bold no-underline"
            >
              Sign up free →
            </Link>
          </p>
        </section>

        <section>
          <h2>{spec.name} FAQ</h2>
          {spec.faqs.map((f) => (
            <div key={f.question}>
              <h3>{f.question}</h3>
              <p>{f.answer}</p>
            </div>
          ))}
        </section>

        <footer className="mt-16 pt-8 border-t border-slate-800 text-sm text-slate-500">
          <p>
            Sample MCQs and explanations are educational content from Mostly
            Medicine, mapped to publicly available Australian guidelines. For
            official AMC examination information visit{" "}
            <a href="https://www.amc.org.au" target="_blank" rel="noopener">
              amc.org.au
            </a>
            .
          </p>
        </footer>
      </article>
    </main>
  );
}
