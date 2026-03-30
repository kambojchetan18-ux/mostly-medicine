import { states } from "@/lib/jobPools";
import { MapPin, ExternalLink, Star, TrendingUp } from "lucide-react";

const demandBg: Record<string, string> = {
  "Very High": "bg-red-50 border-red-300",
  High: "bg-orange-50 border-orange-300",
  Moderate: "bg-yellow-50 border-yellow-200",
  Low: "bg-gray-50 border-gray-200",
};

const demandBadge: Record<string, string> = {
  "Very High": "bg-red-100 text-red-700",
  High: "bg-orange-100 text-orange-700",
  Moderate: "bg-yellow-100 text-yellow-700",
  Low: "bg-gray-100 text-gray-600",
};

const regionColor: Record<string, string> = {
  Metro: "bg-blue-100 text-blue-700",
  Regional: "bg-purple-100 text-purple-700",
  Rural: "bg-green-100 text-green-700",
};

export default function RMOPoolsPage() {
  const sortedStates = [...states].sort((a, b) => b.demandScore - a.demandScore);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-brand-700" />
          Australian RMO Job Pools
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Sorted by demand for International Medical Graduates (IMGs)
        </p>
      </div>

      {/* Summary table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Quick Comparison</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3 text-left">State</th>
                <th className="px-4 py-3 text-left">IMG Demand</th>
                <th className="px-4 py-3 text-left">Positions/Year</th>
                <th className="px-4 py-3 text-left">Salary Range</th>
                <th className="px-4 py-3 text-left">Hiring Season</th>
                <th className="px-4 py-3 text-left">IMG Friendly</th>
                <th className="px-4 py-3 text-left">Apply</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedStates.map((state) => (
                <tr key={state.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    <a href={`#${state.id}`} className="hover:text-brand-700">
                      {state.shortName} — {state.name}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${demandBadge[state.demandLevel]}`}>
                      {state.demandLevel} ({state.demandScore}/10)
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{state.rmoPositions}</td>
                  <td className="px-4 py-3 text-gray-600">{state.avgSalary}</td>
                  <td className="px-4 py-3 text-gray-600">{state.hiringSeasons[0]}</td>
                  <td className="px-4 py-3">
                    {state.imgFriendly ? (
                      <Star className="w-4 h-4 text-yellow-500" />
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={state.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-700 hover:text-brand-800 flex items-center gap-1"
                    >
                      Apply <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* State Detail Cards */}
      {sortedStates.map((state) => (
        <div
          key={state.id}
          id={state.id}
          className={`rounded-xl border-2 p-6 scroll-mt-20 ${demandBg[state.demandLevel]}`}
        >
          <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-900">{state.shortName}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${demandBadge[state.demandLevel]}`}>
                  {state.demandLevel} Demand
                </span>
                {state.imgFriendly && (
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-700 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5" /> IMG Friendly
                  </span>
                )}
              </div>
              <p className="text-gray-600 mt-1">{state.name}</p>
            </div>
            <a
              href={state.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-800 transition-colors"
            >
              Apply Now <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-500">RMO Positions</p>
              <p className="font-bold text-gray-900">{state.rmoPositions}</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-500">Salary Range</p>
              <p className="font-bold text-gray-900 text-xs">{state.avgSalary}</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-500">Hospitals</p>
              <p className="font-bold text-gray-900">{state.totalHospitals}</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-500">Demand Score</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full">
                  <div
                    className={`h-1.5 rounded-full ${state.demandScore >= 8 ? "bg-red-500" : "bg-orange-400"}`}
                    style={{ width: `${state.demandScore * 10}%` }}
                  />
                </div>
                <span className="font-bold text-gray-900 text-sm">{state.demandScore}/10</span>
              </div>
            </div>
          </div>

          {/* Hiring Seasons */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Hiring Seasons</p>
            <div className="flex flex-wrap gap-2">
              {state.hiringSeasons.map((season) => (
                <span key={season} className="bg-white border border-gray-200 px-3 py-1 rounded-full text-sm text-gray-700">
                  {season}
                </span>
              ))}
            </div>
          </div>

          {/* Key Pools */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Hospital Networks / Pools
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {state.keyPools
                .sort((a, b) => b.demandScore - a.demandScore)
                .map((pool) => (
                  <div key={pool.name} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="font-medium text-gray-900 text-sm">{pool.name}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${regionColor[pool.region]}`}>
                        {pool.region}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                        <div
                          className={`h-1.5 rounded-full ${pool.demandScore >= 9 ? "bg-red-500" : pool.demandScore >= 7 ? "bg-orange-400" : "bg-yellow-400"}`}
                          style={{ width: `${pool.demandScore * 10}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{pool.demandScore}/10</span>
                    </div>
                    <p className="text-xs text-gray-600">{pool.notes}</p>
                    <a
                      href={pool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-xs text-brand-700 hover:text-brand-800"
                    >
                      Visit <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
            </div>
          </div>

          {/* Tips */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Tips for IMGs</p>
            <ul className="space-y-1.5">
              {state.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-brand-600 mt-0.5 flex-shrink-0">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      <p className="text-xs text-gray-400 text-center pb-4">
        Always verify positions and requirements directly with hospitals and AHPRA.
      </p>
    </div>
  );
}
