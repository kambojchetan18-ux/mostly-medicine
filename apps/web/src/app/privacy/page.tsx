import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Mostly Medicine",
  description: "How Mostly Medicine collects, uses, and protects your data.",
};

const LAST_UPDATED = "29 April 2026";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-xs text-gray-500 hover:text-gray-700">← Mostly Medicine</Link>

        <h1 className="mt-4 text-3xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="mt-2 text-xs text-gray-500">Last updated: {LAST_UPDATED}</p>

        <div className="prose prose-slate mt-8 max-w-none text-sm leading-relaxed text-gray-800">
          <p>
            Mostly Medicine (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is an AI-powered exam-prep
            platform for International Medical Graduates preparing for the Australian Medical Council
            (AMC) pathway. This Privacy Policy explains what information we collect, how we use it,
            and the choices you have.
          </p>

          <h2>1. Information we collect</h2>
          <ul>
            <li><strong>Account details:</strong> name, email address, password (hashed), and authentication identifiers when you sign up via email or Google OAuth.</li>
            <li><strong>Profile data:</strong> any optional information you add to your profile (e.g., country of medical training, exam date, study preferences).</li>
            <li><strong>Usage data:</strong> question attempts, scenario sessions, voice transcripts, examiner-feedback scores, study streaks, and time spent across modules.</li>
            <li><strong>Voice audio:</strong> when you use AMC Handbook AI RolePlay, AMC Clinical AI RolePlay, or AMC Peer RolePlay with voice mode, short audio chunks (≤ 5 seconds) are sent to Groq&apos;s Whisper service for transcription. Audio is processed in transit and is not stored beyond the request lifetime.</li>
            <li><strong>Billing data:</strong> if you upgrade to Pro or Enterprise, payment details are handled by Stripe. We store a Stripe customer ID, subscription status, and plan tier, but never your full card number.</li>
            <li><strong>Technical data:</strong> IP address, browser, device type, and basic analytics events used to improve the service and prevent abuse.</li>
          </ul>

          <h2>2. How we use your information</h2>
          <ul>
            <li>Provide and improve the platform&apos;s features (MCQs, AI-driven roleplays, examiner feedback, library, jobs hub).</li>
            <li>Personalize your study path with spaced repetition and weak-area targeting.</li>
            <li>Process payments and manage subscriptions via Stripe.</li>
            <li>Communicate with you about your account, important changes, and (with your consent) product updates.</li>
            <li>Detect and prevent fraud, abuse, or violations of our Terms.</li>
          </ul>

          <h2>3. Sub-processors and third parties</h2>
          <p>We rely on the following providers to operate the service. Each handles only the minimum data required for their function:</p>
          <ul>
            <li><strong>Supabase</strong> — database hosting + authentication + realtime sync.</li>
            <li><strong>Vercel</strong> — web hosting and serverless functions.</li>
            <li><strong>Anthropic Claude</strong> — generates patient simulations, examiner feedback, and content explanations. Anthropic does not train models on your inputs by default.</li>
            <li><strong>Groq</strong> — Whisper-based speech-to-text transcription.</li>
            <li><strong>Cloudflare</strong> — TURN/STUN relay for live peer roleplay video sessions.</li>
            <li><strong>Stripe</strong> — payment processing and subscription billing.</li>
            <li><strong>Google</strong> — optional OAuth sign-in (only if you choose to use it).</li>
          </ul>

          <h2>4. Data retention</h2>
          <p>
            We keep your account data while your account is active. If you delete your account, we
            remove personal data within 30 days, except where retention is legally required (e.g., tax
            records for paid subscriptions). Voice audio is never retained — only the transcribed text
            is stored alongside your roleplay session.
          </p>

          <h2>5. Your rights</h2>
          <p>You may, at any time:</p>
          <ul>
            <li>Access, correct, or export your personal data.</li>
            <li>Delete your account from the dashboard or by emailing us.</li>
            <li>Withdraw consent for non-essential communications.</li>
            <li>Lodge a complaint with your local data-protection authority.</li>
          </ul>

          <h2>6. Security</h2>
          <p>
            We use TLS for all data in transit, encrypted storage at rest, row-level security on the
            database, and least-privilege server-side access controls. No system is perfectly secure,
            but we apply industry-standard practices and review them regularly.
          </p>

          <h2>7. Children</h2>
          <p>
            Mostly Medicine is intended for adult medical professionals preparing for the AMC. The
            service is not directed at children under 16, and we do not knowingly collect their data.
          </p>

          <h2>8. Changes to this policy</h2>
          <p>
            If we make material changes to this policy, we&apos;ll notify you via email and update the
            &quot;Last updated&quot; date above. Continued use of the platform after changes means you
            accept the new policy.
          </p>

          <h2>9. Contact</h2>
          <p>
            Questions or requests? Email us at{" "}
            <a href="mailto:hello@mostlymedicine.com">hello@mostlymedicine.com</a>.
          </p>

          <p className="mt-8 text-xs text-gray-500">
            Mostly Medicine is operated by Chetan Kamboj and Dr Amandeep Kamboj. We respect your
            privacy and only collect what we need to make this platform actually useful for IMGs.
          </p>
        </div>
      </div>
    </div>
  );
}
