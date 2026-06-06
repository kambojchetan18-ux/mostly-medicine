import { infectiousDiseasesFlashcards } from "@mostly-medicine/content";
import { FlashcardSession } from "../cardiology/FlashcardSession";

export const metadata = {
  title: "Infectious Diseases Flashcards · Mostly Medicine",
  description: "AMC-blueprint cloze flashcards for Infectious Diseases, AU-guideline cited.",
};

export default function DeckPage() {
  return <FlashcardSession cards={infectiousDiseasesFlashcards} deckName="Infectious Diseases" />;
}
