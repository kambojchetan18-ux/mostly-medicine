// Patient actor brief — generated deterministically from a CaseVariant.
// This is what the human playing the patient sees during reading. It's the
// equivalent of the system prompt the AI patient gets in solo mode.

import type { CaseVariant, ClueItem } from "./types";

export interface PatientBrief {
  identity: {
    name: string;
    ageBand: string;
    gender: string;
    occupation: string;
    setting: string;
  };
  truth: {
    hiddenDiagnosis: string;
    redFlags: string[];
  };
  portrayal: {
    emotionalTone: string;
    personalityNotes: string;
    speechStyle: string;
  };
  reveal: {
    volunteer: string[];
    onlyWhenAsked: Array<{ trigger: string; reveal: string }>;
    distractors: Array<{ trigger: string; reveal: string }>;
  };
  rules: string[];
}

export function buildPatientBrief(variant: CaseVariant): PatientBrief {
  const volunteer: string[] = [variant.stationStem.presentingComplaint];
  const onlyWhenAsked: Array<{ trigger: string; reveal: string }> = [];
  const distractors: Array<{ trigger: string; reveal: string }> = [];

  for (const clue of variant.cluePool as ClueItem[]) {
    if (clue.significance === "key" || clue.significance === "supporting") {
      onlyWhenAsked.push({ trigger: clue.trigger, reveal: clue.reveal });
    } else {
      distractors.push({ trigger: clue.trigger, reveal: clue.reveal });
    }
  }

  return {
    identity: {
      name: variant.patientProfile.name,
      ageBand: variant.patientProfile.ageBand,
      gender: variant.patientProfile.gender,
      occupation: variant.patientProfile.occupation ?? "—",
      setting: variant.setting,
    },
    truth: {
      hiddenDiagnosis: variant.hiddenDiagnosis,
      redFlags: variant.redFlags,
    },
    portrayal: {
      emotionalTone: variant.emotionalTone,
      personalityNotes: variant.patientProfile.personalityNotes,
      speechStyle: variant.patientProfile.speechStyle,
    },
    reveal: {
      volunteer,
      onlyWhenAsked,
      distractors,
    },
    rules: [
      "You are an actor playing this patient. Stay in character for the full 8 minutes.",
      "Volunteer the items in 'volunteer' naturally — do not list them off; weave them in.",
      "Only share an 'onlyWhenAsked' item when the doctor asks something that semantically matches its trigger.",
      "Never name your diagnosis. Even if the doctor asks 'do you have X?' — answer in patient terms ('I haven't been told that').",
      "Distractors are honest things about you that point elsewhere — share them only if asked.",
      "Match the emotional tone and speech style. Imperfect grammar / hesitation is okay if that fits.",
      "If asked something not in this brief, say 'no, nothing like that' or 'I don't think so'. Don't invent.",
    ],
  };
}

// Short invite-code generator — 6 chars, unambiguous (no 0/O/1/I).
export function generateInviteCode(length = 6): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}
