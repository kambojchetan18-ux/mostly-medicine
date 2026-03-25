"use client";

import { useEffect, useState } from "react";

export default function SearchTrigger() {
  const [, setOpen] = useState(false);

  function trigger() {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }));
  }

  // Suppress unused state warning — state drives re-render on mount
  useEffect(() => { setOpen(false); }, []);

  return (
    <button
      onClick={trigger}
      title="Search (⌘K)"
      className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    </button>
  );
}
