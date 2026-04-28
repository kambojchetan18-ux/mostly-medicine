"use client";

import { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "assistant"; content: string };

const STARTER_PROMPTS = [
  "What's the first-line treatment for ACS according to eTG?",
  "How do I approach a patient with sepsis?",
  "What are the AMC Handbook AI RolePlay communication domains?",
  "Summarise the RACGP approach to hypertension",
];

type Props = {
  topicTitle?: string;
  topicContent?: string;
};

export default function LibraryChat({ topicTitle, topicContent }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(content: string) {
    if (!content.trim() || isLoading) return;

    const newMessages: Message[] = [...messages, { role: "user", content }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/library-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          topicTitle,
          topicContent,
        }),
      });

      if (!res.ok || !res.body) throw new Error("Request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: assistantText };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-brand-600 text-white rounded-full shadow-lg hover:bg-brand-700 transition text-sm font-medium"
      >
        <span>✨</span> Ask AI
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setOpen(false)} />
      )}

      {/* Slide-over panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[400px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Ask AI</h2>
            {topicTitle && (
              <p className="text-xs text-gray-400 truncate max-w-[280px]">
                Context: {topicTitle}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {messages.length > 0 && (
              <button
                onClick={() => setMessages([])}
                className="text-xs text-gray-400 hover:text-gray-600 transition"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition text-xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="space-y-3">
              <p className="text-xs text-gray-400 text-center pt-2">
                Ask anything about clinical medicine or AMC exam preparation
              </p>
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="w-full text-left text-xs px-3 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 transition"
                >
                  {prompt}
                </button>
              ))}
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-brand-600 text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-800 rounded-bl-sm"
                  }`}
                >
                  {m.content}
                  {m.role === "assistant" && m.content === "" && (
                    <span className="flex gap-1 py-1">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-gray-200 shrink-0">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a clinical question..."
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-3 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition disabled:opacity-50 text-sm font-medium"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
