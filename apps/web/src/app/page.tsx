import SiteNav from "@/components/landing/v3/SiteNav";
import HeroV3 from "@/components/landing/v3/HeroV3";
import TrustBand from "@/components/landing/v3/TrustBand";
import ProblemFraming from "@/components/landing/v3/ProblemFraming";
import HowItWorksV3 from "@/components/landing/v3/HowItWorksV3";
import AIExaminer from "@/components/landing/v3/AIExaminer";
import SmartFeedbackMCQ from "@/components/landing/v3/SmartFeedbackMCQ";
import CaseMap from "@/components/landing/v3/CaseMap";
import MoreModules from "@/components/landing/v3/MoreModules";
import BuiltForIMGs from "@/components/landing/v3/BuiltForIMGs";
import PricingSimple from "@/components/landing/v3/PricingSimple";
import FaqV3 from "@/components/landing/v3/FaqV3";
import FinalCTA from "@/components/landing/v3/FinalCTA";
import SiteFooter from "@/components/SiteFooter";

// FAQPage JSON-LD — visible FaqV3 questions mirrored here so Google can
// emit rich results. Keep the two lists in sync.
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What does an AMC Clinical AI station actually feel like?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You hit start, see the scenario, and the AI patient greets you in voice. You talk; it responds — coherently across an 8-minute station. After you say 'thank you', a Sonnet examiner scores your transcript against the 13-domain AMC rubric. Available 24/7.",
      },
    },
    {
      "@type": "Question",
      name: "What's the difference between Handbook and Beyond-Handbook cases?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Handbook mode = the 151 cases mapped 1:1 to the AMC Handbook 2026. Beyond-Handbook mode = unlimited AI-generated cases across every specialty — no daily cap. Use Handbook to cover the exam, Beyond to drill weak systems without running out of practice.",
      },
    },
    {
      "@type": "Question",
      name: "Is the content actually aligned with the AMC Handbook 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Every station maps to AMC Handbook 2026 case categories. Investigations, management and counselling are written against Australian clinical guidelines — not USMLE or NICE.",
      },
    },
    {
      "@type": "Question",
      name: "How is the AI examiner score calculated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Your transcript is graded by Claude Sonnet 4.6 against the AMC's 13-domain rubric. Each domain is scored 0–10 with quote-level rationale, and weak-domain tracking persists across sessions.",
      },
    },
    {
      "@type": "Question",
      name: "How does MCQ SmartFeedback work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "When you answer one of the 4,300+ MCQs wrong, hit \"🤔 Why was I wrong?\" — SmartFeedback generates a personalised AI explanation that names the exact trap you fell into, the Australian guideline the question tested (RACGP, eTG, AMH or NHFA), and one clinical pearl for exam day. Explanations are cached, so re-reading them during revision is free. Included on the free tier (5 MCQs/day).",
      },
    },
    {
      "@type": "Question",
      name: "Can I use it on my phone?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — Android via Play Store APK (in active testing), iOS via TestFlight. Voice OSCE also works in mobile Safari and Chrome directly.",
      },
    },
    {
      "@type": "Question",
      name: "What's the free tier really worth?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "1 voice OSCE station / day, 5 AMC MCQs / day, 5 flashcard reviews / day, and full Ask AI reference library. No card required.",
      },
    },
    {
      "@type": "Question",
      name: "Refund / cancellation policy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cancel any time in your account — the remainder of the paid month stays active. We don't promise pass-or-refund guarantees, but email us within 30 days if something breaks.",
      },
    },
  ],
};

export default function Home() {
  return (
    <main className="bg-cream-50 font-sans text-ink-950">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <SiteNav />
      <HeroV3 />
      <TrustBand />
      <ProblemFraming />
      <HowItWorksV3 />
      <AIExaminer />
      <SmartFeedbackMCQ />
      <CaseMap />
      <MoreModules />
      <BuiltForIMGs />
      <PricingSimple />
      <FaqV3 />
      <FinalCTA />
      <SiteFooter />
    </main>
  );
}
