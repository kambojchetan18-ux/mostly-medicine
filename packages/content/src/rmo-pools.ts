export type RmoPoolCode = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';

export type CycleStatus = 'confirmed' | 'estimated' | 'tbc';

export type RmoCycle = {
  open: string;
  close: string;
  status: CycleStatus;
  sourceUrl: string;
  notes?: string;
};

export type RmoAltCycle = {
  name: string;
  cycle: RmoCycle;
};

export type RmoDirectLink = {
  label: string;
  url: string;
  note?: string;
};

export type RmoPool = {
  code: RmoPoolCode;
  state: string;
  poolName: string;
  brandColor: string;
  applyUrl: string;
  applyLabel: string;
  cycle2027: RmoCycle;
  altCycles?: RmoAltCycle[];
  imgEligible: boolean;
  imgNotes?: string;
  tips: string[];
  directLinks?: RmoDirectLink[];
};

export type RmoPathwayId =
  | 'standard'
  | 'competent-authority'
  | 'specialist'
  | 'expedited-specialist';

export type RmoPathway = {
  id: RmoPathwayId;
  name: string;
  shortName: string;
  description: string;
  eligibility: string;
  accentColor: string;
};

export const RMO_PATHWAYS: RmoPathway[] = [
  {
    id: 'standard',
    name: 'Standard pathway',
    shortName: 'Standard',
    description: 'AMC Part 1 (MCQ) plus AMC Part 2 (Clinical) or Workplace-Based Assessment. Default route for most IMGs.',
    eligibility: 'IMGs without recognised postgraduate training in a Competent Authority country.',
    accentColor: '#8b5cf6',
  },
  {
    id: 'competent-authority',
    name: 'Competent Authority pathway',
    shortName: 'Competent Authority',
    description: 'Fast-track route. No AMC Part 2 required if you meet the Competent Authority criteria.',
    eligibility: 'Graduates of UK, USA, Canada, Ireland, or New Zealand with eligible postgraduate experience.',
    accentColor: '#6366f1',
  },
  {
    id: 'specialist',
    name: 'Specialist pathway',
    shortName: 'Specialist',
    description: 'For overseas-trained specialists. Assessed by the relevant Australian specialist medical college.',
    eligibility: 'IMG specialists holding a recognised specialist qualification in their home country.',
    accentColor: '#ec4899',
  },
  {
    id: 'expedited-specialist',
    name: 'Specialist — Expedited Assessment',
    shortName: 'Expedited Specialist',
    description: 'Fastest specialist route. Reduced assessment for substantially comparable overseas specialists.',
    eligibility: 'IMG specialists from training programs deemed substantially comparable to the Australian standard.',
    accentColor: '#f59e0b',
  },
];

