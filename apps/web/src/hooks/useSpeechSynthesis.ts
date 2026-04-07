"use client";
import { useState, useRef, useEffect, useCallback } from "react";

export function useSpeechSynthesis() {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const keepaliveRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    setSupported(true);

    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  const stop = useCallback(() => {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    if (keepaliveRef.current) clearInterval(keepaliveRef.current);
    setSpeaking(false);
  }, []);

  const speak = useCallback((text: string, gender: "male" | "female" | "unknown") => {
    if (!supported || typeof window === "undefined") return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = voicesRef.current;

    // Pick gender-appropriate Australian voice
    const auVoices = voices.filter(v => v.lang === "en-AU" || v.lang === "en_AU");
    const femaleVoice = auVoices.find(v => /karen|female/i.test(v.name)) ?? auVoices[0];
    const maleVoice = auVoices.find(v => /lee|male/i.test(v.name)) ?? auVoices[0];
    const fallback = voices.find(v => v.lang.startsWith("en")) ?? voices[0];

    utterance.voice = gender === "female" ? (femaleVoice ?? fallback) : (maleVoice ?? fallback);
    utterance.lang = "en-AU";
    utterance.rate = 0.88;
    utterance.pitch = gender === "female" ? 1.1 : 0.92;

    utterance.onstart = () => {
      setSpeaking(true);
      // Chrome TTS pause bug workaround: keepalive every 10s
      keepaliveRef.current = setInterval(() => {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }, 10_000);
    };
    utterance.onend = () => {
      setSpeaking(false);
      if (keepaliveRef.current) clearInterval(keepaliveRef.current);
    };
    utterance.onerror = () => {
      setSpeaking(false);
      if (keepaliveRef.current) clearInterval(keepaliveRef.current);
    };

    window.speechSynthesis.speak(utterance);
  }, [supported]);

  return { speaking, speak, stop, supported };
}
