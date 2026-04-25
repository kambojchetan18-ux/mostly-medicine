"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import type { RealtimeChannel } from "@supabase/supabase-js";

const READING_SECONDS = 120;
const ROLEPLAY_SECONDS = 8 * 60;
const RTC_CONFIG: RTCConfiguration = {
  iceServers: [{ urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] }],
};

export interface LiveCaseStem {
  presentingComplaint: string;
  setting: string;
  candidateTask: string;
  visiblePatientContext: string;
  difficulty: string;
  patientName: string;
}

export interface LivePatientBrief {
  identity: { name: string; ageBand: string; gender: string; occupation: string; setting: string };
  truth: { hiddenDiagnosis: string; redFlags: string[] };
  portrayal: { emotionalTone: string; personalityNotes: string; speechStyle: string };
  reveal: {
    volunteer: string[];
    onlyWhenAsked: Array<{ trigger: string; reveal: string }>;
    distractors: Array<{ trigger: string; reveal: string }>;
  };
  rules: string[];
}

interface Props {
  sessionId: string;
  inviteCode: string;
  myUserId: string;
  myRole: "doctor" | "patient";
  isHost: boolean;
  hostUserId: string;
  guestUserId: string | null;
  initialStatus: string;
  stem: LiveCaseStem;
  patientBrief: LivePatientBrief | null;
}

interface TranscriptItem {
  id: string;
  sender_role: "doctor" | "patient";
  content: string;
}

