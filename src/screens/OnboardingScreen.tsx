import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import { colors, spacing, typography } from '../theme';
import { getSettings, saveSettings } from '../storage/db';

export default function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const [saving, setSaving] = useState(false);

  const handleContinue = async () => {
    setSaving(true);
    const settings = await getSettings();
    await saveSettings({ ...settings, hasCompletedOnboarding: true });
    setSaving(false);
    onDone();
  };

  return (
    <ScreenContainer>
      <Text style={typography.title}>I miss them, but...</Text>
      <Text style={[typography.bodyMuted, styles.subtitle]}>
        This is a space just for you — to process a breakup or a painful falling-out at your own
        pace, without focusing on anyone but your own healing.
      </Text>

      <Card style={styles.card}>
        <Text style={typography.subheading}>A few things to know</Text>
        <Text style={[typography.bodyMuted, styles.item]}>
          • Everything you write stays on this device. Nothing is uploaded anywhere.
        </Text>
        <Text style={[typography.bodyMuted, styles.item]}>
          • This app is a self-help tool, not therapy or a crisis service.
        </Text>
        <Text style={[typography.bodyMuted, styles.item]}>
          • It is meant to help you heal — not to track, contact, or affect anyone else.
        </Text>
      </Card>

      <Button label="I'm ready" onPress={handleContinue} loading={saving} style={styles.button} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  subtitle: { marginTop: spacing.md, marginBottom: spacing.lg },
  card: { backgroundColor: colors.sageSoft },
  item: { marginTop: spacing.sm },
  button: { marginTop: spacing.xl },
});
