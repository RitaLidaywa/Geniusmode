import React, { useCallback, useState } from 'react';
import { Alert, Share, StyleSheet, Switch, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as LocalAuthentication from 'expo-local-authentication';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../components/ScreenContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import { colors, spacing, typography } from '../theme';
import { deleteAllData, exportAllData, getSettings, saveSettings } from '../storage/db';
import type { AppSettings } from '../types';
import type { SettingsStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<SettingsStackParamList, 'Settings'>;

export default function SettingsScreen({ navigation }: Props) {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [busy, setBusy] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getSettings().then(setSettings);
    }, []),
  );

  const toggleAppLock = async (enabled: boolean) => {
    if (enabled) {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!hasHardware || !isEnrolled) {
        Alert.alert(
          'Set up a passcode first',
          'To lock this app, set up Face ID, Touch ID, or a device passcode in your phone settings first.',
        );
        return;
      }
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Confirm to enable app lock',
      });
      if (!result.success) return;
    }
    if (!settings) return;
    const updated = { ...settings, appLockEnabled: enabled };
    await saveSettings(updated);
    setSettings(updated);
  };

  const handleExport = async () => {
    setBusy(true);
    const data = await exportAllData();
    setBusy(false);
    await Share.share({ message: data, title: 'My data export' });
  };

  const handleDeleteAll = () => {
    Alert.alert(
      'Delete all your data?',
      'This permanently erases your streak, journal entries, mood logs, and letters from this device. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete everything',
          style: 'destructive',
          onPress: async () => {
            await deleteAllData();
            Alert.alert('Done', 'All your data has been deleted from this device.');
          },
        },
      ],
    );
  };

  if (!settings) return <ScreenContainer />;

  return (
    <ScreenContainer>
      <Text style={typography.title}>Settings</Text>

      <Card style={styles.section}>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={typography.subheading}>App lock</Text>
            <Text style={typography.bodyMuted}>
              Require Face ID, Touch ID, or your device passcode to open this app.
            </Text>
          </View>
          <Switch value={settings.appLockEnabled} onValueChange={toggleAppLock} />
        </View>
      </Card>

      <Card style={styles.section}>
        <Text style={typography.subheading}>Your data</Text>
        <Text style={[typography.bodyMuted, styles.dataText]}>
          Everything you write stays on this device only. Nothing is sent to any server.
        </Text>
        <Button label="Export my data" variant="secondary" onPress={handleExport} loading={busy} style={styles.button} />
        <Button label="Delete all my data" variant="danger" onPress={handleDeleteAll} style={styles.button} />
      </Card>

      <Card style={styles.section}>
        <Text style={typography.subheading}>About &amp; legal</Text>
        <Button
          label="Privacy Policy"
          variant="ghost"
          onPress={() => navigation.navigate('PrivacyPolicy')}
          style={styles.linkButton}
        />
        <Button
          label="Terms of Use"
          variant="ghost"
          onPress={() => navigation.navigate('Terms')}
          style={styles.linkButton}
        />
        <Button
          label="Crisis resources"
          variant="ghost"
          onPress={() => navigation.navigate('Crisis')}
          style={styles.linkButton}
        />
      </Card>

      <Text style={[typography.caption, styles.footer]}>I Miss Them, But... v1.0.0</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowText: { flex: 1, marginRight: spacing.md },
  dataText: { marginTop: spacing.xs, marginBottom: spacing.md },
  button: { marginTop: spacing.sm },
  linkButton: { alignItems: 'flex-start', alignSelf: 'flex-start' },
  footer: { textAlign: 'center', marginTop: spacing.xl, color: colors.textFaint },
});
