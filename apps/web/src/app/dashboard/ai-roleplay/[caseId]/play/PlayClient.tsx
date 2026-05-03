"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useVoiceRecognition as useWhisperSTT } from "@/hooks/useVoiceRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import VoiceControls from "@/components/VoiceControls";
import FunLoading from "@/components/FunLoading";
import MentorMessage from "@/components/MentorMessage";
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
  const [micMuted, setMicMuted] = useState(false);
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
  // Buffer Whisper chunks until the user stops the mic, then send as one
  // user turn. Avoids spamming /api/ai-roleplay/session with every 5s of
  // audio. Note: Whisper has no silence-detection auto-stop — the user MUST
  // click the mic again to end their turn (different from the old Web Speech
  // API behaviour which auto-fired on silence).
  const sendRef = useRef<(text: string) => void>(() => {});
  const sttBufferRef = useRef("");
  const handleSttChunk = useCallback((chunk: string) => {
    sttBufferRef.current = (sttBufferRef.current + " " + chunk).trim();
  }, []);
  const stopRecordingRef = useRef<() => Promise<void>>(() => Promise.resolve());
  const {
    state: sttState,
    displayTranscript,
    supported: sttSupported,
    permissionDenied: micDenied,
    startRecording,
    stopRecording: stopWhisper,
    silentTooLong,
  } = useWhisperSTT(handleSttChunk);

  // stopRecording fires on manual tap OR auto-stop when silence is detected.
  // stopWhisper() resolves AFTER the final partial chunk uploads + all
  // in-flight uploads settle.
  const [transcribeWarning, setTranscribeWarning] = useState<string | null>(null);
  const stopRecording = useCallback(async () => {
    const final = (await stopWhisper()).trim() || sttBufferRef.current.trim();
    sttBufferRef.current = "";
    if (final) {
      setTranscribeWarning(null);
      sendRef.current?.(final);
    } else {
      setTranscribeWarning("Couldn't catch what you said. Try again — speak a bit louder, closer to the mic, and away from background noise.");
    }
  }, [stopWhisper]);
  useEffect(() => {
    stopRecordingRef.current = stopRecording;
  }, [stopRecording]);

  useEffect(() => {
    if (micMuted && sttState === "recording") {
      void stopRecording();
    }
  }, [micMuted, sttState, stopRecording]);

  // NOTE: see Cat2Client for why we don't auto-stop the mic when `speaking`
  // is true — it RACES with the explicit barge-in path (stopSpeaking() +
  // startRecording() in the mic-toggle handler) and cancels the user's
  // intentional tap. Barge-in itself silences AI before the mic opens.

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
        // The server persists the user turn BEFORE streaming, so the user
        // message may already be saved. Keep it on screen (so a refresh will
        // show the same transcript) and only drop the empty assistant
        // placeholder. Don't refill the draft — that would let the user
        // re-send and double the user turn.
        setMessages((m) => m.filter((x) => x.id !== assistantId));
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
    // Brief pause so the in-flow mentor nudge (rendered when `ended` flips
    // true) has a chance to land before we push to the results page.
    setTimeout(() => {
      router.push(`/dashboard/ai-roleplay/results/${sessionId}`);
    }, 4500);
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      {ended && (
        <MentorMessage
          trigger="roleplay_complete"
          context={{ topic: candidateTask }}
        />
      )}
      {/* Sticky header — wraps to two rows on phones so the timer + End
          session button drop below the patient identity instead of
          overflowing the line. */}
      <div className="sticky top-0 z-10 -mx-3 flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-gray-200 bg-white/85 px-3 py-2 backdrop-blur sm:-mx-0 sm:rounded-xl sm:border sm:px-4">
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Patient</span>
          <span className="text-sm font-semibold text-gray-900 truncate">{patientName}</span>
        </div>
        <span className="hidden text-xs text-gray-400 sm:inline">·</span>
        <div className="hidden flex-col sm:flex">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Setting</span>
          <span className="text-xs text-gray-700 truncate max-w-[180px]">{setting}</span>
        </div>
        <div className="ml-auto flex items-center gap-2 flex-wrap justify-end">
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
                className={`max-w-[85%] whitespace-pre-wrap break-words [overflow-wrap:anywhere] rounded-2xl px-4 py-2 text-sm shadow-sm ${
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
              if (micMuted) return;
              if (sttState === "recording") {
                stopRecording();
              } else {
                // Barge-in: cancel() returns sync but the macOS speaker
                // buffer can keep emitting for 500-800 ms; mic opening
                // too soon picks up TTS bleed → Whisper conditions on it
                // → patient's prior line transcribed as the user's. 600 ms
                // is the empirical floor.
                const wasSpeaking = speaking;
                stopSpeaking();
                if (wasSpeaking) {
                  setTimeout(() => startRecording(), 600);
                } else {
                  startRecording();
                }
              }
            }}
            disabled={ended || sending || !sttSupported || micMuted}
            className={`flex h-20 w-20 items-center justify-center rounded-full text-3xl shadow-lg transition disabled:cursor-not-allowed disabled:opacity-50 ${
              sttState === "recording"
                ? "animate-pulse bg-rose-500 text-white"
                : "bg-fuchsia-600 text-white hover:bg-fuchsia-700"
            }`}
            aria-label={sttState === "recording" ? "Stop recording" : "Start recording"}
          >
            🎙️
          </button>
          <button
            type="button"
            onClick={() => setMicMuted((m) => !m)}
            disabled={ended}
            className={`rounded-xl border px-4 py-2 text-xs font-semibold transition disabled:opacity-50 min-h-[44px] ${
              micMuted
                ? "border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
            title={micMuted ? "Tap to unmute mic" : "Tap to mute mic"}
          >
            {micMuted ? (
              <>
                <span className="sm:hidden">🔇 Muted</span>
                <span className="hidden sm:inline">🔇 Muted — tap to unmute</span>
              </>
            ) : (
              "🎤 Mic on"
            )}
          </button>
          <div className="min-h-[2.5rem] text-center text-sm">
            {micMuted && (
              <span className="text-gray-700">🔇 Mic muted — unmute to speak</span>
            )}
            {!micMuted && sttState === "recording" && (
              <div className="space-y-0.5">
                <p className="font-semibold text-rose-600">
                  <span className="inline-block h-2 w-2 rounded-full bg-rose-500 animate-pulse mr-1.5 align-middle" />
                  Listening… speak naturally
                </p>
                <p className="text-xs text-gray-500">Tap the mic again when you're done to send your turn.</p>
                {displayTranscript && (
                  <p className="mt-1 text-xs italic text-gray-600">"{displayTranscript}"</p>
                )}
              </div>
            )}
            {!micMuted && sttState === "idle" && !sending && (
              <div className="space-y-0.5">
                <p className="font-semibold text-gray-800">🎙️ Tap the mic to start speaking</p>
                <p className="text-xs text-gray-500">When you're done, tap the mic again — your turn is sent automatically.</p>
              </div>
            )}
            {!micMuted && sending && (
              <span className="text-gray-700">Patient is responding…</span>
            )}
          </div>

          {/* Tiny help disclosure — explains the tap-mic-twice flow without
              cluttering the main UI. Default closed; users who already get
              it never see it expanded. */}
          {!ended && (
            <details className="w-full text-xs text-gray-600">
              <summary className="cursor-pointer select-none font-medium text-fuchsia-700 hover:text-fuchsia-800">
                How does the mic work?
              </summary>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-gray-700">
                <li>
                  <strong>Tap the mic</strong> — a red dot appears and the mic icon pulses. You're being heard.
                </li>
                <li>
                  <strong>Speak naturally</strong> as if you're with the patient. Don't worry about pauses.
                </li>
                <li>
                  <strong>Tap the mic again</strong> when you're finished. Your turn is transcribed and the patient replies.
                </li>
              </ol>
              <p className="mt-2 text-gray-500">
                Prefer typing? Use the toggle at the top to switch to text mode anytime.
              </p>
            </details>
          )}

          {silentTooLong && (
            <div className="w-full rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800 leading-relaxed">
              🚫 <strong>Mic seems silent.</strong> Check your phone/laptop mic permission for this site, close other apps using the mic (Zoom, Meet, FaceTime), then refresh.
            </div>
          )}

          {transcribeWarning && (
            <div className="w-full rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 leading-relaxed">
              🎤 {transcribeWarning}
            </div>
          )}

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
            className="flex-1 min-w-0 resize-none rounded-xl border border-gray-300 bg-white px-3 py-2 text-base sm:text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400 disabled:bg-gray-50"
          />
          <button
            type="submit"
            disabled={sending || ended || !draft.trim()}
            className="self-end rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60 min-h-[44px]"
          >
            {sending ? "…" : "Send"}
          </button>
        </form>
      )}
    </div>
  );
}
