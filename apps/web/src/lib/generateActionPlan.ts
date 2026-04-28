import type { IMGProfile } from "./imgProfile";

export type ActionStep = {
  step: number;
  title: string;
  urgency: "critical" | "high" | "moderate" | "info";
  timeEstimate: string;
  description: string;
  link: string;
  linkText: string;
  isWarning?: boolean;
};

export function generateActionPlan(profile: IMGProfile): ActionStep[] {
  const steps: ActionStep[] = [];
  let n = 0;
  const add = (s: Omit<ActionStep, "step">) => steps.push({ step: ++n, ...s });

  // ── Non-doctor flag ─────────────────────────────────────────────────────────
  if (profile.doctor_type === "non_doctor") {
    add({
      title: "Important: These job pools are for medical doctors",
      urgency: "critical",
      isWarning: true,
      timeEstimate: "Action required",
      description:
        "Our Australian Jobs portal is built for International Medical Graduates (IMGs) with an MBBS, MBChB, MD, or equivalent primary medical degree. Your CV does not appear to contain a medical qualification. If this is an error — for example, your degree abbreviation is unusual — please re-upload your CV or manually correct your profile below.",
      link: "/dashboard/profile",
      linkText: "Re-upload CV",
    });
    return steps;
  }

  // ── Specialist pathway ──────────────────────────────────────────────────────
  if (profile.doctor_type === "specialist") {
    const qual = profile.specialist_qualification ?? "your specialist qualification";
    add({
      title: "Choose: AMC Specialist Pathway or Standard Pathway",
      urgency: "critical",
      timeEstimate: "Decision — make this first",
      description: `You hold ${qual}. In Australia, overseas specialists can either (a) go through the AMC Standard Pathway (AMC MCQ + AMC Handbook AI RolePlay + AHPRA General Registration) and then apply for specialist positions, or (b) apply directly to the relevant specialist college for overseas-trained specialist (OTS) assessment. Option (b) is faster and leads to AHPRA Specialist Registration. Most college assessments take 3–6 months.`,
      link: "/dashboard/jobs/specialist",
      linkText: "View Specialist Pathway Guide",
    });
    add({
      title: "Identify Your Specialist College",
      urgency: "critical",
      timeEstimate: "This week",
      description:
        "Each specialty has its own college assessment process. For example: internal medicine → RACP, surgery → RACS, psychiatry → RANZCP, O&G → RANZCOG, paediatrics → RACP (Paediatrics Division), radiology → RANZCR, emergency → ACEM, pathology → RCPA, GP → RACGP or ACRRM. Go to your college's website and find the 'Overseas Trained Specialist' or 'Comparable Overseas Specialist' assessment page.",
      link: "https://www.ahpra.gov.au/Registration/Medical-Registration/Specialist-Registration.aspx",
      linkText: "AHPRA Specialist Registration",
    });
    add({
      title: "Register with Specialist Recruitment Agencies",
      urgency: "high",
      timeEstimate: "30 minutes",
      description:
        "Specialist positions in Australia are often filled via agencies. Medrecruit, Wavelength International, and MedX all have specialist desks. Locum specialist positions are available even before full registration — some hospitals hire OTS specialists under supervised practice conditions.",
      link: "https://www.medrecruit.com.au/",
      linkText: "Medrecruit Specialist",
    });
    if (profile.english_test === "not_done") {
      add({
        title: "Complete English Proficiency Test",
        urgency: "critical",
        timeEstimate: "2–4 weeks to book, 3–6 months to prepare",
        description:
          "OET (Occupational English Test) is required for AHPRA registration unless you are from an exempt country (UK, Ireland, USA, Canada, NZ, South Africa). OET is medical-specific and preferred. Minimum: OET B in all four components. IELTS Academic (7.0 in all bands) is also accepted.",
        link: "https://www.occupationalenglishtest.com/",
        linkText: "Book OET",
      });
    }
    return steps;
  }

  // ── Standard IMG Pathway (RMO / GP / unknown) ───────────────────────────────

  // English
  if (profile.english_test === "not_done") {
    add({
      title: "Complete English Proficiency Test — First Step",
      urgency: "critical",
      timeEstimate: "2–4 weeks to book, 3–6 months to prepare",
      description:
        "OET (Occupational English Test) is the strongly recommended choice — it is medical-specific and AHPRA's preferred test. You need minimum OET B in all four components. IELTS Academic (7.0 in all four bands) is also accepted. Book your test as soon as possible — exam dates fill up quickly. Neither AMC exam can be sat without English proficiency evidence at AHPRA application stage.",
      link: "https://www.occupationalenglishtest.com/",
      linkText: "Book OET",
    });
  }

  // AMC MCQ
  if (profile.amc_cat1 !== "passed") {
    add({
      title: profile.amc_cat1 === "scheduled"
        ? "AMC MCQ — Scheduled. Keep Preparing."
        : "Register for AMC MCQ Exam",
      urgency: profile.english_test === "not_done" ? "high" : "critical",
      timeEstimate: profile.amc_cat1 === "scheduled"
        ? "Exam date already booked — continue daily practice"
        : "Register today — exam available year-round at Pearson VUE centres",
      description: profile.amc_cat1 === "scheduled"
        ? "You have scheduled your AMC MCQ — great. The exam is 150 MCQs over 3.5 hours covering all major specialties using Australian clinical guidelines. Use Mostly Medicine's AMC MCQ practice bank daily. Focus on emergency presentations, pharmacology, and common chronic disease management."
        : "The AMC MCQ is a 150-question computer-adaptive MCQ exam covering all major medical specialties. It tests clinical knowledge using Australian guidelines and is a prerequisite for AHPRA registration. Register at amc.org.au → 'AMC Computer Adaptive Test'. Use Mostly Medicine's 3,000+ question bank — built specifically for this exam.",
      link: "https://www.amc.org.au/assessment/amc-computer-adaptive-test/",
      linkText: "AMC MCQ Info",
    });
  }

  // AMC Handbook AI RolePlay
  if (profile.amc_cat1 === "passed" && profile.amc_cat2 !== "passed") {
    add({
      title: profile.amc_cat2 === "scheduled"
        ? "AMC Handbook AI RolePlay — Scheduled. Practice OSCE Skills Daily."
        : "Register for AMC Handbook AI RolePlay (Clinical Exam)",
      urgency: "critical",
      timeEstimate: profile.amc_cat2 === "scheduled"
        ? "Exam booked — intensive OSCE prep now"
        : "Register at amc.org.au — limited exam spots, book early",
      description: profile.amc_cat2 === "scheduled"
        ? "You have scheduled your AMC Handbook AI RolePlay. This is a 16-station OSCE (8 min each) testing clinical skills, communication, and management with Australian standards. Focus on: handover, breaking bad news, obtaining consent, and common emergency scenarios. Practice speaking out loud — examiners assess communication as much as clinical content."
        : "AMC Handbook AI RolePlay is a 16-station OSCE held in Melbourne and Sydney. Each station is 8 minutes. Stations include history-taking, physical examination, communication, and management planning. Register at amc.org.au. Once booked, start structured OSCE practice — Mostly Medicine's AMC Handbook AI RolePlay modules follow the official exam blueprint.",
      link: "https://www.amc.org.au/assessment/clinical-examination/",
      linkText: "AMC Handbook AI RolePlay Info",
    });
  }

  // AHPRA
  if (profile.amc_cat1 === "passed" && profile.amc_cat2 === "passed") {
    if (profile.ahpra_status === "not_started") {
      add({
        title: "Apply for AHPRA Registration — Do This Today",
        urgency: "critical",
        timeEstimate: "Apply now — processing takes 4–8 weeks",
        description:
          "With both AMC exams passed, you qualify for AHPRA General Registration. Go to ahpra.gov.au → Registration → New Registrant → Medical Practitioner → General Registration. You will need: AMC Certificate, primary medical degree (MBBS/MD), internship completion certificate, passport/ID, and a Certificate of Good Standing from your home Medical Council. Application fee is approximately AUD $410. Important: many hospitals (especially WA, NT, and rural areas) accept applications while your AHPRA is still pending — start applying now.",
        link: "https://www.ahpra.gov.au/Registration/New-Registrants.aspx",
        linkText: "Apply on AHPRA",
      });
    } else if (profile.ahpra_status === "pending") {
      add({
        title: "Follow Up Your AHPRA Application",
        urgency: "critical",
        timeEstimate: "Chase if >6 weeks since submission",
        description:
          "Your AHPRA registration is pending. Processing typically takes 4–8 weeks. If it has been more than 6 weeks, log into your AHPRA online portal and check for any outstanding documents or queries. You can also call AHPRA on 1300 419 495. Do not wait for AHPRA approval before applying to hospitals — NT, WA Country Health, and many rural LHDs issue conditional offers to IMGs with pending AHPRA.",
        link: "https://www.ahpra.gov.au/",
        linkText: "AHPRA Portal",
      });
    }
  }

  // Job applications — only when AMC is cleared (or at least CAT1 done for visibility)
  if (profile.amc_cat1 === "passed" && profile.amc_cat2 === "passed") {
    const prefs = profile.location_preference ?? [];
    const isGP = profile.doctor_type === "gp";

    if (isGP) {
      add({
        title: "Apply for GP DWS / Area of Need Positions",
        urgency: profile.ahpra_status === "registered" ? "critical" : "high",
        timeEstimate: "Positions available year-round",
        description:
          "As a GP pathway candidate, target Doctor in a Workforce Shortage (DWS) or Area of Need (AoN) locations. These rural and regional general practice positions are in high demand and often offer provider numbers without needing PESCI assessment (for many DWS areas). Salary range is AUD $180K–$300K+ depending on billings and contract type. Use the Health Workforce Locator to find DWS areas near your preferred location.",
        link: "https://www.healthworkforce.health.gov.au/",
        linkText: "Find DWS Areas",
      });
      add({
        title: "Register with RDAA and Rural Workforce Agencies",
        urgency: "high",
        timeEstimate: "This week",
        description:
          "The Rural Doctors Association of Australia (RDAA), RWAV (VIC), Rural Health West (WA), and Queensland Rural Medical Support Agency (QRMSA) all place IMGs in GP roles. These agencies understand visa requirements and can expedite placement with sponsorship support for 482 or 491 visa holders.",
        link: "https://www.rdaa.com.au/",
        linkText: "RDAA",
      });
    } else {
      // RMO pathway
      let desc = "";
      if (prefs.length > 0) {
        const prefStr = prefs.join(", ");
        desc = `Based on your preference for ${prefStr}: `;
        if (prefs.includes("NT")) desc += "NT Health hires year-round — highest IMG success rate in Australia. Apply to Royal Darwin and Alice Springs Hospital. ";
        if (prefs.includes("WA")) desc += "WA Country Health Service (WACHS) has chronic vacancies in Kimberley, Pilbara, and Goldfields. Apply directly at jobs.health.wa.gov.au. ";
        if (prefs.includes("NSW")) desc += "NSW — apply to Western Sydney LHD, Nepean Blue Mountains LHD, and rural Western NSW LHD via the ROB portal (health.nsw.gov.au/careers). ";
        if (prefs.includes("QLD")) desc += "QLD — set up SmartJobs.qld.gov.au alerts; apply to Gold Coast HHS, Townsville HHS, and Cairns HHS. ";
        if (prefs.includes("VIC")) desc += "VIC — focus on regional hospitals: Grampians Health (Ballarat), Goulburn Valley Health (Shepparton). Melbourne metro is very competitive. ";
        if (prefs.includes("SA")) desc += "SA Health recruits centrally via iworkforSA portal. Country Health SA has ongoing rural vacancies. ";
      } else {
        desc =
          "We recommend starting with NT Health and WA Country Health Service — they hire year-round, accept conditional offers pending AHPRA, and are the most IMG-friendly states. Then add NSW LHDs and QLD HHS applications. Apply to at least 3–5 pools simultaneously.";
      }
      add({
        title: "Apply to Hospital RMO Pools Now",
        urgency: profile.ahpra_status === "registered" ? "critical" : "high",
        timeEstimate: "Submit applications this week",
        description: desc,
        link: "/dashboard/jobs/rmo",
        linkText: "View All RMO Pools",
      });
    }

    // Agencies — always useful
    add({
      title: "Register with Medical Recruitment Agencies",
      urgency: "high",
      timeEstimate: "30 minutes — do this today",
      description:
        "Medrecruit and Wavelength International place hundreds of IMGs in Australia annually and have exclusive hospital relationships not advertised publicly. Register with both today. In your profile mention: AMC status, visa type, AHPRA status, available start date, and preferred locations. They can fast-track placement in NT and WA particularly.",
      link: "https://www.medrecruit.com.au/",
      linkText: "Medrecruit",
    });
  }

  // Visa advice for unclear visa types
  if (profile.visa_type === "unknown" || profile.visa_type === "other") {
    add({
      title: "Clarify Your Australian Work Rights",
      urgency: "high",
      timeEstimate: "Check with a migration agent",
      description:
        "Most hospital RMO positions require Australian work rights. If you're on a student or visitor visa, you'll need a work visa before applying. Options include 482 (TSS — employer-sponsored), 485 (Graduate — if studied in Australia), or 189/190/491 (skills-based PR pathway). Consult a registered migration agent for advice specific to your situation.",
      link: "https://immi.homeaffairs.gov.au/",
      linkText: "Home Affairs Visa Info",
    });
  }

  // If nothing was generated (e.g. unknown doctor_type, everything unknown)
  if (steps.length === 0) {
    add({
      title: "Upload Your CV to Get a Personalised Plan",
      urgency: "info",
      timeEstimate: "30 seconds",
      description:
        "We couldn't generate personalised steps because your profile is incomplete. Upload your CV and Claude will analyse it to extract your qualifications, exam status, and visa — and then build you a step-by-step action plan.",
      link: "/dashboard/profile",
      linkText: "Upload CV",
    });
  }

  return steps;
}
