import GenerateClient from "./GenerateClient";

export const metadata = {
  title: "Generate flashcards from notes · Mostly Medicine",
  description:
    "Paste lecture notes, AMC handbook chapters, or guideline summaries — get AU-cited cloze flashcards in seconds.",
};

export default function GenerateFlashcardsPage() {
  return <GenerateClient />;
}
