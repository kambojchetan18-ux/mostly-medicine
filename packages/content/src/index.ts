export { seedQuestions } from "./questions";
export type { MCQuestion } from "./questions";

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
];
