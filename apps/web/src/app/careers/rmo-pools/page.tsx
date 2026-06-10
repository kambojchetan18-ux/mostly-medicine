'use client';

import Link from 'next/link';
import {
  RMO_POOLS,
  RMO_FALLBACK_LINKS,
  type RmoPool,
  type CycleStatus,
} from '@mostly-medicine/content';

// Inline helper: format ISO date (YYYY-MM-DD) → "14 Jul 2026". Passes through "TBC".
function formatCycleDate(value: string): string {
  if (!value) return 'TBC';
  const trimmed = value.trim();
  if (trimmed.toUpperCase().startsWith('TBC')) return trimmed;
  const iso = /^\d{4}-\d{2}-\d{2}$/;
  if (!iso.test(trimmed)) return trimmed;
  const [y, m, d] = trimmed.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d} ${months[m - 1]} ${y}`;
}

// Status → Tailwind badge classes + label.
function statusBadge(status: CycleStatus): { className: string; label: string } {
  switch (status) {
    case 'confirmed':
      return { className: 'bg-green-100 text-green-800', label: 'Confirmed' };
    case 'estimated':
      return { className: 'bg-yellow-100 text-yellow-800', label: 'Estimated' };
    case 'tbc':
    default:
      return { className: 'bg-red-100 text-red-800', label: 'TBC' };
  }
}

// Build the urgency banner string from the next confirmed windows.
function urgencyHighlights(pools: RmoPool[]): RmoPool[] {
  return pools
    .filter((p) => p.cycle2027.status === 'confirmed')
    .slice(0, 3);
}

export default function RmoPools() {
  const urgentPools = urgencyHighlights(RMO_POOLS);

  return (
    <main className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="bg-gradient-to-b from-saffron-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            RMO & JMO Job Pools
          </h1>
          <p className="text-xl text-gray-700">
            Find and apply to open Resident Medical Officer (RMO) and Junior Medical Officer (JMO)
            talent pools across every Australian state — updated for 2026.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Urgency Alert Banner */}
        <div className="mb-12 p-4 bg-amber-50 border-l-4 border-amber-400 rounded">
          <div className="flex gap-3">
            <span className="text-2xl">🚨</span>
            <div>
              <p className="font-bold text-gray-900 mb-2">
                RMO campaigns are time-sensitive.
              </p>
              <p className="text-gray-700">
                {urgentPools.length > 0 ? (
                  <>
                    {urgentPools
                      .map((p) => `${p.code} opens ${formatCycleDate(p.cycle2027.open)}`)
                      .join(' · ')}
                    . Campaigns close within 4–6 weeks. <strong>Have your documents ready now.</strong>
                  </>
                ) : (
                  <>
                    Campaigns close within 4–6 weeks. <strong>Have your documents ready now.</strong>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Eligibility Pre-Screen */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Am I eligible to apply?</h2>
          <p className="text-gray-700 mb-6">
            Answer these 5 questions before you click Apply. If you're not ready yet, we'll show you exactly what to do next.
          </p>
          <ol className="list-decimal list-inside space-y-3 mb-6 text-gray-700">
            <li>Do you hold, or are you eligible for, AHPRA registration in Australia?</li>
            <li>Have you completed your medical internship in your home country?</li>
            <li>Do you have at least 1 year of post-internship clinical hospital experience?</li>
            <li>Do you have experience across multiple hospital rotations (e.g. medicine, surgery, ED)?</li>
            <li>Do you have a current CV, cover letter, and selection criteria statement ready?</li>
          </ol>
          <p className="text-gray-700">
            If No to questions 1–3 →{' '}
            <Link href="/amc-cat-1" className="text-saffron-600 hover:text-saffron-800 font-semibold">
              Start your AMC preparation first →
            </Link>
          </p>
        </section>

        {/* Campaign Calendar */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">2026 Campaign Calendar — When to Apply</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">State</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Opens</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Closes</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">IMG Eligible</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {RMO_POOLS.map((p) => {
                  const badge = statusBadge(p.cycle2027.status);
                  return (
                    <tr key={p.code}>
                      <td className="border border-gray-300 px-4 py-2">{p.code}</td>
                      <td className="border border-gray-300 px-4 py-2">{formatCycleDate(p.cycle2027.open)}</td>
                      <td className="border border-gray-300 px-4 py-2">{formatCycleDate(p.cycle2027.close)}</td>
                      <td className="border border-gray-300 px-4 py-2">{p.imgEligible ? '✅ Yes' : '❌ No'}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <span className={`px-3 py-1 rounded text-sm ${badge.className}`}>
                          {badge.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Direct RMO / JMO Job Pool Links */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Apply Now — Direct RMO & JMO Links</h2>
          <ul className="space-y-4">
            {RMO_POOLS.map((p) => {
              const isConfirmed = p.cycle2027.status === 'confirmed';
              const isTbc = p.cycle2027.status === 'tbc';
              const wrapperClass = isConfirmed
                ? 'bg-green-50 border-green-400'
                : isTbc
                ? 'bg-gray-50 border-gray-400'
                : 'bg-yellow-50 border-yellow-400';
              return (
                <li key={p.code} className={`p-4 rounded border-l-4 ${wrapperClass}`}>
                  <a
                    href={p.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-saffron-600 hover:text-saffron-800 font-semibold text-lg hover:underline"
                  >
                    {p.state} — {p.applyLabel}
                  </a>
                  {p.imgNotes && <p className="text-gray-600 text-sm mt-2">{p.imgNotes}</p>}
                  {p.directLinks && p.directLinks.length > 0 && (
                    <ul className="mt-3 space-y-2 pl-4 border-l border-gray-300">
                      {p.directLinks.map((dl) => (
                        <li key={dl.url}>
                          <a
                            href={dl.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-saffron-600 hover:text-saffron-800 hover:underline"
                          >
                            {dl.label}
                          </a>
                          {dl.note && <span className="text-gray-600 text-sm"> — {dl.note}</span>}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
            {RMO_FALLBACK_LINKS.map((fb) => (
              <li key={fb.url} className="p-4 rounded border-l-4 bg-saffron-50 border-saffron-400">
                <a
                  href={fb.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-saffron-600 hover:text-saffron-800 font-semibold text-lg hover:underline"
                >
                  {fb.label}
                </a>
                <p className="text-gray-600 text-sm mt-2">{fb.note}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Document Checklist */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📋 Before You Click Apply — Document Checklist</h2>
          <p className="text-gray-700 mb-6">
            Most applications are rejected because of missing or incorrectly formatted documents. Have these ready before you open any application form.
          </p>
          <ul className="space-y-3 mb-6">
            {[
              'Australian-style CV (2–3 pages max; rotation history clearly listed)',
              'Cover letter tailored to the specific state / health service (max 2 pages)',
              'Selection criteria statement with specific clinical examples per criterion',
              'AMC Part 1 certificate or equivalent overseas qualification evidence',
              'English language test result (OET or IELTS — check state-specific requirement)',
              'AHPRA registration confirmation or eligibility evidence / application in progress',
              'Evidence of clinical experience: rotation names, hospital names, duration, recency',
              'Vaccination evidence (Hep B, MMR, Varicella, COVID-19, Influenza)',
              'Work rights / visa documentation (subclass 485, 482, PR, or citizenship)',
              'Two referees briefed and available — current or recent clinical supervisors',
            ].map((item, idx) => (
              <li key={idx} className="flex gap-3 text-gray-700">
                <input type="checkbox" className="mt-1" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-saffron-600 font-semibold">
            <Link href="/careers/cv-checker" className="hover:text-saffron-800">
              → Upload your CV and check your gaps with our free CV analyser
            </Link>
          </p>
        </section>

        {/* Victoria Warning */}
        <section className="mb-12 p-4 bg-orange-50 border-l-4 border-orange-400 rounded">
          <h3 className="font-bold text-gray-900 mb-3">⚠️ Victoria note for IMGs</h3>
          <p className="text-gray-700">
            The main PMCV match process is <strong>not open to most IMGs</strong>.
            The <strong>Late Vacancy Match (LVM) in September–October 2026</strong> is the primary IMG pathway into Victorian public hospitals.
            Most VIC hospitals also recruit directly outside PMCV — check individual hospital career pages regularly from August onwards.
          </p>
        </section>

        {/* Closed Campaign Fallback */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Campaign closed? Don't stop — here's what to do next</h2>
          <ul className="space-y-4 text-gray-700">
            <li>
              <strong>Apply directly to hospitals:</strong> Email the Medical Workforce unit with your CV and a brief expression of interest. Many hospitals fill gaps outside the formal campaign.
            </li>
            <li>
              <strong>Register with locum agencies:</strong>{' '}
              <a
                href="https://medrecruit.medworld.com/doctors/rmo-jobs-australia"
                target="_blank"
                rel="noopener noreferrer"
                className="text-saffron-600 hover:text-saffron-800 font-semibold"
              >
                Medrecruit
              </a>
              , Wavelength, Avant, CHC — short-term RMO locum roles can bridge the gap and build your Australian experience.
            </li>
            <li>
              <strong>Consider the GP pathway:</strong> GP placements count toward AMC and AHPRA pathways, and GP practices often need IMGs year-round with fewer formal barriers.
            </li>
            <li>
              <strong>Check NT and rural/remote positions:</strong> These recruit outside the standard campaign window, have less competition, and often provide AMC/AHPRA-compatible supervised experience.
            </li>
            <li>
              <strong>Continue AMC exam preparation:</strong>{' '}
              <Link href="/amc-cat-1" className="text-saffron-600 hover:text-saffron-800 font-semibold">
                Use Mostly Medicine tools →
              </Link>{' '}
              to fill the time productively and strengthen your application for the next cycle.
            </li>
          </ul>
        </section>

        {/* CV Gap Analyser CTA */}
        <section className="bg-saffron-50 p-8 rounded-lg border border-saffron-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Not sure if your CV is ready?</h3>
          <p className="text-gray-700 mb-6">
            Upload your CV and we'll compare it against the Queensland Health International Junior Medical Officer benchmark JD — showing exactly what's missing before you apply.
          </p>
          <Link
            href="/careers/cv-checker"
            className="inline-block bg-saffron-600 hover:bg-saffron-700 text-white font-semibold py-3 px-6 rounded transition"
          >
            Check my CV for free →
          </Link>
        </section>
      </div>
    </main>
  );
}
