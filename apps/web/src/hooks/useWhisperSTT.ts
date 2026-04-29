"use client";
import { useCallback, useEffect, useRef, useState } from "react";

type RecognitionState = "idle" | "recording";

// Same surface area as useSpeechRecognition so we can swap between the two
// without touching any call site. Internally this records 5s WebM/Opus
// chunks via MediaRecorder and ships each chunk to /api/stt/transcribe,
// which forwards to Groq's whisper-large-v3-turbo.
//
// Performance notes:
//   - We don't await each upload — fire and forget, with a small in-flight
//     cap so a temporarily slow Groq response can't pile up an unbounded
//     queue. If > MAX_INFLIGHT chunks are outstanding we drop the new one
//     (the user's next chunk will catch the missing context anyway).
//   - The mic stream is owned by this hook (separate getUserMedia call) so
//     the WebRTC video stream and the STT stream stay independent — pausing
//     STT shouldn't tear down the call.
const CHUNK_MS = 6000;
const MAX_INFLIGHT = 1;
const TRANSCRIBE_URL = "/api/stt/transcribe";

// Exponential backoff bounds when Groq returns rate_limit_exceeded. The chunk
// loop pauses for at least this long before scheduling the next chunk; the
// delay doubles on each consecutive rate-limit hit and resets on first
// successful upload.
const RATE_LIMIT_BACKOFF_INITIAL_MS = 8000;
const RATE_LIMIT_BACKOFF_MAX_MS = 32000;

// Whisper hallucinates dozens of stock phrases on near-silent or noise-only
// audio (a YouTube-ASR training-data artefact). Drop a chunk when EVERY
// sentence inside it matches a known hallucination — that catches both
// "Hello?" alone and "Thank you. Thank you. Thank you." spam.
const WHISPER_HALLUCINATIONS = new Set([
  "thank you", "thanks", "thanks for watching", "thanks for listening",
  "thank you so much", "thank you very much", "thanks again",
  "okay", "ok", "all right", "alright",
  "bye", "goodbye", "see you",
  "you", "yes", "no", "yeah", "yep", "nope",
  "hi", "hello", "hey",
  "so", "well", "um", "uh", "mm-hmm", "mm hmm", "uh-huh", "uh huh",
  "subscribe", "like and subscribe", "please subscribe",
  ".", "...", "?", "!", "♪", "♪♪", "(music)", "(silence)",
]);

function isHallucination(text: string): boolean {
  // Strip outer punctuation, lowercase
  const cleaned = text.trim().toLowerCase().replace(/[.!?,;:]+$/g, "").trim();
  if (!cleaned) return true;
  if (WHISPER_HALLUCINATIONS.has(cleaned)) return true;
  // Split into sentences. If every non-empty sentence is a hallucination,
  // the whole chunk is hallucinated noise (e.g., "Hello? Hello? Hello.").
  const sentences = text
    .split(/[.!?]+/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (sentences.length === 0) return true;
  return sentences.every((s) => WHISPER_HALLUCINATIONS.has(s));
}

// Silence-detection thresholds for the auto-stop behaviour. Time-domain RMS
// of the float waveform; on Mac built-in mics with autoGainControl OFF (see
// getUserMedia constraints below) the waveform is quieter than expected, so
// we use lower thresholds. Speech can dip to ~0.006 RMS during soft consonants;
// silence threshold sits well below room-floor so it only trips on actual
// silence. Bumping these up was a regression that caused the recorder to
// believe a soft-spoken user was silent.
const SILENCE_AMPLITUDE_THRESHOLD = 0.002;
// 1500 ms — tuned for back-and-forth medical-consult cadence. Long enough
// to ride through a thinking pause between sentences, short enough that the
// AI patient doesn't feel sluggish. Anything 3 s+ made every turn feel like
// a long-distance phone call.
const SILENCE_HOLD_MS = 1500;
const VOICE_AMPLITUDE_THRESHOLD = 0.006;

// Pick the first MediaRecorder mime type the browser actually supports.
// Chrome/Android: audio/webm;codecs=opus. iOS Safari 17+: audio/mp4.
function pickMimeType(): string | null {
  if (typeof MediaRecorder === "undefined") return null;
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
  ];
  for (const mime of candidates) {
    try {
      if (MediaRecorder.isTypeSupported(mime)) return mime;
    } catch {
      /* ignore */
    }
  }
  return null;
}

