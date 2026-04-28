import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

async function postToLinkedIn(caption: string, hashtags: string[]) {
  const token = process.env.LINKEDIN_ACCESS_TOKEN;
  const personId = process.env.LINKEDIN_PERSON_ID;
  if (!token || !personId) throw new Error("LinkedIn not configured. Add LINKEDIN_ACCESS_TOKEN and LINKEDIN_PERSON_ID to env.");

  const tags = hashtags.map(h => (h.startsWith("#") ? h : `#${h}`)).join(" ");
  const fullText = tags ? `${caption}\n\n${tags}` : caption;

  const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      author: `urn:li:person:${personId}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: fullText },
          shareMediaCategory: "NONE",
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    }),
  });

  if (!res.ok) throw new Error(`LinkedIn error: ${await res.text()}`);
  return await res.json();
}

async function postToInstagram(caption: string, hashtags: string[]) {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const igUserId = process.env.INSTAGRAM_USER_ID;
  const imageUrl = process.env.INSTAGRAM_DEFAULT_IMAGE_URL;
  if (!token || !igUserId) throw new Error("Instagram not configured. Add INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_USER_ID to env.");
  if (!imageUrl) throw new Error("Add INSTAGRAM_DEFAULT_IMAGE_URL (a branded image URL) to env.");

  const tags = hashtags.map(h => (h.startsWith("#") ? h : `#${h}`)).join(" ");
  const fullCaption = tags ? `${caption}\n\n${tags}` : caption;

  const createRes = await fetch(
    `https://graph.facebook.com/v18.0/${igUserId}/media`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_url: imageUrl, caption: fullCaption, access_token: token }),
    }
  );
  if (!createRes.ok) throw new Error(`Instagram media create failed: ${await createRes.text()}`);
  const { id: creationId } = await createRes.json();

  const publishRes = await fetch(
    `https://graph.facebook.com/v18.0/${igUserId}/media_publish`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creation_id: creationId, access_token: token }),
    }
  );
  if (!publishRes.ok) throw new Error(`Instagram publish failed: ${await publishRes.text()}`);
  return await publishRes.json();
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("user_profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { data: post, error: fetchErr } = await supabase
    .from("content_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchErr || !post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
  if (post.status === "posted") return NextResponse.json({ error: "Already posted" }, { status: 400 });
  if (post.status !== "approved") return NextResponse.json({ error: "Approve the post before publishing" }, { status: 400 });

  try {
    if (post.platform === "linkedin") {
      await postToLinkedIn(post.caption, post.hashtags || []);
    } else if (post.platform === "instagram") {
      await postToInstagram(post.caption, post.hashtags || []);
    } else {
      return NextResponse.json(
        { error: "YouTube auto-post not supported — copy the caption and post via YouTube Studio." },
        { status: 400 }
      );
    }

    await supabase
      .from("content_posts")
      .update({ status: "posted", posted_at: new Date().toISOString() })
      .eq("id", id);

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[content/publish]", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Publish failed" }, { status: 500 });
  }
}
