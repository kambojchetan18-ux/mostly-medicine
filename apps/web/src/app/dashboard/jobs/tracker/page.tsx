"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";

type Status = "Planning" | "Applied" | "Interview" | "Offered" | "Rejected" | "Withdrawn";
type AppType = "RMO" | "GP";
type Application = {
  id: string;
  appType: AppType;
  hospital: string;
  state: string;
  role: string;
  appliedDate: string;
  status: Status;
  contactName: string;
  contactEmail: string;
  notes: string;
  salary: string;
};

const statusColors: Record<Status, string> = {
  Planning: "bg-gray-100 text-gray-700",
  Applied: "bg-blue-100 text-blue-700",
  Interview: "bg-purple-100 text-purple-700",
  Offered: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
  Withdrawn: "bg-yellow-100 text-yellow-700",
};

const STATUSES: Status[] = ["Planning", "Applied", "Interview", "Offered", "Rejected", "Withdrawn"];

const appTypeColors: Record<AppType, string> = {
  RMO: "bg-brand-100 text-brand-700",
  GP: "bg-emerald-100 text-emerald-700",
};

const emptyApp: Omit<Application, "id"> = {
  appType: "RMO",
  hospital: "",
  state: "NSW",
  role: "Resident Medical Officer (RMO)",
  appliedDate: new Date().toISOString().split("T")[0],
  status: "Planning",
  contactName: "",
  contactEmail: "",
  notes: "",
  salary: "",
};

export default function TrackerPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Application, "id">>(emptyApp);
  const [typeFilter, setTypeFilter] = useState<"All" | AppType>("All");

  useEffect(() => {
    const saved = localStorage.getItem("rmo_applications");
    if (saved) {
      try { setApps(JSON.parse(saved)); } catch { /* corrupted data, reset */ }
    }
  }, []);

  const save = (updated: Application[]) => {
    setApps(updated);
    localStorage.setItem("rmo_applications", JSON.stringify(updated));
  };

  const handleSubmit = () => {
    if (!form.hospital) return;
    if (editingId) {
      save(apps.map((a) => (a.id === editingId ? { ...form, id: editingId } : a)));
      setEditingId(null);
    } else {
      save([...apps, { ...form, id: Date.now().toString() }]);
    }
    setForm(emptyApp);
    setShowForm(false);
  };

  const handleEdit = (app: Application) => {
    const { id, ...rest } = app;
    setForm(rest);
    setEditingId(id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this application?")) {
      save(apps.filter((a) => a.id !== id));
    }
  };

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = apps.filter((a) => a.status === s).length;
    return acc;
  }, {} as Record<Status, number>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Application Tracker</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Track all your Australian hospital job applications in one place
        </p>
      </div>

      {/* Type filter */}
      <div className="flex gap-3">
        {(["All", "RMO", "GP"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              typeFilter === t
                ? "bg-brand-700 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {t === "All" ? `All (${apps.length})` : `${t} (${apps.filter(a => a.appType === t).length})`}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {STATUSES.map((s) => (
          <div key={s} className="bg-white rounded-xl border border-gray-200 p-3 text-center">
            <div className="text-2xl font-bold text-gray-900">{counts[s]}</div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[s]}`}>{s}</span>
          </div>
        ))}
      </div>

      {/* Add Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">
          Applications ({apps.length})
        </h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setForm(emptyApp);
          }}
          className="flex items-center gap-2 bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Application
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl border-2 border-brand-300 p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">
            {editingId ? "Edit Application" : "New Application"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Application Type</label>
              <select
                value={form.appType}
                onChange={(e) => setForm({
                  ...form,
                  appType: e.target.value as AppType,
                  role: e.target.value === "GP" ? "General Practitioner (GP)" : "Resident Medical Officer (RMO)",
                })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              >
                <option value="RMO">RMO (Resident Medical Officer)</option>
                <option value="GP">GP (General Practitioner)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Hospital / Employer *</label>
              <input
                type="text"
                value={form.hospital}
                onChange={(e) => setForm({ ...form, hospital: e.target.value })}
                placeholder="e.g. Royal Darwin Hospital"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">State</label>
              <select
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              >
                {["WA", "NT", "QLD", "NSW", "VIC", "SA", "TAS", "ACT"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Role</label>
              <input
                type="text"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Applied Date</label>
              <input
                type="date"
                value={form.appliedDate}
                onChange={(e) => setForm({ ...form, appliedDate: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Status })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              >
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Salary Offered</label>
              <input
                type="text"
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: e.target.value })}
                placeholder="e.g. AUD $85,000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Contact Name</label>
              <input
                type="text"
                value={form.contactName}
                onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Contact Email</label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
              <input
                type="text"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Any notes about this application"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
            >
              <Check className="w-4 h-4" />
              {editingId ? "Update" : "Save"}
            </button>
            <button
              onClick={() => { setShowForm(false); setEditingId(null); }}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Applications List */}
      {apps.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500 mb-2">No applications tracked yet.</p>
          <p className="text-sm text-gray-400">Click &quot;Add Application&quot; to start tracking your job search.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {apps.filter(a => typeFilter === "All" || a.appType === typeFilter).map((app) => (
            <div key={app.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{app.hospital}</h3>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${appTypeColors[app.appType ?? "RMO"]}`}>
                      {app.appType ?? "RMO"}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{app.state}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[app.status]}`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{app.role}</p>
                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                    {app.appliedDate && <span>Applied: {app.appliedDate}</span>}
                    {app.salary && <span className="text-green-600 font-medium">{app.salary}</span>}
                    {app.contactName && <span>Contact: {app.contactName}</span>}
                    {app.contactEmail && (
                      <a href={`mailto:${app.contactEmail}`} className="text-brand-600 hover:underline">
                        {app.contactEmail}
                      </a>
                    )}
                  </div>
                  {app.notes && (
                    <p className="mt-2 text-sm text-gray-500 italic">{app.notes}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(app)}
                    className="p-2 text-gray-400 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(app.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 text-center pb-4">Data is saved locally in your browser.</p>
    </div>
  );
}
