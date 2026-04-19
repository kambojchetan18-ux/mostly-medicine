import Link from "next/link";
import { ExternalLink, Clock, AlertCircle, AlertTriangle, Info, Upload, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { type IMGProfile } from "@/lib/imgProfile";
import { generateActionPlan, type ActionStep } from "@/lib/generateActionPlan";

const urgencyConfig: Record<ActionStep["urgency"], { label: string; color: string; icon: React.ReactNode; border: string }> = {
  critical: {
    label: "Do Now",
    color: "bg-red-100 text-red-700",
    border: "border-red-200",
    icon: <AlertCircle className="w-4 h-4 text-red-500" />,
  },
  high: {
    label: "High Priority",
    color: "bg-orange-100 text-orange-700",
    border: "border-orange-200",
    icon: <AlertTriangle className="w-4 h-4 text-orange-500" />,
  },
  moderate: {
    label: "Moderate",
    color: "bg-blue-100 text-blue-700",
    border: "border-blue-200",
    icon: <Info className="w-4 h-4 text-blue-500" />,
  },
  info: {
    label: "Info",
    color: "bg-gray-100 text-gray-600",
    border: "border-gray-200",
    icon: <Info className="w-4 h-4 text-gray-400" />,
  },
};

const ahpraSteps = [
  { num: 1, text: "Create an AHPRA account at ahpra.gov.au" },
  { num: 2, text: "Select: Registration → New Registrant → Medical Practitioner → General Registration" },
  { num: 3, text: "Upload: AMC Certificate, MBBS/MD degree, internship completion certificate, passport, and Good Standing Certificate from your home Medical Council" },
  { num: 4, text: "Pay the registration fee (~AUD $410)" },
  { num: 5, text: "Wait 4–8 weeks for identity verification and document assessment" },
  { num: 6, text: "AHPRA may add 'Supervised Practice' conditions — hospitals provide supervision and many accept these conditions" },
  { num: 7, text: "Start applying to hospitals now — don't wait for the AHPRA certificate to arrive" },
];

const cvTips = {
  exclude: ["Photo / headshot", "Date of birth or age", "Marital status", "Nationality / religion", "Caste or community details", "Father's or spouse's name"],
  include: [
    "AMC Candidate Number and exam pass dates",
    "AHPRA number (once registered)",
    "Hospital name with bed count and annual case volume",
    "Specific procedures and clinical skills (e.g. intubation, central lines, lumbar puncture)",
    "2–3 referees with direct email and phone — Australian referees preferred",
    "Australian address if you have one",
    "Cover letter tailored to each hospital and position",
  ],
};

export default async function ActionPlanPage() {
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

  const hasCv = profile !== null;
  const steps = hasCv ? generateActionPlan(profile!) : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Your Action Plan</h1>
        <p className="text-gray-500 mt-1 text-sm">
          {hasCv
            ? `Personalised steps for ${profile!.name ?? "your profile"} — prioritised by urgency`
            : "Upload your CV to get a personalised step-by-step plan"}
        </p>
      </div>

      {/* ── NO CV: CTA ─────────────────────────────────────────────────────────── */}
      {!hasCv && (
        <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-2xl p-8 text-white text-center space-y-4">
          <div className="text-4xl">📋</div>
          <h2 className="text-xl font-bold">No profile found</h2>
          <p className="text-brand-100 max-w-md mx-auto">
            Upload your CV and Claude will analyse your qualifications, exam status, and visa — then build a personalised, prioritised action plan just for you.
          </p>
          <Link
            href="/dashboard/profile"
            className="inline-flex items-center gap-2 bg-white text-brand-700 font-semibold px-6 py-3 rounded-xl hover:bg-brand-50 transition"
          >
            <Upload className="w-4 h-4" /> Upload CV Free
          </Link>
        </div>
      )}

      {/* ── WITH CV: Personalised Steps ─────────────────────────────────────────── */}
      {hasCv && steps.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-4 text-gray-800">Action Steps — Prioritised</h2>
          <div className="space-y-4">
            {steps.map((step) => {
              const config = urgencyConfig[step.urgency];
              return (
                <div
                  key={step.step}
                  className={`bg-white rounded-xl border-2 p-6 ${step.isWarning ? "border-red-300 bg-red-50" : config.border}`}
                >
                  <div className="flex flex-wrap items-start gap-4">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold flex-shrink-0 text-lg ${step.isWarning ? "bg-red-200 text-red-700" : "bg-gray-100 text-gray-700"}`}>
                      {step.isWarning ? "!" : step.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-bold text-gray-900 text-lg">{step.title}</h3>
                        <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${config.color}`}>
                          {config.icon}
                          {config.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mb-3 text-gray-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-sm">{step.timeEstimate}</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{step.description}</p>
                      {step.link.startsWith("/") ? (
                        <Link
                          href={step.link}
                          className="inline-flex items-center gap-2 mt-4 bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-800 transition-colors"
                        >
                          {step.linkText} <CheckCircle className="w-3.5 h-3.5" />
                        </Link>
                      ) : (
                        <a
                          href={step.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 mt-4 bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-800 transition-colors"
                        >
                          {step.linkText} <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── AHPRA Deep Dive — shown only for standard pathway users ───────────── */}
      {(!hasCv || (profile?.doctor_type !== "specialist" && profile?.doctor_type !== "non_doctor")) && (
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4">AHPRA Registration — Step by Step</h2>
          <p className="text-gray-600 mb-4 text-sm">
            AHPRA is Australia&apos;s national health practitioner regulator. Medical practitioners need AHPRA registration to work in any Australian hospital.
            {profile?.amc_cat1 === "passed" && profile?.amc_cat2 === "passed"
              ? " Since you have cleared both AMC exams, you qualify for General Registration (not just supervised/provisional)."
              : " You will be eligible to apply once both AMC exams are cleared."}
          </p>
          <div className="space-y-3">
            {ahpraSteps.map((s) => (
              <div key={s.num} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {s.num}
                </div>
                <p className="text-sm text-gray-700 pt-1">{s.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Pro tip:</strong> WA Country Health and NT hospitals issue <em>conditional offers</em> while your AHPRA application is pending.
              Apply now — don&apos;t wait for the certificate.
            </p>
          </div>
        </section>
      )}

      {/* ── CV Tips — always useful ──────────────────────────────────────────── */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-4">Australian Medical CV — Key Differences</h2>
        <p className="text-sm text-gray-500 mb-4">Australian medical CVs look very different from Indian, UK, or US formats. These tips apply to all IMGs.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-red-600 mb-3">Do NOT include:</h3>
            <ul className="space-y-1.5 text-sm text-gray-700">
              {cvTips.exclude.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-red-400 shrink-0">✗</span> {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-green-600 mb-3">DO include:</h3>
            <ul className="space-y-1.5 text-sm text-gray-700">
              {cvTips.include.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-green-500 shrink-0">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Recruitment Agencies ─────────────────────────────────────────────── */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-2">Medical Recruitment Agencies</h2>
        <p className="text-sm text-gray-500 mb-4">
          These agencies specialise in placing IMGs and often have positions not advertised publicly. Register with several — it&apos;s free.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: "Medrecruit", url: "https://www.medrecruit.com.au/", note: "Largest IMG medical recruiter in Australia — strong rural and NT network" },
            { name: "Wavelength International", url: "https://www.wavelength.com.au/", note: "Specialises in locum and permanent IMG placement nationally" },
            { name: "Health Workforce Locator (Govt)", url: "https://www.health.gov.au/resources/apps-and-tools/health-workforce-locator", note: "Federal govt — interactive DWS map, find workforce shortage areas by specialty" },
            { name: "RDAA", url: "https://www.rdaa.com.au/", note: "Rural Doctors Association — rural GP support and placement across all states" },
            { name: "Rural Health West", url: "https://www.ruralhealthwest.com.au/", note: "WA-specific — places IMGs in WA rural and remote positions" },
            { name: "RWAV", url: "https://www.rwav.com.au/", note: "Rural Workforce Agency Victoria — VIC rural GP placement" },
          ].map((agency) => (
            <a
              key={agency.name}
              href={agency.url}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-200 rounded-lg p-4 hover:border-brand-300 hover:bg-brand-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-brand-700">{agency.name}</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <p className="text-xs text-gray-600">{agency.note}</p>
            </a>
          ))}
        </div>
      </section>

      <p className="text-xs text-gray-400 text-center pb-4">
        Always verify requirements directly with AHPRA, AMC, and individual employers. Information current as of early 2026.
      </p>
    </div>
  );
}
