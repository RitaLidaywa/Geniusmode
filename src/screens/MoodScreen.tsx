import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenContainer from '../components/ScreenContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import MoodPicker from '../components/MoodPicker';
import MoodTrendChart from '../components/MoodTrendChart';
import { colors, radii, spacing, typography } from '../theme';
import { getMoodEntries, saveMoodEntry } from '../storage/db';
import type { MoodEntry, MoodValue } from '../types';

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function MoodScreen() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<MoodValue | undefined>();
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const all = await getMoodEntries();
    setEntries(all);
    const today = all.find((entry) => entry.date === todayKey());
    if (today) {
      setSelectedMood(today.mood);
      setNote(today.note ?? '');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const handleSave = async () => {
    if (!selectedMood) return;
    setSaving(true);
    await saveMoodEntry({ date: todayKey(), mood: selectedMood, note: note.trim() || undefined });
    await load();
    setSaving(false);
  };

  return (
    <ScreenContainer>
      <Text style={typography.title}>Mood</Text>
      <Text style={[typography.bodyMuted, styles.subtitle]}>
        Checking in daily helps you notice progress you might otherwise miss.
      </Text>

      <Card>
        <Text style={typography.subheading}>How are you feeling today?</Text>
        <MoodPicker value={selectedMood} onChange={setSelectedMood} />
        <TextInput
          style={styles.noteInput}
          placeholder="Optional note about today..."
          placeholderTextColor={colors.textFaint}
          value={note}
          onChangeText={setNote}
          multiline
        />
        <Button
          label="Save today's mood"
          onPress={handleSave}
          disabled={!selectedMood}
          loading={saving}
          style={styles.saveButton}
        />
      </Card>

      <Card style={styles.section}>
        <Text style={typography.subheading}>Last 14 days</Text>
        <View style={styles.chartWrapper}>
          <MoodTrendChart entries={entries} />
        </View>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  subtitle: { marginTop: spacing.xs, marginBottom: spacing.lg },
  noteInput: {
    marginTop: spacing.md,
    minHeight: 60,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.sm,
    ...typography.body,
  },
  saveButton: { marginTop: spacing.md },
  section: { marginTop: spacing.lg },
  chartWrapper: { marginTop: spacing.sm },
});
