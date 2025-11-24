import React, { useEffect, useState } from "react";
import { View, StyleSheet, Pressable, ScrollView, SafeAreaView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { HeaderNav } from "@/components/HeaderNav";
import { useAppTheme } from "@/hooks/useAppTheme";
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
  const { theme } = useAppTheme();
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

  const TRACKER_DATA = [
    {
      title: 'নামাজ ট্র্যাকার',
      icon: 'users',
      stat1: '৫/৫',
      label1: 'আজ',
      stat2: '৩০/৩০',
      label2: 'এই মাস',
      progress: 100,
    },
    {
      title: 'কুরআন তিলাওয়াত',
      icon: 'book',
      stat1: '২ পৃষ্ঠা',
      label1: 'আজ',
      stat2: '১৫%',
      label2: 'সম্পূর্ণ',
      progress: 15,
    },
  ];

  const FEATURES = [
    { title: 'কুরআন মাজিদ', desc: 'সম্পূর্ণ কুরআন বাংলা অনুবাদ ও তাফসীর সহ', icon: 'book-open' },
    { title: 'নামাজের সময়সূচী', desc: 'সঠিক সময়ে নামাজের জন্য রিমাইন্ডার', icon: 'clock' },
    { title: 'দুয়া ও যিকর', desc: 'প্রতিদিনের দুয়া ও যিকরের সংগ্রহ', icon: 'heart' },
    { title: 'ইসলামিক ক্যালেন্ডার', desc: 'হিজরি ও ইংরেজি তারিখ একসাথে', icon: 'calendar' },
    { title: 'কিবলা কম্পাস', desc: 'সঠিক কিবলা দিক নির্দেশনা', icon: 'compass' },
    { title: 'নামাজ শিক্ষা', desc: 'সঠিকভাবে নামাজ শিখুন', icon: 'users' },
  ];

  return (
    <View style={{ flex: 1 }}>
      <HeaderNav />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Location Selector */}
        <View style={styles.locationCard}>
          <View style={styles.locationInfo}>
            <View style={styles.locationIconBg}>
              <Feather name="map-pin" size={18} color="#1a5e63" />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.locationTitle}>ঢাকা, বাংলাদেশ</ThemedText>
              <ThemedText style={styles.locationSubtitle}>আপনার বর্তমান লোকেশন</ThemedText>
            </View>
          </View>
          <Pressable style={styles.changeBtn}>
            <Feather name="edit-2" size={12} color="#fff" />
            <ThemedText style={styles.changeBtnText}>পরিবর্তন</ThemedText>
          </Pressable>
        </View>

        {/* Date & Next Prayer */}
        <View style={styles.datetimeGrid}>
          <View style={styles.dateCard}>
            <ThemedText style={styles.cardLabel}>আজকের তারিখ</ThemedText>
            <ThemedText style={styles.hijriDate}>২৩ রমজান ১৪৪৫</ThemedText>
            <ThemedText style={styles.gregorianDate}>শুক্রবার, ৩ মে ২০২৪</ThemedText>
          </View>

          <View style={styles.nextPrayerCard}>
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
              <Feather name="play" size={14} color="#fff" />
              <ThemedText style={styles.verseBtnText}>শুনুন</ThemedText>
            </Pressable>
            <Pressable style={styles.verseBtnSecondary}>
              <Feather name="share-2" size={14} color="#1a5e63" />
              <ThemedText style={styles.verseBtnTextSecondary}>শেয়ার</ThemedText>
            </Pressable>
            <Pressable style={styles.verseBtnSecondary}>
              <Feather name="bookmark" size={14} color="#1a5e63" />
              <ThemedText style={styles.verseBtnTextSecondary}>সেভ</ThemedText>
            </Pressable>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionTitleRow}>
          <ThemedText style={styles.sectionTitle}>দ্রুত এক্সেস</ThemedText>
          <Pressable>
            <ThemedText style={styles.seeAll}>সব দেখুন</ThemedText>
          </Pressable>
        </View>
        <View style={styles.quickActionsGrid}>
          {QUICK_ACTIONS.map((item, idx) => (
            <Pressable key={idx} style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: item.color + '20' }]}>
                <Feather name={item.icon as any} size={16} color={item.color} />
              </View>
              <ThemedText style={styles.actionLabel}>{item.label}</ThemedText>
            </Pressable>
          ))}
        </View>

        {/* Prayer Times */}
        <View style={styles.sectionTitleRow}>
          <ThemedText style={styles.sectionTitle}>আজকের নামাজের সময়সূচী</ThemedText>
          <Pressable>
            <ThemedText style={styles.seeAll}>সম্পূর্ণ সময়সূচী</ThemedText>
          </Pressable>
        </View>
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

        {/* Tracker Section */}
        <View style={styles.sectionTitleRow}>
          <ThemedText style={styles.sectionTitle}>আপনার ইবাদত ট্র্যাকার</ThemedText>
          <Pressable>
            <ThemedText style={styles.seeAll}>বিস্তারিত</ThemedText>
          </Pressable>
        </View>
        <View style={styles.trackerGrid}>
          {TRACKER_DATA.map((tracker, idx) => (
            <View key={idx} style={styles.trackerCard}>
              <View style={styles.trackerHeader}>
                <ThemedText style={styles.trackerTitle}>{tracker.title}</ThemedText>
                <View style={styles.trackerIconBg}>
                  <Feather name={tracker.icon as any} size={16} color="#fff" />
                </View>
              </View>
              <View style={styles.trackerStats}>
                <View style={styles.stat}>
                  <ThemedText style={styles.statValue}>{tracker.stat1}</ThemedText>
                  <ThemedText style={styles.statLabel}>{tracker.label1}</ThemedText>
                </View>
                <View style={styles.stat}>
                  <ThemedText style={styles.statValue}>{tracker.stat2}</ThemedText>
                  <ThemedText style={styles.statLabel}>{tracker.label2}</ThemedText>
                </View>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progress, { width: `${tracker.progress}%` }]} />
              </View>
            </View>
          ))}
        </View>

        {/* Features Grid */}
        <View style={styles.sectionTitleRow}>
          <ThemedText style={styles.sectionTitle}>বিশেষ ফিচারসমূহ</ThemedText>
          <Pressable>
            <ThemedText style={styles.seeAll}>সব দেখুন</ThemedText>
          </Pressable>
        </View>
        <View style={styles.featuresGrid}>
          {FEATURES.map((feature, idx) => (
            <View key={idx} style={styles.featureCard}>
              <Feather name={feature.icon as any} size={24} color="#1a5e63" />
              <ThemedText style={styles.featureTitle}>{feature.title}</ThemedText>
              <ThemedText style={styles.featureDesc}>{feature.desc}</ThemedText>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* AI Assistant Button */}
      <Pressable style={styles.aiButton}>
        <Feather name="message-circle" size={24} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  locationCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  locationIconBg: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#1a5e631a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  locationSubtitle: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 2,
  },
  changeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
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
    marginBottom: 12,
  },
  dateCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  nextPrayerCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  cardLabel: {
    fontSize: 11,
    color: '#6c757d',
    marginBottom: 4,
  },
  hijriDate: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a5e63',
    marginBottom: 2,
  },
  gregorianDate: {
    fontSize: 12,
    color: '#6c757d',
  },
  nextPrayerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a5e63',
    marginBottom: 6,
  },
  countdownLabel: {
    fontSize: 10,
    color: '#6c757d',
    marginBottom: 2,
  },
  countdown: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f9a826',
  },
  verseSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderTopWidth: 4,
    borderTopColor: '#1a5e63',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
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
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  verseArabic: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#1a5e63',
    lineHeight: 24,
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
    gap: 8,
    flexWrap: 'wrap',
  },
  verseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
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
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#f8f9fa',
  },
  verseBtnTextSecondary: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1a5e63',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e2a3a',
  },
  seeAll: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1a5e63',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '23.5%',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
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
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  prayerGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  prayerTimeItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  prayerName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  prayerTime: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1a5e63',
  },
  trackerGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  trackerCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  trackerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trackerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  trackerIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1a5e63',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a5e63',
  },
  statLabel: {
    fontSize: 11,
    color: '#6c757d',
    marginTop: 2,
  },
  progressBar: {
    height: 5,
    backgroundColor: '#e9ecef',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#1a5e63',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    borderTopWidth: 4,
    borderTopColor: '#1a5e63',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
  featureDesc: {
    fontSize: 11,
    color: '#6c757d',
    marginTop: 5,
    textAlign: 'center',
  },
  aiButton: {
    position: 'absolute',
    bottom: 70,
    right: 15,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#1a5e63',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
});
