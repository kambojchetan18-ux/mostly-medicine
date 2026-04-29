import Link from "next/link";

export const metadata = {
  title: "Terms of Service — Mostly Medicine",
  description: "The terms governing your use of Mostly Medicine.",
};

const LAST_UPDATED = "29 April 2026";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-xs text-gray-500 hover:text-gray-700">← Mostly Medicine</Link>

        <h1 className="mt-4 text-3xl font-bold text-gray-900">Terms of Service</h1>
        <p className="mt-2 text-xs text-gray-500">Last updated: {LAST_UPDATED}</p>

        <div className="prose prose-slate mt-8 max-w-none text-sm leading-relaxed text-gray-800">
          <p>
            Welcome to Mostly Medicine (&quot;we&quot;, &quot;us&quot;, &quot;our&quot; — operated by
            Chetan Kamboj and Dr Amandeep Kamboj). These Terms govern your use of mostlymedicine.com
            and the connected mobile app. By creating an account or using the service, you accept
            these Terms.
          </p>

          <h2>1. Who can use the service</h2>
          <p>
            You must be at least 18 years old, capable of forming a binding contract, and not
            prohibited from receiving services under applicable law. The platform is designed for
            International Medical Graduates and other medical professionals preparing for the
            Australian Medical Council exams.
          </p>

          <h2>2. Your account</h2>
          <p>
            You&apos;re responsible for keeping your login credentials secure and for all activity on
            your account. Tell us immediately if you suspect unauthorized access.
          </p>

          <h2>3. Plans and billing</h2>
          <ul>
            <li>The Free plan includes daily-limited MCQ practice and full reference-library access.</li>
            <li>Pro and Enterprise plans unlock additional modules (AMC Handbook AI RolePlay, AMC Clinical AI RolePlay, AMC Peer RolePlay, higher daily limits) and are billed monthly or yearly through Stripe.</li>
            <li>Subscriptions auto-renew unless you cancel before the renewal date in the Billing portal.</li>
            <li>We may change pricing with reasonable notice; current prices apply only to your current billing cycle.</li>
            <li>Refunds are at our discretion and granted only for material technical issues that prevented you from using the service.</li>
          </ul>

          <h2>4. AI content disclaimer — important</h2>
          <p>
            <strong>Mostly Medicine is a study tool, not a medical reference.</strong> AI-generated
            patient simulations, examiner feedback, smart explanations, and library answers are
            grounded in widely-used medical resources (Murtagh General Practice, RACGP Red Book, AMC
            Handbook 2026) but may contain errors, omissions, or out-of-date information. You must:
          </p>
          <ul>
            <li>Always verify clinical content against official guidelines and your training before applying it to real patient care.</li>
            <li>Never rely on Mostly Medicine for actual medical decisions, diagnosis, or treatment.</li>
            <li>Understand that passing or failing the AMC depends on many factors outside our control; we don&apos;t guarantee exam outcomes.</li>
          </ul>

          <h2>5. AMC trademarks and content</h2>
          <p>
            &quot;AMC&quot;, &quot;Australian Medical Council&quot;, &quot;MCAT&quot;, and related
            marks are trademarks of their respective owners. Mostly Medicine is an independent
            third-party study platform, <strong>not affiliated with, endorsed by, or sponsored by</strong>
            the Australian Medical Council, AHPRA, or any official body. Our content is
            &quot;aligned with&quot; published AMC handbooks and is intended for fair-use educational
            purposes.
          </p>

          <h2>6. Acceptable use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Share, resell, or redistribute Mostly Medicine&apos;s content without permission.</li>
            <li>Reverse-engineer, scrape, or attempt to extract MCQ banks, scenario data, or feedback rubrics in bulk.</li>
            <li>Use the platform to harass, defame, or impersonate others (especially in AMC Peer RolePlay video sessions).</li>
            <li>Bypass rate limits, plan gates, or other technical controls.</li>
            <li>Upload malicious content, illegal material, or copyrighted material you don&apos;t have rights to.</li>
            <li>Use the service to train competing AI models on the content we generate.</li>
          </ul>

          <h2>7. User content</h2>
          <p>
            When you upload notes to your library, generate roleplay sessions, or create any content,
            you keep ownership of your content. You grant us a limited license to store, process, and
            display it strictly to provide the service to you. We don&apos;t use your content to train
            third-party AI models.
          </p>

          <h2>8. Live Peer RolePlay sessions</h2>
          <p>
            AMC Peer RolePlay matches you with another candidate over real-time video. Both parties
            consent to being recorded only insofar as transcripts are persisted for examiner feedback;
            video and audio streams are <strong>not recorded</strong>. Treat your partner with
            professional courtesy. We may suspend accounts that misuse this feature.
          </p>

          <h2>9. Service availability</h2>
          <p>
            We try to keep Mostly Medicine running 24/7 but can&apos;t guarantee uninterrupted access.
            We may schedule maintenance, deploy updates, or take features offline temporarily. We&apos;re
            not liable for losses caused by such interruptions.
          </p>

          <h2>10. Termination</h2>
          <p>
            You can delete your account at any time. We may suspend or terminate accounts that
            violate these Terms, with reasonable notice where possible. After termination, you lose
            access to paid features and your data may be deleted within 30 days (subject to legal
            retention requirements).
          </p>

          <h2>11. Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, Mostly Medicine and its founders are not liable
            for indirect, incidental, or consequential damages arising from your use of the service.
            Our total liability for any claim is capped at the amount you paid us in the 12 months
            preceding the claim, or AUD $100, whichever is greater.
          </p>

          <h2>12. Governing law</h2>
          <p>
            These Terms are governed by the laws of New South Wales, Australia. Disputes will be
            resolved in the courts of Sydney, Australia, unless mandatory consumer-protection laws
            in your jurisdiction provide otherwise.
          </p>

          <h2>13. Changes to these Terms</h2>
          <p>
            We&apos;ll update the &quot;Last updated&quot; date and notify you of material changes by
            email. Continued use after changes means you accept the updated Terms.
          </p>

          <h2>14. Contact</h2>
          <p>
            Questions? Email{" "}
            <a href="mailto:hello@mostlymedicine.com">hello@mostlymedicine.com</a>.
          </p>

          <p className="mt-8 text-xs text-gray-500">
            Mostly Medicine — built by Chetan Kamboj (engineer · Sydney) and Dr Amandeep Kamboj
            (medical co-founder · India). For International Medical Graduates, by people who actually
            went through the AMC pathway.
          </p>
        </div>
      </div>
    </div>
  );
}