export interface UseWhisperSTTOptions {
  /** Auto-stop the recording when the mic detects sustained silence. */
  autoStopOnSilence?: boolean;
  /** Called when auto-stop fires so the caller can flush the buffer. */
  onAutoStop?: () => void;
  /**
   * Optional external MediaStream to reuse for capture instead of calling
   * `getUserMedia` internally. Required when another part of the page already
   * holds the mic (e.g. a WebRTC `{ video: true, audio: true }` capture in
   * Live Peer RolePlay) — macOS Chrome serializes mic capture and the second
   * `getUserMedia` call returns a silent placeholder track. Pass the stream
   * that owns the real audio track here and the hook will analyse + record
   * from that same track. The hook will NOT stop tracks on this stream
   * during cleanup; the caller retains ownership.
   */
  externalStream?: MediaStream | null;
}

export function useWhisperSTT(
  onTranscript?: (text: string) => void,
  options: UseWhisperSTTOptions = {}
) {
  const [state, setState] = useState<RecognitionState>("idle");
  const [displayTranscript, setDisplayTranscript] = useState("");
  const [supported, setSupported] = useState<boolean | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  // Live RMS of the mic in 0..1 — exposed so the UI can show a level bar.
  // Updated every 200ms by the silence-detection loop.
  const [micLevel, setMicLevel] = useState(0);
  // True when Groq is currently rate-limiting us and we're in backoff. The
  // caller can render a pill so the user knows transcripts are paused.
  const [rateLimited, setRateLimited] = useState(false);
  // True when the mic has been "live" but RMS has stayed near-zero for 5+s.
  // Surfaces an on-screen warning so mobile users (no DevTools) know their
  // mic is silent and can act (refresh, check OS permissions, swap device).
  const [silentTooLong, setSilentTooLong] = useState(false);
  // Most recent raw text Whisper returned for this hook instance, BEFORE the
  // hallucination filter. Surfaced in the UI so phone users (no DevTools)
  // can see what Groq is actually hearing — distinguishes "hallucinations
  // dropped" from "Groq returned empty / network failed".
  const [lastRawText, setLastRawText] = useState("");
  // Total count of successful Groq responses (any text, including filtered
  // hallucinations). Visible counter tells the user the upload pipe works.
  const [chunkCount, setChunkCount] = useState(0);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  // True iff the hook itself created the stream via getUserMedia. When false
  // (caller passed an externalStream), cleanup must NOT stop the tracks —
  // they belong to the caller and tearing them down would kill their WebRTC
  // capture.
  const ownsStreamRef = useRef(false);
  // Latest externalStream from options, mirrored to a ref so async callbacks
  // (startRecording / cleanupStream) can read the current value without being
  // recreated on every change.
  const externalStreamRef = useRef<MediaStream | null>(options.externalStream ?? null);
  const inflightRef = useRef(0);
  // Exponential-backoff bookkeeping for Groq rate_limit_exceeded responses.
  // `nextAllowedAtRef` is a wall-clock timestamp the chunk loop must wait past
  // before scheduling the next recorder; `currentBackoffMsRef` doubles on each
  // consecutive rate-limit and resets on first success.
  const nextAllowedAtRef = useRef<number>(0);
  const currentBackoffMsRef = useRef<number>(RATE_LIMIT_BACKOFF_INITIAL_MS);
  // Peak RMS observed during the in-progress chunk's recording window. The
  // chunk-loop reads + resets this each time a chunk closes so we can decide
  // whether the chunk is silent enough to skip uploading.
  const chunkPeakRmsRef = useRef<number>(0);
  // Keep a ref to the running transcript so we can append without re-rendering
  // for every interim chunk and so we can read it from the recorder closure.
  const fullTranscriptRef = useRef("");
  const onTranscriptRef = useRef(onTranscript);
  const onAutoStopRef = useRef(options.onAutoStop);
  const autoStopOnSilenceRef = useRef(options.autoStopOnSilence ?? false);
  // Web Audio bits for silence detection — created lazily inside startRecording
  // so we don't pay the cost when the caller doesn't enable autoStopOnSilence.
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const silenceCheckRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastVoiceAtRef = useRef<number>(0);
  const hasHeardVoiceRef = useRef<boolean>(false);
  // Wall-clock when startRecording last fired — used to decide when to flip
  // `silentTooLong` on (only after a 5s grace window — startup transient
  // shouldn't trigger the warning).
  const recordingStartedAtRef = useRef<number>(0);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);
  useEffect(() => {
    onAutoStopRef.current = options.onAutoStop;
    autoStopOnSilenceRef.current = options.autoStopOnSilence ?? false;
  }, [options.onAutoStop, options.autoStopOnSilence]);
  useEffect(() => {
    externalStreamRef.current = options.externalStream ?? null;
  }, [options.externalStream]);

  // Capability detection — runs once on mount.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasMediaDevices =
      typeof navigator !== "undefined" &&
      typeof navigator.mediaDevices?.getUserMedia === "function";
    const hasRecorder = typeof window.MediaRecorder !== "undefined";
    const hasMime = pickMimeType() !== null;
    setSupported(hasMediaDevices && hasRecorder && hasMime);
  }, []);

  const uploadChunk = useCallback(async (blob: Blob) => {
    if (blob.size === 0) {
      console.info("[whisper] empty chunk, skip");
      return;
    }
    // A WebM header alone is ~18-32 bytes; one second of Opus audio is at
    // least ~6 KB. Anything under 1 KB is a header-only artefact from a
    // recorder that was stopped within milliseconds of starting (race with
    // silence-detection auto-stop). Skip — Whisper rejects them with a 400.
    if (blob.size < 1024) {
      console.info("[whisper] tiny chunk, skip", { bytes: blob.size });
      return;
    }
    if (inflightRef.current >= MAX_INFLIGHT) {
      console.warn("[whisper] back-pressure: dropping chunk", { inflight: inflightRef.current });
      return;
    }
    inflightRef.current += 1;
    const form = new FormData();
    form.append("audio", blob, "chunk.webm");
    console.info("[whisper] uploading chunk", { bytes: blob.size, type: blob.type });
    try {
      const res = await fetch(TRANSCRIBE_URL, { method: "POST", body: form });
      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        console.warn("[whisper] /api/stt/transcribe non-OK", { status: res.status, body: errText });
        // Detect Groq rate-limit. The /api/stt/transcribe route wraps Groq's
        // 429 as a 502 with the upstream error string embedded; we look for
        // either the literal `rate_limit_exceeded` token or a 429.
        const looksRateLimited =
          (res.status === 502 || res.status === 429) &&
          /rate_limit_exceeded/i.test(errText);
        if (looksRateLimited) {
          // Schedule the chunk loop to pause for the current backoff window
          // and then double the backoff (capped) for the next consecutive
          // rate-limit. The loop reads nextAllowedAtRef before kicking off
          // the next recorder.
          const wait = currentBackoffMsRef.current;
          nextAllowedAtRef.current = Date.now() + wait;
          currentBackoffMsRef.current = Math.min(
            currentBackoffMsRef.current * 2,
            RATE_LIMIT_BACKOFF_MAX_MS
          );
          setRateLimited(true);
          console.warn("[whisper] rate limit — backing off", { waitMs: wait, nextBackoffMs: currentBackoffMsRef.current });
        }
        return;
      }
      // Successful upload — clear rate-limit state and reset the backoff so
      // the next 502/429 starts again from the initial window.
      if (currentBackoffMsRef.current !== RATE_LIMIT_BACKOFF_INITIAL_MS || nextAllowedAtRef.current !== 0) {
        currentBackoffMsRef.current = RATE_LIMIT_BACKOFF_INITIAL_MS;
        nextAllowedAtRef.current = 0;
        setRateLimited(false);
      }
      const payload = (await res.json()) as { text?: string };
      const text = (payload.text ?? "").trim();
      console.info("[whisper] chunk transcribed", { text });
      setChunkCount((c) => c + 1);
      setLastRawText(text);
      if (!text) return;
      // Skip Whisper's well-known hallucinations on silent/noise-only chunks
      // ("Thank you.", "Okay.", "Bye.", etc) — they pollute the transcript
      // and trigger false sendMessage calls.
      if (isHallucination(text)) {
        console.info("[whisper] hallucination filtered", { text });
        return;
      }
      fullTranscriptRef.current = (
        fullTranscriptRef.current
          ? `${fullTranscriptRef.current} ${text}`
          : text
      ).trim();
      setDisplayTranscript(fullTranscriptRef.current);
      onTranscriptRef.current?.(text);
    } catch (err) {
      console.warn("[whisper] upload failed", err);
    } finally {
      inflightRef.current = Math.max(0, inflightRef.current - 1);
    }
  }, []);

  const teardownSilenceDetection = useCallback(() => {
    if (silenceCheckRef.current) {
      clearInterval(silenceCheckRef.current);
      silenceCheckRef.current = null;
    }
    try {
      analyserRef.current?.disconnect();
    } catch {
      /* ignore */
    }
    analyserRef.current = null;
    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      void audioCtxRef.current.close().catch(() => {});
    }
    audioCtxRef.current = null;
    hasHeardVoiceRef.current = false;
  }, []);

  const cleanupStream = useCallback(() => {
    teardownSilenceDetection();
    // Only stop tracks the hook itself created. When an externalStream is in
    // use the caller retains ownership — stopping its tracks would kill their
    // WebRTC capture too.
    if (ownsStreamRef.current) {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    }
    streamRef.current = null;
    ownsStreamRef.current = false;
  }, [teardownSilenceDetection]);

  // Are we still in "user wants to record" state? Used by the chunk loop.
  const wantRecordingRef = useRef(false);
  const chunkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Spin up ONE recorder for ONE chunk, stop it after CHUNK_MS, upload the
  // complete WebM blob, then if the user still wants to record, recurse.
  // Why this pattern instead of `recorder.start(timeslice)`: MediaRecorder's
  // timeslice mode emits the WebM container header in the FIRST chunk only;
  // every subsequent chunk is raw continuation bytes that Groq rejects with
  // "could not process file — is it a valid media file?". Stop+restart per
  // chunk means every Blob is a standalone, valid WebM file.
  const startChunkLoop = useCallback((stream: MediaStream, mime: string) => {
    if (!wantRecordingRef.current) return;
    let recorder: MediaRecorder;
    try {
      // 96 kbps Opus is well above the default ~32 kbps and gives Whisper a
      // much clearer signal — soft consonants survive the encode, which is
      // the difference between "I have chest pain" being transcribed
      // correctly vs Whisper hallucinating "Thank you." on a smeared input.
      recorder = new MediaRecorder(stream, { mimeType: mime, audioBitsPerSecond: 96000 });
    } catch {
      setSupported(false);
      return;
    }

    let chunkData: Blob | null = null;
    recorder.ondataavailable = (ev: BlobEvent) => {
      if (ev.data && ev.data.size > 0) chunkData = ev.data;
    };
    recorder.onerror = () => {
      setState("idle");
      cleanupStream();
      recorderRef.current = null;
      wantRecordingRef.current = false;
    };
    recorder.onstop = () => {
      // Read + reset the per-chunk peak RMS so the next chunk starts fresh.
      const peakRms = chunkPeakRmsRef.current;
      chunkPeakRmsRef.current = 0;
      // VAD-skip: if the user was below voice threshold the entire chunk,
      // it's silence/ambient noise — skip uploading to avoid burning Groq
      // rate-limit budget on hallucinations like "Thank you." / "Hello?".
      const isSilentChunk = peakRms < VOICE_AMPLITUDE_THRESHOLD;
      if (chunkData && !isSilentChunk) {
        void uploadChunk(chunkData);
      } else if (chunkData && isSilentChunk) {
        console.info("[whisper] VAD-skip silent chunk", { peakRms: peakRms.toFixed(4) });
      }
      // If Groq rate-limited us, defer the next chunk start until the
      // backoff window elapses; otherwise recurse immediately.
      if (wantRecordingRef.current && streamRef.current) {
        const waitMs = Math.max(0, nextAllowedAtRef.current - Date.now());
        if (waitMs > 0) {
          setTimeout(() => {
            if (wantRecordingRef.current && streamRef.current) {
              startChunkLoop(streamRef.current, mime);
            }
          }, waitMs);
        } else {
          startChunkLoop(streamRef.current, mime);
        }
      } else {
        setState("idle");
        cleanupStream();
        recorderRef.current = null;
      }
    };

    try {
      recorder.start();
      recorderRef.current = recorder;
      // Schedule the stop after CHUNK_MS to cap the chunk size.
      chunkTimerRef.current = setTimeout(() => {
        chunkTimerRef.current = null;
        try {
          if (recorder.state === "recording") recorder.stop();
        } catch {
          /* ignore */
        }
      }, CHUNK_MS);
    } catch {
      cleanupStream();
      recorderRef.current = null;
      wantRecordingRef.current = false;
      setState("idle");
    }
  }, [cleanupStream, uploadChunk]);

  const startRecording = useCallback(async () => {
    if (recorderRef.current) return;
    const mime = pickMimeType();
    if (!mime) {
      setSupported(false);
      return;
    }

    let stream: MediaStream;
    if (externalStreamRef.current) {
      // External-stream mode (Live Peer RolePlay): reuse the WebRTC capture
      // stream so we don't double-call getUserMedia. macOS Chrome serializes
      // mic capture and would otherwise hand us a silent placeholder track.
      // The caller owns these tracks; we MUST NOT stop them in cleanup.
      const externalStream = externalStreamRef.current;
      const audioTracks = externalStream.getAudioTracks();
      if (audioTracks.length === 0) {
        console.warn("[whisper] externalStream has no audio track — cannot record");
        return;
      }
      stream = externalStream;
      ownsStreamRef.current = false;
    } else {
      try {
        // Keep echoCancellation TRUE in all modes — it's the only thing
        // preventing partner audio (Live mode) or TTS playback (solo modes)
        // bleeding into the mic and causing Whisper to transcribe the other
        // side's words as if the user said them.
        //
        // Default Chrome AEC pipeline expects all three flags ON together —
        // disabling AGC + NS while keeping EC on ducks the mic to ~zero on
        // macOS Chrome (mic level reads 0.0000 in the analyser). Letting
        // Chrome manage all three produces a usable signal AND keeps
        // partner/TTS bleed cancelled. Hallucinations are handled separately
        // by the WHISPER_HALLUCINATIONS filter + per-chunk VAD-skip.
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        ownsStreamRef.current = true;
      } catch (err) {
        const name = (err as { name?: string } | null)?.name;
        if (name === "NotAllowedError" || name === "SecurityError") {
          setPermissionDenied(true);
        }
        return;
      }
    }

    streamRef.current = stream;
    fullTranscriptRef.current = "";
    setDisplayTranscript("");
    wantRecordingRef.current = true;
    setState("recording");
    setSilentTooLong(false);
    recordingStartedAtRef.current = Date.now();

    // Diagnostic: print which device + track state Chrome handed us. When the
    // mic is "silently silent" (rms 0.0000 forever) this is the only way to
    // tell whether the OS muted us, the device is virtual/placeholder, or the
    // browser handed back a track that's `muted: true`.
    try {
      const t = stream.getAudioTracks()[0];
      if (t) {
        const settings = typeof t.getSettings === "function" ? t.getSettings() : {};
        console.info("[whisper] mic track ready", {
          label: t.label,
          muted: t.muted,
          enabled: t.enabled,
          readyState: t.readyState,
          deviceId: (settings as { deviceId?: string }).deviceId,
          sampleRate: (settings as { sampleRate?: number }).sampleRate,
          channelCount: (settings as { channelCount?: number }).channelCount,
        });
        // Surface browser-side mute toggles into the UI immediately. (User
        // muted at OS / hardware key level — they'll never see RMS rise.)
        if (t.muted) {
          console.warn("[whisper] track is muted by the browser/OS — user must unmute");
        }
      }
    } catch (err) {
      console.warn("[whisper] track diagnostic failed", err);
    }

    // Always run an RMS analyser loop while recording — even when the caller
    // hasn't enabled `autoStopOnSilence`. The auto-stop branch is gated by
    // `autoStopOnSilenceRef.current` below, but we still need per-chunk peak
    // RMS so the chunk loop can skip uploading silent chunks (Live mode VAD
    // gating, to keep us off Groq's whisper rate limit).
    try {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (Ctor) {
        const ctx = new Ctor();
        // Some browsers start AudioContext "suspended" until a user gesture
        // resumes it. We're already inside startRecording (called from a
        // click handler), so resume immediately.
        if (ctx.state === "suspended") {
          void ctx.resume().catch(() => {});
        }
        const src = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 2048;
        src.connect(analyser);
        audioCtxRef.current = ctx;
        analyserRef.current = analyser;
        // Use TIME-DOMAIN amplitude (Float32, ~-1..1) for an RMS energy
        // signal — far more reliable than frequency-bin averages and
        // independent of pitch.
        const timeBuf = new Float32Array(analyser.fftSize);
        lastVoiceAtRef.current = Date.now();
        hasHeardVoiceRef.current = false;
        chunkPeakRmsRef.current = 0;
        let lastDebugAt = 0;
        silenceCheckRef.current = setInterval(() => {
          if (!analyserRef.current) return;
          analyserRef.current.getFloatTimeDomainData(timeBuf);
          let sumSq = 0;
          for (let i = 0; i < timeBuf.length; i++) {
            sumSq += timeBuf[i] * timeBuf[i];
          }
          const rms = Math.sqrt(sumSq / timeBuf.length);
          setMicLevel(rms);
          // Track the peak RMS seen during the in-progress chunk so the
          // chunk loop can decide whether to skip uploading. Reset by the
          // chunk loop after each chunk closes.
          if (rms > chunkPeakRmsRef.current) chunkPeakRmsRef.current = rms;
          const now = Date.now();
          if (now - lastDebugAt > 1000) {
            lastDebugAt = now;
            console.info("[whisper] mic level", { rms: rms.toFixed(4), heardVoice: hasHeardVoiceRef.current });
          }
          if (rms > VOICE_AMPLITUDE_THRESHOLD) {
            lastVoiceAtRef.current = now;
            hasHeardVoiceRef.current = true;
            setSilentTooLong(false);
          } else if (
            !hasHeardVoiceRef.current &&
            recordingStartedAtRef.current > 0 &&
            now - recordingStartedAtRef.current > 5000 &&
            rms < SILENCE_AMPLITUDE_THRESHOLD
          ) {
            // 5+ seconds since startRecording AND we have NEVER seen a voice
            // amplitude pop. Mic is almost certainly muted at the OS level,
            // pointed at a dead/virtual device, or the user revoked permission.
            // Surface to the UI so phone users (no DevTools) can act.
            setSilentTooLong(true);
          } else if (
            autoStopOnSilenceRef.current &&
            hasHeardVoiceRef.current &&
            rms < SILENCE_AMPLITUDE_THRESHOLD &&
            now - lastVoiceAtRef.current > SILENCE_HOLD_MS
          ) {
            console.info("[whisper] silence auto-stop fired", { rms: rms.toFixed(4) });
            if (silenceCheckRef.current) {
              clearInterval(silenceCheckRef.current);
              silenceCheckRef.current = null;
            }
            onAutoStopRef.current?.();
          }
        }, 200);
      }
    } catch (err) {
      console.warn("[whisper] analyser setup failed", err);
    }

    startChunkLoop(stream, mime);
  }, [cleanupStream, startChunkLoop]);

  const stopRecording = useCallback(async (): Promise<string> => {
    // Tell the chunk loop to stop recurring after the current chunk uploads.
    wantRecordingRef.current = false;
    if (chunkTimerRef.current) {
      clearTimeout(chunkTimerRef.current);
      chunkTimerRef.current = null;
    }
    const recorder = recorderRef.current;
    if (!recorder) {
      cleanupStream();
      return fullTranscriptRef.current.trim();
    }
    // Force any buffered audio < CHUNK_MS old to fire ondataavailable before
    // we stop. Without this, a 2-3s utterance produces zero chunks because
    // the timeslice never elapsed.
    try {
      if (recorder.state === "recording") {
        recorder.requestData();
      }
    } catch (err) {
      console.warn("[whisper] requestData() failed", err);
    }
    try {
      if (recorder.state !== "inactive") recorder.stop();
    } catch {
      /* ignore */
    }
    // Wait for all in-flight uploads to settle (with a hard cap so we never
    // hang forever on a stuck request). Whisper rarely takes > 5s for a 5s
    // chunk, but the 10s cap protects against network outages.
    const start = Date.now();
    while (inflightRef.current > 0 && Date.now() - start < 10_000) {
      await new Promise((r) => setTimeout(r, 100));
    }
    const final = fullTranscriptRef.current.trim();
    console.info("[whisper] stopRecording — flushed", { final, leftInflight: inflightRef.current });
    return final;
  }, [cleanupStream]);

  // Belt and braces: if the component unmounts while recording, drop the
  // mic so the indicator goes away on Android Chrome. Same ownership rule
  // as cleanupStream — only stop tracks the hook created.
  useEffect(() => {
    return () => {
      try {
        if (recorderRef.current && recorderRef.current.state !== "inactive") {
          recorderRef.current.stop();
        }
      } catch {
        /* ignore */
      }
      if (ownsStreamRef.current) {
        streamRef.current?.getTracks().forEach((t) => t.stop());
      }
      recorderRef.current = null;
      streamRef.current = null;
      ownsStreamRef.current = false;
    };
  }, []);

  return {
    state,
    displayTranscript,
    supported,
    permissionDenied,
    startRecording,
    stopRecording,
    micLevel,
    rateLimited,
    silentTooLong,
    lastRawText,
    chunkCount,
  };
}
