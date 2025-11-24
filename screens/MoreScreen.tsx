import React, { useState } from "react";
import { View, StyleSheet, Pressable, TextInput, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { HeaderNav } from "@/components/HeaderNav";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";

const MORE_FEATURES = [
  { icon: 'calendar', title: 'ইসলামিক ক্যালেন্ডার', subtitle: 'হিজরি তারিখ ট্র্যাক করুন', color: '#1a5e63' },
  { icon: 'gift', title: 'যাকাত ক্যালকুলেটর', subtitle: 'যাকাত হিসাব করুন', color: '#f9a826' },
  { icon: 'moon', title: 'রমজান ট্র্যাকার', subtitle: 'রোজা এবং ইবাদত ট্র্যাক করুন', color: '#2d936c' },
  { icon: 'map-pin', title: 'কাছের মসজিদ', subtitle: 'আশেপাশের মসজিদ খুঁজুন', color: '#4CAF50' },
  { icon: 'file-text', title: 'হাদিস সংগ্রহ', subtitle: 'সহিহ হাদিস পড়ুন', color: '#1a5e63' },
  { icon: 'help-circle', title: 'প্রশ্নোত্তর', subtitle: 'ইসলামিক প্রশ্নের উত্তর', color: '#f9a826' },
];

export default function MoreScreen() {
  const { theme } = useAppTheme();
  const [zakatAmount, setZakatAmount] = useState("");
  const [zakatResult, setZakatResult] = useState<number | null>(null);

  const calculateZakat = () => {
    const amount = parseFloat(zakatAmount);
    if (!isNaN(amount) && amount > 0) {
      setZakatResult(amount * 0.025);
      Alert.alert('যাকাত গণনা', `আপনার যাকাত: ${(amount * 0.025).toFixed(2)} টাকা`);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderNav />
      <ScreenScrollView>
        <View style={[styles.header, { backgroundColor: theme.primary }]}>
          <ThemedText style={styles.headerTitle}>আরও বৈশিষ্ট্য</ThemedText>
          <ThemedText style={styles.headerSubtitle}>সমস্ত সরঞ্জাম এবং বৈশিষ্ট্য</ThemedText>
        </View>

      <Card style={styles.profileCard}>
        <View style={styles.profileRow}>
          <View style={[styles.avatar, { backgroundColor: theme.primary + '20' }]}>
            <Feather name="user" size={32} color={theme.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText style={[styles.profileName, { color: theme.text }]}>ব্যবহারকারী প্রোফাইল</ThemedText>
            <ThemedText style={[styles.profileEmail, { color: theme.textSecondary }]}>user@smartmuslim.app</ThemedText>
          </View>
          <Pressable>
            <Feather name="edit-2" size={20} color={theme.primary} />
          </Pressable>
        </View>
      </Card>

      <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>প্রধান বৈশিষ্ট্য</ThemedText>
      {MORE_FEATURES.map((feature, idx) => (
        <Pressable key={idx}>
          <Card style={styles.featureCard}>
            <View style={styles.featureRow}>
              <View style={[styles.featureIcon, { backgroundColor: feature.color + '15' }]}>
                <Feather name={feature.icon as any} size={20} color={feature.color} />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText style={[styles.featureTitle, { color: theme.text }]}>{feature.title}</ThemedText>
                <ThemedText style={[styles.featureSubtitle, { color: theme.textSecondary }]}>{feature.subtitle}</ThemedText>
              </View>
              <Feather name="chevron-right" size={20} color={theme.textSecondary} />
            </View>
          </Card>
        </Pressable>
      ))}

      <ThemedText style={[styles.sectionTitle, { color: theme.text, marginTop: Spacing.xl }]}>যাকাত ক্যালকুলেটর</ThemedText>
      <Card style={styles.toolCard}>
        <ThemedText style={[styles.toolLabel, { color: theme.text }]}>মোট সম্পদ (টাকা)</ThemedText>
        <TextInput
          style={[styles.toolInput, { backgroundColor: theme.backgroundSecondary, color: theme.text, borderColor: theme.border, borderWidth: 1 }]}
          placeholder="পরিমাণ লিখুন"
          placeholderTextColor={theme.textSecondary}
          keyboardType="decimal-pad"
          value={zakatAmount}
          onChangeText={setZakatAmount}
        />
        <Pressable style={[styles.calculateBtn, { backgroundColor: theme.primary }]} onPress={calculateZakat}>
          <ThemedText style={styles.calculateBtnText}>গণনা করুন</ThemedText>
        </Pressable>
        {zakatResult !== null && (
          <View style={[styles.result, { backgroundColor: theme.secondary + '15', borderColor: theme.secondary, borderWidth: 1 }]}>
            <ThemedText style={[styles.resultLabel, { color: theme.textSecondary }]}>আপনার যাকাত</ThemedText>
            <ThemedText style={[styles.resultValue, { color: theme.secondary }]}>{zakatResult.toFixed(2)} টাকা</ThemedText>
          </View>
        )}
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
  profileCard: {
    marginBottom: Spacing.xl,
    borderRadius: BorderRadius.md,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 15,
    fontWeight: '600',
  },
  profileEmail: {
    fontSize: 12,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  featureCard: {
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  featureSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  toolCard: {
    borderRadius: BorderRadius.md,
  },
  toolLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  toolInput: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    fontSize: 14,
    marginBottom: Spacing.md,
  },
  calculateBtn: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  calculateBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  result: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 24,
    fontWeight: '700',
  },
});
