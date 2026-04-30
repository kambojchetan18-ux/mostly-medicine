"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import type { RealtimeChannel } from "@supabase/supabase-js";
import FunLoading from "@/components/FunLoading";

const READING_SECONDS = 120;
const ROLEPLAY_SECONDS = 8 * 60;
// ICE server priority (cheapest path first, fallback last):
//   1. Google STUN — free, ~80% of users connect P2P with this alone.
//   2. Self-hosted coturn (if NEXT_PUBLIC_TURN_* env vars are set) — private,
//      reliable, low-latency relay for the ~20% of users on symmetric NAT
//      (mobile data ↔ home Wi-Fi) or corporate firewalls. See
//      /COTURN_SETUP.md for deployment guide.
//   3. Open Relay (Metered.ca) — free public TURN, used ONLY when no
//      self-hosted TURN is configured. It's a graceful fallback so the app
//      still works during DevOps work, but it's rate-limited and noisy.
// Setting NEXT_PUBLIC_TURN_URL="" in Vercel rolls back to STUN-only +
// Open Relay — handy as an emergency kill-switch if our coturn box dies.
const TURN_URL = process.env.NEXT_PUBLIC_TURN_URL;
const TURN_USERNAME = process.env.NEXT_PUBLIC_TURN_USERNAME;
const TURN_CREDENTIAL = process.env.NEXT_PUBLIC_TURN_CREDENTIAL;
const HAS_PRIVATE_TURN = Boolean(TURN_URL && TURN_USERNAME && TURN_CREDENTIAL);

