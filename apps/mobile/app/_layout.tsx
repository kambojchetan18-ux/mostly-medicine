import { Stack } from 'expo-router';
import React from 'react';
import { View, Text, ScrollView } from 'react-native';

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {error: Error | null}> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <View style={{ flex: 1, padding: 20, marginTop: 50 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'red' }}>App Error:</Text>
          <ScrollView>
            <Text style={{ marginTop: 10 }}>{String(this.state.error)}</Text>
          </ScrollView>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <Stack screenOptions={{ headerShown: false }} />
    </ErrorBoundary>
  );
}
