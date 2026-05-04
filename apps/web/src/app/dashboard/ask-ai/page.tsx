import AskAiClient from "./AskAiClient";

export const metadata = {
  title: "Ask AI — AMC Study Mentor | Mostly Medicine",
  description:
    "Streaming AI Q&A grounded in Murtagh, RACGP, AMC Handbook and eTG — built for IMGs preparing for the Australian Medical Council exams.",
};

export default function AskAiDashboardPage() {
  return <AskAiClient />;
}
