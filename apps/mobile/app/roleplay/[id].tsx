import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { scenarios } from "@mostly-medicine/ai";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "https://mostlymedicine.com";

type Message = { role: "user" | "assistant"; content: string };

export default function RoleplayScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const scenarioId = parseInt(id ?? "1");
  const scenario = scenarios.find((s) => s.id === scenarioId) ?? scenarios[0];

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello Doctor. I've come in today because I've been having ${scenario.title.toLowerCase()}. It started a few days ago...`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    navigation.setOptions({ title: scenario.title });
  }, [navigation, scenario.title]);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/ai/roleplay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioId, messages: updated }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setMessages([...updated, { role: "assistant", content: data.reply }]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setMessages([...updated, { role: "assistant", content: `Sorry, there was an error: ${msg}` }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
      >
        <View style={styles.scenarioTag}>
          <Text style={styles.scenarioTagText}>{scenario.category} · {scenario.difficulty}</Text>
        </View>

        {messages.map((m, i) => (
          <View key={i} style={[styles.bubble, m.role === "user" ? styles.userBubble : styles.assistantBubble]}>
            {m.role === "assistant" && (
              <Text style={styles.bubbleLabel}>Patient</Text>
            )}
            <Text style={[styles.bubbleText, m.role === "user" && { color: "#fff" }]}>
              {m.content}
            </Text>
          </View>
        ))}

        {loading && (
          <View style={styles.assistantBubble}>
            <Text style={styles.bubbleLabel}>Patient</Text>
            <ActivityIndicator size="small" color="#6b7280" />
          </View>
        )}
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask the patient..."
          placeholderTextColor="#9ca3af"
          style={styles.input}
          multiline
          onSubmitEditing={send}
          returnKeyType="send"
        />
        <TouchableOpacity onPress={send} disabled={loading || !input.trim()} style={[styles.sendBtn, (!input.trim() || loading) && { opacity: 0.5 }]}>
          <Text style={styles.sendBtnText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  messages: { flex: 1 },
  scenarioTag: {
    alignSelf: "center",
    backgroundColor: "#e0f2fe",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 16,
  },
  scenarioTagText: { fontSize: 12, color: "#0369a1", fontWeight: "600" },
  bubble: {
    maxWidth: "80%",
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#0369a1",
  },
  assistantBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  bubbleLabel: { fontSize: 10, fontWeight: "600", color: "#9ca3af", marginBottom: 4 },
  bubbleText: { fontSize: 14, color: "#111827", lineHeight: 20 },
  inputRow: {
    flexDirection: "row",
    gap: 8,
    padding: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
    maxHeight: 100,
  },
  sendBtn: {
    backgroundColor: "#0369a1",
    borderRadius: 12,
    paddingHorizontal: 18,
    justifyContent: "center",
  },
  sendBtnText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
});
