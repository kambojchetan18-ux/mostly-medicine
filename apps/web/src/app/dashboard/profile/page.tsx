"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, User } from "lucide-react";
import type { IMGProfile } from "@/lib/imgProfile";
import { computeReadiness, PATHWAY_LABELS } from "@/lib/imgProfile";

type Step = "upload" | "processing" | "review" | "saved";

const FIELD_LABELS: Record<string, string> = {
  amc_cat1:     "AMC CAT 1 (MCQ)",
  amc_cat2:     "AMC CAT 2 (Clinical)",
  ahpra_status: "AHPRA Registration",
  visa_type:    "Visa Type",
  english_test: "English Test",
};

const STATUS_OPTIONS = {
  amc_cat1:     [["passed","Passed ✓"],["scheduled","Scheduled"],["not_done","Not done"]],
  amc_cat2:     [["passed","Passed ✓"],["scheduled","Scheduled"],["not_done","Not done"]],
  ahpra_status: [["registered","Registered ✓"],["pending","Pending"],["not_started","Not started"]],
  visa_type:    [["482","482 (TSS)"],["485","485 (Graduate)"],["189","189 (Skilled)"],["190","190 (State)"],["491","491 (Regional)"],["pr","Permanent Resident"],["citizen","Citizen"],["other","Other"],["unknown","Unknown"]],
  english_test: [["oet","OET Passed"],["ielts","IELTS Passed"],["exempt","Exempt"],["not_done","Not done"]],
};

