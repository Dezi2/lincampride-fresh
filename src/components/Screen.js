import React from 'react';
import { Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme';

const TOP_PAD = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 50;

// Taxi-style black and yellow checker strip, used under headers.
export function Checker({ count = 30 }) {
  return (
    <View style={styles.checker}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={{ flex: 1, backgroundColor: i % 2 === 0 ? colors.yellow : colors.ink }} />
      ))}
    </View>
  );
}

// Shared page shell: dark header with back button, title and Home, then content.
export default function Screen({ title, onBack, onMenu, scroll = true, children }) {
  const Body = scroll ? ScrollView : View;
  const bodyProps = scroll
    ? { contentContainerStyle: styles.content, showsVerticalScrollIndicator: false }
    : { style: [styles.content, { flex: 1 }] };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={10} style={styles.backBtn}>
          <Text style={styles.backGlyph}>{'\u2039'}</Text>
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <TouchableOpacity onPress={onMenu} hitSlop={10} style={styles.homeBtn}>
          <Text style={styles.homeText}>Home</Text>
        </TouchableOpacity>
      </View>
      <Checker />
      <Body {...bodyProps}>{children}</Body>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: {
    backgroundColor: colors.ink,
    paddingTop: TOP_PAD + 10,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.yellow,
    alignItems: 'center', justifyContent: 'center',
  },
  backGlyph: { color: colors.ink, fontSize: 26, fontWeight: '800', marginTop: -3 },
  title: { flex: 1, color: '#fff', fontSize: 19, fontWeight: '800', marginLeft: 12 },
  homeBtn: { borderWidth: 1, borderColor: colors.yellow, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6 },
  homeText: { color: colors.yellow, fontSize: 13, fontWeight: '700' },
  checker: { flexDirection: 'row', height: 8 },
  content: { padding: 16, paddingBottom: 40 },
});
