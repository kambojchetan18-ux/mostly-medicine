"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

type SearchResult = {
  id: string;
  title: string;
  type: "library" | "case" | "note";
  snippet: string;
  url: string;
  system_tag: string | null;
  difficulty: string | null;
};

const TYPE_LABELS: Record<string, string> = {
  library: "Library",
  case: "Case",
  note: "My Note",
};

const TYPE_COLORS: Record<string, string> = {
  library: "bg-blue-100 text-blue-700",
  case: "bg-purple-100 text-purple-700",
  note: "bg-green-100 text-green-700",
};

const RECENT_KEY = "mm_recent_searches";
const MAX_RECENT = 5;

function getRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveRecent(query: string) {
  const prev = getRecent().filter((q) => q !== query);
  localStorage.setItem(RECENT_KEY, JSON.stringify([query, ...prev].slice(0, MAX_RECENT)));
}

export default function GlobalSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Open on cmd+k / ctrl+k
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Autofocus on open
  useEffect(() => {
    if (open) {
      setRecent(getRecent());
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
      setActiveIndex(0);
    }
  }, [open]);

  // Debounced search
  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results ?? []);
      setActiveIndex(0);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 250);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, search]);

  function navigate(url: string) {
    if (query) saveRecent(query);
    setOpen(false);
    router.push(url);
  }

  // Keyboard navigation
  const allItems = results;
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, allItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && allItems[activeIndex]) {
      navigate(allItems[activeIndex].url);
    }
  }

  // Group results by type
  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    if (!acc[r.type]) acc[r.type] = [];
    acc[r.type].push(r);
    return acc;
  }, {});

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />

      {/* Modal */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <span className="text-gray-400 text-lg">🔍</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search library topics, cases, notes..."
            className="flex-1 text-sm text-gray-900 placeholder-gray-400 outline-none bg-transparent"
          />
          {loading && (
            <div className="w-4 h-4 border-2 border-gray-200 border-t-brand-500 rounded-full animate-spin" />
          )}
          <kbd className="hidden sm:inline text-xs text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">
            esc
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {query.length < 2 ? (
            <div className="p-4">
              {recent.length > 0 ? (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    Recent searches
                  </p>
                  {recent.map((r) => (
                    <button
                      key={r}
                      onClick={() => setQuery(r)}
                      className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition"
                    >
                      <span className="text-gray-300">🕐</span> {r}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">
                  Type at least 2 characters to search
                </p>
              )}
            </div>
          ) : results.length === 0 && !loading ? (
            <div className="text-center py-10 text-gray-400">
              <p className="text-sm">No results for <span className="font-medium text-gray-600">&ldquo;{query}&rdquo;</span></p>
            </div>
          ) : (
            <div className="p-2">
              {(["library", "case", "note"] as const).map((type) => {
                const group = grouped[type];
                if (!group?.length) return null;
                let flatIndex = results.findIndex((r) => r.id === group[0].id);
                return (
                  <div key={type} className="mb-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-2 mb-1">
                      {TYPE_LABELS[type]}
                    </p>
                    {group.map((result) => {
                      const idx = flatIndex++;
                      return (
                        <button
                          key={result.id}
                          onClick={() => navigate(result.url)}
                          onMouseEnter={() => setActiveIndex(idx)}
                          className={`w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-lg transition ${
                            activeIndex === idx ? "bg-brand-50" : "hover:bg-gray-50"
                          }`}
                        >
                          <span className={`mt-0.5 shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[result.type]}`}>
                            {TYPE_LABELS[result.type]}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{result.title}</p>
                            {result.snippet && (
                              <p className="text-xs text-gray-400 truncate mt-0.5">{result.snippet}</p>
                            )}
                          </div>
                          {result.difficulty && (
                            <span className="shrink-0 text-xs text-gray-400">{result.difficulty}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-400">
          <span><kbd className="border border-gray-200 rounded px-1">↑↓</kbd> navigate</span>
          <span><kbd className="border border-gray-200 rounded px-1">↵</kbd> open</span>
          <span><kbd className="border border-gray-200 rounded px-1">esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