export default function ProfilePage() {
  const [step, setStep]         = useState<Step>("upload");
  const [error, setError]       = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [profile, setProfile]   = useState<Partial<IMGProfile> | null>(null);
  const [saving, setSaving]     = useState(false);
  const [activeTab, setActiveTab] = useState<"file" | "paste">("file");
  const [pasteText, setPasteText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function analyse(formData: FormData) {
    setStep("processing");
    setError(null);
    try {
      const res = await fetch("/api/cv/analyse", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Analysis failed");
      setProfile(data.profile);
      setStep("review");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setStep("upload");
    }
  }

  function handleFile(file: File) {
    const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
    const ALLOWED_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
    if (file.size > MAX_SIZE) {
      setError("File too large. Maximum size is 10 MB.");
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|txt)$/i)) {
      setError("Unsupported file type. Please upload a PDF, Word, or text file.");
      return;
    }
    const fd = new FormData();
    fd.append("file", file);
    analyse(fd);
  }

  function handlePaste() {
    if (!pasteText.trim()) return;
    const fd = new FormData();
    fd.append("text", pasteText);
    analyse(fd);
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  async function saveProfile() {
    setSaving(true);
    try {
      const fd = new FormData();
      // Re-submit the updated profile as JSON via text field trick
      fd.append("text", JSON.stringify(profile));
      // We'll call a separate save endpoint — for now patch via upsert in the same API
      // by sending the profile directly as JSON body
      const res = await fetch("/api/cv/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error("Save failed");
      setStep("saved");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const computed = profile ? computeReadiness(profile as IMGProfile) : null;
  const pathwayInfo = computed ? PATHWAY_LABELS[computed.pathway] : null;

  // ── Saved ───────────────────────────────────────────────────────────────────
  if (step === "saved") {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="text-6xl">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900">Profile saved!</h2>
        <p className="text-gray-500">Your jobs portal and pathway plan are now personalised for you.</p>
        <a href="/dashboard/jobs" className="inline-block mt-4 px-6 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition">
          View My Jobs Dashboard →
        </a>
      </div>
    );
  }

  // ── Processing ──────────────────────────────────────────────────────────────
  if (step === "processing") {
    return (
      <div className="max-w-xl mx-auto py-24 text-center space-y-6">
        <Loader2 className="w-12 h-12 text-brand-600 animate-spin mx-auto" />
        <h2 className="text-xl font-bold text-gray-800">Analysing your CV…</h2>
        <p className="text-sm text-gray-500">Claude is reading your CV and mapping your readiness for Australian practice.</p>
      </div>
    );
  }

  // ── Review ──────────────────────────────────────────────────────────────────
  if (step === "review" && profile) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Review your profile</h1>
          <p className="text-sm text-gray-500 mt-1">Claude extracted this from your CV. Correct anything that&apos;s wrong before saving.</p>
        </div>

        {/* Pathway banner */}
        {pathwayInfo && (
          <div className={`rounded-xl border px-4 py-3 ${pathwayInfo.color}`}>
            <p className="font-semibold text-sm">{pathwayInfo.label}</p>
            <p className="text-sm mt-0.5 opacity-80">{pathwayInfo.next}</p>
          </div>
        )}

        {/* Readiness score */}
        {computed && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-4 mb-3">
              <span className="text-4xl font-bold text-brand-700">{computed.score}%</span>
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-3 bg-brand-600 rounded-full transition-all" style={{ width: `${computed.score}%` }} />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {computed.items.map(item => (
                <span key={item.label} className={`text-xs px-2.5 py-1 rounded-full font-medium ${item.cleared ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                  {item.cleared ? "✓" : "⏳"} {item.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Editable fields */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2"><User className="w-4 h-4" /> Profile Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
              <input
                value={profile.name ?? ""}
                onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Medical Degree Country</label>
              <input
                value={profile.degree_country ?? ""}
                onChange={e => setProfile(p => ({ ...p, degree_country: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Graduation Year</label>
              <input
                type="number"
                value={profile.graduation_year ?? ""}
                onChange={e => setProfile(p => ({ ...p, graduation_year: parseInt(e.target.value) || null }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Years Post-Grad Experience</label>
              <input
                type="number"
                value={profile.years_experience ?? ""}
                onChange={e => setProfile(p => ({ ...p, years_experience: parseInt(e.target.value) || null }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Status dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(Object.keys(STATUS_OPTIONS) as Array<keyof typeof STATUS_OPTIONS>).map(field => (
              <div key={field}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{FIELD_LABELS[field]}</label>
                <select
                  value={(profile as Record<string, string>)[field] ?? ""}
                  onChange={e => setProfile(p => ({ ...p, [field]: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                >
                  {STATUS_OPTIONS[field].map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* Specialties */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Clinical Specialties (comma-separated)</label>
            <input
              value={(profile.specialties ?? []).join(", ")}
              onChange={e => setProfile(p => ({ ...p, specialties: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }))}
              placeholder="e.g. General Medicine, Emergency, Paediatrics"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Location preference */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">State Preferences (comma-separated)</label>
            <input
              value={(profile.location_preference ?? []).join(", ")}
              onChange={e => setProfile(p => ({ ...p, location_preference: e.target.value.split(",").map(s => s.trim().toUpperCase()).filter(Boolean) }))}
              placeholder="e.g. NSW, VIC, NT"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={() => setStep("upload")} className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition">
            ← Re-upload
          </button>
          <button
            onClick={saveProfile}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            Save Profile
          </button>
        </div>
      </div>
    );
  }

  // ── Upload ──────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upload Your CV</h1>
        <p className="text-gray-500 mt-1 text-sm">
          We&apos;ll analyse your CV and build a personalised Australian practice readiness report — pathway, blockers, job matches.
        </p>
      </div>

      {/* What you get */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: "📊", title: "Readiness Score", desc: "Know exactly where you stand" },
          { icon: "🗺️", title: "Pathway Plan", desc: "Your next steps, in order" },
          { icon: "💼", title: "Job Matches", desc: "RMO pools and GP areas for your profile" },
        ].map(card => (
          <div key={card.title} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm text-center">
            <div className="text-2xl mb-1">{card.icon}</div>
            <p className="font-semibold text-sm text-gray-900">{card.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200">
          {([["file","Upload PDF / Word"],["paste","Paste CV Text"]] as const).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium transition ${activeTab === tab ? "text-brand-700 border-b-2 border-brand-600 bg-brand-50/50" : "text-gray-500 hover:text-gray-700"}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "file" ? (
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${dragging ? "border-brand-500 bg-brand-50" : "border-gray-200 hover:border-brand-400 hover:bg-gray-50"}`}
            >
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="font-semibold text-gray-700">Drop your CV here</p>
              <p className="text-sm text-gray-400 mt-1">PDF, Word, or plain text · up to 10 MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
            </div>
          ) : (
            <div className="space-y-3">
              <textarea
                value={pasteText}
                onChange={e => setPasteText(e.target.value)}
                placeholder="Paste your full CV text here…"
                rows={12}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              />
              <button
                onClick={handlePaste}
                disabled={!pasteText.trim()}
                className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-xl text-sm font-semibold transition disabled:opacity-40"
              >
                <FileText className="w-4 h-4" /> Analyse CV
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      <p className="text-xs text-gray-400 text-center">
        Your CV is processed by Claude AI and stored securely. Only you can see your profile.
      </p>
    </div>
  );
}
