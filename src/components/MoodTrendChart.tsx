import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '../theme';
import type { MoodEntry } from '../types';
import { MOOD_OPTIONS } from './MoodPicker';

interface Props {
  entries: MoodEntry[];
  days?: number;
}

export default function MoodTrendChart({ entries, days = 14 }: Props) {
  const today = new Date();
  const byDate = new Map(entries.map((entry) => [entry.date, entry]));

  const bars = Array.from({ length: days }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (days - 1 - i));
    const key = date.toISOString().slice(0, 10);
    return { key, entry: byDate.get(key) };
  });

  const hasAnyData = bars.some((bar) => bar.entry);

  if (!hasAnyData) {
    return (
      <View style={styles.emptyState}>
        <Text style={typography.bodyMuted}>
          Log your mood daily to see how you are trending over time.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.chart}>
      {bars.map((bar) => {
        const height = bar.entry ? 16 + bar.entry.mood * 12 : 6;
        const color = bar.entry
          ? MOOD_COLOR[bar.entry.mood]
          : colors.border;
        return (
          <View key={bar.key} style={styles.barColumn}>
            <View style={[styles.bar, { height, backgroundColor: color }]} />
          </View>
        );
      })}
    </View>
  );
}

const MOOD_COLOR: Record<number, string> = {
  1: '#C1666B',
  2: '#D99B7A',
  3: '#D9C56B',
  4: '#8FA98C',
  5: '#6FA88A',
};

const styles = StyleSheet.create({
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 90,
    gap: 3,
  },
  barColumn: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%' },
  bar: { width: '100%', borderRadius: radii.sm },
  emptyState: {
    height: 90,
    justifyContent: 'center',
    padding: spacing.sm,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.md,
  },
});

export { MOOD_OPTIONS };
