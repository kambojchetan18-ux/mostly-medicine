import { neurologyFlashcards } from "@mostly-medicine/content";
import { FlashcardSession } from "../cardiology/FlashcardSession";

export const metadata = {
  title: "Neurology Flashcards · Mostly Medicine",
  description: "AMC-blueprint cloze flashcards for Neurology, AU-guideline cited.",
};

export default function DeckPage() {
  return <FlashcardSession cards={neurologyFlashcards} deckName="Neurology" />;
}
