// Notification fan-out for tech-routed tickets. Both channels are gated by
// env vars — set whichever you actually use, or both for belt + suspenders.
//
//   SLACK_WEBHOOK_URL  — Slack incoming webhook (https://hooks.slack.com/...)
//   ALERT_EMAIL        — destination Gmail/Outlook to receive alerts
//   RESEND_API_KEY     — Resend API key (free 3k/mo) used to send the email
//
// All three are optional. If only Slack is set, email is skipped, and vice
// versa. If neither is set, the ticket still saves to DB; admin can see it
// at /dashboard/admin/tickets.

const ADMIN_TICKETS_URL = "https://mostlymedicine.com/dashboard/admin/tickets";

interface NotifyArgs {
  ticketId: string;
  subject: string;
  body: string;
  category: string | null;
  confidence: string | null;
  aiResponse: string | null;
  userEmail: string;
}

export async function notifyAdminOfTicket(args: NotifyArgs): Promise<void> {
  // Fire-and-forget; never block the user response on a 3rd-party hop.
  await Promise.allSettled([sendSlack(args), sendEmail(args)]);
}

async function sendSlack({
  ticketId, subject, body, category, confidence, aiResponse, userEmail,
}: NotifyArgs): Promise<void> {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) return;
  try {
    const text = `🆘 *Tech ticket needs Chetan* — ${category ?? "uncategorised"} · confidence ${confidence ?? "n/a"}`;
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        blocks: [
          { type: "header", text: { type: "plain_text", text: `🆘 ${subject}` } },
          { type: "section", fields: [
            { type: "mrkdwn", text: `*From:*\n${userEmail}` },
            { type: "mrkdwn", text: `*Category:*\n${category ?? "—"}` },
            { type: "mrkdwn", text: `*AI confidence:*\n${confidence ?? "—"}` },
            { type: "mrkdwn", text: `*Status:*\nescalated` },
          ]},
          { type: "section", text: { type: "mrkdwn", text: `*User wrote:*\n>${body.slice(0, 800).replace(/\n/g, "\n>")}` } },
          aiResponse
            ? { type: "section", text: { type: "mrkdwn", text: `*AI suggested reply:*\n>${aiResponse.slice(0, 600).replace(/\n/g, "\n>")}` } }
            : null,
          { type: "actions", elements: [
            { type: "button", text: { type: "plain_text", text: "Open in admin" }, url: `${ADMIN_TICKETS_URL}` },
            { type: "button", text: { type: "plain_text", text: "Reply via email" }, url: `mailto:${userEmail}?subject=${encodeURIComponent(`Re: ${subject}`)}` },
          ]},
        ].filter(Boolean),
      }),
    });
  } catch (err) {
    console.error("[notify/slack] failed", err);
  }
}

async function sendEmail({
  ticketId, subject, body, category, confidence, aiResponse, userEmail,
}: NotifyArgs): Promise<void> {
  const to = process.env.ALERT_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;
  if (!to || !apiKey) return;
  try {
    const html = `
      <div style="font-family: -apple-system, sans-serif; max-width: 560px;">
        <h2 style="margin: 0 0 8px;">🆘 Tech ticket — ${escape(subject)}</h2>
        <p style="color:#6b7280;font-size:13px;margin:0 0 16px;">
          From <strong>${escape(userEmail)}</strong> · ${escape(category ?? "uncategorised")} · confidence ${escape(confidence ?? "n/a")}
        </p>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:12px;margin:0 0 12px;white-space:pre-wrap;font-size:14px;color:#111827;">${escape(body)}</div>
        ${aiResponse ? `
          <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:12px;margin:0 0 12px;white-space:pre-wrap;font-size:14px;color:#1e40af;">
            <strong>AI suggested reply:</strong><br>${escape(aiResponse)}
          </div>
        ` : ""}
        <p style="margin: 16px 0 0;">
          <a href="${ADMIN_TICKETS_URL}" style="background:#1f2937;color:white;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:600;">Open in admin</a>
          <a href="mailto:${userEmail}?subject=${encodeURIComponent(`Re: ${subject}`)}" style="margin-left:8px;color:#1f2937;font-weight:600;">Reply</a>
        </p>
      </div>
    `;
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Mostly Medicine Alerts <alerts@mostlymedicine.com>",
        to,
        subject: `[Ticket] ${subject}`,
        html,
        reply_to: userEmail,
      }),
    });
  } catch (err) {
    console.error("[notify/email] failed", err);
  }
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
