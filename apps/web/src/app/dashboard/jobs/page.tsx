import Link from "next/link";
import { MapPin, Stethoscope, ClipboardList, CheckCircle, AlertCircle } from "lucide-react";
import { profileReadiness } from "@/lib/jobPools";

const totalWeight = Object.values(profileReadiness).reduce((s, v) => s + v.weight, 0);
const clearedWeight = Object.values(profileReadiness)
  .filter((v) => v.cleared)
  .reduce((s, v) => s + v.weight, 0);
const readinessScore = Math.round((clearedWeight / totalWeight) * 100);

const cards = [
  {
    href: "/dashboard/jobs/rmo",
    icon: <MapPin className="w-6 h-6 text-brand-700" />,
    title: "RMO Job Pools",
    desc: "6 states sorted by IMG demand — WA, NT, QLD, NSW, VIC, SA",
    badge: "Plan A",
    badgeColor: "bg-brand-100 text-brand-700",
    salary: "$75K–$105K",
  },
  {
    href: "/dashboard/jobs/gp",
    icon: <Stethoscope className="w-6 h-6 text-emerald-700" />,
    title: "GP Pathway",
    desc: "DWS/AoN rural GP positions — no PESCI needed for many areas",
    badge: "Plan B (Often Better)",
    badgeColor: "bg-emerald-100 text-emerald-700",
    salary: "$180K–$300K+",
  },
  {
    href: "/dashboard/jobs/action-plan",
    icon: <CheckCircle className="w-6 h-6 text-green-700" />,
    title: "Action Plan",
    desc: "6 prioritised steps from where you are now to first Australian job",
    badge: "Do These Now",
    badgeColor: "bg-orange-100 text-orange-700",
    salary: null,
  },
  {
    href: "/dashboard/jobs/tracker",
    icon: <ClipboardList className="w-6 h-6 text-purple-700" />,
    title: "Application Tracker",
    desc: "Track all RMO and GP job applications in one place",
    badge: "Personal",
    badgeColor: "bg-purple-100 text-purple-700",
    salary: null,
  },
];

export default function JobsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Australian Medical Jobs</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Job portal for Dr Amandeep Kamboj — RMO and GP pathways for IMGs
        </p>
      </div>

      {/* Readiness Banner */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Profile Readiness</p>
            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold text-brand-700">{readinessScore}%</span>
              <div className="w-32 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-3 bg-brand-600 rounded-full"
                  style={{ width: `${readinessScore}%` }}
                />
              </div>
            </div>
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <p className="text-sm text-amber-800 font-medium">Only blocker: AHPRA Registration (pending)</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.values(profileReadiness).map((item) => (
              <span
                key={item.label}
                className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${
                  item.cleared
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {item.cleared ? "✓" : "⏳"} {item.label.split(" — ")[0]}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Probability strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "WSLHD (Westmead)", prob: "90–95%", color: "bg-green-50 border-green-200 text-green-800" },
          { label: "NT / WA / NSW Rural", prob: "80–90%", color: "bg-blue-50 border-blue-200 text-blue-800" },
          { label: "Other NSW Metro", prob: "65–75%", color: "bg-yellow-50 border-yellow-200 text-yellow-800" },
        ].map((p) => (
          <div key={p.label} className={`rounded-xl border p-4 ${p.color}`}>
            <p className="text-xs font-medium mb-1">{p.label}</p>
            <p className="text-2xl font-bold">{p.prob}</p>
            <p className="text-xs mt-0.5 opacity-70">Success probability</p>
          </div>
        ))}
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:border-brand-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-brand-50 transition-colors">
                {card.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900">{card.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                </div>
                {card.salary && (
                  <p className="text-xs font-semibold text-emerald-600 mt-0.5">{card.salary}/yr</p>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-600">{card.desc}</p>
          </Link>
        ))}
      </div>

      <p className="text-xs text-gray-400 text-center pb-4">
        Data based on publicly available information as of early 2026. Always verify with AHPRA, hospitals, and employers.
      </p>
    </div>
  );
}
