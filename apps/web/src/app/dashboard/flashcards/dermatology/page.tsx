import { dermatologyFlashcards } from "@mostly-medicine/content";
import { FlashcardSession } from "../cardiology/FlashcardSession";

export const metadata = {
  title: "Dermatology Flashcards · Mostly Medicine",
  description: "AMC-blueprint cloze flashcards for Dermatology, AU-guideline cited.",
};

export default function DeckPage() {
  return <FlashcardSession cards={dermatologyFlashcards} deckName="Dermatology" />;
}
