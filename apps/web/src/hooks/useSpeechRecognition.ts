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
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          liveTranscriptRef.current += event.results[i][0].transcript + " ";
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setDisplayTranscript((liveTranscriptRef.current + interim).trim());
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
