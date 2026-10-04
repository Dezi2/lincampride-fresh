import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius } from '../theme';

export function Card({ children, style }) {
  return <View style={[ui.card, style]}>{children}</View>;
}

// Small coloured label, e.g. fare or seat count.
export function Chip({ label, tone = 'yellow' }) {
  const tones = {
    yellow: { bg: colors.yellowTint, fg: colors.ink },
    green: { bg: colors.greenTint, fg: colors.green },
    red: { bg: colors.redTint, fg: colors.red },
    ink: { bg: colors.ink, fg: colors.yellow },
  };
  const t = tones[tone];
  return (
    <View style={[ui.chip, { backgroundColor: t.bg }]}>
      <Text style={[ui.chipText, { color: t.fg }]}>{label}</Text>
    </View>
  );
}

export function SectionTitle({ children }) {
  return (
    <View style={ui.sectionRow}>
      <View style={ui.sectionBar} />
      <Text style={ui.sectionTitle}>{children}</Text>
    </View>
  );
}

export function PrimaryButton({ label, onPress, disabled, variant = 'primary' }) {
  const palette = {
    primary: { bg: colors.yellow, edge: colors.yellowDeep, fg: colors.ink },
    dark: { bg: colors.ink, edge: '#0A1226', fg: colors.yellow },
    danger: { bg: colors.redTint, edge: '#EBBDB8', fg: colors.red },
  }[variant];
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled}
      style={[
        ui.button,
        { backgroundColor: palette.bg, borderBottomColor: palette.edge },
        disabled && ui.buttonDisabled,
      ]}
    >
      <Text style={[ui.buttonText, { color: palette.fg }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const ui = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
    marginBottom: 14,
  },
  chip: { borderRadius: radius.chip, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' },
  chipText: { fontSize: 12, fontWeight: '800' },
  sectionRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 10 },
  sectionBar: { width: 4, height: 18, borderRadius: 2, backgroundColor: colors.yellow, marginRight: 8 },
  sectionTitle: { color: colors.ink, fontSize: 17, fontWeight: '800' },
  button: {
    borderRadius: radius.button,
    paddingVertical: 13,
    alignItems: 'center',
    borderBottomWidth: 3,
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { fontSize: 15, fontWeight: '800' },
});
