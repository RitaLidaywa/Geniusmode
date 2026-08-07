import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '../theme';
import type { MoodValue } from '../types';

const MOOD_OPTIONS: { value: MoodValue; emoji: string; label: string }[] = [
  { value: 1, emoji: '😢', label: 'Awful' },
  { value: 2, emoji: '😔', label: 'Low' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😄', label: 'Great' },
];

interface Props {
  value?: MoodValue;
  onChange: (value: MoodValue) => void;
}

export default function MoodPicker({ value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {MOOD_OPTIONS.map((option) => {
        const selected = value === option.value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityLabel={`Mood: ${option.label}`}
            onPress={() => onChange(option.value)}
            style={[styles.option, selected && styles.optionSelected]}
          >
            <Text style={styles.emoji}>{option.emoji}</Text>
            <Text style={[styles.label, selected && styles.labelSelected]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  option: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: radii.md,
    flex: 1,
    marginHorizontal: 2,
  },
  optionSelected: { backgroundColor: colors.accentSoft },
  emoji: { fontSize: 28 },
  label: { ...typography.caption, marginTop: spacing.xs },
  labelSelected: { color: colors.primaryDark, fontWeight: '700' },
});

export { MOOD_OPTIONS };
