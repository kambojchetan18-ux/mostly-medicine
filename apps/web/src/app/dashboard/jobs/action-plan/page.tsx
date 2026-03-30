import { nextSteps } from "@/lib/jobPools";
import { ExternalLink, Clock, AlertCircle, AlertTriangle, Info } from "lucide-react";

const urgencyConfig: Record<string, { label: string; color: string; icon: React.ReactNode; border: string }> = {
  critical: {
    label: "Critical — Do Now",
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
};

const ahpraSteps = [
  { num: 1, text: "Create an AHPRA account at ahpra.gov.au" },
  { num: 2, text: "Select 'New Registrant → Medical Practitioner → General Registration'" },
  { num: 3, text: "Upload: AMC Certificate, MBBS degree, internship certificate, passport, good standing certificate from Medical Council of India" },
  { num: 4, text: "Pay the application fee (~AUD $410)" },
  { num: 5, text: "Wait 4–8 weeks for identity verification and document assessment" },
  { num: 6, text: "AHPRA may issue 'Supervised Practice' conditions — hospitals accept this and provide supervision" },
  { num: 7, text: "Once registered, apply to hospitals — many accept applications with 'AHPRA pending' status" },
];

const cvTips = {
  exclude: ["Photo / headshot", "Date of birth or age", "Marital status", "Nationality / religion", "Caste / community", "Father's name"],
  include: [
    "AMC Candidate Number and exam pass dates",
    "AHPRA number (once registered)",
    "Medanta hospital with bed count and case load",
    "Specific procedures/skills (intubation, central lines, etc.)",
    "2–3 referees (names + direct email/phone)",
    "Australian address (if you have one)",
    "Cover letter tailored per hospital",
  ],
};

export default function ActionPlanPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Your Complete Action Plan</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Step-by-step guide from where you are now to your first Australian RMO job
        </p>
      </div>

      {/* Main Steps */}
      <section>
        <h2 className="text-xl font-bold mb-5">Action Steps — Prioritized</h2>
        <div className="space-y-4">
          {nextSteps.map((step) => {
            const config = urgencyConfig[step.urgency];
            return (
              <div key={step.step} className={`bg-white rounded-xl border-2 p-6 ${config.border}`}>
                <div className="flex flex-wrap items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 font-bold text-gray-700 flex-shrink-0 text-lg">
                    {step.step}
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
                    <a
                      href={step.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-4 bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-800 transition-colors"
                    >
                      {step.linkText} <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* AHPRA Deep Dive */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">🏥</span>
          AHPRA Registration — Step by Step
        </h2>
        <p className="text-gray-600 mb-4 text-sm">
          Since you have cleared <strong>both AMC CAT1 and CAT2</strong>, you are eligible for <strong>General Registration</strong> (not just provisional).
          This is a significant advantage — most new IMGs start with provisional/supervised status.
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
            <strong>Pro tip:</strong> Many WA Country Health and NT hospitals issue <em>conditional offers</em> while your AHPRA registration is pending.
            Apply now — don&apos;t wait for the AHPRA certificate.
          </p>
        </div>
      </section>

      {/* CV Tips */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">📄</span>
          Australian Medical CV — Key Differences from Indian Format
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 text-red-600">Do NOT include:</h3>
            <ul className="space-y-1.5 text-sm text-gray-700">
              {cvTips.exclude.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-red-400">✗</span> {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 text-green-600">DO include:</h3>
            <ul className="space-y-1.5 text-sm text-gray-700">
              {cvTips.include.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-green-500">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Agencies */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">🤝</span>
          Medical Recruitment Agencies — Register Now
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          These agencies specialize in placing IMGs and often have positions not advertised publicly.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: "Medrecruit", url: "https://www.medrecruit.com.au/", note: "Largest IMG medical recruiter in Australia — strong rural network" },
            { name: "Wavelength International", url: "https://www.wavelength.com.au/", note: "Specializes in locum and permanent IMG placement" },
            { name: "Health Workforce (Govt)", url: "https://www.health.gov.au/our-work/health-workforce", note: "Federal govt — rural incentives, DWS locator, workforce programs" },
            { name: "RDAA (Rural Doctors Assoc)", url: "https://www.rdaa.com.au/", note: "Rural GP support and placement across all states" },
            { name: "Rural Health West", url: "https://www.ruralhealthwest.com.au/", note: "WA-specific — places IMGs in WA rural/remote areas" },
            { name: "RWAV", url: "https://www.rwav.com.au/", note: "Rural Workforce Agency Victoria — VIC rural placement" },
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
        Always verify requirements with AHPRA and employers directly.
      </p>
    </div>
  );
}
