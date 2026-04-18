import Link from "next/link";
import { MapPin, Stethoscope, ClipboardList, CheckCircle, AlertCircle, Upload, Award } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { computeReadiness, PATHWAY_LABELS, type IMGProfile } from "@/lib/imgProfile";

const navCards = [
  {
    href:       "/dashboard/jobs/rmo",
    icon:       <MapPin className="w-6 h-6 text-brand-700" />,
    title:      "RMO Job Pools",
    desc:       "6 states sorted by IMG demand — WA, NT, QLD, NSW, VIC, SA",
    badge:      "Plan A",
    badgeColor: "bg-brand-100 text-brand-700",
    salary:     "$75K–$105K",
  },
  {
    href:       "/dashboard/jobs/gp",
    icon:       <Stethoscope className="w-6 h-6 text-emerald-700" />,
    title:      "GP Pathway",
    desc:       "DWS/AoN rural GP positions — no PESCI needed for many areas",
    badge:      "Plan B (Often Better)",
    badgeColor: "bg-emerald-100 text-emerald-700",
    salary:     "$180K–$300K+",
  },
  {
    href:       "/dashboard/jobs/action-plan",
    icon:       <CheckCircle className="w-6 h-6 text-green-700" />,
    title:      "Action Plan",
    desc:       "Prioritised steps from where you are now to first Australian job",
    badge:      "Do These Now",
    badgeColor: "bg-orange-100 text-orange-700",
    salary:     null,
  },
  {
    href:       "/dashboard/jobs/specialist",
    icon:       <Award className="w-6 h-6 text-purple-700" />,
    title:      "Specialist Pathway",
    desc:       "OTS assessment, college recognition, AHPRA specialist registration",
    badge:      "Consultants",
    badgeColor: "bg-purple-100 text-purple-700",
    salary:     "$220K–$500K+",
  },
  {
    href:       "/dashboard/jobs/tracker",
    icon:       <ClipboardList className="w-6 h-6 text-gray-600" />,
    title:      "Application Tracker",
    desc:       "Track RMO and GP job applications in one place",
    badge:      "Personal",
    badgeColor: "bg-gray-100 text-gray-600",
    salary:     null,
  },
];

const AMC_STEPS = [
  { step: "1", title: "English Proficiency", detail: "OET (recommended) or IELTS Academic. OET is medical-specific and preferred by AHPRA.", time: "~3–6 months prep" },
  { step: "2", title: "AMC CAT 1 — MCQ Exam", detail: "Computer-based, 150 questions, 3.5 hours. Tests clinical knowledge across all major specialties.", time: "~6–12 months prep" },
  { step: "3", title: "AMC CAT 2 — Clinical Exam", detail: "16 OSCE stations × 8 min. Tests clinical skills, communication, and management.", time: "~3–6 months prep" },
  { step: "4", title: "AHPRA Registration", detail: "Apply online with your AMC certificate, identity documents, and referee reports.", time: "4–12 weeks processing" },
  { step: "5", title: "Intern Year (if needed)", detail: "Required if you have <2 years postgraduate experience. Many IMGs are exempt.", time: "1 year" },
  { step: "6", title: "RMO / GP Application", detail: "Apply to state RMO pools or DWS/AoN GP positions. NT, WA, and rural areas hire fastest.", time: "Ongoing" },
];

