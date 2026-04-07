"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { scenarios } from "@mostly-medicine/ai";
import type { Scenario } from "@mostly-medicine/ai";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

// ── helpers ──────────────────────────────────────────────────────────────────

function parsePatientProfile(profile: string) {
  const ageMatch = profile.match(/(\d+)[- ]year/i);
  const age = ageMatch ? parseInt(ageMatch[1]) : null;
  const gender =
    /\bfemale\b|\bwoman\b|\bher\b/i.test(profile) ? "female" as const
    : /\bmale\b|\bman\b|\bhis\b/i.test(profile) ? "male" as const
    : "unknown" as const;
  return { age, gender };
}

function getPatientEmoji(gender: "male" | "female" | "unknown", age: number | null) {
  if (age !== null && age < 18) return gender === "female" ? "👧" : "👦";
  if (age !== null && age >= 65) return gender === "female" ? "👩‍🦳" : "👴";
  if (gender === "female") return "👩";
  if (gender === "male") return "👨";
  return "🧑";
}

function isExaminerFeedback(text: string, messageCount: number) {
  if (messageCount < 4) return false;
  return /what the doctor did well|overall score|AMC marking criteria|clinical pearl/i.test(text)
    || /\d+\s*\/\s*10/.test(text);
}

const difficultyColor: Record<string, string> = {
  Easy: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Hard: "bg-red-100 text-red-700",
};

