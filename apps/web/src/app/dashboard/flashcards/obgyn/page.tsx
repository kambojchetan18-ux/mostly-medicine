import { obgynFlashcards } from "@mostly-medicine/content";
import { FlashcardSession } from "../cardiology/FlashcardSession";

export const metadata = {
  title: "Obstetrics & Gynaecology Flashcards · Mostly Medicine",
  description: "AMC-blueprint cloze flashcards for Obstetrics & Gynaecology, AU-guideline cited.",
};

export default function DeckPage() {
  return <FlashcardSession cards={obgynFlashcards} deckName="Obstetrics & Gynaecology" />;
}
