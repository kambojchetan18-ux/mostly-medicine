export type AmcPart = "part_1" | "part_2_clinical" | "both";
export type MarkSheetDomain =
  | "history"
  | "ddx"
  | "mgmt"
  | "safety_net"
  | "communication"
  | "investigations"
  | "knowledge";

export interface Flashcard {
  id: string;
  specialty: string;
  subtopic?: string;
  front_md: string;
  back_md: string;
  citation?: string;
  mark_sheet_domain?: MarkSheetDomain;
  amc_part: AmcPart;
  source_question_id?: string;
  ai_generated: boolean;
}

export const isClozeCard = (front: string) => /\{\{c\d+::[^}]+\}\}/.test(front);

export const extractCloze = (front: string) => {
  const matches = Array.from(front.matchAll(/\{\{c(\d+)::([^}]+)\}\}/g));
  return matches.map((m) => ({index: Number(m[1]), text: m[2]}));
};
