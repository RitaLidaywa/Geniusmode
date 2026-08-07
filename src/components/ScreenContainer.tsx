import React from 'react';
import { ScrollView, StyleSheet, View, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';

interface Props extends ViewProps {
  scroll?: boolean;
}

export default function ScreenContainer({ scroll = true, style, children, ...rest }: Props) {
  const Wrapper = scroll ? ScrollView : View;
  const wrapperProps = scroll
    ? { contentContainerStyle: styles.scrollContent, keyboardShouldPersistTaps: 'handled' as const }
    : { style: styles.content };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Wrapper {...wrapperProps} {...rest} style={scroll ? undefined : [styles.content, style]}>
        {children}
      </Wrapper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: spacing.lg },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxl },
});
