import { gastroFlashcards } from "@mostly-medicine/content";
import { FlashcardSession } from "../cardiology/FlashcardSession";

export const metadata = {
  title: "Gastroenterology Flashcards · Mostly Medicine",
  description: "AMC-blueprint cloze flashcards for gastroenterology, AU-guideline cited.",
};

export default function GastroFlashcardsPage() {
  return <FlashcardSession cards={gastroFlashcards} deckName="Gastroenterology" />;
}
