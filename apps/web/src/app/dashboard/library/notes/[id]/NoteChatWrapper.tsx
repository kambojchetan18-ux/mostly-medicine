"use client";

import LibraryChat from "@/components/LibraryChat";

export default function NoteChatWrapper({
  noteFilename,
  noteText,
}: {
  noteFilename: string;
  noteText: string;
}) {
  return <LibraryChat topicTitle={noteFilename} topicContent={noteText} />;
}
