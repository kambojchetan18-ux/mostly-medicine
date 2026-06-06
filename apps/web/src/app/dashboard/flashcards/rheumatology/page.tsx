import { rheumatologyFlashcards } from "@mostly-medicine/content";
import { FlashcardSession } from "../cardiology/FlashcardSession";

export const metadata = {
  title: "Rheumatology Flashcards · Mostly Medicine",
  description: "AMC-blueprint cloze flashcards for Rheumatology, AU-guideline cited.",
};

export default function DeckPage() {
  return <FlashcardSession cards={rheumatologyFlashcards} deckName="Rheumatology" />;
}
