import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../components/ScreenContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import { colors, spacing, typography } from '../theme';
import { getJournalEntries } from '../storage/db';
import { getPromptForDate } from '../data/prompts';
import type { JournalEntry } from '../types';
import type { JournalStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<JournalStackParamList, 'JournalList'>;

export default function JournalListScreen({ navigation }: Props) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useFocusEffect(
    useCallback(() => {
      getJournalEntries().then(setEntries);
    }, []),
  );

  const todayPrompt = getPromptForDate(new Date());

  return (
    <ScreenContainer scroll={false}>
      <Text style={typography.title}>Journal</Text>
      <Text style={[typography.bodyMuted, styles.subtitle]}>
        A private space to process what you're feeling. Only you can see this.
      </Text>

      <Card style={styles.promptCard}>
        <Text style={styles.promptLabel}>Today's prompt</Text>
        <Text style={styles.promptText}>{todayPrompt}</Text>
        <Button
          label="Start writing"
          onPress={() => navigation.navigate('JournalEntry', { prompt: todayPrompt })}
          style={styles.promptButton}
        />
      </Card>

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={[typography.bodyMuted, styles.empty]}>
            Your past entries will show up here once you write your first one.
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('JournalEntry', { entryId: item.id })}
          >
            <Card style={styles.entryCard}>
              <Text style={typography.caption}>
                {new Date(item.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
              <Text style={styles.entryPrompt}>{item.prompt}</Text>
              <Text numberOfLines={2} style={typography.bodyMuted}>
                {item.text}
              </Text>
            </Card>
          </Pressable>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  subtitle: { marginTop: spacing.xs, marginBottom: spacing.lg },
  promptCard: { backgroundColor: colors.skySoft, marginBottom: spacing.lg },
  promptLabel: { ...typography.caption, marginBottom: spacing.xs },
  promptText: { ...typography.subheading, marginBottom: spacing.md },
  promptButton: { alignSelf: 'flex-start' },
  listContent: { paddingBottom: spacing.xxl },
  entryCard: { marginBottom: spacing.sm },
  entryPrompt: { ...typography.subheading, marginVertical: spacing.xs },
  empty: { textAlign: 'center', marginTop: spacing.xl },
});
