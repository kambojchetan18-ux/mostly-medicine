import type {Flashcard} from "./flashcards";

// Hand-derived seed cards covering AMC CAT 1 + CAT 2 palliative care high-yield.
// Mirrors flashcards-gastro.ts conventions — cloze ≤2, AU-cited, no fluff.
export const palliativeFlashcards: Flashcard[] = [
  {
    id: "fc-palli-001",
    specialty: "palliative_care",
    subtopic: "Palliative care principles",
    front_md:
      "WHO defines palliative care as an approach that improves quality of life through {{c1::prevention and relief of suffering across physical, psychological, social and spiritual domains}}. It should be integrated {{c2::early in the trajectory of life-limiting illness}} — not reserved for the last weeks.",
    back_md:
      "Early palliative care alongside disease-modifying treatment improves QoL and may extend survival (Temel NEJM 2010). Palliative Care Australia maps three patient streams: stable, unstable, deteriorating, terminal. MBS chronic disease + GPMP + Team Care Arrangement can fund allied health.",
    citation: "WHO · Palliative Care Australia · CareSearch",
    mark_sheet_domain: "knowledge",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-palli-002",
    specialty: "palliative_care",
    subtopic: "End-of-life recognition",
    front_md:
      "End-of-life prognostication tools include the {{c1::Surprise Question ('Would you be surprised if this patient died in the next 12 months?')}} and GSF prognostic indicators. Signs of last days include {{c2::increasing somnolence, reduced oral intake, Cheyne-Stokes breathing, mottled extremities}}.",
    back_md:
      "Document the recognition of dying explicitly in notes. Trigger an end-of-life care plan: stop non-essential meds + investigations, anticipatory subcutaneous PRNs, family update, spiritual + cultural needs, preferred place of death.",
    citation: "End-of-Life Essentials · GSF · CareSearch",
    mark_sheet_domain: "knowledge",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-palli-003",
    specialty: "palliative_care",
    subtopic: "WHO analgesic ladder",
    front_md:
      "The WHO analgesic ladder for cancer pain steps: step 1 {{c1::non-opioid (paracetamol ± NSAID)}}, step 2 weak opioid (codeine, tramadol), step 3 {{c2::strong opioid (morphine, oxycodone, hydromorphone, fentanyl)}}, ± adjuvants (gabapentin, amitriptyline) at every step.",
    back_md:
      "By-the-clock dosing, not PRN-only. Add appropriate adjuvant for the pain mechanism — neuropathic (gabapentinoid + TCA), bone (NSAID + bisphosphonate + RT). Co-prescribe regular laxative + antiemetic during opioid commencement.",
    citation: "WHO · eTG Palliative Care · PCC4U",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-palli-004",
    specialty: "palliative_care",
    subtopic: "Opioid conversion",
    front_md:
      "Approximate opioid equianalgesic conversions: 30 mg oral morphine ≈ {{c1::20 mg oral oxycodone ≈ 10 mg subcutaneous morphine}}. A 25 mcg/h transdermal fentanyl patch ≈ {{c2::60 mg oral morphine per 24 hours}}.",
    back_md:
      "When switching opioid (toxicity, route change), reduce calculated equivalent by 25–50% to allow for incomplete cross-tolerance. Always cross-check with PalliAge or Faculty of Pain Medicine calculator. Renal failure → avoid morphine (active metabolites accumulate) → use fentanyl/hydromorphone.",
    citation: "eTG Palliative Care · FPM ANZCA · CareSearch",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-palli-005",
    specialty: "palliative_care",
    subtopic: "Breakthrough dose",
    front_md:
      "Breakthrough opioid dose for incident or end-of-dose pain is calculated as {{c1::1/6 of the total 24-hour opioid requirement}}, given {{c2::every 1 hour PRN orally (or every 30 minutes subcutaneously)}}.",
    back_md:
      "If patient needs ≥3 breakthrough doses in 24 hours consistently → increase the regular long-acting dose by ~25–50%, accounting for breakthrough use. Document breakthrough use prospectively. Counsel families on signs of opioid toxicity — myoclonus, drowsiness, hallucinations, pinpoint pupils.",
    citation: "eTG Palliative Care · CareSearch",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-palli-006",
    specialty: "palliative_care",
    subtopic: "Opioid bowel care",
    front_md:
      "Anticipatory bowel care for every patient starting opioids is {{c1::regular stimulant + softener (e.g. senna + docusate)}}. Opioid-induced constipation refractory to standard laxatives: {{c2::methylnaltrexone or naloxegol (PBS Authority for OIC)}}.",
    back_md:
      "Constipation is the most predictable opioid side effect; tolerance does not develop. Avoid bulking agents (e.g. ispaghula) in advanced cancer or poor fluid intake — risk of impaction. Address position, privacy, hydration.",
    citation: "eTG Palliative Care · PBS Authority",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-palli-007",
    specialty: "palliative_care",
    subtopic: "Nausea + vomiting",
    front_md:
      "Match the antiemetic to the mechanism — {{c1::cyclizine for motion / vestibular, metoclopramide for gastric stasis (caution in Parkinson's / bowel obstruction), haloperidol for chemical (uraemia / opioid / hypercalcaemia)}}; {{c2::ondansetron for chemotherapy and radiotherapy}}.",
    back_md:
      "Constipation drives substantial nausea — always treat first. Cyclizine sedates + anticholinergic burden (avoid combined with metoclopramide as they antagonise). Levomepromazine = broad-spectrum 'rescue' antiemetic in syringe driver.",
    citation: "eTG Palliative Care · CareSearch",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-palli-008",
    specialty: "palliative_care",
    subtopic: "Dyspnoea",
    front_md:
      "Palliative dyspnoea management: non-pharmacological {{c1::positioning, fan to face, breathing techniques, oxygen only if SpO2 <90%}}; pharmacological starts with {{c2::oral morphine 2.5 mg PRN (or SC 1.25 mg)}} — opioid-naive patients.",
    back_md:
      "Low-dose benzodiazepine (lorazepam SL or midazolam SC) adjunct for anxiety-driven dyspnoea. Oxygen is NOT routinely helpful in non-hypoxic patients — air movement (fan) often more effective. Treat reversible drivers — pleural effusion drainage, pulmonary embolism, anaemia, heart failure.",
    citation: "eTG Palliative Care · CareSearch · TSANZ position",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-palli-009",
    specialty: "palliative_care",
    subtopic: "Terminal restlessness",
    front_md:
      "Terminal restlessness / agitated delirium in the last days is managed with {{c1::midazolam 2.5–5 mg SC PRN}}; haloperidol 0.5–1.5 mg SC is added when {{c2::persistent agitation or hyperactive delirium predominates}}.",
    back_md:
      "First exclude reversible drivers: pain, urinary retention, faecal impaction, hypoxia, opioid toxicity. Levomepromazine or phenobarbitone in refractory cases. Family education vital — agitation can be deeply distressing to witness.",
    citation: "eTG Palliative Care · CareSearch",
    mark_sheet_domain: "mgmt",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-palli-010",
    specialty: "palliative_care",
    subtopic: "Subcutaneous syringe driver",
    front_md:
      "Common 24-hour subcutaneous syringe driver mixtures in Australian palliative practice combine {{c1::morphine + midazolam + metoclopramide (or haloperidol)}}; the driver is delivered via a {{c2::Niki T34 (or CADD-Solis) pump}} over 24 hours.",
    back_md:
      "Hyoscine butylbromide added for terminal respiratory secretions. Site care (rotate every 48–72 h, watch for erythema). Check compatibility table (PCC4U / CareSearch). Always continue breakthrough subcut doses alongside the syringe driver.",
    citation: "eTG Palliative Care · CareSearch · PCC4U",
    mark_sheet_domain: "mgmt",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-palli-011",
    specialty: "palliative_care",
    subtopic: "Voluntary Assisted Dying",
    front_md:
      "Common Australian VAD eligibility criteria (state-specific) include {{c1::adult Australian citizen / resident with decision-making capacity, advanced disease causing intolerable suffering, prognosis ≤6 months (≤12 months neurodegenerative)}} — assessment by {{c2::two independent medical practitioners}}.",
    back_md:
      "Currently legal in all 6 states (NSW, VIC, QLD, WA, SA, TAS). NT/ACT progressing. Doctor cannot initiate the conversation in some jurisdictions (VIC). Conscientious objection allowed but patient must be referred onwards. Multiple safeguards — written + witnessed requests + mandatory cooling-off period.",
    citation: "State VAD Acts (VIC 2017, WA, QLD, NSW, SA, TAS) · CareSearch",
    mark_sheet_domain: "communication",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-palli-012",
    specialty: "palliative_care",
    subtopic: "Advance Care Directive",
    front_md:
      "An Advance Care Directive must be completed {{c1::before the patient loses decision-making capacity}} and uses the {{c2::state-specific statutory form (e.g. Advance Care Directive SA, Refusal of Treatment Certificate VIC)}}.",
    back_md:
      "Distinguish from an Advance Care Plan (broader values document) and from appointing a substitute decision-maker (Enduring Power of Attorney / Guardian). Upload to My Health Record and provide copies to GP, RACF and family. Review whenever clinical status changes.",
    citation: "Advance Care Planning Australia · state legislation",
    mark_sheet_domain: "communication",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-palli-013",
    specialty: "palliative_care",
    subtopic: "Bereavement",
    front_md:
      "Anticipatory grief begins {{c1::before the death}} as the family prepares for loss; complicated/prolonged grief is screened at {{c2::6–12 months post-death (e.g. with PG-13 or ICD-11 Prolonged Grief Disorder criteria)}}.",
    back_md:
      "Routine bereavement contact at 2–6 weeks post-death plus an anniversary call. Refer to GP for risk screening — prior loss, mental illness, lack of support, traumatic death, dependent children. GriefLine 1300-845-745, Lifeline 13-11-14.",
    citation: "Palliative Care Australia bereavement · CareSearch",
    mark_sheet_domain: "communication",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-palli-014",
    specialty: "palliative_care",
    subtopic: "Spiritual + cultural care",
    front_md:
      "Spiritual care needs are explored using open frameworks such as the {{c1::FICA (Faith, Importance, Community, Address)}} tool. Offer {{c2::chaplaincy / Aboriginal liaison / culturally appropriate elder}} early in the trajectory.",
    back_md:
      "Sacrament considerations: Catholic anointing of the sick, Muslim shahada at end of life, Hindu/Sikh death rites, ATSI 'finishing up' / Sorry Business. Document preferences in the care plan. Cultural safety is a core capability under the Aged Care Quality Standards.",
    citation: "Palliative Care Australia · NACCHO end-of-life",
    mark_sheet_domain: "communication",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-palli-015",
    specialty: "palliative_care",
    subtopic: "Family meeting + breaking bad news",
    front_md:
      "Structured family meetings to discuss prognosis / goals of care use the {{c1::SPIKES framework — Setting, Perception, Invitation, Knowledge, Emotion, Strategy/Summary}}. End with {{c2::a written summary plus agreed follow-up plan}}.",
    back_md:
      "Quiet private room, tissues, key family present, mute pagers. Open with 'tell me your understanding so far'. Allow silence after delivering news. Document attendees, content, decisions, follow-up. Acknowledge uncertainty honestly.",
    citation: "Baile SPIKES · End-of-Life Essentials",
    mark_sheet_domain: "communication",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-palli-016",
    specialty: "palliative_care",
    subtopic: "Last hours of life",
    front_md:
      "Care of the dying in the last hours: stop non-essential medications and investigations; convert essentials to {{c1::subcutaneous PRN or syringe driver}}; provide regular {{c2::mouth care, repositioning, eye lubricant, family bedside support}}.",
    back_md:
      "Reassure families re: 'death rattle' (hyoscine butylbromide 20 mg SC PRN if distressing). Artificial nutrition/hydration is not routinely indicated — discuss honestly. Verification of death + bereavement leaflet + GP/coroner notification per state requirements.",
    citation: "End-of-Life Essentials · eTG Palliative Care",
    mark_sheet_domain: "mgmt",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
];
