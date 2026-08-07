import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../components/ScreenContainer';
import Card from '../components/Card';
import { colors, spacing, typography } from '../theme';
import type { ToolkitStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<ToolkitStackParamList, 'ToolkitHome'>;

const TOOLS: {
  key: keyof ToolkitStackParamList;
  title: string;
  description: string;
  color: string;
}[] = [
  {
    key: 'Reframe',
    title: 'Reframe a thought',
    description: 'Gently question a painful thought and find a more balanced one.',
    color: colors.skySoft,
  },
  {
    key: 'UrgeSurf',
    title: 'Ride out an urge',
    description: 'A short guided pause for when you want to reach out and know you shouldn\'t.',
    color: colors.sageSoft,
  },
  {
    key: 'UnsentLetterList',
    title: 'Write a letter you\'ll never send',
    description: 'Say everything you need to say — privately, and only for you.',
    color: colors.accentSoft,
  },
];

export default function ToolkitHomeScreen({ navigation }: Props) {
  return (
    <ScreenContainer>
      <Text style={typography.title}>Toolkit</Text>
      <Text style={[typography.bodyMuted, styles.subtitle]}>
        A few exercises for the harder moments.
      </Text>
      {TOOLS.map((tool) => (
        <Pressable key={tool.key} onPress={() => navigation.navigate(tool.key)}>
          <Card style={[styles.card, { backgroundColor: tool.color }]}>
            <Text style={typography.subheading}>{tool.title}</Text>
            <Text style={[typography.bodyMuted, styles.description]}>{tool.description}</Text>
          </Card>
        </Pressable>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  subtitle: { marginTop: spacing.xs, marginBottom: spacing.lg },
  card: { marginBottom: spacing.md },
  description: { marginTop: spacing.xs },
});
