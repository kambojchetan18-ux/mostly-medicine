import HeroV2 from "@/components/landing/HeroV2";
import TrustStrip from "@/components/landing/TrustStrip";
import HowItWorks from "@/components/landing/HowItWorks";
import FeatureBlock from "@/components/landing/FeatureBlock";
import ComparisonStrip from "@/components/landing/ComparisonStrip";
import LiveCounter from "@/components/landing/LiveCounter";
import FaqSection from "@/components/landing/FaqSection";
import PricingTeaser from "@/components/landing/PricingTeaser";
import FooterMantra from "@/components/landing/FooterMantra";
import SiteFooter from "@/components/SiteFooter";

// ISR — page is rebuilt once every 5 minutes so the LiveCounter
// reflects the latest 24h aggregates without paying for a Supabase
// query on every visit.
export const revalidate = 300;

// Existing FAQ JSON-LD kept verbatim so the homepage's rich-result
// eligibility doesn't regress when the section UI moves into
// <FaqSection /> below. The schema and the visible FAQ should stay
// roughly in sync — if you change one, update the other.
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is Mostly Medicine really AMC-aligned for 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Every MCQ, every roleplay scenario, every flashcard cites the AMC Handbook 2026, Murtagh's General Practice 8th edition, RACGP Red Book, Therapeutic Guidelines (eTG) or the relevant Australian college. We never substitute US sources like USPSTF, AHA or UpToDate without an Australian equivalent first.",
      },
    },
    {
      "@type": "Question",
      name: "Do I still need eMedici or AMBOSS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most IMGs run Mostly Medicine alongside eMedici's free official MCQ samples for a few weeks, then drop back to MM alone once their CAT 1 readiness curve crosses 70%. AMBOSS is USMLE-tuned — the AMC questions in its bank are an afterthought.",
      },
    },
    {
      "@type": "Question",
      name: "What's free vs paid?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Free: 5 MCQs/day, 1 voice OSCE/day, full reference library, 5 flashcard reviews/day across 21 packaged decks. Pro (A$29/mo): unlimited MCQs, unlimited voice OSCE, 3 AI-generated decks/day, 1 Anki .apkg import/day. Enterprise (A$49/mo): everything plus AMC Peer RolePlay.",
      },
    },
    {
      "@type": "Question",
      name: "Does it cover Aboriginal and Torres Strait Islander Health?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — a dedicated 20-card flashcard deck plus weighted MCQs across CAT 1 specialties. We also cover Rural & Remote Medicine, Cultural Safety, AU Pharmacology and AU Ethics as dedicated decks.",
      },
    },
    {
      "@type": "Question",
      name: "Does the voice OSCE feel like a real patient?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It speaks back to you, holds the history coherently over an 8-minute station, and uses the same emotional cues the AMC Handbook specifies. After 'thank you, that's all', a Claude-Sonnet examiner grades you against the 13-domain AMC rubric.",
      },
    },
    {
      "@type": "Question",
      name: "Mobile app?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — Android via Play Store APK (in active testing), iOS via TestFlight. The Cards tab mirrors web with the same FSRS scheduling. AI generation and Anki import stay on web for v1.",
      },
    },
    {
      "@type": "Question",
      name: "Who builds Mostly Medicine?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A small team of IMGs and IT professionals who walked the AMC pathway. Independent — not affiliated with the AMC, AHPRA or any official body. Mostly Medicine is a study tool aligned with publicly available AMC Handbooks and Australian clinical guidelines.",
      },
    },
  ],
};

export default function Home() {
  return (
    <main className="bg-white">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <HeroV2 />
      <TrustStrip />
      <HowItWorks />

      {/* Feature blocks — alternating image left/right. Each block sells
          one of the four pillars: MCQs, voice OSCE, flashcards, AU moat. */}
      <FeatureBlock
        tag="AMC MCQ · CAT 1"
        title="Drill the system you'll fail on."
        blurb="4,400+ adaptive MCQs across 24 specialties, with the AU-weighted content (Aboriginal Health, rural medicine, AU pharmacology) that US tools skip. Every explanation cites a source you'll be expected to know on exam day."
        bullets={[
          "Specialty filters — drill the one that's lowest on your readiness curve",
          "Cited from Murtagh / RACGP / eTG / AMC Handbook 2026",
          "FSRS-5 spaced repetition — never review the same card twice in a week",
          "Free tier: 5 MCQs/day. Pro: unlimited.",
        ]}
        cta={{ href: "/amc-mcq", label: "Explore AMC MCQ" }}
        imageSrc="/marketing/mcq-feedback.png"
        imageAlt="Mostly Medicine MCQ feedback screen with citation"
        accent="emerald"
      />

      <FeatureBlock
        tag="Voice OSCE · CAT 2"
        title="Rehearse the case out loud, 24/7."
        blurb="150+ AMC Handbook stations with a Claude-powered patient who holds the history. After 'thank you', a Sonnet examiner scores you against the 13-domain mark-sheet — same rubric the AMC uses."
        bullets={[
          "Speaks back to you in real time — voice in, voice out",
          "Patient holds context coherently over an 8-minute station",
          "Examiner feedback grounded in your transcript, no waffle",
          "No partner needed. No scheduling. Free tier: 1/day.",
        ]}
        cta={{ href: "/amc-cat2", label: "Try voice OSCE" }}
        imageSrc="/marketing/roleplay-session.png"
        imageAlt="Mostly Medicine voice OSCE session with patient avatar"
        accent="violet"
        reverse
      />

      <FeatureBlock
        tag="Flashcards · FSRS-5"
        title="Cited like a textbook. Fast like a flashcard."
        blurb="21 hand-curated specialty decks (407 AU-cited cards) plus AI generation from your own notes plus Anki .apkg import. FSRS-5 schedules every review so you study less and remember more."
        bullets={[
          "21 packaged decks — Cardiology to Aboriginal Health",
          "AI cards from your notes, your lectures, or your wrong MCQs",
          "Anki .apkg import — keep your AnKing deck, sync to FSRS",
          "Free tier: 5 reviews/day across all decks.",
        ]}
        cta={{ href: "/dashboard/flashcards", label: "Open flashcards" }}
        imageSrc="/marketing/flashcards-detail.png"
        imageAlt="Mostly Medicine flashcards mid-review with cloze"
        accent="sky"
      />

      <FeatureBlock
        tag="🇦🇺 The AU moat"
        title="Aboriginal Health, built in — not a footnote."
        blurb="Dedicated decks for the topics no global competitor builds: Aboriginal & Torres Strait Islander Health, Rural & Remote Medicine, Cultural Safety, AU Pharmacology (PBS / S8 / RTPM), and AU Medico-Legal (AHPRA / VAD / Austroads)."
        bullets={[
          "Closing the Gap, RHD secondary prophylaxis, MBS 715 — examinable",
          "ACRRM pathway, 19AB moratorium, MM categories explained",
          "AHPRA Code 2020, Rogers v Whitaker, Austroads — every state nuance",
          "PBS Authority, S8 prescribing, RTPM SafeScript / QScript",
        ]}
        cta={{ href: "/aboriginal-health-amc", label: "See the AU moat decks" }}
        imageSrc="/marketing/flashcards-hub.png"
        imageAlt="Mostly Medicine specialty deck hub"
        accent="rose"
        reverse
      />

      <ComparisonStrip />
      <LiveCounter />
      <PricingTeaser />
      <FaqSection />
      <FooterMantra />
      <SiteFooter />
    </main>
  );
}
