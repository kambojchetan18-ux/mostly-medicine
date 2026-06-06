import { emergencyFlashcards } from "@mostly-medicine/content";
import { FlashcardSession } from "../cardiology/FlashcardSession";

export const metadata = {
  title: "Emergency Medicine Flashcards · Mostly Medicine",
  description: "AMC-blueprint cloze flashcards for Emergency Medicine, AU-guideline cited.",
};

export default function DeckPage() {
  return <FlashcardSession cards={emergencyFlashcards} deckName="Emergency Medicine" />;
}
