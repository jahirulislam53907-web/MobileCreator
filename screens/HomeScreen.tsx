import React, { useEffect, useState } from "react";
import { View, StyleSheet, Pressable, FlatList } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, Typography, BorderRadius } from "@/constants/theme";
import { calculatePrayerTimes, getNextPrayer, DHAKA_COORDINATES, type PrayerTimesData, type NextPrayerInfo } from "@/utils/prayerTimes";

export default function HomeScreen() {
  const { theme } = useTheme();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [nextPrayerInfo, setNextPrayerInfo] = useState<NextPrayerInfo | null>(null);

  useEffect(() => {
    const times = calculatePrayerTimes(DHAKA_COORDINATES.latitude, DHAKA_COORDINATES.longitude);
    setPrayerTimes(times);
  }, []);

  useEffect(() => {
    const updateNextPrayer = () => {
      const next = getNextPrayer(DHAKA_COORDINATES.latitude, DHAKA_COORDINATES.longitude);
      setNextPrayerInfo(next);
    };
    updateNextPrayer();
    const interval = setInterval(updateNextPrayer, 1000);
    return () => clearInterval(interval);
  }, []);

  const QUICK_ACTIONS = [
    { icon: 'book-open', label: 'কুরআন' },
    { icon: 'volume-2', label: 'আজান' },
    { icon: 'users', label: 'নামাজ শিক্ষা' },
    { icon: 'heart', label: 'দুয়া' },
    { icon: 'compass', label: 'কিবলা' },
    { icon: 'home', label: 'মসজিদ' },
    { icon: 'clock', label: 'নামাজ' },
    { icon: 'bookmarks', label: 'কিতাব' },
    { icon: 'calendar', label: 'রোজা' },
    { icon: 'award', label: 'হজ্জ' },
    { icon: 'gift', label: 'যাকাত' },
    { icon: 'moon', label: 'রমজান' },
  ];

  const prayers = prayerTimes ? [
    { name: 'ফজর', time: prayerTimes.fajr, key: 'fajr' },
    { name: 'যোহর', time: prayerTimes.dhuhr, key: 'dhuhr' },
    { name: 'আসর', time: prayerTimes.asr, key: 'asr' },
    { name: 'মাগরিব', time: prayerTimes.maghrib, key: 'maghrib' },
    { name: 'এশা', time: prayerTimes.isha, key: 'isha' },
  ] : [];

  return (
    <ScreenScrollView>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <Feather name="home" size={24} color={theme.buttonText} />
        <ThemedText style={styles.headerTitle}>Smart Muslim</ThemedText>
        <Pressable><Feather name="search" size={20} color={theme.buttonText} /></Pressable>
      </View>

      {/* Location */}
      <Card style={styles.locationCard}>
        <View style={styles.locationRow}>
          <Feather name="map-pin" size={18} color={theme.primary} />
          <View style={{ flex: 1, marginLeft: Spacing.md }}>
            <ThemedText style={styles.locationTitle}>ঢাকা, বাংলাদেশ</ThemedText>
            <ThemedText style={[styles.locationText, { color: theme.textSecondary }]}>আপনার লোকেশন</ThemedText>
          </View>
          <Pressable><Feather name="edit" size={16} color={theme.primary} /></Pressable>
        </View>
      </Card>

      {/* Date Info */}
      <View style={styles.dateGrid}>
        <Card style={{ flex: 1 }}>
          <ThemedText style={[styles.label, { color: theme.textSecondary }]}>হিজরি</ThemedText>
          <ThemedText style={[styles.value, { color: theme.primary }]}>১৫ রমজান</ThemedText>
        </Card>
        <Card style={[{ flex: 1, borderColor: theme.primary, borderWidth: 2 }]}>
          <ThemedText style={[styles.label, { color: theme.primary }]}>পরবর্তী নামাজ</ThemedText>
          <ThemedText style={[styles.value, { color: theme.primary }]}>{nextPrayerInfo?.nameBn}</ThemedText>
          <ThemedText style={[styles.countdown, { color: '#f9a826' }]}>
            {nextPrayerInfo && `${String(nextPrayerInfo.timeRemaining.hours).padStart(2, '0')}:${String(nextPrayerInfo.timeRemaining.minutes).padStart(2, '0')}:${String(nextPrayerInfo.timeRemaining.seconds).padStart(2, '0')}`}
          </ThemedText>
        </Card>
      </View>

      {/* Quick Actions */}
      <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>দ্রুত এক্সেস</ThemedText>
      <FlatList
        scrollEnabled={false}
        data={QUICK_ACTIONS}
        numColumns={4}
        renderItem={({ item }) => (
          <View style={styles.actionCard}>
            <View style={[styles.actionIcon, { backgroundColor: theme.primary }]}>
              <Feather name={item.icon as any} size={16} color={theme.buttonText} />
            </View>
            <ThemedText style={styles.actionLabel}>{item.label}</ThemedText>
          </View>
        )}
        keyExtractor={(_, i) => i.toString()}
      />

      {/* Prayer Times */}
      <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>নামাজের সময়</ThemedText>
      <Card>
        <FlatList
          scrollEnabled={false}
          data={prayers}
          numColumns={3}
          renderItem={({ item }) => (
            <View style={styles.prayerItem}>
              <ThemedText style={styles.prayerName}>{item.name}</ThemedText>
              <ThemedText style={[styles.prayerTime, { color: theme.primary }]}>{item.time}</ThemedText>
            </View>
          )}
          keyExtractor={item => item.key}
        />
      </Card>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg, marginHorizontal: -Spacing.lg, marginTop: -Spacing.lg, marginBottom: Spacing.lg, gap: Spacing.md },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '700' },
  locationCard: { marginBottom: Spacing.lg },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationTitle: { fontWeight: '600', fontSize: 14 },
  locationText: { fontSize: 12, marginTop: 2 },
  dateGrid: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.lg },
  label: { fontSize: 12, marginBottom: 4 },
  value: { fontWeight: '700', fontSize: 14 },
  countdown: { fontWeight: '700', fontSize: 12, marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: Spacing.md, marginTop: Spacing.lg },
  actionCard: { flex: 1, alignItems: 'center', paddingVertical: Spacing.md },
  actionIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm },
  actionLabel: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
  prayerItem: { flex: 1, paddingVertical: Spacing.md, alignItems: 'center' },
  prayerName: { fontWeight: '600', fontSize: 12 },
  prayerTime: { fontWeight: '700', fontSize: 13, marginTop: 4 },
});
