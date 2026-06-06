import { ethicsLawFlashcards } from "@mostly-medicine/content";
import { FlashcardSession } from "../cardiology/FlashcardSession";

export const metadata = {
  title: "Ethics & AU Medico-Legal Flashcards · Mostly Medicine",
  description: "AMC-blueprint cloze flashcards for Ethics & AU Medico-Legal, AU-guideline cited.",
};

export default function DeckPage() {
  return <FlashcardSession cards={ethicsLawFlashcards} deckName="Ethics & AU Medico-Legal" />;
}
