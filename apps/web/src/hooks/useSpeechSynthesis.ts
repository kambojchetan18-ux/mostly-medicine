"use client";
import { useState, useRef, useEffect, useCallback } from "react";

type Gender = "male" | "female" | "unknown";

const SETTINGS_KEY = "mm:tts-settings";
const DEFAULT_VOLUME = 1.0;

// A 0-sample silent WAV. Played (muted) inside the first user gesture to
// "bless" the shared <audio> element so later async .play() calls — which fire
// from stream handlers, outside any gesture — are allowed on mobile browsers.
const SILENT_WAV =
  "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=";

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

// Strip markdown + stage directions + smart punctuation so neither the cloud
// voice nor the native engine reads "asterisk" / "open quote" out loud.
function stripForSpeech(text: string): string {
  return text
    // Normalise Unicode smart quotes / dashes. Some Chromium voices read curly
    // apostrophes ('I'm') as the literal word "apostrophe"; straight ASCII (')
    // is read silently as a contraction, which is the natural reading.
    .replace(/[‘’‚‛]/g, "'")
    .replace(/[“”„‟]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/[…]/g, "...")
    // Strip any stray HTML / SSML-ish tags (Claude occasionally emits <break>
    // or <emphasis> if it thinks the channel supports it).
    .replace(/<[^>]+>/g, "")
    .replace(/\*\*([^*\n]+)\*\*/g, "$1")
    .replace(/__([^_\n]+)__/g, "$1")
    .replace(/\*[^*\n]+\*/g, "")
    .replace(/_[^_\n]+_/g, "")
    .replace(/\([^)\n]+\)/g, "")
    .replace(/\[[^\]\n]+\]/g, "")
    .replace(/[`#>~]+/g, "")
    // Strip quote marks that some Chromium voices announce literally ("double
    // quote", "open quote"). Straight apostrophes survive — they're needed for
    // natural contraction pronunciation.
    .replace(/["«»]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// Hardcoded en-AU voice name → gender lookup. Names below are the literal
// strings that macOS / iOS / Android Chrome expose for Australian voices.
const FEMALE_AU_NAMES = [
  "Karen",
  "Catherine",
  "Olivia",
  "Samantha (en-AU)",
  "Google Australian English Female",
];
const MALE_AU_NAMES = [
  "Lee",
  "Gordon",
  "Daniel (en-AU)",
  "Google Australian English Male",
];

function voiceMatchesGender(v: SpeechSynthesisVoice, gender: Gender): boolean {
  if (gender === "unknown") return false;
  const list = gender === "female" ? FEMALE_AU_NAMES : MALE_AU_NAMES;
  if (list.includes(v.name)) return true;
  // Fall back to a "Female"/"Male" substring hint in the voice name.
  const needle = gender === "female" ? "female" : "male";
  return new RegExp(`\\b${needle}\\b`, "i").test(v.name);
}

function isLangAU(v: SpeechSynthesisVoice): boolean {
  return /^en[-_]AU$/i.test(v.lang);
}

function isLangGB(v: SpeechSynthesisVoice): boolean {
  return /^en[-_]GB$/i.test(v.lang);
}

// Tiered preference (strictly in this order):
//   1) en-AU voice matching the requested gender
//   2) any en-AU voice
//   3) en-GB voice matching the requested gender
//   4) first available voice (whatever the engine hands back)
function selectVoice(
  voices: readonly SpeechSynthesisVoice[],
  gender: Gender,
): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;
  const tier1 = voices.find((v) => isLangAU(v) && voiceMatchesGender(v, gender));
  if (tier1) return tier1;
  const tier2 = voices.find(isLangAU);
  if (tier2) return tier2;
  const tier3 = voices.find((v) => isLangGB(v) && voiceMatchesGender(v, gender));
  if (tier3) return tier3;
  return voices[0] ?? null;
}

export function useSpeechSynthesis() {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const [settings, setSettings] = useState<TtsSettings>(() => ({ muted: false, volume: DEFAULT_VOLUME }));
  const keepaliveRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  // ── Cloud TTS (ElevenLabs via /api/tts) — the preferred path ───────────────
  // A single reused <audio> element plays the streamed MP3. Web Speech is the
  // fallback when the cloud route is unavailable (503 kill-switch / plan gate)
  // or a play() is blocked by the autoplay policy.
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cloudDisabledRef = useRef(false); // sticky once we learn cloud is off
  const usingCloudRef = useRef(false); // is the current playback cloud audio?
  const fetchAbortRef = useRef<AbortController | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  // Lock the chosen voice per gender within a session so it doesn't randomly
  // swap between turns. Voices reload async in some browsers and sort
  // ordering can shift, which is what was causing voice drift.
  const lockedVoiceRef = useRef<Partial<Record<Gender, SpeechSynthesisVoice>>>({});

  // Cache the voices list. speechSynthesis.getVoices() is async on Chrome —
  // first call may return []. We refresh this ref whenever `voiceschanged`
  // fires so pickVoice() always sees the freshest list synchronously.
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

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

  function revokeObjectUrl() {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }

  // Lazily create + wire the shared <audio> element.
  const ensureAudioEl = useCallback((): HTMLAudioElement | null => {
    if (typeof window === "undefined" || typeof Audio === "undefined") return null;
    if (audioRef.current) return audioRef.current;
    const el = new Audio();
    el.preload = "auto";
    el.onended = () => {
      setSpeaking(false);
      usingCloudRef.current = false;
      revokeObjectUrl();
    };
    el.onerror = () => {
      setSpeaking(false);
      usingCloudRef.current = false;
    };
    audioRef.current = el;
    return el;
  }, []);

  // Stop any in-flight cloud TTS fetch + playback.
  const stopCloud = useCallback(() => {
    if (fetchAbortRef.current) {
      fetchAbortRef.current.abort();
      fetchAbortRef.current = null;
    }
    const el = audioRef.current;
    if (el) {
      try {
        el.pause();
        el.currentTime = 0;
      } catch {
        /* ignore */
      }
    }
    usingCloudRef.current = false;
    revokeObjectUrl();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Supported if EITHER path is available. In practice every target browser
    // has both Web Speech and <audio>, so this is effectively always true.
    setSupported(!!window.speechSynthesis || typeof Audio !== "undefined");
    setSettings(loadSettings());
    if (window.speechSynthesis) {
      // Seed the cached voices synchronously, then refresh on `voiceschanged`.
      voicesRef.current = window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        voicesRef.current = window.speechSynthesis.getVoices();
      };
    }
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = null;
      // Hard-stop any in-flight speech on unmount — without this, navigating
      // away from a roleplay page lets the patient keep talking in the
      // background (both Web Speech and the <audio> element are document-global).
      try {
        window.speechSynthesis?.cancel();
      } catch {
        /* ignore */
      }
      stopCloud();
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
  }, [stopCloud]);

  // Belt-and-braces — also stop speech if the page is hidden / unloaded.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stopAll = () => {
      try {
        window.speechSynthesis?.cancel();
      } catch {
        /* ignore */
      }
      stopCloud();
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
  }, [stopCloud]);

  function pickVoice(gender: Gender): SpeechSynthesisVoice | null {
    if (!window.speechSynthesis) return null;
    // Reuse the locked voice if we already chose one for this gender.
    const existing = lockedVoiceRef.current[gender];
    if (existing) return existing;
    // Prefer the cached list, but fall back to a fresh getVoices() call in
    // case the hook ran before `voiceschanged` had a chance to fire.
    const voices =
      voicesRef.current.length > 0
        ? voicesRef.current
        : window.speechSynthesis.getVoices();
    if (voices.length === 0) return null;
    const chosen = selectVoice(voices, gender);
    if (chosen) {
      lockedVoiceRef.current[gender] = chosen;
      if (process.env.NODE_ENV !== "production") {
        console.log("[tts] picked voice:", chosen.name, chosen.lang);
      }
    }
    return chosen;
  }

  // Mobile Chrome / iOS Safari require speechSynthesis.speak() AND
  // HTMLAudioElement.play() to be first triggered inside a user gesture.
  // Async stream responses arrive AFTER the gesture token expires, so we prime
  // BOTH engines synchronously during the user's click.
  //
  // For Web Speech: a tiny silent utterance. (We deliberately do NOT cancel()
  // it — on Chromium cancel() tears down synthesis state and the next speak(),
  // no longer in a gesture, gets rejected.)
  // For the <audio> element: play a muted 0-sample WAV to bless it.
  const primedRef = useRef(false);
  const prime = useCallback(() => {
    if (typeof window === "undefined") return;
    if (primedRef.current) return;
    primedRef.current = true;
    try {
      if (window.speechSynthesis) {
        const u = new SpeechSynthesisUtterance(" ");
        u.volume = 0;
        u.rate = 10;
        window.speechSynthesis.speak(u);
      }
    } catch {
      /* ignore */
    }
    try {
      const el = ensureAudioEl();
      if (el) {
        el.muted = true;
        el.src = SILENT_WAV;
        el.play()
          .then(() => {
            el.pause();
            el.currentTime = 0;
            el.muted = false;
          })
          .catch(() => {
            el.muted = false;
          });
      }
    } catch {
      /* ignore */
    }
  }, [ensureAudioEl]);

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
    stopCloud();
    window.speechSynthesis?.cancel();
    currentUtteranceRef.current = null;
    pausedByMuteRef.current = false;
    setSpeaking(false);
  }, [stopCloud]);

  // ── Native Web Speech path (fallback) ──────────────────────────────────────
  const speakNative = useCallback(
    (text: string, gender: Gender) => {
      if (typeof window === "undefined" || !window.speechSynthesis) return;
      if (settingsRef.current.muted) return;

      if (pendingRef.current) {
        clearTimeout(pendingRef.current);
        pendingRef.current = null;
      }
      if (keepaliveRef.current) {
        clearInterval(keepaliveRef.current);
        keepaliveRef.current = null;
      }
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
        speakWithVoice(chosen);
      };
      const speakWithVoice = (chosen: SpeechSynthesisVoice) => {
        const speakable = stripForSpeech(text);
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

          const isFirst = i === 0;
          const isLast = i === chunks.length - 1;
          utterance.onstart = () => {
            if (isFirst) setSpeaking(true);
            currentUtteranceRef.current = utterance;
          };
          utterance.onboundary = (ev: SpeechSynthesisEvent) => {
            currentCharIndexRef.current = ev.charIndex ?? 0;
          };
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

      trySpeak();
    },
    [],
  );

  // ── Cloud path (preferred). Resolves true if it played (or was superseded),
  //    false if the caller should fall back to native for this utterance. ─────
  const speakCloud = useCallback(
    async (text: string, gender: Gender): Promise<boolean> => {
      if (typeof window === "undefined") return false;
      const speakable = stripForSpeech(text);
      if (!speakable) return false;

      // Supersede any in-flight TTS fetch.
      fetchAbortRef.current?.abort();
      const ac = new AbortController();
      fetchAbortRef.current = ac;

      let res: Response;
      try {
        res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: speakable, gender }),
          signal: ac.signal,
        });
      } catch (e) {
        // A newer speak() aborted us — it owns playback now, don't fall back.
        if (e instanceof DOMException && e.name === "AbortError") return true;
        return false;
      }

      // 503 = not configured / kill-switch, 403 = plan gate. Both are sticky:
      // stop paying the round-trip and use native from here on.
      if (res.status === 503 || res.status === 403) {
        cloudDisabledRef.current = true;
        return false;
      }
      if (!res.ok) return false;

      let blob: Blob;
      try {
        blob = await res.blob();
      } catch {
        return false;
      }
      if (ac.signal.aborted) return true; // superseded
      if (blob.size === 0) return false;

      const el = ensureAudioEl();
      if (!el) return false;
      revokeObjectUrl();
      const url = URL.createObjectURL(blob);
      objectUrlRef.current = url;
      el.src = url;
      el.muted = false;
      el.volume = settingsRef.current.volume;
      currentGenderRef.current = gender;

      try {
        usingCloudRef.current = true;
        await el.play();
        setSpeaking(true);
        return true;
      } catch {
        // Autoplay/gesture blocked → let native take this one.
        usingCloudRef.current = false;
        revokeObjectUrl();
        return false;
      }
    },
    [ensureAudioEl],
  );

  const speak = useCallback(
    (text: string, gender: Gender) => {
      if (!supported || typeof window === "undefined") return;
      // Mute = swallow new audio entirely.
      if (settingsRef.current.muted) return;

      // Tear down whatever is currently playing before starting the new turn.
      stopCloud();

      if (cloudDisabledRef.current) {
        speakNative(text, gender);
        return;
      }
      // Try the cloud voice; fall back to native if it can't play this turn.
      speakCloud(text, gender).then((ok) => {
        if (!ok) speakNative(text, gender);
      });
    },
    [supported, stopCloud, speakCloud, speakNative],
  );

  const setMuted = useCallback((muted: boolean) => {
    const next = { ...settingsRef.current, muted };
    setSettings(next);
    saveSettings(next);
    if (typeof window === "undefined") return;
    if (muted) {
      // Pause (don't cancel) so we can resume on unmute.
      if (usingCloudRef.current && audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        pausedByMuteRef.current = true;
      } else if (window.speechSynthesis?.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        pausedByMuteRef.current = true;
      }
    } else if (pausedByMuteRef.current) {
      // Resume whichever engine we paused.
      if (usingCloudRef.current && audioRef.current) {
        audioRef.current.play().catch(() => {});
      } else if (window.speechSynthesis?.paused) {
        window.speechSynthesis.resume();
      }
      pausedByMuteRef.current = false;
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    const v = Math.min(1, Math.max(0, volume));
    const next = { ...settingsRef.current, volume: v };
    setSettings(next);
    saveSettings(next);
    if (typeof window === "undefined") return;

    // Cloud <audio> supports instant volume changes — no restart trickery.
    if (usingCloudRef.current && audioRef.current) {
      audioRef.current.volume = v;
      return;
    }

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
