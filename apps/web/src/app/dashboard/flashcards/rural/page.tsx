import { ruralFlashcards } from "@mostly-medicine/content";
import { FlashcardSession } from "../cardiology/FlashcardSession";

export const metadata = {
  title: "Rural & Remote Medicine Flashcards · Mostly Medicine",
  description: "AMC-blueprint cloze flashcards for Rural & Remote Medicine, AU-guideline cited.",
};

export default function DeckPage() {
  return <FlashcardSession cards={ruralFlashcards} deckName="Rural & Remote Medicine" />;
}
