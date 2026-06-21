"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";

type Phase = "idle" | "reading" | "uploading" | "done" | "error";

type Result = {
  imported: number;
  skipped: number;
  errors: string[];
  deck_name: string | null;
};

export function ImportClient() {
  const [phase, setPhase]   = useState<Phase>("idle");
  const [status, setStatus] = useState<string>("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError]   = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const upload = useCallback(async (file: File) => {
    setError(null);
    setResult(null);
    if (!/\.apkg$/i.test(file.name)) {
      setError("That doesn't look like an Anki .apkg file.");
      setPhase("error");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError("File too large — 50 MB max.");
      setPhase("error");
      return;
    }
    try {
      setPhase("reading");
      setStatus(`Reading ${file.name} (${(file.size / 1_000_000).toFixed(1)} MB)…`);
      const form = new FormData();
      form.append("file", file);

      setPhase("uploading");
      setStatus("Uploading and parsing on the server. Large decks take ~30 s…");

      const res  = await fetch("/api/flashcards/import", { method: "POST", body: form });
      const json = (await res.json().catch(() => ({}))) as Partial<Result> & { error?: string };
      if (!res.ok) {
        setError(json.error ?? `Import failed (${res.status})`);
        setPhase("error");
        return;
      }
      setResult({
        imported:  json.imported ?? 0,
        skipped:   json.skipped ?? 0,
        errors:    json.errors ?? [],
        deck_name: json.deck_name ?? null,
      });
      setPhase("done");
    } catch (e) {
      setError((e as Error).message);
      setPhase("error");
    }
  }, []);

  const onFile = (f: File | null | undefined) => { if (f) void upload(f); };

  const reset = () => {
    setPhase("idle");
    setStatus("");
    setResult(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const busy = phase === "reading" || phase === "uploading";

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (busy) return;
          const f = e.dataTransfer.files?.[0];
          onFile(f);
        }}
        className={[
          "rounded-2xl border-2 border-dashed p-10 text-center transition",
          dragOver
            ? "border-saffron-400 bg-saffron-500/5"
            : "border-white/15 bg-white hover:border-white/30",
          busy ? "opacity-75" : "",
        ].join(" ")}
      >
        <p className="text-base font-semibold text-gray-900">Drop a .apkg here</p>
        <p className="mt-1 text-xs text-gray-600">or</p>
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="mt-3 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
        >
          Choose file
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".apkg,application/zip,application/octet-stream"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
        <p className="mt-4 text-[11px] uppercase tracking-wider text-gray-500">
          Max 50 MB · Max 10,000 notes per file
        </p>
      </div>

      {busy && (
        <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-saffron-500" />
            {status}
          </div>
        </div>
      )}

      {phase === "done" && result && (
        <div className="mt-5 space-y-3 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.06] p-5 text-sm text-gray-900">
          <p className="text-base font-semibold">
            Imported {result.imported.toLocaleString()}{" "}
            {result.imported === 1 ? "card" : "cards"}
            {result.deck_name ? ` from ${result.deck_name}` : ""}.
          </p>
          {result.errors.length > 0 && (
            <details className="text-xs text-gray-600">
              <summary className="cursor-pointer">
                {result.errors.length} non-fatal warning{result.errors.length === 1 ? "" : "s"}
              </summary>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {result.errors.slice(0, 20).map((er, i) => (
                  <li key={`err-${er.slice(0, 30)}-${i}`}>{er}</li>
                ))}
              </ul>
            </details>
          )}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={reset}
              className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
            >
              Import another .apkg
            </button>
            <Link
              href="/dashboard/flashcards"
              className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-gray-900 hover:bg-white/10"
            >
              Back to flashcards
            </Link>
          </div>
        </div>
      )}

      {phase === "error" && (
        <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/[0.06] p-4 text-sm text-gray-900">
          <p className="font-semibold">Couldn&rsquo;t import.</p>
          <p className="mt-1 text-gray-700">{error}</p>
          <button
            type="button"
            onClick={reset}
            className="mt-3 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-gray-900 hover:bg-white/10"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
