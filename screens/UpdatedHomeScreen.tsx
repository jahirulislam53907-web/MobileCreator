import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { useTheme } from '@/hooks/useTheme';
import { Spacing, Typography, BorderRadius } from '@/constants/theme';
import { DesignTokens } from '@/constants/designSystem';
import { calculatePrayerTimes, getNextPrayer, DHAKA_COORDINATES, type NextPrayerInfo, type PrayerTimesData } from '@/utils/prayerTimes';

export default function UpdatedHomeScreen() {
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
    { icon: 'book-open', label: 'কুরআন', color: '#40916C' },
    { icon: 'volume-2', label: 'আজান', color: '#F4A261' },
    { icon: 'users', label: 'নামাজ শিক্ষা', color: '#2D6A4F' },
    { icon: 'heart', label: 'দুয়া', color: '#40916C' },
    { icon: 'compass', label: 'কিবলা', color: '#2D936C' },
    { icon: 'home', label: 'মসজিদ', color: '#1a5e63' },
    { icon: 'clock', label: 'নামাজ', color: '#f9a826' },
    { icon: 'bookmarks', label: 'কিতাব', color: '#2D6A4F' },
    { icon: 'calendar', label: 'রোজা', color: '#52b788' },
    { icon: 'award', label: 'হজ্জ ও ওমরা', color: '#1a5e63' },
    { icon: 'gift', label: 'যাকাত', color: '#f9a826' },
    { icon: 'moon', label: 'রমজান', color: '#2d936c' },
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
        <Feather name="mosque" size={28} color={theme.buttonText} />
        <ThemedText style={styles.headerTitle}>Smart Muslim</ThemedText>
        <View style={styles.headerActions}>
          <Pressable>
            <Feather name="search" size={22} color={theme.buttonText} />
          </Pressable>
          <Pressable style={{ marginLeft: 16 }}>
            <Feather name="bell" size={22} color={theme.buttonText} />
          </Pressable>
        </View>
      </View>

      {/* Location Selector */}
      <Card style={[styles.locationCard, { borderRadius: BorderRadius.md }]}>
        <View style={styles.locationContent}>
          <View style={styles.locationInfo}>
            <Feather name="map-pin" size={20} color={theme.primary} />
            <View style={{ marginLeft: 10 }}>
              <ThemedText style={styles.locationTitle}>ঢাকা, বাংলাদেশ</ThemedText>
              <ThemedText style={[styles.locationSubtitle, { color: theme.textSecondary }]}>আপনার বর্তমান লোকেশন</ThemedText>
            </View>
          </View>
          <Pressable style={[styles.changeBtn, { borderRadius: BorderRadius.full }]}>
            <Feather name="edit" size={14} color={theme.buttonText} />
            <ThemedText style={{ color: theme.buttonText, marginLeft: 4, fontSize: 12, fontWeight: '600' }}>পরিবর্তন</ThemedText>
          </Pressable>
        </View>
      </Card>

      {/* Date & Next Prayer */}
      <View style={styles.dateContainer}>
        <Card style={[styles.dateCard, { borderRadius: BorderRadius.md }]}>
          <ThemedText style={[styles.cardLabel, { color: theme.textSecondary }]}>হিজরি তারিখ</ThemedText>
          <ThemedText style={[styles.dateValue, { color: theme.primary }]}>১৫ রমজান ১৪৪৬</ThemedText>
          <ThemedText style={styles.gregorianDate}>২৪ নভেম্বর ২০২৪</ThemedText>
        </Card>
        <Card style={[styles.nextPrayerCard, { borderColor: theme.primary, borderWidth: 2, borderRadius: BorderRadius.md }]}>
          <ThemedText style={[styles.cardLabel, { color: theme.primary }]}>পরবর্তী নামাজ</ThemedText>
          <ThemedText style={[styles.prayerName, { color: theme.primary }]}>{nextPrayerInfo?.nameBn}</ThemedText>
          {nextPrayerInfo && (
            <ThemedText style={[styles.countdown, { color: '#f9a826' }]}>
              {String(nextPrayerInfo.timeRemaining.hours).padStart(2, '0')}:{String(nextPrayerInfo.timeRemaining.minutes).padStart(2, '0')}:{String(nextPrayerInfo.timeRemaining.seconds).padStart(2, '0')}
            </ThemedText>
          )}
        </Card>
      </View>

      {/* Quick Actions */}
      <ThemedText style={[styles.sectionTitle, { color: theme.text, marginTop: Spacing.xl }]}>দ্রুত এক্সেস</ThemedText>
      <FlatList
        scrollEnabled={false}
        data={QUICK_ACTIONS}
        numColumns={5}
        renderItem={({ item }) => (
          <Pressable style={[styles.actionCard, { borderRadius: BorderRadius.md }]}>
            <View style={[styles.actionIcon, { backgroundColor: item.color, borderRadius: BorderRadius.full }]}>
              <Feather name={item.icon as any} size={18} color={theme.buttonText} />
            </View>
            <ThemedText style={styles.actionName}>{item.label}</ThemedText>
          </Pressable>
        )}
        keyExtractor={(_, i) => i.toString()}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 10 }}
      />

      {/* Prayer Times */}
      <ThemedText style={[styles.sectionTitle, { color: theme.text, marginTop: Spacing.xl }]}>আজকের নামাজের সময়সূচী</ThemedText>
      <Card style={{ borderRadius: BorderRadius.lg, marginBottom: Spacing.xl }}>
        <FlatList
          scrollEnabled={false}
          data={prayers}
          numColumns={3}
          renderItem={({ item, index }) => (
            <View style={[styles.prayerCard, { flex: 1, marginRight: index % 3 !== 2 ? 8 : 0 }]}>
              <ThemedText style={[styles.prayerCardName, { color: theme.text }]}>{item.name}</ThemedText>
              <ThemedText style={[styles.prayerCardTime, { color: theme.primary }]}>{item.time}</ThemedText>
            </View>
          )}
          keyExtractor={(item) => item.key}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
        />
      </Card>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    marginHorizontal: -Spacing.lg,
    marginTop: -Spacing.lg,
    marginBottom: Spacing.lg,
  },
  headerTitle: {
    fontSize: Typography.h1.fontSize,
    fontWeight: Typography.h1.fontWeight,
    marginLeft: Spacing.md,
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  locationCard: {
    marginBottom: Spacing.lg,
  },
  locationContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationTitle: {
    fontWeight: '600',
    fontSize: 14,
  },
  locationSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  changeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a5e63',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    marginLeft: Spacing.md,
  },
  dateContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  dateCard: {
    flex: 1,
  },
  nextPrayerCard: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  dateValue: {
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 2,
  },
  gregorianDate: {
    fontSize: 12,
  },
  prayerName: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 4,
  },
  countdown: {
    fontWeight: '700',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: Typography.h2.fontSize,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  actionIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  actionName: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  prayerCard: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  prayerCardName: {
    fontWeight: '600',
    fontSize: 12,
    marginBottom: 4,
  },
  prayerCardTime: {
    fontWeight: '700',
    fontSize: 13,
  },
});
