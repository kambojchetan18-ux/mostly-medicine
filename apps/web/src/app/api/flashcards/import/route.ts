// Anki .apkg importer. Accepts a multipart upload (field: `file`) OR JSON
// `{ url }` pointing at a public .apkg. Cap: 50 MB, 10 000 notes per import,
// 1 import per user per 60 s.
//
// .apkg ZIP layout (Anki 2.1+):
//   collection.anki21      SQLite DB  (or collection.anki2 on older decks)
//   media                  JSON: { "0": "front.png", "1": "diagram.svg", ... }
//   0, 1, 2, ...           the actual media files, numbered to match `media`
//
// The SQLite schema we care about:
//   notes   id INTEGER PK, ..., flds TEXT  -- fields joined by chr(31)
//   cards   id INTEGER PK, nid INTEGER, ..., ord INTEGER
//   The notetype (basic vs cloze) is implied by whether flds contains
//   {{c\d+::...}} cloze syntax — we just regex-detect it instead of joining
//   the `notetypes` table, which is structured differently between Anki 2.1
//   and 2.1.45+.
//
// Bucket: `flashcard-media` (private). One-time setup if it doesn't exist:
//   supabase storage create flashcard-media
// Storage paths: {user.id}/{cardId}/{filename}

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { aiRateLimit, clientKey } from "@/lib/rate-limit";
import StreamZip from "node-stream-zip";
import BetterSqlite3 from "better-sqlite3";
import { writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Anki uses ASCII 31 (Unit Separator) between fields.
const FIELD_SEP = String.fromCharCode(0x1f);

const MAX_BYTES = 50 * 1024 * 1024;   // 50 MB hard cap
const MAX_NOTES = 10_000;              // safe MVP cap; mature IMG decks ~5-15k
const INSERT_CHUNK = 100;
const BUCKET = "flashcard-media";

// Force Node runtime — better-sqlite3 + node-stream-zip + fs/tmpdir.
export const runtime = "nodejs";
// Long-running parse + upload; bump default 10s Vercel limit.
export const maxDuration = 300;

type MediaEntry = { filename: string; supabase_storage_path: string };
type CardType = "basic" | "cloze";

type ParsedNote = {
  front: string;
  back: string | null;
  cloze_text: string | null;
  card_type: CardType;
  /** Media filenames referenced in this note's fields. */
  referenced: string[];
};

/**
 * Block SSRF: reject URLs that resolve to private / loopback addresses.
 * Called before any fetch() that uses a user-supplied URL.
 */
function isPrivateUrl(urlStr: string): boolean {
  try {
    const url = new URL(urlStr);
    const hostname = url.hostname;
    if (['localhost', '127.0.0.1', '0.0.0.0', '::1', ''].includes(hostname)) return true;
    if (hostname.endsWith('.local') || hostname.endsWith('.internal')) return true;
    const parts = hostname.split('.').map(Number);
    if (parts[0] === 10) return true;
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    if (parts[0] === 192 && parts[1] === 168) return true;
    if (parts[0] === 169 && parts[1] === 254) return true;
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return true;
    return false;
  } catch { return true; }
}

const CLOZE_RE = /\{\{c\d+::[^}]+\}\}/;
// Matches src="foo.png" / src='foo.png' / [sound:audio.mp3].
const SRC_RE   = /(?:src\s*=\s*["']([^"']+)["'])|(?:\[sound:([^\]]+)\])/gi;

function extractMediaRefs(html: string): string[] {
  const out = new Set<string>();
  for (const m of html.matchAll(SRC_RE)) {
    const ref = m[1] ?? m[2];
    if (ref) out.add(ref);
  }
  return [...out];
}

