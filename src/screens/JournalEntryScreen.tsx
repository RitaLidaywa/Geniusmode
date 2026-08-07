import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../components/ScreenContainer';
import Button from '../components/Button';
import { colors, radii, spacing, typography } from '../theme';
import { deleteJournalEntry, getJournalEntries, saveJournalEntry } from '../storage/db';
import { getPromptForDate } from '../data/prompts';
import type { JournalStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<JournalStackParamList, 'JournalEntry'>;

export default function JournalEntryScreen({ route, navigation }: Props) {
  const { entryId, prompt: initialPrompt } = route.params ?? {};
  const [prompt, setPrompt] = useState(initialPrompt ?? getPromptForDate(new Date()));
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const isEditingExisting = Boolean(entryId);

  useEffect(() => {
    if (!entryId) return;
    getJournalEntries().then((entries) => {
      const existing = entries.find((entry) => entry.id === entryId);
      if (existing) {
        setPrompt(existing.prompt);
        setText(existing.text);
      }
    });
  }, [entryId]);

  const handleSave = async () => {
    if (!text.trim()) {
      Alert.alert('Nothing to save yet', 'Write a few words before saving your entry.');
      return;
    }
    setSaving(true);
    const today = new Date().toISOString().slice(0, 10);
    await saveJournalEntry({ date: today, prompt, text: text.trim() });
    setSaving(false);
    navigation.goBack();
  };

  const handleDelete = () => {
    if (!entryId) return;
    Alert.alert('Delete this entry?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteJournalEntry(entryId);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScreenContainer>
      <Text style={styles.prompt}>{prompt}</Text>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Start writing..."
        placeholderTextColor={colors.textFaint}
        value={text}
        onChangeText={setText}
        autoFocus={!isEditingExisting}
        textAlignVertical="top"
      />
      <Button label="Save entry" onPress={handleSave} loading={saving} style={styles.save} />
      {isEditingExisting && (
        <Button label="Delete entry" variant="danger" onPress={handleDelete} style={styles.save} />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  prompt: { ...typography.heading, marginBottom: spacing.md },
  input: {
    minHeight: 220,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    ...typography.body,
  },
  save: { marginTop: spacing.lg },
});
