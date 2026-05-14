"use client";

// Per-question image attachments for the notepad. Stored as base64 strings in
// localStorage, keyed on the question id, so they survive refresh and follow
// the question across sessions on the same device. Capped at 3 attachments
// per question, 800 KB each (post-encode) to fit comfortably inside the
// browser's ~5 MB origin quota even for heavy users.

import { useEffect, useRef, useState } from "react";

interface AttachmentPickerProps {
  questionId: string;
  className?: string;
}

const MAX_ATTACHMENTS = 3;
const MAX_BYTES_BASE64 = 800 * 1024; // ~800 KB after base64 encode

function key(qid: string) {
  return `mm:cat1:attach:${qid}`;
}

interface Attachment {
  name: string;
  type: string;
  data: string; // base64 data: URL
  added: number;
}

function readLocal(qid: string): Attachment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key(qid));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocal(qid: string, items: Attachment[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key(qid), JSON.stringify(items));
  } catch {
    // QuotaExceededError — silently drop; the picker will report on next add.
  }
}

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(typeof r.result === "string" ? r.result : "");
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

export default function AttachmentPicker({ questionId, className = "" }: AttachmentPickerProps) {
  const [items, setItems] = useState<Attachment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [viewing, setViewing] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setItems(readLocal(questionId));
    setError(null);
  }, [questionId]);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    const next = [...items];
    for (const f of Array.from(files)) {
      if (next.length >= MAX_ATTACHMENTS) {
        setError(`Max ${MAX_ATTACHMENTS} attachments per question.`);
        break;
      }
      if (!f.type.startsWith("image/") && f.type !== "application/pdf") {
        setError(`${f.name}: only images and PDFs allowed.`);
        continue;
      }
      try {
        const data = await readAsDataURL(f);
        if (data.length > MAX_BYTES_BASE64 * 1.4) {
          setError(`${f.name}: too large (~${Math.round(data.length / 1024)}KB after encode, max ~800KB).`);
          continue;
        }
        next.push({ name: f.name, type: f.type, data, added: Date.now() });
      } catch {
        setError(`${f.name}: could not read file.`);
      }
    }
    setItems(next);
    writeLocal(questionId, next);
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeAt(idx: number) {
    const next = items.filter((_, i) => i !== idx);
    setItems(next);
    writeLocal(questionId, next);
    if (viewing === idx) setViewing(null);
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={items.length >= MAX_ATTACHMENTS}
          className="text-[11px] inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-amber-300 bg-white text-amber-800 hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          📎 Attach {items.length > 0 && `(${items.length}/${MAX_ATTACHMENTS})`}
        </button>
        {error && <p className="text-[10px] text-rose-600 truncate">{error}</p>}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {items.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {items.map((a, i) => {
            const isImg = a.type.startsWith("image/");
            return (
              <div key={a.added + a.name} className="relative group">
                {isImg ? (
                  <button
                    type="button"
                    onClick={() => setViewing(i)}
                    className="block h-14 w-14 rounded-md overflow-hidden border border-amber-200 bg-white"
                    title={a.name}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={a.data} alt={a.name} className="h-full w-full object-cover" />
                  </button>
                ) : (
                  <a
                    href={a.data}
                    download={a.name}
                    className="block h-14 px-2 max-w-[140px] flex flex-col items-center justify-center rounded-md border border-amber-200 bg-white text-[10px] text-amber-800 hover:bg-amber-50"
                    title={a.name}
                  >
                    📄 <span className="truncate w-full text-center">{a.name}</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  aria-label="Remove attachment"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}

      {viewing !== null && items[viewing] && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setViewing(null)}
        >
          <div className="max-w-3xl max-h-full overflow-auto" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={items[viewing].data} alt={items[viewing].name} className="max-w-full max-h-[85vh] rounded-lg shadow-2xl" />
            <p className="mt-2 text-center text-xs text-white">{items[viewing].name}</p>
          </div>
        </div>
      )}
    </div>
  );
}
