import React, { useEffect, useState } from "react";
import { View, StyleSheet, Pressable, ScrollView, Alert, Image } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ThemedText } from "@/components/ThemedText";
import { TopNavigationBar } from "@/components/TopNavigationBar";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useTranslation } from "../src/contexts/LanguageContext";
import { useLocation } from "@/src/hooks/useLocation";
import { Spacing, BorderRadius } from "@/constants/theme";
import { calculatePrayerTimes, getNextPrayer, DHAKA_COORDINATES, type PrayerTimesData, type NextPrayerInfo } from "@/utils/prayerTimes";
import { formatDate } from "@/utils/dateUtils";
import { MENU_ICONS } from "@/constants/menuIcons";

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
  const { t } = useTranslation();
  const { location, requestLocationPermission, loading: locationLoading } = useLocation();
  
  // Initialize with default location data
  const defaultLat = DHAKA_COORDINATES.latitude;
  const defaultLon = DHAKA_COORDINATES.longitude;
  
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(() => calculatePrayerTimes(defaultLat, defaultLon));
  const [nextPrayerInfo, setNextPrayerInfo] = useState<NextPrayerInfo>(() => getNextPrayer(defaultLat, defaultLon));
  const [verse] = useState<QuranVerse>(QURAN_VERSES[0]);
  const [formattedDate, setFormattedDate] = useState(formatDate());

  const handleLocationPress = async () => {
    const success = await requestLocationPermission();
    if (!success) {
      Alert.alert(
        'লোকেশন পারমিশন',
        'আপনার ডিভাইসের লোকেশন এক্সেস করতে পারমিশন প্রয়োজন। সঠিক প্রার্থনার সময় এর জন্য আপনার বর্তমান অবস্থান আমাদের প্রয়োজন।'
      );
    }
  };

  useEffect(() => {
    const lat = location?.latitude || DHAKA_COORDINATES.latitude;
    const lon = location?.longitude || DHAKA_COORDINATES.longitude;
    const times = calculatePrayerTimes(lat, lon);
    setPrayerTimes(times);
    setFormattedDate(formatDate());
  }, [location]);

  useEffect(() => {
    const updateNextPrayer = () => {
      const lat = location?.latitude || DHAKA_COORDINATES.latitude;
      const lon = location?.longitude || DHAKA_COORDINATES.longitude;
      const next = getNextPrayer(lat, lon);
      setNextPrayerInfo(next);
      setFormattedDate(formatDate());
    };
    updateNextPrayer();
    const interval = setInterval(updateNextPrayer, 1000);
    return () => clearInterval(interval);
  }, [location]);

  const quickActionLabels = typeof t('home.quick_actions') === 'string' ? [] : (t('home.quick_actions') || []);
  
  // Dynamic color palette based on theme
  const actionColors = [
    theme.primary,
    theme.secondary,
    theme.accent,
    theme.success,
    theme.primaryLight,
    theme.secondaryLight,
    theme.accent,
    theme.primary,
    theme.secondary,
    theme.accent,
    theme.primaryLight,
    theme.secondary,
  ];

  const QUICK_ACTIONS = [
    { iconKey: 'quran', label: quickActionLabels[0] || 'কুরআন' },
    { iconKey: 'azan', label: quickActionLabels[1] || 'আজান' },
    { iconKey: 'prayer-teaching', label: quickActionLabels[2] || 'নামাজ শিক্ষা' },
    { iconKey: 'dua', label: quickActionLabels[3] || 'দুয়া' },
    { iconKey: 'qibla', label: quickActionLabels[4] || 'কিবলা' },
    { iconKey: 'hajj', label: quickActionLabels[5] || 'হজ্জ ও ওমরা' },
    { iconKey: 'prayer-time', label: quickActionLabels[6] || 'নামাজ' },
    { iconKey: 'islamic-books', label: quickActionLabels[7] || 'কিতাব' },
    { iconKey: 'islamic-calendar', label: quickActionLabels[8] || 'রোজা' },
    { iconKey: 'kalima', label: quickActionLabels[9] || 'কালিমা' },
    { iconKey: 'zakat', label: quickActionLabels[10] || 'যাকাত' },
    { iconKey: 'community', label: quickActionLabels[11] || 'সম্প্রদায়' },
  ];

  const prayerNamesObj = typeof t('home.prayer_names') === 'object' ? (t('home.prayer_names') as unknown as Record<string, string>) : {};
  const prayers = prayerTimes ? [
    { name: prayerNamesObj.fajr || 'ফজর', time: prayerTimes.fajr, key: 'fajr' },
    { name: prayerNamesObj.dhuhr || 'যোহর', time: prayerTimes.dhuhr, key: 'dhuhr' },
    { name: prayerNamesObj.asr || 'আসর', time: prayerTimes.asr, key: 'asr' },
    { name: prayerNamesObj.maghrib || 'মাগরিব', time: prayerTimes.maghrib, key: 'maghrib' },
    { name: prayerNamesObj.isha || 'এশা', time: prayerTimes.isha, key: 'isha' },
  ] : [];

  const TRACKER_DATA = [
    {
      title: t('home.prayer_tracker') || 'নামাজ ট্র্যাকার',
      iconKey: 'prayer-time',
      stat1: '৫/৫',
      label1: t('home.today') || 'আজ',
      stat2: '৩০/३०',
      label2: t('home.this_month') || 'এই মাস',
      progress: 100,
    },
    {
      title: t('home.quran_recitation') || 'কুরআন তিলাওয়াত',
      iconKey: 'quran-recitation',
      stat1: '2' + (t('home.pages') || 'পৃষ্ঠা'),
      label1: t('home.today') || 'আজ',
      stat2: '15%',
      label2: t('home.complete') || 'সম্পূর্ণ',
      progress: 15,
    },
  ];

  const FEATURES = [
    { title: t('home.quran_title') || 'কুরআন মাজিদ', desc: t('home.quran_desc') || 'সম্পূর্ণ কুরআন বাংলা অনুবাদ ও তাফসীর সহ', iconKey: 'quran' },
    { title: t('home.prayer_schedule_title') || 'নামাজের সময়সূচী', desc: t('home.prayer_schedule_desc') || 'সঠিক সময়ে নামাজের জন্য রিমাইন্ডার', iconKey: 'prayer-time' },
    { title: t('home.dua_title') || 'দুয়া ও যিকর', desc: t('home.dua_desc') || 'প্রতিদিনের দুয়া ও যিকরের সংগ্রহ', iconKey: 'dua' },
    { title: t('home.calendar_title') || 'ইসলামিক ক্যালেন্ডার', desc: t('home.calendar_desc') || 'হিজরি ও ইংরেজি তারিখ একসাথে', iconKey: 'islamic-calendar' },
    { title: t('home.qibla_title') || 'কিবলা কম্পাস', desc: t('home.qibla_desc') || 'সঠিক কিবলা দিক নির্দেশনা', iconKey: 'qibla' },
    { title: t('home.prayer_teaching') || 'নামাজ শিক্ষা', desc: t('home.prayer_teaching_desc') || 'সঠিকভাবে নামাজ শিখুন', iconKey: 'prayer-teaching' },
  ];

  return (
    <View style={[{ flex: 1, backgroundColor: theme.backgroundRoot }]}>
      <TopNavigationBar activeTab="Home" />
      <ScrollView style={[styles.content, { backgroundColor: theme.backgroundRoot }]} scrollEnabled={true} contentContainerStyle={{ backgroundColor: theme.backgroundRoot }} showsVerticalScrollIndicator={false}>
        {/* Location Display */}
        <Pressable
          onPress={handleLocationPress}
          style={({ pressed }) => [
            styles.locationCard,
            { backgroundColor: theme.backgroundDefault },
            pressed && { opacity: 0.7 }
          ]}
          disabled={locationLoading}
        >
          <View style={styles.locationInfo}>
            <View style={[styles.locationIconBg, { backgroundColor: theme.primary + '20' }]}>
              <MaterialIcons name="location-on" size={18} color={theme.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.locationTitle}>
                {location ? `${location.name}, ${location.country}` : 'লোকেশন যুক্ত করুন'}
              </ThemedText>
              <ThemedText style={styles.locationSubtitle}>
                {locationLoading ? 'লোকেশন প্রাপ্ত হচ্ছে...' : (location ? 'আপনার বর্তমান লোকেশন' : 'ক্লিক করে অনুমতি দিন')}
              </ThemedText>
            </View>
            <View style={[styles.locationRefresh, { opacity: locationLoading ? 0.6 : 1 }]}>
              <MaterialIcons name="refresh" size={16} color={theme.primary} />
            </View>
          </View>
        </Pressable>

        {/* Date & Next Prayer */}
        <View style={styles.datetimeGrid}>
          <View style={[styles.dateCard, { backgroundColor: theme.backgroundDefault }]}>
            <ThemedText style={[styles.dateDisplayLine, { color: '#ffffff' }]}>
              {formattedDate.gregorian}
            </ThemedText>
            <ThemedText style={[styles.dateDisplayLine, { color: '#ffffff' }]}>
              {formattedDate.hijri}
            </ThemedText>
          </View>

          <View style={[styles.nextPrayerCard, { backgroundColor: theme.backgroundDefault }]}>
            <View style={styles.prayerInfoLine}>
              <ThemedText style={styles.prayerLabelSmall}>{t('home.next_prayer') || 'পরবর্তী নামাজ'}</ThemedText>
              <ThemedText style={[styles.prayerNameSmall, { color: '#ffffff', flex: 1, textAlign: 'right' }]}>
                {nextPrayerInfo.nameBn}
              </ThemedText>
            </View>
            <View style={styles.prayerInfoLine}>
              <ThemedText style={styles.prayerLabelSmall}>{t('home.time_remaining') || 'বাকি আছে'}</ThemedText>
              <ThemedText style={[styles.countdownSmall, { color: theme.secondary, flex: 1, textAlign: 'right' }]}>
                {`${String(nextPrayerInfo.timeRemaining.hours).padStart(2, '0')}:${String(nextPrayerInfo.timeRemaining.minutes).padStart(2, '0')}:${String(nextPrayerInfo.timeRemaining.seconds).padStart(2, '0')}`}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Quran Verse of the Day */}
        <View style={[styles.verseSection, { backgroundColor: theme.backgroundDefault, borderTopColor: theme.primary }]}>
          <View style={styles.verseHeader}>
            <ThemedText style={styles.verseTitle}>{t('home.verse_of_day') || 'আজকের আয়াত'}</ThemedText>
            <ThemedText style={styles.verseMeta}>{verse.surah}, {verse.ayah}</ThemedText>
          </View>
          <View style={[styles.verseBg, { backgroundColor: theme.backgroundSecondary }]}>
            <ThemedText style={[styles.verseArabic, { color: theme.primary }]}>{verse.arabic}</ThemedText>
          </View>
          <ThemedText style={styles.verseTranslation}>"{verse.bengali}"</ThemedText>
          <View style={styles.verseActions}>
            <Pressable style={[styles.verseBtn, { backgroundColor: theme.primary }]}>
              <MaterialIcons name="play-arrow" size={14} color={theme.buttonText} />
              <ThemedText style={[styles.verseBtnText, { color: theme.buttonText }]}>{t('home.listen') || 'শুনুন'}</ThemedText>
            </Pressable>
            <Pressable style={[styles.verseBtnSecondary, { backgroundColor: theme.backgroundSecondary }]}>
              <MaterialIcons name="share" size={14} color={theme.primary} />
              <ThemedText style={[styles.verseBtnTextSecondary, { color: theme.primary }]}>{t('home.share') || 'শেয়ার'}</ThemedText>
            </Pressable>
            <Pressable style={[styles.verseBtnSecondary, { backgroundColor: theme.backgroundSecondary }]}>
              <MaterialIcons name="bookmark" size={14} color={theme.primary} />
              <ThemedText style={[styles.verseBtnTextSecondary, { color: theme.primary }]}>{t('home.save') || 'সেভ'}</ThemedText>
            </Pressable>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionTitleRow}>
          <ThemedText style={styles.sectionTitle}>{t('home.quick_access') || 'দ্রুত এক্সেস'}</ThemedText>
          <Pressable>
            <ThemedText style={[styles.seeAll, { color: theme.primary }]}>{t('home.see_all') || 'সব দেখুন'}</ThemedText>
          </Pressable>
        </View>
        <View style={styles.quickActionsGrid}>
          {QUICK_ACTIONS.map((item, idx) => (
            <Pressable key={idx} style={[styles.actionCard, { backgroundColor: theme.backgroundDefault }]}>
              <View style={[styles.actionIcon]}>
                <Image 
                  source={MENU_ICONS[item.iconKey as keyof typeof MENU_ICONS]}
                  style={styles.actionIconImage}
                />
              </View>
              <ThemedText style={styles.actionLabel}>{item.label}</ThemedText>
            </Pressable>
          ))}
        </View>

        {/* Prayer Times */}
        <View style={styles.sectionTitleRow}>
          <ThemedText style={styles.sectionTitle}>{t('home.prayer_schedule') || 'আজকের নামাজের সময়সূচী'}</ThemedText>
          <Pressable>
            <ThemedText style={[styles.seeAll, { color: theme.primary }]}>{t('home.full_schedule') || 'সম্পূর্ণ সময়সূচী'}</ThemedText>
          </Pressable>
        </View>
        <View style={[styles.prayerTimesCard, { backgroundColor: theme.backgroundDefault }]}>
          <View style={styles.prayerGrid}>
            {prayers.map((prayer) => (
              <View key={prayer.key} style={styles.prayerTimeItem}>
                <ThemedText style={styles.prayerName}>{prayer.name}</ThemedText>
                <ThemedText style={[styles.prayerTime, { color: theme.primary }]}>{prayer.time}</ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* Tracker Section */}
        <View style={styles.sectionTitleRow}>
          <ThemedText style={styles.sectionTitle}>{t('home.worship_tracker') || 'আপনার ইবাদত ট্র্যাকার'}</ThemedText>
          <Pressable>
            <ThemedText style={[styles.seeAll, { color: theme.primary }]}>{t('home.view_details') || 'বিস্তারিত'}</ThemedText>
          </Pressable>
        </View>
        <View style={styles.trackerGrid}>
          {TRACKER_DATA.map((tracker, idx) => (
            <View key={idx} style={[styles.trackerCard, { backgroundColor: theme.backgroundDefault }]}>
              <View style={styles.trackerHeader}>
                <ThemedText style={styles.trackerTitle}>{tracker.title}</ThemedText>
                <View style={[styles.trackerIconBg]}>
                  <Image 
                    source={MENU_ICONS[tracker.iconKey as keyof typeof MENU_ICONS]}
                    style={styles.trackerIconImage}
                  />
                </View>
              </View>
              <View style={styles.trackerStats}>
                <View style={styles.stat}>
                  <ThemedText style={[styles.statValue, { color: theme.primary }]}>{tracker.stat1}</ThemedText>
                  <ThemedText style={styles.statLabel}>{tracker.label1}</ThemedText>
                </View>
                <View style={styles.stat}>
                  <ThemedText style={[styles.statValue, { color: theme.primary }]}>{tracker.stat2}</ThemedText>
                  <ThemedText style={styles.statLabel}>{tracker.label2}</ThemedText>
                </View>
              </View>
              <View style={[styles.progressBar, { backgroundColor: theme.backgroundSecondary }]}>
                <View style={[styles.progress, { width: `${tracker.progress}%`, backgroundColor: theme.primary }]} />
              </View>
            </View>
          ))}
        </View>

        {/* Features Grid */}
        <View style={styles.sectionTitleRow}>
          <ThemedText style={styles.sectionTitle}>{t('home.features_title') || 'বিশেষ ফিচারসমূহ'}</ThemedText>
          <Pressable>
            <ThemedText style={[styles.seeAll, { color: theme.primary }]}>{t('home.see_all') || 'সব দেখুন'}</ThemedText>
          </Pressable>
        </View>
        <View style={styles.featuresGrid}>
          {FEATURES.map((feature, idx) => (
            <View key={idx} style={[styles.featureCard, { backgroundColor: theme.backgroundDefault, borderTopColor: theme.primary }]}>
              <Image 
                source={MENU_ICONS[feature.iconKey as keyof typeof MENU_ICONS]}
                style={styles.featureIconImage}
              />
              <ThemedText style={styles.featureTitle}>{feature.title}</ThemedText>
              <ThemedText style={styles.featureDesc}>{feature.desc}</ThemedText>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  locationCard: {
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  locationSubtitle: {
    fontSize: 12,
    color: '#ffffff',
    marginTop: 2,
  },
  changeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  changeBtnText: {
    fontSize: 11,
    fontWeight: '600',
  },
  datetimeGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  dateCard: {
    flex: 1,
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
    color: '#ffffff',
    marginBottom: 4,
  },
  dateDisplayLine: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 10,
  },
  nextPrayerName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
    color: '#ffffff',
  },
  countdownLabel: {
    fontSize: 10,
    color: '#ffffff',
    marginBottom: 2,
  },
  countdown: {
    fontSize: 16,
    fontWeight: '700',
  },
  prayerInfoLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    justifyContent: 'space-between',
  },
  prayerLabelSmall: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
  },
  prayerNameSmall: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
  },
  countdownSmall: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
  },
  verseSection: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderTopWidth: 4,
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
    color: '#ffffff',
  },
  verseMeta: {
    fontSize: 11,
    color: '#ffffff',
  },
  verseBg: {
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  verseArabic: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
  },
  verseTranslation: {
    fontSize: 13,
    textAlign: 'center',
    color: '#ffffff',
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
  },
  verseBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  verseBtnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
  },
  verseBtnTextSecondary: {
    fontSize: 12,
    fontWeight: '600',
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
    color: '#ffffff',
  },
  seeAll: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
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
    color: '#ffffff',
  },
  prayerTimesCard: {
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
    color: '#ffffff',
    marginBottom: 3,
  },
  prayerTime: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  trackerGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  trackerCard: {
    flex: 1,
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
    color: '#ffffff',
  },
  trackerIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackerIconImage: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
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
  },
  statLabel: {
    fontSize: 11,
    color: '#ffffff',
    marginTop: 2,
  },
  progressBar: {
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
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
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    borderTopWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  featureIconImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  actionIconImage: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 8,
    textAlign: 'center',
  },
  featureDesc: {
    fontSize: 11,
    color: '#ffffff',
    marginTop: 5,
    textAlign: 'center',
  },
  locationRefresh: {
    padding: 8,
  },
});
