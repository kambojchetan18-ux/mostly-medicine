import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { Link } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import FunLoading from '@/components/FunLoading';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSignup() {
    if (!name || !email || !password) return;
    if (password.length < 8) { Alert.alert('Password too short', 'Minimum 8 characters'); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } },
    });
    setLoading(false);
    if (error) Alert.alert('Signup failed', error.message);
    else setDone(true);
  }

  if (done) {
    return (
      <LinearGradient colors={['#0f172a', '#1e1b4b']} style={styles.gradient}>
        <View style={styles.centerBox}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>📧</Text>
          <Text style={styles.doneTitle}>Check your email</Text>
          <Text style={styles.doneSub}>We sent a confirmation link to {email}</Text>
          <Link href="/auth/login" asChild>
            <TouchableOpacity style={styles.btn}>
              <Text style={styles.btnText}>Back to Login</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0f172a', '#1e1b4b']} style={styles.gradient}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.logoRow}>
            <Text style={styles.logoMostly}>Mostly</Text>
            <Text style={styles.logoMedicine}> Medicine</Text>
          </View>
          <Text style={styles.tagline}>Free forever · Start preparing today</Text>

          <View style={styles.card}>
            <Text style={styles.title}>Create your account</Text>
            <Text style={styles.subtitle}>Join thousands of IMGs preparing for AMC</Text>

            {[
              { label: 'Full Name', value: name, set: setName, placeholder: 'Dr. Your Name', type: 'default' as const },
              { label: 'Email', value: email, set: setEmail, placeholder: 'doctor@email.com', type: 'email-address' as const },
              { label: 'Password', value: password, set: setPassword, placeholder: '••••••••', type: 'default' as const, secure: true },
            ].map((f) => (
              <View key={f.label} style={styles.field}>
                <Text style={styles.label}>{f.label}</Text>
                <TextInput
                  style={styles.input}
                  value={f.value}
                  onChangeText={f.set}
                  keyboardType={f.type}
                  autoCapitalize={f.type === 'email-address' ? 'none' : 'words'}
                  secureTextEntry={f.secure}
                  placeholder={f.placeholder}
                  placeholderTextColor="#64748b"
                />
              </View>
            ))}

            <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={handleSignup} disabled={loading} accessibilityRole="button" accessibilityLabel={loading ? 'Creating account' : 'Create account'}>
              {loading ? (
                <FunLoading
                  pool={[
                    '🔑 Unlocking your account…',
                    '👋 Saying hello to Supabase…',
                  ]}
                />
              ) : (
                <Text style={styles.btnText}>Sign Up Free</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Link href="/auth/login" asChild>
                <TouchableOpacity><Text style={styles.link}>Log in</Text></TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  doneTitle: { fontSize: 22, fontWeight: '700', color: '#f1f5f9', marginBottom: 8 },
  doneSub: { color: '#94a3b8', fontSize: 14, textAlign: 'center', marginBottom: 32 },
  logoRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 4 },
  logoMostly: { fontSize: 32, fontWeight: '800', color: '#a78bfa' },
  logoMedicine: { fontSize: 32, fontWeight: '800', color: '#fff' },
  tagline: { textAlign: 'center', color: '#64748b', fontSize: 13, marginBottom: 32 },
  card: { backgroundColor: '#1e293b', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#334155' },
  title: { fontSize: 22, fontWeight: '700', color: '#f1f5f9', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#64748b', marginBottom: 24 },
  field: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#94a3b8', marginBottom: 6 },
  input: {
    backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#334155',
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 13,
    color: '#f1f5f9', fontSize: 15,
  },
  btn: { backgroundColor: '#7c3aed', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { color: '#64748b', fontSize: 13 },
  link: { color: '#a78bfa', fontWeight: '600', fontSize: 13 },
});