export default function LiveSessionClient({
  sessionId,
  inviteCode,
  myUserId,
  myRole,
  isHost,
  initialStatus,
  stem,
  patientBrief,
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [partnerOnline, setPartnerOnline] = useState(false);
  const [readingLeft, setReadingLeft] = useState(READING_SECONDS);
  const [roleplayLeft, setRoleplayLeft] = useState(ROLEPLAY_SECONDS);
  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const supabase = useMemo(() => createClient(), []);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const stateChannelRef = useRef<RealtimeChannel | null>(null);
  const rtcChannelRef = useRef<RealtimeChannel | null>(null);
  const messagesChannelRef = useRef<RealtimeChannel | null>(null);

  // ─── STT — capture local speech, POST to message API ─────────────────
  const handleSttFinal = useCallback(
    async (final: string) => {
      try {
        await fetch(`/api/ai-roleplay/live/${sessionId}/message`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: final }),
        });
      } catch {
        /* swallow — Realtime will surface anything that lands */
      }
    },
    [sessionId]
  );
  const stt = useSpeechRecognition(handleSttFinal);

  // ─── Subscribe to session row + message stream ───────────────────────
  useEffect(() => {
    const sessionChannel = supabase
      .channel(`acrp_live_session_${sessionId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "acrp_live_sessions", filter: `id=eq.${sessionId}` },
        (payload) => {
          const row = payload.new as { status: string };
          setStatus(row.status);
        }
      )
      .subscribe();
    stateChannelRef.current = sessionChannel;

    const msgChannel = supabase
      .channel(`acrp_live_messages_${sessionId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "acrp_live_messages", filter: `session_id=eq.${sessionId}` },
        (payload) => {
          const row = payload.new as { id: string; sender_role: "doctor" | "patient"; content: string };
          setTranscript((t) => [...t, { id: row.id, sender_role: row.sender_role, content: row.content }]);
        }
      )
      .subscribe();
    messagesChannelRef.current = msgChannel;

    return () => {
      supabase.removeChannel(sessionChannel);
      supabase.removeChannel(msgChannel);
    };
  }, [supabase, sessionId]);

  // ─── Reading-phase countdown ─────────────────────────────────────────
  useEffect(() => {
    if (status !== "reading") return;
    if (readingLeft <= 0) {
      if (isHost) advance("roleplay");
      return;
    }
    const t = setTimeout(() => setReadingLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, readingLeft]);

  // ─── Roleplay-phase countdown ────────────────────────────────────────
  useEffect(() => {
    if (status !== "roleplay") return;
    if (roleplayLeft <= 0) {
      handleEnd();
      return;
    }
    const t = setTimeout(() => setRoleplayLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, roleplayLeft]);

  // ─── WebRTC: get media + signalling, only during roleplay ────────────
  useEffect(() => {
    if (status !== "roleplay") return;
    let cancelled = false;

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        const pc = new RTCPeerConnection(RTC_CONFIG);
        pcRef.current = pc;
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        pc.ontrack = (ev) => {
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = ev.streams[0];
        };

        const rtcChannel = supabase.channel(`acrp_live_rtc_${sessionId}`, {
          config: { broadcast: { self: false }, presence: { key: myUserId } },
        });
        rtcChannelRef.current = rtcChannel;

        pc.onicecandidate = (ev) => {
          if (ev.candidate) {
            rtcChannel.send({
              type: "broadcast",
              event: "ice",
              payload: { from: myUserId, candidate: ev.candidate.toJSON() },
            });
          }
        };

        rtcChannel
          .on("broadcast", { event: "offer" }, async ({ payload }) => {
            if (payload.from === myUserId) return;
            await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            rtcChannel.send({ type: "broadcast", event: "answer", payload: { from: myUserId, sdp: answer } });
          })
          .on("broadcast", { event: "answer" }, async ({ payload }) => {
            if (payload.from === myUserId) return;
            if (pc.signalingState === "have-local-offer") {
              await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
            }
          })
          .on("broadcast", { event: "ice" }, async ({ payload }) => {
            if (payload.from === myUserId) return;
            try {
              await pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
            } catch {
              /* race — ignore */
            }
          })
          .on("presence", { event: "sync" }, () => {
            const state = rtcChannel.presenceState();
            const others = Object.values(state).flat().some((p) => (p as { user?: string }).user !== myUserId);
            setPartnerOnline(others);
          })
          .subscribe(async (s) => {
            if (s !== "SUBSCRIBED") return;
            await rtcChannel.track({ user: myUserId, role: myRole });
            // Host initiates the offer once subscribed.
            if (isHost) {
              const offer = await pc.createOffer();
              await pc.setLocalDescription(offer);
              rtcChannel.send({ type: "broadcast", event: "offer", payload: { from: myUserId, sdp: offer } });
            }
          });

        // Start STT on the local user — captures their speech for transcript.
        if (stt.supported) stt.startRecording();
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not start camera/mic");
      }
    })();

    return () => {
      cancelled = true;
      stt.stopRecording();
      pcRef.current?.close();
      pcRef.current = null;
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
      if (rtcChannelRef.current) {
        supabase.removeChannel(rtcChannelRef.current);
        rtcChannelRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // Auto-restart STT after each final to keep capture continuous
  useEffect(() => {
    if (status !== "roleplay") return;
    if (!stt.supported) return;
    if (stt.state === "idle") {
      const t = setTimeout(() => stt.startRecording(), 400);
      return () => clearTimeout(t);
    }
  }, [status, stt]);

  // ─── Status transitions ──────────────────────────────────────────────
  async function advance(to: string) {
    setError(null);
    try {
      const res = await fetch(`/api/ai-roleplay/live/${sessionId}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to }),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error ?? "Could not advance");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not advance");
    }
  }

  async function handleEnd() {
    if (status === "completed") return;
    await advance("completed");
    router.push(`/dashboard/ai-roleplay/live/${inviteCode}/results`);
  }

  function copyInvite() {
    const url = typeof window !== "undefined" ? `${window.location.origin}/dashboard/ai-roleplay/live/${inviteCode}` : "";
    navigator.clipboard.writeText(url || inviteCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  // ─────────────── PHASE: waiting ───────────────
  if (status === "waiting") {
    return (
      <div className="mx-auto max-w-md py-12 text-center">
        <h1 className="text-xl font-bold text-gray-900">Waiting room</h1>
        <p className="mt-1 text-sm text-gray-600">Share this code with your partner.</p>
        <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="font-mono text-3xl font-bold tracking-widest text-violet-700">{inviteCode}</p>
          <button
            type="button"
            onClick={copyInvite}
            className="mt-3 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            {copied ? "✓ Copied!" : "Copy invite link"}
          </button>
        </div>
        <p className="mt-4 text-xs text-gray-500">
          Your role: <span className="font-semibold capitalize text-gray-700">{myRole}</span>
        </p>
        {isHost && (
          <button
            type="button"
            disabled={!partnerOnline && status === "waiting"}
            onClick={() => advance("reading")}
            className="mt-6 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-violet-700 disabled:opacity-60"
          >
            Start reading time
          </button>
        )}
        {!isHost && (
          <p className="mt-6 text-sm text-gray-600">Waiting for the host to start…</p>
        )}
        {error && <p className="mt-3 text-xs text-rose-600">⚠️ {error}</p>}
      </div>
    );
  }

  // ─────────────── PHASE: reading ───────────────
  if (status === "reading") {
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">Reading time</p>
              <p className="mt-0.5 text-3xl font-bold tabular-nums text-violet-900">{fmt(readingLeft)}</p>
            </div>
            <span className="rounded-full border border-violet-200 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase text-violet-700">
              You: {myRole}
            </span>
          </div>
        </div>

        {myRole === "doctor" ? (
          <DoctorStem stem={stem} />
        ) : (
          <PatientBriefView brief={patientBrief} />
        )}

        {isHost && (
          <button
            type="button"
            onClick={() => advance("roleplay")}
            className="w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow hover:bg-violet-700"
          >
            Skip to roleplay →
          </button>
        )}
      </div>
    );
  }

  // ─────────────── PHASE: roleplay ───────────────
  if (status === "roleplay") {
    return (
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-2 shadow-sm">
          <div className="text-sm">
            <span className="font-semibold capitalize text-gray-900">You: {myRole}</span>
            <span className="ml-3 text-xs text-gray-500">Partner: {partnerOnline ? "🟢 online" : "🟡 connecting…"}</span>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-bold tabular-nums ${
                roleplayLeft <= 60 ? "border-rose-300 bg-rose-50 text-rose-700" : "border-violet-200 bg-violet-50 text-violet-700"
              }`}
            >
              {fmt(roleplayLeft)}
            </span>
            <button
              type="button"
              onClick={handleEnd}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              End session
            </button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 grid grid-cols-2 gap-3">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="aspect-video w-full rounded-xl border border-gray-300 bg-black"
            />
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="aspect-video w-full rounded-xl border border-gray-300 bg-black"
            />
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Live transcript</p>
            <div className="max-h-[50vh] space-y-2 overflow-y-auto text-sm">
              {transcript.length === 0 ? (
                <p className="text-xs text-gray-400">Speech will appear here as it's captured…</p>
              ) : (
                transcript.map((t) => (
                  <p key={t.id} className="leading-snug">
                    <span
                      className={`mr-1 font-semibold ${
                        t.sender_role === "doctor" ? "text-violet-700" : "text-emerald-700"
                      }`}
                    >
                      {t.sender_role === "doctor" ? "Dr:" : "Pt:"}
                    </span>
                    <span className="text-gray-800">{t.content}</span>
                  </p>
                ))
              )}
            </div>
          </div>
        </div>

        {!stt.supported && (
          <p className="text-xs text-amber-600">
            Speech recognition not supported in this browser — transcript will be empty. Use Chrome/Edge/Safari for full feedback.
          </p>
        )}
        {stt.permissionDenied && (
          <p className="text-xs text-rose-600">⚠️ Microphone permission denied. Allow it to capture your speech.</p>
        )}
        {error && <p className="text-xs text-rose-600">⚠️ {error}</p>}
      </div>
    );
  }

  // ─────────────── PHASE: completed/abandoned ───────────────
  return (
    <div className="mx-auto max-w-md py-12 text-center">
      <p className="text-sm text-gray-700">Session ended.</p>
      <Link
        href={`/dashboard/ai-roleplay/live/${inviteCode}/results`}
        className="mt-4 inline-block rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-violet-700"
      >
        View feedback →
      </Link>
    </div>
  );
}

// ─── Read-only views ───────────────────────────────────────────────
function DoctorStem({ stem }: { stem: LiveCaseStem }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Setting</p>
      <p className="mt-1 text-sm text-gray-900">{stem.setting}</p>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Patient</p>
      <p className="mt-1 text-sm font-medium text-gray-900">{stem.patientName}</p>
      <p className="mt-1 text-sm text-gray-700">{stem.visiblePatientContext}</p>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Presenting complaint</p>
      <p className="mt-1 text-sm text-gray-900">{stem.presentingComplaint}</p>
      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">Your task</p>
        <p className="mt-1 text-sm font-medium text-amber-900">{stem.candidateTask}</p>
      </div>
    </div>
  );
}

function PatientBriefView({ brief }: { brief: LivePatientBrief | null }) {
  if (!brief) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
        Patient brief unavailable. Ask the host to recreate the session.
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">You are playing</p>
        <p className="mt-1 text-base font-semibold text-emerald-900">
          {brief.identity.name} · {brief.identity.ageBand} · {brief.identity.gender}
        </p>
        <p className="mt-1 text-xs text-emerald-700">
          {brief.identity.occupation} · {brief.identity.setting}
        </p>
      </div>

      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-800">🤫 The truth (do NOT reveal)</p>
        <p className="mt-1 text-sm font-semibold text-rose-900">Diagnosis: {brief.truth.hiddenDiagnosis}</p>
        {brief.truth.redFlags.length > 0 && (
          <div className="mt-2 text-xs text-rose-800">
            Red flags you carry:{" "}
            <span className="font-medium">{brief.truth.redFlags.join(" · ")}</span>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">🎭 How to play</p>
        <p className="mt-1 text-sm text-gray-800">
          <span className="font-semibold">Tone:</span> {brief.portrayal.emotionalTone}
        </p>
        <p className="mt-1 text-sm text-gray-800">
          <span className="font-semibold">Personality:</span> {brief.portrayal.personalityNotes}
        </p>
        <p className="mt-1 text-sm text-gray-800">
          <span className="font-semibold">Speech:</span> {brief.portrayal.speechStyle}
        </p>
      </div>

      <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-800">Volunteer naturally</p>
        <ul className="mt-2 space-y-1 text-sm text-violet-900">
          {brief.reveal.volunteer.map((v, i) => (
            <li key={i}>• {v}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">Reveal only when asked</p>
        <ul className="mt-2 space-y-2 text-sm">
          {brief.reveal.onlyWhenAsked.map((c, i) => (
            <li key={i}>
              <span className="text-xs italic text-gray-500">If asked about: {c.trigger}</span>
              <p className="text-gray-900">→ {c.reveal}</p>
            </li>
          ))}
        </ul>
      </div>

      {brief.reveal.distractors.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">Distractors (true but misleading)</p>
          <ul className="mt-2 space-y-2 text-sm">
            {brief.reveal.distractors.map((c, i) => (
              <li key={i}>
                <span className="text-xs italic text-gray-500">If asked about: {c.trigger}</span>
                <p className="text-gray-900">→ {c.reveal}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
        <p className="font-semibold">House rules</p>
        <ul className="mt-1 list-disc pl-4 space-y-0.5">
          {brief.rules.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
