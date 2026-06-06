import { paediatricsFlashcards } from "@mostly-medicine/content";
import { FlashcardSession } from "../cardiology/FlashcardSession";

export const metadata = {
  title: "Paediatrics Flashcards · Mostly Medicine",
  description: "AMC-blueprint cloze flashcards for Paediatrics, AU-guideline cited.",
};

export default function DeckPage() {
  return <FlashcardSession cards={paediatricsFlashcards} deckName="Paediatrics" />;
}
