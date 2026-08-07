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

export default function PrivacyPolicyScreen() {
  return (
    <ScreenContainer>
      <Text style={typography.title}>Privacy Policy</Text>
      <Text style={[typography.caption, styles.updated]}>Last updated: 2026-08-07</Text>

      <Section title="Summary">
        I Miss Them, But... is designed so your personal reflections stay yours. All journal
        entries, mood logs, letters, and streak data are stored only on your device using local
        app storage. Nothing is uploaded to a server, and we do not operate any backend that
        receives your content.
      </Section>

      <Section title="What we collect">
        We do not collect, transmit, or sell any personal data. The app does not require an
        account, email address, or sign-in. We do not use third-party analytics or advertising
        SDKs. No device identifiers, location data, or contacts are accessed or read.
      </Section>

      <Section title="Where your data lives">
        Journal entries, mood check-ins, streak history, thought-reframe worksheets, and unsent
        letters are stored locally on your device using standard mobile app storage. If you
        delete the app, this data is deleted with it. If you enable an optional passcode/biometric
        app lock, authentication is handled by your device's operating system (Face ID, Touch ID,
        or device PIN) — we never see or store your biometric data; it never leaves your device.
      </Section>

      <Section title="Your controls">
        From Settings, you can export a copy of all your data as a file, or permanently delete all
        app data at any time. Deleting data removes it immediately from your device; because
        nothing is stored remotely, there is no other copy to delete.
      </Section>

      <Section title="Children">
        This app is not directed at children under 13 and does not knowingly collect information
        from anyone, including children, because it does not collect information at all.
      </Section>

      <Section title="Changes to this policy">
        If this policy changes — for example, if a future version adds optional cloud sync — we
        will update this screen and clearly disclose what changes before you use any new feature.
      </Section>

      <Section title="Contact">
        Questions about this policy can be directed to the app developer via the contact listed on
        the app's store listing page.
      </Section>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  updated: { marginTop: spacing.xs, marginBottom: spacing.lg },
  section: { marginBottom: spacing.lg },
  body: { marginTop: spacing.xs },
});
