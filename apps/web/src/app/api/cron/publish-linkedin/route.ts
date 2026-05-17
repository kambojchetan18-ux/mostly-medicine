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
- VARY THE OPENER. Every. Single. Post. DO NOT begin with "If you've ever..." or "If you're..." — Amandeep has explicitly flagged this as the #1 thing to break out of. Pick one of these styles, rotate so back-to-back posts feel different:
  • A specific small moment from your prep ("My alarm went off at 4:47am the day I sat Part 1.")
  • A confession or admission ("I almost skipped OET. Here's why I'm glad I didn't.")
  • A blunt myth-bust ("Pass rates by country don't mean what you think they mean.")
  • A single arresting number with no setup ("A$2,790. That's what one AMC Part 1 attempt costs.")
  • An everyday image ("There's a moment, mid-prep, when the kitchen table becomes your study desk and stays that way for nine months.")
  • A question that's not rhetorical ("How many of you have actually read the AMC examiner instructions?")
  • A line from a real conversation ("'Just do PLAB, it's easier' — every uncle, every wedding, since 2019.")
  • A direct statement of stakes ("This decision shapes the next ten years of your life. Pick carefully.")
  Keep the opener under 15 words, feel like something a real person said.
- Empathy under the surface — name a feeling, image, or moment before any statistic
- Inline jargon translation for non-medical readers — every clinical term gets a short parenthetical or "i.e." gloss
- One specific concrete detail or stat from the article (cite source briefly) — only one, integrated naturally
- One sentence that names what the article actually covers
- One link at the end on its own line: the article URL provided
- 140-200 words total — KEEP IT SHORT, Amandeep's explicit feedback
- 2-3 short paragraphs, NOT bullet-heavy
- Max 6 hashtags on the last line (e.g. #IMG #AMCExam #IMGAustralia)
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
  // Auth gate
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
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

  // Optional: ?replace=<slug> deletes the existing LinkedIn post for that
  // slug, resets the DB row, then re-runs the normal flow against that row
  // (used when an already-posted draft needs a fresh body — e.g. prompt
  // fix landed after the original post went out). Same auth gate as above.
  const url = new URL(req.url);
  const replaceSlug = url.searchParams.get("replace");

  let next: SocialPost | undefined;

  if (replaceSlug) {
    const { data: row, error: rowErr } = await service
      .from("social_posts")
      .select("id, article_slug, article_title, article_url, linkedin_post_urn")
      .eq("article_slug", replaceSlug)
      .single();
    if (rowErr || !row) {
      return NextResponse.json(
        { ok: false, error: "slug_not_found", slug: replaceSlug },
        { status: 404 }
      );
    }

    // Delete the existing LinkedIn post if a URN was stamped.
    const existingUrn = (row as { linkedin_post_urn: string | null }).linkedin_post_urn;
    if (existingUrn) {
      try {
        const delRes = await fetch(
          `https://api.linkedin.com/v2/ugcPosts/${encodeURIComponent(existingUrn)}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "X-Restli-Protocol-Version": "2.0.0",
            },
          }
        );
        if (!delRes.ok && delRes.status !== 404) {
          const errText = await delRes.text();
          console.warn(
            `[publish-linkedin] delete returned ${delRes.status} for ${existingUrn}: ${errText.slice(0, 200)}`
          );
        }
      } catch (err) {
        console.warn(
          `[publish-linkedin] delete threw for ${existingUrn}:`,
          err instanceof Error ? err.message : String(err)
        );
      }
    }

    // Reset DB so the rest of the flow treats this row as unposted.
    await service
      .from("social_posts")
      .update({
        linkedin_posted_at: null,
        linkedin_post_urn: null,
        linkedin_error: null,
      })
      .eq("id", row.id);

    next = {
      id: row.id,
      article_slug: row.article_slug,
      article_title: row.article_title,
      article_url: row.article_url,
    };
  } else {
    // Default flow: pick the oldest row never posted to LinkedIn.
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

    next = (rows ?? [])[0] as SocialPost | undefined;
    if (!next) {
      return NextResponse.json({ ok: true, message: "queue_empty" });
    }
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
