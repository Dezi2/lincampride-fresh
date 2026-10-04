import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Screen from '../components/Screen';
import { Card, Chip, PrimaryButton, SectionTitle } from '../components/ui';
import { useApp } from '../context/AppContext';
import { DEFAULT_STATE } from '../data/states';
import { fetchWeather } from '../services/weather';
import { colors, naira, radius } from '../theme';

export default function DashboardScreen({ navigate, goBack, goMenu }) {
  const { user, balance, shuttles, activeTrip, ridesCompleted, cancelTrip } = useApp();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadWeather = async () => {
    setLoading(true);
    setError('');
    try {
      setWeather(await fetchWeather(DEFAULT_STATE.lat, DEFAULT_STATE.lon));
    } catch (e) {
      setError('Could not load weather. Check your internet connection and tap to retry.');
    } finally {
      setLoading(false);
    }
  };

  const confirmCancel = () =>
    Alert.alert('Cancel booking', 'Your fare will be refunded to your wallet.', [
      { text: 'Keep booking', style: 'cancel' },
      { text: 'Cancel ride', style: 'destructive', onPress: cancelTrip },
    ]);

  return (
    <Screen title="Dashboard" onBack={goBack} onMenu={goMenu}>
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.meta}>{user.department} | {user.studentId}</Text>

      <View style={styles.wallet}>
        <View>
          <Text style={styles.walletLabel}>Wallet balance</Text>
          <Text style={styles.walletValue}>{naira(balance)}</Text>
        </View>
        <Chip label={user.status} tone="yellow" />
      </View>

      <SectionTitle>Your trip</SectionTitle>
      {activeTrip ? (
        <View style={styles.ticket}>
          <View style={styles.ticketTop}>
            <Text style={styles.ticketRef}>{activeTrip.ref}</Text>
            <Text style={styles.ticketFrom}>{activeTrip.from}</Text>
            <Text style={styles.ticketArrow}>to</Text>
            <Text style={styles.ticketTo}>{activeTrip.to}</Text>
          </View>
          <View style={styles.tear}>
            <View style={[styles.notch, { left: -11 }]} />
            <View style={styles.dash} />
            <View style={[styles.notch, { right: -11 }]} />
          </View>
          <View style={styles.ticketBottom}>
            <Text style={styles.ticketMeta}>{activeTrip.driver}, {activeTrip.vehicle}</Text>
            <Text style={styles.ticketMeta}>Arrives in about {activeTrip.eta} min | Paid {naira(activeTrip.fare)}</Text>
            <View style={{ height: 14 }} />
            <PrimaryButton label="Cancel booking" variant="danger" onPress={confirmCancel} />
          </View>
        </View>
      ) : (
        <Card>
          <Text style={styles.emptyTitle}>No ride booked</Text>
          <Text style={styles.emptyNote}>Pick a shuttle and your ticket will show up here.</Text>
          <PrimaryButton label="Find a ride" onPress={() => navigate('rides')} />
        </Card>
      )}

      <SectionTitle>Around campus</SectionTitle>
      <View style={styles.row}>
        <View style={[styles.stat, { borderLeftColor: colors.yellow }]}>
          <Text style={styles.statValue}>{shuttles.length}</Text>
          <Text style={styles.statLabel}>Drivers on duty</Text>
        </View>
        <View style={[styles.stat, { borderLeftColor: colors.green }]}>
          <Text style={styles.statValue}>{ridesCompleted}</Text>
          <Text style={styles.statLabel}>Rides taken</Text>
        </View>
      </View>

      <Card>
        <View style={styles.weatherHead}>
          <Text style={styles.weatherTitle}>Weather in Ikeja, Lagos</Text>
          <TouchableOpacity onPress={() => navigate('weather')} hitSlop={8}>
            <Text style={styles.viewAll}>All states</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity activeOpacity={0.7} onPress={loadWeather} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={colors.ink} style={{ alignSelf: 'flex-start', marginTop: 4 }} />
          ) : error ? (
            <Text style={[styles.muted, { color: colors.red }]}>{error}</Text>
          ) : weather ? (
            <Text style={styles.weatherNow}>{weather.temperature}{'\u00B0'}C, {weather.condition}, humidity {weather.humidity}%</Text>
          ) : (
            <Text style={styles.muted}>Tap to load the current weather</Text>
          )}
        </TouchableOpacity>
      </Card>
    </Screen>
  );
}

const NOTCH = 22;

const styles = StyleSheet.create({
  name: { color: colors.ink, fontSize: 26, fontWeight: '900' },
  meta: { color: colors.muted, fontSize: 13, marginTop: 3, marginBottom: 14 },
  wallet: {
    backgroundColor: colors.ink, borderRadius: radius.card, padding: 18, marginBottom: 10,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  walletLabel: { color: '#C9D0E0', fontSize: 12 },
  walletValue: { color: colors.yellow, fontSize: 30, fontWeight: '900', marginTop: 2 },
  muted: { color: colors.muted, fontSize: 13 },
  emptyTitle: { color: colors.ink, fontSize: 17, fontWeight: '800' },
  emptyNote: { color: colors.muted, fontSize: 13, marginTop: 4, marginBottom: 14 },

  ticket: { marginBottom: 14 },
  ticketTop: {
    backgroundColor: colors.yellow, borderTopLeftRadius: radius.card, borderTopRightRadius: radius.card,
    padding: 18,
  },
  ticketRef: { color: colors.inkSoft, fontSize: 12, fontWeight: '800', marginBottom: 8 },
  ticketFrom: { color: colors.ink, fontSize: 22, fontWeight: '900' },
  ticketArrow: { color: colors.inkSoft, fontSize: 13, marginVertical: 2 },
  ticketTo: { color: colors.ink, fontSize: 22, fontWeight: '900' },
  tear: { height: 1, backgroundColor: colors.surface, justifyContent: 'center' },
  dash: { borderTopWidth: 2, borderStyle: 'dashed', borderColor: colors.yellowDeep, marginHorizontal: 16 },
  notch: { position: 'absolute', width: NOTCH, height: NOTCH, borderRadius: NOTCH / 2, backgroundColor: colors.bg, top: -NOTCH / 2 },
  ticketBottom: {
    backgroundColor: colors.surface, borderBottomLeftRadius: radius.card, borderBottomRightRadius: radius.card,
    padding: 18, borderWidth: 1, borderTopWidth: 0, borderColor: colors.line,
  },
  ticketMeta: { color: colors.inkSoft, fontSize: 13, marginBottom: 3 },

  row: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  stat: {
    flex: 1, backgroundColor: colors.surface, borderRadius: radius.card, borderWidth: 1, borderColor: colors.line,
    borderLeftWidth: 5, padding: 14,
  },
  statValue: { color: colors.ink, fontSize: 28, fontWeight: '900' },
  statLabel: { color: colors.muted, fontSize: 12, marginTop: 2 },

  weatherHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  weatherTitle: { color: colors.ink, fontSize: 15, fontWeight: '800' },
  viewAll: { color: colors.inkSoft, fontSize: 13, fontWeight: '700', textDecorationLine: 'underline' },
  weatherNow: { color: colors.ink, fontSize: 14, fontWeight: '600' },
});
