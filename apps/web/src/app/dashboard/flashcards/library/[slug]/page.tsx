import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FlashcardSession } from "../../cardiology/FlashcardSession";
import type { Flashcard } from "@mostly-medicine/content";

const KNOWN_DOMAINS = new Set([
  "history",
  "ddx",
  "mgmt",
  "safety_net",
  "communication",
  "investigations",
  "knowledge",
]);
const KNOWN_AMC_PARTS = new Set(["part_1", "part_2_clinical", "both"]);

// Decode the base64url slug emitted by /api/flashcards/my-library:
// `${source}|${deckName}`. If decoding fails, treat the slug as a
// plain deck name with no source filter.
function decodeSlug(slug: string): { source: string | null; deckName: string } {
  try {
    const raw = Buffer.from(slug, "base64url").toString("utf-8");
    const [source, ...rest] = raw.split("|");
    const deckName = rest.join("|") || source;
    if (rest.length === 0) {
      return { source: null, deckName: source };
    }
    return { source, deckName };
  } catch {
    return { source: null, deckName: decodeURIComponent(slug) };
  }
}

// Lift user_flashcards rows into the shared Flashcard shape that
// FlashcardSession consumes. Tags are an unordered array (the save
// path packs subtopic / citation / domain / amc_part into it), so we
// recognise the domain + amc_part entries by value and treat the
// remainder as subtopic + citation candidates.
interface UserFlashcardRow {
  id: string;
  source: string | null;
  source_deck_name: string | null;
  front_md: string;
  back_md: string | null;
  cloze_text: string | null;
  tags: string[] | null;
  card_type: string | null;
}

function rowToFlashcard(row: UserFlashcardRow): Flashcard {
  const tags = row.tags ?? [];
  const domain = tags.find((t) => KNOWN_DOMAINS.has(t));
  const amcPart = tags.find((t) => KNOWN_AMC_PARTS.has(t));
  const otherTags = tags.filter((t) => t !== domain && t !== amcPart);
  // Heuristic: the citation entry usually contains a "·" separator,
  // matching the Murtagh · eTG · RACGP style we use everywhere. Fall
  // back to the longest non-subtopic tag.
  const citation = otherTags.find((t) => t.includes("·")) ?? otherTags[1] ?? "";
  const subtopic = otherTags.find((t) => t !== citation) ?? "";
  return {
    id: row.id,
    specialty: row.source ?? "manual",
    subtopic,
    front_md: row.front_md,
    back_md: row.back_md ?? "",
    citation,
    mark_sheet_domain: (domain ?? undefined) as Flashcard["mark_sheet_domain"],
    amc_part: ((amcPart ?? "both") as Flashcard["amc_part"]),
    ai_generated: (row.source ?? "").startsWith("ai_"),
  };
}

export const metadata = {
  title: "Your library deck · Mostly Medicine",
};

export default async function UserLibraryDeckPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const { source, deckName } = decodeSlug(slug);

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login?next=/dashboard/flashcards");
  }

  let query = supabase
    .from("user_flashcards")
    .select("id, source, source_deck_name, front_md, back_md, cloze_text, tags, card_type")
    .eq("user_id", user.id)
    .eq("source_deck_name", deckName)
    .order("created_at", { ascending: true });
  if (source) {
    query = query.eq("source", source);
  }

  const { data, error } = await query;
  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center text-rose-700">
        Failed to load deck: {error.message}
      </div>
    );
  }

  const cards = (data ?? []).map(rowToFlashcard);

  if (cards.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center text-gray-600">
        <p>No cards found in &ldquo;{deckName}&rdquo;.</p>
        <a
          href="/dashboard/flashcards"
          className="mt-4 inline-block text-sm font-semibold text-saffron-700 hover:underline"
        >
          ← Back to flashcards
        </a>
      </div>
    );
  }

  return <FlashcardSession cards={cards} deckName={deckName} />;
}
