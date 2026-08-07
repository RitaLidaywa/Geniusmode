import React from 'react';
import { Linking, StyleSheet, Text } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Card from '../components/Card';
import { colors, spacing, typography } from '../theme';
import { CRISIS_RESOURCES } from '../data/crisisResources';

export default function CrisisResourcesScreen() {
  return (
    <ScreenContainer>
      <Text style={typography.title}>Crisis resources</Text>
      <Text style={[typography.bodyMuted, styles.subtitle]}>
        This app cannot detect emergencies and is not a crisis service. If you are in immediate
        danger, contact local emergency services.
      </Text>
      {CRISIS_RESOURCES.map((resource) => (
        <Card key={resource.name} style={styles.card}>
          <Text style={typography.caption}>{resource.region}</Text>
          <Text style={typography.subheading}>{resource.name}</Text>
          <Text
            style={styles.contact}
            onPress={() => {
              if (resource.contact.includes('.com')) {
                Linking.openURL(`https://${resource.contact}`);
              }
            }}
          >
            {resource.contact}
          </Text>
          <Text style={typography.bodyMuted}>{resource.description}</Text>
        </Card>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  subtitle: { marginTop: spacing.xs, marginBottom: spacing.lg },
  card: { marginBottom: spacing.md },
  contact: { ...typography.body, color: colors.primary, fontWeight: '700', marginVertical: spacing.xs },
});
