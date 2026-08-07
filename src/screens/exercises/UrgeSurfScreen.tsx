import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { colors, spacing, typography } from '../../theme';

const STAGES = [
  {
    seconds: 30,
    title: 'Notice the urge',
    text: 'You want to reach out. That is okay — you do not have to act on it. Just notice how it feels in your body right now.',
  },
  {
    seconds: 30,
    title: 'Breathe through it',
    text: 'Breathe in for 4 counts, hold for 4, out for 6. Urges are like waves — they rise, peak, and fall on their own.',
  },
  {
    seconds: 30,
    title: 'Remind yourself why',
    text: 'Think of one reason you chose no contact. You do not need to convince anyone else, just yourself.',
  },
  {
    seconds: 30,
    title: 'You made it',
    text: 'The urge has likely eased. Every time you ride one out instead of acting on it, it gets a little easier next time.',
  },
];

export default function UrgeSurfScreen() {
  const [stageIndex, setStageIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(STAGES[0].seconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const start = () => {
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setStageIndex((prevStage) => {
            const nextStage = Math.min(prevStage + 1, STAGES.length - 1);
            setSecondsLeft(STAGES[nextStage].seconds);
            if (nextStage === STAGES.length - 1 && prevStage === STAGES.length - 1) {
              if (intervalRef.current) clearInterval(intervalRef.current);
              setRunning(false);
            }
            return nextStage;
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
    setStageIndex(0);
    setSecondsLeft(STAGES[0].seconds);
  };

  const stage = STAGES[stageIndex];

  return (
    <ScreenContainer>
      <Text style={typography.title}>Ride out the urge</Text>
      <Text style={[typography.bodyMuted, styles.subtitle]}>
        A two-minute guided pause for when you feel the pull to reach out.
      </Text>

      <Card style={styles.stageCard}>
        <Text style={styles.timer}>{secondsLeft}s</Text>
        <Text style={typography.subheading}>{stage.title}</Text>
        <Text style={[typography.body, styles.stageText]}>{stage.text}</Text>
        <View style={styles.dots}>
          {STAGES.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, index <= stageIndex && styles.dotActive]}
            />
          ))}
        </View>
      </Card>

      {!running ? (
        <Button
          label={stageIndex === 0 ? 'Begin' : 'Start over'}
          onPress={() => {
            reset();
            start();
          }}
        />
      ) : (
        <Button label="Cancel" variant="secondary" onPress={reset} />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  subtitle: { marginTop: spacing.xs, marginBottom: spacing.lg },
  stageCard: {
    alignItems: 'center',
    backgroundColor: colors.skySoft,
    paddingVertical: spacing.xl,
    marginBottom: spacing.lg,
  },
  timer: { fontSize: 40, fontWeight: '800', color: colors.primaryDark, marginBottom: spacing.sm },
  stageText: { textAlign: 'center', marginTop: spacing.sm },
  dots: { flexDirection: 'row', marginTop: spacing.lg, gap: spacing.xs },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.primary },
});
