import React, { useState } from "react";
import { View, StyleSheet, Switch, Pressable, Modal } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, Typography, BorderRadius } from "@/constants/theme";
import { Image } from "expo-image";

const PRAYER_TIMES = [
  { name: "ফজর", nameEn: "Fajr", time: "05:15", completed: true },
  { name: "জোহর", nameEn: "Dhuhr", time: "12:30", completed: true },
  { name: "আসর", nameEn: "Asr", time: "15:45", completed: false },
  { name: "মাগরিব", nameEn: "Maghrib", time: "18:10", completed: false },
  { name: "এশা", nameEn: "Isha", time: "19:30", completed: false },
];

export default function PrayerScreen() {
  const { theme } = useTheme();
  const [prayerCompletions, setPrayerCompletions] = useState<Record<string, boolean>>(
    PRAYER_TIMES.reduce((acc, p) => ({ ...acc, [p.nameEn]: p.completed }), {} as Record<string, boolean>)
  );
  const [qiblaModalVisible, setQiblaModalVisible] = useState(false);

  const togglePrayer = (nameEn: string) => {
    setPrayerCompletions((prev) => ({
      ...prev,
      [nameEn]: !prev[nameEn],
    }));
  };

  return (
    <>
      <ScreenScrollView>
        <ThemedText style={styles.sectionTitle}>আজকের নামাজের সময়</ThemedText>

        {PRAYER_TIMES.map((prayer, index) => (
          <Card
            key={prayer.nameEn}
            style={[
              styles.prayerCard,
              prayerCompletions[prayer.nameEn] && {
                borderLeftWidth: 4,
                borderLeftColor: theme.success,
              },
            ]}
          >
            <View style={styles.prayerRow}>
              <View style={styles.prayerInfo}>
                <ThemedText style={styles.prayerName}>{prayer.name}</ThemedText>
                <ThemedText style={[styles.prayerTime, { color: theme.primary }]}>
                  {prayer.time}
                </ThemedText>
              </View>
              <Switch
                value={prayerCompletions[prayer.nameEn]}
                onValueChange={() => togglePrayer(prayer.nameEn)}
                trackColor={{ false: theme.border, true: theme.success }}
                thumbColor="#FFFFFF"
              />
            </View>
          </Card>
        ))}

        <Pressable
          onPress={() => setQiblaModalVisible(true)}
          style={({ pressed }) => [
            styles.qiblaButton,
            { backgroundColor: theme.primary },
            pressed && { opacity: 0.8 },
          ]}
        >
          <Feather name="compass" size={24} color="#FFFFFF" />
          <ThemedText style={styles.qiblaButtonText}>ক্বিবলা কম্পাস</ThemedText>
        </Pressable>

        <ThemedText style={styles.sectionTitle}>নামাজের নিয়ত</ThemedText>
        <Card style={styles.niyyahCard}>
          <ThemedText style={styles.niyyahTitle}>ফজরের নামাজের নিয়ত</ThemedText>
          <ThemedText style={styles.arabicText}>
            نَوَيْتُ أَنْ أُصَلِّيَ لِلَّهِ تَعَالَى رَكْعَتَيِ الْفَجْرِ
          </ThemedText>
          <ThemedText style={[styles.niyyahTranslation, { color: theme.textSecondary }]}>
            "আমি আল্লাহর উদ্দেশ্যে ফজরের দুই রাকাআত নামাজ পড়ার নিয়ত করলাম।"
          </ThemedText>
        </Card>

        <ThemedText style={styles.sectionTitle}>রিমাইন্ডার সেটিংস</ThemedText>
        <Card>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Feather name="bell" size={20} color={theme.primary} />
              <ThemedText style={styles.settingLabel}>নামাজের আজান</ThemedText>
            </View>
            <Switch
              value={true}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Feather name="volume-2" size={20} color={theme.primary} />
              <ThemedText style={styles.settingLabel}>সাইলেন্ট মোড</ThemedText>
            </View>
            <Switch
              value={false}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Card>
      </ScreenScrollView>

      <Modal
        visible={qiblaModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setQiblaModalVisible(false)}
      >
        <ThemedView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>ক্বিবলা কম্পাস</ThemedText>
            <Pressable onPress={() => setQiblaModalVisible(false)}>
              <Feather name="x" size={24} color={theme.text} />
            </Pressable>
          </View>

          <View style={styles.compassContainer}>
            <Image
              source={require("@/attached_assets/generated_images/qibla_compass_rose_design.png")}
              style={styles.compassImage}
              contentFit="contain"
            />
            <ThemedText style={styles.directionText}>উত্তর</ThemedText>
          </View>

          <Card style={styles.locationCard}>
            <View style={styles.locationRow}>
              <Feather name="map-pin" size={16} color={theme.primary} />
              <ThemedText style={styles.locationText}>ঢাকা, বাংলাদেশ</ThemedText>
            </View>
            <ThemedText style={[styles.distanceText, { color: theme.textSecondary }]}>
              কাবা থেকে দূরত্ব: ৩,৮৫০ কিমি
            </ThemedText>
            <ThemedText style={[styles.angleText, { color: theme.primary }]}>
              দিক: ২৮৫° পশ্চিম-উত্তর-পশ্চিম
            </ThemedText>
          </Card>
        </ThemedView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    ...Typography.h2,
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  prayerCard: {
    marginBottom: Spacing.md,
  },
  prayerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  prayerInfo: {
    flex: 1,
  },
  prayerName: {
    ...Typography.h3,
    marginBottom: Spacing.xs,
  },
  prayerTime: {
    ...Typography.body,
    fontWeight: "600",
  },
  qiblaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    marginVertical: Spacing.lg,
    gap: Spacing.md,
  },
  qiblaButtonText: {
    ...Typography.body,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  niyyahCard: {
    marginBottom: Spacing.lg,
  },
  niyyahTitle: {
    ...Typography.h3,
    marginBottom: Spacing.md,
  },
  arabicText: {
    ...Typography.arabicLarge,
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  niyyahTranslation: {
    ...Typography.body,
    textAlign: "center",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.md,
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    flex: 1,
  },
  settingLabel: {
    ...Typography.body,
  },
  divider: {
    height: 1,
  },
  modalContainer: {
    flex: 1,
    padding: Spacing.lg,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing["5xl"],
    marginBottom: Spacing["2xl"],
  },
  modalTitle: {
    ...Typography.h1,
  },
  compassContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: Spacing["2xl"],
  },
  compassImage: {
    width: 280,
    height: 280,
  },
  directionText: {
    ...Typography.h2,
    marginTop: Spacing.lg,
  },
  locationCard: {
    marginBottom: Spacing["2xl"],
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  locationText: {
    ...Typography.body,
    fontWeight: "600",
  },
  distanceText: {
    ...Typography.bodySmall,
    marginBottom: Spacing.xs,
  },
  angleText: {
    ...Typography.body,
    fontWeight: "600",
  },
});
