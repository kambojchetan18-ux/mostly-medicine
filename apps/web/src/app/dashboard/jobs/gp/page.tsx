import { gpPools, pesciSteps, gpVsRmo } from "@/lib/gpPools";
import { ExternalLink, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";

export default function GPPathwayPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">GP Pathway — Plan B (But Often Better)</h1>
          <p className="text-gray-500 mt-1 text-sm">
            General Practice jobs via PESCI, DWS, and Area of Need — higher income than RMO
          </p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm">
          <p className="text-emerald-600 text-xs mb-1">GP vs RMO Salary</p>
          <p className="font-bold text-2xl text-emerald-800">$180K–$300K+</p>
          <p className="text-xs text-emerald-600">vs RMO $75K–$98K</p>
        </div>
      </div>

      {/* RMO vs GP Comparison */}
      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          RMO vs GP — Which is Right for You?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl border border-brand-200 p-5">
            <h3 className="font-bold text-brand-700 text-lg mb-4">RMO (Plan A)</h3>
            <div className="mb-4">
              <p className="text-xs font-semibold text-green-600 uppercase mb-2">Pros</p>
              <ul className="space-y-2">
                {gpVsRmo.rmo.pros.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-red-500 uppercase mb-2">Cons</p>
              <ul className="space-y-2">
                {gpVsRmo.rmo.cons.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm text-gray-700">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-emerald-200 p-5">
            <h3 className="font-bold text-emerald-700 text-lg mb-4">GP — via PESCI or DWS/AoN</h3>
            <div className="mb-4">
              <p className="text-xs font-semibold text-green-600 uppercase mb-2">Pros</p>
              <ul className="space-y-2">
                {gpVsRmo.gp.pros.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-red-500 uppercase mb-2">Cons</p>
              <ul className="space-y-2">
                {gpVsRmo.gp.cons.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm text-gray-700">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-900">
          <strong>Recommended strategy:</strong> Pursue RMO as primary path (faster, no PESCI needed) and GP as parallel track.
          For GP, focus on <strong>DWS/AoN rural areas first</strong> — you can start without PESCI in a District of Workforce Shortage.
          NT, rural NSW, and rural WA are entirely DWS — highest income, fastest start.
        </div>
      </section>

      {/* PESCI Steps */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-2">PESCI Pathway — Step by Step</h2>
        <p className="text-sm text-gray-500 mb-5">
          PESCI = Pre-Employment Structured Clinical Interview. Required for GP fellowship training (AGPT/ACRRM program).
          <strong className="text-emerald-700"> Not required for DWS/AoN rural GP positions.</strong>
        </p>
        <div className="space-y-4">
          {pesciSteps.map((s) => (
            <div key={s.step} className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                {s.step}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{s.title}</p>
                <p className="text-sm text-gray-600 mt-0.5">{s.detail}</p>
                {"link" in s && (
                  <a
                    href={s.link as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-1.5 text-xs text-emerald-600 hover:text-emerald-800 font-medium"
                  >
                    {s.linkText as string} <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GP Job Pools */}
      <section>
        <h2 className="text-xl font-bold mb-4">GP Job Pools — Sorted by Demand</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gpPools.map((pool) => (
            <div key={pool.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">{pool.name}</h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {pool.state}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      pool.region === "Remote" ? "bg-red-100 text-red-700" :
                      pool.region === "Rural" ? "bg-orange-100 text-orange-700" :
                      pool.region === "National" ? "bg-blue-100 text-blue-700" :
                      "bg-purple-100 text-purple-700"
                    }`}>
                      {pool.region}
                    </span>
                    {!pool.pesciRequired && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                        No PESCI needed
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-400">Demand</p>
                  <p className="font-bold text-lg text-gray-900">{pool.demandScore}/10</p>
                </div>
              </div>

              <div className="h-1.5 bg-gray-100 rounded-full mb-3">
                <div
                  className={`h-1.5 rounded-full ${pool.demandScore >= 9 ? "bg-red-500" : pool.demandScore >= 7 ? "bg-orange-400" : "bg-yellow-400"}`}
                  style={{ width: `${pool.demandScore * 10}%` }}
                />
              </div>

              <div className="space-y-1.5 text-sm mb-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Positions:</span>
                  <span className="font-medium text-gray-800">{pool.positions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Salary:</span>
                  <span className="font-bold text-emerald-600">{pool.salary}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">PESCI Required:</span>
                  <span className={pool.pesciRequired ? "text-orange-600 font-medium" : "text-green-600 font-medium"}>
                    {pool.pesciRequired ? "Yes" : "No — DWS/AoN"}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-600 mb-3">{pool.notes}</p>

              <a
                href={pool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-800 font-medium"
              >
                View opportunities <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Key agencies for GP */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold mb-4">GP Recruitment Agencies & Training Bodies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: "RACGP — PESCI & Fellowship", url: "https://www.racgp.org.au/education/imgs/fellowship-pathways/pesci", desc: "Apply for PESCI here. Also manages FRACGP fellowship training." },
            { name: "ACRRM — Rural GP Fellowship", url: "https://www.acrrm.org.au/", desc: "Rural-focused fellowship. FACRRM is faster and more accessible for rural IMGs." },
            { name: "AGPT — GP Training", url: "https://www.agpt.com.au/", desc: "National GP training program — apply here for registrar training places." },
            { name: "Health.gov.au — DWS/AoN Locator", url: "https://www.health.gov.au/our-work/health-workforce/programs/distribution-priority-area", desc: "Find Distribution Priority Areas — where you can work as GP without PESCI immediately." },
            { name: "Rural Health West (WA GP)", url: "https://www.ruralhealthwest.com.au/gps/", desc: "WA rural GP placement — most vacancies in Kimberley and Pilbara." },
            { name: "RDAA (Rural Doctors Assoc Australia)", url: "https://www.rdaa.com.au/", desc: "Rural GP support and placement across SA and all states." },
            { name: "RACGP GP Training", url: "https://www.racgp.org.au/gptraining", desc: "RACGP's GP training pathway — fellowship and registrar program info." },
            { name: "IMG Connect Australia", url: "https://www.medrecruit.com.au/", desc: "Medrecruit — specialist IMG recruiter covering GP and RMO placements." },
          ].map((a) => (
            <a
              key={a.name}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-200 rounded-lg p-3 hover:border-emerald-300 hover:bg-emerald-50 transition-colors group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-emerald-700 text-sm group-hover:text-emerald-800">{a.name}</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              </div>
              <p className="text-xs text-gray-500">{a.desc}</p>
            </a>
          ))}
        </div>
      </section>

      <p className="text-xs text-gray-400 text-center pb-4">
        Always verify PESCI requirements, DWS status, and salary ranges directly with RACGP, ACRRM, and employers.
      </p>
    </div>
  );
}
