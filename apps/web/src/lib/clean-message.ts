// Clean stray markdown out of a patient/AI message before display.
// We want to preserve stage directions like "*sighs*" (user requested they
// stay visible) but strip markdown formatting (**bold**, __bold__, headers,
// backticks) which the AI sometimes leaks despite system prompt rules.
export function cleanForDisplay(text: string): string {
  return text
    .replace(/\*\*([^*\n]+)\*\*/g, "$1") // **bold** -> bold
    .replace(/__([^_\n]+)__/g, "$1") // __bold__ -> bold
    .replace(/`([^`\n]+)`/g, "$1") // `code` -> code
    .replace(/^#{1,6}\s+/gm, "") // # heading
    .replace(/^\s*>\s+/gm, "") // > blockquote
    .replace(/^\s*[-*+]\s+/gm, "• ") // bullet markers
    .trim();
}
