// TEMP — delete after flashcards MVP verified. Mirrors /dashboard/flashcards/cardiology
// without the auth gate so we can screenshot/test before login is wired through.
import {cardiologyFlashcards} from "@mostly-medicine/content";
import {FlashcardSession} from "@/app/dashboard/flashcards/cardiology/FlashcardSession";

export const metadata = {
  title: "Preview — Cardiology Flashcards",
};

export default function PreviewCardiologyFlashcardsPage() {
  return (
    <div className="min-h-screen bg-ink-950">
      <FlashcardSession cards={cardiologyFlashcards} deckName="Cardiology (preview)" />
    </div>
  );
}
