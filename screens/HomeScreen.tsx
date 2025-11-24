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
    { icon: 'book-open', label: 'কুরআন', color: '#2d936c' },
    { icon: 'volume-2', label: 'আজান', color: '#f9a826' },
    { icon: 'users', label: 'নামাজ শিক্ষা', color: '#1a5e63' },
    { icon: 'heart', label: 'দুয়া', color: '#4CAF50' },
    { icon: 'compass', label: 'কিবলা', color: '#2d936c' },
    { icon: 'map-pin', label: 'মসজিদ', color: '#1a5e63' },
    { icon: 'clock', label: 'নামাজ', color: '#f9a826' },
    { icon: 'book', label: 'কিতাব', color: '#2d936c' },
    { icon: 'calendar', label: 'রোজা', color: '#1a5e63' },
    { icon: 'star', label: 'হজ্জ ও ওমরা', color: '#f9a826' },
    { icon: 'gift', label: 'যাকাত', color: '#4CAF50' },
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
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Feather name="navigation" size={32} color="#fff" />
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
      <View style={[styles.locationCard, { backgroundColor: '#ffffff' }]}>
        <View style={styles.locationRow}>
          <View style={[styles.locationIcon, { backgroundColor: '#1a5e631a' }]}>
            <Feather name="map-pin" size={20} color="#1a5e63" />
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.locationTitle}>ঢাকা, বাংলাদেশ</ThemedText>
            <ThemedText style={styles.locationSubtitle}>আপনার বর্তমান লোকেশন</ThemedText>
          </View>
          <Pressable style={[styles.changeBtn, { backgroundColor: '#1a5e63' }]}>
            <Feather name="edit-2" size={14} color="#fff" />
            <ThemedText style={[styles.changeBtnText]}>পরিবর্তন</ThemedText>
          </Pressable>
        </View>
      </View>

      {/* Date & Next Prayer Grid */}
      <View style={styles.datetimeGrid}>
        <View style={[styles.dateCard, { backgroundColor: '#ffffff' }]}>
          <ThemedText style={styles.cardLabel}>আজকের তারিখ</ThemedText>
          <ThemedText style={styles.hijriDate}>২৩ রমজান ১৪৪৫</ThemedText>
          <ThemedText style={styles.gregorianDate}>শুক্রবার, ৩ মে ২০২৪</ThemedText>
        </View>

        <View style={[styles.prayerCard, { backgroundColor: '#ffffff' }]}>
          <ThemedText style={styles.cardLabel}>পরবর্তী নামাজ</ThemedText>
          <ThemedText style={styles.nextPrayerName}>{nextPrayerInfo?.nameBn}</ThemedText>
          <ThemedText style={styles.countdownLabel}>বাকি আছে:</ThemedText>
          <ThemedText style={styles.countdown}>
            {nextPrayerInfo && `${String(nextPrayerInfo.timeRemaining.hours).padStart(2, '0')}:${String(nextPrayerInfo.timeRemaining.minutes).padStart(2, '0')}:${String(nextPrayerInfo.timeRemaining.seconds).padStart(2, '0')}`}
          </ThemedText>
        </View>
      </View>

      {/* Quran Verse of the Day */}
      <View style={[styles.verseSection, { backgroundColor: '#ffffff' }]}>
        <View style={styles.verseHeader}>
          <ThemedText style={styles.verseTitle}>আজকের আয়াত</ThemedText>
          <ThemedText style={styles.verseMeta}>{verse.surah}, {verse.ayah}</ThemedText>
        </View>
        <View style={[styles.verseBg, { backgroundColor: '#e9ecef' }]}>
          <ThemedText style={styles.verseArabic}>{verse.arabic}</ThemedText>
        </View>
        <ThemedText style={styles.verseTranslation}>"{verse.bengali}"</ThemedText>
        <View style={styles.verseActions}>
          <Pressable style={[styles.verseBtn, { backgroundColor: '#1a5e63' }]}>
            <Feather name="play" size={16} color="#fff" />
            <ThemedText style={styles.verseBtnText}>শুনুন</ThemedText>
          </Pressable>
          <Pressable style={[styles.verseBtnSecondary, { backgroundColor: '#f8f9fa' }]}>
            <Feather name="share-2" size={16} color="#1a5e63" />
            <ThemedText style={styles.verseBtnTextSecondary}>শেয়ার</ThemedText>
          </Pressable>
          <Pressable style={[styles.verseBtnSecondary, { backgroundColor: '#f8f9fa' }]}>
            <Feather name="bookmark" size={16} color="#1a5e63" />
            <ThemedText style={styles.verseBtnTextSecondary}>সেভ</ThemedText>
          </Pressable>
        </View>
      </View>

      {/* Quick Actions */}
      <ThemedText style={styles.sectionTitle}>দ্রুত এক্সেস</ThemedText>
      <View style={styles.quickActionsGrid}>
        {QUICK_ACTIONS.map((item, idx) => (
          <Pressable key={idx} style={[styles.actionCard, { backgroundColor: '#ffffff' }]}>
            <View style={[styles.actionIcon, { backgroundColor: item.color + '20' }]}>
              <Feather name={item.icon as any} size={20} color={item.color} />
            </View>
            <ThemedText style={styles.actionLabel}>{item.label}</ThemedText>
          </Pressable>
        ))}
      </View>

      {/* Prayer Times */}
      <ThemedText style={[styles.sectionTitle, { marginTop: Spacing.xl }]}>আজকের নামাজের সময়সূচী</ThemedText>
      <View style={[styles.prayerTimesCard, { backgroundColor: '#ffffff' }]}>
        <View style={styles.prayerGrid}>
          {prayers.map((prayer) => (
            <View key={prayer.key} style={styles.prayerTimeItem}>
              <ThemedText style={styles.prayerName}>{prayer.name}</ThemedText>
              <ThemedText style={styles.prayerTime}>{prayer.time}</ThemedText>
            </View>
          ))}
        </View>
      </View>

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
    backgroundColor: '#1a5e63',
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
  locationCard: {
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.md,
    padding: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
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
    color: '#6c757d',
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
    color: '#fff',
  },
  datetimeGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  dateCard: {
    flex: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  prayerCard: {
    flex: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
  },
  hijriDate: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a5e63',
    marginBottom: 2,
  },
  gregorianDate: {
    fontSize: 13,
    color: '#6c757d',
  },
  nextPrayerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a5e63',
    marginBottom: 8,
  },
  countdownLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 2,
  },
  countdown: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f9a826',
  },
  verseSection: {
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    borderTopWidth: 4,
    borderTopColor: '#1a5e63',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
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
    color: '#1e2a3a',
  },
  verseMeta: {
    fontSize: 12,
    color: '#6c757d',
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
    color: '#1a5e63',
    lineHeight: 28,
  },
  verseTranslation: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6c757d',
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
    color: '#fff',
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
    color: '#1a5e63',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e2a3a',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
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
    color: '#333333',
  },
  prayerTimesCard: {
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
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
    color: '#333333',
    marginBottom: 4,
  },
  prayerTime: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a5e63',
  },
});
