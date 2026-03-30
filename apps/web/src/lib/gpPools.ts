export type GPPool = {
  id: string;
  name: string;
  region: string;
  state: string;
  demandScore: number;
  positions: string;
  salary: string;
  pesciRequired: boolean;
  aaagpRequired: boolean;
  url: string;
  notes: string;
};

export const pesciSteps = [
  {
    step: 1,
    title: "Confirm AHPRA Registration",
    detail: "PESCI requires you to have AHPRA provisional or general registration first. Apply for AHPRA before or alongside PESCI prep.",
  },
  {
    step: 2,
    title: "Apply for PESCI Assessment",
    detail: "PESCI (Pre-Employment Structured Clinical Interview) is conducted by ACRRM or RACGP. It assesses clinical competence for IMGs seeking fellowship-in-training GP positions. Apply via RACGP or ACRRM.",
    link: "https://www.racgp.org.au/education/imgs/fellowship-pathways",
    linkText: "RACGP PESCI Info",
  },
  {
    step: 3,
    title: "Choose Fellowship Stream",
    detail: "RACGP Fellowship (FRACGP) for general practice, or ACRRM Fellowship (FACRRM) for rural/remote. ACRRM is faster and more accessible for IMGs going rural.",
    link: "https://www.acrrm.org.au/fellowship/pathways-to-fellowship/img-pathway",
    linkText: "ACRRM IMG Pathway",
  },
  {
    step: 4,
    title: "Secure a GP Training Position (GPT)",
    detail: "After PESCI, apply for a GP registrar training post through AGPT (Australian General Practice Training) or ACRRM training programs. Rural positions have the highest availability and incentives.",
    link: "https://www.agpt.com.au/",
    linkText: "AGPT Training Portal",
  },
  {
    step: 5,
    title: "Area of Need (AoN) — Immediate Option",
    detail: "Even without completing PESCI/fellowship, you can work as a GP in an Area of Need (AoN) or District of Workforce Shortage (DWS). DoctorConnect lists these areas. This is the fastest pathway to GP income while completing fellowship.",
    link: "https://www.health.gov.au/our-work/health-workforce/programs/distribution-priority-area",
    linkText: "Health.gov.au — DPA/AoN Locator",
  },
];

export const gpPools: GPPool[] = [
  {
    id: "gp-nsw-rural",
    name: "NSW Rural & Remote GP Positions",
    region: "Rural",
    state: "NSW",
    demandScore: 10,
    positions: "500+ vacancies",
    salary: "AUD $180,000–$300,000+",
    pesciRequired: true,
    aaagpRequired: false,
    url: "https://www.health.nsw.gov.au/workforce/Pages/rural-health.aspx",
    notes: "Highest GP shortage in NSW is rural. AoN exemptions available immediately — no PESCI needed for DWS areas. Salary substantially higher than RMO.",
  },
  {
    id: "gp-nt",
    name: "NT General Practice — Darwin & Remote",
    region: "Remote",
    state: "NT",
    demandScore: 10,
    positions: "200+ vacancies year-round",
    salary: "AUD $200,000–$350,000+",
    pesciRequired: false,
    aaagpRequired: false,
    url: "https://jobs.nt.gov.au/",
    notes: "NT is entirely DWS — AoN exemptions apply everywhere. Fastest GP income pathway. Remote area allowances on top. ACRRM training available in Darwin.",
  },
  {
    id: "gp-wa-rural",
    name: "WA Rural & Remote GP",
    region: "Rural",
    state: "WA",
    demandScore: 9,
    positions: "300+ vacancies",
    salary: "AUD $180,000–$280,000+",
    pesciRequired: false,
    aaagpRequired: false,
    url: "https://www.ruralhealthwest.com.au/",
    notes: "Rural Health West actively places IMGs as GPs under AoN. Kimberley and Pilbara regions pay the highest. No PESCI needed for DWS areas.",
  },
  {
    id: "gp-qld-rural",
    name: "QLD Rural General Practice",
    region: "Rural",
    state: "QLD",
    demandScore: 9,
    positions: "400+ vacancies",
    salary: "AUD $170,000–$260,000+",
    pesciRequired: false,
    aaagpRequired: false,
    url: "https://smartjobs.qld.gov.au/",
    notes: "QLD SmartJobs portal lists GP positions across rural Queensland. DWS exemptions widely available across regional QLD.",
  },
  {
    id: "gp-sa-rural",
    name: "SA Rural GP — Country Health",
    region: "Rural",
    state: "SA",
    demandScore: 8,
    positions: "150+ vacancies",
    salary: "AUD $160,000–$240,000+",
    pesciRequired: false,
    aaagpRequired: false,
    url: "https://www.rdaa.com.au/",
    notes: "RDAA (Rural Doctors Association of Australia) supports rural GP placement across SA. Port Augusta, Whyalla are high-demand areas.",
  },
  {
    id: "gp-training-agpt",
    name: "AGPT GP Registrar Training (All States)",
    region: "National",
    state: "All",
    demandScore: 8,
    positions: "~1,800 training places/year",
    salary: "AUD $120,000–$160,000 (training salary)",
    pesciRequired: true,
    aaagpRequired: false,
    url: "https://www.agpt.com.au/",
    notes: "Structured 3-year pathway to FRACGP. Rural training places have bonuses. Apply after PESCI pass. Feb and Aug intakes.",
  },
];

export const gpVsRmo = {
  rmo: {
    pros: [
      "Faster to start (only AHPRA needed)",
      "Hospital-based — structured team support",
      "Builds specialist referral networks",
      "Good stepping stone to specialty training",
    ],
    cons: [
      "Lower salary (AUD $75K–$98K vs GP $180K–$300K+)",
      "Rostered shift work, nights and weekends",
      "Limited autonomy vs GP",
    ],
  },
  gp: {
    pros: [
      "Significantly higher income ($180K–$300K+)",
      "Greater clinical autonomy",
      "DWS/AoN areas: can start almost immediately",
      "Pathway to permanent Fellowship (FRACGP/FACRRM)",
      "Better work-life balance once established",
    ],
    cons: [
      "PESCI required for fellowship training pathway",
      "Rural areas required initially for AoN exemptions",
      "Business/billing complexity as a practice owner",
    ],
  },
};
