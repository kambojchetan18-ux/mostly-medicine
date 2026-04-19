export type State = {
  id: string;
  name: string;
  shortName: string;
  demandLevel: "Very High" | "High" | "Moderate" | "Low";
  demandScore: number; // 1-10
  imgFriendly: boolean;
  ruralBonus: boolean;
  totalHospitals: number;
  rmoPositions: string;
  hiringSeasons: string[];
  avgSalary: string;
  keyPools: Pool[];
  tips: string[];
  applicationUrl: string;
  color: string;
};

export type Pool = {
  name: string;
  region: "Metro" | "Rural" | "Regional";
  demandScore: number;
  url: string;
  notes: string;
};

export const states: State[] = [
  {
    id: "wa",
    name: "Western Australia",
    shortName: "WA",
    demandLevel: "High",
    demandScore: 8,
    imgFriendly: true,
    ruralBonus: true,
    totalHospitals: 89,
    rmoPositions: "300–500/year",
    hiringSeasons: ["Feb–Mar (main round)", "Jun–Jul (mid-year)"],
    avgSalary: "AUD $75,000–$95,000",
    applicationUrl: "https://www.jobs.health.wa.gov.au/",
    color: "yellow",
    keyPools: [
      {
        name: "North Metropolitan Health Service (NMHS)",
        region: "Metro",
        demandScore: 7,
        url: "https://www.nmhs.health.wa.gov.au/",
        notes: "Sir Charles Gairdner, Osborne Park, Joondalup — large IMG intake",
      },
      {
        name: "South Metropolitan Health Service (SMHS)",
        region: "Metro",
        demandScore: 7,
        url: "https://www.smhs.health.wa.gov.au/",
        notes: "Fiona Stanley, Fremantle, Rockingham hospitals",
      },
      {
        name: "East Metropolitan Health Service (EMHS)",
        region: "Metro",
        demandScore: 7,
        url: "https://www.emhs.health.wa.gov.au/",
        notes: "Royal Perth, Bentley, Armadale hospitals",
      },
      {
        name: "WA Country Health Service (WACHS)",
        region: "Rural",
        demandScore: 10,
        url: "https://wacountry.health.wa.gov.au/",
        notes: "Highest demand — Kimberley, Pilbara, Goldfields regions. IMGs prioritized.",
      },
      {
        name: "Child and Adolescent Health Service (CAHS)",
        region: "Metro",
        demandScore: 6,
        url: "https://cahs.health.wa.gov.au/",  // 200 ✓
        notes: "PCH — requires paediatric interest",
      },
    ],
    tips: [
      "WACHS (rural) is easiest entry point for IMGs — apply here first",
      "WA PGY1 match happens Feb — mid-year vacancies fill faster",
      "Perth metro hospitals are competitive but WA overall is IMG-friendly",
      "Bonded Medical Program (BMP) doctors take some rural slots — still plenty for IMGs",
    ],
  },
  {
    id: "nt",
    name: "Northern Territory",
    shortName: "NT",
    demandLevel: "Very High",
    demandScore: 10,
    imgFriendly: true,
    ruralBonus: true,
    totalHospitals: 12,
    rmoPositions: "100–150/year",
    hiringSeasons: ["Year-round (chronic shortage)"],
    avgSalary: "AUD $80,000–$105,000 + allowances",
    applicationUrl: "https://healthjobs.nt.gov.au/",
    color: "red",
    keyPools: [
      {
        name: "Royal Darwin Hospital (RDH)",
        region: "Metro",
        demandScore: 9,
        url: "https://healthjobs.nt.gov.au/",
        notes: "Busiest hospital in NT — high acuity, excellent IMG support",
      },
      {
        name: "Palmerston Regional Hospital",
        region: "Regional",
        demandScore: 9,
        url: "https://healthjobs.nt.gov.au/",
        notes: "Newer hospital, actively recruiting IMGs",
      },
      {
        name: "Alice Springs Hospital",
        region: "Regional",
        demandScore: 10,
        url: "https://healthjobs.nt.gov.au/",
        notes: "Critical shortage — remote area allowances, fastest hiring",
      },
    ],
    tips: [
      "NT has year-round vacancies — do not wait for hiring seasons",
      "Remote area allowances add AUD $10,000–$20,000 on top of base salary",
      "AHPRA supervised practice conditions easily fulfilled here",
      "Fastest visa + credentialing turnaround in Australia",
    ],
  },
  {
    id: "qld",
    name: "Queensland",
    shortName: "QLD",
    demandLevel: "High",
    demandScore: 8,
    imgFriendly: true,
    ruralBonus: true,
    totalHospitals: 180,
    rmoPositions: "600–900/year",
    hiringSeasons: ["Feb (main round)", "Jul–Aug (mid-year)"],
    avgSalary: "AUD $73,000–$93,000",
    applicationUrl: "https://smartjobs.qld.gov.au/",
    color: "purple",
    keyPools: [
      {
        name: "Metro North HHS",
        region: "Metro",
        demandScore: 7,
        url: "https://metronorth.health.qld.gov.au/",
        notes: "RBWH, Prince Charles, Redcliffe — large teaching hospitals",
      },
      {
        name: "Metro South HHS",
        region: "Metro",
        demandScore: 7,
        url: "https://metrosouth.health.qld.gov.au/",
        notes: "Princess Alexandra, Logan, Redland, Beaudesert",
      },
      {
        name: "Gold Coast HHS",
        region: "Metro",
        demandScore: 8,
        url: "https://www.goldcoast.health.qld.gov.au/",
        notes: "Growing hospital — good IMG intake, Gold Coast lifestyle",
      },
      {
        name: "Townsville HHS",
        region: "Regional",
        demandScore: 9,
        url: "https://smartjobs.qld.gov.au/",
        notes: "Largest regional centre in North QLD — actively recruits IMGs. Apply via SmartJobs.",
      },
      {
        name: "Cairns and Hinterland HHS",
        region: "Regional",
        demandScore: 9,
        url: "https://smartjobs.qld.gov.au/",
        notes: "High demand tropical region — IMG-friendly. Apply via SmartJobs.",
      },
      {
        name: "Rural HHS (SW, Central West, etc.)",
        region: "Rural",
        demandScore: 10,
        url: "https://smartjobs.qld.gov.au/",
        notes: "Chronic vacancies — fastest hire, highest rural incentives",
      },
    ],
    tips: [
      "QLD uses SmartJobs portal — set up job alerts immediately",
      "Hospital Health Services (HHS) hire independently — apply to each",
      "Rural and Remote Medical Workforce offer relocation packages",
      "Gold Coast and Cairns have good IMG communities",
    ],
  },
  {
    id: "nsw",
    name: "New South Wales",
    shortName: "NSW",
    demandLevel: "High",
    demandScore: 8,
    imgFriendly: true,
    ruralBonus: true,
    totalHospitals: 220,
    rmoPositions: "1000–1400/year",
    hiringSeasons: ["Feb (main match)", "Jul (mid-year)", "Rolling (for IMGs with work rights)"],
    avgSalary: "AUD $75,000–$98,000",
    applicationUrl: "https://www.health.nsw.gov.au/careers/",
    color: "blue",
    keyPools: [
      {
        name: "Western Sydney LHD (Westmead, Blacktown, Auburn)",
        region: "Metro",
        demandScore: 9,
        url: "https://www.wslhd.health.nsw.gov.au/",
        notes: "Large IMG workforce, experienced at onboarding IMGs. Westmead is one of Australia's largest teaching hospitals.",
      },
      {
        name: "Nepean Blue Mountains LHD",
        region: "Regional",
        demandScore: 9,
        url: "https://www.nbmlhd.health.nsw.gov.au/",
        notes: "Penrith (45 min from Parramatta) — growing hospital, active IMG recruitment, less competitive than inner Sydney",
      },
      {
        name: "South Western Sydney LHD (Liverpool, Campbelltown)",
        region: "Metro",
        demandScore: 8,
        url: "https://www.swslhd.health.nsw.gov.au/",
        notes: "Liverpool Hospital is one of Australia's busiest trauma centres — high acuity matches Medanta experience",
      },
      {
        name: "Sydney LHD (RPA, Concord)",
        region: "Metro",
        demandScore: 7,
        url: "https://www.slhd.nsw.gov.au/",
        notes: "Royal Prince Alfred, Concord — competitive but strong tertiary teaching hospitals",
      },
      {
        name: "Western NSW LHD",
        region: "Rural",
        demandScore: 9,
        url: "https://www.wnswlhd.health.nsw.gov.au/",
        notes: "Broken Hill, Dubbo, Orange — strong IMG recruitment, fast hire",
      },
      {
        name: "Far West LHD",
        region: "Rural",
        demandScore: 10,
        url: "https://www.health.nsw.gov.au/lhd/Pages/fwlhd.aspx",
        notes: "Highest rural demand in NSW — very fast hiring for IMGs, great rural incentives",
      },
    ],
    tips: [
      "Western Sydney LHD (Westmead, Blacktown) is a strong first target — large IMG workforce with structured onboarding",
      "NSW Health uses the ROB (Recruitment Online for Business) portal — create account and set job alerts immediately",
      "Liverpool Hospital (SWSLHD) is one of Australia's busiest trauma centres — excellent for high-acuity experience",
      "If metro applications take >4 weeks, apply to Western NSW LHD rural pools in parallel — faster hire",
      "Mid-year (Jul) intake is less competitive than Feb main round — good entry window for IMGs",
    ],
  },
  {
    id: "vic",
    name: "Victoria",
    shortName: "VIC",
    demandLevel: "Moderate",
    demandScore: 6,
    imgFriendly: false,
    ruralBonus: true,
    totalHospitals: 190,
    rmoPositions: "900–1100/year",
    hiringSeasons: ["Feb (main match)", "Jul"],
    avgSalary: "AUD $76,000–$96,000",
    applicationUrl: "https://www.health.vic.gov.au/jobs/find-a-job",
    color: "blue",
    keyPools: [
      {
        name: "Grampians Health",
        region: "Regional",
        demandScore: 8,
        url: "https://www.grampianshealth.org.au/",
        notes: "Ballarat — growing health service, IMG-friendly",
      },
      {
        name: "Goulburn Valley Health",
        region: "Regional",
        demandScore: 8,
        url: "https://www.gvhealth.org.au/",
        notes: "Shepparton — regional hub with good IMG support",
      },
      {
        name: "Albury Wodonga Health",
        region: "Regional",
        demandScore: 8,
        url: "https://www.awh.org.au/",
        notes: "Border region — interstate hiring, good demand",
      },
      {
        name: "Rural Health Vic",
        region: "Rural",
        demandScore: 9,
        url: "https://www.health.vic.gov.au/jobs/find-a-job",
        notes: "Many rural positions actively seeking IMGs year-round",
      },
    ],
    tips: [
      "Melbourne metro match highly competitive — avoid as first option",
      "Vic Regional Health Alliance offers rural IMG incentives",
      "RWAV (Rural Workforce Agency Victoria) helps place IMGs in rural areas",
      "Consider Ballarat, Bendigo, Shepparton as strong alternatives to Melbourne",
    ],
  },
  {
    id: "sa",
    name: "South Australia",
    shortName: "SA",
    demandLevel: "Moderate",
    demandScore: 6,
    imgFriendly: true,
    ruralBonus: true,
    totalHospitals: 78,
    rmoPositions: "300–450/year",
    hiringSeasons: ["Feb (main round)", "Jul"],
    avgSalary: "AUD $72,000–$92,000",
    applicationUrl: "https://www.iworkfor.sa.gov.au/",
    color: "green",
    keyPools: [
      {
        name: "Central Adelaide LHN",
        region: "Metro",
        demandScore: 7,
        url: "https://www.iworkfor.sa.gov.au/",
        notes: "RAH, WCHN — central city hospitals",
      },
      {
        name: "Country Health SA",
        region: "Rural",
        demandScore: 9,
        url: "https://www.iworkfor.sa.gov.au/",
        notes: "High demand rural network — good IMG entry pathway",
      },
      {
        name: "Southern Adelaide LHN",
        region: "Metro",
        demandScore: 7,
        url: "https://www.iworkfor.sa.gov.au/",
        notes: "Flinders Medical Centre — Flinders Uni teaching hospital",
      },
    ],
    tips: [
      "SA Health centrally recruits via iworkforSA portal",
      "Country Health SA has ongoing vacancies for IMGs",
      "Adelaide has large Indian medical community — good support network",
      "Smaller state = less competition than NSW/VIC",
    ],
  },
];

