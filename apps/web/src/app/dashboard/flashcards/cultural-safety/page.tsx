import { culturalSafetyFlashcards } from "@mostly-medicine/content";
import { FlashcardSession } from "../cardiology/FlashcardSession";

export const metadata = {
  title: "Cultural Safety Flashcards · Mostly Medicine",
  description: "AMC-blueprint cloze flashcards for Cultural Safety, AU-guideline cited.",
};

export default function DeckPage() {
  return <FlashcardSession cards={culturalSafetyFlashcards} deckName="Cultural Safety" />;
}
