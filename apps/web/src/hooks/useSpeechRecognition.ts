"use client";
import { useState, useRef, useEffect, useCallback } from "react";

type RecognitionState = "idle" | "recording";

// onResult fires for both manual stop and browser auto-stop (silence).
// Transcript is read in onend so Chrome's final onresult events are included.
export function useSpeechRecognition(onResult?: (transcript: string) => void) {
  const [state, setState] = useState<RecognitionState>("idle");
  const [displayTranscript, setDisplayTranscript] = useState("");
  const [supported, setSupported] = useState<boolean | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const liveTranscriptRef = useRef("");
  const onResultRef = useRef(onResult);

  useEffect(() => { onResultRef.current = onResult; }, [onResult]);

  useEffect(() => {
    const SR = typeof window !== "undefined"
      ? (window.SpeechRecognition ?? window.webkitSpeechRecognition)
      : null;
    setSupported(!!SR);
    // Brave specifically blocks the underlying Google Speech API even though
    // webkitSpeechRecognition is exposed. Detect Brave and surface a clear
    // unsupported state so the UI can show a Brave-shield-disable hint.
    if (typeof navigator !== "undefined") {
      const nav = navigator as unknown as { brave?: { isBrave?: () => Promise<boolean> } };
      if (nav.brave?.isBrave) {
        nav.brave.isBrave().then((isBrave) => {
          if (isBrave) {
            // SpeechRecognition exists in Brave but the network call fails.
            // Mark as unsupported so the UI prompts user to switch browsers
            // or disable Shields for this site.
            setSupported(false);
          }
        }).catch(() => {});
      }
    }
  }, []);

  const startRecording = useCallback(() => {
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SR) return;

    // Abort any existing session before starting a new one
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch { /* ignore */ }
      recognitionRef.current = null;
    }

    liveTranscriptRef.current = "";
    setDisplayTranscript("");

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-AU";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      // Two-stage rebuild: collect raw final chunks, then compact stale
      // prefixes. Android Chrome with continuous=true emits the same
      // growing utterance as MULTIPLE finals — ["can", "can you",
      // "can you tell", "can you tell me"] — which previously concatenated
      // into "can can you can you tell can you tell me…". Whenever a final
      // chunk is a prefix of a later final chunk, drop the shorter one.
      const finalChunks: string[] = [];
      let interim = "";
      for (let i = 0; i < event.results.length; i++) {
        const piece = (event.results[i][0]?.transcript ?? "").trim();
        if (!piece) continue;
        if (event.results[i].isFinal) {
          finalChunks.push(piece);
        } else {
          interim += piece + " ";
        }
      }

      const compacted: string[] = [];
      for (let i = 0; i < finalChunks.length; i++) {
        const cur = finalChunks[i].toLowerCase();
        let stale = false;
        for (let j = i + 1; j < finalChunks.length; j++) {
          if (finalChunks[j].toLowerCase().startsWith(cur)) {
            stale = true;
            break;
          }
        }
        if (!stale) compacted.push(finalChunks[i]);
      }

      const finals = compacted.join(" ").replace(/\s+/g, " ").trim();
      liveTranscriptRef.current = finals;
      setDisplayTranscript((finals + " " + interim).replace(/\s+/g, " ").trim());
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "not-allowed") setPermissionDenied(true);
      // onend will fire next and handle cleanup + callback
    };

    recognition.onend = () => {
      setState("idle");
      const final = liveTranscriptRef.current.trim();
      liveTranscriptRef.current = "";
      setDisplayTranscript("");
      recognitionRef.current = null;
      // Fire for both manual stop and auto-stop (silence/timeout)
      if (final) onResultRef.current?.(final);
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
      setState("recording");
    } catch {
      setState("idle");
    }
  }, []);

  // Just signals stop — transcript arrives via onResult callback in onend
  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
    }
  }, []);

  return { state, displayTranscript, supported, permissionDenied, startRecording, stopRecording };
}
