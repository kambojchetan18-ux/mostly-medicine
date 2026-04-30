"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LibraryChat from "@/components/LibraryChat";

type Topic = {
  id: string;
  title: string;
  source: string;
  system: string;
  summary: string;
  amc_exam_type: string[];
  difficulty: string | null;
};

type Note = {
  id: string;
  filename: string;
  ai_summary: string | null;
  page_count: number | null;
  file_size_bytes: number | null;
  created_at: string;
};

const TABS = ["eTG Summaries", "Oxford Handbook", "AMC Explanations", "My Notes"] as const;
type Tab = (typeof TABS)[number];

const SOURCE_MAP: Record<Tab, string> = {
  "eTG Summaries": "eTG",
  "Oxford Handbook": "Oxford",
  "AMC Explanations": "AMC",
  "My Notes": "notes",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Hard: "bg-red-100 text-red-700",
};

const SOURCE_COLORS: Record<string, string> = {
  eTG: "bg-blue-100 text-blue-700",
  Oxford: "bg-purple-100 text-purple-700",
  AMC: "bg-brand-100 text-brand-700",
};

// Display labels for AMC exam types (DB values stay as "CAT 1" / "CAT 2")
const EXAM_TYPE_LABELS: Record<string, string> = {
  "All": "All",
  "CAT 1": "AMC MCQ",
  "CAT 2": "AMC Handbook AI RolePlay",
};

