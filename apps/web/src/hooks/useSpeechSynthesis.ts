"use client";
import { useState, useRef, useEffect, useCallback } from "react";

export function useSpeechSynthesis() {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const keepaliveRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    setSupported(true);
    // Preload voices
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  const stop = useCallback(() => {
    if (typeof window === "undefined") return;
    if (pendingRef.current) { clearTimeout(pendingRef.current); pendingRef.current = null; }
    if (keepaliveRef.current) { clearInterval(keepaliveRef.current); keepaliveRef.current = null; }
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback((text: string, gender: "male" | "female" | "unknown") => {
    if (!supported || typeof window === "undefined") return;

    // Cancel everything in flight
    if (pendingRef.current) { clearTimeout(pendingRef.current); pendingRef.current = null; }
    if (keepaliveRef.current) { clearInterval(keepaliveRef.current); keepaliveRef.current = null; }
    window.speechSynthesis.cancel();
    setSpeaking(false);

    // Small delay so Chrome's engine fully resets between utterances
    pendingRef.current = setTimeout(() => {
      pendingRef.current = null;
      if (!window.speechSynthesis) return;

      const voices = window.speechSynthesis.getVoices();
      const auVoices = voices.filter(v => v.lang === "en-AU" || v.lang === "en_AU");
      const femaleVoice = auVoices.find(v => /karen|female/i.test(v.name)) ?? auVoices[0];
      const maleVoice   = auVoices.find(v => /lee|male/i.test(v.name))   ?? auVoices[0];
      const fallback    = voices.find(v => v.lang.startsWith("en")) ?? voices[0];

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = gender === "female" ? (femaleVoice ?? fallback) : (maleVoice ?? fallback);
      utterance.lang  = "en-AU";
      utterance.rate  = 0.88;
      utterance.pitch = gender === "female" ? 1.1 : 0.92;

      utterance.onstart = () => {
        setSpeaking(true);
        // Chrome silently stops TTS after ~15s; pause+resume every 8s keeps it alive
        keepaliveRef.current = setInterval(() => {
          if (window.speechSynthesis.speaking) {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          }
        }, 8_000);
      };

      const cleanup = () => {
        setSpeaking(false);
        if (keepaliveRef.current) { clearInterval(keepaliveRef.current); keepaliveRef.current = null; }
      };
      utterance.onend   = cleanup;
      utterance.onerror = cleanup;

      window.speechSynthesis.speak(utterance);
    }, 80);
  }, [supported]);

  return { speaking, speak, stop, supported };
}
