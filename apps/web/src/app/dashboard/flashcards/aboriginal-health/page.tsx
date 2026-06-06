import { aboriginalHealthFlashcards } from "@mostly-medicine/content";
import { FlashcardSession } from "../cardiology/FlashcardSession";

export const metadata = {
  title: "Aboriginal & Torres Strait Islander Health Flashcards · Mostly Medicine",
  description: "AMC-blueprint cloze flashcards for Aboriginal & Torres Strait Islander Health, AU-guideline cited.",
};

export default function DeckPage() {
  return <FlashcardSession cards={aboriginalHealthFlashcards} deckName="Aboriginal & Torres Strait Islander Health" />;
}
