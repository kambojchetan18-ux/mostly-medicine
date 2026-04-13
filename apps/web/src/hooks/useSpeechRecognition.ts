"use client";
import { useState, useRef, useEffect, useCallback } from "react";

type RecognitionState = "idle" | "recording";

export function useSpeechRecognition(onAutoEnd?: (transcript: string) => void) {
  const [state, setState] = useState<RecognitionState>("idle");
  const [displayTranscript, setDisplayTranscript] = useState("");
  const [supported, setSupported] = useState<boolean | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const liveTranscriptRef = useRef(""); // avoids stale closure in onresult
  const userStoppedRef = useRef(false); // distinguishes manual stop from browser auto-stop
  const onAutoEndRef = useRef(onAutoEnd);

  useEffect(() => { onAutoEndRef.current = onAutoEnd; }, [onAutoEnd]);

  useEffect(() => {
    const SR = typeof window !== "undefined"
      ? (window.SpeechRecognition ?? window.webkitSpeechRecognition)
      : null;
    setSupported(!!SR);
  }, []);

  const startRecording = useCallback(() => {
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SR) return;

    liveTranscriptRef.current = "";
    userStoppedRef.current = false;
    setDisplayTranscript("");

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-AU";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      // Only process results that are new or updated (from resultIndex onward).
      // Starting from 0 caused all prior finals to be re-concatenated on every
      // event, producing doubled/garbled transcript (e.g. "hihi patienthi...").
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          liveTranscriptRef.current += event.results[i][0].transcript + " ";
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      // Show accumulated finals + live interim so user sees real-time progress.
      setDisplayTranscript((liveTranscriptRef.current + interim).trim());
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "not-allowed") setPermissionDenied(true);
      setState("idle");
    };

    recognition.onend = () => {
      setState("idle");
      // If the browser auto-stopped (silence timeout) rather than the user clicking
      // stop, fire the callback so the caller can send whatever was captured.
      if (!userStoppedRef.current) {
        const final = liveTranscriptRef.current.trim();
        liveTranscriptRef.current = "";
        setDisplayTranscript("");
        if (final) onAutoEndRef.current?.(final);
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
    setState("recording");
  }, []);

  const stopRecording = useCallback((): string => {
    userStoppedRef.current = true;
    recognitionRef.current?.stop();
    setState("idle");
    const final = liveTranscriptRef.current.trim();
    liveTranscriptRef.current = "";
    setDisplayTranscript("");
    return final;
  }, []);

  return {
    state,
    displayTranscript,
    supported,
    permissionDenied,
    startRecording,
    stopRecording,
  };
}
