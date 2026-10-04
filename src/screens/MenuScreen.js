import React from 'react';
import { Alert, BackHandler, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Checker } from '../components/Screen';
import { useApp } from '../context/AppContext';
import { colors, naira, radius } from '../theme';

const TOP_PAD = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 50;

const TILES = [
  { route: 'dashboard', title: 'Dashboard', note: 'Wallet and your trip', glyph: 'D', tint: colors.yellowTint },
  { route: 'rides', title: 'Find a ride', note: 'Book a shuttle seat', glyph: 'R', tint: colors.greenTint },
  { route: 'weather', title: 'Weather', note: 'All 36 states and FCT', glyph: 'W', tint: '#E3EBFA' },
  { route: 'profile', title: 'Profile', note: 'Your ID and history', glyph: 'P', tint: colors.redTint },
];

export default function MenuScreen({ navigate }) {
  const { user, balance } = useApp();
  const firstName = user.name.split(' ')[0];

  const exitApp = () => {
    if (Platform.OS === 'android') {
      Alert.alert('Exit Lincampride', 'Do you want to close the app?', [
        { text: 'Stay', style: 'cancel' },
        { text: 'Exit', style: 'destructive', onPress: () => BackHandler.exitApp() },
      ]);
    } else {
      Alert.alert('Exit Lincampride', 'On iPhone, swipe up from the bottom to close the app.');
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.hero}>
        <Text style={styles.brand}>Lincampride</Text>
        <Text style={styles.hello}>Hi, {firstName}</Text>
        <View style={styles.walletPill}>
          <Text style={styles.walletLabel}>Wallet</Text>
          <Text style={styles.walletValue}>{naira(balance)}</Text>
        </View>
      </View>
      <Checker count={30} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.prompt}>Where to?</Text>
        <View style={styles.grid}>
          {TILES.map((t) => (
            <TouchableOpacity key={t.route} activeOpacity={0.85} style={styles.tile} onPress={() => navigate(t.route)}>
              <View style={[styles.glyphBox, { backgroundColor: t.tint }]}>
                <Text style={styles.glyph}>{t.glyph}</Text>
              </View>
              <Text style={styles.tileTitle}>{t.title}</Text>
              <Text style={styles.tileNote}>{t.note}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity activeOpacity={0.7} style={styles.exit} onPress={exitApp}>
          <Text style={styles.exitText}>Exit app</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  hero: { backgroundColor: colors.yellow, paddingTop: TOP_PAD + 16, paddingBottom: 22, paddingHorizontal: 20 },
  brand: { color: colors.inkSoft, fontSize: 14, fontWeight: '800' },
  hello: { color: colors.ink, fontSize: 34, fontWeight: '900', marginTop: 2 },
  walletPill: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: colors.ink,
    borderRadius: 999, paddingVertical: 7, paddingHorizontal: 14, marginTop: 14,
  },
  walletLabel: { color: '#C9D0E0', fontSize: 12, marginRight: 8 },
  walletValue: { color: colors.yellow, fontSize: 15, fontWeight: '800' },
  content: { padding: 16, paddingBottom: 40 },
  prompt: { color: colors.ink, fontSize: 20, fontWeight: '800', marginTop: 6, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: {
    width: '48%', backgroundColor: colors.surface, borderRadius: radius.card, borderWidth: 1,
    borderColor: colors.line, borderBottomWidth: 3, padding: 14, marginBottom: 14,
  },
  glyphBox: { width: 42, height: 42, borderRadius: radius.badge, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  glyph: { color: colors.ink, fontSize: 18, fontWeight: '900' },
  tileTitle: { color: colors.ink, fontSize: 16, fontWeight: '800' },
  tileNote: { color: colors.muted, fontSize: 12, marginTop: 3 },
  exit: { alignSelf: 'center', paddingVertical: 12, paddingHorizontal: 20, marginTop: 6 },
  exitText: { color: colors.red, fontSize: 14, fontWeight: '700' },
});
