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
const CHUNK_MS = 5000;
const MAX_INFLIGHT = 3;
const TRANSCRIBE_URL = "/api/stt/transcribe";

// Silence-detection thresholds for the auto-stop behaviour. Time-domain RMS
// of the float waveform; speech on quiet mics can be as low as 0.01–0.02
// (laptop mic at 30cm), so be permissive on voice detection. Silence
// threshold sits below room-floor so it only trips on actual silence.
const SILENCE_AMPLITUDE_THRESHOLD = 0.005;
const SILENCE_HOLD_MS = 1500;
const VOICE_AMPLITUDE_THRESHOLD = 0.012;

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

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const inflightRef = useRef(0);
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

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);
  useEffect(() => {
    onAutoStopRef.current = options.onAutoStop;
    autoStopOnSilenceRef.current = options.autoStopOnSilence ?? false;
  }, [options.onAutoStop, options.autoStopOnSilence]);

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
        return;
      }
      const payload = (await res.json()) as { text?: string };
      const text = (payload.text ?? "").trim();
      console.info("[whisper] chunk transcribed", { text });
      if (!text) return;
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
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
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
      recorder = new MediaRecorder(stream, { mimeType: mime });
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
      // Upload the completed standalone-WebM chunk (fire-and-forget).
      if (chunkData) void uploadChunk(chunkData);
      // Recurse for the next chunk if user still wants to record.
      if (wantRecordingRef.current && streamRef.current) {
        startChunkLoop(streamRef.current, mime);
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
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      const name = (err as { name?: string } | null)?.name;
      if (name === "NotAllowedError" || name === "SecurityError") {
        setPermissionDenied(true);
      }
      return;
    }

    streamRef.current = stream;
    fullTranscriptRef.current = "";
    setDisplayTranscript("");
    wantRecordingRef.current = true;
    setState("recording");

    // Optional: silence-detection auto-stop. Only enabled when the caller
    // passed `autoStopOnSilence` (Cat2 + ACRP solo modes). Live Peer mode
    // leaves it off because chunks stream continuously to both peers and we
    // never want auto-end mid-conversation.
    if (autoStopOnSilenceRef.current) {
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
            const now = Date.now();
            if (now - lastDebugAt > 1000) {
              lastDebugAt = now;
              console.info("[whisper] mic level", { rms: rms.toFixed(4), heardVoice: hasHeardVoiceRef.current });
            }
            if (rms > VOICE_AMPLITUDE_THRESHOLD) {
              lastVoiceAtRef.current = now;
              hasHeardVoiceRef.current = true;
            } else if (
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
        console.warn("[whisper] silence detection setup failed", err);
      }
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
  // mic so the indicator goes away on Android Chrome.
  useEffect(() => {
    return () => {
      try {
        if (recorderRef.current && recorderRef.current.state !== "inactive") {
          recorderRef.current.stop();
        }
      } catch {
        /* ignore */
      }
      streamRef.current?.getTracks().forEach((t) => t.stop());
      recorderRef.current = null;
      streamRef.current = null;
    };
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
