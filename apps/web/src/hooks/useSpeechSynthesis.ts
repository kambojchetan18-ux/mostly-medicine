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

    // Cancel any in-progress speech and clear keepalive.
    window.speechSynthesis.cancel();
    if (keepaliveRef.current) clearInterval(keepaliveRef.current);
    setSpeaking(false);

    // On mobile Chrome, calling cancel() and immediately speak() can leave the
    // synthesis engine in a broken state after 3-4 turns. A short delay lets the
    // engine fully reset before the next utterance.
    setTimeout(() => {
      // Re-check supported after the delay (tab may have been hidden).
      if (!window.speechSynthesis) return;

      // Reload voices — on mobile they may not be cached yet.
      const voices = window.speechSynthesis.getVoices();
      const auVoices = voices.filter(v => v.lang === "en-AU" || v.lang === "en_AU");
      const femaleVoice = auVoices.find(v => /karen|female/i.test(v.name)) ?? auVoices[0];
      const maleVoice = auVoices.find(v => /lee|male/i.test(v.name)) ?? auVoices[0];
      const fallback = voices.find(v => v.lang.startsWith("en")) ?? voices[0];

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = gender === "female" ? (femaleVoice ?? fallback) : (maleVoice ?? fallback);
      utterance.lang = "en-AU";
      utterance.rate = 0.88;
      utterance.pitch = gender === "female" ? 1.1 : 0.92;

      const clearKeepalive = () => {
        if (keepaliveRef.current) { clearInterval(keepaliveRef.current); keepaliveRef.current = null; }
      };

      utterance.onstart = () => {
        setSpeaking(true);
        // Chrome silently stops TTS after ~15s of continuous speech.
        // Pause+resume every 8s keeps the engine alive.
        keepaliveRef.current = setInterval(() => {
          if (window.speechSynthesis.speaking) {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          }
        }, 8_000);
      };
      utterance.onend = () => { setSpeaking(false); clearKeepalive(); };
      utterance.onerror = () => { setSpeaking(false); clearKeepalive(); };

      window.speechSynthesis.speak(utterance);
    }, 80);
  }, [supported]);

  return { speaking, speak, stop, supported };
}
