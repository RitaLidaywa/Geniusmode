import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../../components/ScreenContainer';
import Button from '../../components/Button';
import { colors, radii, spacing, typography } from '../../theme';
import { deleteUnsentLetter, getUnsentLetters, saveUnsentLetter } from '../../storage/db';
import type { ToolkitStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ToolkitStackParamList, 'UnsentLetterCompose'>;

export default function UnsentLetterComposeScreen({ route, navigation }: Props) {
  const letterId = route.params?.letterId;
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!letterId) return;
    getUnsentLetters().then((letters) => {
      const existing = letters.find((letter) => letter.id === letterId);
      if (existing) {
        setTitle(existing.title);
        setText(existing.text);
      }
    });
  }, [letterId]);

  const handleSave = async () => {
    if (!text.trim()) {
      Alert.alert('Nothing to save yet', 'Write something before saving.');
      return;
    }
    setSaving(true);
    await saveUnsentLetter({ title: title.trim(), text: text.trim() });
    setSaving(false);
    navigation.goBack();
  };

  const handleDelete = () => {
    if (!letterId) return;
    Alert.alert('Delete this letter?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteUnsentLetter(letterId);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScreenContainer>
      <Text style={typography.bodyMuted}>
        Write freely. No one will ever read this unless you choose to.
      </Text>
      <TextInput
        style={styles.titleInput}
        placeholder="Give it a title (optional)"
        placeholderTextColor={colors.textFaint}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.bodyInput}
        multiline
        placeholder="Dear..."
        placeholderTextColor={colors.textFaint}
        value={text}
        onChangeText={setText}
        textAlignVertical="top"
      />
      <Button label="Save letter" onPress={handleSave} loading={saving} style={styles.save} />
      {letterId && (
        <Button label="Delete letter" variant="danger" onPress={handleDelete} style={styles.save} />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  titleInput: {
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.sm,
    ...typography.subheading,
  },
  bodyInput: {
    marginTop: spacing.md,
    minHeight: 220,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.md,
    ...typography.body,
  },
  save: { marginTop: spacing.lg },
});
