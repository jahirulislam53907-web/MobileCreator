import React, { useState } from "react";
import { View, StyleSheet, Pressable, FlatList, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { HeaderNav } from "@/components/HeaderNav";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Spacing, Typography, BorderRadius, Shadows } from "@/constants/theme";
import { QURAN_SURAHS, QURAN_PARA } from "@/data/quranData";

export default function QuranScreen() {
  const { theme } = useAppTheme();
  const [selectedTab, setSelectedTab] = useState<"surah" | "para">("surah");
  const [search, setSearch] = useState("");

  const filteredData = selectedTab === "surah" 
    ? QURAN_SURAHS.filter(s => s.nameBengali.toLowerCase().includes(search.toLowerCase()))
    : QURAN_PARA.filter(p => p.nameBengali.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={{ flex: 1 }}>
      <HeaderNav />
      <ScreenScrollView>

      <View style={styles.tabContainer}>
        <Pressable 
          style={[styles.tab, selectedTab === "surah" && { borderBottomColor: theme.primary, borderBottomWidth: 3 }]}
          onPress={() => setSelectedTab("surah")}
        >
          <ThemedText style={[styles.tabText, selectedTab === "surah" && { color: theme.primary, fontWeight: '700' }]}>সূরা</ThemedText>
        </Pressable>
        <Pressable 
          style={[styles.tab, selectedTab === "para" && { borderBottomColor: theme.primary, borderBottomWidth: 3 }]}
          onPress={() => setSelectedTab("para")}
        >
          <ThemedText style={[styles.tabText, selectedTab === "para" && { color: theme.primary, fontWeight: '700' }]}>পারা</ThemedText>
        </Pressable>
      </View>

      <View style={[styles.searchBox, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border, borderWidth: 1 }]}>
        <Feather name="search" size={18} color={theme.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder={selectedTab === "surah" ? "সূরা খুঁজুন..." : "পারা খুঁজুন..."}
          placeholderTextColor={theme.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
        {search !== "" && (
          <Pressable onPress={() => setSearch("")}>
            <Feather name="x" size={18} color={theme.textSecondary} />
          </Pressable>
        )}
      </View>

      <FlatList
        scrollEnabled={false}
        data={filteredData as any}
        renderItem={({ item }: any) => (
          <Pressable>
            <Card style={[styles.itemCard, { ...Shadows.sm, borderLeftColor: theme.primary, borderLeftWidth: 4 }]}>
              <View style={styles.itemRow}>
                <View style={[styles.numberBox, { backgroundColor: theme.primary + "15" }]}>
                  <ThemedText style={[styles.number, { color: theme.primary }]}>{item.number}</ThemedText>
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText style={[styles.itemTitle, { color: theme.text }]}>{item.nameBengali}</ThemedText>
                  <ThemedText style={[styles.itemSubtitle, { color: theme.textSecondary }]}>
                    {selectedTab === "surah" && item.numberOfAyahs ? `${item.numberOfAyahs} আয়াত` : selectedTab === "para" && item.startSurah ? `সূরা ${item.startSurah} - ${item.endSurah}` : ''}
                  </ThemedText>
                </View>
                <Feather name="chevron-right" size={20} color={theme.textSecondary} />
              </View>
            </Card>
          </Pressable>
        )}
        keyExtractor={(item: any) => item.number.toString()}
      />

      <View style={{ height: 30 }} />
    </ScreenScrollView>
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
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: Spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
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
  itemCard: {
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  numberBox: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    fontWeight: '700',
    fontSize: 14,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 12,
  },
});
