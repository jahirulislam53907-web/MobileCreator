import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, Typography, BorderRadius } from "@/constants/theme";

const DUA_CATEGORIES = [
  { icon: "sunrise", title: "সকালের দুয়া", count: 8, color: "#F4A261" },
  { icon: "sunset", title: "সন্ধ্যার দুয়া", count: 8, color: "#D4A574" },
  { icon: "clock", title: "নামাজের পরে", count: 12, color: "#2D6A4F" },
  { icon: "coffee", title: "খাওয়া-দাওয়া", count: 6, color: "#40916C" },
  { icon: "home", title: "ঘরে প্রবেশ/বের হওয়া", count: 4, color: "#52B788" },
  { icon: "moon", title: "ঘুমানোর সময়", count: 7, color: "#B8860B" },
];

const FEATURED_DUAS = [
  {
    title: "আয়াতুল কুরসি",
    arabic: "اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ",
    translation: "আল্লাহ, তিনি ছাড়া কোনো ইলাহ নেই। তিনি চিরঞ্জীব ও সর্বসত্তার ধারক।",
  },
  {
    title: "তাসবিহে ফাতিমা",
    arabic: "سُبْحَانَ اللَّهِ - الْحَمْدُ لِلَّهِ - اللَّهُ أَكْبَرُ",
    translation: "সুবহানাল্লাহ (৩৩) - আলহামদুলিল্লাহ (৩৩) - আল্লাহু আকবার (৩৪)",
  },
];

export default function DuaScreen() {
  const { theme } = useTheme();

  return (
    <ScreenScrollView>
      <View style={styles.searchContainer}>
        <View style={[styles.searchBox, { backgroundColor: theme.backgroundSecondary }]}>
          <Feather name="search" size={18} color={theme.textSecondary} />
          <ThemedText style={[styles.searchPlaceholder, { color: theme.textSecondary }]}>
            দুয়া খুঁজুন...
          </ThemedText>
        </View>
      </View>

      <ThemedText style={styles.sectionTitle}>বিষয়ভিত্তিক দুয়া</ThemedText>

      <View style={styles.categoriesGrid}>
        {DUA_CATEGORIES.map((category) => (
          <Pressable
            key={category.title}
            style={({ pressed }) => [
              styles.categoryCard,
              { backgroundColor: theme.backgroundDefault },
              pressed && { opacity: 0.7 },
            ]}
          >
            <View style={[styles.categoryIcon, { backgroundColor: category.color + "15" }]}>
              <Feather name={category.icon as any} size={24} color={category.color} />
            </View>
            <ThemedText style={styles.categoryTitle}>{category.title}</ThemedText>
            <ThemedText style={[styles.categoryCount, { color: theme.textSecondary }]}>
              {category.count} টি দুয়া
            </ThemedText>
          </Pressable>
        ))}
      </View>

      <ThemedText style={styles.sectionTitle}>গুরুত্বপূর্ণ দুয়া</ThemedText>

      {FEATURED_DUAS.map((dua, index) => (
        <Card key={index} style={styles.duaCard}>
          <View style={styles.duaHeader}>
            <Feather name="star" size={18} color={theme.secondary} />
            <ThemedText style={[styles.duaTitle, { color: theme.secondary }]}>
              {dua.title}
            </ThemedText>
          </View>

          <ThemedText style={styles.arabicText}>{dua.arabic}</ThemedText>

          <ThemedText style={styles.translationText}>{dua.translation}</ThemedText>

          <View style={styles.duaActions}>
            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Feather name="heart" size={18} color={theme.primary} />
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Feather name="share-2" size={18} color={theme.primary} />
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Feather name="copy" size={18} color={theme.primary} />
            </Pressable>
          </View>
        </Card>
      ))}

      <Card style={styles.reminderCard}>
        <View style={styles.reminderHeader}>
          <Feather name="bell" size={20} color={theme.warning} />
          <ThemedText style={[styles.reminderTitle, { color: theme.warning }]}>
            দুয়া স্মরণিকা
          </ThemedText>
        </View>
        <ThemedText style={[styles.reminderText, { color: theme.textSecondary }]}>
          দৈনিক দুয়া পড়ার জন্য রিমাইন্ডার সেট করুন
        </ThemedText>
        <Pressable
          style={({ pressed }) => [
            styles.reminderButton,
            { backgroundColor: theme.warning },
            pressed && { opacity: 0.8 },
          ]}
        >
          <ThemedText style={styles.reminderButtonText}>রিমাইন্ডার সেট করুন</ThemedText>
        </Pressable>
      </Card>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    marginBottom: Spacing.lg,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    gap: Spacing.sm,
  },
  searchPlaceholder: {
    ...Typography.body,
  },
  sectionTitle: {
    ...Typography.h2,
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  categoryCard: {
    width: "47.5%",
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  categoryTitle: {
    ...Typography.body,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  categoryCount: {
    ...Typography.caption,
  },
  duaCard: {
    marginBottom: Spacing.lg,
  },
  duaHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  duaTitle: {
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
    marginBottom: Spacing.md,
  },
  duaActions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: "#E9ECEF",
  },
  actionButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  reminderCard: {
    marginBottom: Spacing.lg,
  },
  reminderHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  reminderTitle: {
    ...Typography.h3,
  },
  reminderText: {
    ...Typography.body,
    marginBottom: Spacing.md,
  },
  reminderButton: {
    padding: Spacing.md,
    borderRadius: BorderRadius.xs,
    alignItems: "center",
  },
  reminderButtonText: {
    ...Typography.body,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
