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

export function useWhisperSTT(onTranscript?: (text: string) => void) {
  const [state, setState] = useState<RecognitionState>("idle");
  const [displayTranscript, setDisplayTranscript] = useState("");
  const [supported, setSupported] = useState<boolean | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const inflightRef = useRef(0);
  // Keep a ref to the running transcript so we can append without re-rendering
  // for every interim chunk and so we can read it from the recorder closure.
  const fullTranscriptRef = useRef("");
  const onTranscriptRef = useRef(onTranscript);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

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

  const cleanupStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

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
