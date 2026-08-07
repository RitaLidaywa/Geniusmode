import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation/RootNavigator';
import OnboardingScreen from './src/screens/OnboardingScreen';
import LockScreen from './src/screens/LockScreen';
import { colors } from './src/theme';
import { getSettings } from './src/storage/db';
import type { AppSettings } from './src/types';

export default function App() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const appState = useRef<AppStateStatus>(AppState.currentState);

  const loadSettings = useCallback(async () => {
    const loaded = await getSettings();
    setSettings(loaded);
    if (!loaded.appLockEnabled) setUnlocked(true);
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      const cameToForeground =
        appState.current.match(/inactive|background/) && nextState === 'active';
      if (cameToForeground && settings?.appLockEnabled) {
        setUnlocked(false);
      }
      appState.current = nextState;
    });
    return () => subscription.remove();
  }, [settings]);

  if (!settings) {
    return <View style={styles.blank} />;
  }

  if (!settings.hasCompletedOnboarding) {
    return (
      <SafeAreaProvider>
        <OnboardingScreen onDone={loadSettings} />
        <StatusBar style="dark" />
      </SafeAreaProvider>
    );
  }

  if (settings.appLockEnabled && !unlocked) {
    return (
      <SafeAreaProvider>
        <LockScreen onUnlock={() => setUnlocked(true)} />
        <StatusBar style="dark" />
      </SafeAreaProvider>
    );
  }

  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
        <StatusBar style="dark" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  blank: { flex: 1, backgroundColor: colors.background },
});
