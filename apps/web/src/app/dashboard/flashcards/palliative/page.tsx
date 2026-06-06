import { palliativeFlashcards } from "@mostly-medicine/content";
import { FlashcardSession } from "../cardiology/FlashcardSession";

export const metadata = {
  title: "Palliative Care Flashcards · Mostly Medicine",
  description: "AMC-blueprint cloze flashcards for Palliative Care, AU-guideline cited.",
};

export default function DeckPage() {
  return <FlashcardSession cards={palliativeFlashcards} deckName="Palliative Care" />;
}