function parseFields(flds: string): ParsedNote {
  const parts = flds.split(FIELD_SEP);
  const front = parts[0] ?? "";
  const back  = parts[1] ?? null;
  const isCloze = CLOZE_RE.test(front);
  const referenced = [
    ...extractMediaRefs(front),
    ...(back ? extractMediaRefs(back) : []),
  ];
  return {
    front,
    back,
    cloze_text: isCloze ? front : null,
    card_type: isCloze ? "cloze" : "basic",
    referenced: [...new Set(referenced)],
  };
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 1 import per user per 60 s — large .apkg imports are heavy on CPU + Storage.
  const rl = await aiRateLimit(clientKey(req, "fc-import", user.id), { max: 1, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "rate_limited", retryAfterMs: rl.retryAfterMs },
      { status: 429 }
    );
  }

  // Plan gate: Free = 1 Anki import per UTC day. Pro / Enterprise /
  // admin = unlimited. Free users typically only have ONE legacy
  // collection to migrate — Pro users iterate on shared decks (AnKing
  // updates, Lyonsy refresh) and need multiple imports.
  const FREE_DAILY_IMPORT_CAP = 1;
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("plan, role")
    .eq("id", user.id)
    .maybeSingle();
  const isUnlimited =
    profile?.role === "admin" ||
    profile?.plan === "pro" ||
    profile?.plan === "enterprise";
  if (!isUnlimited) {
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    const { data: importsToday } = await supabase
      .from("user_flashcards")
      .select("source_deck_name", { count: "exact" })
      .eq("user_id", user.id)
      .eq("source", "anki_apkg")
      .gte("created_at", startOfDay.toISOString());
    const distinctDecks = new Set((importsToday ?? []).map((r) => r.source_deck_name)).size;
    if (distinctDecks >= FREE_DAILY_IMPORT_CAP) {
      return NextResponse.json(
        {
          error: "daily_limit_reached",
          plan: "free",
          dailyLimit: FREE_DAILY_IMPORT_CAP,
          used: distinctDecks,
          upgrade: "Free plan: 1 Anki import per day. Upgrade to Pro for unlimited imports + AI generation + new specialty decks.",
        },
        { status: 429 }
      );
    }
  }

  // Pull the bytes out of either multipart or JSON {url}.
  let bytes: Buffer;
  let deckName: string | null = null;

  const contentType = req.headers.get("content-type") ?? "";
  try {
    if (contentType.startsWith("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("file");
      if (!(file instanceof File)) {
        return NextResponse.json({ error: "Missing `file` field" }, { status: 400 });
      }
      if (file.size > MAX_BYTES) {
        return NextResponse.json({ error: "File too large (>50 MB)" }, { status: 413 });
      }
      bytes = Buffer.from(await file.arrayBuffer());
      deckName = (file.name ?? "").replace(/\.apkg$/i, "") || null;
    } else {
      const body = await req.json().catch(() => null);
      const url: unknown = body?.url;
      if (typeof url !== "string" || !/^https?:\/\//.test(url)) {
        return NextResponse.json({ error: "Missing or invalid url" }, { status: 400 });
      }
      if (isPrivateUrl(url)) {
        return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
      }
      const res = await fetch(url);
      if (!res.ok) {
        return NextResponse.json({ error: `Fetch failed: ${res.status}` }, { status: 400 });
      }
      const len = Number(res.headers.get("content-length") ?? "0");
      if (len && len > MAX_BYTES) {
        return NextResponse.json({ error: "Remote file too large (>50 MB)" }, { status: 413 });
      }
      const ab = await res.arrayBuffer();
      if (ab.byteLength > MAX_BYTES) {
        return NextResponse.json({ error: "Remote file too large (>50 MB)" }, { status: 413 });
      }
      bytes = Buffer.from(ab);
      const last = url.split("/").pop() ?? "";
      deckName = last.replace(/\.apkg$/i, "") || null;
    }
  } catch (e) {
    return NextResponse.json(
      { error: `Read failed: ${(e as Error).message}` },
      { status: 400 }
    );
  }

  // Stage the upload + extracted media in a tmp dir; we feed the SQLite file
  // to better-sqlite3 via path, and we read media files from the same dir.
  const work = await mkdtemp(join(tmpdir(), "apkg-"));
  const apkgPath = join(work, "deck.apkg");
  try {
    await writeFile(apkgPath, bytes);

    const zip = new StreamZip.async({ file: apkgPath });
    let sqlitePath: string | null = null;
    let mediaMap: Record<string, string> = {};

    try {
      const entries = await zip.entries();
      // Anki 2.1 uses collection.anki21; legacy 2.0 uses collection.anki2.
      // Prefer the newer one when both are present.
      const sqliteName =
        Object.keys(entries).find((k) => k === "collection.anki21") ??
        Object.keys(entries).find((k) => k === "collection.anki2");
      if (!sqliteName) {
        return NextResponse.json(
          { error: "Not a valid .apkg (no collection.anki21 or collection.anki2 inside)" },
          { status: 400 }
        );
      }
      sqlitePath = join(work, "collection.sqlite");
      await zip.extract(sqliteName, sqlitePath);

      // `media` is JSON, key = numeric filename in the ZIP, value = real name.
      if (entries["media"]) {
        const mediaBuf = await zip.entryData("media");
        try {
          mediaMap = JSON.parse(mediaBuf.toString("utf8")) as Record<string, string>;
        } catch {
          mediaMap = {};
        }
      }

      // Extract any media files we'll later upload to Storage. We do this
      // up-front while the ZIP handle is open; uploads happen after we close
      // it so we don't hold the file descriptor through network calls.
      for (const key of Object.keys(mediaMap)) {
        if (entries[key]) {
          await zip.extract(key, join(work, key));
        }
      }
    } finally {
      await zip.close();
    }

    // Read notes + classify card types.
    const db = new BetterSqlite3(sqlitePath, { readonly: true });
    let notes: { id: number; flds: string; tags: string }[];
    try {
      const stmt = db.prepare("SELECT id, flds, tags FROM notes LIMIT ?");
      notes = stmt.all(MAX_NOTES + 1) as { id: number; flds: string; tags: string }[];
    } catch (e) {
      return NextResponse.json(
        { error: `SQLite read failed: ${(e as Error).message}` },
        { status: 400 }
      );
    } finally {
      db.close();
    }

    if (notes.length > MAX_NOTES) {
      return NextResponse.json(
        { error: `Deck too large (>${MAX_NOTES} notes). Split it in Anki first.` },
        { status: 413 }
      );
    }
    if (notes.length === 0) {
      return NextResponse.json({ imported: 0, skipped: 0, errors: [] });
    }

    // Parse + insert in chunks, uploading any referenced media as we go.
    // We allocate the user_flashcards uuid up-front so storage paths can
    // include the cardId before insert.
    const errors: string[] = [];
    let imported = 0;

    // Reverse-lookup: real filename -> numeric ZIP entry name.
    const filenameToZipKey = new Map<string, string>();
    for (const [k, v] of Object.entries(mediaMap)) filenameToZipKey.set(v, k);

    type Row = {
      id: string;
      user_id: string;
      source: "anki_apkg";
      source_deck_name: string | null;
      front_md: string;
      back_md: string | null;
      cloze_text: string | null;
      tags: string[] | null;
      media: MediaEntry[] | null;
      card_type: CardType;
    };

    const rows: Row[] = [];
    const mediaUploads: { row: Row; ankiFilename: string; zipKey: string }[] = [];

    for (const n of notes) {
      const parsed = parseFields(n.flds);
      const id = crypto.randomUUID();
      const tagsArr = (n.tags ?? "")
        .split(/\s+/)
        .map((t) => t.trim())
        .filter(Boolean);
      const row: Row = {
        id,
        user_id: user.id,
        source: "anki_apkg",
        source_deck_name: deckName,
        front_md: parsed.front,
        back_md: parsed.back,
        cloze_text: parsed.cloze_text,
        tags: tagsArr.length ? tagsArr : null,
        media: null,
        card_type: parsed.card_type,
      };
      for (const ref of parsed.referenced) {
        const zipKey = filenameToZipKey.get(ref);
        if (zipKey) mediaUploads.push({ row, ankiFilename: ref, zipKey });
      }
      rows.push(row);
    }

    // Upload media first so we can stamp paths into row.media before insert.
    // Best-effort: a failed upload doesn't kill the whole import — we just
    // skip the media entry and log it.
    const { readFile } = await import("node:fs/promises");
    for (const u of mediaUploads) {
      try {
        const buf = await readFile(join(work, u.zipKey));
        const safe = u.ankiFilename.replace(/[^A-Za-z0-9._-]/g, "_").slice(-80);
        const path = `${user.id}/${u.row.id}/${safe}`;
        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(path, new Uint8Array(buf), { upsert: false, cacheControl: "3600" });
        if (upErr) {
          errors.push(`media ${u.ankiFilename}: ${upErr.message}`);
          continue;
        }
        const entry: MediaEntry = { filename: u.ankiFilename, supabase_storage_path: path };
        u.row.media = u.row.media ? [...u.row.media, entry] : [entry];
      } catch (e) {
        errors.push(`media ${u.ankiFilename}: ${(e as Error).message}`);
      }
    }

    // Chunked insert.
    for (let i = 0; i < rows.length; i += INSERT_CHUNK) {
      const slice = rows.slice(i, i + INSERT_CHUNK);
      const { error: insErr } = await supabase.from("user_flashcards").insert(slice);
      if (insErr) {
        errors.push(`insert ${i}-${i + slice.length}: ${insErr.message}`);
        // Don't break — try the next chunk; partial success is still useful.
        continue;
      }
      imported += slice.length;
    }

    return NextResponse.json({
      imported,
      skipped: 0,
      errors,
      deck_name: deckName,
    });
  } catch (e) {
    console.error("[flashcards/import] failed", e);
    return NextResponse.json(
      { error: `Import failed: ${(e as Error).message}` },
      { status: 500 }
    );
  } finally {
    await rm(work, { recursive: true, force: true }).catch(() => {});
  }
}
