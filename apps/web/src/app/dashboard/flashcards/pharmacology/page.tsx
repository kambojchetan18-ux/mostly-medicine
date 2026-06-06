import { pharmacologyFlashcards } from "@mostly-medicine/content";
import { FlashcardSession } from "../cardiology/FlashcardSession";

export const metadata = {
  title: "AU Pharmacology Flashcards · Mostly Medicine",
  description: "AMC-blueprint cloze flashcards for AU Pharmacology, AU-guideline cited.",
};

export default function DeckPage() {
  return <FlashcardSession cards={pharmacologyFlashcards} deckName="AU Pharmacology" />;
}
