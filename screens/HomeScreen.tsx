import React, { useEffect, useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, Typography, BorderRadius } from "@/constants/theme";
import { calculatePrayerTimes, getNextPrayer, DHAKA_COORDINATES, type PrayerTimesData, type NextPrayerInfo } from "@/utils/prayerTimes";

interface QuranVerse {
  surah: string;
  ayah: string;
  arabic: string;
  bengali: string;
}

// HTML-এর exact colors
const COLORS = {
  primary: "#1a5e63",
  secondary: "#2d936c",
  accent: "#f9a826",
  light: "#f8f9fa",
  dark: "#1e2a3a",
  text: "#333333",
  textLight: "#6c757d",
  white: "#ffffff",
  bgGradient: "#e9ecef",
};

const QURAN_VERSES: QuranVerse[] = [
  {
    surah: "সূরা আল-বাকারা",
    ayah: "আয়াত: ১৮৬",
    arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ",
    bengali: "আর যখন আমার বান্দাগণ আপনার কাছে আমার ব্যাপারে জিজ্ঞেস করে, তখন আমি তো নিকটেই; আহ্বানকারীর আহ্বান কবুল করি, যখন সে আমাকে ডাকে।",
  },
];

export default function HomeScreen() {
  const { theme } = useTheme();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [nextPrayerInfo, setNextPrayerInfo] = useState<NextPrayerInfo | null>(null);
  const [verse] = useState<QuranVerse>(QURAN_VERSES[0]);

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
    { icon: 'book-open', label: 'কুরআন', color: COLORS.secondary },
    { icon: 'volume-2', label: 'আজান', color: COLORS.accent },
    { icon: 'users', label: 'নামাজ শিক্ষা', color: COLORS.primary },
    { icon: 'heart', label: 'দুয়া', color: '#4CAF50' },
    { icon: 'compass', label: 'কিবলা', color: COLORS.secondary },
    { icon: 'map-pin', label: 'মসজিদ', color: COLORS.primary },
    { icon: 'clock', label: 'নামাজ', color: COLORS.accent },
    { icon: 'book', label: 'কিতাব', color: COLORS.secondary },
    { icon: 'calendar', label: 'রোজা', color: COLORS.primary },
    { icon: 'star', label: 'হজ্জ ও ওমরা', color: COLORS.accent },
    { icon: 'gift', label: 'যাকাত', color: '#4CAF50' },
    { icon: 'moon', label: 'রমজান', color: COLORS.secondary },
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
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Feather name="navigation" size={32} color={COLORS.white} />
            <View>
              <ThemedText style={styles.appName}>Smart Muslim</ThemedText>
              <ThemedText style={styles.tagline}>ইসলামিক সহায়ক</ThemedText>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Pressable style={styles.headerIcon}>
              <Feather name="bell" size={24} color={COLORS.white} />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Location Card */}
      <Card style={styles.locationCard}>
        <View style={styles.locationRow}>
          <View style={[styles.locationIcon, { backgroundColor: COLORS.primary + "15" }]}>
            <Feather name="map-pin" size={20} color={COLORS.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText style={[styles.locationTitle, { color: COLORS.text }]}>ঢাকা, বাংলাদেশ</ThemedText>
            <ThemedText style={[styles.locationSubtitle, { color: COLORS.textLight }]}>আপনার বর্তমান লোকেশন</ThemedText>
          </View>
          <Pressable style={[styles.changeBtn, { backgroundColor: COLORS.primary }]}>
            <Feather name="edit-2" size={14} color={COLORS.white} />
            <ThemedText style={[styles.changeBtnText, { color: COLORS.white }]}>পরিবর্তন</ThemedText>
          </Pressable>
        </View>
      </Card>

      {/* Date & Next Prayer Grid */}
      <View style={styles.datetimeGrid}>
        <Card style={styles.dateCard}>
          <ThemedText style={[styles.cardLabel, { color: COLORS.textLight }]}>আজকের তারিখ</ThemedText>
          <ThemedText style={[styles.hijriDate, { color: COLORS.primary }]}>২৩ রমজান ১৪৪৫</ThemedText>
          <ThemedText style={[styles.gregorianDate, { color: COLORS.textLight }]}>শুক্রবার, ৩ মে ২০২৪</ThemedText>
        </Card>

        <Card style={styles.prayerCard}>
          <ThemedText style={[styles.cardLabel, { color: COLORS.textLight }]}>পরবর্তী নামাজ</ThemedText>
          <ThemedText style={[styles.nextPrayerName, { color: COLORS.primary }]}>{nextPrayerInfo?.nameBn}</ThemedText>
          <ThemedText style={[styles.countdownLabel, { color: COLORS.textLight }]}>বাকি আছে:</ThemedText>
          <ThemedText style={[styles.countdown, { color: COLORS.accent }]}>
            {nextPrayerInfo && `${String(nextPrayerInfo.timeRemaining.hours).padStart(2, '0')}:${String(nextPrayerInfo.timeRemaining.minutes).padStart(2, '0')}:${String(nextPrayerInfo.timeRemaining.seconds).padStart(2, '0')}`}
          </ThemedText>
        </Card>
      </View>

      {/* Quran Verse of the Day */}
      <Card style={styles.verseSection}>
        <View style={styles.verseHeader}>
          <ThemedText style={[styles.verseTitle, { color: COLORS.dark }]}>আজকের আয়াত</ThemedText>
          <ThemedText style={[styles.verseMeta, { color: COLORS.textLight }]}>{verse.surah}, {verse.ayah}</ThemedText>
        </View>
        <View style={[styles.verseBg, { backgroundColor: COLORS.bgGradient }]}>
          <ThemedText style={[styles.verseArabic, { color: COLORS.primary }]}>{verse.arabic}</ThemedText>
        </View>
        <ThemedText style={[styles.verseTranslation, { color: COLORS.textLight }]}>"{verse.bengali}"</ThemedText>
        <View style={styles.verseActions}>
          <Pressable style={[styles.verseBtn, { backgroundColor: COLORS.primary }]}>
            <Feather name="play" size={16} color={COLORS.white} />
            <ThemedText style={[styles.verseBtnText, { color: COLORS.white }]}>শুনুন</ThemedText>
          </Pressable>
          <Pressable style={[styles.verseBtnSecondary, { backgroundColor: COLORS.light }]}>
            <Feather name="share-2" size={16} color={COLORS.primary} />
            <ThemedText style={[styles.verseBtnTextSecondary, { color: COLORS.primary }]}>শেয়ার</ThemedText>
          </Pressable>
          <Pressable style={[styles.verseBtnSecondary, { backgroundColor: COLORS.light }]}>
            <Feather name="bookmark" size={16} color={COLORS.primary} />
            <ThemedText style={[styles.verseBtnTextSecondary, { color: COLORS.primary }]}>সেভ</ThemedText>
          </Pressable>
        </View>
      </Card>

      {/* Quick Actions */}
      <ThemedText style={[styles.sectionTitle, { color: COLORS.dark }]}>দ্রুত এক্সেস</ThemedText>
      <View style={styles.quickActionsGrid}>
        {QUICK_ACTIONS.map((item, idx) => (
          <Pressable key={idx} style={styles.actionCard}>
            <View style={[styles.actionIcon, { backgroundColor: item.color + "20" }]}>
              <Feather name={item.icon as any} size={20} color={item.color} />
            </View>
            <ThemedText style={[styles.actionLabel, { color: COLORS.text }]}>{item.label}</ThemedText>
          </Pressable>
        ))}
      </View>

      {/* Prayer Times */}
      <ThemedText style={[styles.sectionTitle, { color: COLORS.dark, marginTop: Spacing.xl }]}>আজকের নামাজের সময়সূচী</ThemedText>
      <Card style={styles.prayerTimesCard}>
        <View style={styles.prayerGrid}>
          {prayers.map((prayer) => (
            <View key={prayer.key} style={styles.prayerTimeItem}>
              <ThemedText style={[styles.prayerName, { color: COLORS.text }]}>{prayer.name}</ThemedText>
              <ThemedText style={[styles.prayerTime, { color: COLORS.primary }]}>{prayer.time}</ThemedText>
            </View>
          ))}
        </View>
      </Card>

      {/* Spacer */}
      <View style={{ height: 100 }} />
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    marginHorizontal: -Spacing.lg,
    marginTop: -Spacing.lg,
    marginBottom: Spacing.lg,
    borderBottomLeftRadius: BorderRadius.lg,
    borderBottomRightRadius: BorderRadius.lg,
    background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
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
    color: COLORS.white,
  },
  tagline: {
    fontSize: 12,
    color: COLORS.white,
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
  locationCard: {
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.md,
    backgroundColor: COLORS.white,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  locationIcon: {
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
  changeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
  },
  changeBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  datetimeGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  dateCard: {
    flex: 1,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    backgroundColor: COLORS.white,
  },
  prayerCard: {
    flex: 1,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    backgroundColor: COLORS.white,
  },
  cardLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  hijriDate: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  gregorianDate: {
    fontSize: 13,
  },
  nextPrayerName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  countdownLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  countdown: {
    fontSize: 20,
    fontWeight: '700',
  },
  verseSection: {
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: COLORS.white,
    borderTopWidth: 4,
    borderTopColor: COLORS.primary,
  },
  verseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  verseTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  verseMeta: {
    fontSize: 12,
  },
  verseBg: {
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  verseArabic: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 28,
  },
  verseTranslation: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  verseActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    flexWrap: 'wrap',
  },
  verseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
  },
  verseBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  verseBtnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
  },
  verseBtnTextSecondary: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '24%',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: COLORS.white,
  },
  actionIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  prayerTimesCard: {
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
    backgroundColor: COLORS.white,
  },
  prayerGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  prayerTimeItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  prayerName: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  prayerTime: {
    fontSize: 16,
    fontWeight: '700',
  },
});
