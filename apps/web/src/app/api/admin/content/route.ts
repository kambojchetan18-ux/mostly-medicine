import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `You are a social media content creator for MostlyMedicine — an AMC exam prep platform for International Medical Graduates (IMGs) in Australia.

Built by Dr. Amandeep Kamboj (IMG herself, co-founder) and her husband Chetan (tech co-founder).
Key features: CAT 1 MCQ practice, CAT 2 AI-powered roleplay scenarios.
Website: mostlymedicine.com. Mobile app coming soon.

Voice: Authentic, warm, doctor-to-doctor. Real struggles, real empathy. Never salesy.
Target: IMGs preparing for AMC CAT 1 and CAT 2 exams in Australia.`;

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized", status: 401, supabase: null };
  const { data: profile } = await supabase.from("user_profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return { error: "Forbidden", status: 403, supabase: null };
  return { error: null, status: 200, supabase };
}

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month") || new Date().toISOString().slice(0, 7);
  const [year, mon] = month.split("-").map(Number);
  const lastDay = new Date(year, mon, 0).getDate();

  const { data, error } = await auth.supabase!
    .from("content_posts")
    .select("*")
    .gte("post_date", `${month}-01`)
    .lte("post_date", `${month}-${lastDay}`)
    .order("post_date", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ posts: data });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { month, regenerate = false } = await req.json();
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json({ error: "Invalid month format. Use YYYY-MM" }, { status: 400 });
  }

  const [year, mon] = month.split("-").map(Number);
  const lastDay = new Date(year, mon, 0).getDate();

  if (!regenerate) {
    const { data: existing } = await auth.supabase!
      .from("content_posts")
      .select("id")
      .gte("post_date", `${month}-01`)
      .lte("post_date", `${month}-${lastDay}`)
      .limit(1);
    if (existing && existing.length > 0) {
      return NextResponse.json({ error: "Posts already exist. Pass regenerate: true to overwrite." }, { status: 409 });
    }
  }

  const monthName = new Date(`${month}-01`).toLocaleString("en-AU", { month: "long", year: "numeric" });

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Generate a social media content calendar for ${monthName} for MostlyMedicine.

Return ONLY a valid JSON array. No markdown, no explanation. Each post object:
{
  "platform": "instagram" | "linkedin" | "youtube",
  "post_date": "YYYY-MM-DD",
  "post_type": "carousel" | "reel" | "static" | "text",
  "caption": "full caption text",
  "slides": [{"title": "...", "body": "..."}] (only for carousel, 4-6 slides),
  "hashtags": ["AMCExam", "IMGAustralia", ...]
}

Distribution across the month:
- instagram: 3x/week (mix of carousel, reel, static)
- linkedin: 2-3x/week (text posts, professional tone)
- youtube: 2x/month (community text posts)

Monthly theme arc:
Week 1 (days 1-7): MostlyMedicine introduction and launch
Week 2 (days 8-14): IMG struggles — paperwork, finances, isolation, recognition
Week 3 (days 15-21): CAT 1 prep — MCQ format, reasoning vs recall, strategies
Week 4 (days 22-28): CAT 2 prep — roleplay anxiety, communication, AI practice
Days 29+: Community, feedback, mobile app teaser

Captions max 250 words. Authentic, not salesy. Hashtags max 10.
Spread posts evenly, only on weekdays (Mon-Fri) preferred.`
      }
    ]
  });

  let posts: Record<string, unknown>[];
  try {
    const text = response.content[0].type === "text" ? response.content[0].text : "";
    posts = JSON.parse(text);
    if (!Array.isArray(posts)) throw new Error("Not an array");
  } catch {
    return NextResponse.json({ error: "AI returned invalid JSON. Try again." }, { status: 500 });
  }

  if (regenerate) {
    await auth.supabase!
      .from("content_posts")
      .delete()
      .gte("post_date", `${month}-01`)
      .lte("post_date", `${month}-${lastDay}`);
  }

  const toInsert = posts.map((p) => ({
    platform: p.platform as string,
    post_date: p.post_date as string,
    post_type: (p.post_type as string) || "text",
    caption: (p.caption as string) || "",
    slides: p.slides || null,
    hashtags: (p.hashtags as string[]) || [],
    status: "draft",
  }));

  const { data: inserted, error: insertError } = await auth.supabase!
    .from("content_posts")
    .insert(toInsert)
    .select();

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });
  return NextResponse.json({ posts: inserted, count: inserted?.length });
}
