import type {Flashcard} from "./flashcards";

// Hand-derived seed cards covering AMC CAT 1 + CAT 2 dermatology high-yield.
// Mirrors flashcards-gastro.ts conventions — cloze ≤2, AU-cited, no fluff.
export const dermatologyFlashcards: Flashcard[] = [
  {
    id: "fc-derm-001",
    specialty: "dermatology",
    subtopic: "Melanoma ABCDE",
    front_md:
      "The ABCDE rule for clinical melanoma screening evaluates {{c1::Asymmetry, Border irregularity, Colour variation, Diameter ≥6 mm, Evolution}} — combined with the {{c2::ugly duckling sign}} (the lesion that doesn't match the patient's other naevi).",
    back_md:
      "Australia has the highest melanoma incidence globally. SunSmart targets dermoscopic + total body photography (Mole Mapping) for high-risk patients — fair skin, ≥50 naevi, family or personal history, immunosuppression. Document every suspicious lesion with dermoscopy before excisional biopsy.",
    citation: "Cancer Council AU · ACD melanoma guidelines",
    mark_sheet_domain: "investigations",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-derm-002",
    specialty: "dermatology",
    subtopic: "Breslow staging",
    front_md:
      "Primary melanoma prognosis is driven by {{c1::Breslow thickness}}: ≤1 mm has >90% 5-year survival, while >4 mm drops to ~50%. Sentinel node biopsy is recommended for Breslow ≥{{c2::0.8 mm}} or with ulceration / high mitotic rate.",
    back_md:
      "Excisional biopsy with 2 mm clinical margin is the diagnostic standard — never shave or punch a suspected melanoma (under-staging risk). Wide local excision margins follow AJCC: in situ 5 mm, ≤1 mm 10 mm, 1–2 mm 10–20 mm, >2 mm 20 mm. Refer to multi-D melanoma unit for stage III/IV.",
    citation: "ACD · AJCC 8th · Cancer Council AU",
    mark_sheet_domain: "knowledge",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-derm-003",
    specialty: "dermatology",
    subtopic: "SunSmart",
    front_md:
      "The Australian SunSmart campaign recommends the five sun-protection steps — {{c1::slip on a shirt, slop on SPF50+ broad-spectrum sunscreen, slap on a hat, seek shade, slide on sunglasses}} — when UV index is ≥{{c2::3}}.",
    back_md:
      "Reapply sunscreen every 2 hours and after swimming. Vitamin D adequacy can usually be maintained with incidental sun exposure outside peak UV. NBCC/Cancer Council estimate ~2 in 3 Australians will develop a skin cancer by age 70.",
    citation: "Cancer Council AU · SunSmart",
    mark_sheet_domain: "knowledge",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-derm-004",
    specialty: "dermatology",
    subtopic: "Actinic keratosis",
    front_md:
      "Field-treatment options for multiple actinic keratoses on chronically sun-damaged skin include {{c1::topical 5-fluorouracil, imiquimod, or ingenol mebutate}}; isolated lesions are usually treated with {{c2::cryotherapy}}.",
    back_md:
      "AK is a pre-malignant in-situ keratinocyte dysplasia with ~1% per lesion per year risk of progression to invasive SCC — but cumulative field risk is higher. Counsel re: brisk inflammatory reaction with topicals. PBS subsidises 5-FU and imiquimod.",
    citation: "eTG Dermatology · ACD AK consensus",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-derm-005",
    specialty: "dermatology",
    subtopic: "Basal cell carcinoma",
    front_md:
      "First-line treatment for a nodular BCC on the trunk is {{c1::surgical excision with 3–4 mm margins}}; for a superficial BCC in a low-risk site, topical {{c2::imiquimod 5%}} is a non-surgical option.",
    back_md:
      "Mohs micrographic surgery is preferred for high-risk sites (H-zone of face, recurrent BCC, morphoeic subtype, >2 cm). BCC almost never metastasises but causes significant local destruction. Lifelong skin surveillance — patients with one BCC have ~40% 5-year risk of another.",
    citation: "ACD BCC guidelines · eTG Dermatology",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-derm-006",
    specialty: "dermatology",
    subtopic: "Squamous cell carcinoma",
    front_md:
      "Cutaneous SCC has a {{c1::5–7%}} metastatic risk overall — higher for tumours on the lip/ear, >2 cm, >4 mm thick, or in immunosuppressed patients. Standard treatment is {{c2::surgical excision with 4–6 mm margins}}.",
    back_md:
      "Organ-transplant recipients have ~65–100× SCC risk; mandate annual full skin checks. High-risk SCC warrants sentinel node assessment and adjuvant radiotherapy discussion. Cemiplimab (PBS Authority) is approved for advanced/metastatic cSCC.",
    citation: "ACD cSCC guidelines · eTG Dermatology",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-derm-007",
    specialty: "dermatology",
    subtopic: "Melanoma systemic therapy",
    front_md:
      "Stage III–IV melanoma adjuvant or first-line systemic options on PBS Authority include {{c1::pembrolizumab or nivolumab}} (PD-1 inhibitors); BRAF V600-mutated tumours additionally qualify for {{c2::dabrafenib + trametinib}}.",
    back_md:
      "All resected stage III and metastatic melanoma should have BRAF mutation testing. Combination ipilimumab + nivolumab improves response but with higher immune-related adverse event burden. Counsel re: colitis, hepatitis, hypophysitis, thyroiditis — early prednisolone for irAEs.",
    citation: "PBS Authority · COSA melanoma guidelines",
    mark_sheet_domain: "mgmt",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
  {
    id: "fc-derm-008",
    specialty: "dermatology",
    subtopic: "Eczema steroid potency",
    front_md:
      "Topical corticosteroid potency for atopic dermatitis is matched to body site — {{c1::mild (hydrocortisone 1%) for face/flexures}} and {{c2::moderate-to-potent (methylprednisolone aceponate / betamethasone valerate) for trunk and limbs}}.",
    back_md:
      "Use the 'fingertip unit' to dose (~0.5 g covers two adult palms). Step-down once flare settles. Wet-wrap dressings + emollient flooding (≥3× daily) for severe flares. Suspect secondary S. aureus impetiginisation if weeping/crusted → oral flucloxacillin.",
    citation: "eTG Dermatology · ACD eczema",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-derm-009",
    specialty: "dermatology",
    subtopic: "Psoriasis biologics",
    front_md:
      "First-line for moderate-to-severe plaque psoriasis (PASI ≥10) is {{c1::narrow-band UVB phototherapy}}; when phototherapy fails, methotrexate then PBS-Authority biologics — {{c2::TNFα, IL-17, or IL-23 inhibitors}}.",
    back_md:
      "Screen for latent TB (IGRA), hep B/C, HIV before biologics. IL-17 inhibitors (secukinumab, ixekizumab) can flare IBD. Monitor LFTs, FBE 3-monthly on methotrexate; add folic acid 5 mg weekly (not on MTX day).",
    citation: "PBS Authority · ACD psoriasis · eTG Dermatology",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-derm-010",
    specialty: "dermatology",
    subtopic: "Acne stepwise",
    front_md:
      "AMC stepwise acne ladder: mild = {{c1::topical retinoid + benzoyl peroxide}}; moderate inflammatory = add oral doxycycline (max {{c2::3 months}} to limit resistance); severe/scarring/relapsing = oral isotretinoin under specialist.",
    back_md:
      "Isotretinoin is teratogenic (pregnancy category X) — AU iPLEDGE-equivalent requires two negative pregnancy tests + two contraceptive methods + monthly review. Counsel re: dryness, mood (screen depression), LFT + lipids monthly. COCP / spironolactone useful adjuncts in females.",
    citation: "eTG Dermatology · ACD isotretinoin · TGA",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-derm-011",
    specialty: "dermatology",
    subtopic: "Rosacea",
    front_md:
      "First-line topical for papulopustular rosacea is {{c1::metronidazole 0.75% or ivermectin 1% cream}}; persistent disease adds oral {{c2::doxycycline 40 mg modified-release daily}}.",
    back_md:
      "Avoid potent fluorinated topical corticosteroids — they precipitate steroid-rosacea. Counsel triggers: alcohol, hot drinks, spicy food, UV, stress. Ocular rosacea (blepharitis, dry eye) common — lid hygiene + ophthalmology if severe.",
    citation: "eTG Dermatology · ACD rosacea",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-derm-012",
    specialty: "dermatology",
    subtopic: "Tinea",
    front_md:
      "Limited tinea corporis/cruris/pedis is treated with {{c1::topical terbinafine for 2–4 weeks}}; tinea unguium or tinea capitis requires oral {{c2::terbinafine 250 mg daily for 6 weeks (fingernails) or 12 weeks (toenails / scalp)}}.",
    back_md:
      "Confirm with skin scraping / nail clippings for microscopy + culture before starting oral therapy (LFT monitoring). Tinea pedis ('athlete's foot') usually Trichophyton rubrum — keep feet dry, alternate shoes. Tinea incognito = misdiagnosed tinea treated with steroid → florid spread.",
    citation: "eTG Dermatology · ACD",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-derm-013",
    specialty: "dermatology",
    subtopic: "Scabies",
    front_md:
      "Classical scabies treatment is {{c1::permethrin 5% cream applied head/neck to toes overnight, repeated in 7 days}}; all household + close contacts treated simultaneously. Crusted (Norwegian) scabies adds oral {{c2::ivermectin 200 mcg/kg on days 1, 2, 8 (± 9, 15)}}.",
    back_md:
      "Itch persists 2–4 weeks post-eradication — not treatment failure. Wash bedding/clothes at ≥60°C or seal in plastic for 72 hours. Crusted scabies is endemic in remote Indigenous communities (NT, WA, Far North QLD) — contact PHN scabies coordinator.",
    citation: "eTG Dermatology · NACCHO · ARF/RHD endemic communities guide",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-derm-014",
    specialty: "dermatology",
    subtopic: "Chronic urticaria",
    front_md:
      "Chronic spontaneous urticaria first-line is a {{c1::second-generation non-sedating antihistamine at up to 4× standard dose}} (e.g. cetirizine 10 mg QID); refractory cases qualify for PBS Authority {{c2::omalizumab}}.",
    back_md:
      "Symptoms ≥6 weeks define 'chronic'. Routine bloods (FBE, CRP, TFT) reasonable; allergy testing low-yield in chronic spontaneous form. Educate that urticaria is not allergic in most cases. Add montelukast if antihistamine-refractory before biologic.",
    citation: "eTG Dermatology · ACD urticaria",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-derm-015",
    specialty: "dermatology",
    subtopic: "SJS/TEN",
    front_md:
      "Stevens–Johnson syndrome and toxic epidermal necrolysis are stratified by body surface area detached: SJS <10%, overlap 10–30%, TEN >30%. First step is {{c1::immediate withdrawal of all suspect drugs}} and transfer to a {{c2::burns or ICU unit}}.",
    back_md:
      "Common culprits: allopurinol, lamotrigine, carbamazepine, sulfonamides, NSAIDs. SCORTEN ≥3 = high mortality. Supportive care is the cornerstone — fluid + electrolyte, eye + mucosal care, infection surveillance. Adjuncts (IVIG, ciclosporin, etanercept) per specialist judgement. List allergy in My Health Record.",
    citation: "ACD SJS/TEN · eTG Dermatology",
    mark_sheet_domain: "safety_net",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-derm-016",
    specialty: "dermatology",
    subtopic: "Cellulitis",
    front_md:
      "Empirical antibiotic for uncomplicated lower-limb cellulitis in Australia is {{c1::oral di/flucloxacillin 500 mg QID for 5–10 days}}; mark border + elevate. Add MRSA cover (e.g. {{c2::trimethoprim-sulfamethoxazole or doxycycline}}) for purulent infection or recent MRSA contact.",
    back_md:
      "Erysipelas (sharply demarcated, raised, beta-haemolytic Strep) = same antibiotic. Look for portal of entry — tinea pedis, ulcer, lymphoedema. Outpatient OPAT IV cefazolin via Hospital-in-the-Home is reasonable. Recurrent cellulitis → prophylactic penicillin V 250 mg BD.",
    citation: "eTG Antibiotic · ASID skin & soft tissue",
    mark_sheet_domain: "mgmt",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-derm-017",
    specialty: "dermatology",
    subtopic: "Pyoderma gangrenosum",
    front_md:
      "Painful rapidly enlarging ulcer with violaceous undermined border in a patient with {{c1::inflammatory bowel disease or rheumatoid arthritis}} → suspect pyoderma gangrenosum. Treatment is {{c2::systemic corticosteroid ± ciclosporin}} — never debride.",
    back_md:
      "Pathergy (worsening with trauma) is classic — avoid biopsy of central ulcer; biopsy edge only to exclude infection/malignancy. Treat the underlying systemic disease. Biologics (infliximab) work especially with co-existent IBD.",
    citation: "ACD pyoderma gangrenosum · eTG Dermatology",
    mark_sheet_domain: "ddx",
    amc_part: "part_1",
    ai_generated: false,
  },
  {
    id: "fc-derm-018",
    specialty: "dermatology",
    subtopic: "Indigenous skin health",
    front_md:
      "Endemic conditions in remote Aboriginal and Torres Strait Islander communities include {{c1::scabies, impetigo, and chronic suppurative otitis media}} — linked to overcrowding and post-streptococcal {{c2::ARF/RHD and acute post-strep glomerulonephritis}}.",
    back_md:
      "Mass drug administration with ivermectin has reduced scabies prevalence in NT trials. Treat impetigo with single-dose IM benzathine benzylpenicillin or short oral course — under NACCHO/ARF programs. School-based skin checks and housing advocacy are core public-health interventions.",
    citation: "NACCHO · ARF/RHD AU guideline · Healthy Skin Program NT",
    mark_sheet_domain: "knowledge",
    amc_part: "part_2_clinical",
    ai_generated: false,
  },
];
