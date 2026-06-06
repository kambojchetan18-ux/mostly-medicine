import { geriatricsFlashcards } from "@mostly-medicine/content";
import { FlashcardSession } from "../cardiology/FlashcardSession";

export const metadata = {
  title: "Geriatrics Flashcards · Mostly Medicine",
  description: "AMC-blueprint cloze flashcards for Geriatrics, AU-guideline cited.",
};

export default function DeckPage() {
  return <FlashcardSession cards={geriatricsFlashcards} deckName="Geriatrics" />;
}