export default async function JobsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile: IMGProfile | null = null;
  if (user) {
    const { data } = await supabase
      .from("img_profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    profile = data ?? null;
  }

  const computed = profile ? computeReadiness(profile) : null;
  const pathwayInfo = computed ? PATHWAY_LABELS[computed.pathway] : null;

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Australian Medical Jobs</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {profile
              ? `Welcome, ${profile.name ?? "Doctor"} — your personalised IMG pathway`
              : "Your pathway to Australian medical practice — for IMGs worldwide"}
          </p>
        </div>
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-2 text-sm px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium transition"
        >
          <Upload className="w-4 h-4" />
          {profile ? "Update CV" : "Upload CV"}
        </Link>
      </div>

      {/* ── WITH PROFILE: Personalised readiness ──────────────────────────── */}
      {profile && computed && pathwayInfo ? (
        <>
          {/* Pathway banner */}
          <div className={`rounded-xl border px-4 py-3 ${pathwayInfo.color}`}>
            <p className="font-semibold">{pathwayInfo.label}</p>
            <p className="text-sm mt-0.5 opacity-80">{pathwayInfo.next}</p>
          </div>

          {/* Readiness score */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Your Readiness Score</p>
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-bold text-brand-700">{computed.score}%</span>
                  <div className="w-32 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-3 bg-brand-600 rounded-full" style={{ width: `${computed.score}%` }} />
                  </div>
                </div>
                {computed.blockers.length > 0 && (
                  <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <p className="text-sm text-amber-800 font-medium">
                      {computed.blockers.length === 1
                        ? `Blocker: ${computed.blockers[0]}`
                        : `${computed.blockers.length} blockers remaining`}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {computed.items.map(item => (
                  <span
                    key={item.label}
                    className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${item.cleared ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                  >
                    {item.cleared ? "✓" : "⏳"} {item.label.split(" (")[0]}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Profile details */}
          {(profile.degree_country || profile.years_experience) && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {profile.degree_country && (
                <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                  <p className="text-xs text-gray-400">Degree from</p>
                  <p className="font-semibold text-sm text-gray-900 mt-0.5">{profile.degree_country}</p>
                </div>
              )}
              {profile.years_experience && (
                <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                  <p className="text-xs text-gray-400">Experience</p>
                  <p className="font-semibold text-sm text-gray-900 mt-0.5">{profile.years_experience} yrs post-grad</p>
                </div>
              )}
              {profile.specialties?.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm col-span-2">
                  <p className="text-xs text-gray-400">Specialties</p>
                  <p className="font-semibold text-sm text-gray-900 mt-0.5">{profile.specialties.slice(0, 3).join(", ")}</p>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        /* ── WITHOUT PROFILE: Generic IMG guide + CTA ─────────────────────── */
        <>
          {/* Upload CTA */}
          <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-2xl p-6 text-white flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-bold text-lg">See your personalised pathway</p>
              <p className="text-brand-100 text-sm mt-0.5">Upload your CV and get your Australian readiness score in 30 seconds.</p>
            </div>
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-2 bg-white text-brand-700 font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-brand-50 transition shrink-0"
            >
              <Upload className="w-4 h-4" /> Upload CV Free
            </Link>
          </div>

          {/* Generic pathway steps */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">The AMC Pathway for IMGs</h2>
              <p className="text-sm text-gray-500 mt-0.5">Standard route to Australian medical registration</p>
            </div>
            <div className="divide-y divide-gray-100">
              {AMC_STEPS.map((s) => (
                <div key={s.step} className="flex items-start gap-4 px-5 py-4">
                  <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                    {s.step}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{s.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{s.detail}</p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0 hidden sm:block">{s.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Second CTA */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex flex-wrap items-center gap-4">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-900">Not sure where you are in the pathway?</p>
              <p className="text-sm text-amber-700 mt-0.5">Upload your CV and we&apos;ll tell you exactly which step you&apos;re on and what to do next.</p>
            </div>
            <Link href="/dashboard/profile" className="shrink-0 text-sm font-semibold text-amber-800 underline hover:text-amber-900">
              Upload now →
            </Link>
          </div>
        </>
      )}

      {/* Navigation cards — always shown */}
      <div>
        <h2 className="font-bold text-gray-900 mb-3">Explore the Portal</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {navCards.map((card) => (
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
                  {card.salary && <p className="text-xs font-semibold text-emerald-600 mt-0.5">{card.salary}/yr</p>}
                </div>
              </div>
              <p className="text-sm text-gray-600">{card.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center pb-4">
        Data based on publicly available information as of early 2026. Always verify with AHPRA, hospitals, and employers.
      </p>
    </div>
  );
}