export default function LibraryClient({
  topics,
  notes: initialNotes,
  isAuthenticated,
}: {
  topics: Topic[];
  notes: Note[];
  isAuthenticated: boolean;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("eTG Summaries");
  const [search, setSearch] = useState("");
  const [selectedSystem, setSelectedSystem] = useState<string>("All");
  const [selectedExamType, setSelectedExamType] = useState<string>("All");
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const systems = useMemo(() => {
    const all = topics.map((t) => t.system);
    return ["All", ...Array.from(new Set(all)).sort()];
  }, [topics]);

  const filtered = useMemo(() => {
    const sourcePrefix = SOURCE_MAP[activeTab];
    return topics.filter((t) => {
      if (activeTab === "My Notes") return false;
      if (!t.source.startsWith(sourcePrefix)) return false;
      if (selectedSystem !== "All" && t.system !== selectedSystem) return false;
      if (selectedExamType !== "All" && !t.amc_exam_type?.includes(selectedExamType)) return false;
      if (search) {
        const q = search.toLowerCase();
        return t.title.toLowerCase().includes(q) || t.summary.toLowerCase().includes(q) || t.system.toLowerCase().includes(q);
      }
      return true;
    });
  }, [topics, activeTab, search, selectedSystem, selectedExamType]);

  async function handleUpload(file: File) {
    setUploadError("");
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/notes/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error ?? "Upload failed");
      } else {
        setNotes((prev) => [data, ...prev]);
        router.refresh();
      }
    } catch {
      setUploadError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  }

  async function handleDelete(noteId: string) {
    await fetch(`/api/notes/${noteId}`, { method: "DELETE" });
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Clinical Library</h1>
        <p className="text-sm text-gray-500 mt-1">Handbook summaries grounded in eTG, Oxford, and AMC guidelines</p>
      </div>

      {/* Tabs — horizontal-scroll wrapper on phones so 4 long labels never
          collapse onto two stacked rows that mess up the underline. */}
      <div className="flex gap-1 mb-6 border-b border-gray-200 overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 whitespace-nowrap px-3 sm:px-4 py-2.5 text-sm font-medium rounded-t-lg transition min-h-[44px] ${
              activeTab === tab
                ? "bg-white border border-b-white border-gray-200 text-brand-700 -mb-px"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
            {tab === "My Notes" && notes.length > 0 && (
              <span className="ml-1.5 text-xs bg-brand-100 text-brand-600 px-1.5 py-0.5 rounded-full">
                {notes.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === "My Notes" ? (
        <div>
          {!isAuthenticated ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-4xl mb-3">🔒</div>
              <p className="font-medium text-gray-600">Log in to use My Notes</p>
              <Link href="/auth/login" className="mt-3 inline-block text-sm text-brand-600 hover:underline">
                Log in →
              </Link>
            </div>
          ) : (
            <div>
              {/* Upload zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`mb-6 border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
                  dragOver
                    ? "border-brand-400 bg-brand-50"
                    : "border-gray-200 hover:border-brand-300 hover:bg-gray-50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={onFileChange}
                  className="hidden"
                />
                {uploading ? (
                  <div className="flex flex-col items-center gap-2 text-brand-600">
                    <div className="w-6 h-6 border-2 border-brand-300 border-t-brand-600 rounded-full animate-spin" />
                    <p className="text-sm font-medium">Uploading & analysing...</p>
                  </div>
                ) : (
                  <div className="text-gray-400">
                    <div className="text-3xl mb-2">📎</div>
                    <p className="text-sm font-medium text-gray-600">Drop a file or click to upload</p>
                    <p className="text-xs mt-1">PDF, DOCX, or TXT — max 10MB</p>
                  </div>
                )}
              </div>

              {uploadError && (
                <p className="text-sm text-red-600 mb-4">{uploadError}</p>
              )}

              {notes.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-sm">No notes yet. Upload your first study note above.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {notes.map((note) => (
                    <div key={note.id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-gray-900 leading-snug break-words flex-1">
                          {note.filename}
                        </h3>
                        <button
                          onClick={() => handleDelete(note.id)}
                          className="text-gray-300 hover:text-red-400 transition text-lg leading-none shrink-0"
                          title="Delete note"
                        >
                          ×
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5 text-xs text-gray-400">
                        <span>{new Date(note.created_at).toLocaleDateString("en-AU")}</span>
                        {note.page_count && <span>· {note.page_count}p</span>}
                        {note.file_size_bytes && (
                          <span>· {(note.file_size_bytes / 1024).toFixed(0)} KB</span>
                        )}
                      </div>

                      {note.ai_summary && (
                        <p className="text-xs text-gray-500 leading-relaxed flex-1">{note.ai_summary}</p>
                      )}

                      <div className="flex gap-2 mt-auto">
                        <Link
                          href={`/dashboard/library/notes/${note.id}`}
                          className="flex-1 text-center text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                        >
                          Read
                        </Link>
                        <Link
                          href={`/dashboard/library/notes/${note.id}`}
                          className="flex-1 text-center text-xs font-medium px-3 py-1.5 rounded-lg bg-brand-50 text-brand-600 hover:bg-brand-100 transition"
                        >
                          ✨ Ask AI
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-6">
          {/* Filter Sidebar */}
          <aside className="hidden lg:block w-48 shrink-0">
            <div className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Search</label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search topics..."
                  className="mt-1 w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">System</label>
                <div className="mt-1 space-y-1">
                  {systems.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSystem(s)}
                      className={`w-full text-left px-2 py-1.5 text-sm rounded-lg transition ${
                        selectedSystem === s ? "bg-brand-50 text-brand-700 font-medium" : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Exam Type</label>
                <div className="mt-1 space-y-1">
                  {["All", "CAT 1", "CAT 2"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedExamType(type)}
                      className={`w-full text-left px-2 py-1.5 text-sm rounded-lg transition ${
                        selectedExamType === type ? "bg-brand-50 text-brand-700 font-medium" : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {EXAM_TYPE_LABELS[type] ?? type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="lg:hidden mb-4">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search topics..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <div className="text-4xl mb-3">📚</div>
                <p className="font-medium">No topics found</p>
                <p className="text-sm mt-1">Try adjusting your filters or search</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((topic) => (
                  <div key={topic.id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3 hover:shadow-md transition">
                    <h3 className="text-sm font-semibold text-gray-900 leading-snug">{topic.title}</h3>
                    <div className="flex flex-wrap gap-1.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${SOURCE_COLORS[topic.source.split(" ")[0]] ?? "bg-gray-100 text-gray-600"}`}>
                        {topic.source}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{topic.system}</span>
                      {topic.difficulty && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_COLORS[topic.difficulty] ?? ""}`}>
                          {topic.difficulty}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed flex-1">{topic.summary}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {topic.amc_exam_type?.map((type) => (
                          <span key={type} className="text-xs px-1.5 py-0.5 rounded bg-brand-50 text-brand-600 font-medium">
                            {EXAM_TYPE_LABELS[type] ?? type}
                          </span>
                        ))}
                      </div>
                      <Link href={`/dashboard/library/${topic.id}`} className="text-xs font-medium text-brand-600 hover:text-brand-700 transition">
                        Read →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <LibraryChat />
    </div>
  );
}
