import { nephrologyFlashcards } from "@mostly-medicine/content";
import { FlashcardSession } from "../cardiology/FlashcardSession";

export const metadata = {
  title: "Nephrology Flashcards · Mostly Medicine",
  description: "AMC-blueprint cloze flashcards for Nephrology, AU-guideline cited.",
};

export default function DeckPage() {
  return <FlashcardSession cards={nephrologyFlashcards} deckName="Nephrology" />;
}
