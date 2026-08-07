import React, { Fragment, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../../components/ScreenContainer';
import Button from '../../components/Button';
import { colors, radii, spacing, typography } from '../../theme';
import { saveReframeEntry } from '../../storage/db';
import type { ToolkitStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ToolkitStackParamList, 'Reframe'>;

const STEPS: { key: keyof StepState; title: string; placeholder: string }[] = [
  {
    key: 'situation',
    title: 'What happened, just the facts?',
    placeholder: 'Describe the situation without judgment...',
  },
  {
    key: 'automaticThought',
    title: 'What thought popped into your head?',
    placeholder: 'e.g. "I will never find someone again"',
  },
  {
    key: 'evidenceFor',
    title: 'What evidence supports that thought?',
    placeholder: 'List anything that makes it feel true...',
  },
  {
    key: 'evidenceAgainst',
    title: 'What evidence goes against it?',
    placeholder: 'List anything that challenges it...',
  },
  {
    key: 'balancedThought',
    title: 'What is a more balanced, honest thought?',
    placeholder: 'e.g. "This hurts right now, but it does not define my future"',
  },
];

type StepState = {
  situation: string;
  automaticThought: string;
  evidenceFor: string;
  evidenceAgainst: string;
  balancedThought: string;
};

export default function ReframeScreen({ navigation }: Props) {
  const [values, setValues] = useState<StepState>({
    situation: '',
    automaticThought: '',
    evidenceFor: '',
    evidenceAgainst: '',
    balancedThought: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!values.automaticThought.trim() || !values.balancedThought.trim()) {
      Alert.alert('Almost there', 'Fill in at least the thought and your balanced reframe.');
      return;
    }
    setSaving(true);
    await saveReframeEntry(values);
    setSaving(false);
    Alert.alert('Saved', 'Your reframe has been saved.', [
      { text: 'Done', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <ScreenContainer>
      <Text style={typography.title}>Reframe a thought</Text>
      <Text style={[typography.bodyMuted, styles.subtitle]}>
        Painful thoughts feel like facts. This walks you through checking them.
      </Text>
      {STEPS.map((step) => (
        <Fragment key={step.key}>
          <Text style={styles.stepTitle}>{step.title}</Text>
          <TextInput
            style={styles.input}
            multiline
            placeholder={step.placeholder}
            placeholderTextColor={colors.textFaint}
            value={values[step.key]}
            onChangeText={(text) => setValues((prev) => ({ ...prev, [step.key]: text }))}
          />
        </Fragment>
      ))}
      <Button label="Save this reframe" onPress={handleSave} loading={saving} style={styles.save} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  subtitle: { marginTop: spacing.xs, marginBottom: spacing.lg },
  stepTitle: { ...typography.subheading, marginTop: spacing.md, marginBottom: spacing.xs },
  input: {
    minHeight: 60,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.sm,
    ...typography.body,
  },
  save: { marginTop: spacing.xl },
});
