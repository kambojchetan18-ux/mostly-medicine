import { haematologyOncologyFlashcards } from "@mostly-medicine/content";
import { FlashcardSession } from "../cardiology/FlashcardSession";

export const metadata = {
  title: "Haematology & Oncology Flashcards · Mostly Medicine",
  description: "AMC-blueprint cloze flashcards for Haematology & Oncology, AU-guideline cited.",
};

export default function DeckPage() {
  return <FlashcardSession cards={haematologyOncologyFlashcards} deckName="Haematology & Oncology" />;
}
