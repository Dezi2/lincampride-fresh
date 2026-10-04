import React, { useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import Screen from '../components/Screen';
import { Chip, PrimaryButton } from '../components/ui';
import { useApp } from '../context/AppContext';
import { colors, naira, radius } from '../theme';

export default function FindRideScreen({ navigate, goBack, goMenu }) {
  const { shuttles, reserveSeat } = useApp();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return shuttles;
    return shuttles.filter((s) =>
      [s.driver, s.vehicle, s.from, s.to].join(' ').toLowerCase().includes(q)
    );
  }, [query, shuttles]);

  const onReserve = (id) => {
    const result = reserveSeat(id);
    if (result.ok) {
      Alert.alert('Booking confirmed', result.message, [
        { text: 'View dashboard', onPress: () => navigate('dashboard') },
        { text: 'Stay here', style: 'cancel' },
      ]);
    } else {
      Alert.alert('Cannot book ride', result.message);
    }
  };

  const renderItem = ({ item }) => {
    const full = item.seats <= 0;
    return (
      <View style={styles.card}>
        <View style={[styles.edge, { backgroundColor: full ? colors.red : colors.yellow }]} />
        <View style={styles.body}>
          <View style={styles.top}>
            <View style={{ flex: 1 }}>
              <Text style={styles.driver}>{item.driver}</Text>
              <Text style={styles.vehicle}>{item.vehicle}</Text>
            </View>
            <Text style={styles.fare}>{naira(item.fare)}</Text>
          </View>

          <View style={styles.routeBox}>
            <Text style={styles.place}>{item.from}</Text>
            <Text style={styles.to}>to</Text>
            <Text style={styles.place}>{item.to}</Text>
          </View>

          <View style={styles.info}>
            <Chip label={full ? 'No seats left' : item.seats + ' seats left'} tone={full ? 'red' : 'green'} />
            <Text style={styles.eta}>Arrives in {item.eta} min</Text>
          </View>
          <PrimaryButton label={full ? 'Fully booked' : 'Reserve seat'} disabled={full} onPress={() => onReserve(item.id)} />
        </View>
      </View>
    );
  };

  return (
    <Screen title="Find a ride" onBack={goBack} onMenu={goMenu} scroll={false}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search by place or driver"
        placeholderTextColor={colors.muted}
        style={styles.search}
        autoCorrect={false}
      />
      <FlatList
        data={results}
        keyExtractor={(s) => s.id}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 14, paddingBottom: 30 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No shuttle matches "{query}". Try another place or driver name.</Text>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: {
    backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.ink, borderRadius: 999,
    color: colors.ink, paddingHorizontal: 18, paddingVertical: 11, fontSize: 14,
  },
  card: {
    flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.card, borderWidth: 1,
    borderColor: colors.line, marginBottom: 14, overflow: 'hidden',
  },
  edge: { width: 6 },
  body: { flex: 1, padding: 14 },
  top: { flexDirection: 'row', alignItems: 'flex-start' },
  driver: { color: colors.ink, fontSize: 17, fontWeight: '800' },
  vehicle: { color: colors.muted, fontSize: 12, marginTop: 2 },
  fare: { color: colors.ink, fontSize: 18, fontWeight: '900' },
  routeBox: { backgroundColor: colors.bg, borderRadius: radius.badge, padding: 10, marginVertical: 12 },
  place: { color: colors.ink, fontSize: 14, fontWeight: '700' },
  to: { color: colors.muted, fontSize: 12, marginVertical: 2 },
  info: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  eta: { color: colors.inkSoft, fontSize: 12, fontWeight: '600' },
  empty: { color: colors.muted, textAlign: 'center', marginTop: 30, fontSize: 13 },
});
