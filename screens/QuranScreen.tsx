import React, { useState } from "react";
import { View, StyleSheet, Pressable, FlatList } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, Typography, BorderRadius } from "@/constants/theme";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { QURAN_SURAHS, QURAN_PARA } from "@/data/quranData";

export default function QuranScreen() {
  const { theme } = useTheme();
  const [selectedTab, setSelectedTab] = useState<"surah" | "para">("surah");
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  const renderSurahItem = ({ item }: { item: typeof QURAN_SURAHS[0] }) => (
    <Card style={styles.surahCard}>
      <View style={styles.surahRow}>
        <View
          style={[styles.surahNumber, { borderColor: theme.primary, backgroundColor: theme.primary + "15" }]}
        >
          <ThemedText style={[styles.surahNumberText, { color: theme.primary }]}>
            {item.number}
          </ThemedText>
        </View>

        <View style={styles.surahInfo}>
          <ThemedText style={styles.surahName}>{item.nameBengali}</ThemedText>
          <View style={styles.surahMeta}>
            <ThemedText style={[styles.surahMetaText, { color: theme.textSecondary }]}>
              {item.revelationTypeBengali}
            </ThemedText>
            <ThemedText style={[styles.surahMetaText, { color: theme.textSecondary }]}>
              {" • "}
            </ThemedText>
            <ThemedText style={[styles.surahMetaText, { color: theme.textSecondary }]}>
              {item.numberOfAyahs} আয়াত
            </ThemedText>
          </View>
        </View>

        <ThemedText style={styles.surahNameAr}>{item.nameArabic}</ThemedText>
      </View>
    </Card>
  );
  
  const renderParaItem = ({ item }: { item: typeof QURAN_PARA[0] }) => (
    <Card style={styles.surahCard}>
      <View style={styles.surahRow}>
        <View
          style={[styles.surahNumber, { borderColor: theme.secondary, backgroundColor: theme.secondary + "15" }]}
        >
          <ThemedText style={[styles.surahNumberText, { color: theme.secondary }]}>
            {item.number}
          </ThemedText>
        </View>

        <View style={styles.surahInfo}>
          <ThemedText style={styles.surahName}>{item.nameBengali}</ThemedText>
          <ThemedText style={[styles.surahMetaText, { color: theme.textSecondary }]}>
            সূরা {item.startSurah} থেকে {item.endSurah}
          </ThemedText>
        </View>

        <ThemedText style={styles.surahNameAr}>{item.nameArabic}</ThemedText>
      </View>
    </Card>
  );

  return (
    <ThemedView style={[styles.container, { paddingBottom: tabBarHeight + Spacing.xl }]}>
      <View style={styles.header}>
        <View style={styles.tabContainer}>
          <Pressable
            onPress={() => setSelectedTab("surah")}
            style={[
              styles.tab,
              selectedTab === "surah" && { backgroundColor: theme.primary },
            ]}
          >
            <ThemedText
              style={[
                styles.tabText,
                selectedTab === "surah" && { color: "#FFFFFF" },
              ]}
            >
              সূরা
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() => setSelectedTab("para")}
            style={[
              styles.tab,
              selectedTab === "para" && { backgroundColor: theme.primary },
            ]}
          >
            <ThemedText
              style={[
                styles.tabText,
                selectedTab === "para" && { color: "#FFFFFF" },
              ]}
            >
              পারা
            </ThemedText>
          </Pressable>
        </View>

        <Pressable style={styles.searchButton}>
          <Feather name="search" size={20} color={theme.primary} />
        </Pressable>
      </View>

      <Card style={styles.lastReadCard}>
        <View style={styles.lastReadHeader}>
          <Feather name="bookmark" size={20} color={theme.secondary} />
          <ThemedText style={[styles.lastReadTitle, { color: theme.secondary }]}>
            সর্বশেষ পড়া
          </ThemedText>
        </View>
        <ThemedText style={styles.lastReadSurah}>সূরা আল-বাকারা</ThemedText>
        <ThemedText style={[styles.lastReadVerse, { color: theme.textSecondary }]}>
          আয়াত ২৫৫ - আয়াতুল কুরসি
        </ThemedText>
        <Pressable
          style={({ pressed }) => [
            styles.continueButton,
            { backgroundColor: theme.primary },
            pressed && { opacity: 0.8 },
          ]}
        >
          <ThemedText style={styles.continueButtonText}>পড়া চালিয়ে যান</ThemedText>
          <Feather name="arrow-right" size={16} color="#FFFFFF" />
        </Pressable>
      </Card>

      <FlatList
        data={selectedTab === "surah" ? QURAN_SURAHS : QURAN_PARA}
        renderItem={selectedTab === "surah" ? renderSurahItem : renderParaItem}
        keyExtractor={(item) => item.number.toString()}
        contentContainerStyle={{ paddingBottom: Spacing.lg }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  tabContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#E9ECEF",
    borderRadius: BorderRadius.sm,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xs,
    alignItems: "center",
  },
  tabText: {
    ...Typography.body,
    fontWeight: "600",
  },
  searchButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  lastReadCard: {
    marginBottom: Spacing.lg,
  },
  lastReadHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  lastReadTitle: {
    ...Typography.bodySmall,
    fontWeight: "600",
  },
  lastReadSurah: {
    ...Typography.h2,
    marginBottom: Spacing.xs,
  },
  lastReadVerse: {
    ...Typography.bodySmall,
    marginBottom: Spacing.md,
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.xs,
    gap: Spacing.sm,
  },
  continueButtonText: {
    ...Typography.body,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  surahCard: {
    marginBottom: Spacing.md,
  },
  surahRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  surahNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  surahNumberText: {
    ...Typography.body,
    fontWeight: "700",
  },
  surahInfo: {
    flex: 1,
  },
  surahName: {
    ...Typography.body,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  surahMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  surahMetaText: {
    ...Typography.caption,
  },
  surahNameAr: {
    ...Typography.h3,
  },
});
