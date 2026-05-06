import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { runChat } from "@mostly-medicine/ai";

// Daily LinkedIn auto-post.
//
// Picks the oldest social_posts row with linkedin_posted_at IS NULL,
// generates Amandeep-voice LinkedIn copy via runChat (DeepSeek with
// Anthropic fallback), POSTs to LinkedIn UGC API as Amandeep, and stamps
// the result. Idempotent: re-firing within the same day never double-posts
// because linkedin_posted_at is set on success.
//
// Env required (set after Amandeep's one-time OAuth):
//   LINKEDIN_ACCESS_TOKEN — OAuth bearer token (60-day expiry, refresh manually)
//   LINKEDIN_AUTHOR_URN   — Amandeep's person URN, format urn:li:person:<id>
//
// If either env is missing, the route 503s without touching anything —
// safe to deploy before Amandeep finishes OAuth setup.
//
// Auth: optional CRON_SECRET bearer.

export const maxDuration = 60;

const SYSTEM_PROMPT = `You are Dr Amandeep Kamboj — an International Medical Graduate, AMC pass-graduate, currently completing recency-of-practice in Gurugram before returning to clinical work in Sydney.

Write a single LinkedIn post about the article provided. Voice rules:
- First-person, warm, slightly informal — like writing to a fellow IMG who is two months behind you
- Empathy first: open with the felt experience of being an IMG ("if you've ever Googled X at 2am wondering if you're the only one")
- Inline jargon translation for non-medical readers — every clinical term gets a short parenthetical or "i.e." gloss
- One specific concrete detail or stat from the article (cite source briefly)
- One sentence that names what the article actually covers
- One link at the end on its own line: the article URL provided
- 220-340 words
- 5-8 hashtags at the end on a single line (e.g. #IMG #AMCExam #IMGAustralia)
- No emojis at the start, sparing emojis allowed in the body
- Never use the phrase "thrilled to announce" or other LinkedIn cliches

Output ONLY the post body — no preamble, no explanation, no markdown, no quotation marks around the post. Just the raw text.`;

interface SocialPost {
  id: string;
  article_slug: string;
  article_title: string;
  article_url: string;
}

export async function GET(req: NextRequest) {
  // Auth gate — fail closed
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
  const authorUrn = process.env.LINKEDIN_AUTHOR_URN;
  if (!accessToken || !authorUrn) {
    return NextResponse.json(
      {
        ok: false,
        error: "linkedin_not_configured",
        message: "Set LINKEDIN_ACCESS_TOKEN and LINKEDIN_AUTHOR_URN in Vercel env after completing the OAuth flow. See docs/operations/linkedin-auto-post.md.",
      },
      { status: 503 }
    );
  }

  const service = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Pick the oldest row never posted to LinkedIn.
  const { data: rows, error: queryErr } = await service
    .from("social_posts")
    .select("id, article_slug, article_title, article_url")
    .is("linkedin_posted_at", null)
    .order("created_at", { ascending: true })
    .limit(1);

  if (queryErr) {
    console.error("[publish-linkedin] query failed", queryErr);
    return NextResponse.json({ ok: false, error: queryErr.message }, { status: 500 });
  }

  const next = (rows ?? [])[0] as SocialPost | undefined;
  if (!next) {
    return NextResponse.json({ ok: true, message: "queue_empty" });
  }

  // Generate the LinkedIn post body via runChat (DeepSeek with Anthropic
  // fallback).
  const userPrompt = `Article title: ${next.article_title}
Article URL: ${next.article_url}

Write the LinkedIn post.`;

  let postBody: string;
  try {
    const result = await runChat({
      useCase: "content_draft",
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
      maxTokens: 800,
      cacheSystem: true,
      temperature: 0.55,
    });
    postBody = result.text.trim();
  } catch (err) {
    const message = err instanceof Error ? err.message : "ai_generation_failed";
    console.error("[publish-linkedin] generation failed", message);
    await service
      .from("social_posts")
      .update({
        linkedin_attempted_at: new Date().toISOString(),
        linkedin_error: `gen: ${message}`,
      })
      .eq("id", next.id);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }

  // POST to LinkedIn. The UGC Posts endpoint accepts text + an optional
  // article-share for link previews; we use the latter so the article URL
  // renders as a rich card under the post.
  const linkedInBody = {
    author: authorUrn,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: { text: postBody },
        shareMediaCategory: "ARTICLE",
        media: [
          {
            status: "READY",
            originalUrl: next.article_url,
            title: { text: next.article_title.slice(0, 200) },
            description: { text: "Mostly Medicine — AMC prep for IMGs" },
          },
        ],
      },
    },
    visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
  };

  let postUrn: string | null = null;
  try {
    const liRes = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify(linkedInBody),
    });
    if (!liRes.ok) {
      const errText = await liRes.text();
      throw new Error(`linkedin ${liRes.status}: ${errText.slice(0, 300)}`);
    }
    const liJson = (await liRes.json()) as { id?: string };
    postUrn = liJson.id ?? null;
  } catch (err) {
    const message = err instanceof Error ? err.message : "linkedin_post_failed";
    console.error("[publish-linkedin] post failed", message);
    await service
      .from("social_posts")
      .update({
        linkedin_attempted_at: new Date().toISOString(),
        linkedin_error: message,
      })
      .eq("id", next.id);
    return NextResponse.json(
      { ok: false, error: message, articleSlug: next.article_slug },
      { status: 502 }
    );
  }

  await service
    .from("social_posts")
    .update({
      linkedin_posted_at: new Date().toISOString(),
      linkedin_post_urn: postUrn,
      linkedin_error: null,
      linkedin_attempted_at: new Date().toISOString(),
    })
    .eq("id", next.id);

  return NextResponse.json({
    ok: true,
    articleSlug: next.article_slug,
    linkedinPostUrn: postUrn,
    bodyPreview: postBody.slice(0, 200),
  });
}
