import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Pressable, ScrollView, Alert, Image, Text, FlatList, NativeSyntheticEvent, NativeScrollEvent, Dimensions, Animated, LayoutChangeEvent, Modal, TextInput, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedText } from "@/components/ThemedText";
import { TopNavigationBar } from "@/components/TopNavigationBar";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useTranslation } from "../src/contexts/LanguageContext";
import { useLocation } from "@/src/hooks/useLocation";
import { Spacing, BorderRadius } from "@/constants/theme";
import { calculatePrayerTimes, getNextPrayer, getNextSunriseOrSunset, DHAKA_COORDINATES, saveCustomPrayerTimes, type PrayerTimesData, type NextPrayerInfo, type SunriseSunsetInfo } from "@/utils/prayerTimes";
import { formatDate } from "@/utils/dateUtils";
import { MENU_ICONS } from "@/constants/menuIcons";
import { getQuranVerses, type QuranVerse } from "@/utils/quranData";
import { scheduleAzanNotifications, getScheduledNotifications } from "@/utils/notificationService";

export default function HomeScreen() {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const { location, requestLocationPermission, loading: locationLoading } = useLocation();
  
  // Initialize with default location data
  const defaultLat = DHAKA_COORDINATES.latitude;
  const defaultLon = DHAKA_COORDINATES.longitude;
  
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [nextPrayerInfo, setNextPrayerInfo] = useState<NextPrayerInfo>(() => getNextPrayer(defaultLat, defaultLon));
  const [sunriseSunset, setSunriseSunset] = useState<SunriseSunsetInfo>(() => getNextSunriseOrSunset(defaultLat, defaultLon));
  const [formattedDate, setFormattedDate] = useState(formatDate());
  const [selectedPrayerToEdit, setSelectedPrayerToEdit] = useState<string | null>(null);
  const [selectedAzanToEdit, setSelectedAzanToEdit] = useState<string | null>(null);
  const [editHours, setEditHours] = useState('00');
  const [editMinutes, setEditMinutes] = useState('00');
  const [editPeriod, setEditPeriod] = useState('AM');
  const [azanTimes, setAzanTimes] = useState<PrayerTimesData | null>(null);
  const [enabledPrayers, setEnabledPrayers] = useState({
    fajr: true,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true,
  });

  const handleTimeInput = (value: string, type: 'hours' | 'minutes') => {
    const numericOnly = value.replace(/[^0-9]/g, '');
    
    if (type === 'hours') {
      if (numericOnly === '') {
        setEditHours('');
      } else {
        const numValue = parseInt(numericOnly, 10);
        if (numValue <= 23) {
          setEditHours(numericOnly);
        } else {
          setEditHours('23');
        }
      }
    } else {
      if (numericOnly === '') {
        setEditMinutes('');
      } else {
        const numValue = parseInt(numericOnly, 10);
        if (numValue <= 59) {
          setEditMinutes(numericOnly);
        } else {
          setEditMinutes('59');
        }
      }
    }
  };
  
  const [quranVerses, setQuranVerses] = useState<QuranVerse[]>(getQuranVerses());
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const verseHeights = useRef<{ [key: number]: number }>({}).current;
  const flatListRef = useRef<FlatList>(null);
  const screenWidth = Dimensions.get('window').width;
  const dotsPositionAnim = useRef(new Animated.Value(0)).current;
  const [quickActionsFullHeight, setQuickActionsFullHeight] = useState(250);
  const quickActionsHeightAnim = useRef(new Animated.Value(250)).current;
  const [isQuickActionsExpanded, setIsQuickActionsExpanded] = useState(false);
  
  // Initialize Quran data in AsyncStorage
  useEffect(() => {
    const initQuranData = async () => {
      try {
        const savedQuran = await AsyncStorage.getItem('quranData');
        if (!savedQuran) {
          await AsyncStorage.setItem('quranData', JSON.stringify(quranVerses));
        }
      } catch (error) {
        console.log('Error saving Quran data:', error);
      }
    };
    initQuranData();
  }, []);

  // Auto-scroll carousel every 5 seconds
  useEffect(() => {
    if (quranVerses.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentVerseIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % quranVerses.length;
        
        // Item width accounts for screen width minus horizontal padding
        // No margin between items - spacing handled by padding
        const itemWidth = screenWidth - 30;
        const targetOffsetX = nextIndex * itemWidth;
        
        if (flatListRef.current) {
          flatListRef.current.scrollToOffset({ 
            offset: targetOffsetX, 
            animated: true 
          });
        }
        
        return nextIndex;
      });
    }, 10000);
    
    return () => clearInterval(interval);
  }, [quranVerses.length, screenWidth]);
  
  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const itemWidth = screenWidth - 30;
    const currentIndex = Math.round(contentOffsetX / itemWidth);
    setCurrentVerseIndex(currentIndex);
    
    // Snap to perfectly centered position
    const targetOffsetX = currentIndex * itemWidth;
    
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ 
        offset: targetOffsetX, 
        animated: true 
      });
    }
  };

  const handleVerseLayout = (event: LayoutChangeEvent, index: number) => {
    const height = event.nativeEvent.layout.height;
    verseHeights[index] = height;
  };

  const handleQuickActionsLayout = (event: LayoutChangeEvent) => {
    const height = event.nativeEvent.layout.height;
    setQuickActionsFullHeight(height);
    quickActionsHeightAnim.setValue(height);
  };

  const toggleQuickActionsExpand = () => {
    setIsQuickActionsExpanded(!isQuickActionsExpanded);
  };
  
  const renderVerseItem = ({ item, index }: { item: QuranVerse; index: number }) => (
    <View style={[styles.verseCarouselItem, { width: screenWidth - 30 }]}>
      <View 
        onLayout={(event) => handleVerseLayout(event, index)}
        style={[styles.verseSection, { backgroundColor: theme.backgroundDefault, borderTopColor: theme.primary }]}
      >
        <View style={styles.verseHeader}>
          <ThemedText style={styles.verseTitle}>{item.surah}</ThemedText>
          <ThemedText style={styles.verseMeta}>আয়াত: {item.ayah}</ThemedText>
        </View>
        <View style={[styles.verseBg, { backgroundColor: theme.backgroundSecondary }]}>
          <ThemedText style={[styles.verseArabic, { color: '#ffffff' }]}>{item.arabic}</ThemedText>
        </View>
        <ThemedText style={styles.verseTranslation}>"{item.bengali}"</ThemedText>
        <View style={styles.verseActions}>
          <Pressable style={[styles.verseBtn, { backgroundColor: theme.primary }]}>
            <MaterialIcons name="play-arrow" size={14} color={theme.buttonText} />
            <ThemedText style={[styles.verseBtnText, { color: theme.buttonText }]}>শুনুন</ThemedText>
          </Pressable>
          <Pressable style={[styles.verseBtnSecondary, { backgroundColor: theme.backgroundSecondary }]}>
            <MaterialIcons name="share" size={14} color={theme.primary} />
            <ThemedText style={[styles.verseBtnTextSecondary, { color: theme.primary }]}>শেয়ার</ThemedText>
          </Pressable>
          <Pressable style={[styles.verseBtnSecondary, { backgroundColor: theme.backgroundSecondary }]}>
            <MaterialIcons name="bookmark" size={14} color={theme.primary} />
            <ThemedText style={[styles.verseBtnTextSecondary, { color: theme.primary }]}>সেভ</ThemedText>
          </Pressable>
        </View>
      </View>
    </View>
  );

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
    const fetchPrayerTimes = async () => {
      try {
        const lat = location?.latitude || DHAKA_COORDINATES.latitude;
        const lon = location?.longitude || DHAKA_COORDINATES.longitude;
        const times = await calculatePrayerTimes(lat, lon);
        setPrayerTimes(times);
        const savedAzan = await AsyncStorage.getItem('customAzanTimes');
        if (savedAzan) {
          setAzanTimes(JSON.parse(savedAzan));
        } else {
          setAzanTimes(times);
        }
        const savedEnabled = await AsyncStorage.getItem('enabledPrayers');
        if (savedEnabled) {
          setEnabledPrayers(JSON.parse(savedEnabled));
        }
      } catch (error) {
        console.log('Error fetching prayer times:', error);
      }
    };
    fetchPrayerTimes();
    setFormattedDate(formatDate());
  }, [location]);

  useEffect(() => {
    const updateNextPrayer = () => {
      const lat = location?.latitude || DHAKA_COORDINATES.latitude;
      const lon = location?.longitude || DHAKA_COORDINATES.longitude;
      const next = getNextPrayer(lat, lon);
      setNextPrayerInfo(next);
      setSunriseSunset(getNextSunriseOrSunset(lat, lon));
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
        <View style={[styles.locationCard, { backgroundColor: theme.backgroundDefault }]}>
          <View style={styles.locationInfo}>
            <Pressable 
              onPress={handleLocationPress}
              disabled={locationLoading}
              style={styles.locationIconContainer}
            >
              <View style={[styles.locationIconBg, { backgroundColor: theme.primary + '20' }]}>
                <MaterialIcons name="location-on" size={18} color={theme.primary} />
              </View>
            </Pressable>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.locationTitle}>
                {location ? `${location.name}, ${location.country}` : 'লোকেশন যুক্ত করুন'}
              </ThemedText>
              <ThemedText style={styles.locationSubtitle}>
                {locationLoading ? 'লোকেশন প্রাপ্ত হচ্ছে...' : (location ? 'আপনার বর্তমান লোকেশন' : 'ক্লিক করে অনুমতি দিন')}
              </ThemedText>
            </View>
            <View style={styles.sunriseSunsetBox}>
              <Text style={[styles.sunriseSunsetText, { color: theme.secondary }]}>
                <Text style={styles.sunriseSunsetLabel}>{sunriseSunset.label} </Text>
                <Text style={[styles.sunriseSunsetTime, { color: theme.secondary }]}>
                  {sunriseSunset.timeString}
                </Text>
              </Text>
            </View>
          </View>
        </View>

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

        {/* Quran Carousel */}
        <View style={styles.carouselContainer}>
          <ThemedText style={styles.carouselTitle}>{t('home.verse_of_day') || 'কোরআন শরীফ'}</ThemedText>
          
          <FlatList
            ref={flatListRef}
            data={quranVerses}
            renderItem={renderVerseItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            pagingEnabled={true}
            scrollEventThrottle={16}
            onMomentumScrollEnd={handleScrollEnd}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
            decelerationRate="normal"
          />
          
          {/* Dots Indicator */}
          <Animated.View style={[styles.dotsContainer, { marginTop: dotsPositionAnim }]}>
            {quranVerses.slice(0, 7).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor: currentVerseIndex === index ? theme.secondary : theme.backgroundSecondary,
                  }
                ]}
              />
            ))}
          </Animated.View>
        </View>

        {/* Azan Section */}
        <View style={{ marginTop: Spacing.xl }}>
          <ThemedText style={styles.sectionTitle}>{t('home.azan') || 'আজান'}</ThemedText>
          <View style={[styles.prayerTimesCard, { backgroundColor: theme.backgroundDefault, marginTop: Spacing.md }]}>
            {/* Azan Times Grid */}
            <View style={styles.prayerGrid}>
              {azanTimes && prayers.map((prayer) => {
                const azanTime = String(azanTimes[prayer.key as keyof PrayerTimesData] || prayer.time);
                return (
                  <View key={prayer.key} style={styles.prayerTimeItem}>
                    <Pressable onPress={() => {
                      const parts = azanTime.split(' ');
                      const timeParts = parts[0].split(':');
                      setSelectedAzanToEdit(prayer.key);
                      setEditHours(timeParts[0]);
                      setEditMinutes(timeParts[1]);
                      setEditPeriod(parts[1] || 'AM');
                    }}>
                      <ThemedText style={styles.prayerName}>{prayer.name}</ThemedText>
                      <ThemedText style={[styles.prayerTime, { color: theme.primary }]}>{azanTime}</ThemedText>
                    </Pressable>
                    <Pressable 
                      onPress={async () => {
                        const updated = { ...enabledPrayers, [prayer.key]: !enabledPrayers[prayer.key as keyof typeof enabledPrayers] };
                        setEnabledPrayers(updated);
                        await AsyncStorage.setItem('enabledPrayers', JSON.stringify(updated));
                        
                        if (azanTimes) {
                          await scheduleAzanNotifications(azanTimes as Record<string, string>, updated);
                          setTimeout(() => {
                            getScheduledNotifications();
                          }, 500);
                        }
                      }}
                      style={[styles.prayerToggle, { backgroundColor: enabledPrayers[prayer.key as keyof typeof enabledPrayers] ? theme.primary : theme.backgroundSecondary }]}
                    >
                      <ThemedText style={styles.prayerToggleText}>{enabledPrayers[prayer.key as keyof typeof enabledPrayers] ? 'ON' : 'OFF'}</ThemedText>
                    </Pressable>
                  </View>
                );
              })}
            </View>
            <View style={styles.prayerInfoBox}>
              <ThemedText style={styles.prayerInfoText}>প্রতিটি নামাজের আজান শোনার সময় এখানে প্রদর্শিত হয়। আপনার এলাকার মসজিদের আজান সময়সূচী অনুযায়ী কাস্টমাইজ করুন।</ThemedText>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <Animated.View style={{ height: quickActionsHeightAnim, overflow: 'hidden' }}>
          <View onLayout={handleQuickActionsLayout}>
            <View style={styles.sectionTitleRow}>
              <ThemedText style={styles.sectionTitle}>{t('home.quick_access') || 'দ্রুত এক্সেস'}</ThemedText>
              <Pressable onPress={toggleQuickActionsExpand}>
                <ThemedText style={[styles.seeAll, { color: theme.primary }]}>
                  {isQuickActionsExpanded ? (t('home.see_less') || 'কম দেখুন') : (t('home.see_all') || 'সব দেখুন')}
                </ThemedText>
              </Pressable>
            </View>
            <View style={styles.quickActionsGrid}>
              {(isQuickActionsExpanded ? QUICK_ACTIONS : QUICK_ACTIONS.slice(0, 8)).map((item, idx) => (
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
          </View>
        </Animated.View>

        {/* Prayer Times */}
        <View style={{ marginTop: Spacing.xl }}>
          <ThemedText style={styles.sectionTitle}>{t('home.prayer_schedule') || 'আজকের নামাজের সময়সূচী'}</ThemedText>
          <View style={[styles.prayerTimesCard, { backgroundColor: theme.backgroundDefault, marginTop: Spacing.md }]}>
            {/* Prayer Times Grid - Location and date used in background for accurate calculation */}
            <View style={styles.prayerGrid}>
              {prayers.map((prayer) => (
                <Pressable key={prayer.key} onPress={() => {
                  const parts = prayer.time.split(' ');
                  const timeParts = parts[0].split(':');
                  setSelectedPrayerToEdit(prayer.key);
                  setEditHours(timeParts[0]);
                  setEditMinutes(timeParts[1]);
                  setEditPeriod(parts[1] || 'AM');
                }} style={styles.prayerTimeItem}>
                  <ThemedText style={styles.prayerName}>{prayer.name}</ThemedText>
                  <ThemedText style={[styles.prayerTime, { color: theme.primary }]}>{prayer.time}</ThemedText>
                </Pressable>
              ))}
            </View>
            <View style={styles.prayerInfoBox}>
              <ThemedText style={styles.prayerInfoText}>আপনার পছন্দের মসজিদ বা ব্যক্তিগত সময়সূচী অনুযায়ী নামাজের সময় কাস্টমাইজ করার সুবিধা সংযুক্ত রয়েছে।</ThemedText>
            </View>
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
      
      <Modal
        visible={selectedPrayerToEdit !== null || selectedAzanToEdit !== null}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          setSelectedPrayerToEdit(null);
          setSelectedAzanToEdit(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.backgroundDefault, borderTopColor: theme.primary }]}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>
                {(selectedPrayerToEdit === 'fajr' || selectedAzanToEdit === 'fajr') && 'ফজর'}
                {(selectedPrayerToEdit === 'dhuhr' || selectedAzanToEdit === 'dhuhr') && 'যোহর'}
                {(selectedPrayerToEdit === 'asr' || selectedAzanToEdit === 'asr') && 'আসর'}
                {(selectedPrayerToEdit === 'maghrib' || selectedAzanToEdit === 'maghrib') && 'মাগরিব'}
                {(selectedPrayerToEdit === 'isha' || selectedAzanToEdit === 'isha') && 'এশা'}
              </ThemedText>
            </View>
            
            <View style={styles.timeInputContainer}>
              <View style={styles.timeInputGroup}>
                <TextInput
                  style={[styles.timeInputField, { color: theme.text, borderColor: theme.primary }]}
                  value={editHours}
                  onChangeText={(val) => handleTimeInput(val, 'hours')}
                  keyboardType="numeric"
                  maxLength={2}
                  placeholder="00"
                  placeholderTextColor={theme.textSecondary}
                />
                <ThemedText style={styles.timeColon}>:</ThemedText>
                <TextInput
                  style={[styles.timeInputField, { color: theme.text, borderColor: theme.primary }]}
                  value={editMinutes}
                  onChangeText={(val) => handleTimeInput(val, 'minutes')}
                  keyboardType="numeric"
                  maxLength={2}
                  placeholder="00"
                  placeholderTextColor={theme.textSecondary}
                />
                <Pressable
                  style={styles.periodToggle}
                  onPress={() => setEditPeriod(editPeriod === 'AM' ? 'PM' : 'AM')}
                >
                  <ThemedText style={styles.periodText}>{editPeriod}</ThemedText>
                </Pressable>
              </View>
            </View>
            
            <View style={styles.modalButtonGroup}>
              <Pressable
                style={[styles.modalButton, { backgroundColor: theme.backgroundSecondary }]}
                onPress={() => {
                  setSelectedPrayerToEdit(null);
                  setSelectedAzanToEdit(null);
                }}
              >
                <ThemedText style={[styles.modalButtonText, { color: theme.primary }]}>বাতিল</ThemedText>
              </Pressable>
              
              <Pressable
                style={[styles.modalButton, { backgroundColor: theme.primary }]}
                onPress={async () => {
                  const paddedHours = (editHours || '00').padStart(2, '0');
                  const paddedMinutes = (editMinutes || '00').padStart(2, '0');
                  const newTime = `${paddedHours}:${paddedMinutes} ${editPeriod}`;
                  
                  if (selectedPrayerToEdit && prayerTimes) {
                    const updated = { ...prayerTimes, [selectedPrayerToEdit]: newTime };
                    await saveCustomPrayerTimes(updated);
                    setPrayerTimes(updated);
                    setSelectedPrayerToEdit(null);
                  } else if (selectedAzanToEdit && azanTimes) {
                    const updated = { ...azanTimes, [selectedAzanToEdit]: newTime };
                    await AsyncStorage.setItem('customAzanTimes', JSON.stringify(updated));
                    setAzanTimes(updated);
                    
                    // Auto-reschedule notifications if this prayer is enabled
                    if (enabledPrayers[selectedAzanToEdit as PrayerName]) {
                      console.log(`🔄 Rescheduling ${selectedAzanToEdit} with new time: ${newTime}`);
                      await scheduleAzanNotifications(updated as Record<string, string>, enabledPrayers);
                      setTimeout(() => {
                        getScheduledNotifications();
                      }, 500);
                    }
                    
                    setSelectedAzanToEdit(null);
                  }
                }}
              >
                <ThemedText style={[styles.modalButtonText, { color: '#fff' }]}>সংরক্ষণ করুন</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  locationIconContainer: {
    padding: 0,
  },
  locationIconBg: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sunriseSunsetBox: {
    paddingHorizontal: 10,
  },
  sunriseSunsetText: {
    fontSize: 20,
    fontWeight: '600',
  },
  sunriseSunsetLabel: {
    fontSize: 20,
    fontWeight: '600',
  },
  sunriseSunsetTime: {
    fontSize: 20,
    fontWeight: '700',
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
    flexDirection: 'column',
  },
  verseScrollContainer: {
    marginBottom: 12,
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
  carouselContainer: {
    marginBottom: 12,
  },
  carouselTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
    paddingHorizontal: 15,
  },
  carouselContent: {
    paddingHorizontal: 0,
  },
  verseCarouselItem: {
    paddingHorizontal: 15,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingHorizontal: 15,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
    justifyContent: 'center',
    paddingVertical: 8,
  },
  prayerName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 3,
    textAlign: 'center',
  },
  prayerTime: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  prayerHeaderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  prayerLocationLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
    opacity: 0.7,
    marginBottom: 3,
  },
  prayerLocation: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  prayerDateLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
    opacity: 0.7,
    marginBottom: 3,
  },
  prayerDate: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  divider: {
    height: 1,
    opacity: 0.3,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    minWidth: '80%',
    maxWidth: '90%',
    borderTopWidth: 4,
  },
  modalHeader: {
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    color: '#ffffff',
  },
  timeInputContainer: {
    marginBottom: Spacing.lg,
  },
  timeInputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  timeInputField: {
    width: 50,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  timeColon: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  periodToggle: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    minWidth: 60,
    alignItems: 'center',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  modalButtonGroup: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  modalButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  prayerInfoBox: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: BorderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: 'rgba(255, 255, 255, 0.3)',
  },
  prayerInfoText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
    lineHeight: 18,
    opacity: 0.85,
  },
  prayerToggle: {
    width: 45,
    height: 20,
    borderRadius: 10,
    marginTop: Spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  prayerToggleKnob: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  prayerToggleText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
  },
});