// ── Waveform bars component ───────────────────────────────────────────────────
function WaveformBars({ active, color = "bg-brand-500" }: { active: boolean; color?: string }) {
  if (!active) return null;
  return (
    <div className="flex items-end gap-0.5 h-5">
      {[60, 100, 80, 100, 70, 90, 60].map((h, i) => (
        <div
          key={i}
          className={`w-1 rounded-full animate-bounce ${color}`}
          style={{
            height: `${h}%`,
            animationDelay: `${i * 80}ms`,
            animationDuration: "700ms",
          }}
        />
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CAT2Page() {
  const [activeScenario, setActiveScenario] = useState<number | null>(null);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [examinerFeedback, setExaminerFeedback] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    state: recState,
    displayTranscript,
    supported: micSupported,
    permissionDenied,
    startRecording,
    stopRecording,
  } = useSpeechRecognition();

  const { speaking, speak, stop: stopSpeaking, supported: ttsSupported } = useSpeechSynthesis();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const activeScenarioData = activeScenario !== null
    ? scenarios.find(s => s.id === activeScenario) ?? null
    : null;
  const { gender, age } = activeScenarioData
    ? parsePatientProfile(activeScenarioData.patientProfile)
    : { gender: "unknown" as const, age: null };

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    stopSpeaking();

    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/roleplay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioId: activeScenario, messages: newMessages }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? `Server error: ${res.status}`);

      if (isExaminerFeedback(data.reply, newMessages.length)) {
        setExaminerFeedback(data.reply);
      } else {
        setMessages([...newMessages, { role: "assistant", content: data.reply }]);
        if (ttsSupported) speak(data.reply, gender);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setMessages([...newMessages, { role: "assistant", content: `[Error: ${msg}]` }]);
    } finally {
      setLoading(false);
    }
  }, [loading, messages, activeScenario, gender, speak, stopSpeaking, ttsSupported]);

  function handleMicButton() {
    if (recState === "recording") {
      const transcript = stopRecording();
      if (transcript) sendMessage(transcript);
    } else {
      stopSpeaking();
      startRecording();
    }
  }

  async function startScenario(id: number) {
    stopSpeaking();
    setExaminerFeedback(null);
    setActiveScenario(id);
    const scenario = scenarios.find(s => s.id === id)!;
    const opening = `Hello Doctor. I've come in today because I've been having ${scenario.chiefComplaint}.`;
    const openingMsg = { role: "assistant", content: opening };
    setMessages([openingMsg]);
    setTimeout(() => {
      const { gender: g } = parsePatientProfile(scenario.patientProfile);
      speak(opening, g);
    }, 400);
  }

  function endSession() {
    stopSpeaking();
    setActiveScenario(null);
    setMessages([]);
    setExaminerFeedback(null);
  }

  // ── Scenario selection screen ─────────────────────────────────────────────
  if (activeScenario === null) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">AMC CAT 2 — Clinical Role-Play</h2>
        <p className="text-gray-500 text-sm mb-6">
          AI plays the patient. Speak or type your responses. Receive examiner feedback at the end.
          {ttsSupported && micSupported !== false && (
            <span className="ml-2 text-green-600 font-medium">🎤 Voice enabled</span>
          )}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {scenarios.map((s) => {
            const { gender: g, age: a } = parsePatientProfile(s.patientProfile);
            return (
              <button
                key={s.id}
                onClick={() => startScenario(s.id)}
                className="bg-white border border-gray-200 rounded-2xl p-5 text-left hover:shadow-md hover:border-brand-400 transition group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl">{getPatientEmoji(g, a)}</div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${difficultyColor[s.difficulty]}`}>
                    {s.difficulty}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{s.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{s.category}</p>
                <p className="text-xs text-gray-400 italic leading-relaxed line-clamp-2">
                  "{s.chiefComplaint}"
                </p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Examiner feedback screen ──────────────────────────────────────────────
  if (examinerFeedback) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">📋</div>
          <h2 className="text-2xl font-bold text-gray-900">Examiner Feedback</h2>
          <p className="text-sm text-gray-500 mt-1">{activeScenarioData?.title}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
          {examinerFeedback}
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={endSession}
            className="px-5 py-2.5 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
          >
            ← All Scenarios
          </button>
          <button
            onClick={() => startScenario(activeScenario)}
            className="px-5 py-2.5 text-sm font-medium rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition"
          >
            Retry Scenario
          </button>
        </div>
      </div>
    );
  }

  // ── Active roleplay session ───────────────────────────────────────────────
  const emoji = getPatientEmoji(gender, age);
  const isRecording = recState === "recording";

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto">

      {/* Patient header */}
      <div className="flex items-center justify-between mb-4 bg-white border border-gray-200 rounded-2xl px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="text-4xl">{emoji}</div>
            {speaking && (
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-brand-500 rounded-full animate-ping" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-gray-900">{activeScenarioData?.title}</h2>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColor[activeScenarioData?.difficulty ?? "Medium"]}`}>
                {activeScenarioData?.difficulty}
              </span>
            </div>
            <p className="text-xs text-gray-500">{activeScenarioData?.category} · {activeScenarioData?.patientProfile}</p>
            {speaking && (
              <div className="flex items-center gap-2 mt-1">
                <WaveformBars active={speaking} color="bg-brand-400" />
                <span className="text-xs text-brand-600 font-medium">Patient speaking…</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {speaking && (
            <button
              onClick={stopSpeaking}
              className="text-xs text-gray-500 border border-gray-200 px-2 py-1 rounded-lg hover:bg-gray-50"
            >
              ⏹ Stop
            </button>
          )}
          <button
            onClick={endSession}
            className="text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50"
          >
            End Session
          </button>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-4 overflow-y-auto space-y-3 mb-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && (
              <div className="text-2xl mr-2 self-end mb-1">{emoji}</div>
            )}
            <div
              className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm ${
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
            <div className="text-2xl mr-2 self-end mb-1">{emoji}</div>
            <div className="bg-gray-100 rounded-2xl px-4 py-3 flex items-center gap-1">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Live transcript display while recording */}
      {isRecording && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2 mb-2 text-sm text-gray-700 min-h-[2.5rem] flex items-center gap-2">
          <WaveformBars active={true} color="bg-red-400" />
          <span className="flex-1 italic text-gray-500">
            {displayTranscript || "Listening…"}
          </span>
        </div>
      )}

      {/* Input bar */}
      <div className="flex items-center gap-2">

        {/* Mic button */}
        {micSupported !== false && (
          <button
            onClick={handleMicButton}
            disabled={loading}
            title={isRecording ? "Stop recording & send" : "Hold to speak"}
            className={`relative flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all disabled:opacity-40 ${
              isRecording
                ? "bg-red-500 hover:bg-red-600 shadow-lg"
                : "bg-brand-600 hover:bg-brand-700"
            }`}
          >
            {isRecording && (
              <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-60" />
            )}
            <span className="text-white text-xl relative z-10">{isRecording ? "⏹" : "🎤"}</span>
          </button>
        )}

        {/* Text input */}
        <input
          value={isRecording ? displayTranscript : input}
          onChange={e => { if (!isRecording) setInput(e.target.value); }}
          onKeyDown={e => { if (e.key === "Enter" && !isRecording) sendMessage(input); }}
          placeholder={
            permissionDenied ? "Mic access denied — type here"
            : micSupported === false ? "Type your question to the patient…"
            : isRecording ? "Listening…"
            : "Type or use the 🎤 mic button…"
          }
          readOnly={isRecording}
          className={`flex-1 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition ${
            isRecording ? "bg-red-50 border-red-200 text-gray-500 cursor-not-allowed" : "border-gray-300"
          }`}
        />

        {/* Send button (text mode only) */}
        {!isRecording && (
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-3 rounded-xl text-sm font-semibold transition disabled:opacity-40"
          >
            Send
          </button>
        )}
      </div>

      {/* Mic permission denied notice */}
      {permissionDenied && (
        <p className="text-xs text-red-500 mt-1 text-center">
          Microphone access denied. Allow it in browser settings, or use text input.
        </p>
      )}
    </div>
  );
}
