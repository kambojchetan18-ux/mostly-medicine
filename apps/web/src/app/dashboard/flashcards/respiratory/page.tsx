import { respiratoryFlashcards } from "@mostly-medicine/content";
import { FlashcardSession } from "../cardiology/FlashcardSession";

export const metadata = {
  title: "Respiratory Flashcards · Mostly Medicine",
  description: "AMC-blueprint cloze flashcards for respiratory medicine, AU-guideline cited.",
};

export default function RespiratoryFlashcardsPage() {
  return <FlashcardSession cards={respiratoryFlashcards} deckName="Respiratory" />;
}
