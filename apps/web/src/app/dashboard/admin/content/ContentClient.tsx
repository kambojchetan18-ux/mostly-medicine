"use client";

import { useEffect, useState, useCallback } from "react";

interface ContentPost {
  id: string;
  platform: "instagram" | "linkedin" | "youtube";
  post_date: string;
  post_type: string;
  caption: string;
  slides: { title: string; body: string }[] | null;
  hashtags: string[];
  status: "draft" | "approved" | "posted";
  posted_at: string | null;
}

const PLATFORM_META = {
  instagram: { label: "Instagram", color: "bg-pink-100 text-pink-700", dot: "bg-pink-500", icon: "📸" },
  linkedin:  { label: "LinkedIn",  color: "bg-blue-100 text-blue-700",  dot: "bg-blue-500",  icon: "💼" },
  youtube:   { label: "YouTube",   color: "bg-red-100 text-red-700",    dot: "bg-red-500",   icon: "▶️" },
};

const STATUS_META = {
  draft:    { label: "Draft",    color: "bg-gray-100 text-gray-600" },
  approved: { label: "Approved", color: "bg-green-100 text-green-700" },
  posted:   { label: "Posted",   color: "bg-violet-100 text-violet-700" },
};

function formatDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" });
}

function groupByDate(posts: ContentPost[]) {
  return posts.reduce<Record<string, ContentPost[]>>((acc, p) => {
    (acc[p.post_date] = acc[p.post_date] || []).push(p);
    return acc;
  }, {});
}

