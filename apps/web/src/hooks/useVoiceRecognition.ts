"use client";
// Hybrid STT: pick the right speech-to-text engine for the device.
//
// Whisper (server-side via Groq) is the most accurate option on desktop —
// echoCancellation, 128 kbps Opus, 8 s chunks, conversational seed prompt.
// But on mobile (Android Chrome especially) the MediaRecorder + Whisper
// combo is intermittent: AudioContext stays suspended, audio quality drops,
// and Whisper falls back to its 'Thank you for watching' hallucinations.
//
// On those devices the browser-native Web Speech API (Google's online STT
// piped through Chrome) is dramatically more reliable: instant, free,
// offline-capable, and tuned by Google for the same hardware. We pick it
// per-device on mount and return a unified shape so call sites don't care.
//
// Live Peer RolePlay (which passes externalStream) stays on Whisper because
// Web Speech can't share a MediaStream with WebRTC.
import { useCallback, useEffect, useRef, useState } from "react";
import { useWhisperSTT, type UseWhisperSTTOptions } from "./useWhisperSTT";
import { useSpeechRecognition } from "./useSpeechRecognition";

function isMobileBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

function hasWebSpeech(): boolean {
  if (typeof window === "undefined") return false;
  return (
    "SpeechRecognition" in window || "webkitSpeechRecognition" in window
  );
}

export function useVoiceRecognition(
  onTranscript?: (text: string) => void,
  options: UseWhisperSTTOptions = {}
) {
  // Bridge Speech's onResult callback with Whisper-shape onTranscript.
  // Speech's onResult fires once per utterance with the FULL final string;
  // Whisper's onTranscript fires per chunk. Caller-side both append to a
  // buffer, so semantically identical.
  const onTranscriptRef = useRef(onTranscript);
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  // Promise to resolve on the next final transcript. Lets stopRecording on
  // the Speech path return Promise<string> matching Whisper's contract.
  const speechFinalResolveRef = useRef<((text: string) => void) | null>(null);

  const speech = useSpeechRecognition((text: string) => {
    onTranscriptRef.current?.(text);
    const resolve = speechFinalResolveRef.current;
    speechFinalResolveRef.current = null;
    if (resolve) resolve(text);
  });

  const whisper = useWhisperSTT(onTranscript, options);

  // Decide once on mount which engine to use. Stable for the session so the
  // UI doesn't flicker between two STT providers.
  //
  // On mobile we ALWAYS prefer Web Speech, even in Live Peer RolePlay where
  // an externalStream is present. Reason: Whisper-via-Groq has been
  // intermittent on Android Chrome due to suspended AudioContext + soft
  // mic + Whisper hallucinations. Web Speech runs its OWN audio capture in
  // parallel with the WebRTC stream — Chrome handles that fine on Android
  // (multiple consumer access). Partner audio still flows through WebRTC
  // unchanged; only the local STT path swaps.
  const [usingNative] = useState(() => {
    if (typeof window === "undefined") return false;
    if (!isMobileBrowser() || !hasWebSpeech()) return false;
    return true;
  });

  // Wrap Speech's stopRecording so callers get a Promise<string> just like
  // Whisper. The promise resolves when the next final-transcript fires
  // (recognition.onend) — which the underlying hook already triggers.
  const speechStopRecording = useCallback((): Promise<string> => {
    return new Promise<string>((resolve) => {
      speechFinalResolveRef.current = resolve;
      speech.stopRecording();
      // Safety net: if onend never fires (browser hang, user revokes
      // permission mid-session), resolve empty after 4 s so the caller
      // doesn't hang forever.
      setTimeout(() => {
        if (speechFinalResolveRef.current === resolve) {
          speechFinalResolveRef.current = null;
          resolve("");
        }
      }, 4000);
    });
  }, [speech]);

  // Async-shape wrapper for startRecording on the Speech path.
  const speechStartRecording = useCallback(async (): Promise<void> => {
    speech.startRecording();
  }, [speech]);

  if (usingNative) {
    return {
      state: speech.state,
      displayTranscript: speech.displayTranscript,
      supported: speech.supported,
      permissionDenied: speech.permissionDenied,
      startRecording: speechStartRecording,
      stopRecording: speechStopRecording,
      // Whisper-only diagnostics — stubbed for the Speech path so call sites
      // can render their level bars / counts without a `?` everywhere.
      micLevel: 0,
      rateLimited: false,
      silentTooLong: false,
      lastRawText: "",
      chunkCount: 0,
      engine: "native" as const,
    };
  }

  return {
    ...whisper,
    engine: "whisper" as const,
  };
}
