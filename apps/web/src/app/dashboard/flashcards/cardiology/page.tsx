import {cardiologyFlashcards} from "@mostly-medicine/content";
import {FlashcardSession} from "./FlashcardSession";

export const metadata = {
  title: "Cardiology Flashcards · Mostly Medicine",
  description: "AMC-blueprint cloze flashcards for cardiology, AU-guideline cited.",
};

export default function CardiologyFlashcardsPage() {
  return <FlashcardSession cards={cardiologyFlashcards} deckName="Cardiology" />;
}
