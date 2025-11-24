import React, { useState } from "react";
import { View, StyleSheet, Pressable, ScrollView, Switch } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { HeaderNav } from "@/components/HeaderNav";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";

const PRAYER_TIMES = [
  { name: "ফজর", time: "05:15", completed: true },
  { name: "যোহর", time: "12:30", completed: true },
  { name: "আসর", time: "15:45", completed: false },
  { name: "মাগরিব", time: "18:10", completed: false },
  { name: "এশা", time: "19:30", completed: false },
];

export default function PrayerScreen() {
  const { theme } = useAppTheme();
  const [prayerCompletions, setPrayerCompletions] = useState<Record<string, boolean>>(
    PRAYER_TIMES.reduce((acc, p) => ({ ...acc, [p.name]: p.completed }), {})
  );

  const togglePrayer = (name: string) => {
    setPrayerCompletions(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderNav />
      <ScreenScrollView>
      <View style={[styles.container, { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg }]}>
        {PRAYER_TIMES.map((prayer, idx) => (
          <Card 
            key={idx}
            style={[
              styles.prayerCard,
              { ...Shadows.md, borderTopColor: prayerCompletions[prayer.name] ? theme.secondary : theme.primary, borderTopWidth: 3 }
            ]}
          >
            <View style={styles.prayerContent}>
              <View style={{ flex: 1 }}>
                <ThemedText style={[styles.prayerName, { color: theme.primary }]}>{prayer.name}</ThemedText>
                <ThemedText style={[styles.prayerTime, { color: theme.textSecondary }]}>{prayer.time}</ThemedText>
              </View>
              <Switch
                value={prayerCompletions[prayer.name]}
                onValueChange={() => togglePrayer(prayer.name)}
                trackColor={{ false: theme.border, true: theme.secondary + '40' }}
                thumbColor={prayerCompletions[prayer.name] ? theme.secondary : theme.textSecondary}
              />
            </View>
          </Card>
        ))}
      </View>

      <ThemedText style={[styles.sectionTitle, { color: theme.text, marginTop: Spacing.xl }]}>অতিরিক্ত</ThemedText>
      
      <Card style={[styles.card, { ...Shadows.sm }]}>
        <View style={styles.cardRow}>
          <View style={[styles.iconBox, { backgroundColor: theme.accent + "15" }]}>
            <Feather name="compass" size={24} color={theme.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText style={[styles.cardTitle, { color: theme.text }]}>কিবলা দিক</ThemedText>
            <ThemedText style={[styles.cardSubtitle, { color: theme.textSecondary }]}>আপনার দিকনির্দেশনা দেখুন</ThemedText>
          </View>
          <Feather name="chevron-right" size={20} color={theme.textSecondary} />
        </View>
      </Card>

      <Card style={[styles.card, { ...Shadows.sm }]}>
        <View style={styles.cardRow}>
          <View style={[styles.iconBox, { backgroundColor: theme.secondary + "15" }]}>
            <Feather name="map-pin" size={24} color={theme.secondary} />
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText style={[styles.cardTitle, { color: theme.text }]}>কাছের মসজিদ</ThemedText>
            <ThemedText style={[styles.cardSubtitle, { color: theme.textSecondary }]}>আপনার কাছাকাছি মসজিদ খুঁজুন</ThemedText>
          </View>
          <Feather name="chevron-right" size={20} color={theme.textSecondary} />
        </View>
      </Card>

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
    marginBottom: Spacing.xl,
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
  prayerGrid: {
    marginBottom: Spacing.xl,
  },
  prayerCard: {
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  prayerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  prayerName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  prayerTime: {
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  card: {
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
  },
});
