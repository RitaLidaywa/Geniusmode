import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import ScreenContainer from '../components/ScreenContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import MoodTrendChart from '../components/MoodTrendChart';
import { colors, spacing, typography } from '../theme';
import { getMoodEntries, getStreak, resetStreak } from '../storage/db';
import type { MoodEntry, StreakData } from '../types';
import type { HomeStackParamList, RootTabParamList } from '../navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'Home'>;

function daysSince(iso: string): number {
  const start = new Date(iso);
  const now = new Date();
  const ms = now.getTime() - start.getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

export default function HomeScreen({ navigation }: Props) {
  const tabNavigation =
    navigation.getParent<BottomTabNavigationProp<RootTabParamList>>();
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);

  const load = useCallback(async () => {
    const [streakData, moods] = await Promise.all([getStreak(), getMoodEntries()]);
    setStreak(streakData);
    setMoodEntries(moods);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const handleReset = async () => {
    const updated = await resetStreak();
    setStreak(updated);
  };

  const days = streak ? daysSince(streak.startDate) : 0;

  return (
    <ScreenContainer>
      <Text style={typography.title}>Hi, glad you're here</Text>
      <Text style={[typography.bodyMuted, styles.subtitle]}>
        One honest day at a time. Here's where you stand today.
      </Text>

      <Card style={styles.streakCard}>
        <Text style={styles.streakLabel}>Days of no contact</Text>
        <Text style={styles.streakNumber}>{days}</Text>
        <Text style={typography.bodyMuted}>
          {streak?.longestStreakDays
            ? `Longest streak so far: ${streak.longestStreakDays} days`
            : 'This is your first streak — every day counts.'}
        </Text>
        <View style={styles.streakActions}>
          <Button label="I reached out — reset" variant="secondary" onPress={handleReset} />
        </View>
      </Card>

      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={typography.subheading}>Mood, last 14 days</Text>
        </View>
        <MoodTrendChart entries={moodEntries} />
      </Card>

      <View style={styles.quickActions}>
        <QuickAction title="Log today's mood" onPress={() => tabNavigation?.navigate('MoodTab')} />
        <QuickAction
          title="Write in your journal"
          onPress={() => tabNavigation?.navigate('JournalTab')}
        />
        <QuickAction
          title="Open the coping toolkit"
          onPress={() => tabNavigation?.navigate('ToolkitTab')}
        />
      </View>

      <Card style={[styles.section, styles.crisisCard]}>
        <Text style={typography.subheading}>If things feel like too much</Text>
        <Text style={[typography.bodyMuted, styles.crisisText]}>
          This app is a self-help tool and not a substitute for professional support. If you are
          in crisis or thinking about harming yourself, please reach out to a crisis line or
          emergency services in your area.
        </Text>
        <Button
          label="See crisis resources"
          variant="ghost"
          onPress={() => tabNavigation?.navigate('SettingsTab', { screen: 'Crisis' })}
        />
      </Card>
    </ScreenContainer>
  );
}

function QuickAction({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Card style={styles.quickActionCard}>
      <Text style={styles.quickActionText}>{title}</Text>
      <Button label="Go" variant="ghost" onPress={onPress} />
    </Card>
  );
}

const styles = StyleSheet.create({
  subtitle: { marginTop: spacing.xs, marginBottom: spacing.lg },
  streakCard: { alignItems: 'flex-start', backgroundColor: colors.sageSoft },
  streakLabel: { ...typography.subheading, color: colors.primaryDark },
  streakNumber: { fontSize: 56, fontWeight: '800', color: colors.primaryDark, marginVertical: spacing.xs },
  streakActions: { marginTop: spacing.md, alignSelf: 'stretch' },
  section: { marginTop: spacing.lg },
  sectionHeader: { marginBottom: spacing.sm },
  quickActions: { marginTop: spacing.lg, gap: spacing.sm },
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  quickActionText: { ...typography.body, flex: 1 },
  crisisCard: { backgroundColor: colors.dangerSoft },
  crisisText: { marginTop: spacing.xs, marginBottom: spacing.sm },
});
