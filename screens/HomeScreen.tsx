import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, Typography, BorderRadius } from "@/constants/theme";
import { 
  calculatePrayerTimes, 
  getNextPrayer, 
  DHAKA_COORDINATES,
  type PrayerTimesData,
  type NextPrayerInfo
} from "@/utils/prayerTimes";

const QUICK_ACTIONS = [
  { icon: "compass", label: "ক্বিবলা", color: "#2D6A4F" },
  { icon: "book-open", label: "কুরআন", color: "#D4A574" },
  { icon: "heart", label: "দুয়া", color: "#40916C" },
  { icon: "calendar", label: "ক্যালেন্ডার", color: "#F4A261" },
  { icon: "dollar-sign", label: "যাকাত", color: "#2D6A4F" },
  { icon: "moon", label: "রমজান", color: "#B8860B" },
];

export default function HomeScreen() {
  const { theme } = useTheme();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [nextPrayerInfo, setNextPrayerInfo] = useState<NextPrayerInfo | null>(null);
  const [completedPrayers, setCompletedPrayers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const times = calculatePrayerTimes(
      DHAKA_COORDINATES.latitude,
      DHAKA_COORDINATES.longitude
    );
    setPrayerTimes(times);
  }, []);

  useEffect(() => {
    const updateNextPrayer = () => {
      const next = getNextPrayer(
        DHAKA_COORDINATES.latitude,
        DHAKA_COORDINATES.longitude
      );
      setNextPrayerInfo(next);
    };

    updateNextPrayer();
    const interval = setInterval(updateNextPrayer, 1000);
    return () => clearInterval(interval);
  }, []);

  const prayers = prayerTimes ? [
    { name: "ফজর", time: prayerTimes.fajr, key: "fajr" },
    { name: "যোহর", time: prayerTimes.dhuhr, key: "dhuhr" },
    { name: "আসর", time: prayerTimes.asr, key: "asr" },
    { name: "মাগরিব", time: prayerTimes.maghrib, key: "maghrib" },
    { name: "এশা", time: prayerTimes.isha, key: "isha" },
  ] : [];

  return (
    <ScreenScrollView>
      <View style={styles.locationContainer}>
        <Feather name="map-pin" size={16} color={theme.textSecondary} />
        <ThemedText style={[styles.location, { color: theme.textSecondary }]}>
          ঢাকা, বাংলাদেশ
        </ThemedText>
        <Feather name="edit-2" size={14} color={theme.primary} />
      </View>

      <Card style={styles.dateCard}>
        <View style={styles.dateRow}>
          <View>
            <ThemedText style={styles.dateLabel}>হিজরি তারিখ</ThemedText>
            <ThemedText style={styles.dateValue}>১৫ জমাদিউল আউয়াল ১৪৪৬</ThemedText>
          </View>
        </View>
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <View style={styles.dateRow}>
          <View>
            <ThemedText style={styles.dateLabel}>ইংরেজি তারিখ</ThemedText>
            <ThemedText style={styles.dateValue}>২৪ নভেম্বর ২০২৪</ThemedText>
          </View>
        </View>
      </Card>

      <Card style={[styles.countdownCard, { borderColor: theme.primary, borderWidth: 1 }]}>
        <ThemedText style={[styles.nextPrayerLabel, { color: theme.primary }]}>
          পরবর্তী নামাজ
        </ThemedText>
        <ThemedText style={[styles.prayerName, { color: theme.primary }]}>
          {nextPrayerInfo?.nameBn || "লোড হচ্ছে..."}
        </ThemedText>
        {nextPrayerInfo ? (
          <View style={styles.timerContainer}>
            <View style={styles.timeBlock}>
              <ThemedText style={styles.timeValue}>
                {String(nextPrayerInfo.timeRemaining.hours).padStart(2, "0")}
              </ThemedText>
              <ThemedText style={styles.timeUnit}>ঘন্টা</ThemedText>
            </View>
            <ThemedText style={styles.timeSeparator}>:</ThemedText>
            <View style={styles.timeBlock}>
              <ThemedText style={styles.timeValue}>
                {String(nextPrayerInfo.timeRemaining.minutes).padStart(2, "0")}
              </ThemedText>
              <ThemedText style={styles.timeUnit}>মিনিট</ThemedText>
            </View>
            <ThemedText style={styles.timeSeparator}>:</ThemedText>
            <View style={styles.timeBlock}>
              <ThemedText style={styles.timeValue}>
                {String(nextPrayerInfo.timeRemaining.seconds).padStart(2, "0")}
              </ThemedText>
              <ThemedText style={styles.timeUnit}>সেকেন্ড</ThemedText>
            </View>
          </View>
        ) : null}
      </Card>

      <Card style={styles.verseCard}>
        <View style={styles.verseHeader}>
          <Feather name="book-open" size={20} color={theme.secondary} />
          <ThemedText style={[styles.verseTitle, { color: theme.secondary }]}>
            আজকের আয়াত
          </ThemedText>
        </View>
        <ThemedText style={styles.arabicText}>
          إِنَّ مَعَ الْعُسْرِ يُسْرًا
        </ThemedText>
        <ThemedText style={styles.translationText}>
          "নিশ্চয়ই কষ্টের সাথে স্বস্তি রয়েছে।"
        </ThemedText>
        <ThemedText style={[styles.verseRef, { color: theme.textSecondary }]}>
          সূরা আশ-শারহ, আয়াত ৬
        </ThemedText>
      </Card>

      <ThemedText style={styles.sectionTitle}>নামাজের সময়সূচী</ThemedText>
      <Card style={styles.prayerTimesCard}>
        {prayers.map((prayer, index) => {
          const isCompleted = completedPrayers[prayer.key] || false;
          return (
            <View key={prayer.name}>
              <View style={styles.prayerRow}>
                <View style={styles.prayerLeft}>
                  <View
                    style={[
                      styles.prayerDot,
                      {
                        backgroundColor: isCompleted ? theme.success : theme.textSecondary,
                      },
                    ]}
                  />
                  <ThemedText
                    style={[
                      styles.prayerNameText,
                      isCompleted && { color: theme.success },
                    ]}
                  >
                    {prayer.name}
                  </ThemedText>
                </View>
                <ThemedText
                  style={[
                    styles.prayerTime,
                    isCompleted && { color: theme.success },
                  ]}
                >
                  {prayer.time}
                </ThemedText>
              </View>
              {index < prayers.length - 1 && (
                <View style={[styles.prayerDivider, { backgroundColor: theme.border }]} />
              )}
            </View>
          );
        })}
      </Card>

      <ThemedText style={styles.sectionTitle}>দ্রুত এক্সেস</ThemedText>
      <View style={styles.quickActionsGrid}>
        {QUICK_ACTIONS.map((action) => (
          <Pressable
            key={action.label}
            style={({ pressed }) => [
              styles.quickActionButton,
              { backgroundColor: theme.backgroundDefault },
              pressed && { opacity: 0.7 },
            ]}
          >
            <View
              style={[styles.quickActionIcon, { backgroundColor: action.color + "15" }]}
            >
              <Feather name={action.icon as any} size={24} color={action.color} />
            </View>
            <ThemedText style={styles.quickActionLabel}>{action.label}</ThemedText>
          </Pressable>
        ))}
      </View>

      <ThemedText style={styles.sectionTitle}>সাপ্তাহিক প্রগতি</ThemedText>
      <Card style={styles.progressCard}>
        <View style={styles.progressRow}>
          <ThemedText style={styles.progressLabel}>নামাজ সম্পন্ন</ThemedText>
          <ThemedText style={[styles.progressValue, { color: theme.success }]}>
            28/35
          </ThemedText>
        </View>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { backgroundColor: theme.success, width: "80%" },
            ]}
          />
        </View>
        <View style={[styles.progressDivider, { backgroundColor: theme.border }]} />
        <View style={styles.progressRow}>
          <ThemedText style={styles.progressLabel}>কুরআন তিলাওয়াত</ThemedText>
          <ThemedText style={[styles.progressValue, { color: theme.secondary }]}>
            ১২ পৃষ্ঠা
          </ThemedText>
        </View>
      </Card>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  location: {
    ...Typography.bodySmall,
    flex: 1,
  },
  dateCard: {
    marginBottom: Spacing.lg,
  },
  dateRow: {
    paddingVertical: Spacing.sm,
  },
  dateLabel: {
    ...Typography.caption,
    opacity: 0.7,
    marginBottom: Spacing.xs,
  },
  dateValue: {
    ...Typography.body,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    marginVertical: Spacing.sm,
  },
  countdownCard: {
    alignItems: "center",
    marginBottom: Spacing.lg,
    paddingVertical: Spacing["2xl"],
  },
  nextPrayerLabel: {
    ...Typography.bodySmall,
    marginBottom: Spacing.xs,
  },
  prayerName: {
    ...Typography.h1,
    marginBottom: Spacing.lg,
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  timeBlock: {
    alignItems: "center",
  },
  timeValue: {
    ...Typography.display,
    fontSize: 40,
    fontWeight: "700",
  },
  timeUnit: {
    ...Typography.caption,
    marginTop: Spacing.xs,
  },
  timeSeparator: {
    ...Typography.display,
    fontSize: 32,
    marginBottom: Spacing.lg,
  },
  verseCard: {
    marginBottom: Spacing.lg,
  },
  verseHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  verseTitle: {
    ...Typography.h3,
  },
  arabicText: {
    ...Typography.arabicLarge,
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  translationText: {
    ...Typography.body,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  verseRef: {
    ...Typography.caption,
    textAlign: "center",
  },
  sectionTitle: {
    ...Typography.h2,
    marginBottom: Spacing.md,
  },
  prayerTimesCard: {
    marginBottom: Spacing.lg,
  },
  prayerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.md,
  },
  prayerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  prayerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  prayerNameText: {
    ...Typography.body,
    fontWeight: "500",
  },
  prayerTime: {
    ...Typography.body,
    fontWeight: "600",
  },
  prayerDivider: {
    height: 1,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  quickActionButton: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  quickActionLabel: {
    ...Typography.bodySmall,
    textAlign: "center",
  },
  progressCard: {
    marginBottom: Spacing.lg,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  progressLabel: {
    ...Typography.body,
  },
  progressValue: {
    ...Typography.body,
    fontWeight: "700",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#E9ECEF",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: Spacing.md,
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  progressDivider: {
    height: 1,
    marginVertical: Spacing.md,
  },
});
