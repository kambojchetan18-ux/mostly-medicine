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
    <article className="not-prose mb-8 rounded-2xl border border-ink-950/10 bg-white p-6 shadow-sm sm:p-7">
      {/* Question header — distinct badge + meta row, much higher contrast
          than the prior saffron-900/40 chip that was lost on cream. */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-saffron-200 bg-saffron-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-saffron-800">
          Question {index + 1}
        </span>
        <span className="text-xs uppercase tracking-widest text-ink-900/65">
          {q.subtopic} · <strong className="text-ink-950">{q.difficulty}</strong>
        </span>
      </div>

      {/* Stem — larger leading + base size for readability. */}
      <p className="mb-5 text-[15px] leading-relaxed text-ink-950 sm:text-base">{q.stem}</p>

      <ol className="mb-5 space-y-2">
        {q.options.map((opt) => {
          const isCorrect = opt.label === q.correctAnswer;
          return (
            <li
              key={opt.label}
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm leading-relaxed transition-colors ${
                isCorrect
                  ? "border-saffron-400 bg-saffron-50 font-medium text-ink-950"
                  : "border-ink-950/10 bg-cream-50 text-ink-950/85 hover:border-ink-950/20"
              }`}
            >
              <span className="w-5 shrink-0 font-bold text-ink-950">{opt.label}.</span>
              <span className="flex-1">{opt.text}</span>
              {isCorrect ? (
                <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full bg-saffron-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                  ✓ Correct
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>

      <details className="group rounded-lg border border-ink-950/10 bg-cream-100/60 p-4 open:bg-cream-100">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-bold text-saffron-700 group-open:text-saffron-800">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-saffron-600 text-xs text-white transition-transform group-open:rotate-45">
            +
          </span>
          Show explanation
        </summary>
        <p className="mt-3 text-sm leading-relaxed text-ink-950/85">{q.explanation}</p>
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
    <main className="min-h-screen bg-cream-50 text-ink-950">
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
          className="rounded-xl bg-saffron-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-saffron-500"
        >
          Start free
        </Link>
      </nav>

      <article className="max-w-3xl mx-auto px-6 sm:px-10 pb-24 prose prose-headings:font-display prose-headings:text-ink-950 prose-h1:text-4xl sm:prose-h1:text-5xl prose-h2:text-2xl sm:prose-h2:text-3xl prose-p:text-ink-900/85 prose-strong:text-ink-950 prose-a:text-saffron-700 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline">
        <header className="mt-8 mb-12">
          <p className="text-xs uppercase tracking-widest text-saffron-700 font-bold mb-3">
            AMC MCQ · {spec.name}
          </p>
          <h1 className="font-display font-bold mb-4">
            AMC {spec.name} MCQ Practice — {roundedCount}+ Questions for IMGs
          </h1>
          <p className="text-ink-950/65 text-lg leading-relaxed">
            {spec.tagline}
          </p>
          <p className="text-ink-950/55 text-sm mt-4">
            {totalCount} questions in the full bank · 5 free samples below ·
            Spaced repetition + AI explanations on the free tier.
          </p>
          <div className="not-prose mt-6 flex gap-3">
            <Link
              href="/auth/signup"
              className="rounded-xl bg-saffron-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-saffron-500 no-underline"
            >
              Unlock full {spec.short} bank
            </Link>
            <Link
              href="/amc-mcq"
              className="rounded-xl border border-ink-950/15 px-6 py-3 text-sm font-bold text-ink-950/90 transition hover:border-ink-950/40 hover:bg-cream-100/60 no-underline"
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
            <p className="not-prose text-ink-950/65">
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
              className="inline-block mt-2 bg-saffron-600 hover:bg-saffron-500 text-ink-950 px-7 py-3.5 rounded-2xl font-bold no-underline"
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

        <footer className="mt-16 pt-8 border-t border-ink-950/10 text-sm text-ink-950/55">
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