const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] },
    ...(HAS_PRIVATE_TURN
      ? [
          {
            urls: [TURN_URL as string],
            username: TURN_USERNAME as string,
            credential: TURN_CREDENTIAL as string,
          },
        ]
      : [
          {
            urls: [
              "turn:openrelay.metered.ca:80",
              "turn:openrelay.metered.ca:443",
              "turn:openrelay.metered.ca:443?transport=tcp",
            ],
            username: "openrelayproject",
            credential: "openrelayproject",
          },
        ]),
  ],
  iceTransportPolicy: "all",
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
  guestUserId,
  initialStatus,
  stem,
  patientBrief,
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [liveGuestId, setLiveGuestId] = useState<string | null>(guestUserId);
  // Partner is "online" once both host and guest IDs are filled in and we're
  // past the waiting phase. The DB row is the source of truth; presence-sync
  // events were unreliable.
  const [presencePartnerOnline, setPresencePartnerOnline] = useState(false);
  const partnerOnline = presencePartnerOnline || (Boolean(liveGuestId) && status !== "waiting");
  const [readingLeft, setReadingLeft] = useState(READING_SECONDS);
  const [roleplayLeft, setRoleplayLeft] = useState(ROLEPLAY_SECONDS);
  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Visible diagnostic state — shown to the user above the videos so they
  // know in real time whether STT and WebRTC are healthy. Mobile users can't
  // open DevTools easily; this replaces "is it broken?" with concrete signal.
  const [iceState, setIceState] = useState<string>("idle");
  const [sttError, setSttError] = useState<string | null>(null);
  // Which TURN provider actually got wired into the RTCPeerConnection. Lets
  // the diagnostic pill say "Cloudflare TURN" / "self-hosted" / "fallback".
  const [turnProvider, setTurnProvider] = useState<"cloudflare" | "self-hosted" | "fallback">(
    HAS_PRIVATE_TURN ? "self-hosted" : "fallback"
  );
  // Surface the EXACT reason the broker fell back, so misconfigured env
  // vars / upstream errors show up next to the pill instead of being silent.
  const [turnError, setTurnError] = useState<string | null>(null);

  // ─── Remote-peer audio controls ──────────────────────────────────────
  // The partner's voice arrives via the WebRTC remote stream attached to
  // remoteVideoRef. The user needs a way to dial that down (loud caller)
  // or mute it entirely (taking a phone call mid-session) without killing
  // the connection. We cache the pre-mute volume so un-muting restores it.
  const [remoteVolume, setRemoteVolume] = useState(1);
  const [remoteMuted, setRemoteMuted] = useState(false);
  const lastNonZeroVolumeRef = useRef(1);

  const supabase = useMemo(() => createClient(), []);
  // Per-tab unique ID. When the same user opens the session in two tabs/
  // devices on the same account (the typical solo-launch test setup), both
  // tabs share myUserId — and `payload.from === myUserId` filters wiped
  // every cross-tab broadcast as 'own', so offer/answer/ICE never crossed,
  // ICE stayed at 'new', and the partner tile stayed black. A per-tab UUID
  // lets each side recognise its own broadcasts without depending on auth.
  const myPeerId = useMemo(
    () =>
      `${myUserId}-${typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2)}`,
    [myUserId]
  );
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const stateChannelRef = useRef<RealtimeChannel | null>(null);
  const rtcChannelRef = useRef<RealtimeChannel | null>(null);
  const messagesChannelRef = useRef<RealtimeChannel | null>(null);
  // Stream state — drives the video <-> srcObject useEffects below. Holding
  // the streams in state (instead of just on the ref) means a re-render
  // re-runs the attachment effect, which fixes a race where ontrack fires
  // while the remote <video> element hasn't been committed yet (black tile).
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  // ─── STT — capture local speech, debounce, POST to message API ──────
  // Each Whisper chunk arrives every ~4 s. Posting every chunk floods the
  // transcript panel with "Hello?", "So...", "Thank you." fragments —
  // partly hallucinations, partly natural pauses. Buffer for 2.5 s of
  // quiet between chunks, then ship the joined utterance as one message.
  const sttBufferRef = useRef("");
  const flushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const postMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    setSttError(null);
    try {
      const res = await fetch(`/api/ai-roleplay/live/${sessionId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        setSttError(`message POST failed: ${res.status} ${body.slice(0, 80)}`);
      }
    } catch (err) {
      setSttError(err instanceof Error ? err.message : "message POST failed");
    }
  }, [sessionId]);
  const handleSttFinal = useCallback(
    (final: string) => {
      sttBufferRef.current = (sttBufferRef.current + " " + final).trim();
      if (flushTimerRef.current) clearTimeout(flushTimerRef.current);
      // Wait 2.5 s of mic-quiet after the latest chunk before flushing — that
      // amalgamates a multi-sentence utterance into ONE transcript message
      // instead of N tiny "Hello?" / "So..." fragments.
      flushTimerRef.current = setTimeout(() => {
        flushTimerRef.current = null;
        const buffered = sttBufferRef.current.trim();
        sttBufferRef.current = "";
        if (buffered) void postMessage(buffered);
      }, 2500);
    },
    []
  );
  // Live Peer RolePlay reuses the WebRTC capture stream for STT — we cannot
  // call getUserMedia twice in the same tab on macOS Chrome (the second call
  // returns a silent placeholder track, leaving the analyser stuck at RMS 0
  // and every chunk VAD-skipped). Pass localStream through so the hook
  // analyses + records from the SAME audio track WebRTC is sending.
  const stt = useVoiceRecognition(handleSttFinal, { externalStream: localStream });

  // ─── Apply remote-volume / remote-mute to the <video> element ────────
  // Re-runs whenever the user drags the slider or hits the mute toggle.
  // The element may not exist on the very first render (before the remote
  // track arrives) — that's fine, the next change will catch it.
  useEffect(() => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.volume = remoteVolume;
      remoteVideoRef.current.muted = remoteMuted;
    }
  }, [remoteVolume, remoteMuted]);

  // ─── Attach local stream to local <video> ────────────────────────────
  // Re-runs whenever the stream changes OR the roleplay phase re-renders
  // the <video> element. Without this, on slow devices the getUserMedia
  // promise can resolve BEFORE React commits the <video> tag, so the
  // assignment in the WebRTC effect dropped silently → black local tile.
  useEffect(() => {
    const el = localVideoRef.current;
    if (!el || !localStream) return;
    if (el.srcObject !== localStream) {
      el.srcObject = localStream;
    }
    el.muted = true; // local preview must be muted to autoplay (Chrome policy)
    void el.play().catch((err) => {
      console.warn("[live/rtc] local video play() rejected", err);
    });
  }, [localStream, status]);

  // ─── Attach remote stream to remote <video> ──────────────────────────
  // Same race fix: ontrack fires asynchronously and the <video> element
  // may not be mounted yet. Holding the stream in state ensures a re-render
  // re-runs this effect once the element is committed.
  useEffect(() => {
    const el = remoteVideoRef.current;
    if (!el || !remoteStream) return;
    if (el.srcObject !== remoteStream) {
      el.srcObject = remoteStream;
    }
    el.volume = remoteVolume;
    el.muted = remoteMuted;
    void el.play().catch((err) => {
      console.warn("[live/rtc] remote video play() rejected", err);
    });
  }, [remoteStream, status, remoteVolume, remoteMuted]);

  // ─── Subscribe to session row + message stream ───────────────────────
  useEffect(() => {
    const sessionChannel = supabase
      .channel(`acrp_live_session_${sessionId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "acrp_live_sessions", filter: `id=eq.${sessionId}` },
        (payload) => {
          const row = payload.new as { status: string; guest_user_id: string | null };
          setStatus(row.status);
          setLiveGuestId(row.guest_user_id ?? null);
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

  // ─── Fallback poll across every active phase ────────────────────────
  // Realtime can drop events on Vercel cold starts. We poll every 2.5s during
  // ALL active phases (waiting → reading → roleplay) so partner-joined and
  // status transitions land reliably. Crucially, this also catches the
  // roleplay → completed flip when one peer ends — without it the other peer
  // would stay stuck on their own video while the ender already navigated away.
  useEffect(() => {
    if (status === "completed" || status === "abandoned") return;
    const t = setInterval(async () => {
      const { data } = await supabase
        .from("acrp_live_sessions")
        .select("guest_user_id, status")
        .eq("id", sessionId)
        .maybeSingle();
      if (data) {
        if (data.guest_user_id) setLiveGuestId(data.guest_user_id);
        if (data.status && data.status !== status) setStatus(data.status);
      }
    }, 2500);
    return () => clearInterval(t);
  }, [status, sessionId, supabase]);

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
        const tracks = stream.getTracks().map((t) => ({ kind: t.kind, label: t.label, enabled: t.enabled }));
        console.info("[live/rtc] local stream acquired", { tracks });
        // Drive attachment via state so the dedicated useEffect handles it
        // — survives the case where the <video> element isn't committed yet.
        setLocalStream(stream);

        // Try to fetch fresh per-session TURN credentials from Cloudflare
        // first. If the env vars are set on the server, this returns a
        // short-lived (24h) credential pair that's far more reliable than
        // the public Open Relay. If not configured / errors, fall back to
        // the static RTC_CONFIG (self-hosted coturn or Open Relay).
        let rtcConfig: RTCConfiguration = RTC_CONFIG;
        try {
          const res = await fetch("/api/turn-credentials", { cache: "no-store" });
          if (res.ok) {
            const cf = await res.json();
            if (cf?.iceServers) {
              const cfServers = Array.isArray(cf.iceServers) ? cf.iceServers : [cf.iceServers];
              rtcConfig = {
                iceServers: [
                  { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] },
                  ...cfServers,
                ],
                iceTransportPolicy: "all",
              };
              setTurnProvider("cloudflare");
              setTurnError(null);
              console.info("[live/rtc] using Cloudflare TURN credentials");
            } else {
              setTurnError("Cloudflare returned 200 but no iceServers");
            }
          } else {
            const body = await res.text().catch(() => "");
            const reason =
              res.status === 503
                ? "TURN not configured (env vars missing in Vercel)"
                : `${res.status}: ${body.slice(0, 100)}`;
            console.info("[live/rtc] Cloudflare TURN unavailable", reason);
            setTurnError(reason);
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : "fetch failed";
          console.warn("[live/rtc] Cloudflare TURN fetch error", err);
          setTurnError(msg);
        }

        const pc = new RTCPeerConnection(rtcConfig);
        pcRef.current = pc;
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        pc.ontrack = (ev) => {
          console.info("[live/rtc] remote ontrack fired", {
            kind: ev.track.kind,
            streams: ev.streams.length,
            streamId: ev.streams[0]?.id,
          });
          // Browsers fire ontrack twice — once for audio, once for video. The
          // earlier "merge into a fresh MediaStream every fire" approach
          // (`new MediaStream([...prev.getTracks(), ev.track])`) regressed the
          // partner video tile to black: rebinding `srcObject` to a NEW stream
          // instance on the second fire confused Chrome's playback pipeline,
          // so the video track that arrived second was silently dropped.
          //
          // Fix: attach `ev.streams[0]` directly (sender uses
          // `pc.addTrack(track, stream)` with a SHARED stream → same stream
          // reference on every fire) and ALSO set srcObject + play() right
          // here — same belt-and-braces pattern that worked at ef51399.
          // Keep the React state in sync so the attachment useEffect still
          // wins the "video element not yet mounted" race.
          const incoming = ev.streams[0];
          if (incoming) {
            setRemoteStream(incoming);
            if (remoteVideoRef.current) {
              if (remoteVideoRef.current.srcObject !== incoming) {
                remoteVideoRef.current.srcObject = incoming;
              }
              remoteVideoRef.current.play().catch((err) => {
                console.warn("[live/rtc] remote video play() rejected", err);
              });
            }
          }
        };

        // Diagnose hung handshakes: surface every state transition into the
        // visible diagnostic pill above the videos so the user can see in
        // real time whether ICE / DTLS / signalling is the failure point.
        // Most "black remote" reports are ICE failed with no TURN relay
        // reachable — the pill makes that obvious instead of silent.
        pc.oniceconnectionstatechange = () => {
          const s = pc.iceConnectionState;
          console.info("[live/rtc] iceConnectionState", s);
          setIceState(s);
          if (s === "failed") {
            setError("Connection failed — your network is blocking the video relay. Try switching networks (different Wi-Fi vs mobile data) or refresh.");
          }
        };
        pc.onconnectionstatechange = () => {
          console.info("[live/rtc] connectionState", pc.connectionState);
        };

        const rtcChannel = supabase.channel(`acrp_live_rtc_${sessionId}`, {
          config: { broadcast: { self: false }, presence: { key: myPeerId } },
        });
        rtcChannelRef.current = rtcChannel;

        pc.onicecandidate = (ev) => {
          if (ev.candidate) {
            rtcChannel.send({
              type: "broadcast",
              event: "ice",
              payload: { from: myPeerId, candidate: ev.candidate.toJSON() },
            });
          }
        };

        let offerSent = false;
        // Helper: host sends an offer. Guarded so we only send once even if
        // presence fires multiple times.
        const sendHostOffer = async () => {
          if (!isHost || offerSent) return;
          if (pc.signalingState !== "stable") return;
          offerSent = true;
          try {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            rtcChannel.send({
              type: "broadcast",
              event: "offer",
              payload: { from: myPeerId, sdp: offer },
            });
          } catch (err) {
            offerSent = false;
            console.error("[live/rtc] createOffer failed", err);
          }
        };

        rtcChannel
          .on("broadcast", { event: "ready" }, async ({ payload }) => {
            // Guest signalled it joined the channel — host (re)sends offer.
            if (payload.from === myPeerId) return;
            offerSent = false; // allow re-send
            await sendHostOffer();
          })
          .on("broadcast", { event: "offer" }, async ({ payload }) => {
            if (payload.from === myPeerId) return;
            try {
              await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              rtcChannel.send({
                type: "broadcast",
                event: "answer",
                payload: { from: myPeerId, sdp: answer },
              });
            } catch (err) {
              console.error("[live/rtc] offer handle failed", err);
            }
          })
          .on("broadcast", { event: "answer" }, async ({ payload }) => {
            if (payload.from === myPeerId) return;
            if (pc.signalingState === "have-local-offer") {
              try {
                await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
              } catch (err) {
                console.error("[live/rtc] answer handle failed", err);
              }
            }
          })
          .on("broadcast", { event: "ice" }, async ({ payload }) => {
            if (payload.from === myPeerId) return;
            try {
              await pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
            } catch {
              /* race — ignore */
            }
          })
          .on("presence", { event: "sync" }, () => {
            const state = rtcChannel.presenceState();
            const others = Object.values(state)
              .flat()
              .some((p) => (p as { peer?: string }).peer !== myPeerId);
            setPresencePartnerOnline(others);
            // When partner becomes online, host (re)sends offer to handle the
            // case where the offer was sent before the guest's presence.
            if (others) sendHostOffer();
          })
          .subscribe(async (s) => {
            if (s !== "SUBSCRIBED") return;
            await rtcChannel.track({ peer: myPeerId, user: myUserId, role: myRole });
            // Guest announces ready so host can send offer reliably.
            if (!isHost) {
              rtcChannel.send({
                type: "broadcast",
                event: "ready",
                payload: { from: myPeerId },
              });
            }
            // Host also tries to send offer on subscribe (in case partner
            // already present). The guard prevents duplicates.
            if (isHost) sendHostOffer();
          });

        // STT no longer auto-starts — strict browsers reject it without a
        // user gesture. The mic toggle button below the videos handles it.
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not start camera/mic");
      }
    })();

    return () => {
      cancelled = true;
      void stt.stopRecording();
      pcRef.current?.close();
      pcRef.current = null;
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
      setLocalStream(null);
      setRemoteStream(null);
      if (rtcChannelRef.current) {
        supabase.removeChannel(rtcChannelRef.current);
        rtcChannelRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // Auto-start STT once after WebRTC capture resolves. The `stt` object is a
  // fresh reference on every render (micLevel updates ~5x/sec), so depending
  // on `stt` directly causes the effect to re-run continuously and clear the
  // setTimeout before it fires — which is why the mic stayed off. Read stt
  // through a ref + a "did we auto-start yet?" flag so we fire exactly once
  // per phase entry.
  const sttRef = useRef(stt);
  sttRef.current = stt;
  const sttAutoStartedRef = useRef(false);
  useEffect(() => {
    if (status !== "roleplay") {
      sttAutoStartedRef.current = false;
      return;
    }
    if (!localStream) return;
    if (sttAutoStartedRef.current) return;
    const t = setTimeout(() => {
      if (!sttRef.current.supported) return;
      if (sttRef.current.state !== "idle") return;
      sttAutoStartedRef.current = true;
      void sttRef.current.startRecording();
    }, 600);
    return () => clearTimeout(t);
  }, [status, localStream]);

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
      // Optimistic local update — don't wait for realtime/polling to flip the
      // local view. The other participant catches up via their own subscription.
      setStatus(to);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not advance");
    }
  }

  async function handleEnd() {
    if (status === "completed") return;
    // Flush any buffered STT BEFORE flipping the session to "completed".
    // The /message route 409s once status != "roleplay", so a still-pending
    // 2.5s debounce would silently drop the last utterance — which on a
    // short session can mean an entirely empty transcript and a useless
    // feedback page. Drain the buffer + post it, then advance.
    if (flushTimerRef.current) {
      clearTimeout(flushTimerRef.current);
      flushTimerRef.current = null;
    }
    const buffered = sttBufferRef.current.trim();
    sttBufferRef.current = "";
    if (buffered) {
      try {
        await postMessage(buffered);
      } catch {
        /* best-effort; do not block end */
      }
    }
    await advance("completed");
    router.push(`/dashboard/ai-roleplay/live/${inviteCode}/results`);
  }

  // Auto-redirect the OTHER peer when the session flips to completed —
  // either via Realtime (the ender's DB row update broadcasts to us) or via
  // the polling fallback. Without this, the partner stays on a stale
  // roleplay UI watching their own video while the ender already left.
  useEffect(() => {
    if (status === "completed") {
      router.push(`/dashboard/ai-roleplay/live/${inviteCode}/results`);
    }
  }, [status, inviteCode, router]);

  function inviteUrl() {
    return typeof window !== "undefined"
      ? `${window.location.origin}/dashboard/ai-roleplay/live/${inviteCode}`
      : "";
  }

  function copyInvite() {
    const url = inviteUrl() || inviteCode;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } else {
      // Fallback for older mobile browsers — select + execCommand
      try {
        const ta = document.createElement("textarea");
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        /* ignore */
      }
    }
  }

  function shareWhatsApp() {
    const url = inviteUrl();
    const msg = encodeURIComponent(
      `Join me for an AMC Peer RolePlay practice on Mostly Medicine 🩺\n\nClick the link to join (or use code ${inviteCode}):\n${url}`
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  }

  function nativeShare() {
    if (typeof navigator === "undefined" || !navigator.share) {
      copyInvite();
      return;
    }
    navigator
      .share({
        title: "Mostly Medicine — AMC Peer RolePlay",
        text: `Join me for an AMC Peer RolePlay session. Code: ${inviteCode}`,
        url: inviteUrl(),
      })
      .catch(() => {
        /* user cancelled */
      });
  }

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  // ─────────────── PHASE: waiting ───────────────
  if (status === "waiting") {
    // Track guest joined via the live session row (set by /api/live/join when
    // partner enters the code). Partner-online presence is set later during
    // roleplay phase; here we just need to know the guest seat is filled.
    const guestJoined = Boolean(liveGuestId);
    return (
      <div className="mx-auto max-w-lg py-8">
        <h1 className="text-center text-xl font-bold text-gray-900">🎬 AMC Peer RolePlay — Waiting Room</h1>
        <p className="mt-1 text-center text-sm text-gray-600">
          You'll play <span className="font-semibold capitalize text-brand-700">{myRole}</span>
          {isHost && <span className="ml-1 text-xs text-gray-400">(host)</span>}
        </p>

        {/* Same-account warning — when the user opens the invite link while
            already logged in as the host on another device, they see the host
            view (correct), but it's confusing for testing. Make it clear. */}
        {isHost && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-center text-xs text-amber-900">
            <p className="font-semibold">⚠️ You are the host of this session.</p>
            <p className="mt-1">
              To test the joiner experience as the other role, share this link with a partner who
              has a <span className="font-semibold">different Mostly Medicine account</span>, or
              open it in an incognito window logged in as a different user.
            </p>
          </div>
        )}

        {/* Big invite code */}
        <div className="mt-6 rounded-2xl border-2 border-brand-200 bg-gradient-to-br from-brand-50 to-pink-50 p-6 text-center shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-600">Your invite code</p>
          <p className="mt-2 font-mono text-4xl font-extrabold tracking-[0.3em] text-brand-700">{inviteCode}</p>
          <p className="mt-3 break-all text-[11px] text-gray-500">{inviteUrl()}</p>
        </div>

        {/* Share buttons */}
        {isHost && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={shareWhatsApp}
              className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
            >
              💬 WhatsApp
            </button>
            <button
              type="button"
              onClick={nativeShare}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              📤 Share…
            </button>
            <button
              type="button"
              onClick={copyInvite}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              {copied ? "✓ Copied" : "📋 Copy link"}
            </button>
          </div>
        )}

        {/* Step-by-step instructions */}
        {isHost && (
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700">
            <p className="font-semibold text-gray-900">How to start:</p>
            <ol className="mt-2 space-y-2 pl-4 text-xs">
              <li>
                <span className="font-semibold">1.</span> Send the invite link or code{" "}
                <span className="font-mono font-bold text-brand-700">{inviteCode}</span> to your partner via
                WhatsApp / message.
              </li>
              <li>
                <span className="font-semibold">2.</span> They open{" "}
                <span className="font-semibold">/dashboard/ai-roleplay/live</span> and enter the code in
                "Join a session" — or just click the link.
              </li>
              <li>
                <span className="font-semibold">3.</span> Once they appear below ⬇️, hit{" "}
                <span className="font-semibold">Start reading time</span>.
              </li>
            </ol>
          </div>
        )}

        {/* Partner status */}
        <div className="mt-5 rounded-xl border border-gray-200 bg-white p-3 text-center text-sm">
          {guestJoined ? (
            <p className="font-semibold text-emerald-700">✅ Partner joined — ready to start!</p>
          ) : (
            <FunLoading
              pool={[
                "⏳ Waiting for your partner to join…",
                "📨 They should see the link any moment now…",
                "🤝 Pre-warming the handshake…",
              ]}
              className="justify-center text-xs text-gray-500"
            />
          )}
        </div>

        {/* Start button (host only) */}
        {isHost && (
          <button
            type="button"
            disabled={!guestJoined}
            onClick={() => advance("reading")}
            className="mt-6 w-full rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white shadow hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {guestJoined ? "▶️ Start reading time (2 min)" : "Waiting for partner…"}
          </button>
        )}
        {!isHost && (
          <p className="mt-6 text-center text-sm text-gray-600">
            Waiting for the host to start the session…
          </p>
        )}
        {error && <p className="mt-3 text-center text-xs text-rose-600">⚠️ {error}</p>}
      </div>
    );
  }

  // ─────────────── PHASE: reading ───────────────
  if (status === "reading") {
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Reading time</p>
              <p className="mt-0.5 text-3xl font-bold tabular-nums text-brand-900">{fmt(readingLeft)}</p>
            </div>
            <span className="rounded-full border border-brand-200 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase text-brand-700">
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
            className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow hover:bg-brand-700"
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
        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900 shadow-sm">
            ⚠️ {error}
          </div>
        )}
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-2 shadow-sm">
          <div className="text-sm">
            <span className="font-semibold capitalize text-gray-900">You: {myRole}</span>
            <span className="ml-3 text-xs text-gray-500">Partner: {partnerOnline ? "🟢 online" : "🟡 connecting…"}</span>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-bold tabular-nums ${
                roleplayLeft <= 60 ? "border-rose-300 bg-rose-50 text-rose-700" : "border-brand-200 bg-brand-50 text-brand-700"
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

        {/* Visible health diagnostics — replaces "is it broken?" with concrete
            signal for users who can't open DevTools (mobile, non-technical). */}
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs shadow-sm">
          <span
            className={`rounded-full px-2 py-0.5 font-semibold ${
              iceState === "connected" || iceState === "completed"
                ? "bg-emerald-100 text-emerald-800"
                : iceState === "failed" || iceState === "disconnected"
                  ? "bg-rose-100 text-rose-800"
                  : "bg-amber-100 text-amber-800"
            }`}
            title="WebRTC peer connection state"
          >
            📡 {iceState}
          </span>
          {sttError && (
            <span className="rounded-full bg-rose-100 px-2 py-0.5 font-semibold text-rose-800" title={sttError}>
              ⚠️ {sttError.slice(0, 60)}
            </span>
          )}
          <span
            className={`ml-auto rounded-full px-2 py-0.5 ${
              turnProvider === "cloudflare"
                ? "bg-emerald-50 text-emerald-700"
                : turnProvider === "self-hosted"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
            }`}
            title={turnError ?? "Which TURN relay is wired into the peer connection."}
          >
            {turnProvider === "cloudflare"
              ? "Cloudflare TURN"
              : turnProvider === "self-hosted"
                ? "self-hosted TURN"
                : "fallback TURN"}
          </span>
          {turnError && turnProvider === "fallback" && (
            <span className="basis-full text-[10px] text-amber-700" title={turnError}>
              ↳ {turnError.slice(0, 120)}
            </span>
          )}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="aspect-video w-full rounded-xl border border-gray-300 bg-black"
                />
                {/* Surface why the remote tile is black: either partner hasn't
                    granted camera, or the WebRTC track simply hasn't arrived
                    yet. Without this overlay users see a mute black square
                    and assume the app is broken. */}
                {(!remoteStream || remoteStream.getVideoTracks().length === 0) && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-black/80 px-3 text-center text-xs text-white">
                    <span className="text-2xl">📵</span>
                    <span className="mt-1 font-semibold">
                      {iceState === "connected" || iceState === "completed"
                        ? "Partner camera off"
                        : "Waiting for partner video…"}
                    </span>
                    <span className="mt-1 text-[10px] text-white/70">
                      Audio still flows. Ask them to allow camera + refresh.
                    </span>
                  </div>
                )}
              </div>
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="aspect-video w-full rounded-xl border border-gray-300 bg-black"
              />
            </div>
            {/* Partner-audio controls — affect the remote <video> only.
                Local mic is toggled by the "Start mic / Pause mic" button
                further down (that one drives STT + transcript). */}
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm">
              <button
                type="button"
                onClick={() => {
                  setRemoteMuted((m) => {
                    const next = !m;
                    if (!next && remoteVolume === 0) {
                      // un-muting from a 0-volume state — restore last audible level
                      setRemoteVolume(lastNonZeroVolumeRef.current || 1);
                    }
                    return next;
                  });
                }}
                aria-label={remoteMuted ? "Unmute partner" : "Mute partner"}
                title={remoteMuted ? "Unmute partner" : "Mute partner"}
                className={`rounded-lg px-2.5 py-1.5 text-base ${
                  remoteMuted
                    ? "bg-rose-100 text-rose-700 hover:bg-rose-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {remoteMuted || remoteVolume === 0 ? "🔇" : "🔊"}
              </button>
              <label htmlFor="remote-volume" className="text-xs font-semibold text-gray-600">
                Partner volume
              </label>
              <input
                id="remote-volume"
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={remoteVolume}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setRemoteVolume(v);
                  if (v > 0) {
                    lastNonZeroVolumeRef.current = v;
                    if (remoteMuted) setRemoteMuted(false);
                  } else {
                    setRemoteMuted(true);
                  }
                }}
                className="flex-1 accent-brand-600"
              />
              <span className="w-10 text-right text-xs tabular-nums text-gray-500">
                {Math.round((remoteMuted ? 0 : remoteVolume) * 100)}%
              </span>
            </div>
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
                        t.sender_role === "doctor" ? "text-brand-700" : "text-emerald-700"
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

        {/* Mic-silent warning — visible feedback for phone users without DevTools. */}
        {stt.silentTooLong && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800 leading-relaxed">
            🚫 <strong>Your mic seems silent.</strong> Check your phone/laptop mic permission for this site, close other apps using the mic (Zoom, Meet, FaceTime), then refresh.
          </div>
        )}

        {/* Explicit mic toggle — auto-start fails silently in strict browsers
            without a user gesture. This button gives a clear gesture handle. */}
        {stt.supported && (
          <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 shadow-sm">
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  stt.state === "recording" ? "animate-pulse bg-rose-500" : "bg-gray-300"
                }`}
              />
              <span className="font-semibold text-gray-700">
                {stt.state === "recording" ? "🎤 Listening — speak naturally" : "🎤 Mic is off"}
              </span>
              {stt.state === "recording" && stt.displayTranscript && (
                <span className="ml-2 truncate text-xs italic text-gray-500">
                  &ldquo;{stt.displayTranscript}&rdquo;
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                if (stt.state === "recording") void stt.stopRecording();
                else void stt.startRecording();
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                stt.state === "recording"
                  ? "bg-rose-100 text-rose-700 hover:bg-rose-200"
                  : "bg-brand-600 text-white hover:bg-brand-700"
              }`}
            >
              {stt.state === "recording" ? "Pause mic" : "Start mic"}
            </button>
            </div>
          </div>
        )}
        {!stt.supported && (
          <p className="text-xs text-amber-600">
            Speech recognition not supported in this browser. Use Chrome / Edge / Safari for the live transcript. Video + audio still work.
          </p>
        )}
        {stt.permissionDenied && (
          <p className="text-xs text-rose-600">⚠️ Microphone permission denied. Click the lock icon in the address bar to allow it.</p>
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
        className="mt-4 inline-block rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-brand-700"
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
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Scenario</p>
      <p className="mt-2 whitespace-pre-line text-base leading-relaxed text-gray-900">
        {stem.visiblePatientContext}
      </p>
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

      <div className="rounded-2xl border border-brand-200 bg-brand-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-800">Volunteer naturally</p>
        <ul className="mt-2 space-y-1 text-sm text-brand-900">
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