export const RMO_POOLS: RmoPool[] = [
  {
    code: 'NSW',
    state: 'New South Wales',
    poolName: 'HETI JMO Annual Medical Recruitment',
    brandColor: '#3b82f6',
    applyUrl: 'https://www.health.nsw.gov.au/jmo/Pages/international-applicants.aspx',
    applyLabel: 'NSW Health JMO (IMG)',
    cycle2027: {
      open: '2026-07-14',
      close: '2026-08-04',
      status: 'confirmed',
      sourceUrl: 'https://www.health.nsw.gov.au/jmo/Pages/dates.aspx',
      notes: 'Main round dates. Early round (specialty-specific) runs 4-22 May 2026.',
    },
    imgEligible: true,
    imgNotes: 'IMGs apply through the dedicated IMG-AMC stream. Confirm category on the application form.',
    tips: [
      'Largest JMO pool in Australia — most metro hospitals participate',
      'Nominate up to 10 hospital preferences',
      'Apply early — popular metro hospitals fill fast',
    ],
  },
  {
    code: 'VIC',
    state: 'Victoria',
    poolName: 'PMCV PGY2 / HMO2 Computer Match',
    brandColor: '#8b5cf6',
    applyUrl: 'https://www.pmcv.com.au/2026-pgy2-match/',
    applyLabel: 'PMCV PGY2 Match',
    cycle2027: {
      open: '2026-07-27',
      close: '2026-08-21',
      status: 'confirmed',
      sourceUrl: 'https://www.pmcv.com.au/2026-pgy2-match/',
      notes: 'For 2027 clinical year commencement. Requires completed PGY1 + general AHPRA registration.',
    },
    altCycles: [
      {
        name: 'Late Vacancy Match (IMG pathway)',
        cycle: {
          open: 'TBC (typically Sep)',
          close: 'TBC (typically Oct)',
          status: 'tbc',
          sourceUrl: 'https://www.pmcv.com.au/international-medical-graduates/',
          notes: 'The main PMCV match is restricted for most IMGs. LVM is the primary IMG entry into Victorian public hospitals.',
        },
      },
    ],
    imgEligible: true,
    imgNotes: 'AMC pass holders without PGY1 must use the Late Vacancy Match (LVM) in Sep-Oct, or apply directly to individual hospitals.',
    tips: [
      'Most VIC hospitals also recruit directly outside PMCV — check from August onwards',
      'Alfred, Royal Melbourne, St Vincent\'s are the most competitive',
      'Check VMET for structured training opportunities',
    ],
  },
  {
    code: 'QLD',
    state: 'Queensland',
    poolName: 'QLD Health RMO & Registrar Campaign',
    brandColor: '#ec4899',
    applyUrl: 'https://www.careers.health.qld.gov.au/medical-careers/resident-medical-officer-rmo-and-registrar-campaign',
    applyLabel: 'QLD Health RMO Campaign',
    cycle2027: {
      open: '2026-06-01',
      close: '2026-06-29',
      status: 'estimated',
      sourceUrl: 'https://www.careers.health.qld.gov.au/medical-careers/resident-medical-officer-rmo-and-registrar-campaign',
      notes: 'Estimated based on prior cycle (2 Jun - 30 Jun 2025). Re-verify in browser ~1 June 2026.',
    },
    imgEligible: true,
    imgNotes: 'Accepts IMGs with AMC/Ahpra eligibility. International JMO Talent Pool available via Springboard.',
    tips: [
      'Excellent rural training programs with incentives',
      'Townsville, Cairns, Mackay often have openings mid-year',
      'IMET program offers structured IMG training',
    ],
    directLinks: [
      {
        label: 'International JMO Talent Pool (QLD-672363)',
        url: 'https://apply-springboard.health.qld.gov.au/jobs/QLD-672363',
        note: 'Direct application page for IMGs.',
      },
      {
        label: 'Senior Medical Officer - Townsville (QLD-TV678551)',
        url: 'https://apply-springboard.health.qld.gov.au/jobs/QLD-TV678551',
        note: 'Townsville-specific via Springboard.',
      },
    ],
  },
  {
    code: 'WA',
    state: 'Western Australia',
    poolName: 'MedCareersWA Centralised RMO/SMR Recruitment',
    brandColor: '#f59e0b',
    applyUrl: 'https://medcareerswa.health.wa.gov.au/resident-medical-officers',
    applyLabel: 'MedCareersWA RMO',
    cycle2027: {
      open: '2026-05-25',
      close: '2026-06-22',
      status: 'confirmed',
      sourceUrl: 'https://medcareerswa.health.wa.gov.au/resident-medical-officers',
    },
    imgEligible: true,
    imgNotes: 'Requires completed accredited internship or equivalent + Ahpra registration eligibility. AMC-pass holders without internship typically use the IMG Observership pathway first.',
    tips: [
      'WA Country Health Service has strong IMG support',
      'WACHS rural positions come with generous packages',
      'Perth metro is competitive — rural WA is easier to enter',
    ],
  },
  {
    code: 'SA',
    state: 'South Australia',
    poolName: 'SA MET PGY2+ Centralised EOI',
    brandColor: '#10b981',
    applyUrl: 'https://samet.org.au/postgraduate-year-2-and-beyond-recruitment/',
    applyLabel: 'SA MET PGY2+',
    cycle2027: {
      open: '2026-06-10',
      close: '2026-07-01',
      status: 'confirmed',
      sourceUrl: 'https://samet.org.au/postgraduate-year-2-and-beyond-recruitment/pgy2-key-dates/',
      notes: 'Referee deadline: Wed 8 Jul 2026, 5pm ACST.',
    },
    imgEligible: true,
    imgNotes: 'EOI requires Ahpra registration eligibility. SA MET maintains a separate AMC information page.',
    tips: [
      'Dedicated IMG recruitment support officers',
      'Regional roles at Whyalla, Mt Gambier, Port Augusta',
      'Good pathway to Fellowship via rural exposure',
    ],
  },
  {
    code: 'NT',
    state: 'Northern Territory',
    poolName: 'NT Health Top End + Central Australia RMO',
    brandColor: '#ef4444',
    applyUrl: 'https://health.nt.gov.au/careers/medical-officers/top-end-medical-officer-jobs/residents',
    applyLabel: 'NT Health RMO',
    cycle2027: {
      open: '2026-06-01',
      close: '2026-06-28',
      status: 'confirmed',
      sourceUrl: 'https://health.nt.gov.au/careers/medical-officers/top-end-medical-officer-jobs/residents',
      notes: 'Top End and Central Australia require separate applications.',
    },
    imgEligible: true,
    imgNotes: 'Separate IMG-specific page at health.nt.gov.au/careers/medical-officers/top-end-medical-officer-jobs/international-medical-graduates',
    tips: [
      'Easiest entry pathway for IMGs in Australia',
      'Royal Darwin Hospital is a major tertiary centre',
      'DPA area — counts toward GP pathway bonding requirements',
    ],
  },
  {
    code: 'ACT',
    state: 'Australian Capital Territory',
    poolName: 'Canberra Health Services JMO Recruitment',
    brandColor: '#64748b',
    applyUrl: 'https://www.canberrahealthservices.act.gov.au/careers/junior-medical-officer-careers',
    applyLabel: 'CHS JMO Careers',
    cycle2027: {
      open: '2026-05-05',
      close: '2026-06-04',
      status: 'confirmed',
      sourceUrl: 'https://www.canberrahealthservices.act.gov.au/careers/junior-medical-officer-careers',
      notes: 'Intern stream dates. RMO/Registrar stream dates listed as TBC on official page.',
    },
    altCycles: [
      {
        name: 'RMO / Registrar stream',
        cycle: {
          open: 'TBC',
          close: 'TBC',
          status: 'tbc',
          sourceUrl: 'https://www.canberrahealthservices.act.gov.au/careers/junior-medical-officer-careers',
        },
      },
    ],
    imgEligible: true,
    imgNotes: 'AMC graduates are placed in Category 4 — first-round offer not guaranteed.',
    tips: [
      'Calvary and Canberra Hospital are the main employers',
      'Smaller pool — apply early',
      'Good work-life balance; proximity to Sydney',
    ],
  },
  {
    code: 'TAS',
    state: 'Tasmania',
    poolName: 'DoH Tasmania Statewide RMO Campaign',
    brandColor: '#0ea5e9',
    applyUrl: 'https://www.health.tas.gov.au/careers/career-options/medical-careers',
    applyLabel: 'TAS DoH Medical Careers',
    cycle2027: {
      open: 'TBC',
      close: 'TBC',
      status: 'tbc',
      sourceUrl: 'https://www.health.tas.gov.au/careers/career-options/medical-careers/doctors-training',
      notes: 'Site blocks automated fetching; 2027 cycle dates not yet published. Single statewide pool, single application.',
    },
    imgEligible: true,
    imgNotes: 'AMC grads with general Ahpra registration eligible. Some streams require completion of PGY1 in Australia.',
    tips: [
      'Single statewide pool — one application covers all TAS public hospitals',
      'Smaller scale but personalised process',
      'Manually check site from mid-year onwards as CDN blocks bots',
    ],
  },
];

export type FallbackLink = {
  label: string;
  url: string;
  note: string;
};

export const RMO_FALLBACK_LINKS: FallbackLink[] = [
  {
    label: 'Medrecruit — Private RMO jobs',
    url: 'https://medrecruit.medworld.com/doctors/rmo-jobs-australia',
    note: 'Private sector RMO vacancies updated daily. Use when public pools are closed.',
  },
];
