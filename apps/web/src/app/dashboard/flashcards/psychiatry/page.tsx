import { psychiatryFlashcards } from "@mostly-medicine/content";
import { FlashcardSession } from "../cardiology/FlashcardSession";

export const metadata = {
  title: "Psychiatry Flashcards · Mostly Medicine",
  description: "AMC-blueprint cloze flashcards for Psychiatry, AU-guideline cited.",
};

export default function DeckPage() {
  return <FlashcardSession cards={psychiatryFlashcards} deckName="Psychiatry" />;
}
