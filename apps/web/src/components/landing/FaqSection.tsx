// Native <details> accordion. Server component, no JS. Each question
// is also emitted to the homepage's existing FAQPage JSON-LD so Google
// can pick them up.

const FAQS: { q: string; a: string }[] = [
  {
    q: "Is Mostly Medicine really AMC-aligned for 2026?",
    a: "Yes. Every MCQ, every roleplay scenario, every flashcard cites the AMC Handbook 2026, Murtagh's General Practice 8th edition, RACGP Red Book, Therapeutic Guidelines (eTG) or the relevant Australian college. We never substitute US sources like USPSTF, AHA or UpToDate without an Australian equivalent first.",
  },
  {
    q: "Do I still need eMedici or AMBOSS?",
    a: "Most IMGs run Mostly Medicine alongside eMedici's free official MCQ samples for a few weeks, then drop back to MM alone once their CAT 1 readiness curve crosses 70%. AMBOSS is USMLE-tuned — the AMC questions in its bank are an afterthought. If you only buy one tool, MM is the only AMC-native option.",
  },
  {
    q: "What's free vs paid?",
    a: "Free: 5 MCQs/day, 1 voice OSCE/day, full reference library, 5 flashcard reviews/day across 21 packaged decks. Pro (A$29/mo): unlimited MCQs, unlimited voice OSCE, 3 AI-generated decks/day from your notes, 1 Anki .apkg import/day. Enterprise (A$49/mo): unlimited everything plus AMC Peer RolePlay (live video).",
  },
  {
    q: "Does it cover Aboriginal & Torres Strait Islander Health?",
    a: "Yes — and it's not a footnote. A dedicated 20-card flashcard deck plus weighted MCQs across CAT 1 specialties. The AMC tests this heavily and most US/UK tools skip it entirely. We also cover Rural & Remote Medicine, Cultural Safety, AU Pharmacology and AU Ethics as dedicated decks.",
  },
  {
    q: "Does the voice OSCE actually feel like a real patient?",
    a: "It speaks back to you, holds the history coherently over an 8-minute station, and uses the same emotional cues the AMC Handbook specifies. After 'thank you, that's all', a Claude-Sonnet examiner grades you against the 13-domain AMC rubric. No partner, no scheduling, available 24/7.",
  },
  {
    q: "Mobile app?",
    a: "Yes — Android via Play Store APK (in active testing), iOS via TestFlight. The Cards tab mirrors web with the same FSRS scheduling. AI generation and Anki import stay on web for v1 (text-input heavy).",
  },
  {
    q: "Refund policy?",
    a: "Cancel any time from your account — the rest of the paid month stays active. We don't offer pass-or-refund guarantees because we'd rather sell you on the actual product than make a promise we can't operationalise. If something breaks, email us within 30 days.",
  },
  {
    q: "Who builds Mostly Medicine?",
    a: "A small team of IMGs and IT professionals who walked the AMC pathway. We're not affiliated with the AMC, AHPRA or any official body — Mostly Medicine is an independent study tool aligned with publicly available AMC Handbooks and Australian clinical guidelines.",
  },
];

export default function FaqSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Frequently asked
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            What IMGs ask before signing up
          </h2>
        </div>

        <div className="mt-10 space-y-3">
          {FAQS.map((f, i) => (
            <details
              key={i}
              className="group rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 transition open:bg-white open:shadow-sm"
            >
              <summary className="flex cursor-pointer items-start justify-between gap-4 text-base font-bold text-slate-900 marker:hidden">
                <span>{f.q}</span>
                <span
                  aria-hidden
                  className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
