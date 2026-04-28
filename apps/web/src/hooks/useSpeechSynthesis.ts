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

function scoreVoice(v: SpeechSynthesisVoice, gender: Gender): number {
  let score = 0;
  if (/^en[-_]AU$/i.test(v.lang)) score += 100;
  else if (/^en[-_]GB$/i.test(v.lang)) score += 70;
  else if (/^en[-_]US$/i.test(v.lang)) score += 50;
  else if (/^en/i.test(v.lang)) score += 30;
  const n = v.name.toLowerCase();
  if (/(neural|premium|enhanced|natural|wavenet|studio)/.test(n)) score += 40;
  if (/(karen|lee|nicky|aaron|isha|samantha|daniel|moira|tessa|veena|matilda|catherine)/.test(n)) score += 25;
  if (n.includes("google")) score += 20;
  if (n.includes("microsoft")) score += 15;
  const isFemaleByName =
    /(karen|samantha|nicky|moira|tessa|veena|catherine|isha|matilda|fiona|female|woman|kate|julia|allison|ava|emily|emma|olivia|sophie|amy)/i.test(
      v.name
    );
  const isMaleByName =
    /(lee|aaron|daniel|alex|tom|james|jack|fred|oliver|bruce|gordon|male|man|ralph|david|mark)/i.test(
      v.name
    );
  if (gender === "female" && isFemaleByName) score += 50;
  else if (gender === "male" && isMaleByName) score += 50;
  if (/(zarvox|albert|bahh|bells|bubbles|cellos|deranged|trinoids|whisper)/i.test(v.name)) score -= 50;
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

  // Lock the chosen voice per gender within a session so it doesn't randomly
  // swap between turns. Voices reload async in some browsers and sort
  // ordering can shift, which is what was causing voice drift.
  const lockedVoiceRef = useRef<Partial<Record<Gender, SpeechSynthesisVoice>>>({});

  // Track currently speaking utterance so mute can pause + unmute can resume
  // INSTEAD of cancelling — this lets the user hear the rest of an in-flight
  // patient reply after toggling unmute.
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const pausedByMuteRef = useRef(false);
  // Track current speakable text + last charIndex so a volume change mid-
  // utterance can cancel + restart at the new volume from where we were.
  const currentTextRef = useRef<string>("");
  const currentCharIndexRef = useRef<number>(0);
  const currentGenderRef = useRef<Gender>("unknown");
  const volumeRestartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    setSupported(true);
    setSettings(loadSettings());
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      // Hard-stop any in-flight speech on unmount — without this, navigating
      // away from a roleplay page lets the patient keep talking in the
      // background (Web Speech API is global to the document).
      try {
        window.speechSynthesis.cancel();
      } catch {
        /* ignore */
      }
      if (keepaliveRef.current) {
        clearInterval(keepaliveRef.current);
        keepaliveRef.current = null;
      }
      if (pendingRef.current) {
        clearTimeout(pendingRef.current);
        pendingRef.current = null;
      }
      if (volumeRestartTimerRef.current) {
        clearTimeout(volumeRestartTimerRef.current);
        volumeRestartTimerRef.current = null;
      }
    };
  }, []);

  // Belt-and-braces — also stop speech if the page is hidden / unloaded.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stopAll = () => {
      try {
        window.speechSynthesis.cancel();
      } catch {
        /* ignore */
      }
    };
    const onVisibility = () => {
      if (document.hidden) stopAll();
    };
    window.addEventListener("pagehide", stopAll);
    window.addEventListener("beforeunload", stopAll);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pagehide", stopAll);
      window.removeEventListener("beforeunload", stopAll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  function pickVoice(gender: Gender): SpeechSynthesisVoice | null {
    // Reuse the locked voice if we already chose one for this gender.
    const existing = lockedVoiceRef.current[gender];
    if (existing) return existing;
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return null;
    const best = voices
      .map((v) => ({ v, score: scoreVoice(v, gender) }))
      .sort((a, b) => b.score - a.score)[0]?.v;
    if (best) lockedVoiceRef.current[gender] = best;
    return best ?? null;
  }

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
    currentUtteranceRef.current = null;
    pausedByMuteRef.current = false;
    setSpeaking(false);
  }, []);

  const speak = useCallback(
    (text: string, gender: Gender) => {
      if (!supported || typeof window === "undefined") return;
      // Mute = swallow new audio entirely.
      if (settingsRef.current.muted) return;

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

      pendingRef.current = setTimeout(() => {
        pendingRef.current = null;
        if (!window.speechSynthesis) return;

        const chosen = pickVoice(gender);
        if (!chosen) return;

        // Strip stage directions before speaking — keep them in the on-screen
        // transcript but don't read "*sighs*" / "(pauses)" / "[winces]" aloud.
        const speakable = text
          .replace(/\*[^*\n]+\*/g, "") // *sighs*, *pauses*
          .replace(/\([^)\n]+\)/g, "") // (crying)
          .replace(/\[[^\]\n]+\]/g, "") // [winces]
          .replace(/\s{2,}/g, " ")
          .trim();
        if (!speakable) return;

        const utterance = new SpeechSynthesisUtterance(speakable);
        utterance.voice = chosen;
        utterance.lang = chosen.lang || "en-AU";
        utterance.rate = 0.95;
        utterance.pitch = gender === "female" ? 1.05 : gender === "male" ? 0.95 : 1.0;
        utterance.volume = settingsRef.current.volume;

        utterance.onstart = () => {
          setSpeaking(true);
          currentUtteranceRef.current = utterance;
          currentTextRef.current = speakable;
          currentCharIndexRef.current = 0;
          currentGenderRef.current = gender;
          // Chrome silently stops TTS after ~15s; pause+resume every 8s keeps it alive
          keepaliveRef.current = setInterval(() => {
            if (window.speechSynthesis.speaking) {
              window.speechSynthesis.pause();
              window.speechSynthesis.resume();
            }
          }, 8_000);
        };

        utterance.onboundary = (ev: SpeechSynthesisEvent) => {
          // Track position so a real-time volume change can resume from here.
          currentCharIndexRef.current = ev.charIndex ?? 0;
        };

        const cleanup = () => {
          setSpeaking(false);
          currentUtteranceRef.current = null;
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

  const setMuted = useCallback((muted: boolean) => {
    const next = { ...settingsRef.current, muted };
    setSettings(next);
    saveSettings(next);
    if (typeof window === "undefined") return;
    if (muted) {
      // Pause (don't cancel) so we can resume on unmute.
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        pausedByMuteRef.current = true;
      }
    } else {
      // Resume if we paused due to mute earlier.
      if (pausedByMuteRef.current && window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        pausedByMuteRef.current = false;
      }
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    const v = Math.min(1, Math.max(0, volume));
    const next = { ...settingsRef.current, volume: v };
    setSettings(next);
    saveSettings(next);
    if (typeof window === "undefined") return;
    // Web Speech spec says volume changes mid-utterance MAY be ignored — and
    // most browsers DO ignore them (Chrome/Safari/Edge). Workaround: cancel
    // the current utterance and restart it from the last word boundary at the
    // new volume. Debounce 250ms so dragging the slider doesn't thrash.
    if (!currentUtteranceRef.current) return;
    if (volumeRestartTimerRef.current) clearTimeout(volumeRestartTimerRef.current);
    volumeRestartTimerRef.current = setTimeout(() => {
      volumeRestartTimerRef.current = null;
      const text = currentTextRef.current;
      const idx = currentCharIndexRef.current;
      const gender = currentGenderRef.current;
      if (!text || !window.speechSynthesis) return;
      const remaining = text.slice(idx).trim();
      if (!remaining) return;

      // Cancel + clear keepalive
      window.speechSynthesis.cancel();
      if (keepaliveRef.current) {
        clearInterval(keepaliveRef.current);
        keepaliveRef.current = null;
      }
      const chosen = lockedVoiceRef.current[gender];
      if (!chosen) return;

      const utt = new SpeechSynthesisUtterance(remaining);
      utt.voice = chosen;
      utt.lang = chosen.lang || "en-AU";
      utt.rate = 0.95;
      utt.pitch = gender === "female" ? 1.05 : gender === "male" ? 0.95 : 1.0;
      utt.volume = v;

      utt.onstart = () => {
        currentUtteranceRef.current = utt;
        currentTextRef.current = remaining;
        currentCharIndexRef.current = 0;
        keepaliveRef.current = setInterval(() => {
          if (window.speechSynthesis.speaking) {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          }
        }, 8_000);
      };
      utt.onboundary = (ev: SpeechSynthesisEvent) => {
        currentCharIndexRef.current = ev.charIndex ?? 0;
      };
      const done = () => {
        setSpeaking(false);
        currentUtteranceRef.current = null;
        if (keepaliveRef.current) {
          clearInterval(keepaliveRef.current);
          keepaliveRef.current = null;
        }
      };
      utt.onend = done;
      utt.onerror = done;
      window.speechSynthesis.speak(utt);
    }, 250);
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
