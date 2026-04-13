"use client";

import { useState, useMemo } from "react";
import { recalls } from "@mostly-medicine/content";
import type { RecallMonth, RecallCategory } from "@mostly-medicine/content";

const CATEGORY_COLORS: Record<RecallCategory, { bg: string; text: string; border: string; dot: string }> = {
  "Medicine & Surgery": { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", dot: "bg-indigo-500" },
  "Psychiatry":         { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-500" },
  "Paediatrics":        { bg: "bg-pink-50",   text: "text-pink-700",   border: "border-pink-200",   dot: "bg-pink-500"   },
  "Counselling":        { bg: "bg-teal-50",   text: "text-teal-700",   border: "border-teal-200",   dot: "bg-teal-500"   },
  "PE":                 { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  dot: "bg-amber-500"  },
};

const CATEGORY_ICONS: Record<RecallCategory, string> = {
  "Medicine & Surgery": "🩺",
  "Psychiatry":         "🧠",
  "Paediatrics":        "👶",
  "Counselling":        "💬",
  "PE":                 "📋",
};

const TAG_COLORS: Record<string, string> = {
  "Cardiovascular": "bg-red-100 text-red-700",
  "Respiratory":    "bg-blue-100 text-blue-700",
  "Neurology":      "bg-purple-100 text-purple-700",
  "Endocrinology":  "bg-yellow-100 text-yellow-700",
  "Gastroenterology": "bg-orange-100 text-orange-700",
  "Emergency":      "bg-red-100 text-red-800",
  "Psychiatry":     "bg-violet-100 text-violet-700",
  "Paediatrics":    "bg-pink-100 text-pink-700",
  "Pharmacology":   "bg-cyan-100 text-cyan-700",
  "Obstetrics":     "bg-rose-100 text-rose-700",
  "Gynaecology":    "bg-fuchsia-100 text-fuchsia-700",
  "Oncology":       "bg-slate-100 text-slate-700",
  "Infectious Disease": "bg-green-100 text-green-700",
  "Surgery":        "bg-zinc-100 text-zinc-700",
  "Renal":          "bg-teal-100 text-teal-700",
  "Rheumatology":   "bg-indigo-100 text-indigo-700",
  "MSK":            "bg-stone-100 text-stone-700",
  "Dermatology":    "bg-amber-100 text-amber-700",
};

function tagColor(tag: string) {
  return TAG_COLORS[tag] ?? "bg-gray-100 text-gray-600";
}

const allCategories: RecallCategory[] = ["Medicine & Surgery", "Psychiatry", "Paediatrics", "Counselling"];

export default function RecallsPage() {
  const [activeCategory, setActiveCategory] = useState<RecallCategory | "All">("All");
  const [search, setSearch] = useState("");
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set(["March-2025-Medicine & Surgery"]));

  const filtered = useMemo(() => {
    return recalls.filter((rm) => {
      const catMatch = activeCategory === "All" || rm.category === activeCategory;
      if (!catMatch) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return rm.items.some(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q)) ||
          item.tasks.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [activeCategory, search]);

  function toggleMonth(key: string) {
    setExpandedMonths((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function expandAll() {
    setExpandedMonths(new Set(recalls.map((r) => `${r.month}-${r.year}-${r.category}`)));
  }

  function collapseAll() {
    setExpandedMonths(new Set());
  }

  const totalItems = filtered.reduce((sum, rm) => sum + rm.items.length, 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">AMC Recalls 2025</h2>
        <p className="text-gray-500 text-sm">
          Real exam recall topics from the AMC community — organised by month and specialty.
          Use these to target your preparation and identify high-frequency themes.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="mb-5 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-xs text-amber-800">
        <span className="text-base shrink-0 mt-0.5">📋</span>
        <div className="leading-relaxed">
          <span className="font-bold">Source:</span> These recalls are collected from the AMC candidate community and represent
          topics reported from real exam sittings in 2025. They are for study guidance only —
          exact question content is not reproduced. <span className="font-semibold">Use as a study guide, not a substitute for comprehensive preparation.</span>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {allCategories.map((cat) => {
          const catRecalls = recalls.filter((r) => r.category === cat);
          const count = catRecalls.reduce((s, r) => s + r.items.length, 0);
          const c = CATEGORY_COLORS[cat];
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? "All" : cat)}
              className={`rounded-2xl p-4 border text-left transition hover:shadow-sm ${
                activeCategory === cat
                  ? `${c.bg} ${c.border} shadow-sm`
                  : "bg-white border-gray-200 hover:border-gray-300"
              }`}
            >
              <p className="text-xl mb-1">{CATEGORY_ICONS[cat]}</p>
              <p className={`text-sm font-semibold ${activeCategory === cat ? c.text : "text-gray-800"}`}>{cat}</p>
              <p className={`text-xs mt-0.5 ${activeCategory === cat ? c.text : "text-gray-400"}`}>{count} topics</p>
            </button>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search topics, tags, tasks…"
          className="flex-1 min-w-48 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button
          onClick={() => setActiveCategory("All")}
          className={`text-xs px-3 py-1.5 rounded-lg border transition ${
            activeCategory === "All"
              ? "bg-brand-600 text-white border-brand-600"
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
          }`}
        >
          All Categories
        </button>
        <div className="flex gap-2 ml-auto">
          <button onClick={expandAll} className="text-xs text-gray-500 hover:text-gray-700 transition">Expand all</button>
          <span className="text-gray-300">|</span>
          <button onClick={collapseAll} className="text-xs text-gray-500 hover:text-gray-700 transition">Collapse all</button>
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-4">{totalItems} recall topics</p>

      {/* Recall Groups */}
      <div className="space-y-4">
        {filtered.map((rm) => {
          const key = `${rm.month}-${rm.year}-${rm.category}`;
          const expanded = expandedMonths.has(key);
          const c = CATEGORY_COLORS[rm.category];

          // Filter items by search
          const items = search.trim()
            ? rm.items.filter((item) => {
                const q = search.toLowerCase();
                return (
                  item.title.toLowerCase().includes(q) ||
                  item.tags.some((t) => t.toLowerCase().includes(q)) ||
                  item.tasks.some((t) => t.toLowerCase().includes(q))
                );
              })
            : rm.items;

          if (items.length === 0) return null;

          return (
            <div key={key} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              {/* Month header */}
              <button
                onClick={() => toggleMonth(key)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{CATEGORY_ICONS[rm.category]}</span>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 text-sm">
                      {rm.month} {rm.year} — {rm.category}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{items.length} recall topics</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.bg} ${c.text}`}>
                    {rm.category}
                  </span>
                  <span className={`text-gray-400 text-sm transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}>
                    ▾
                  </span>
                </div>
              </button>

              {/* Items list */}
              {expanded && (
                <div className="border-t border-gray-100">
                  <div className="divide-y divide-gray-50">
                    {items.map((item) => (
                      <div key={item.number} className="px-5 py-3 hover:bg-gray-50/50 transition">
                        <div className="flex items-start gap-3">
                          <span className={`mt-0.5 shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${c.bg} ${c.text}`}>
                            {item.number}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-800 font-medium leading-snug">{item.title}</p>
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {item.tags.map((tag) => (
                                <span key={tag} className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${tagColor(tag)}`}>
                                  {tag}
                                </span>
                              ))}
                              {item.tasks.length > 0 && (
                                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500">
                                  Tasks: {item.tasks.join(", ")}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-gray-500 text-sm">No recalls match your search</p>
        </div>
      )}
    </div>
  );
}
