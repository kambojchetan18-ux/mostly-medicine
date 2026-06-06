import { endocrineFlashcards } from "@mostly-medicine/content";
import { FlashcardSession } from "../cardiology/FlashcardSession";

export const metadata = {
  title: "Endocrinology Flashcards · Mostly Medicine",
  description: "AMC-blueprint cloze flashcards for Endocrinology, AU-guideline cited.",
};

export default function DeckPage() {
  return <FlashcardSession cards={endocrineFlashcards} deckName="Endocrinology" />;
}