export default function ContentClient() {
  const today = new Date();
  const [month, setMonth] = useState(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`);
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingCaption, setEditingCaption] = useState<Record<string, string>>({});
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/content?month=${month}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPosts(data.posts || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  async function generateMonth(regenerate = false) {
    if (!confirm(regenerate ? "Regenerate all posts for this month? Existing posts will be deleted." : `Generate content for ${month}?`)) return;
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month, regenerate }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPosts(data.posts || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  }

  async function updateStatus(post: ContentPost, status: ContentPost["status"]) {
    setSaving(post.id);
    try {
      const res = await fetch(`/api/admin/content/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, status } : p));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(null);
    }
  }

  async function saveCaption(post: ContentPost) {
    const newCaption = editingCaption[post.id];
    if (newCaption === undefined || newCaption === post.caption) {
      setEditingCaption(prev => { const n = { ...prev }; delete n[post.id]; return n; });
      return;
    }
    setSaving(post.id + "-caption");
    try {
      const res = await fetch(`/api/admin/content/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption: newCaption }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, caption: newCaption } : p));
      setEditingCaption(prev => { const n = { ...prev }; delete n[post.id]; return n; });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(null);
    }
  }

  async function publishPost(post: ContentPost) {
    if (post.platform === "youtube") {
      copyCaption(post);
      alert("YouTube auto-post not supported.\nCaption copied — paste it in YouTube Studio > Community.");
      return;
    }
    if (!confirm(`Post to ${PLATFORM_META[post.platform].label} now?`)) return;
    setPublishing(post.id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/content/${post.id}/publish`, { method: "POST" });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, status: "posted", posted_at: new Date().toISOString() } : p));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Publish failed");
    } finally {
      setPublishing(null);
    }
  }

  async function deletePost(id: string) {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/admin/content/${id}`, { method: "DELETE" });
    setPosts(prev => prev.filter(p => p.id !== id));
  }

  function copyCaption(post: ContentPost) {
    const tags = post.hashtags.map(h => (h.startsWith("#") ? h : `#${h}`)).join(" ");
    const full = tags ? `${post.caption}\n\n${tags}` : post.caption;
    navigator.clipboard.writeText(full);
    setCopyFeedback(post.id);
    setTimeout(() => setCopyFeedback(null), 2000);
  }

  function changeMonth(dir: 1 | -1) {
    const [y, m] = month.split("-").map(Number);
    const d = new Date(y, m - 1 + dir, 1);
    setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }

  const filtered = platformFilter === "all" ? posts : posts.filter(p => p.platform === platformFilter);
  const grouped = groupByDate(filtered);
  const sortedDates = Object.keys(grouped).sort();

  const counts = {
    total: posts.length,
    draft: posts.filter(p => p.status === "draft").length,
    approved: posts.filter(p => p.status === "approved").length,
    posted: posts.filter(p => p.status === "posted").length,
  };

  const monthLabel = new Date(`${month}-01`).toLocaleString("en-AU", { month: "long", year: "numeric" });

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Studio</h1>
          <p className="text-sm text-gray-500 mt-0.5">AI-generated social posts for MostlyMedicine</p>
        </div>
        <div className="flex items-center gap-2">
          {posts.length > 0 && (
            <button
              onClick={() => generateMonth(true)}
              disabled={generating}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              Regenerate
            </button>
          )}
          <button
            onClick={() => generateMonth(false)}
            disabled={generating || posts.length > 0}
            className="px-4 py-2 text-sm font-semibold bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 flex items-center gap-2"
          >
            {generating ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                Generating…
              </>
            ) : "Generate Month"}
          </button>
        </div>
      </div>

      {/* Month nav */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => changeMonth(-1)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">‹</button>
        <span className="text-base font-semibold text-gray-800 min-w-[160px] text-center">{monthLabel}</span>
        <button onClick={() => changeMonth(1)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">›</button>
      </div>

      {/* Stats */}
      {posts.length > 0 && (
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            { label: "Total", value: counts.total, color: "text-gray-800" },
            { label: "Draft", value: counts.draft, color: "text-gray-500" },
            { label: "Approved", value: counts.approved, color: "text-green-600" },
            { label: "Posted", value: counts.posted, color: "text-violet-600" },
          ].map(s => (
            <div key={s.label} className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Platform filter */}
      {posts.length > 0 && (
        <div className="flex gap-1.5 mb-5 flex-wrap">
          {["all", "instagram", "linkedin", "youtube"].map(p => (
            <button
              key={p}
              onClick={() => setPlatformFilter(p)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                platformFilter === p
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {p === "all" ? "All platforms" : `${PLATFORM_META[p as keyof typeof PLATFORM_META].icon} ${PLATFORM_META[p as keyof typeof PLATFORM_META].label}`}
            </button>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 flex justify-between">
          {error}
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Empty */}
      {!loading && posts.length === 0 && !generating && (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl">
          <p className="text-3xl mb-3">✨</p>
          <p className="font-semibold text-gray-700 mb-1">No posts yet</p>
          <p className="text-sm text-gray-400 mb-5">Click &ldquo;Generate Month&rdquo; to create AI content for {monthLabel}</p>
        </div>
      )}

      {/* Generating placeholder */}
      {generating && (
        <div className="text-center py-20 border-2 border-dashed border-brand-200 rounded-2xl bg-brand-50/40">
          <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-semibold text-brand-700">Generating {monthLabel} content…</p>
          <p className="text-sm text-brand-500 mt-1">Claude is writing your posts. ~15 seconds.</p>
        </div>
      )}

      {/* Posts grouped by date */}
      {!loading && !generating && sortedDates.map(date => (
        <div key={date} className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{formatDate(date)}</p>
          <div className="space-y-3">
            {grouped[date].map(post => {
              const pm = PLATFORM_META[post.platform];
              const sm = STATUS_META[post.status];
              const isExpanded = expandedId === post.id;
              const isEditingCap = editingCaption[post.id] !== undefined;

              return (
                <div key={post.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 transition">
                  {/* Post header */}
                  <div
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : post.id)}
                  >
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${pm.color}`}>
                      {pm.icon} {pm.label}
                    </span>
                    <span className="text-xs text-gray-400 capitalize">{post.post_type}</span>
                    <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${sm.color}`}>{sm.label}</span>
                    <span className="text-gray-300 text-sm ml-1">{isExpanded ? "▲" : "▼"}</span>
                  </div>

                  {/* Caption preview */}
                  {!isExpanded && (
                    <div className="px-4 pb-3">
                      <p className="text-sm text-gray-600 line-clamp-2">{post.caption}</p>
                    </div>
                  )}

                  {/* Expanded */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-4">
                      {/* Caption editor */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Caption</label>
                        <textarea
                          rows={6}
                          value={isEditingCap ? editingCaption[post.id] : post.caption}
                          onChange={e => setEditingCaption(prev => ({ ...prev, [post.id]: e.target.value }))}
                          className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none text-gray-700"
                        />
                        {isEditingCap && (
                          <div className="flex gap-2 mt-1.5">
                            <button
                              onClick={() => saveCaption(post)}
                              disabled={saving === post.id + "-caption"}
                              className="text-xs px-3 py-1 bg-brand-600 text-white rounded-lg disabled:opacity-50"
                            >
                              {saving === post.id + "-caption" ? "Saving…" : "Save"}
                            </button>
                            <button
                              onClick={() => setEditingCaption(prev => { const n = { ...prev }; delete n[post.id]; return n; })}
                              className="text-xs px-3 py-1 border border-gray-200 rounded-lg text-gray-500"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Hashtags */}
                      {post.hashtags?.length > 0 && (
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Hashtags</label>
                          <div className="flex flex-wrap gap-1.5">
                            {post.hashtags.map(h => (
                              <span key={h} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                #{h.replace(/^#/, "")}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Slides (carousel) */}
                      {post.slides && post.slides.length > 0 && (
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Slides ({post.slides.length})</label>
                          <div className="space-y-2">
                            {post.slides.map((s, i) => (
                              <div key={i} className="bg-gray-50 rounded-xl px-3 py-2.5">
                                <p className="text-xs font-semibold text-gray-700">{i + 1}. {s.title}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{s.body}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {/* Approve / Unapprove */}
                        {post.status !== "posted" && (
                          <button
                            onClick={() => updateStatus(post, post.status === "approved" ? "draft" : "approved")}
                            disabled={saving === post.id}
                            className={`text-xs px-3 py-1.5 rounded-lg font-medium disabled:opacity-50 ${
                              post.status === "approved"
                                ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                            }`}
                          >
                            {saving === post.id ? "…" : post.status === "approved" ? "Unapprove" : "Approve"}
                          </button>
                        )}

                        {/* Post / Copy */}
                        {post.status === "approved" && (
                          <button
                            onClick={() => publishPost(post)}
                            disabled={publishing === post.id}
                            className="text-xs px-3 py-1.5 rounded-lg font-medium bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50 flex items-center gap-1.5"
                          >
                            {publishing === post.id
                              ? <><span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" /> Posting…</>
                              : post.platform === "youtube" ? "Copy for YouTube" : `Post to ${pm.label}`
                            }
                          </button>
                        )}

                        <button
                          onClick={() => copyCaption(post)}
                          className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                        >
                          {copyFeedback === post.id ? "Copied!" : "Copy caption"}
                        </button>

                        {post.status === "posted" && post.posted_at && (
                          <span className="text-xs text-violet-500 ml-auto">
                            Posted {new Date(post.posted_at).toLocaleDateString("en-AU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                          </span>
                        )}

                        <button
                          onClick={() => deletePost(post.id)}
                          className="text-xs px-2 py-1.5 rounded-lg text-red-400 hover:bg-red-50 ml-auto"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Setup guide */}
      {posts.length > 0 && (
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-sm">
          <p className="font-semibold text-amber-800 mb-2">Platform setup needed for auto-posting</p>
          <ul className="space-y-1 text-amber-700 text-xs">
            <li><strong>LinkedIn:</strong> Add <code className="bg-amber-100 px-1 rounded">LINKEDIN_ACCESS_TOKEN</code> + <code className="bg-amber-100 px-1 rounded">LINKEDIN_PERSON_ID</code> to .env</li>
            <li><strong>Instagram:</strong> Add <code className="bg-amber-100 px-1 rounded">INSTAGRAM_ACCESS_TOKEN</code> + <code className="bg-amber-100 px-1 rounded">INSTAGRAM_USER_ID</code> + <code className="bg-amber-100 px-1 rounded">INSTAGRAM_DEFAULT_IMAGE_URL</code> to .env</li>
            <li><strong>YouTube:</strong> Manual only — use &ldquo;Copy caption&rdquo; button → YouTube Studio &gt; Community.</li>
          </ul>
        </div>
      )}
    </div>
  );
}
