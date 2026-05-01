'use client';

import Link from 'next/link';

const rmoLinks = [
  // QLD
  {
    state: 'QLD',
    label: 'International Junior Medical Officer Talent Pool – Queensland Health (QLD-672363)',
    url: 'https://apply-springboard.health.qld.gov.au/jobs/QLD-672363',
    status: 'open',
    note: 'Matches benchmark International JMO role description. Direct application page.',
  },
  {
    state: 'QLD',
    label: 'Senior Medical Officer – Townsville Region (QLD-TV678551)',
    url: 'https://apply-springboard.health.qld.gov.au/jobs/QLD-TV678551',
    status: 'open',
    note: 'Townsville-specific via Queensland Health Springboard portal.',
  },
  // NSW
  {
    state: 'NSW',
    label: 'International Junior Medical Officers – NSW Health',
    url: 'https://www.health.nsw.gov.au/jmo/Pages/international-applicants.aspx',
    status: 'upcoming',
    note: 'Official IMG-specific NSW Health JMO entry page. Campaign opens ~July 2026.',
  },
  // WA
  {
    state: 'WA',
    label: 'Resident Medical Officer Recruitment – MedCareersWA (WA Health)',
    url: 'https://medcareerswa.health.wa.gov.au/resident-medical-officers',
    status: 'upcoming',
    note: 'Official WA Health RMO hub with campaign dates and application links.',
  },
  // VIC
  {
    state: 'VIC',
    label: 'International Medical Graduates – PMCV Late Vacancy Match',
    url: 'https://www.pmcv.com.au/international-medical-graduates/',
    status: 'restricted',
    note: '⚠️ IMGs: main PMCV match is closed to IMGs. Late Vacancy Match (Sep–Oct 2026) is the IMG pathway.',
  },
  // SA
  {
    state: 'SA',
    label: 'Postgraduate Year 2 and Beyond – SA Health Medical Officer Recruitment',
    url: 'https://www.sahealth.sa.gov.au/wps/wcm/connect/public+content/sa+health+internet/careers/i+am+a/medical+professional/postgraduate',
    status: 'upcoming',
    note: 'SA Health PGY2+ and RMO campaign page.',
  },
  // Private / Agency fallback
  {
    state: 'All States',
    label: 'RMO Jobs Australia – Medrecruit (Private Sector)',
    url: 'https://medrecruit.medworld.com/doctors/rmo-jobs-australia',
    status: 'open',
    note: 'Private sector RMO vacancies updated daily. Use as fallback when public pools are closed.',
  },
];

export default function RmoPools() {
  return (
    <main className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
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
                QLD opens 1 June 2026 · NSW opens mid-July 2026 · WA next cycle ~May 2026.
                Campaigns close within 4–6 weeks. <strong>Have your documents ready now.</strong>
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
            <Link href="/amc-cat1" className="text-blue-600 hover:text-blue-800 font-semibold">
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
                <tr>
                  <td className="border border-gray-300 px-4 py-2">QLD</td>
                  <td className="border border-gray-300 px-4 py-2">1 Jun 2026</td>
                  <td className="border border-gray-300 px-4 py-2">29 Jun 2026</td>
                  <td className="border border-gray-300 px-4 py-2">✅ Yes</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">Opening Soon</span>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">NSW</td>
                  <td className="border border-gray-300 px-4 py-2">~15 Jul 2026</td>
                  <td className="border border-gray-300 px-4 py-2">~Aug 2026</td>
                  <td className="border border-gray-300 px-4 py-2">✅ Yes</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm">Not Yet Open</span>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">WA</td>
                  <td className="border border-gray-300 px-4 py-2">~May 2026</td>
                  <td className="border border-gray-300 px-4 py-2">~Jun 2026</td>
                  <td className="border border-gray-300 px-4 py-2">✅ Yes</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm">Next Cycle TBC</span>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">VIC</td>
                  <td className="border border-gray-300 px-4 py-2">Sep 2026 (LVM)</td>
                  <td className="border border-gray-300 px-4 py-2">Oct 2026</td>
                  <td className="border border-gray-300 px-4 py-2">⚠️ Late Match Only</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded text-sm">IMGs: Restricted</span>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">SA</td>
                  <td className="border border-gray-300 px-4 py-2">~Jun 2026</td>
                  <td className="border border-gray-300 px-4 py-2">~Jul 2026</td>
                  <td className="border border-gray-300 px-4 py-2">✅ Yes</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm">Check SA Health</span>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">TAS</td>
                  <td className="border border-gray-300 px-4 py-2">~May 2026</td>
                  <td className="border border-gray-300 px-4 py-2">~Jun 2026</td>
                  <td className="border border-gray-300 px-4 py-2">✅ Yes</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm">Next Cycle TBC</span>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">NT</td>
                  <td className="border border-gray-300 px-4 py-2">Rolling</td>
                  <td className="border border-gray-300 px-4 py-2">Rolling</td>
                  <td className="border border-gray-300 px-4 py-2">✅ Yes</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm">Check NT Health</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Direct RMO / JMO Job Pool Links */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Apply Now — Direct RMO & JMO Links</h2>
          <ul className="space-y-4">
            {rmoLinks.map((link) => (
              <li
                key={link.url}
                className={`p-4 rounded border-l-4 ${
                  link.status === 'open'
                    ? 'bg-green-50 border-green-400'
                    : link.status === 'restricted'
                    ? 'bg-orange-50 border-orange-400'
                    : 'bg-gray-50 border-gray-400'
                }`}
              >
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-semibold text-lg hover:underline"
                >
                  {link.label}
                </a>
                <p className="text-gray-600 text-sm mt-2">{link.note}</p>
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
          <p className="text-blue-600 font-semibold">
            <Link href="/careers/cv-checker" className="hover:text-blue-800">
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
                className="text-blue-600 hover:text-blue-800 font-semibold"
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
              <Link href="/amc-cat1" className="text-blue-600 hover:text-blue-800 font-semibold">
                Use Mostly Medicine tools →
              </Link>{' '}
              to fill the time productively and strengthen your application for the next cycle.
            </li>
          </ul>
        </section>

        {/* CV Gap Analyser CTA */}
        <section className="bg-blue-50 p-8 rounded-lg border border-blue-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Not sure if your CV is ready?</h3>
          <p className="text-gray-700 mb-6">
            Upload your CV and we'll compare it against the Queensland Health International Junior Medical Officer benchmark JD — showing exactly what's missing before you apply.
          </p>
          <Link
            href="/careers/cv-checker"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded transition"
          >
            Check my CV for free →
          </Link>
        </section>
      </div>
    </main>
  );
}
