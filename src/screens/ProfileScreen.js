import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Screen from '../components/Screen';
import { Card, Chip, PrimaryButton, SectionTitle } from '../components/ui';
import { useApp } from '../context/AppContext';
import { colors, naira, radius } from '../theme';

const formatTime = (d) => d.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });

export default function ProfileScreen({ goBack, goMenu }) {
  const { user, balance, ridesCompleted, history } = useApp();
  const initial = user.name.trim().charAt(0).toUpperCase();

  return (
    <Screen title="Profile" onBack={goBack} onMenu={goMenu}>
      {/* Student ID card */}
      <View style={styles.idCard}>
        <View style={styles.idTop}>
          <Text style={styles.idBrand}>Lincampride student</Text>
          <Chip label={user.status} tone="ink" />
        </View>
        <View style={styles.idMain}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.dept}>{user.department}</Text>
          </View>
        </View>
        <View style={styles.idBottom}>
          <Text style={styles.idLabel}>Student ID</Text>
          <Text style={styles.idNumber}>{user.studentId}</Text>
        </View>
      </View>

      <SectionTitle>Account</SectionTitle>
      <Card>
        <Row label="Wallet balance" value={naira(balance)} />
        <View style={styles.divider} />
        <Row label="Rides completed" value={String(ridesCompleted)} />
        <View style={styles.divider} />
        <Row label="Status" value={user.status} valueColor={colors.green} />
      </Card>

      <SectionTitle>Recent rides</SectionTitle>
      {history.length === 0 ? (
        <Card>
          <Text style={styles.empty}>No rides yet. Book a seat in Find a ride and it will appear here.</Text>
        </Card>
      ) : (
        history.map((t) => (
          <Card key={t.ref}>
            <View style={styles.histTop}>
              <Text style={styles.histDriver}>{t.driver}</Text>
              <Text style={styles.histFare}>{naira(t.fare)}</Text>
            </View>
            <Text style={styles.histRoute}>{t.from} to {t.to}</Text>
            <Text style={styles.histMeta}>{formatTime(t.bookedAt)} | {t.ref}</Text>
          </Card>
        ))
      )}

      <View style={{ height: 6 }} />
      <PrimaryButton label="Back to home" variant="dark" onPress={goMenu} />
    </Screen>
  );
}

function Row({ label, value, valueColor }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, valueColor && { color: valueColor }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  idCard: { backgroundColor: colors.yellow, borderRadius: radius.card, padding: 18, marginBottom: 8 },
  idTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  idBrand: { color: colors.inkSoft, fontSize: 13, fontWeight: '800' },
  idMain: { flexDirection: 'row', alignItems: 'center', marginVertical: 18 },
  avatar: {
    width: 64, height: 64, borderRadius: radius.card, backgroundColor: colors.ink, alignItems: 'center',
    justifyContent: 'center', marginRight: 14,
  },
  avatarText: { color: colors.yellow, fontSize: 28, fontWeight: '900' },
  name: { color: colors.ink, fontSize: 22, fontWeight: '900' },
  dept: { color: colors.inkSoft, fontSize: 13, marginTop: 3 },
  idBottom: { borderTopWidth: 2, borderStyle: 'dashed', borderTopColor: colors.yellowDeep, paddingTop: 12 },
  idLabel: { color: colors.inkSoft, fontSize: 12 },
  idNumber: { color: colors.ink, fontSize: 20, fontWeight: '900', marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.line, marginVertical: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  rowLabel: { color: colors.muted, fontSize: 14 },
  rowValue: { color: colors.ink, fontSize: 14, fontWeight: '800' },
  empty: { color: colors.muted, fontSize: 13, lineHeight: 19 },
  histTop: { flexDirection: 'row', justifyContent: 'space-between' },
  histDriver: { color: colors.ink, fontSize: 15, fontWeight: '800' },
  histFare: { color: colors.ink, fontSize: 14, fontWeight: '800' },
  histRoute: { color: colors.inkSoft, fontSize: 13, marginTop: 5 },
  histMeta: { color: colors.muted, fontSize: 11, marginTop: 5 },
});
