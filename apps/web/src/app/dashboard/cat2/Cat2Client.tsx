"use client";

import { useState, useEffect, useRef, useCallback } from "react";
// Use the metadata-only export — pulling `scenarios` here would drop the
// entire 720 kB handbook payload into the client chunk. The full data is
// only needed server-side (the /api/ai/roleplay route handles that).
import { scenariosMeta as scenarios } from "@mostly-medicine/ai";
import { useWhisperSTT } from "@/hooks/useWhisperSTT";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import VoiceControls from "@/components/VoiceControls";
import { cleanForDisplay } from "@/lib/clean-message";
import FunLoading from "@/components/FunLoading";

// ── Timer config ──────────────────────────────────────────────────────────────

const READING_SECONDS = 120; // 2 min — matches AMC Clinical AI RolePlay reading screen

type TimerMode = "Standard" | "Beginner" | "Exam" | "Sprint";

const MODE_DURATIONS: Record<TimerMode, number> = {
  Standard: 480,  // 8 min
  Beginner: 600,  // 10 min
  Exam: 480,      // 8 min (hard stop)
  Sprint: 300,    // 5 min
};

const WARNING1_SEC = 120;
const WARNING2_SEC = 60;

// Milestones are elapsed seconds into the session
const DEFAULT_MILESTONES: Record<TimerMode, { time: number; prompt: string }[]> = {
  Standard: [
    { time: 60,  prompt: "Establish rapport — open question" },
    { time: 240, prompt: "Focused history" },
    { time: 360, prompt: "Explanation & management plan" },
    { time: 450, prompt: "Safety-netting & close" },
  ],
  Beginner: [
    { time: 90,  prompt: "Establish rapport — open question" },
    { time: 300, prompt: "Focused history" },
    { time: 450, prompt: "Explanation & management plan" },
    { time: 540, prompt: "Safety-netting & close" },
  ],
  Exam: [
    { time: 60,  prompt: "Establish rapport — open question" },
    { time: 240, prompt: "Focused history" },
    { time: 360, prompt: "Explanation & management plan" },
    { time: 450, prompt: "Safety-netting & close" },
  ],
  Sprint: [
    { time: 60,  prompt: "Open question" },
    { time: 150, prompt: "Key history points" },
    { time: 240, prompt: "Impression & plan" },
  ],
};

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
  // Patient roleplay messages legitimately use "8/10" for pain severity, so
  // we cannot trigger on a bare X/10 — require a Score-style label nearby.
  const hasFeedbackHeading = /what the doctor did well|AMC marking criteria|clinical pearl|examiner feedback|MCAT performance criteria|critical errors/i.test(text);
  const hasScoreLabel = /(?:^|\n)\s*(?:[#*]+\s*)?(?:🎯\s*)?(?:overall\s+)?score\s*[:：]?\s*\d+\s*\/\s*10/i.test(text);
  return hasFeedbackHeading || hasScoreLabel;
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
export default function Cat2Client() {
  const [activeScenario, setActiveScenario] = useState<number | null>(null);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [examinerFeedback, setExaminerFeedback] = useState<string | null>(null);

  // Reading-time briefing state (mirrors AMC Clinical AI RolePlay flow).
  // While readingScenarioId is set we render a 2-min countdown + Scenario +
  // Your task panels; on timer end OR explicit Start click we hand off to
  // startScenario which kicks off the 8-min consultation.
  const [readingScenarioId, setReadingScenarioId] = useState<number | null>(null);
  const [readingSecondsLeft, setReadingSecondsLeft] = useState(0);

  // Timer state
  const [timerMode, setTimerMode] = useState<TimerMode>("Standard");
  const [timeLeft, setTimeLeft] = useState(0);
  const [milestone, setMilestone] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef(0);
  const shownMilestonesRef = useRef<Set<number>>(new Set());

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Speech synthesis must come before sendMessage (sendMessage calls speak/stopSpeaking)
  const {
    speaking,
    speak,
    stop: stopSpeaking,
    prime: primeTts,
    supported: ttsSupported,
    muted,
    volume,
    setMuted,
    setVolume,
  } = useSpeechSynthesis();

  const activeScenarioData = activeScenario !== null
    ? scenarios.find(s => s.id === activeScenario) ?? null
    : null;
  const { gender, age } = activeScenarioData
    ? parsePatientProfile(activeScenarioData.patientProfile)
    : { gender: "unknown" as const, age: null };

  // sendMessage must be defined before useWhisperSTT so the stopRecording
  // wrapper below can flush the buffered transcript to it on mic-stop.
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    stopSpeaking();
    // Prime mobile TTS while we still have a user-gesture token.
    if (ttsSupported) primeTts();

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

  // Buffer Whisper chunks until the user stops the mic, then send as one
  // user turn. Avoids spamming /api/ai/roleplay with every 5s of audio.
  // Note: Whisper has no silence-detection auto-stop — the user MUST click
  // the mic again to end their turn (different from the old Web Speech API
  // behaviour which auto-fired on silence).
  const sttBufferRef = useRef("");
  const handleSttChunk = useCallback((chunk: string) => {
    sttBufferRef.current = (sttBufferRef.current + " " + chunk).trim();
  }, []);
  // Forward-decl ref so the silence-auto-stop callback can call the wrapper
  // we define a few lines below without a chicken-and-egg ordering problem.
  const stopRecordingRef = useRef<() => Promise<void>>(() => Promise.resolve());
  const {
    state: recState,
    displayTranscript,
    supported: micSupported,
    permissionDenied,
    startRecording,
    stopRecording: stopWhisper,
  } = useWhisperSTT(handleSttChunk, {
    autoStopOnSilence: true,
    onAutoStop: () => void stopRecordingRef.current(),
  });

  // When the user stops the mic (manual tap OR silence-detected auto-stop),
  // ship the buffered transcript as one message. stopWhisper() resolves AFTER
  // the final partial chunk uploads + all in-flight chunks settle.
  const stopRecording = useCallback(async () => {
    const final = (await stopWhisper()).trim() || sttBufferRef.current.trim();
    sttBufferRef.current = "";
    if (final) sendMessage(final);
  }, [stopWhisper, sendMessage]);
  useEffect(() => {
    stopRecordingRef.current = stopRecording;
  }, [stopRecording]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Reading-time countdown. When the timer hits 0 we auto-hand-off to the
  // active session by calling startScenario. Cleanup clears any pending tick
  // when the user backs out or hits Start manually.
  useEffect(() => {
    if (readingScenarioId === null) return;
    if (readingSecondsLeft <= 0) {
      const id = readingScenarioId;
      setReadingScenarioId(null);
      void startScenario(id);
      return;
    }
    const t = setTimeout(() => setReadingSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readingScenarioId, readingSecondsLeft]);

  function formatTime(sec: number) {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  function timerColorClass(sec: number) {
    if (sec <= WARNING2_SEC) return "text-red-500";
    if (sec <= WARNING1_SEC) return "text-amber-500";
    return "text-gray-700";
  }

  function startTimer(mode: TimerMode) {
    if (timerRef.current) clearInterval(timerRef.current);
    const duration = MODE_DURATIONS[mode];
    elapsedRef.current = 0;
    shownMilestonesRef.current = new Set();
    setTimeLeft(duration);
    setMilestone(null);

    timerRef.current = setInterval(() => {
      elapsedRef.current += 1;
      const elapsed = elapsedRef.current;

      // Check milestones
      const milestones = DEFAULT_MILESTONES[mode];
      for (let i = 0; i < milestones.length; i++) {
        if (elapsed === milestones[i].time && !shownMilestonesRef.current.has(i)) {
          shownMilestonesRef.current.add(i);
          setMilestone(milestones[i].prompt);
          setTimeout(() => setMilestone(null), 5000);
        }
      }

      setTimeLeft(prev => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          return 0;
        }
        return next;
      });
    }, 1000);
  }

  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  // Auto-request feedback when timer reaches 0
  const feedbackRequestedRef = useRef(false);
  useEffect(() => {
    if (timeLeft === 0 && activeScenario !== null && messages.length > 1 && !feedbackRequestedRef.current && !loading) {
      feedbackRequestedRef.current = true;
      requestExaminerFeedback();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, activeScenario, messages.length]);

  async function requestExaminerFeedback() {
    if (loading || messages.length <= 1) return;
    stopSpeaking();
    stopTimer();
    setLoading(true);
    try {
      const res = await fetch("/api/ai/roleplay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioId: activeScenario, messages, requestFeedback: true }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? `Server error: ${res.status}`);
      setExaminerFeedback(data.reply);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setExaminerFeedback(`Could not retrieve feedback: ${msg}`);
    } finally {
      setLoading(false);
    }
  }

  function handleMicButton() {
    if (recState === "recording") {
      stopRecording(); // transcript arrives via sendMessage callback in onend
    } else {
      stopSpeaking();
      startRecording();
    }
  }

  function enterReading(id: number) {
    // Prime TTS NOW while we hold a live user-gesture token. The 2-min
    // reading countdown puts the actual speak() call (in startScenario)
    // well outside Chromium's transient-activation window — without this
    // the patient's opening line goes silent on Chrome / Comet / Edge.
    if (ttsSupported) primeTts();
    setReadingScenarioId(id);
    setReadingSecondsLeft(READING_SECONDS);
  }

  async function startScenario(id: number) {
    setReadingScenarioId(null);
    stopSpeaking();
    // Speak the opening DIRECTLY inside this click handler (no setTimeout)
    // so Chromium's transient-activation token still applies when speak()
    // is reached. The earlier 400ms delay had decorative reasons (let the
    // UI mount first) but it pushed the speak past Chromium's gesture
    // window — patient stayed silent on Chrome / Comet / Edge / Brave.
    if (ttsSupported) primeTts();
    setExaminerFeedback(null);
    feedbackRequestedRef.current = false;
    setActiveScenario(id);
    const scenario = scenarios.find(s => s.id === id)!;
    const opening = scenario.openingStatement;
    const openingMsg = { role: "assistant", content: opening };
    setMessages([openingMsg]);
    startTimer(timerMode);
    if (ttsSupported) {
      const { gender: g } = parsePatientProfile(scenario.patientProfile);
      speak(opening, g);
    }
  }

  function endSession() {
    stopSpeaking();
    stopTimer();
    setTimeLeft(0);
    setMilestone(null);
    setActiveScenario(null);
    setMessages([]);
    setExaminerFeedback(null);
    setReadingScenarioId(null);
  }

  // ── Reading-time briefing screen (mirrors AMC Clinical AI RolePlay) ──────
  if (readingScenarioId !== null) {
    const scenario = scenarios.find((s) => s.id === readingScenarioId);
    if (!scenario) {
      // Defensive: scenario went missing — bail back to selection.
      setReadingScenarioId(null);
      return null;
    }
    const briefing = scenario.candidateInfo;
    // Split candidateInfo into the situational scenario half and the
    // explicit "Your tasks are…" half so we can render two panels.
    const taskMarker = /your task[s]?\s+(?:are|is)/i;
    const taskMatch = briefing.match(taskMarker);
    const splitIdx = taskMatch ? briefing.indexOf(taskMatch[0]) : -1;
    const scenarioBody = splitIdx >= 0 ? briefing.slice(0, splitIdx).trim() : briefing.trim();
    const taskBody = splitIdx >= 0 ? briefing.slice(splitIdx).trim() : "Read each instruction, then take a focused history, examine, explain and counsel as appropriate. Aim to finish within 8 minutes.";
    const mm = Math.floor(readingSecondsLeft / 60).toString().padStart(2, "0");
    const ss = (readingSecondsLeft % 60).toString().padStart(2, "0");
    const pct = (readingSecondsLeft / READING_SECONDS) * 100;
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setReadingScenarioId(null)}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            ← Back
          </button>
          <span className="rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-600">
            {scenario.difficulty} · {scenario.category}
          </span>
        </div>

        <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Reading time</p>
              <p className="mt-0.5 text-3xl font-bold tabular-nums text-brand-900">{mm}:{ss}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                const id = readingScenarioId;
                setReadingScenarioId(null);
                if (id !== null) void startScenario(id);
              }}
              className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-brand-700"
            >
              Start RolePlay →
            </button>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-brand-100">
            <div
              className="h-full bg-brand-600 transition-[width] duration-1000 ease-linear"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Scenario</p>
          <h2 className="mt-1 text-lg font-semibold text-gray-900">{scenario.title}</h2>
          <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-gray-900">
            {scenarioBody}
          </p>

          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">Your task</p>
            <p className="mt-1 whitespace-pre-line text-sm font-medium text-amber-900">{taskBody}</p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500">
          When the timer ends you will move to the 8-minute roleplay automatically. You can also start early.
        </p>
      </div>
    );
  }

  // ── Scenario selection screen ─────────────────────────────────────────────
  if (activeScenario === null) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">AMC Handbook AI RolePlay</h2>
        <p className="text-gray-500 text-sm mb-4">
          AI plays the patient. Speak or type your responses. Receive examiner feedback at the end.
          {ttsSupported && micSupported !== false && (
            <span className="ml-2 text-green-600 font-medium">🎤 Voice enabled</span>
          )}
        </p>

        {/* Source & compliance disclaimer */}
        <div className="mb-5 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-xs text-amber-800">
          <span className="text-base shrink-0 mt-0.5">📋</span>
          <div className="leading-relaxed">
            <span className="font-bold">Content source:</span> All scenarios are derived verbatim from the{" "}
            <span className="font-semibold">AMC Handbook of Clinical Assessment</span> (Australian Medical
            Council, 2007). The AI patient responds only to information explicitly stated in that handbook —
            no clinical content is invented or extrapolated. Examiner feedback is bounded by the handbook&apos;s
            own Performance Guidelines.{" "}
            <span className="font-semibold">For exam preparation only — not medical advice.</span>
          </div>
        </div>

        {/* Mode selector */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="text-sm font-medium text-gray-600">Mode:</span>
          {(["Standard", "Beginner", "Exam", "Sprint"] as TimerMode[]).map(m => (
            <button
              key={m}
              onClick={() => setTimerMode(m)}
              className={`text-sm px-3 py-1.5 rounded-lg border transition font-medium ${
                timerMode === m
                  ? "bg-brand-600 text-white border-brand-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-brand-400"
              }`}
            >
              {m}
              <span className="ml-1.5 text-xs opacity-70">
                {Math.floor(MODE_DURATIONS[m] / 60)}m
              </span>
            </button>
          ))}
          <span className="text-xs text-gray-400 ml-2">
            {timerMode === "Exam" ? "Hard stop · no pausing" :
             timerMode === "Sprint" ? "5 min drill" :
             timerMode === "Beginner" ? "Extended time · milestones" :
             "Standard AMC timing"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {scenarios.map((s) => {
            const { gender: g, age: a } = parsePatientProfile(s.patientProfile);
            return (
              <button
                key={s.id}
                onClick={() => enterReading(s.id)}
                className="bg-white border border-gray-200 rounded-2xl p-5 text-left hover:shadow-md hover:border-brand-400 transition group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl">{getPatientEmoji(g, a)}</div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${difficultyColor[s.difficulty]}`}>
                    {s.difficulty}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{s.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{s.category} · Condition {s.mcatNumber}</p>
                <p className="text-xs text-gray-400 italic leading-relaxed line-clamp-2">
                  "{s.openingStatement}"
                </p>
                <p className="text-[10px] text-gray-300 mt-2 truncate">📋 {s.source}</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Fetching feedback screen ──────────────────────────────────────────────
  if (feedbackRequestedRef.current && loading && !examinerFeedback) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col items-center justify-center py-24 gap-6">
        <div className="text-5xl animate-bounce">📋</div>
        <h2 className="text-xl font-bold text-gray-800">Generating examiner feedback…</h2>
        <p className="text-sm text-gray-500 text-center">
          Reviewing your consultation against AMC Handbook performance guidelines.
        </p>
        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-2.5 h-2.5 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
          ))}
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
            onClick={() => enterReading(activeScenario)}
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
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
                {timerMode}
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
        <div className="flex items-center gap-3">
          {/* Countdown timer */}
          <div className={`text-right font-mono font-bold text-xl tabular-nums transition-colors ${timerColorClass(timeLeft)}`}>
            {formatTime(timeLeft)}
            {timeLeft <= WARNING2_SEC && timeLeft > 0 && (
              <div className="text-xs font-normal text-red-400 text-right">Wrap up!</div>
            )}
            {timeLeft <= WARNING1_SEC && timeLeft > WARNING2_SEC && (
              <div className="text-xs font-normal text-amber-500 text-right">2 min left</div>
            )}
          </div>
          {ttsSupported && (
            <VoiceControls
              muted={muted}
              volume={volume}
              setMuted={setMuted}
              setVolume={setVolume}
              ttsSupported={ttsSupported}
            />
          )}
          {speaking && (
            <button
              onClick={stopSpeaking}
              className="text-xs text-gray-500 border border-gray-200 px-2 py-1 rounded-lg hover:bg-gray-50"
            >
              ⏹ Stop
            </button>
          )}
          {messages.length > 1 ? (
            <button
              onClick={() => { feedbackRequestedRef.current = true; requestExaminerFeedback(); }}
              disabled={loading}
              className="text-xs text-white bg-brand-600 hover:bg-brand-700 px-3 py-1.5 rounded-lg disabled:opacity-40 transition"
            >
              End &amp; Get Feedback
            </button>
          ) : (
            <button
              onClick={endSession}
              className="text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50"
            >
              Exit
            </button>
          )}
        </div>
      </div>

      {/* Milestone banner */}
      {milestone && (
        <div className="mb-2 px-4 py-2 bg-brand-50 border border-brand-200 rounded-xl text-sm text-brand-700 font-medium flex items-center gap-2 animate-pulse">
          <span>📍</span>
          <span>{milestone}</span>
        </div>
      )}

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
              {m.role === "assistant" ? cleanForDisplay(m.content) : m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="text-2xl mr-2 self-end mb-1">{emoji}</div>
            <div className="bg-gray-100 rounded-2xl px-4 py-3 flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
              <FunLoading
                pool={["🤔 Patient is thinking…", "💭 Recalling symptoms…", "🩺 Searching memory for the right words…"]}
                className="text-xs text-gray-500"
              />
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

      {/* Voice input unsupported banner */}
      {micSupported === false && (
        <div className="mb-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 leading-relaxed">
          🎤 Voice input not supported in this browser (Brave / Firefox block it). Use Chrome, Edge, or Safari, or click the keyboard icon below to type your response.
        </div>
      )}

      {/* Input bar */}
      <div className="flex items-center gap-2">

        {/* Mic button */}
        {micSupported !== false && (
          <button
            onClick={handleMicButton}
            disabled={loading}
            title={isRecording ? "Tap to stop recording and send" : "Tap to start voice input"}
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
            : isRecording ? "Listening… tap ⏹ to send (or pause speaking 1.5s for auto-send)"
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
