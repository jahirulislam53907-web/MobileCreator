import React, { useEffect, useState } from "react";
import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Gradient */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Feather name="navigation" size={32} color="#fff" />
            <View>
              <ThemedText style={styles.appName}>Smart Muslim</ThemedText>
              <ThemedText style={styles.tagline}>ইসলামিক সহায়ক</ThemedText>
            </View>
          </View>
          <Pressable style={styles.headerIcon}>
            <Feather name="bell" size={24} color="#fff" />
          </Pressable>
        </View>
      </View>

      <View style={styles.content}>
        {/* Location Card */}
        <View style={styles.locationCard}>
          <View style={styles.locationRow}>
            <View style={styles.locationIcon}>
              <Feather name="map-pin" size={20} color="#1a5e63" />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.locationTitle}>ঢাকা, বাংলাদেশ</ThemedText>
              <ThemedText style={styles.locationSubtitle}>আপনার বর্তমান লোকেশন</ThemedText>
            </View>
            <Pressable style={styles.changeBtn}>
              <Feather name="edit-2" size={12} color="#fff" />
              <ThemedText style={styles.changeBtnText}>পরিবর্তন</ThemedText>
            </Pressable>
          </View>
        </View>

        {/* Date & Next Prayer Grid */}
        <View style={styles.datetimeGrid}>
          <View style={styles.dateCard}>
            <ThemedText style={styles.cardLabel}>আজকের তারিখ</ThemedText>
            <ThemedText style={styles.hijriDate}>২৩ রমজান ১৪৪৫</ThemedText>
            <ThemedText style={styles.gregorianDate}>শুক্রবার, ৩ মে ২০২৪</ThemedText>
          </View>

          <View style={styles.prayerCard}>
            <ThemedText style={styles.cardLabel}>পরবর্তী নামাজ</ThemedText>
            <ThemedText style={styles.nextPrayerName}>{nextPrayerInfo?.nameBn}</ThemedText>
            <ThemedText style={styles.countdownLabel}>বাকি আছে:</ThemedText>
            <ThemedText style={styles.countdown}>
              {nextPrayerInfo && `${String(nextPrayerInfo.timeRemaining.hours).padStart(2, '0')}:${String(nextPrayerInfo.timeRemaining.minutes).padStart(2, '0')}:${String(nextPrayerInfo.timeRemaining.seconds).padStart(2, '0')}`}
            </ThemedText>
          </View>
        </View>

        {/* Quran Verse of the Day */}
        <View style={styles.verseSection}>
          <View style={styles.verseHeader}>
            <ThemedText style={styles.verseTitle}>আজকের আয়াত</ThemedText>
            <ThemedText style={styles.verseMeta}>{verse.surah}, {verse.ayah}</ThemedText>
          </View>
          <View style={styles.verseBg}>
            <ThemedText style={styles.verseArabic}>{verse.arabic}</ThemedText>
          </View>
          <ThemedText style={styles.verseTranslation}>"{verse.bengali}"</ThemedText>
          <View style={styles.verseActions}>
            <Pressable style={styles.verseBtn}>
              <Feather name="play" size={16} color="#fff" />
              <ThemedText style={styles.verseBtnText}>শুনুন</ThemedText>
            </Pressable>
            <Pressable style={styles.verseBtnSecondary}>
              <Feather name="share-2" size={16} color="#1a5e63" />
              <ThemedText style={styles.verseBtnTextSecondary}>শেয়ার</ThemedText>
            </Pressable>
            <Pressable style={styles.verseBtnSecondary}>
              <Feather name="bookmark" size={16} color="#1a5e63" />
              <ThemedText style={styles.verseBtnTextSecondary}>সেভ</ThemedText>
            </Pressable>
          </View>
        </View>

        {/* Quick Actions */}
        <ThemedText style={styles.sectionTitle}>দ্রুত এক্সেস</ThemedText>
        <View style={styles.quickActionsGrid}>
          {QUICK_ACTIONS.map((item, idx) => (
            <Pressable key={idx} style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: item.color + '20' }]}>
                <Feather name={item.icon as any} size={18} color={item.color} />
              </View>
              <ThemedText style={styles.actionLabel}>{item.label}</ThemedText>
            </Pressable>
          ))}
        </View>

        {/* Prayer Times */}
        <ThemedText style={styles.sectionTitle}>আজকের নামাজের সময়সূচী</ThemedText>
        <View style={styles.prayerTimesCard}>
          <View style={styles.prayerGrid}>
            {prayers.map((prayer) => (
              <View key={prayer.key} style={styles.prayerTimeItem}>
                <ThemedText style={styles.prayerName}>{prayer.name}</ThemedText>
                <ThemedText style={styles.prayerTime}>{prayer.time}</ThemedText>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#1a5e63',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 12,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  tagline: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    marginTop: 2,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  content: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  locationCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#1a5e631a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  locationSubtitle: {
    fontSize: 12,
    color: '#6c757d',
  },
  changeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#1a5e63',
  },
  changeBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  datetimeGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  dateCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  prayerCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
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
    fontSize: 15,
    fontWeight: '700',
    color: '#1a5e63',
    marginBottom: 2,
  },
  gregorianDate: {
    fontSize: 12,
    color: '#6c757d',
  },
  nextPrayerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a5e63',
    marginBottom: 8,
  },
  countdownLabel: {
    fontSize: 11,
    color: '#6c757d',
    marginBottom: 2,
  },
  countdown: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f9a826',
  },
  verseSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    borderTopWidth: 4,
    borderTopColor: '#1a5e63',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  verseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  verseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e2a3a',
  },
  verseMeta: {
    fontSize: 11,
    color: '#6c757d',
  },
  verseBg: {
    backgroundColor: '#e9ecef',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  verseArabic: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#1a5e63',
    lineHeight: 26,
  },
  verseTranslation: {
    fontSize: 13,
    textAlign: 'center',
    color: '#6c757d',
    marginBottom: 12,
    lineHeight: 18,
  },
  verseActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  verseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1a5e63',
  },
  verseBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  verseBtnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
  verseBtnTextSecondary: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1a5e63',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e2a3a',
    marginBottom: 10,
    marginTop: 15,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 15,
  },
  actionCard: {
    width: '24.5%',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  prayerTimesCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
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
    paddingVertical: 10,
  },
  prayerName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  prayerTime: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a5e63',
  },
});
