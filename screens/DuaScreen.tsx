import React, { useState } from "react";
import { View, StyleSheet, Pressable, FlatList, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { HeaderNav } from "@/components/HeaderNav";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";

const DUA_CATEGORIES = [
  { title: "সকালের দুয়া", count: 8, icon: 'sunrise', color: '#f9a826' },
  { title: "সন্ধ্যার দুয়া", count: 8, icon: 'sunset', color: '#2d936c' },
  { title: "নামাজের পরে", count: 12, icon: 'clock', color: '#1a5e63' },
  { title: "খাওয়া-দাওয়া", count: 6, icon: 'utensils', color: '#4CAF50' },
];

const FEATURED_DUAS = [
  { title: "আয়াতুল কুরসি", arabic: "اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ", category: "সুরক্ষা" },
  { title: "দুরুদ শরীফ", arabic: "صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ", category: "মহান" },
  { title: "তাসবিহে ফাতিমা", arabic: "سُبْحَانَ اللَّهِ", category: "প্রশংসা" },
];

export default function DuaScreen() {
  const { theme } = useAppTheme();
  const [search, setSearch] = useState("");

  return (
    <View style={{ flex: 1 }}>
      <HeaderNav />
      <ScreenScrollView>

      <View style={[styles.searchBox, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border, borderWidth: 1 }]}>
        <Feather name="search" size={18} color={theme.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="দুয়া খুঁজুন..."
          placeholderTextColor={theme.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>বিষয়ভিত্তিক দুয়া</ThemedText>
      <View style={styles.categoryGrid}>
        {DUA_CATEGORIES.map((cat, idx) => (
          <Pressable key={idx} style={styles.categoryCardWrapper}>
            <Card style={[styles.categoryCard, { ...Shadows.sm }]}>
              <View style={[styles.categoryIcon, { backgroundColor: cat.color + '15' }]}>
                <Feather name={cat.icon as any} size={24} color={cat.color} />
              </View>
              <ThemedText style={[styles.categoryTitle, { color: theme.text }]}>{cat.title}</ThemedText>
              <ThemedText style={[styles.categoryCount, { color: theme.textSecondary }]}>{cat.count} টি</ThemedText>
            </Card>
          </Pressable>
        ))}
      </View>

      <ThemedText style={[styles.sectionTitle, { color: theme.text, marginTop: Spacing.xl }]}>গুরুত্বপূর্ণ দুয়া</ThemedText>
      {FEATURED_DUAS.map((dua, idx) => (
        <Card key={idx} style={[styles.duaCard, { ...Shadows.sm, borderLeftColor: theme.secondary, borderLeftWidth: 4 }]}>
          <View style={styles.duaHeader}>
            <Feather name="star" size={18} color={theme.accent} />
            <ThemedText style={[styles.duaTitle, { color: theme.secondary }]}>{dua.title}</ThemedText>
          </View>
          <ThemedText style={[styles.duaArabic, { color: theme.text }]}>{dua.arabic}</ThemedText>
          <ThemedText style={[styles.duaCategory, { color: theme.textSecondary }]}>{dua.category}</ThemedText>
          <Pressable style={[styles.duaBtn, { backgroundColor: theme.primary + '15' }]}>
            <Feather name="heart" size={16} color={theme.primary} />
            <ThemedText style={[{ color: theme.primary, fontWeight: '600', marginLeft: Spacing.sm }]}>সংরক্ষণ করুন</ThemedText>
          </Pressable>
        </Card>
      ))}

      <View style={{ height: 30 }} />
      </ScreenScrollView>
    </View>
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
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  categoryGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    flexWrap: 'wrap',
    marginBottom: Spacing.lg,
  },
  categoryCardWrapper: {
    width: '48%',
  },
  categoryCard: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  categoryCount: {
    fontSize: 12,
  },
  duaCard: {
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  duaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  duaTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  duaArabic: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  duaCategory: {
    fontSize: 12,
    marginBottom: Spacing.md,
  },
  duaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
});
