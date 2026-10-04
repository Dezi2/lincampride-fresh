import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Checker } from '../components/Screen';
import { colors } from '../theme';

export default function SplashScreen() {
  return (
    <View style={styles.root}>
      <View style={styles.center}>
        <View style={styles.plate}>
          <Text style={styles.plateText}>LCP</Text>
        </View>
        <Text style={styles.title}>Lincampride</Text>
        <Text style={styles.subtitle}>Rides and services around campus</Text>
        <ActivityIndicator color={colors.ink} style={{ marginTop: 28 }} />
      </View>
      <Checker count={36} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.yellow },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  plate: {
    backgroundColor: colors.ink, borderRadius: 10, paddingHorizontal: 22, paddingVertical: 10,
    marginBottom: 20, borderWidth: 3, borderColor: '#fff',
  },
  plateText: { color: colors.yellow, fontSize: 30, fontWeight: '900', letterSpacing: 4 },
  title: { color: colors.ink, fontSize: 38, fontWeight: '900' },
  subtitle: { color: colors.inkSoft, fontSize: 15, marginTop: 6, textAlign: 'center' },
});
