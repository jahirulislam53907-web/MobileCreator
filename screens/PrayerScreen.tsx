import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, ScrollView, Dimensions } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/ThemedText';
import { TopNavigationBar } from '@/components/TopNavigationBar';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Spacing, BorderRadius } from '@/constants/theme';

interface PrayerStatus {
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
}

const PRAYERS = [
  { id: 'fajr', name: 'ফজর', time: '০৫:১৫ AM', icon: 'light-mode', color: '#FFB800' },
  { id: 'dhuhr', name: 'যোহর', time: '১২:৩০ PM', icon: 'wb-sunny', color: '#FF6B35' },
  { id: 'asr', name: 'আসর', time: '০৪:৪৫ PM', icon: 'cloud', color: '#FF8C42' },
  { id: 'maghrib', name: 'মাগরিব', time: '০৬:৩০ PM', icon: 'wb-twilight', color: '#FFA500' },
  { id: 'isha', name: 'এশা', time: '০৮:০০ PM', icon: 'nights-stay', color: '#1E90FF' },
];

export default function PrayerScreen() {
  const { theme } = useAppTheme();
  const [prayerStatus, setPrayerStatus] = useState<PrayerStatus>({
    fajr: true,
    dhuhr: true,
    asr: false,
    maghrib: false,
    isha: false,
  });
  const [streak, setStreak] = useState(27);

  useEffect(() => {
    loadPrayerStatus();
  }, []);

  const loadPrayerStatus = async () => {
    try {
      const saved = await AsyncStorage.getItem('prayerStatus');
      if (saved) setPrayerStatus(JSON.parse(saved));
    } catch (error) {
      console.log('Error loading prayer status:', error);
    }
  };

  const togglePrayer = async (prayer: string) => {
    const updated = { ...prayerStatus, [prayer]: !prayerStatus[prayer as keyof PrayerStatus] };
    setPrayerStatus(updated);
    await AsyncStorage.setItem('prayerStatus', JSON.stringify(updated));
  };

  const todayPrayers = Object.values(prayerStatus).filter(Boolean).length;
  const completionPercentage = (todayPrayers / 5) * 100;
  const weeklyTotal = 32;

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <TopNavigationBar activeTab="Prayer" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        
        {/* Premium Header */}
        <View style={[styles.headerCard, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText style={styles.headerTitle}>প্রার্থনা</ThemedText>
          <ThemedText style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            আপনার আধ্যাত্মিক যাত্রা
          </ThemedText>
        </View>

        {/* Daily Progress Card */}
        <View style={[styles.progressCard, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText style={styles.progressLabel}>আজকের অগ্রগতি</ThemedText>
          <View style={styles.threeCirclesRow}>
            {/* Today Circle */}
            <View style={styles.circleWrapper}>
              <View style={styles.circularProgressContainer}>
                <View style={[styles.circularProgress, { borderColor: theme.primary }]}>
                  <View style={[styles.circularProgressFill, { 
                    borderTopColor: theme.primary,
                    borderRightColor: theme.primary,
                    transform: [{ rotate: `${(completionPercentage / 100) * 360}deg` }]
                  }]} />
                </View>
                <View style={styles.circularProgressInner}>
                  <ThemedText style={[styles.circularProgressText, { color: theme.primary }]}>
                    {Math.round(completionPercentage)}%
                  </ThemedText>
                </View>
              </View>
              <ThemedText style={[styles.circleLabel, { color: theme.textSecondary }]}>আজ</ThemedText>
            </View>

            {/* Weekly Circle */}
            <View style={styles.circleWrapper}>
              <View style={styles.circularProgressContainer}>
                <View style={[styles.circularProgress, { borderColor: theme.secondary }]}>
                  <View style={[styles.circularProgressFill, { 
                    borderTopColor: theme.secondary,
                    borderRightColor: theme.secondary,
                    transform: [{ rotate: '329deg' }]
                  }]} />
                </View>
                <View style={styles.circularProgressInner}>
                  <ThemedText style={[styles.circularProgressText, { color: theme.secondary }]}>
                    91%
                  </ThemedText>
                </View>
              </View>
              <ThemedText style={[styles.circleLabel, { color: theme.textSecondary }]}>সপ্তাহ</ThemedText>
            </View>

            {/* Monthly Circle */}
            <View style={styles.circleWrapper}>
              <View style={styles.circularProgressContainer}>
                <View style={[styles.circularProgress, { borderColor: theme.accent }]}>
                  <View style={[styles.circularProgressFill, { 
                    borderTopColor: theme.accent,
                    borderRightColor: theme.accent,
                    transform: [{ rotate: '336deg' }]
                  }]} />
                </View>
                <View style={styles.circularProgressInner}>
                  <ThemedText style={[styles.circularProgressText, { color: theme.accent }]}>
                    93%
                  </ThemedText>
                </View>
              </View>
              <ThemedText style={[styles.circleLabel, { color: theme.textSecondary }]}>মাস</ThemedText>
            </View>
          </View>
        </View>

        {/* Prayer Times Grid */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>আজকের নামাজের সময়</ThemedText>
          <View style={styles.prayerGrid}>
            {PRAYERS.map((prayer) => (
              <Pressable
                key={prayer.id}
                onPress={() => togglePrayer(prayer.id)}
                style={[
                  styles.prayerCard,
                  {
                    backgroundColor: theme.backgroundDefault,
                    borderLeftColor: prayerStatus[prayer.id as keyof PrayerStatus]
                      ? theme.primary
                      : theme.backgroundSecondary,
                  },
                ]}
              >
                <View style={styles.prayerCardTop}>
                  <View
                    style={[
                      styles.prayerIconBox,
                      {
                        backgroundColor: prayerStatus[prayer.id as keyof PrayerStatus]
                          ? theme.primary + '20'
                          : theme.backgroundSecondary,
                      },
                    ]}
                  >
                    <MaterialIcons
                      name={prayer.icon as any}
                      size={24}
                      color={prayerStatus[prayer.id as keyof PrayerStatus] ? theme.primary : theme.textSecondary}
                    />
                  </View>
                  <View style={styles.prayerInfo}>
                    <ThemedText style={styles.prayerName}>{prayer.name}</ThemedText>
                    <ThemedText style={[styles.prayerTime, { color: theme.textSecondary }]}>
                      {prayer.time}
                    </ThemedText>
                  </View>
                </View>
                
                <View
                  style={[
                    styles.prayerCheckbox,
                    {
                      borderColor: prayerStatus[prayer.id as keyof PrayerStatus]
                        ? theme.primary
                        : theme.backgroundSecondary,
                      backgroundColor: prayerStatus[prayer.id as keyof PrayerStatus]
                        ? theme.primary
                        : 'transparent',
                    },
                  ]}
                >
                  {prayerStatus[prayer.id as keyof PrayerStatus] && (
                    <MaterialIcons name="check" size={14} color={theme.buttonText} />
                  )}
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Statistics Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>পরিসংখ্যান</ThemedText>
          <View style={[styles.statsCard, { backgroundColor: theme.backgroundDefault }]}>
            <View style={styles.statItem}>
              <View style={[styles.statIconBox, { backgroundColor: theme.primary + '20' }]}>
                <MaterialIcons name="today" size={24} color={theme.primary} />
              </View>
              <View style={{ marginLeft: Spacing.md }}>
                <ThemedText style={[styles.statValue, { color: theme.primary }]}>
                  {todayPrayers}/৫
                </ThemedText>
                <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>আজ</ThemedText>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.backgroundSecondary }]} />

            <View style={styles.statItem}>
              <View style={[styles.statIconBox, { backgroundColor: theme.secondary + '20' }]}>
                <MaterialIcons name="date-range" size={24} color={theme.secondary} />
              </View>
              <View style={{ marginLeft: Spacing.md }}>
                <ThemedText style={[styles.statValue, { color: theme.secondary }]}>
                  {weeklyTotal}/৩৫
                </ThemedText>
                <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>এই সপ্তাহ</ThemedText>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.backgroundSecondary }]} />

            <View style={styles.statItem}>
              <View style={[styles.statIconBox, { backgroundColor: theme.accent + '20' }]}>
                <MaterialIcons name="calendar-today" size={24} color={theme.accent} />
              </View>
              <View style={{ marginLeft: Spacing.md }}>
                <ThemedText style={[styles.statValue, { color: theme.accent }]}>
                  ১৪০/১৫০
                </ThemedText>
                <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>এই মাস</ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Streak Section */}
        <View style={styles.section}>
          <View
            style={[
              styles.streakCard,
              {
                backgroundColor: theme.backgroundDefault,
                borderTopColor: theme.primary,
                borderTopWidth: 3,
              },
            ]}
          >
            <View style={styles.streakContent}>
              <View style={[styles.streakIconBox, { backgroundColor: theme.primary + '20' }]}>
                <MaterialIcons name="local-fire-department" size={40} color={theme.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: Spacing.md }}>
                <ThemedText style={[styles.streakLabel, { color: theme.textSecondary }]}>
                  বর্তমান স্ট্রিক
                </ThemedText>
                <ThemedText style={[styles.streakValue, { color: theme.primary }]}>
                  {streak} দিন
                </ThemedText>
                <ThemedText style={[styles.streakMotivation, { color: theme.textSecondary }]}>
                  অসাধারণ! এই গতি বজায় রাখুন 🙏
                </ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Prayer Guidelines */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>নামাজের নিয়ম</ThemedText>
          <View style={[styles.guideCard, { backgroundColor: theme.backgroundDefault }]}>
            {[
              {
                num: '১',
                title: 'ওযু করুন',
                desc: 'শরীরের প্রয়োজনীয় অংশ পবিত্র করুন',
                color: theme.primary,
              },
              {
                num: '२',
                title: 'কিবলার দিকে মুখ করুন',
                desc: 'আল্লাহর গৃহ কাবার দিকে দাঁড়ান',
                color: theme.secondary,
              },
              {
                num: '३',
                title: 'নিয়ত করুন',
                desc: 'হৃদয় দিয়ে নামাজের নিয়ত নিন',
                color: theme.accent,
              },
            ].map((step, idx) => (
              <View key={idx} style={styles.guideItem}>
                <View
                  style={[
                    styles.guideNumber,
                    { backgroundColor: step.color + '20', borderColor: step.color, borderWidth: 1.5 },
                  ]}
                >
                  <ThemedText style={[styles.guideNumberText, { color: step.color }]}>
                    {step.num}
                  </ThemedText>
                </View>
                <View style={{ flex: 1, marginLeft: Spacing.md }}>
                  <ThemedText style={styles.guideTitle}>{step.title}</ThemedText>
                  <ThemedText style={[styles.guideDesc, { color: theme.textSecondary }]}>
                    {step.desc}
                  </ThemedText>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>দ্রুত শর্টকাট</ThemedText>
          <View style={styles.quickActionGrid}>
            <Pressable style={[styles.quickActionCard, { backgroundColor: theme.backgroundDefault }]}>
              <View style={[styles.quickActionIcon, { backgroundColor: theme.primary + '20' }]}>
                <MaterialIcons name="explore" size={28} color={theme.primary} />
              </View>
              <ThemedText style={styles.quickActionLabel}>কিবলা</ThemedText>
            </Pressable>

            <Pressable style={[styles.quickActionCard, { backgroundColor: theme.backgroundDefault }]}>
              <View style={[styles.quickActionIcon, { backgroundColor: theme.secondary + '20' }]}>
                <Feather name="map-pin" size={28} color={theme.secondary} />
              </View>
              <ThemedText style={styles.quickActionLabel}>মসজিদ</ThemedText>
            </Pressable>

            <Pressable style={[styles.quickActionCard, { backgroundColor: theme.backgroundDefault }]}>
              <View style={[styles.quickActionIcon, { backgroundColor: theme.accent + '20' }]}>
                <MaterialIcons name="school" size={28} color={theme.accent} />
              </View>
              <ThemedText style={styles.quickActionLabel}>শিক্ষা</ThemedText>
            </Pressable>

            <Pressable style={[styles.quickActionCard, { backgroundColor: theme.backgroundDefault }]}>
              <View style={[styles.quickActionIcon, { backgroundColor: theme.primary + '20' }]}>
                <MaterialIcons name="notifications-active" size={28} color={theme.primary} />
              </View>
              <ThemedText style={styles.quickActionLabel}>নোটিফিকেশন</ThemedText>
            </Pressable>
          </View>
        </View>

        {/* Inspirational Quote */}
        <View
          style={[
            styles.quoteCard,
            {
              backgroundColor: theme.primary + '15',
              borderLeftColor: theme.primary,
              borderLeftWidth: 4,
            },
          ]}
        >
          <Feather name="quote" size={24} color={theme.primary} style={{ marginBottom: Spacing.sm }} />
          <ThemedText style={[styles.quoteText, { color: theme.text }]}>
            "নামাজ হল ঈমান এবং কাফরের মধ্যে পার্থক্য।"
          </ThemedText>
          <ThemedText style={[styles.quoteAuthor, { color: theme.textSecondary }]}>
            - সহীহ মুসলিম
          </ThemedText>
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  headerCard: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: Spacing.xs,
  },
  progressCard: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    opacity: 0.8,
    marginBottom: Spacing.xs,
  },
  progressPercentage: {
    fontSize: 32,
    fontWeight: '800',
  },
  progressCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBarContainer: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  threeCirclesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  circleWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  circularProgressContainer: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  circularProgress: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    borderColor: '#transparent',
  },
  circularProgressFill: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  circularProgressInner: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularProgressText: {
    fontSize: 18,
    fontWeight: '800',
  },
  circleLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressStats: {
    fontSize: 18,
    fontWeight: '700',
  },
  progressStatsDesc: {
    fontSize: 13,
    marginTop: Spacing.xs,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: Spacing.md,
  },
  prayerGrid: {
    gap: Spacing.md,
  },
  prayerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 4,
  },
  prayerCardTop: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  prayerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  prayerInfo: {
    flex: 1,
  },
  prayerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  prayerTime: {
    fontSize: 12,
  },
  prayerCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsCard: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 40,
  },
  streakCard: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakIconBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  streakValue: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 4,
  },
  streakMotivation: {
    fontSize: 12,
    marginTop: 4,
  },
  guideCard: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.lg,
  },
  guideItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  guideNumber: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  guideNumberText: {
    fontSize: 18,
    fontWeight: '700',
  },
  guideTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  guideDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  quickActionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
    flexWrap: 'wrap',
  },
  quickActionCard: {
    width: '48%',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  quickActionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  quoteCard: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  quoteText: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  quoteAuthor: {
    fontSize: 12,
    fontWeight: '500',
  },
});
