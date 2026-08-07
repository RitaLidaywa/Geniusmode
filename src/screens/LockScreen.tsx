import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import Button from '../components/Button';
import { colors, spacing, typography } from '../theme';

export default function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [error, setError] = useState<string | null>(null);

  const authenticate = useCallback(async () => {
    setError(null);
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock I miss them, but...',
    });
    if (result.success) {
      onUnlock();
    } else {
      setError('Authentication was not completed. Try again.');
    }
  }, [onUnlock]);

  useEffect(() => {
    authenticate();
  }, [authenticate]);

  return (
    <View style={styles.container}>
      <Text style={typography.heading}>This app is locked</Text>
      <Text style={[typography.bodyMuted, styles.subtitle]}>
        Verify it's you to see your private space.
      </Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <Button label="Unlock" onPress={authenticate} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  subtitle: { marginTop: spacing.sm, textAlign: 'center' },
  error: { ...typography.bodyMuted, color: colors.danger, marginTop: spacing.md },
  button: { marginTop: spacing.xl, minWidth: 160 },
});
