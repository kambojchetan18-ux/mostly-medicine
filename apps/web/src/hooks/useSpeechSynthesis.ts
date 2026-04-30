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
    if (best) {
      lockedVoiceRef.current[gender] = best;
      console.info("[tts] picked voice", { name: best.name, lang: best.lang, default: best.default, localService: best.localService });
    } else {
      console.warn("[tts] no voice available", { totalVoices: voices.length });
    }
    return best ?? null;
  }

  // Mobile Chrome / iOS Safari require speechSynthesis.speak() to be called
  // inside a user gesture (button click / tap). Async streaming responses
  // arrive AFTER the gesture token has expired, so the actual patient reply
  // speak() is silently rejected. Workaround: call a tiny silent utterance
  // synchronously during the user's click — this primes the engine so later
  // speak() calls (from async stream handlers) are permitted.
  //
  // Earlier we cancelled() right after speak() to "clean up". That cancel
  // works on Safari/WebKit but on Chromium (Chrome, Edge, Comet, Brave) it
  // tears down the synthesis state, so the next speak() — which is no
  // longer inside a user gesture — gets rejected. The patient stays silent.
  // Fix: do NOT cancel; let the silent utterance complete on its own
  // (rate=10 + " " finishes in <100ms anyway).
  const primedRef = useRef(false);
  const prime = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (primedRef.current) return;
    try {
      const u = new SpeechSynthesisUtterance(" ");
      u.volume = 0;
      u.rate = 10;
      window.speechSynthesis.speak(u);
      primedRef.current = true;
    } catch {
      /* ignore */
    }
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
      // ONLY cancel if we own a current real utterance. Earlier we cancelled
      // whenever speaking|pending was true — but a prime() silent utterance
      // sits in `pending` momentarily, and Chromium's cancel() then races
      // with the queued real utterance and fires 'canceled' on it (this was
      // the actual symptom: chunkIndex 0 of the patient reply got error
      // 'canceled' before audio started). Safari ignored the race.
      if (currentUtteranceRef.current) {
        window.speechSynthesis.cancel();
      }
      setSpeaking(false);

      let attempts = 0;
      const trySpeak = () => {
        pendingRef.current = null;
        if (!window.speechSynthesis) return;

        // Chromium will sometimes leave the engine "paused" after a stray
        // cancel from a previous page (visibility change, navigation, etc).
        // A defensive resume() before each speak makes the queue ingestible.
        try {
          if (window.speechSynthesis.paused) window.speechSynthesis.resume();
        } catch {
          /* ignore */
        }

        const chosen = pickVoice(gender);
        if (!chosen) {
          // Mobile Chrome / Android: getVoices() is empty until onvoiceschanged
          // fires. Retry up to 1.5s before giving up so the patient still talks.
          if (attempts < 15) {
            attempts++;
            pendingRef.current = setTimeout(trySpeak, 100);
          }
          return;
        }
        console.info("[tts] speak", {
          textLen: text.length,
          gender,
          paused: window.speechSynthesis.paused,
          speaking: window.speechSynthesis.speaking,
          pending: window.speechSynthesis.pending,
          primed: primedRef.current,
        });
        speakWithVoice(chosen);
      };
      const speakWithVoice = (chosen: SpeechSynthesisVoice) => {

        // Strip markdown + stage directions before speaking.
        const speakable = text
          // Normalise Unicode smart quotes / dashes BEFORE the strip+chunk
          // pipeline. Some Chromium voices read curly apostrophes ('I'm')
          // as the literal word "apostrophe" — straight ASCII (') is read
          // silently as a contraction, which is the natural reading.
          .replace(/[‘’‚‛]/g, "'")
          .replace(/[“”„‟]/g, '"')
          .replace(/[–—]/g, "-")
          .replace(/[…]/g, "...")
          // Strip any stray HTML / SSML-ish tags (Claude occasionally emits
          // <break> or <emphasis> if it thinks the channel supports it).
          .replace(/<[^>]+>/g, "")
          .replace(/\*\*([^*\n]+)\*\*/g, "$1")
          .replace(/__([^_\n]+)__/g, "$1")
          .replace(/\*[^*\n]+\*/g, "")
          .replace(/_[^_\n]+_/g, "")
          .replace(/\([^)\n]+\)/g, "")
          .replace(/\[[^\]\n]+\]/g, "")
          .replace(/[`#>~]+/g, "")
          // Strip quote marks that some Chromium voices announce literally
          // ("double quote", "open quote"). Straight apostrophes survive —
          // they're needed for natural contraction pronunciation.
          .replace(/["«»]/g, "")
          .replace(/\s{2,}/g, " ")
          .trim();
        if (!speakable) return;

        // Chunk into sentences. Mobile Chrome stops speaking after ~15s and
        // the pause/resume keepalive trick is unreliable on Android. Queueing
        // multiple short utterances avoids the timeout entirely.
        const chunks =
          (speakable.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g) ?? [speakable])
            .map((c) => c.trim())
            // Drop chunks that are only punctuation/symbols — TTS engines
            // sometimes pronounce these literally ("apostrophe", "period").
            // A real chunk has at least one alphanumeric character.
            .filter((c) => c && /[a-zA-Z0-9]/.test(c));
        if (chunks.length === 0) return;

        currentTextRef.current = speakable;
        currentCharIndexRef.current = 0;
        currentGenderRef.current = gender;

        chunks.forEach((chunk, i) => {
          const utterance = new SpeechSynthesisUtterance(chunk);
          utterance.voice = chosen;
          utterance.lang = chosen.lang || "en-AU";
          utterance.rate = 0.95;
          utterance.pitch = gender === "female" ? 1.05 : gender === "male" ? 0.95 : 1.0;
          utterance.volume = settingsRef.current.volume;

          // First chunk owns the speaking-state flip. Earlier code overrode
          // this onstart in the else-branch below, which silently dropped
          // the setSpeaking(true) for any multi-chunk reply.
          const isFirst = i === 0;
          const isLast = i === chunks.length - 1;
          utterance.onstart = () => {
            if (isFirst) setSpeaking(true);
            currentUtteranceRef.current = utterance;
          };
          utterance.onboundary = (ev: SpeechSynthesisEvent) => {
            currentCharIndexRef.current = ev.charIndex ?? 0;
          };
          // Surface failures on EVERY chunk — silent rejection (mobile
          // gesture-token expired, voice not ready, etc) is the #1 reason
          // people report "no patient voice". The console.warn lets us
          // diagnose remotely.
          utterance.onerror = (ev: SpeechSynthesisErrorEvent) => {
            console.warn("[tts] utterance error", { chunkIndex: i, chunk, error: ev.error });
            if (isLast) {
              setSpeaking(false);
              currentUtteranceRef.current = null;
            }
          };
          if (isLast) {
            utterance.onend = () => {
              setSpeaking(false);
              currentUtteranceRef.current = null;
            };
          }

          window.speechSynthesis.speak(utterance);
        });
      };

      // Try synchronously first — on Chromium this preserves the user-
      // gesture activation chain primed seconds earlier. If voices aren't
      // ready yet we'll fall through to the trySpeak retry loop's setTimeout.
      trySpeak();
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
    prime,
    supported,
    muted: settings.muted,
    volume: settings.volume,
    setMuted,
    setVolume,
  };
}
