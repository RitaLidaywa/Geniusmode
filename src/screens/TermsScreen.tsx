import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import { spacing, typography } from '../theme';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={typography.subheading}>{title}</Text>
      <Text style={[typography.bodyMuted, styles.body]}>{children}</Text>
    </View>
  );
}

export default function TermsScreen() {
  return (
    <ScreenContainer>
      <Text style={typography.title}>Terms of Use</Text>
      <Text style={[typography.caption, styles.updated]}>Last updated: 2026-08-07</Text>

      <Section title="Not a medical or crisis service">
        I Miss Them, But... is a self-help tool intended to support healthy coping after a
        breakup or relationship conflict. It is not therapy, counseling, or a medical device, and
        it does not diagnose or treat any condition. It is not a crisis service and cannot detect
        or respond to emergencies. If you are in crisis or thinking about harming yourself, contact
        emergency services or a crisis line in your area immediately.
      </Section>

      <Section title="Intended use">
        This app is meant to support the person using it in their own healing. It is not designed
        or intended to monitor, contact, or communicate with any other person, and should not be
        used to harass, surveil, or pressure anyone.
      </Section>

      <Section title="Your content">
        Everything you write in this app — journal entries, letters, reframes, mood notes — stays
        on your device and belongs to you. We do not access, review, or claim ownership of it.
      </Section>

      <Section title="No warranty">
        This app is provided "as is" without warranties of any kind. We do our best to keep it
        working correctly, but we cannot guarantee it will be error-free or uninterrupted.
      </Section>

      <Section title="Limitation of liability">
        To the fullest extent permitted by law, the developer is not liable for any indirect,
        incidental, or consequential damages arising from your use of this app. Use your own
        judgment about your wellbeing and seek professional help when you need it.
      </Section>

      <Section title="Changes">
        These terms may be updated as the app evolves. Continued use of the app after an update
        means you accept the revised terms.
      </Section>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  updated: { marginTop: spacing.xs, marginBottom: spacing.lg },
  section: { marginBottom: spacing.lg },
  body: { marginTop: spacing.xs },
});
