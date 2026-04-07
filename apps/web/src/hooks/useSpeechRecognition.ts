"use client";
import { useState, useRef, useEffect, useCallback } from "react";

type RecognitionState = "idle" | "recording";

export function useSpeechRecognition() {
  const [state, setState] = useState<RecognitionState>("idle");
  const [displayTranscript, setDisplayTranscript] = useState("");
  const [supported, setSupported] = useState<boolean | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const liveTranscriptRef = useRef(""); // avoids stale closure in onresult

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
    setDisplayTranscript("");

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-AU";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let final = "";
      let interim = "";
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      liveTranscriptRef.current = final;
      setDisplayTranscript(final || interim);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "not-allowed") setPermissionDenied(true);
      setState("idle");
    };

    recognition.onend = () => {
      setState("idle");
    };

    recognition.start();
    recognitionRef.current = recognition;
    setState("recording");
  }, []);

  const stopRecording = useCallback((): string => {
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
