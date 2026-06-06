export { seedQuestions } from "./questions";
export type { MCQuestion } from "./questions";
export * from "./rmo-pools";
export * from "./flashcards";
export { cardiologyFlashcards } from "./flashcards-cardiology";
export { respiratoryFlashcards } from "./flashcards-respiratory";
export { gastroFlashcards } from "./flashcards-gastro";
export { neurologyFlashcards } from "./flashcards-neurology";
export { endocrineFlashcards } from "./flashcards-endocrine";
export { obgynFlashcards } from "./flashcards-obgyn";
export { paediatricsFlashcards } from "./flashcards-paediatrics";
export { psychiatryFlashcards } from "./flashcards-psychiatry";
export { emergencyFlashcards } from "./flashcards-emergency";
export { aboriginalHealthFlashcards } from "./flashcards-aboriginal-health";
export { ruralFlashcards } from "./flashcards-rural";
export { culturalSafetyFlashcards } from "./flashcards-cultural-safety";
export { ethicsLawFlashcards } from "./flashcards-ethics-law";
export { pharmacologyFlashcards } from "./flashcards-pharmacology";
export { dermatologyFlashcards } from "./flashcards-dermatology";
export { rheumatologyFlashcards } from "./flashcards-rheumatology";
export { geriatricsFlashcards } from "./flashcards-geriatrics";
export { palliativeFlashcards } from "./flashcards-palliative";
export { infectiousDiseasesFlashcards } from "./flashcards-infectious-diseases";
export { haematologyOncologyFlashcards } from "./flashcards-haematology-oncology";
export { nephrologyFlashcards } from "./flashcards-nephrology";

import { seedQuestions } from "./questions";
import { cardiovascularQuestions } from "./questions-cardiovascular";
import { respiratoryQuestions } from "./questions-respiratory";
import { gastroQuestions } from "./questions-gastro";
import { neurologyQuestions } from "./questions-neurology";
import { endocrineQuestions } from "./questions-endocrine";
import { psychiatryQuestions } from "./questions-psychiatry";
import { paediatricsQuestions } from "./questions-paediatrics";
import { obsgynQuestions } from "./questions-obsgyn";
import { emergencyQuestions } from "./questions-emergency";
import { renalQuestions } from "./questions-renal";
import { rheumatologyQuestions } from "./questions-rheumatology";
import { infectiousQuestions } from "./questions-infectious";
import { surgeryQuestions } from "./questions-surgery";
import { pharmacologyQuestions } from "./questions-pharmacology";
import { dermatologyQuestions } from "./questions-dermatology";

export const allQuestions = [
  ...seedQuestions,
  ...cardiovascularQuestions,
  ...respiratoryQuestions,
  ...gastroQuestions,
  ...neurologyQuestions,
  ...endocrineQuestions,
  ...psychiatryQuestions,
  ...paediatricsQuestions,
  ...obsgynQuestions,
  ...emergencyQuestions,
  ...renalQuestions,
  ...rheumatologyQuestions,
  ...infectiousQuestions,
  ...surgeryQuestions,
  ...pharmacologyQuestions,
  ...dermatologyQuestions,
];
