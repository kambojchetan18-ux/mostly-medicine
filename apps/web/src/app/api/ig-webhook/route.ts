import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { RMO_POOLS, type RmoPool } from "@mostly-medicine/content";

// Instagram comment -> Private Reply DM webhook. Replaces the expired
// ManyChat subscription on @mostlymedicine.
//
// Flow:
//   1. Meta posts a `comments` change event to this endpoint.
//   2. We verify `x-hub-signature-256` against IG_APP_SECRET.
//   3. For each comment we look up ig_keyword_links by lowercase substring
//      match; if a row is active, we POST to graph.facebook.com/v19.0/me/messages
//      with `recipient: { comment_id }` (the Private Reply pattern — valid
//      for 7 days after the comment is posted).
//   4. ACK 200 to Meta either way, so they don't retry-storm us.
//
// Required env vars:
//   IG_VERIFY_TOKEN          — arbitrary string we share with Meta during
//                              the GET handshake.
//   IG_APP_SECRET            — Facebook App's "App Secret" used for HMAC.
//   IG_PAGE_ACCESS_TOKEN     — long-lived Page access token with the
//                              `instagram_manage_messages` scope.
//   NEXT_PUBLIC_SUPABASE_URL — used by the service-role client.
//   SUPABASE_SERVICE_ROLE_KEY — server-only key; bypasses RLS for the lookup.
//
// Runtime: Node (we need `node:crypto` for HMAC and the service-role client
// works fine without Edge optimisations).

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ─── Types ────────────────────────────────────────────────────────────────

interface IgCommentFrom {
  id: string;
  username?: string;
}

interface IgCommentValue {
  id: string;
  text?: string;
  from?: IgCommentFrom;
  media?: { id?: string };
}

interface IgChange {
  field: string;
  value: IgCommentValue;
}

interface IgEntry {
  id: string;
  time?: number;
  changes?: IgChange[];
}

interface IgWebhookPayload {
  object?: string;
  entry?: IgEntry[];
}

interface KeywordLinkRow {
  keyword: string;
  link: string;
  message: string | null;
  reel_id: string | null;
  active: boolean;
}

// ─── Service-role Supabase client ─────────────────────────────────────────

function service() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();
  return createServiceClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// ─── GET: Meta verification handshake ─────────────────────────────────────

export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  const expected = process.env.IG_VERIFY_TOKEN;
  if (mode === "subscribe" && expected && token === expected && challenge) {
    // Meta wants the raw challenge string echoed back as text.
    return new Response(challenge, {
      status: 200,
      headers: { "content-type": "text/plain" },
    });
  }
  return new Response("forbidden", { status: 403 });
}

// ─── HMAC signature verification ──────────────────────────────────────────

function verifySignature(raw: string, header: string | null): boolean {
  const secret = process.env.IG_APP_SECRET;
  if (!secret || !header) return false;
  // Meta sends header as "sha256=<hex>".
  const expected =
    "sha256=" + createHmac("sha256", secret).update(raw, "utf8").digest("hex");
  // timingSafeEqual requires equal-length buffers, otherwise it throws.
  const a = Buffer.from(header);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

// ─── PATHWAY message composer ─────────────────────────────────────────────

function composePathwayMessage(prefix: string, link: string): string {
  const lines: string[] = [prefix, ""];
  for (const p of RMO_POOLS as RmoPool[]) {
    lines.push(`${p.code} — ${p.applyLabel}: ${p.applyUrl}`);
  }
  lines.push("");
  lines.push(`Full guide: ${link}`);
  return lines.join("\n");
}

// ─── Instagram Send API ───────────────────────────────────────────────────

async function sendPrivateReply(commentId: string, text: string): Promise<void> {
  const token = process.env.IG_PAGE_ACCESS_TOKEN;
  if (!token) {
    console.error("[ig-webhook] IG_PAGE_ACCESS_TOKEN missing");
    return;
  }
  const endpoint = `https://graph.facebook.com/v19.0/me/messages?access_token=${encodeURIComponent(token)}`;
  const body = {
    recipient: { comment_id: commentId },
    message: { text },
  };
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error("[ig-webhook] send failed", res.status, errText);
    }
  } catch (err) {
    console.error("[ig-webhook] send error", err);
  }
}

// ─── Keyword lookup ───────────────────────────────────────────────────────

async function findKeywordMatch(
  text: string,
  mediaId: string | undefined
): Promise<KeywordLinkRow | null> {
  const lower = text.toLowerCase();
  const sb = service();
  // We pull active rows + filter in JS — the table is small (handful of
  // keywords) and substring matching via SQL ILIKE %text% would actually be
  // "does keyword contain comment text", which is the inverse of what we
  // need. We need: does the comment text contain a keyword?
  const { data, error } = await sb
    .from("ig_keyword_links")
    .select("keyword, link, message, reel_id, active")
    .eq("active", true);
  if (error || !data) {
    if (error) console.error("[ig-webhook] db error", error.message);
    return null;
  }
  const rows = data as KeywordLinkRow[];
  for (const row of rows) {
    const kw = row.keyword.toLowerCase();
    if (!kw) continue;
    if (!lower.includes(kw)) continue;
    if (row.reel_id && row.reel_id !== mediaId) continue;
    return row;
  }
  return null;
}

// ─── POST: receive comment events ─────────────────────────────────────────

export async function POST(req: Request) {
  const raw = await req.text();
  const sig = req.headers.get("x-hub-signature-256");

  if (!verifySignature(raw, sig)) {
    return NextResponse.json({ error: "bad signature" }, { status: 401 });
  }

  let payload: IgWebhookPayload;
  try {
    payload = JSON.parse(raw) as IgWebhookPayload;
  } catch {
    // Still ACK so Meta doesn't retry; just log.
    console.error("[ig-webhook] invalid JSON");
    return NextResponse.json({ ok: true });
  }

  const entries = payload.entry ?? [];
  for (const entry of entries) {
    const changes = entry.changes ?? [];
    for (const change of changes) {
      if (change.field !== "comments") continue;
      const value = change.value;
      if (!value || !value.id) continue;

      const commentId = value.id;
      const text = (value.text ?? "").trim();
      if (!text) continue;
      const mediaId = value.media?.id;

      const match = await findKeywordMatch(text, mediaId);
      if (!match) continue;

      let messageText: string;
      const prefix = match.message ?? "Here is the link you asked for:";
      if (match.keyword.toLowerCase() === "pathway") {
        messageText = composePathwayMessage(prefix, match.link);
      } else {
        messageText = `${prefix}\n\n${match.link}`;
      }
      // Fire-and-forget would lose errors; await so logs surface on Vercel.
      await sendPrivateReply(commentId, messageText);
    }
  }

  return NextResponse.json({ ok: true });
}
