import type { MetadataRoute } from "next";

const BASE = "https://mostlymedicine.com";

type Entry = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

const entries: Entry[] = [
  // Home
  { path: "/", changeFrequency: "weekly", priority: 1.0 },

  // Tier 1 — pillar pages (highest GEO value)
  { path: "/amc",                   changeFrequency: "monthly", priority: 0.95 },
  { path: "/amc-cat1",              changeFrequency: "monthly", priority: 0.9  },
  { path: "/amc-cat2",              changeFrequency: "monthly", priority: 0.9  },
  { path: "/amc-vs-usmle-vs-plab",  changeFrequency: "monthly", priority: 0.9  },
  { path: "/img-australia-pathway", changeFrequency: "monthly", priority: 0.9  },
  { path: "/amc-handbook-2026",     changeFrequency: "monthly", priority: 0.85 },
  { path: "/amc-pass-rates-by-country", changeFrequency: "monthly", priority: 0.9 },
  { path: "/amc-vs-plab", changeFrequency: "monthly", priority: 0.9 },

  // Tier 2 — specialty MCQ pages (auto-generated from packages/content)
  { path: "/amc-mcq",                            changeFrequency: "monthly", priority: 0.8 },
  { path: "/amc-mcq/cardiology",                 changeFrequency: "monthly", priority: 0.7 },
  { path: "/amc-mcq/respiratory",                changeFrequency: "monthly", priority: 0.7 },
  { path: "/amc-mcq/gastroenterology",           changeFrequency: "monthly", priority: 0.7 },
  { path: "/amc-mcq/neurology",                  changeFrequency: "monthly", priority: 0.7 },
  { path: "/amc-mcq/endocrinology",              changeFrequency: "monthly", priority: 0.7 },
  { path: "/amc-mcq/psychiatry",                 changeFrequency: "monthly", priority: 0.7 },
  { path: "/amc-mcq/paediatrics",                changeFrequency: "monthly", priority: 0.7 },
  { path: "/amc-mcq/obstetrics-gynaecology",     changeFrequency: "monthly", priority: 0.7 },
  { path: "/amc-mcq/emergency-medicine",         changeFrequency: "monthly", priority: 0.7 },
  { path: "/amc-mcq/nephrology",                 changeFrequency: "monthly", priority: 0.7 },
  { path: "/amc-mcq/rheumatology",               changeFrequency: "monthly", priority: 0.7 },
  { path: "/amc-mcq/infectious-disease",         changeFrequency: "monthly", priority: 0.7 },
  { path: "/amc-mcq/surgery",                    changeFrequency: "monthly", priority: 0.7 },
  { path: "/amc-mcq/pharmacology",               changeFrequency: "monthly", priority: 0.7 },

  // Tier 3 — clinical framework pages
  { path: "/spikes-protocol",                changeFrequency: "yearly",  priority: 0.7 },
  { path: "/calgary-cambridge-consultation", changeFrequency: "yearly",  priority: 0.7 },
  { path: "/socrates-pain-history",          changeFrequency: "yearly",  priority: 0.7 },
  { path: "/amc-clinical-stations-guide",    changeFrequency: "monthly", priority: 0.8 },

  // Tier 4 — utility tools (link bait)
  { path: "/amc-fee-calculator",     changeFrequency: "yearly",  priority: 0.75 },
  { path: "/amc-timeline-planner",   changeFrequency: "yearly",  priority: 0.7  },
  { path: "/ielts-vs-oet",           changeFrequency: "yearly",  priority: 0.7  },
  { path: "/amc-eligibility-checker", changeFrequency: "yearly", priority: 0.7  },

  // Existing dashboard
  { path: "/dashboard/cat1",      changeFrequency: "weekly",  priority: 0.6 },
  { path: "/dashboard/cat2",      changeFrequency: "weekly",  priority: 0.6 },
  { path: "/dashboard/reference", changeFrequency: "monthly", priority: 0.5 },
  { path: "/dashboard/library",   changeFrequency: "monthly", priority: 0.5 },
  { path: "/dashboard/jobs",      changeFrequency: "weekly",  priority: 0.6 },
  { path: "/amc-checklist",       changeFrequency: "monthly", priority: 0.5 },
  { path: "/careers",             changeFrequency: "monthly", priority: 0.4 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return entries.map((e) => ({
    url: `${BASE}${e.path}`,
    lastModified: now,
    changeFrequency: e.changeFrequency,
    priority: e.priority,
  }));
}
