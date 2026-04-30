import { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { supabase } from '@/lib/supabase';
import { scenariosMeta } from '@mostly-medicine/ai';
import type { ScenarioMeta } from '@mostly-medicine/ai';
import FunLoading from '@/components/FunLoading';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

const DIFF_COLOR: Record<string, string> = {
  Easy: '#10b981', Medium: '#f59e0b', Hard: '#ef4444',
};
const DIFF_BG: Record<string, string> = {
  Easy: '#064e3b', Medium: '#713f12', Hard: '#7f1d1d',
};

type Message = { role: 'user' | 'assistant'; content: string };

function getEmoji(profile: string) {
  const f = /female|woman/i.test(profile);
  const m = /male|man/i.test(profile);
  const age = profile.match(/(\d+)[- ]year/i);
  const a = age ? parseInt(age[1]) : 40;
  if (a < 18) return f ? '👧' : '👦';
  if (a >= 65) return f ? '👩‍🦳' : '👴';
  return f ? '👩' : m ? '👨' : '🧑';
}

function fmt(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

const MILESTONES = [
  { time: 60, label: 'Establish rapport — open question' },
  { time: 240, label: 'Focused history taking' },
  { time: 360, label: 'Explanation & management plan' },
  { time: 450, label: 'Safety-netting & close' },
];


export default function RoleplayScreen() {
  const [scenario, setScenario] = useState<ScenarioMeta | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [fetchingFeedback, setFetchingFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [milestone, setMilestone] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const isMutedRef = useRef(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef(0);
  const shownMilestonesRef = useRef<Set<number>>(new Set());
  const scrollRef = useRef<ScrollView>(null);
  const feedbackRequestedRef = useRef(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const transcribingRef = useRef(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  // ── Cleanup any in-flight recording / timer / TTS on unmount ────────────────
  useEffect(() => {
    return () => {
      const rec = recordingRef.current;
      recordingRef.current = null;
      if (rec) {
        rec.stopAndUnloadAsync().catch(() => {});
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      // Stop the patient TTS so it doesn't keep speaking after we unmount.
      Speech.stop();
      // Stop & null the pulse loop in case the screen unmounts while recording.
      pulseLoop.current?.stop();
      pulseLoop.current = null;
    };
  }, []);

  // ── TTS ──────────────────────────────────────────────────────────────────────
  const speakPatient = useCallback((text: string, profile: string) => {
    if (isMutedRef.current) return;
    Speech.stop();
    const isFemale = /female|woman/i.test(profile);
    Speech.speak(text, {
      language: 'en-AU',
      rate: 0.88,
      pitch: isFemale ? 1.1 : 0.9,
      onStart: () => setIsSpeaking(true),
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  }, []);

  function stopSpeaking() {
    Speech.stop();
    setIsSpeaking(false);
  }

  // Mic pulse animation when recording. Cleanup function ensures the loop is
  // stopped if the effect re-runs OR the component unmounts mid-pulse.
  useEffect(() => {
    if (!isRecording) {
      pulseLoop.current?.stop();
      pulseLoop.current = null;
      pulseAnim.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.35, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
    );
    pulseLoop.current = loop;
    loop.start();
    return () => {
      loop.stop();
      if (pulseLoop.current === loop) pulseLoop.current = null;
    };
  }, [isRecording, pulseAnim]);

  async function uploadAudio(uri: string) {
    if (transcribingRef.current) return;
    transcribingRef.current = true;
    setIsTranscribing(true);
    try {
      const token = await getToken();
      if (!token) {
        setVoiceError('Not signed in — cannot transcribe');
        return;
      }
      const form = new FormData();
      // RN FormData accepts { uri, name, type } — cast required for TS
      form.append('audio', { uri, name: 'recording.m4a', type: 'audio/mp4' } as unknown as Blob);
      const res = await fetch(`${API_URL}/api/stt/transcribe`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      if (!res.ok) {
        const detail = await res.text().catch(() => '');
        throw new Error(`Transcribe ${res.status}${detail ? `: ${detail.slice(0, 80)}` : ''}`);
      }
      const data = (await res.json()) as { text?: string; error?: string };
      if (data.error) throw new Error(data.error);
      const text = (data.text ?? '').trim();
      if (text) setInput((curr) => (curr ? `${curr} ${text}` : text).trim());
    } catch (e) {
      setVoiceError(e instanceof Error ? e.message : 'Transcription failed');
    } finally {
      transcribingRef.current = false;
      setIsTranscribing(false);
    }
  }

  async function toggleRecording() {
    setVoiceError(null);
    // Already recording → stop, unload, upload
    if (recordingRef.current) {
      const rec = recordingRef.current;
      recordingRef.current = null;
      setIsRecording(false);
      try {
        await rec.stopAndUnloadAsync();
        const uri = rec.getURI();
        // Reset audio mode so playback (TTS) works at full volume on iOS
        try {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
          });
        } catch { /* ignore */ }
        if (uri) await uploadAudio(uri);
      } catch (e) {
        setVoiceError(e instanceof Error ? e.message : 'Could not stop recording');
      }
      return;
    }
    // Not recording → request permission and start
    stopSpeaking();
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (!perm.granted) {
        setVoiceError('Microphone permission denied');
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });
      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await rec.startAsync();
      recordingRef.current = rec;
      setIsRecording(true);
    } catch (e) {
      recordingRef.current = null;
      setIsRecording(false);
      setVoiceError(e instanceof Error ? e.message : 'Could not start recording');
    }
  }

  // Stop recording without uploading — used when user sends/submits early or ends session
  async function abortRecording() {
    const rec = recordingRef.current;
    recordingRef.current = null;
    setIsRecording(false);
    if (rec) {
      try { await rec.stopAndUnloadAsync(); } catch { /* ignore */ }
    }
  }

  // ── Scroll ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages, loading]);

  // ── Timer ───────────────────────────────────────────────────────────────────
  function startTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
    elapsedRef.current = 0;
    shownMilestonesRef.current = new Set();
    setTimeLeft(480);
    timerRef.current = setInterval(() => {
      elapsedRef.current += 1;
      const elapsed = elapsedRef.current;
      for (let i = 0; i < MILESTONES.length; i++) {
        if (elapsed === MILESTONES[i].time && !shownMilestonesRef.current.has(i)) {
          shownMilestonesRef.current.add(i);
          setMilestone(MILESTONES[i].label);
          setTimeout(() => setMilestone(null), 4000);
        }
      }
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(timerRef.current!); timerRef.current = null; return 0; }
        return prev - 1;
      });
    }, 1000);
  }

  function stopTimer() {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }

  // ── API ─────────────────────────────────────────────────────────────────────
  async function getToken() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? '';
  }

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading || !scenario) return;
    // If still recording when user hits send, abort the recording (don't upload partial)
    if (recordingRef.current) await abortRecording();
    stopSpeaking();
    const newMsgs: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        setMessages([...newMsgs, { role: 'assistant', content: '[Not signed in — cannot send message]' }]);
        setLoading(false);
        return;
      }
      const res = await fetch(`${API_URL}/api/ai/roleplay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ scenarioId: scenario.id, messages: newMsgs }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? 'Server error');
      setMessages([...newMsgs, { role: 'assistant', content: data.reply }]);
      speakPatient(data.reply, scenario?.patientProfile ?? '');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error';
      setMessages([...newMsgs, { role: 'assistant', content: `[${msg}]` }]);
    } finally {
      setLoading(false);
    }
  }, [loading, messages, scenario, speakPatient]);

  const getFeedback = useCallback(async () => {
    if (loading || messages.length <= 1 || !scenario) return;
    if (recordingRef.current) await abortRecording();
    stopTimer();
    setFetchingFeedback(true);
    try {
      const token = await getToken();
      if (!token) {
        setFeedback('Not signed in — cannot retrieve feedback');
        setFetchingFeedback(false);
        return;
      }
      const res = await fetch(`${API_URL}/api/ai/roleplay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ scenarioId: scenario.id, messages, requestFeedback: true }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? 'Server error');
      setFeedback(data.reply);
    } catch (e) {
      setFeedback(`Could not retrieve feedback: ${e instanceof Error ? e.message : 'Error'}`);
    } finally {
      setFetchingFeedback(false);
    }
  }, [loading, messages, scenario]);

  useEffect(() => {
    if (timeLeft === 0 && scenario && messages.length > 1 && !feedbackRequestedRef.current && !loading) {
      feedbackRequestedRef.current = true;
      getFeedback();
    }
  }, [timeLeft, scenario, messages.length, loading, getFeedback]);

  function startScenario(sc: ScenarioMeta) {
    feedbackRequestedRef.current = false;
    setFeedback(null);
    setMessages([{ role: 'assistant', content: sc.openingStatement }]);
    setScenario(sc);
    setInput('');
    setVoiceError(null);
    startTimer();
    // Patient greets you with their opening statement
    setTimeout(() => speakPatient(sc.openingStatement, sc.patientProfile), 600);
  }

  function endSession() {
    if (recordingRef.current) abortRecording();
    stopSpeaking();
    stopTimer();
    setScenario(null);
    setMessages([]);
    setFeedback(null);
    setTimeLeft(0);
    setMilestone(null);
    setInput('');
    setVoiceError(null);
    feedbackRequestedRef.current = false;
  }

  // ── Scenario list ────────────────────────────────────────────────────────────
  if (!scenario) {
    return (
      <View style={s.bg}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={s.header}>
            <TouchableOpacity onPress={() => router.back()} style={s.back}>
              <Ionicons name="arrow-back" size={22} color="#94a3b8" />
            </TouchableOpacity>
            <View>
              <Text style={s.title}>AMC Clinical AI RolePlay</Text>
              <Text style={s.sub}>AI patient · examiner feedback · 8 min</Text>
            </View>
          </View>
          <View style={s.infoBox}>
            <Text style={s.infoText}>
              🎙️ Speak to the AI patient using your voice, or type. Scenarios from AMC Handbook of Clinical Assessment. Get scored feedback at the end.
            </Text>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40, gap: 10 }}>
            {scenariosMeta.map((sc) => (
              <TouchableOpacity key={sc.id} style={s.scenarioCard} onPress={() => startScenario(sc)} activeOpacity={0.7}>
                <View style={s.scenarioTop}>
                  <Text style={s.scenarioEmoji}>{getEmoji(sc.patientProfile)}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={s.scenarioTitle}>{sc.title}</Text>
                    <Text style={s.scenarioMeta}>{sc.subcategory} · Condition {sc.mcatNumber}</Text>
                  </View>
                  <View style={[s.diffBadge, { backgroundColor: DIFF_BG[sc.difficulty] }]}>
                    <Text style={[s.diffText, { color: DIFF_COLOR[sc.difficulty] }]}>{sc.difficulty}</Text>
                  </View>
                </View>
                <Text style={s.scenarioOpening} numberOfLines={2}>"{sc.openingStatement}"</Text>
                <View style={s.taskRow}>
                  {sc.tasks.slice(0, 3).map((t) => (
                    <View key={t} style={s.taskChip}>
                      <Text style={s.taskChipText}>{t}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  // ── Fetching feedback ────────────────────────────────────────────────────────
  if (fetchingFeedback) {
    return (
      <View style={[s.bg, s.center]}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>📋</Text>
        <Text style={s.title}>Generating feedback…</Text>
        <Text style={[s.sub, { textAlign: 'center', marginTop: 8 }]}>Reviewing against AMC performance guidelines</Text>
        <FunLoading
          style={{ marginTop: 24 }}
          pool={[
            '🤔 Patient is thinking…',
            '💭 Recalling symptoms…',
          ]}
        />
      </View>
    );
  }

  // ── Examiner feedback ────────────────────────────────────────────────────────
  if (feedback) {
    return (
      <View style={s.bg}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={s.header}>
            <TouchableOpacity onPress={endSession} style={s.back}>
              <Ionicons name="arrow-back" size={22} color="#94a3b8" />
            </TouchableOpacity>
            <Text style={s.title}>Examiner Feedback</Text>
          </View>
          <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
            <Text style={s.scenarioTitle}>{scenario.title}</Text>
            <View style={s.feedbackBox}>
              <Text style={s.feedbackText}>{feedback}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
              <TouchableOpacity style={s.btnSecondary} onPress={endSession}>
                <Text style={s.btnSecondaryText}>All Scenarios</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.btnPrimary} onPress={() => startScenario(scenario)}>
                <Text style={s.btnPrimaryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  // ── Active session ───────────────────────────────────────────────────────────
  const emoji = getEmoji(scenario.patientProfile);
  const timerColor = timeLeft <= 60 ? '#ef4444' : timeLeft <= 120 ? '#f59e0b' : '#f1f5f9';
  const canSend = !!input.trim() && !loading;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={0}>
      <View style={s.bg}>
        <SafeAreaView style={{ flex: 1 }}>
          {/* Patient header */}
          <View style={s.sessionHeader}>
            <View style={s.patientInfo}>
              <Text style={{ fontSize: 32 }}>{emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.sessionTitle} numberOfLines={1}>{scenario.title}</Text>
                <Text style={s.sessionMeta} numberOfLines={1}>{scenario.patientProfile}</Text>
              </View>
            </View>
            <View style={s.sessionRight}>
              <Text style={[s.timer, { color: timerColor }]}>{fmt(timeLeft)}</Text>
              <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                {isSpeaking && (
                  <View style={s.speakingIndicator}>
                    <Text style={s.speakingDots}>●●●</Text>
                  </View>
                )}
                <TouchableOpacity
                  style={[s.exitBtn, isMuted && { borderColor: '#ef4444' }]}
                  onPress={() => { setIsMuted(m => { isMutedRef.current = !m; return !m; }); if (isSpeaking) stopSpeaking(); }}
                >
                  <Ionicons name={isMuted ? 'volume-mute' : 'volume-medium'} size={16} color={isMuted ? '#ef4444' : '#64748b'} />
                </TouchableOpacity>
                {messages.length > 1 && (
                  <TouchableOpacity style={s.feedbackBtn} onPress={() => { feedbackRequestedRef.current = true; getFeedback(); }} disabled={loading}>
                    <Text style={s.feedbackBtnText}>Feedback</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={s.exitBtn} onPress={endSession}>
                  <Ionicons name="close" size={16} color="#64748b" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Milestone banner */}
          {milestone && (
            <View style={s.milestoneBanner}>
              <Text style={s.milestoneText}>📍 {milestone}</Text>
            </View>
          )}

          {/* Messages */}
          <ScrollView ref={scrollRef} style={{ flex: 1 }} contentContainerStyle={{ padding: 14, gap: 10 }} showsVerticalScrollIndicator={false}>
            {messages.map((m, i) => (
              <View key={i} style={[s.msgRow, m.role === 'user' ? s.msgRowUser : s.msgRowAI]}>
                {m.role === 'assistant' && <Text style={s.msgEmoji}>{emoji}</Text>}
                <View style={[s.bubble, m.role === 'user' ? s.bubbleUser : s.bubbleAI]}>
                  {m.role === 'assistant' && <Text style={s.bubbleLabel}>Patient</Text>}
                  <Text style={m.role === 'user' ? s.bubbleTextUser : s.bubbleTextAI}>{m.content}</Text>
                </View>
              </View>
            ))}
            {loading && (
              <View style={s.msgRowAI}>
                <Text style={s.msgEmoji}>{emoji}</Text>
                <View style={s.bubbleAI}>
                  <FunLoading
                    pool={[
                      '🤔 Patient is thinking…',
                      '💭 Recalling symptoms…',
                    ]}
                  />
                </View>
              </View>
            )}
          </ScrollView>

          {/* Voice error */}
          {voiceError && (
            <View style={s.voiceErrorBanner}>
              <Text style={s.voiceErrorText}>⚠️ {voiceError}</Text>
              <TouchableOpacity onPress={() => setVoiceError(null)}>
                <Ionicons name="close" size={14} color="#fca5a5" />
              </TouchableOpacity>
            </View>
          )}

          {/* Input row */}
          <View style={s.inputRow}>
            {/* Mic button */}
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity
                style={[s.micBtn, isRecording && s.micBtnActive]}
                onPress={toggleRecording}
                disabled={loading}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={isRecording ? 'stop' : 'mic'}
                  size={20}
                  color={isRecording ? '#fff' : '#a78bfa'}
                />
              </TouchableOpacity>
            </Animated.View>

            {/* Text input */}
            <TextInput
              style={s.input}
              value={input}
              onChangeText={setInput}
              placeholder={
                isRecording ? 'Recording… tap mic to stop'
                  : isTranscribing ? 'Transcribing…'
                  : 'Tap mic or type…'
              }
              placeholderTextColor={isRecording ? '#a78bfa' : '#475569'}
              multiline
              returnKeyType="send"
              blurOnSubmit
              onSubmitEditing={() => sendMessage(input)}
              editable={!isRecording && !isTranscribing}
            />

            {/* Send button — only active when there's text */}
            <TouchableOpacity
              style={[s.sendBtn, !canSend && s.sendBtnDisabled]}
              onPress={() => sendMessage(input)}
              disabled={!canSend}
            >
              <Ionicons name="send" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Recording / transcribing indicator strip */}
          {isRecording && (
            <View style={s.recordingStrip}>
              <View style={s.recordingDot} />
              <Text style={s.recordingText}>Recording… tap mic again to stop & transcribe</Text>
            </View>
          )}
          {isTranscribing && !isRecording && (
            <View style={s.recordingStrip}>
              <Text style={s.recordingText}>Transcribing your audio…</Text>
            </View>
          )}
        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#0f172a' },
  center: { justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, gap: 12 },
  back: { padding: 4 },
  title: { fontSize: 20, fontWeight: '800', color: '#f1f5f9' },
  sub: { fontSize: 12, color: '#64748b', marginTop: 1 },
  infoBox: { marginHorizontal: 16, marginBottom: 12, backgroundColor: '#1e1b4b', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#4c1d95' },
  infoText: { fontSize: 12, color: '#c4b5fd', lineHeight: 18 },
  scenarioCard: { backgroundColor: '#1e293b', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#334155' },
  scenarioTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  scenarioEmoji: { fontSize: 30, marginTop: 2 },
  scenarioTitle: { fontSize: 14, fontWeight: '700', color: '#f1f5f9', marginBottom: 2 },
  scenarioMeta: { fontSize: 11, color: '#64748b' },
  diffBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
  diffText: { fontSize: 10, fontWeight: '700' },
  scenarioOpening: { fontSize: 12, color: '#475569', fontStyle: 'italic', lineHeight: 18, marginBottom: 8 },
  taskRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  taskChip: { backgroundColor: '#2e1065', borderRadius: 5, paddingHorizontal: 8, paddingVertical: 3 },
  taskChipText: { fontSize: 10, color: '#a78bfa', fontWeight: '600' },
  // Session header
  sessionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#1e293b', borderBottomWidth: 1, borderBottomColor: '#334155' },
  patientInfo: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  sessionTitle: { fontSize: 13, fontWeight: '700', color: '#f1f5f9' },
  sessionMeta: { fontSize: 11, color: '#64748b' },
  sessionRight: { alignItems: 'flex-end', gap: 4 },
  timer: { fontSize: 22, fontWeight: '800', fontVariant: ['tabular-nums'] },
  feedbackBtn: { backgroundColor: '#7c3aed', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  feedbackBtnText: { fontSize: 11, color: '#fff', fontWeight: '700' },
  exitBtn: { backgroundColor: '#1e293b', borderRadius: 8, padding: 5, borderWidth: 1, borderColor: '#334155' },
  speakingIndicator: { backgroundColor: '#1e1b4b', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3 },
  speakingDots: { fontSize: 8, color: '#a78bfa', letterSpacing: 2 },
  milestoneBanner: { backgroundColor: '#1e1b4b', borderBottomWidth: 1, borderBottomColor: '#4c1d95', paddingHorizontal: 14, paddingVertical: 8 },
  milestoneText: { fontSize: 12, color: '#a78bfa', fontWeight: '600' },
  // Messages
  msgRow: { flexDirection: 'row', gap: 8 },
  msgRowUser: { justifyContent: 'flex-end' },
  msgRowAI: { justifyContent: 'flex-start', alignItems: 'flex-end' },
  msgEmoji: { fontSize: 22 },
  bubble: { maxWidth: '78%', borderRadius: 16, padding: 12 },
  bubbleUser: { backgroundColor: '#7c3aed' },
  bubbleAI: { backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155' },
  bubbleLabel: { fontSize: 10, color: '#64748b', fontWeight: '700', marginBottom: 4 },
  bubbleTextUser: { fontSize: 14, color: '#fff', lineHeight: 20 },
  bubbleTextAI: { fontSize: 14, color: '#e2e8f0', lineHeight: 20 },
  // Input
  inputRow: { flexDirection: 'row', gap: 8, padding: 10, backgroundColor: '#1e293b', borderTopWidth: 1, borderTopColor: '#334155', alignItems: 'flex-end' },
  micBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#1e1b4b', borderWidth: 1, borderColor: '#4c1d95', alignItems: 'center', justifyContent: 'center' },
  micBtnActive: { backgroundColor: '#7c3aed', borderColor: '#7c3aed' },
  input: { flex: 1, backgroundColor: '#0f172a', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: '#f1f5f9', borderWidth: 1, borderColor: '#334155', maxHeight: 100 },
  sendBtn: { width: 44, height: 44, backgroundColor: '#7c3aed', borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { opacity: 0.35 },
  // Voice feedback
  voiceErrorBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#450a0a', paddingHorizontal: 14, paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#7f1d1d' },
  voiceErrorText: { fontSize: 12, color: '#fca5a5', flex: 1, marginRight: 8 },
  recordingStrip: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#2e1065', paddingHorizontal: 14, paddingVertical: 6 },
  recordingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ef4444' },
  recordingText: { fontSize: 11, color: '#c4b5fd' },
  // Feedback
  feedbackBox: { backgroundColor: '#1e293b', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#334155', marginTop: 12 },
  feedbackText: { fontSize: 13, color: '#e2e8f0', lineHeight: 20 },
  btnPrimary: { flex: 1, backgroundColor: '#7c3aed', borderRadius: 12, paddingVertical: 13, alignItems: 'center' },
  btnPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  btnSecondary: { flex: 1, backgroundColor: '#1e293b', borderRadius: 12, paddingVertical: 13, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  btnSecondaryText: { color: '#94a3b8', fontWeight: '600', fontSize: 15 },
});
