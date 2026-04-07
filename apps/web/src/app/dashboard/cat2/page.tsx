"use client";

import { useState } from "react";
import { scenarios } from "@mostly-medicine/ai";

const difficultyColor: Record<string, string> = {
  Easy: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Hard: "bg-red-100 text-red-700",
};

export default function CAT2Page() {
  const [activeScenario, setActiveScenario] = useState<number | null>(null);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function startScenario(id: number) {
    setActiveScenario(id);
    const scenario = scenarios.find((s) => s.id === id)!;
    setMessages([
      {
        role: "assistant",
        content: `Hello Doctor. I've come in today because I've been having ${scenario.chiefComplaint}.`,
      },
    ]);
  }

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/roleplay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId: activeScenario,
          messages: newMessages,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? `Server error: ${res.status}`);
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setMessages([...newMessages, { role: "assistant", content: `[Error: ${msg}]` }]);
    } finally {
      setLoading(false);
    }
  }

  if (activeScenario !== null) {
    const scenario = scenarios.find((s) => s.id === activeScenario);
    if (!scenario) return null;
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{scenario.title}</h2>
            <p className="text-sm text-gray-500">AMC CAT 2 Clinical Role-Play · {scenario.category}</p>
          </div>
          <button
            onClick={() => { setActiveScenario(null); setMessages([]); }}
            className="text-sm text-gray-500 hover:text-gray-700 border border-gray-300 px-3 py-1 rounded-lg"
          >
            End Session
          </button>
        </div>

        <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-4 overflow-y-auto space-y-3 mb-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                  m.role === "user"
                    ? "bg-brand-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {m.role === "assistant" && (
                  <p className="text-xs font-semibold text-gray-400 mb-1">Patient</p>
                )}
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl px-4 py-2 text-sm text-gray-400">Typing...</div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your question to the patient..."
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 rounded-xl text-sm font-semibold transition disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">AMC CAT 2 — Clinical Role-Play</h2>
      <p className="text-gray-500 text-sm mb-6">
        Practice OSCE-style consultations. AI plays the patient. Feedback based on AMC marking criteria.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenarios.map((s) => (
          <button
            key={s.id}
            onClick={() => startScenario(s.id)}
            className="bg-white border border-gray-200 rounded-2xl p-5 text-left hover:shadow-md hover:border-brand-400 transition"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-2xl">🩺</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${difficultyColor[s.difficulty]}`}>
                {s.difficulty}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900">{s.title}</h3>
            <p className="text-sm text-gray-500">{s.category}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
