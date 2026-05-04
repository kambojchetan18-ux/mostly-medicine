// Shared email-body builders. Anything that goes inside brandedShell()
// should live here so cron / one-shot routes / signup webhooks all render
// the same copy.

export interface WelcomeEmail {
  subject: string;
  bodyHtml: string;
  preheader: string;
}

const cardStyle =
  "display:block;padding:14px 16px;margin:8px 0;border:1px solid #e5e7eb;border-radius:10px;background:#f8fafc;color:#0f172a;text-decoration:none;font-weight:600;font-size:14px;";

/**
 * Warm welcome email rendered for both:
 *  - new signups via /api/email/welcome (kicked off from /auth/callback)
 *  - existing-user backfill via /api/cron/welcome-backfill (one-shot)
 *
 * `firstName` defaults to "doctor" if the profile has no full_name.
 */
export function buildWelcomeEmail(firstName: string): WelcomeEmail {
  const safeName = firstName?.trim() ? escape(firstName.trim()) : "doctor";
  const subject = "Welcome to Mostly Medicine — your AMC prep, free to start";
  const preheader = "Your AMC prep, free to start. No credit card needed.";
  const bodyHtml = `
    <p style="margin:0 0 14px;font-size:16px;font-weight:600;">G&apos;day ${safeName},</p>
    <p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:#334155;">
      Warm welcome to Mostly Medicine. You&apos;ve just joined a community of International Medical Graduates preparing for the AMC — every feature on the platform is built around the question I keep asking my own wife (an AMC pass-graduate IMG): <em>what would actually help you study tonight?</em>
    </p>
    <p style="margin:0 0 18px;font-size:14px;line-height:1.6;color:#334155;">
      No credit card to set up, no contract, no scammy upsells. Start anywhere below — these three are where most users begin:
    </p>
    <div style="margin:18px 0;">
      <a href="https://mostlymedicine.com/amc-fee-calculator" style="${cardStyle}">
        Plan your costs &mdash; AMC Fee Calculator &rarr;
      </a>
      <a href="https://mostlymedicine.com/dashboard/cat1" style="${cardStyle}">
        Start AMC MCQs &mdash; 20 free per day &rarr;
      </a>
      <a href="https://mostlymedicine.com/dashboard/ask-ai" style="${cardStyle}">
        Ask AI &mdash; clinical Q&amp;A grounded in Murtagh / RACGP &rarr;
      </a>
    </div>
    <div style="margin:22px 0;padding:14px 16px;border-radius:10px;background:#ecfdf5;border:1px solid #a7f3d0;">
      <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#065f46;">What&apos;s free for you, every day</p>
      <ul style="margin:0;padding-left:18px;font-size:13px;line-height:1.7;color:#065f46;">
        <li>20 AMC MCQs / day</li>
        <li>1 Solo Clinical AI RolePlay / day</li>
        <li>1 AMC Handbook AI RolePlay / day</li>
        <li>Unlimited Ask AI inside the library</li>
        <li>Always-free AMC Fee Calculator + Eligibility Checker</li>
      </ul>
    </div>
    <p style="margin:18px 0 0;font-size:14px;line-height:1.6;color:#334155;">
      A daily Brain Teaser email is also on its way &mdash; one AMC clinical scenario, eight minutes of your time, AMC-rubric aligned. You can unsubscribe any time from the link at the bottom of this email.
    </p>
    <p style="margin:14px 0 0;font-size:14px;line-height:1.6;color:#334155;">
      Reply to this email if you hit a wall &mdash; it lands in my inbox.
    </p>
    <p style="margin:6px 0 0;font-size:14px;color:#0f172a;font-weight:600;">&mdash; Mostly Medicine</p>
  `;
  return { subject, bodyHtml, preheader };
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
