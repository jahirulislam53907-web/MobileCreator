import React, { useEffect, useState } from "react";
import { View, StyleSheet, Pressable, FlatList, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, Typography, BorderRadius, Shadows } from "@/constants/theme";
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
    { icon: 'book-open', label: 'কুরআন', color: '#2d936c' },
    { icon: 'volume-2', label: 'আজান', color: '#f9a826' },
    { icon: 'users', label: 'নামাজ', color: '#1a5e63' },
    { icon: 'heart', label: 'দুয়া', color: '#4CAF50' },
    { icon: 'compass', label: 'কিবলা', color: '#2d936c' },
    { icon: 'map-pin', label: 'মসজিদ', color: '#1a5e63' },
    { icon: 'clock', label: 'সময়', color: '#f9a826' },
    { icon: 'bookmark', label: 'সংরক্ষিত', color: '#2d936c' },
    { icon: 'calendar', label: 'রোজা', color: '#1a5e63' },
    { icon: 'gift', label: 'যাকাত', color: '#f9a826' },
    { icon: 'moon', label: 'রমজান', color: '#4CAF50' },
    { icon: 'settings', label: 'সেটিংস', color: '#2d936c' },
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
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Feather name="mosque" size={32} color="#fff" />
            <View>
              <ThemedText style={styles.appName}>Smart Muslim</ThemedText>
              <ThemedText style={styles.tagline}>ইসলামিক সহায়ক</ThemedText>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Pressable style={styles.headerIcon}>
              <Feather name="bell" size={24} color="#fff" />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Location Card */}
      <Card style={[styles.card, { ...Shadows.md }]}>
        <View style={styles.locationRow}>
          <View style={[styles.iconBox, { backgroundColor: theme.primary + "15" }]}>
            <Feather name="map-pin" size={20} color={theme.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.locationTitle}>ঢাকা, বাংলাদেশ</ThemedText>
            <ThemedText style={[styles.locationSubtitle, { color: theme.textSecondary }]}>আপনার বর্তমান অবস্থান</ThemedText>
          </View>
          <Pressable style={[styles.smallBtn, { backgroundColor: theme.primary }]}>
            <Feather name="chevron-right" size={18} color="#fff" />
          </Pressable>
        </View>
      </Card>

      {/* Date & Prayer Grid */}
      <View style={styles.gridContainer}>
        <Card style={[styles.miniCard, { ...Shadows.sm }]}>
          <ThemedText style={[styles.miniLabel, { color: theme.textSecondary }]}>হিজরি তারিখ</ThemedText>
          <ThemedText style={[styles.miniValue, { color: theme.primary }]}>১৫ রমজান</ThemedText>
          <ThemedText style={[styles.miniDate, { color: theme.textSecondary }]}>১৪৪৬ হিজরি</ThemedText>
        </Card>

        <Card style={[styles.miniCard, styles.prayerCard, { borderTopColor: theme.primary, borderTopWidth: 3 }]}>
          <ThemedText style={[styles.miniLabel, { color: theme.primary, fontWeight: '700' }]}>পরবর্তী নামাজ</ThemedText>
          <ThemedText style={[styles.miniValue, { color: theme.primary, fontSize: 18 }]}>{nextPrayerInfo?.nameBn}</ThemedText>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
            <ThemedText style={[styles.countdown, { color: theme.secondary }]}>
              {nextPrayerInfo && `${String(nextPrayerInfo.timeRemaining.hours).padStart(2, '0')}:${String(nextPrayerInfo.timeRemaining.minutes).padStart(2, '0')}`}
            </ThemedText>
            <View style={[styles.timeBadge, { backgroundColor: theme.secondary + '20' }]}>
              <ThemedText style={[{ color: theme.secondary, fontSize: 11, fontWeight: '600' }]}>{nextPrayerInfo?.timeRemaining.minutes}m</ThemedText>
            </View>
          </View>
        </Card>
      </View>

      {/* Quick Actions Section */}
      <ThemedText style={[styles.sectionTitle, { color: theme.text, marginTop: Spacing.xl, marginBottom: Spacing.md }]}>দ্রুত অ্যাক্সেস</ThemedText>
      <FlatList
        scrollEnabled={false}
        data={QUICK_ACTIONS}
        numColumns={4}
        renderItem={({ item }) => (
          <Pressable style={[styles.actionCard, { ...Shadows.sm }]}>
            <View style={[styles.actionIcon, { backgroundColor: item.color + "20", borderRadius: BorderRadius.lg }]}>
              <Feather name={item.icon as any} size={20} color={item.color} />
            </View>
            <ThemedText style={[styles.actionLabel, { color: theme.text }]}>{item.label}</ThemedText>
          </Pressable>
        )}
        keyExtractor={(_, i) => i.toString()}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: Spacing.md }}
      />

      {/* Prayer Times Section */}
      <ThemedText style={[styles.sectionTitle, { color: theme.text, marginTop: Spacing.xl, marginBottom: Spacing.md }]}>আজকের নামাজের সময়সূচী</ThemedText>
      <Card style={{ ...Shadows.md }}>
        <FlatList
          scrollEnabled={false}
          data={prayers}
          numColumns={5}
          renderItem={({ item }) => (
            <View style={styles.prayerTimeItem}>
              <ThemedText style={[styles.prayerTimeName, { color: theme.text }]}>{item.name}</ThemedText>
              <ThemedText style={[styles.prayerTimeHour, { color: theme.primary }]}>{item.time}</ThemedText>
            </View>
          )}
          keyExtractor={(item) => item.key}
          columnWrapperStyle={{ flex: 1 }}
        />
      </Card>

      {/* Features Grid */}
      <ThemedText style={[styles.sectionTitle, { color: theme.text, marginTop: Spacing.xl, marginBottom: Spacing.md }]}>প্রধান বৈশিষ্ট্য</ThemedText>
      <View style={styles.featureGrid}>
        <Card style={[styles.featureCard, { ...Shadows.sm }]}>
          <Feather name="book-open" size={28} color={theme.primary} />
          <ThemedText style={[styles.featureTitle, { color: theme.text }]}>সম্পূর্ণ কুরআন</ThemedText>
          <ThemedText style={[styles.featureDesc, { color: theme.textSecondary }]}>বাংলা অনুবাদ সহ</ThemedText>
        </Card>

        <Card style={[styles.featureCard, { ...Shadows.sm }]}>
          <Feather name="calendar" size={28} color={theme.secondary} />
          <ThemedText style={[styles.featureTitle, { color: theme.text }]}>ইসলামিক ক্যালেন্ডার</ThemedText>
          <ThemedText style={[styles.featureDesc, { color: theme.textSecondary }]}>হিজরি তারিখ ট্র্যাক করুন</ThemedText>
        </Card>
      </View>

      <View style={styles.featureGrid}>
        <Card style={[styles.featureCard, { ...Shadows.sm }]}>
          <Feather name="compass" size={28} color={theme.accent} />
          <ThemedText style={[styles.featureTitle, { color: theme.text }]}>কিবলা দিক</ThemedText>
          <ThemedText style={[styles.featureDesc, { color: theme.textSecondary }]}>রিয়েল-টাইম কম্পাস</ThemedText>
        </Card>

        <Card style={[styles.featureCard, { ...Shadows.sm }]}>
          <Feather name="heart" size={28} color="#4CAF50" />
          <ThemedText style={[styles.featureTitle, { color: theme.text }]}>দুয়া সংগ্রহ</ThemedText>
          <ThemedText style={[styles.featureDesc, { color: theme.textSecondary }]}>২০০+ দুয়া সংরক্ষিত</ThemedText>
        </Card>
      </View>

      <View style={{ height: 60 }} />
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    marginHorizontal: -Spacing.lg,
    marginTop: -Spacing.lg,
    marginBottom: Spacing.xl,
    borderBottomLeftRadius: BorderRadius.lg,
    borderBottomRightRadius: BorderRadius.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  appName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  tagline: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  card: {
    marginBottom: Spacing.xl,
    borderRadius: BorderRadius.md,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  locationSubtitle: {
    fontSize: 13,
  },
  smallBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  miniCard: {
    flex: 1,
    borderRadius: BorderRadius.md,
  },
  prayerCard: {
    backgroundColor: undefined,
  },
  miniLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  miniValue: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  miniDate: {
    fontSize: 11,
  },
  countdown: {
    fontSize: 16,
    fontWeight: '700',
  },
  timeBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    marginRight: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  actionIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  prayerTimeItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    borderRightWidth: 1,
    borderRightColor: 'rgba(0,0,0,0.05)',
  },
  prayerTimeName: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  prayerTimeHour: {
    fontSize: 14,
    fontWeight: '700',
  },
  featureGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  featureCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: Spacing.md,
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 11,
    textAlign: 'center',
  },
});
