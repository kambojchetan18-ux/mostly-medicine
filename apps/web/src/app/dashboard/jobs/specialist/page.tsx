import Link from "next/link";
import { ExternalLink, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { type IMGProfile } from "@/lib/imgProfile";

const colleges = [
  {
    specialty: "Internal Medicine / General Medicine",
    college: "RACP — Royal Australasian College of Physicians",
    url: "https://www.racp.edu.au/fellows/overseas-trained-specialists",
    assessmentType: "Overseas Trained Specialist (OTS) Assessment",
    timeline: "3–6 months",
    notes: "Covers general medicine, cardiology, neurology, oncology, renal, respiratory, gastro, endocrine and more.",
  },
  {
    specialty: "Surgery (General, Orthopaedic, Neurosurgery, Plastics, etc.)",
    college: "RACS — Royal Australasian College of Surgeons",
    url: "https://www.surgeons.org/becoming-a-surgeon/international-medical-graduates",
    assessmentType: "IMG Assessment",
    timeline: "6–12 months",
    notes: "Each surgical specialty assessed separately. Peer review and portfolio submission required.",
  },
  {
    specialty: "Psychiatry",
    college: "RANZCP — Royal Australian and New Zealand College of Psychiatrists",
    url: "https://www.ranzcp.org/become-a-psychiatrist/overseas-trained-specialists",
    assessmentType: "Overseas Trained Specialist Assessment",
    timeline: "3–6 months",
    notes: "High demand specialty — assessment outcomes generally favourable for qualified specialists.",
  },
  {
    specialty: "Obstetrics & Gynaecology",
    college: "RANZCOG — Royal Australian and New Zealand College of Obstetricians and Gynaecologists",
    url: "https://ranzcog.edu.au/training/overseas-trained-specialists/",
    assessmentType: "Overseas Trained Specialist Assessment",
    timeline: "3–6 months",
    notes: "DNB, MD, DGO all considered. Rural O&G positions in very high demand.",
  },
  {
    specialty: "Emergency Medicine",
    college: "ACEM — Australasian College for Emergency Medicine",
    url: "https://acem.org.au/Become-an-Emergency-Physician/Overseas-Trained-Specialists",
    assessmentType: "Overseas Trained Specialist Assessment",
    timeline: "3–4 months",
    notes: "Emergency physicians in chronic shortage across Australia. Fast-tracked assessment.",
  },
  {
    specialty: "Paediatrics",
    college: "RACP (Paediatrics & Child Health Division)",
    url: "https://www.racp.edu.au/fellows/overseas-trained-specialists",
    assessmentType: "Overseas Trained Specialist (OTS) Assessment",
    timeline: "3–6 months",
    notes: "Paediatric specialists also assessed via RACP — separate pathway from adult medicine.",
  },
  {
    specialty: "Radiology / Imaging",
    college: "RANZCR — Royal Australian and New Zealand College of Radiologists",
    url: "https://www.ranzcr.com/college/overseas-trained-specialists",
    assessmentType: "Overseas Trained Specialist Assessment",
    timeline: "4–6 months",
    notes: "Radiologists in shortage — strong demand in public hospitals and private practice.",
  },
  {
    specialty: "Pathology",
    college: "RCPA — Royal College of Pathologists of Australasia",
    url: "https://www.rcpa.edu.au/Become-a-Pathologist/Overseas-Trained-Pathologists",
    assessmentType: "Overseas Trained Pathologist Assessment",
    timeline: "4–8 months",
    notes: "Covers anatomical, chemical, haematological, and microbiological pathology.",
  },
  {
    specialty: "Anaesthesia",
    college: "ANZCA — Australian and New Zealand College of Anaesthetists",
    url: "https://www.anzca.edu.au/training/international-medical-graduates",
    assessmentType: "IMG Assessment",
    timeline: "3–6 months",
    notes: "High demand. Many anaesthetists from India (DA, DNB, MD Anaesthesia) successfully assessed.",
  },
  {
    specialty: "General Practice",
    college: "RACGP — Royal Australian College of General Practitioners",
    url: "https://www.racgp.org.au/FSDEDEV/media/documents/RACGP/Policies/Overseas-Trained-Doctors/Assessment-of-Overseas-Qualified-GPs.pdf",
    assessmentType: "OSCAR or Fellowship Assessment Pathway (FAP)",
    timeline: "Variable — 6–18 months",
    notes: "For GPs with substantial primary care experience. ACRRM (ruralgp.com.au) is an alternative college for rural GP fellows.",
  },
];

const pathway = [
  {
    step: "1",
    title: "Identify Your College",
    detail: "Find the Australian specialist college for your specialty from the list below. Each college runs its own assessment process for overseas-trained specialists (OTS).",
  },
  {
    step: "2",
    title: "Submit OTS Assessment Application",
    detail: "Prepare: specialist degree certificates, logbook/case records, employment verification letters, referee reports from specialists in your field, and proof of English proficiency (OET or IELTS).",
  },
  {
    step: "3",
    title: "College Assessment Outcome",
    detail: "College assesses your qualifications and training. Outcome is one of: (a) Comparable — deemed equivalent to Australian fellowship, (b) Partial comparability — additional training required, or (c) Not comparable — must complete Australian training program.",
  },
  {
    step: "4",
    title: "AHPRA Specialist Registration",
    detail: "With a 'Comparable' outcome, submit the college report to AHPRA and apply for Specialist Registration. AHPRA processes this in 4–8 weeks. You need AHPRA Specialist Registration to work at specialist level.",
  },
  {
    step: "5",
    title: "Apply for Specialist Positions",
    detail: "With AHPRA Specialist Registration, apply for Consultant or Staff Specialist positions. These pay AUD $200K–$400K+ depending on specialty and state. Rural and regional hospitals have the most vacancies.",
  },
];

export default async function SpecialistPathwayPage() {
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

  const isSpecialist = profile?.doctor_type === "specialist";
  const specialistQual = profile?.specialist_qualification;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Specialist Pathway</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {isSpecialist && specialistQual
              ? `Personalised pathway for ${specialistQual}`
              : "Overseas-trained specialist doctors — Australian recognition pathway"}
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

      {/* Profile banner for specialists */}
      {isSpecialist && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl px-4 py-3">
          <p className="font-semibold text-purple-800">Specialist Pathway Detected</p>
          <p className="text-sm text-purple-700 mt-0.5">
            {specialistQual
              ? `Your CV shows ${specialistQual}. Follow the steps below for the fastest route to Australian specialist practice.`
              : "Your CV indicates specialist-level qualifications. Follow the steps below."}
          </p>
        </div>
      )}

      {/* Pathway overview */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Overseas Trained Specialist (OTS) Pathway</h2>
          <p className="text-sm text-gray-500 mt-0.5">5 steps from overseas specialist to Australian practice</p>
        </div>
        <div className="divide-y divide-gray-100">
          {pathway.map((s) => (
            <div key={s.step} className="flex items-start gap-4 px-5 py-4">
              <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                {s.step}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">{s.title}</p>
                <p className="text-sm text-gray-500 mt-0.5">{s.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Important notes box */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
        <p className="font-semibold text-amber-900 text-sm">Important</p>
        <ul className="text-sm text-amber-800 space-y-1">
          <li>• You do NOT need to sit AMC CAT 1 or CAT 2 if you get a &quot;Comparable&quot; outcome from your specialist college</li>
          <li>• You still need English proficiency (OET B or IELTS 7.0) for AHPRA registration</li>
          <li>• Some colleges require supervised practice periods before granting comparability</li>
          <li>• Locum specialist positions are available even before full registration in some states under supervised conditions</li>
        </ul>
      </div>

      {/* College directory */}
      <section>
        <h2 className="text-xl font-bold mb-4">Australian Specialist College Directory</h2>
        <div className="space-y-3">
          {colleges.map((college) => (
            <div key={college.college} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <div>
                  <p className="font-semibold text-gray-900">{college.specialty}</p>
                  <p className="text-sm text-brand-700 font-medium mt-0.5">{college.college}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-medium">
                    ~{college.timeline}
                  </span>
                  <a
                    href={college.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-800 font-medium"
                  >
                    OTS Assessment <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              <p className="text-xs text-gray-500">{college.notes}</p>
              <p className="text-xs text-gray-400 mt-1">Assessment type: {college.assessmentType}</p>
            </div>
          ))}
        </div>
      </section>

      {/* English requirement */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold mb-3">English Proficiency Requirement</h2>
        <p className="text-sm text-gray-600 mb-3">
          All applicants for AHPRA registration (including specialists) must demonstrate English proficiency unless from an exempt country (UK, Ireland, USA, Canada, NZ, South Africa).
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="font-semibold text-sm text-gray-900 mb-1">OET — Recommended</p>
            <p className="text-xs text-gray-600">Medical-specific test. Minimum: B in all four components (listening, reading, writing, speaking). Results valid 2 years.</p>
            <a href="https://www.occupationalenglishtest.com/" target="_blank" rel="noopener noreferrer" className="text-xs text-brand-600 hover:underline mt-2 inline-block">occupationalenglishtest.com →</a>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="font-semibold text-sm text-gray-900 mb-1">IELTS Academic</p>
            <p className="text-xs text-gray-600">Minimum: 7.0 in all four bands. Academic version only — General Training not accepted. Results valid 2 years.</p>
            <a href="https://www.ielts.org/" target="_blank" rel="noopener noreferrer" className="text-xs text-brand-600 hover:underline mt-2 inline-block">ielts.org →</a>
          </div>
        </div>
      </section>

      {/* Salary guide */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold mb-3">Specialist Salary Guide — Australia 2026</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            ["Surgical specialties", "$300K–$500K+"],
            ["Internal medicine", "$250K–$400K"],
            ["Psychiatry", "$220K–$350K"],
            ["Emergency Medicine", "$220K–$340K"],
            ["O&G", "$250K–$400K"],
            ["Anaesthesia", "$250K–$450K"],
            ["Radiology", "$280K–$500K+"],
            ["General Practice (rural)", "$180K–$300K+"],
          ].map(([spec, salary]) => (
            <div key={spec} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm text-gray-700">{spec}</span>
              <span className="text-sm font-semibold text-emerald-700">{salary}/yr</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">Public hospital Staff Specialist rates. Private practice adds 20–50% for most specialties.</p>
      </section>

      <p className="text-xs text-gray-400 text-center pb-4">
        Always verify current requirements directly with the relevant college and AHPRA. Information current as of early 2026.
      </p>
    </div>
  );
}
