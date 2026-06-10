import Link from "next/link";

export const metadata = {
  title: "Terms of Service — Mostly Medicine",
  description: "The terms governing your use of Mostly Medicine.",
};

const LAST_UPDATED = "5 June 2026";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-xs text-gray-500 hover:text-gray-700">← Mostly Medicine</Link>

        <h1 className="mt-4 text-3xl font-bold text-gray-900">Terms of Service</h1>
        <p className="mt-2 text-xs text-gray-500">Last updated / Effective Date: {LAST_UPDATED}</p>

        <div className="prose prose-slate mt-8 max-w-none text-sm leading-relaxed text-gray-800">
          <p>
            Mostly Medicine (&quot;<strong>Mostly Medicine</strong>&quot;, &quot;we&quot;,
            &quot;our&quot; or &quot;us&quot;) respects your privacy. These Terms of Service apply
            to your use of our website at mostlymedicine.com (together with the connected mobile
            applications, the &quot;<strong>Platform</strong>&quot;) and our AI-powered exam-preparation
            service for International Medical Graduates (the Platform together with the website,
            the &quot;<strong>Services</strong>&quot;).
          </p>

          <p>
            These Terms of Service (&quot;<strong>Terms</strong>&quot;) govern any use of our
            Services. Your use of the Services is contingent upon your acceptance of and compliance
            with these Terms. If you do not agree with these Terms, please refrain from using the
            Services. Each time you access or use the Services, the most recent versions of these
            Terms and the <Link href="/privacy">Privacy Policy</Link> will apply.
          </p>

          <h2>Changes to Terms</h2>
          <p>
            We may change these Terms from time to time. If we do so, we will post the updated
            Terms on our website and update the &quot;Last updated&quot; date above. Unless
            provided otherwise, all changes will be effective immediately upon posting. You
            should periodically review the current Terms and our{" "}
            <Link href="/privacy">Privacy Policy</Link> to stay informed of our practices.
          </p>

          <h2>1. Use of the Services</h2>
          <p>
            We provide you with the ability to use the Services for your personal study and
            professional development. You are responsible for payment of charges for all internet
            and communication services needed to use the Services. You must be at least 18 years
            old (or the age of majority in your place of residence, whichever is greater) and
            capable of forming a binding contract to use the Services. The Services are designed
            for International Medical Graduates and other medical professionals preparing for the
            Australian Medical Council (AMC) exams.
          </p>

          <h2>2. Privacy Policy</h2>
          <p>
            We collect certain Personal Information from and about you, including when you use the
            Services or otherwise communicate with us. Please see our{" "}
            <Link href="/privacy">Privacy Policy</Link> for more information on how we collect,
            use, retain, and disclose your Personal Information.
          </p>

          <h2>3. Artificial Intelligence Educational Platform</h2>
          <ul>
            <li>
              <strong>Educational purpose only.</strong> Our Services are intended for educational
              purposes only and are not intended to provide medical advice or patient care. Any
              information provided on the Platform is for informational purposes only and should
              not be used as a substitute for professional medical advice, diagnosis, or treatment.
              The Services are intended for people in medical training and professional development.
            </li>
            <li>
              <strong>Healthcare professionals.</strong> The Services are not intended to serve as
              a diagnostic service or platform, provide certainty regarding a diagnosis, recommend
              any specific product or therapy, or substitute for the clinical judgment of a
              qualified healthcare professional. You agree not to use the Services with the
              intention of creating any physician/patient relationship, such as for diagnosis or
              treatment. You are solely responsible for evaluating the information obtained from
              the Services and for any use or misuse of that information in relation to your
              treatment decisions or otherwise. You agree to be solely responsible for your
              compliance with all laws and standards of professional practice that apply to you
              and your practice of medicine or other relevant health professions.
            </li>
            <li>
              <strong>Medical students and IMGs.</strong> The Services provided by Mostly Medicine
              should be used solely as a tool to assist you in preparing for licensing exams and
              no other purpose. These Services are not intended to replace the traditional
              classroom education experience and are meant exclusively as a resource to enhance
              your education. Mostly Medicine makes no representations or warranties of any kind
              regarding the outcomes of any exam that you are preparing to take or may take after
              using the Services offered by Mostly Medicine. We are not affiliated with, endorsed
              by, or sponsored by the Australian Medical Council (AMC), AHPRA, the Medical Board
              of Australia, or any other governing licensing body.
            </li>
            <li>
              <strong>Other consumers.</strong> If you are a consumer who chooses to use our
              Services, you should not rely on that information as professional medical advice
              or use the Services as a replacement for any relationship with your physician or
              other qualified healthcare professional. For medical concerns, including decisions
              about medications and other treatments, consumers should always consult their
              physician or, in serious cases, seek immediate assistance from emergency medical
              personnel. The Services do not constitute the practice of any medical, nursing, or
              other professional healthcare advice, diagnosis, or treatment.
            </li>
          </ul>

          <h2>4. License and Subscriptions</h2>
          <p>
            <strong>License.</strong> In consideration of and subject to your payment of the
            appropriate subscription fee for the features you subscribe to, and your agreement to
            and compliance with the terms, policies and conditions set forth in these Terms,
            Mostly Medicine grants you a limited, revocable, non-exclusive, non-sublicensable,
            non-transferable licence to use and access the content and features posted at the
            Platform according to the terms, policies and conditions set forth in these Terms.
          </p>
          <p>
            <strong>Term.</strong> The Services may be terminated earlier than the expiration of
            your subscription as provided below.
          </p>
          <p>
            <strong>Access.</strong> You may access the Services during the Term from multiple
            places, locations, and devices. You are responsible for ensuring that all persons who
            access the Services through your internet connection are aware of these Terms and
            comply with them.
          </p>
          <p>
            <strong>Subscription tiers.</strong> Mostly Medicine offers the following tiers for a
            licence to use our Services:
          </p>
          <ul>
            <li>
              <strong>Free tier:</strong> Eligible users can create a free account that allows the
              following daily access: 5 AMC MCQs per day, 1 AMC Handbook AI RolePlay per day, 1
              AMC Clinical AI Solo RolePlay per day, 1 sample Mock Exam paper per day, spaced-
              repetition recalls (limited), and reference library (read-only). Any other feature
              not listed is subject to complete limitation of use under the free tier and will be
              noted on the Services where applicable. These caps and terms are subject to change
              without notice and will be noted on the website where applicable.
            </li>
            <li>
              <strong>Pro tier:</strong> Eligible users can purchase a Pro subscription for access
              to unlimited AMC MCQs, AMC Handbook AI RolePlay, AMC Clinical AI Solo RolePlay,
              examiner-style feedback after every session, and spaced repetition for{" "}
              <strong>A$29 per month or A$290 per year</strong> (paid annually). At the end of the
              subscription term, you will be billed automatically unless your subscription is
              cancelled. Cancellation is available at any time, as outlined below.
            </li>
            <li>
              <strong>Enterprise tier:</strong> Eligible users can purchase an Enterprise
              subscription for access to all Pro features plus AMC Peer RolePlay (live two-person
              video sessions), higher daily limits, and priority support for{" "}
              <strong>A$49 per month or A$490 per year</strong> (paid annually). The same renewal
              and cancellation terms apply.
            </li>
          </ul>
          <p>
            <strong>Fee increase.</strong> Mostly Medicine reserves the right to increase fees for
            the Services upon thirty (30) days&apos; prior written notice (including via email),
            effective on the start date of your subsequent subscription term.
          </p>
          <p>
            <strong>Member account, password and security.</strong> You must complete the
            registration process through our website to subscribe to and use the Services by
            providing current, complete, and accurate information as prompted by the registration
            form. You will choose a password and a username. You are entirely responsible for
            maintaining the confidentiality of your password and account. Furthermore, you are
            solely responsible for any and all activities that occur under your account. You
            agree to notify Mostly Medicine immediately of any unauthorised use of your account
            or any other breach of security. We will not be liable for any loss you may incur as
            a result of someone else using your password or account, either with or without your
            knowledge.
          </p>
          <p>
            <strong>Initiation of subscription term.</strong> By using the Services, you agree to
            these Terms. For any paid subscriptions, you may submit a binding offer to initiate a
            contract by clicking the &quot;Upgrade to Pro&quot; or &quot;Upgrade to Enterprise&quot;
            button after completing the online checkout process via our payment processor (Stripe).
            Once you complete the offer, Stripe will send an order confirmation to you via email
            on our behalf. The licence granted to you under these Terms includes the right to use
            and access the Services according to the access tier outlined in this section. At the
            end of this period, your right to use and access the Services and your subscription
            will renew automatically, unless you cancel your subscription. We may also terminate
            these Terms and your licence to use the Services and its features at our sole
            discretion if you fail to comply with any term, policy, or condition in these Terms.
          </p>
          <p>
            <strong>Cancellation and refund policy.</strong> You may cancel a paid subscription at
            any time through the Stripe billing portal accessible from your dashboard, or by
            contacting us at hello@mostlymedicine.com. You will be given access to the Services
            purchased in accordance with your tier for the remainder of the term for which you
            paid. <strong>No refunds will be granted for cancellations</strong> except where
            required by Australian Consumer Law (e.g., a material technical failure that prevented
            you from using the Services). You will be automatically switched to the free tier
            unless you opt to delete your account entirely, in which case your data will be
            handled in accordance with the <Link href="/privacy">Privacy Policy</Link>.
          </p>

          <h2>5. Use of the Services and Your Content</h2>
          <p>
            <strong>Right to use.</strong> You may access the Services, and we grant you a
            non-exclusive right to use them in accordance with these Terms. You will comply with
            these Terms and all applicable laws when using the Services. We and our affiliates own
            all rights, title, and interest in and to the Services and their features.
          </p>
          <p>
            <strong>AI providers.</strong> Mostly Medicine utilises Anthropic&apos;s Claude API
            for AI-generated content (patient simulations, examiner feedback, content explanations)
            and Groq&apos;s Whisper API for voice-to-text transcription. Anthropic&apos;s usage
            policies are available at{" "}
            <a href="https://www.anthropic.com/legal" target="_blank" rel="noopener noreferrer">
              anthropic.com/legal
            </a>{" "}
            and apply to AI-generated outputs delivered through the Services. If a conflict arises
            between an AI provider&apos;s policies and our policies, these Terms apply between you
            and Mostly Medicine.
          </p>
          <p>
            <strong>Your content.</strong> You may provide an input (&quot;<strong>Input</strong>&quot;)
            to the Platform — for example, a question asked during AI RolePlay, a note uploaded to
            your library, or a piece of clinical reasoning typed into the Ask-AI feature — and
            receive an output (&quot;<strong>Output</strong>&quot;). The Input and Output are
            collectively referred to as the &quot;<strong>Content</strong>&quot;. Between the
            parties, and to the extent permitted by applicable law, you own all Inputs. Subject
            to your compliance with these Terms, Mostly Medicine hereby assigns to you all its
            rights, title, and interest in and to the Output, with the exception of any AMC
            Handbook scenario data, AI examiner rubrics, MCQ banks, or other proprietary scaffolding
            that powers the Services. You are responsible for the Content, including ensuring that
            it does not violate any applicable laws or these Terms. This includes but is not
            limited to:
          </p>
          <ul>
            <li>
              <strong>Patient health information.</strong> You must not enter identifiable patient
              information from your real clinical practice as Input. The Services are not
              certified for storage of clinical patient records and you may breach your
              professional obligations under AHPRA and the Privacy Act 1988 (Cth) by doing so.
            </li>
            <li>
              <strong>Copyright material.</strong> Copyrighted material should not be entered as
              Input if you are not entitled to that material.
            </li>
            <li>
              <strong>Institutional policies.</strong> It is your responsibility not to use the
              Output in a manner that violates your educational institution&apos;s or
              employer&apos;s policies.
            </li>
          </ul>
          <p>
            <strong>Output disclaimer.</strong> Mostly Medicine does not and cannot guarantee the
            quality, accuracy, reliability, effectiveness, safety, legality, or security of
            AI-generated Outputs, whether in textual, voice, or visual form. You acknowledge that
            the Services and AI technology may generate the same or similar Outputs for other
            users. AI technology is subject to inherent limitations and biases, and any Outputs
            generated should be considered recommendations only. You expressly acknowledge and
            agree that Mostly Medicine is not responsible for the results or outcomes of any
            decisions made based on your use of the Platform, including AMC exam outcomes and
            clinical decisions.
          </p>

          <h2>6. Intellectual Property Rights</h2>
          <p>
            Mostly Medicine and its licensors are the sole and exclusive owners of the Services.
            The Services include our website, the content of the Services (including any text,
            audio, video, graphics, charts, photographs, interfaces, icons, software, computer
            code, databases, trademarks, logos, slogans, names of products, documentation, other
            components, and content), and the design, selection, and arrangement of the content
            on the Services.
          </p>
          <p>
            The Services are protected by copyright, trademark, and other intellectual property
            laws. Any unauthorised use of the Services or the related intellectual property rights
            belonging to Mostly Medicine, or any third party, is strictly prohibited. The Services
            may contain references to third-party marks and copies of third-party copyrighted
            materials, which are the property of their respective owners. &quot;AMC&quot;,
            &quot;Australian Medical Council&quot;, &quot;MCAT&quot;, and related marks are
            trademarks of their respective owners; Mostly Medicine is an independent third-party
            study platform and is not affiliated with, endorsed by, or sponsored by the Australian
            Medical Council or AHPRA.
          </p>
          <p>
            Unless otherwise noted, &quot;Mostly Medicine&quot; and the Mostly Medicine graphics,
            logos, icons, and service marks are trademarks of Mostly Medicine. Mostly Medicine
            trademarks may not be used without our express written consent and must not be used in
            a manner that disparages or discredits Mostly Medicine, causes confusion among
            customers, or associates with any products or Services not provided by Mostly Medicine.
          </p>
          <p>
            Access to the Services does not confer and shall not constitute a licence to anyone to
            use Mostly Medicine&apos;s or any third party&apos;s intellectual property rights.
          </p>

          <h2>7. Accounts</h2>
          <p>
            Certain features of the Services may require you to create an account with us
            (&quot;<strong>Account</strong>&quot;). These Terms govern the creation and use of
            your Account. You agree that any Personal Information you provide in connection with
            your Account will be accurate, current, and complete. When you create an Account, you
            will be asked to choose a password, which you must keep confidential. You are
            responsible for all activities that occur under your Account. If you believe that your
            Account has been compromised, you must immediately notify us at
            hello@mostlymedicine.com.
          </p>

          <h2>8. Compliance with Laws</h2>
          <p>
            When you use the Services, you are responsible for complying with all applicable laws,
            rules, and regulations, including our Acceptable Use Policy set forth in these Terms,
            and any obligations under AHPRA, the Medical Board of Australia, and your relevant
            health professional regulator.
          </p>

          <h2>9. Acceptable Use Policy</h2>
          <p>You agree that you will not:</p>
          <ol type="a">
            <li>
              Download, copy, reproduce, display, duplicate, sell, publish, post, licence, rent,
              distribute, modify, translate, adapt, or create derivative works of the Services.
            </li>
            <li>
              Use the Services for unlawful purposes.
            </li>
            <li>
              Provide us with false, inaccurate, or incomplete information when you use the
              Services.
            </li>
            <li>
              Submit inaccurate, incomplete, or out-of-date data via the Services, commit fraud or
              falsify data in connection with your use of the Services, or act maliciously against
              the business interests or reputation of Mostly Medicine or its affiliates.
            </li>
            <li>
              Engage in data mining, data scraping, or similar data-gathering activities or
              retrieve data or other content from the Services. You will not access, use, or copy
              any portion of the Services, including any of its content, through the use of
              indexing agents, spiders, scrapers, bots, web crawlers, or other automated devices
              or mechanisms.
            </li>
            <li>
              Collect or store information about users of the Services in any manner.
            </li>
            <li>
              Use the Services to post, transmit, upload, or otherwise provide any software code,
              data, or materials that contain viruses or malware.
            </li>
            <li>
              Use the Services to develop, train, or improve any AI or machine-learning models.
            </li>
            <li>
              Reverse-engineer, decompile, disassemble, or otherwise attempt to discover the
              underlying source code, algorithms, or structure of any technology or Services
              provided by Mostly Medicine.
            </li>
            <li>
              Engage in activities designed to render the Services, an Account, or any associated
              computer systems inoperable, or to make their use more difficult.
            </li>
            <li>
              Attempt to gain unauthorised access to the Services, an Account, or any associated
              computer systems.
            </li>
            <li>
              Use the Services in a manner that is contrary to the purposes for which they were
              made available to you, including using AMC Peer RolePlay to harass, defame, or
              impersonate other candidates.
            </li>
          </ol>

          <h2>10. User-Generated Content</h2>
          <p>
            You may be able to post specific reviews, comments, notes, scenarios, or other
            materials (collectively, &quot;<strong>User-Generated Content</strong>&quot;) in
            connection with your use of the Services. You grant Mostly Medicine the right to use
            your username, real name, image, likeness, or other identifying information in
            connection with any use of your User-Generated Content. By submitting User-Generated
            Content or other information to Mostly Medicine, you represent and warrant that you
            own or have all legal rights to submit the User-Generated Content and that you will
            comply with our Acceptable Use Policy.
          </p>

          <h2>11. User-Generated Content Disclaimer</h2>
          <p>
            The User-Generated Content represents the views of the user and may not represent the
            views of Mostly Medicine. We do not endorse User-Generated Content. We cannot confirm
            the accuracy or credibility of any User-Generated Content, and we will not be liable
            to you or any third party for any actions you may take as a result of reading
            User-Generated Content. While we prohibit certain User-Generated Content, some people
            may find such content offensive, objectionable, harmful, inaccurate, or deceptive.
          </p>

          <h2>12. Feedback</h2>
          <p>
            Mostly Medicine welcomes comments regarding the Services. If you submit comments or
            feedback regarding the Services to us, they will not be considered or treated as
            confidential. We may use any comments and feedback that you send us at our discretion
            and without attribution or compensation to you. To the fullest extent allowed by law,
            you grant us an unrestricted, royalty-free, worldwide, irrevocable licence to use,
            reproduce, display, perform, modify, transmit, and distribute such feedback in any
            manner, including in connection with our operations.
          </p>

          <h2>13. Live Peer RolePlay Sessions</h2>
          <p>
            AMC Peer RolePlay matches you with another candidate over real-time video. Both
            parties consent to being recorded only insofar as transcripts are persisted for
            examiner feedback; video and audio streams are <strong>not recorded</strong>. Treat
            your partner with professional courtesy. We may suspend Accounts that misuse this
            feature.
          </p>

          <h2>14. Service Availability</h2>
          <p>
            The Services or your Account may be unavailable or limited for various reasons. We
            shall not be liable to you or to any third party for any such unavailability of the
            Services, including without limitation (a) hardware, software, server, network, or
            telecommunications failures; (b) severe weather, war, riot, act of God, pandemics,
            quarantines, fire, earthquake, strike, and labour shortages; (c) regulatory
            restrictions and other acts of government; (d) interruptions due to utility and power
            companies; and (e) interruptions due to hacking or other malicious intrusion.
          </p>

          <h2>15. Disclaimer of Warranties</h2>
          <p>
            The Services are provided to you on an &quot;as is&quot; and &quot;as available&quot;
            basis. To the maximum extent permitted by applicable law, Mostly Medicine expressly
            disclaims all express or implied warranties of any kind with respect to the Services,
            including but not limited to the implied warranties of merchantability, fitness for a
            particular purpose, title, non-infringement, course of dealing or usage in trade.
          </p>
          <p>
            Mostly Medicine does not warrant or guarantee that the Services will meet your needs,
            be compatible with any standards or user requirements, that the availability of the
            Services will be uninterrupted or error-free, that any defects in the Services will be
            corrected, or that the Services are free of viruses or other harmful conditions or
            components. Your use of the Services is at your own risk, and you, alone, are
            responsible for any damage to your computer hardware, software, systems, and networks
            from using the Services. Nothing in these Terms excludes, restricts, or modifies any
            guarantee, condition, warranty, right, or remedy that you may have under the
            Australian Consumer Law that cannot be excluded, restricted, or modified by agreement.
          </p>

          <h2>16. Limitation of Liability</h2>
          <p>
            You understand and agree that any liability Mostly Medicine, its employees, officers,
            directors, agents, service providers, or professional advisers
            (&quot;<strong>Agents</strong>&quot;) have to you in connection with these Terms,
            under any cause of action or theory, is strictly limited to, in aggregate for all
            violations, the amount you paid us in the 12 months preceding the claim, or AUD $100,
            whichever is greater. Without limiting the previous sentence, in no event shall we or
            any of our Agents be liable to you for any indirect, special, incidental,
            consequential, punitive, or exemplary damages arising out of or in connection with
            these Terms.
          </p>
          <p>
            The above limitations apply whether the alleged liability is based on contract, tort,
            negligence, strict liability, or any other basis, resulting from (1) the use of, or
            the inability to use, the Services; (2) the use of, or the inability to use, items
            purchased on the Services; or (3) the cost of procurement of substitute Services or
            items, even if we or our Agents have been advised of the possibility of such damages.
            Nothing in these Terms excludes liability that cannot be excluded under the Australian
            Consumer Law.
          </p>

          <h2>17. Indemnification</h2>
          <p>
            EXCEPT AS PROHIBITED BY APPLICABLE LAW, YOU AGREE TO INDEMNIFY, DEFEND AND HOLD
            HARMLESS MOSTLY MEDICINE AND OUR AGENTS FROM AND AGAINST ALL CLAIMS, DEMANDS,
            COMPLAINTS, ALLEGATIONS, OR ACTIONS (&quot;<strong>CLAIMS</strong>&quot;) AND AGREE TO
            PAY ANY LOSSES, LIABILITIES, DAMAGES, JUDGMENTS, SETTLEMENTS, FINES, PENALTIES,
            EXPENSES, AND COSTS (INCLUDING REASONABLE LEGAL FEES) ARISING OUT OF OR RELATED TO:
            (A) YOUR ACCESS TO, USE OF, OR MISUSE OF THE SERVICES OR USER-GENERATED CONTENT; (B)
            YOUR VIOLATION OF ANY APPLICABLE LAWS WHEN ACCESSING OR USING THE SERVICES OR
            USER-GENERATED CONTENT; (C) YOUR SUBMISSION OF USER-GENERATED CONTENT; (D) YOUR
            MISUSE OF ANOTHER PERSON&apos;S PERSONAL INFORMATION; (E) YOUR INFRINGEMENT OR
            MISAPPROPRIATION OF MOSTLY MEDICINE OR ANY THIRD PARTY&apos;S INTELLECTUAL PROPERTY
            RIGHTS; OR (F) YOUR VIOLATION OF THESE TERMS.
          </p>

          <h2>18. Dispute Resolution</h2>
          <p>
            <strong>Good-faith negotiations.</strong> We always prefer to resolve disputes by
            negotiating in good faith. Either party may attempt to resolve a Dispute through
            good-faith negotiations. In the event of a Dispute, each party shall first send
            written notice of the Dispute to hello@mostlymedicine.com, which includes your name,
            email address, and a description of the relief you are seeking
            (&quot;<strong>Dispute Notice</strong>&quot;). Within 30 days after delivery of the
            Dispute Notice, the parties shall meet virtually at a mutually acceptable date and
            time. If the Parties cannot resolve the Dispute within 60 days of the Dispute Notice,
            either party may pursue the matter as outlined in this section.
          </p>
          <p>
            <strong>Small claims.</strong> Notwithstanding the foregoing, any dispute falling
            within the jurisdictional scope and amount of an appropriate Australian small claims
            tribunal (such as NCAT&apos;s Consumer and Commercial Division in New South Wales)
            may be brought in that tribunal on an individual basis.
          </p>
          <p>
            <strong>Injunctive relief.</strong> Either party may seek injunctive or other
            equitable relief in a court of competent jurisdiction to prevent the actual or
            threatened infringement, misappropriation, or violation of intellectual property
            rights.
          </p>

          <h2>19. Governing Law</h2>
          <p>
            Except for (a) claims subject to small claims tribunal proceedings or (b) claims
            seeking injunctive relief, these Terms are governed by the laws of New South Wales,
            Australia. Disputes will be resolved in the courts of Sydney, Australia, unless
            mandatory consumer-protection laws (including the Australian Consumer Law) in your
            jurisdiction provide otherwise. Any cause of action or other claim with respect to
            the Services must be commenced within one year after the cause of action or claim
            arises, except where Australian law mandates a longer limitation period.
          </p>

          <h2>20. Third-Party Links</h2>
          <p>
            Links to third-party websites from the website are provided solely for your
            convenience. Mostly Medicine has not reviewed each site for its content and does not
            endorse or make any representations about them or the information, products,
            materials, or software that may be obtained by using them. If you decide to access any
            third-party website, you do so at your own risk, and Mostly Medicine shall have no
            liability arising out of the operation or content of such third-party sites.
          </p>

          <h2>21. Cooperation with Law Enforcement</h2>
          <p>
            Mostly Medicine will cooperate with law enforcement if you are suspected of having
            violated applicable laws in connection with your use of the Services. YOU WAIVE AND
            HOLD MOSTLY MEDICINE AND OUR AGENTS HARMLESS FOR ANY COOPERATION WITH, OR DISCLOSURE
            OF YOUR INFORMATION TO, LAW ENFORCEMENT RELATING TO YOUR SUSPECTED VIOLATION OF
            APPLICABLE LAWS.
          </p>

          <h2>22. Electronic Communications</h2>
          <p>
            We use email and electronic means to stay in touch with users of our Services. You
            consent to receive communications from us in electronic form via the email address you
            submit upon registration or via the Services and further agree that all Terms,
            agreements, notices, disclosures, and other communications we provide to you
            electronically satisfy any legal requirement that such communications would satisfy if
            they were in writing.
          </p>

          <h2>23. Notice for International Users</h2>
          <p>
            The Platform is controlled, operated, and administered by Mostly Medicine from its
            base in Australia. Mostly Medicine makes no representation that materials on the
            Platform are appropriate or available for use at locations outside of Australia. If
            you access the Platform from locations outside of Australia, you are responsible for
            compliance with all local laws.
          </p>

          <h2>24. Termination</h2>
          <p>
            You can delete your Account at any time from the dashboard or by contacting us. We may
            suspend or terminate Accounts that violate these Terms, with reasonable notice where
            possible. After termination, you lose access to paid features and your data may be
            deleted within 30 days (subject to legal retention requirements). Mostly Medicine
            shall not be liable to you or anyone else for any damages arising from or related to
            the suspension or termination of your Account, or in the event Mostly Medicine
            modifies, discontinues, or restricts the availability of the Services or your Account
            (in whole or in part).
          </p>

          <h2>25. Miscellaneous</h2>
          <ul>
            <li>
              <strong>Assignment.</strong> We may assign our rights and delegate our duties under
              these Terms at any time to any party without notice to you. You may not assign your
              rights or delegate your duties under these Terms without our prior written consent,
              and any such assignment is immediately void.
            </li>
            <li>
              <strong>No third-party beneficiaries.</strong> These Terms do not confer any rights,
              remedies, or benefits upon any person other than you and Mostly Medicine.
            </li>
            <li>
              <strong>Entire agreement.</strong> These Terms (including all terms and conditions
              referenced herein, including the <Link href="/privacy">Privacy Policy</Link>) are
              the entire agreement between you and Mostly Medicine with respect to your access to
              and use of the Services.
            </li>
            <li>
              <strong>No waiver.</strong> Our failure to enforce any provision of these Terms will
              not constitute a waiver of that provision or any other provision. Any waiver of any
              provision of these Terms will be effective only if in writing and signed by Mostly
              Medicine.
            </li>
            <li>
              <strong>Severability.</strong> If any provision of these Terms is held invalid,
              void, or unenforceable, that provision will be severed from the remaining
              provisions, and the remaining provisions will remain in full force and effect.
            </li>
            <li>
              <strong>Successors and assigns.</strong> These Terms are to the benefit of Mostly
              Medicine, its successors, and assigns.
            </li>
            <li>
              <strong>Survival.</strong> Any provisions of these Terms that are meant to survive
              termination (including provisions regarding indemnification, limitation of
              liability, or dispute resolution) will remain in effect beyond any termination of
              these Terms, your Account, or your access to or use of the Services.
            </li>
            <li>
              <strong>Electronic documents.</strong> These Terms and any other documentation,
              agreements, notices, or communications between you and Mostly Medicine may be
              provided to you electronically to the extent permissible by law. Please print or
              otherwise save a copy of all documentation, agreements, notices, and other
              communications for your reference.
            </li>
          </ul>

          <h2>26. Contact Us</h2>
          <p>
            If you do not understand any of the Terms or if you have any questions or comments, we
            invite you to contact us at{" "}
            <a href="mailto:hello@mostlymedicine.com">hello@mostlymedicine.com</a>.
          </p>

          <p className="mt-8 text-xs text-gray-500">
            Mostly Medicine — built by IMGs and IT professionals who walked the AMC pathway.
            For International Medical Graduates, by people who have lived the journey.
          </p>
        </div>
      </div>
    </div>
  );
}
