import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Screen from '../components/Screen';
import { DEFAULT_STATE, STATES, labelFor } from '../data/states';
import { fetchWeather } from '../services/weather';
import { colors, radius } from '../theme';

export default function WeatherScreen({ goBack, goMenu }) {
  const [selected, setSelected] = useState(DEFAULT_STATE);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    setWeather(null);
    fetchWeather(selected.lat, selected.lon, controller.signal)
      .then((w) => setWeather(w))
      .catch((e) => {
        if (e.name !== 'AbortError') setError('Could not load weather. Check your internet connection and try again.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [selected, attempt]);

  const header = (
    <View>
      <View style={styles.hero}>
        <Text style={styles.state}>{labelFor(selected)}</Text>
        <Text style={styles.capital}>Capital: {selected.capital}</Text>

        {loading && <ActivityIndicator color={colors.yellow} size="large" style={{ marginVertical: 30 }} />}

        {!loading && error ? (
          <View style={{ marginTop: 14 }}>
            <Text style={styles.error}>{error}</Text>
            <TouchableOpacity onPress={() => setAttempt((n) => n + 1)} style={styles.retry}>
              <Text style={styles.retryText}>Try again</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {!loading && weather ? (
          <View>
            <View style={styles.tempRow}>
              <Text style={styles.temp}>{weather.temperature}</Text>
              <Text style={styles.deg}>{'\u00B0'}C</Text>
            </View>
            <Text style={styles.condition}>{weather.condition}</Text>
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Wind</Text>
                <Text style={styles.statValue}>{weather.windSpeed} km/h</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Humidity</Text>
                <Text style={styles.statValue}>{weather.humidity}%</Text>
              </View>
            </View>
          </View>
        ) : null}
      </View>
      <Text style={styles.listTitle}>Choose a state</Text>
    </View>
  );

  return (
    <Screen title="Weather" onBack={goBack} onMenu={goMenu} scroll={false}>
      <FlatList
        data={STATES}
        keyExtractor={(s) => s.state}
        ListHeaderComponent={header}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => {
          const active = item.state === selected.state;
          return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => setSelected(item)} style={[styles.item, active && styles.itemActive]}>
              <Text style={styles.itemName}>{labelFor(item)}</Text>
              <Text style={styles.itemCap}>{item.capital}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.ink, borderRadius: radius.card, padding: 20, minHeight: 190 },
  state: { color: '#fff', fontSize: 24, fontWeight: '900' },
  capital: { color: '#C9D0E0', fontSize: 13, marginTop: 3 },
  tempRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 12 },
  temp: { color: colors.yellow, fontSize: 64, fontWeight: '900' },
  deg: { color: colors.yellow, fontSize: 24, fontWeight: '800', marginTop: 12, marginLeft: 2 },
  condition: { color: '#fff', fontSize: 16, fontWeight: '600' },
  statsRow: { flexDirection: 'row', marginTop: 16, gap: 10 },
  statBox: { flex: 1, backgroundColor: '#1F2F54', borderRadius: radius.badge, padding: 12 },
  statLabel: { color: '#C9D0E0', fontSize: 12 },
  statValue: { color: '#fff', fontSize: 16, fontWeight: '800', marginTop: 3 },
  error: { color: '#FFB4AD', fontSize: 13 },
  retry: { marginTop: 12, alignSelf: 'flex-start', backgroundColor: colors.yellow, borderRadius: radius.button, paddingVertical: 8, paddingHorizontal: 18 },
  retryText: { color: colors.ink, fontWeight: '800' },
  listTitle: { color: colors.ink, fontSize: 17, fontWeight: '800', marginTop: 20, marginBottom: 10 },
  item: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.line, borderRadius: radius.button, paddingVertical: 13, paddingHorizontal: 14, marginBottom: 8,
  },
  itemActive: { backgroundColor: colors.yellowTint, borderColor: colors.yellow, borderWidth: 2 },
  itemName: { color: colors.ink, fontSize: 14, fontWeight: '800' },
  itemCap: { color: colors.muted, fontSize: 12 },
});
