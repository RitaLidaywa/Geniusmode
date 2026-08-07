import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { colors, spacing, typography } from '../../theme';
import { getUnsentLetters } from '../../storage/db';
import type { UnsentLetter } from '../../types';
import type { ToolkitStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ToolkitStackParamList, 'UnsentLetterList'>;

export default function UnsentLetterListScreen({ navigation }: Props) {
  const [letters, setLetters] = useState<UnsentLetter[]>([]);

  useFocusEffect(
    useCallback(() => {
      getUnsentLetters().then(setLetters);
    }, []),
  );

  return (
    <ScreenContainer scroll={false}>
      <Text style={typography.title}>Unsent letters</Text>
      <Text style={[typography.bodyMuted, styles.subtitle]}>
        These are never sent anywhere. They exist so you can say what you need to.
      </Text>
      <Button
        label="Write a new letter"
        onPress={() => navigation.navigate('UnsentLetterCompose', undefined)}
        style={styles.newButton}
      />
      <FlatList
        data={letters}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={[typography.bodyMuted, styles.empty]}>No letters yet.</Text>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('UnsentLetterCompose', { letterId: item.id })}
          >
            <Card style={styles.letterCard}>
              <Text style={typography.subheading}>{item.title || 'Untitled letter'}</Text>
              <Text style={typography.caption}>
                {new Date(item.date).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
              <Text numberOfLines={2} style={[typography.bodyMuted, styles.preview]}>
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
  newButton: { marginBottom: spacing.md },
  listContent: { paddingBottom: spacing.xxl },
  letterCard: { marginBottom: spacing.sm },
  preview: { marginTop: spacing.xs },
  empty: { textAlign: 'center', marginTop: spacing.xl, color: colors.textFaint },
});
