"use client";
import { useState, useRef, useEffect, useCallback } from "react";

type Gender = "male" | "female" | "unknown";

const SETTINGS_KEY = "mm:tts-settings";
const DEFAULT_VOLUME = 1.0;

interface TtsSettings {
  muted: boolean;
  volume: number; // 0-1
}

function loadSettings(): TtsSettings {
  if (typeof window === "undefined") return { muted: false, volume: DEFAULT_VOLUME };
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { muted: false, volume: DEFAULT_VOLUME };
    const parsed = JSON.parse(raw);
    return {
      muted: Boolean(parsed.muted),
      volume: typeof parsed.volume === "number" ? Math.min(1, Math.max(0, parsed.volume)) : DEFAULT_VOLUME,
    };
  } catch {
    return { muted: false, volume: DEFAULT_VOLUME };
  }
}

function saveSettings(s: TtsSettings) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

// Score voices by quality + locale + gender match. Higher score = better pick.
function scoreVoice(v: SpeechSynthesisVoice, gender: Gender): number {
  let score = 0;
  // Locale: en-AU > en-GB > en-US > other en > non-en
  if (/^en[-_]AU$/i.test(v.lang)) score += 100;
  else if (/^en[-_]GB$/i.test(v.lang)) score += 70;
  else if (/^en[-_]US$/i.test(v.lang)) score += 50;
  else if (/^en/i.test(v.lang)) score += 30;
  // Quality / "premium" hints in voice names
  const n = v.name.toLowerCase();
  if (/(neural|premium|enhanced|natural|wavenet|studio)/.test(n)) score += 40;
  // macOS / iOS Siri-tier voices
  if (/(karen|lee|nicky|aaron|isha|samantha|daniel|moira|tessa|veena|matilda|catherine)/.test(n)) score += 25;
  // Google Chrome high-quality voices
  if (n.includes("google")) score += 20;
  if (n.includes("microsoft")) score += 15;
  // Gender match (heuristic via name + voice metadata)
  const isFemaleByName =
    /(karen|samantha|nicky|moira|tessa|veena|catherine|isha|matilda|fiona|female|woman|kate|julia|allison|ava|emily|emma|olivia|sophie|amy)/i.test(
      v.name
    );
  const isMaleByName = /(lee|aaron|daniel|alex|tom|james|jack|fred|oliver|bruce|gordon|male|man|ralph|david|mark)/i.test(
    v.name
  );
  if (gender === "female" && isFemaleByName) score += 50;
  else if (gender === "male" && isMaleByName) score += 50;
  // Tiny penalty for known robotic voices
  if (/(zarvox|albert|bahh|bells|bubbles|cellos|deranged|trinoids|whisper)/i.test(v.name)) score -= 50;
  // Default voice nudge
  if (v.default) score += 5;
  return score;
}

export function useSpeechSynthesis() {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const [settings, setSettings] = useState<TtsSettings>(() => ({ muted: false, volume: DEFAULT_VOLUME }));
  const keepaliveRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    setSupported(true);
    setSettings(loadSettings());
    // Preload voices (some browsers populate asynchronously)
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const stop = useCallback(() => {
    if (typeof window === "undefined") return;
    if (pendingRef.current) {
      clearTimeout(pendingRef.current);
      pendingRef.current = null;
    }
    if (keepaliveRef.current) {
      clearInterval(keepaliveRef.current);
      keepaliveRef.current = null;
    }
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback(
    (text: string, gender: Gender) => {
      if (!supported || typeof window === "undefined") return;
      // Mute = no audio at all
      if (settingsRef.current.muted) return;

      // Cancel anything in flight
      if (pendingRef.current) {
        clearTimeout(pendingRef.current);
        pendingRef.current = null;
      }
      if (keepaliveRef.current) {
        clearInterval(keepaliveRef.current);
        keepaliveRef.current = null;
      }
      window.speechSynthesis.cancel();
      setSpeaking(false);

      // Small delay so Chrome's engine fully resets between utterances
      pendingRef.current = setTimeout(() => {
        pendingRef.current = null;
        if (!window.speechSynthesis) return;

        const voices = window.speechSynthesis.getVoices();
        if (voices.length === 0) return;
        // Pick highest-scoring voice for the requested gender
        const best = voices
          .map((v) => ({ v, score: scoreVoice(v, gender) }))
          .sort((a, b) => b.score - a.score)[0];

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = best.v;
        utterance.lang = best.v.lang || "en-AU";
        utterance.rate = 0.95;
        utterance.pitch = gender === "female" ? 1.05 : gender === "male" ? 0.95 : 1.0;
        utterance.volume = settingsRef.current.volume;

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
          if (keepaliveRef.current) {
            clearInterval(keepaliveRef.current);
            keepaliveRef.current = null;
          }
        };
        utterance.onend = cleanup;
        utterance.onerror = cleanup;

        window.speechSynthesis.speak(utterance);
      }, 80);
    },
    [supported]
  );

  const setMuted = useCallback(
    (muted: boolean) => {
      const next = { ...settingsRef.current, muted };
      setSettings(next);
      saveSettings(next);
      if (muted) stop();
    },
    [stop]
  );

  const setVolume = useCallback((volume: number) => {
    const v = Math.min(1, Math.max(0, volume));
    const next = { ...settingsRef.current, volume: v };
    setSettings(next);
    saveSettings(next);
  }, []);

  return {
    speaking,
    speak,
    stop,
    supported,
    muted: settings.muted,
    volume: settings.volume,
    setMuted,
    setVolume,
  };
}
