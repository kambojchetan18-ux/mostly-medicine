"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import VoiceControls from "@/components/VoiceControls";
import FunLoading from "@/components/FunLoading";
import { cleanForDisplay } from "@/lib/clean-message";

const ROLEPLAY_SECONDS = 8 * 60;

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Props {
  caseId: string;
  sessionId: string;
  patientName: string;
  patientGender: "male" | "female" | "unknown";
  candidateTask: string;
  setting: string;
  difficulty: string;
  initialMessages: Message[];
}

function tmpId() {
  return `tmp-${Math.random().toString(36).slice(2, 10)}`;
}

export default function PlayClient({
  sessionId,
  patientName,
  patientGender,
  candidateTask,
  setting,
  difficulty,
  initialMessages,
}: Props) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(ROLEPLAY_SECONDS);
  const [ended, setEnded] = useState(false);
  // Voice is the default — typing wastes 8-min station time. User can flip
  // to text via the toggle if their browser/mic blocks STT.
  const [voiceMode, setVoiceMode] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Voice — STT in, TTS out. The hook auto-fires its callback on stop/silence
  // with the final transcript; we send it straight to the API. The keepalive
  // logic for Chrome is already handled inside useSpeechSynthesis.
  const {
    speak,
    stop: stopSpeaking,
    speaking,
    prime: primeTts,
    supported: ttsSupported,
    muted,
    volume,
    setMuted,
    setVolume,
  } = useSpeechSynthesis();
  const sendRef = useRef<(text: string) => void>(() => {});
  const handleSttFinal = useCallback((finalText: string) => {
    sendRef.current?.(finalText);
  }, []);
  const {
    state: sttState,
    displayTranscript,
    supported: sttSupported,
    permissionDenied: micDenied,
    startRecording,
    stopRecording,
  } = useSpeechRecognition(handleSttFinal);

  // Countdown
  useEffect(() => {
    if (ended) return;
    if (secondsLeft <= 0) {
      handleEnd();
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, ended]);

  // Autoscroll on new message
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const mm = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const ss = (secondsLeft % 60).toString().padStart(2, "0");
  const lowTime = secondsLeft <= 60;

  const placeholderHint = useMemo(() => {
    if (messages.length === 0) return "Greet the patient and start the consultation…";
    if (messages.length < 4) return "Open question? Explore presenting complaint…";
    return "Follow up, examine, or work toward your impression…";
  }, [messages.length]);

  const send = useCallback(
    async (textOverride?: string) => {
      const content = (textOverride ?? draft).trim();
      if (!content || sending || ended) return;
      setError(null);

      // Prime mobile TTS while we still have a user-gesture token. Without
      // this, mobile Chrome / iOS Safari silently refuse the later speak().
      if (voiceMode && ttsSupported) primeTts();

      const localUser: Message = { id: tmpId(), role: "user", content };
      const assistantId = tmpId();
      setMessages((m) => [
        ...m,
        localUser,
        // Empty assistant placeholder we'll fill as deltas arrive.
        { id: assistantId, role: "assistant", content: "" },
      ]);
      if (!textOverride) setDraft("");
      setSending(true);

      try {
        const res = await fetch(`/api/ai-roleplay/session/${sessionId}/message`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });
        if (!res.ok || !res.body) {
          let msg = "AI error";
          try {
            const j = await res.json();
            msg = j.error ?? msg;
          } catch {
            /* ignore */
          }
          throw new Error(msg);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let full = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          // SSE frames are delimited by blank lines.
          const frames = buffer.split("\n\n");
          buffer = frames.pop() ?? "";
          for (const frame of frames) {
            const line = frame.split("\n").find((l) => l.startsWith("data: "));
            if (!line) continue;
            try {
              const evt = JSON.parse(line.slice(6)) as
                | { type: "delta"; text: string }
                | { type: "done"; reply: string }
                | { type: "error"; error: string };
              if (evt.type === "delta") {
                full += evt.text;
                setMessages((m) =>
                  m.map((x) => (x.id === assistantId ? { ...x, content: full } : x))
                );
              } else if (evt.type === "done") {
                full = evt.reply;
                setMessages((m) =>
                  m.map((x) => (x.id === assistantId ? { ...x, content: full } : x))
                );
                if (voiceMode && ttsSupported) speak(full, patientGender);
              } else if (evt.type === "error") {
                throw new Error(evt.error);
              }
            } catch (err) {
              if (err instanceof Error && err.message !== "AI error") throw err;
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not send message");
        setMessages((m) => m.filter((x) => x.id !== localUser.id && x.id !== assistantId));
        if (!textOverride) setDraft(content);
      } finally {
        setSending(false);
      }
    },
    [draft, sending, ended, sessionId, voiceMode, ttsSupported, speak, primeTts, patientGender]
  );

  // Keep the latest send function reachable from the STT callback.
  useEffect(() => {
    sendRef.current = (txt: string) => send(txt);
  }, [send]);

  // When user toggles voice off mid-utterance, kill TTS + STT.
  useEffect(() => {
    if (!voiceMode) {
      stopSpeaking();
      if (sttState === "recording") stopRecording();
    }
  }, [voiceMode, stopSpeaking, sttState, stopRecording]);

  async function handleEnd() {
    if (ended) return;
    setEnded(true);
    try {
      await fetch(`/api/ai-roleplay/session/${sessionId}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch {
      // Feedback API hookup arrives in Phase 6; navigate regardless.
    }
    router.push(`/dashboard/ai-roleplay/results/${sessionId}`);
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      {/* Sticky header with timer + end button */}
      <div className="sticky top-0 z-10 -mx-4 flex items-center gap-3 border-b border-gray-200 bg-white/80 px-4 py-2 backdrop-blur sm:mx-0 sm:rounded-xl sm:border">
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Patient</span>
          <span className="text-sm font-semibold text-gray-900">{patientName}</span>
        </div>
        <span className="hidden text-xs text-gray-400 sm:inline">·</span>
        <div className="hidden flex-col sm:flex">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Setting</span>
          <span className="text-xs text-gray-700">{setting}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {voiceMode && (
            <VoiceControls
              muted={muted}
              volume={volume}
              setMuted={setMuted}
              setVolume={setVolume}
              ttsSupported={ttsSupported}
            />
          )}
          {(sttSupported || ttsSupported) && (
            <button
              type="button"
              onClick={() => setVoiceMode((v) => !v)}
              disabled={ended}
              className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
                voiceMode
                  ? "border-fuchsia-300 bg-fuchsia-50 text-fuchsia-700"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
              title={voiceMode ? "Voice mode on" : "Voice mode off"}
            >
              {voiceMode ? "🎙️ Voice" : "💬 Text"}
            </button>
          )}
          <span
            className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${
              lowTime
                ? "border-rose-300 bg-rose-50 text-rose-700"
                : "border-brand-200 bg-brand-50 text-brand-700"
            }`}
          >
            {mm}:{ss}
          </span>
          <button
            type="button"
            onClick={handleEnd}
            disabled={ended}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            End session
          </button>
        </div>
      </div>

      {/* Task pill */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-xs">
        <span className="font-semibold uppercase tracking-wide text-amber-800">Your task: </span>
        <span className="text-amber-900">{candidateTask}</span>
        <span className="ml-2 rounded-full border border-amber-200 bg-white px-1.5 py-0.5 text-[10px] uppercase text-amber-700">
          {difficulty}
        </span>
      </div>

      {/* Transcript */}
      <div
        ref={scrollRef}
        className="min-h-[40vh] max-h-[60vh] space-y-3 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-4"
      >
        {messages.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray-500">
            Type your opening to begin. The patient will respond in character.
          </p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm shadow-sm ${
                  m.role === "user"
                    ? "rounded-br-sm bg-brand-600 text-white"
                    : "rounded-bl-sm border border-gray-200 bg-white text-gray-800"
                }`}
              >
                {m.role === "assistant" ? cleanForDisplay(m.content) : m.content}
              </div>
            </div>
          ))
        )}
        {sending && (
          <div className="flex flex-col items-start gap-1">
            <div className="rounded-2xl rounded-bl-sm border border-gray-200 bg-white px-4 py-2 text-sm text-gray-500 shadow-sm">
              <span className="inline-flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
              </span>
            </div>
            <FunLoading
              pool={[
                "🤔 Patient is thinking…",
                "💭 Recalling symptoms…",
                "😟 Gathering courage to speak…",
              ]}
              className="text-xs text-gray-500"
            />
          </div>
        )}
      </div>

      {error && <p className="text-sm text-rose-600">⚠️ {error}</p>}
      {voiceMode && micDenied && (
        <p className="text-xs text-amber-600">
          ⚠️ Microphone permission denied. Allow mic access in your browser settings to use voice mode.
        </p>
      )}

      {/* Composer */}
      {voiceMode ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-fuchsia-200 bg-fuchsia-50/40 p-5">
          <button
            type="button"
            onClick={() => {
              if (sttState === "recording") {
                stopRecording();
              } else {
                stopSpeaking();
                startRecording();
              }
            }}
            disabled={ended || sending || !sttSupported}
            className={`flex h-20 w-20 items-center justify-center rounded-full text-3xl shadow-lg transition disabled:cursor-not-allowed disabled:opacity-50 ${
              sttState === "recording"
                ? "animate-pulse bg-rose-500 text-white"
                : "bg-fuchsia-600 text-white hover:bg-fuchsia-700"
            }`}
            aria-label={sttState === "recording" ? "Stop recording" : "Start recording"}
          >
            🎙️
          </button>
          <div className="min-h-[1.5rem] text-center text-sm text-gray-700">
            {sttState === "recording" && (displayTranscript || "Listening…")}
            {sttState === "idle" && speaking && `${patientName} is speaking…`}
            {sttState === "idle" && !speaking && !sending && "Tap the mic and speak"}
            {sending && "Patient is responding…"}
          </div>
          {!sttSupported && (
            <div className="flex flex-col items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-center">
              <p className="text-xs text-amber-700">
                Voice input isn’t available in this browser (e.g. Brave or Firefox). Use Chrome, Edge, or Safari for voice input. Or switch to text below.
              </p>
              <button
                type="button"
                onClick={() => setVoiceMode(false)}
                className="rounded-md border border-amber-300 bg-white px-2.5 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-100"
              >
                Switch to text mode
              </button>
            </div>
          )}
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex gap-2"
        >
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={2}
            disabled={ended}
            placeholder={placeholderHint}
            className="flex-1 resize-none rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400 disabled:bg-gray-50"
          />
          <button
            type="submit"
            disabled={sending || ended || !draft.trim()}
            className="self-end rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sending ? "…" : "Send"}
          </button>
        </form>
      )}
    </div>
  );
}
