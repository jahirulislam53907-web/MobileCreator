import React, { useState } from "react";
import { View, StyleSheet, Pressable, Modal, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, Typography, BorderRadius } from "@/constants/theme";

const MORE_OPTIONS = [
  { icon: "calendar", title: "ইসলামিক ক্যালেন্ডার", subtitle: "হিজরি তারিখ ও বিশেষ দিন", color: "#2D6A4F" },
  { icon: "dollar-sign", title: "যাকাত ক্যালকুলেটর", subtitle: "যাকাত হিসাব করুন", color: "#D4A574" },
  { icon: "moon", title: "রমজান ট্র্যাকার", subtitle: "রোজা ও ইবাদত ট্র্যাকিং", color: "#B8860B" },
  { icon: "map-pin", title: "নিকটবর্তী মসজিদ", subtitle: "আশেপাশের মসজিদ খুঁজুন", color: "#40916C" },
  { icon: "book", title: "হাদিস সংগ্রহ", subtitle: "সহিহ হাদিস পড়ুন", color: "#52B788" },
  { icon: "help-circle", title: "প্রশ্নোত্তর", subtitle: "ইসলামিক প্রশ্নের উত্তর", color: "#F4A261" },
];

export default function MoreScreen() {
  const { theme } = useTheme();
  const [zakatModalVisible, setZakatModalVisible] = useState(false);
  const [zakatAmount, setZakatAmount] = useState("");
  const [calculatedZakat, setCalculatedZakat] = useState<number | null>(null);

  const calculateZakat = () => {
    const amount = parseFloat(zakatAmount);
    if (!isNaN(amount) && amount > 0) {
      setCalculatedZakat(amount * 0.025);
    }
  };

  return (
    <>
      <ScreenScrollView>
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={[styles.avatar, { backgroundColor: theme.primary + "20" }]}>
              <Feather name="user" size={32} color={theme.primary} />
            </View>
            <View style={styles.profileInfo}>
              <ThemedText style={styles.profileName}>ব্যবহারকারী</ThemedText>
              <ThemedText style={[styles.profileEmail, { color: theme.textSecondary }]}>
                user@islamicapp.com
              </ThemedText>
            </View>
            <Pressable>
              <Feather name="settings" size={20} color={theme.primary} />
            </Pressable>
          </View>
        </Card>

        <ThemedText style={styles.sectionTitle}>ফিচার সমূহ</ThemedText>

        {MORE_OPTIONS.map((option) => (
          <Pressable
            key={option.title}
            onPress={() => {
              if (option.title === "যাকাত ক্যালকুলেটর") {
                setZakatModalVisible(true);
              }
            }}
            style={({ pressed }) => [pressed && { opacity: 0.7 }]}
          >
            <Card style={styles.optionCard}>
              <View style={[styles.optionIcon, { backgroundColor: option.color + "15" }]}>
                <Feather name={option.icon as any} size={24} color={option.color} />
              </View>
              <View style={styles.optionInfo}>
                <ThemedText style={styles.optionTitle}>{option.title}</ThemedText>
                <ThemedText style={[styles.optionSubtitle, { color: theme.textSecondary }]}>
                  {option.subtitle}
                </ThemedText>
              </View>
              <Feather name="chevron-right" size={20} color={theme.textSecondary} />
            </Card>
          </Pressable>
        ))}

        <ThemedText style={styles.sectionTitle}>সেটিংস</ThemedText>

        <Card style={styles.settingsCard}>
          <Pressable style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Feather name="bell" size={20} color={theme.primary} />
              <ThemedText style={styles.settingText}>নোটিফিকেশন</ThemedText>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </Pressable>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <Pressable style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Feather name="globe" size={20} color={theme.primary} />
              <ThemedText style={styles.settingText}>ভাষা</ThemedText>
            </View>
            <View style={styles.settingRight}>
              <ThemedText style={[styles.settingValue, { color: theme.textSecondary }]}>
                বাংলা
              </ThemedText>
              <Feather name="chevron-right" size={20} color={theme.textSecondary} />
            </View>
          </Pressable>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <Pressable style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Feather name="moon" size={20} color={theme.primary} />
              <ThemedText style={styles.settingText}>ডার্ক মোড</ThemedText>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </Pressable>
        </Card>

        <Card style={styles.aboutCard}>
          <ThemedText style={styles.aboutTitle}>ইসলামিক সুপার অ্যাপ</ThemedText>
          <ThemedText style={[styles.aboutVersion, { color: theme.textSecondary }]}>
            সংস্করণ ১.০.০
          </ThemedText>
          <ThemedText style={[styles.aboutText, { color: theme.textSecondary }]}>
            আপনার দৈনন্দিন ইসলামিক জীবনযাপনের সহায়ক
          </ThemedText>
        </Card>
      </ScreenScrollView>

      <Modal
        visible={zakatModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setZakatModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>যাকাত ক্যালকুলেটর</ThemedText>
              <Pressable onPress={() => {
                setZakatModalVisible(false);
                setCalculatedZakat(null);
                setZakatAmount("");
              }}>
                <Feather name="x" size={24} color={theme.text} />
              </Pressable>
            </View>

            <ThemedText style={[styles.modalDescription, { color: theme.textSecondary }]}>
              আপনার মোট সম্পদের পরিমাণ লিখুন (টাকায়)
            </ThemedText>

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.backgroundSecondary,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder="উদাহরণ: ১০০০০০"
              placeholderTextColor={theme.textSecondary}
              keyboardType="numeric"
              value={zakatAmount}
              onChangeText={setZakatAmount}
            />

            <Pressable
              onPress={calculateZakat}
              style={({ pressed }) => [
                styles.calculateButton,
                { backgroundColor: theme.primary },
                pressed && { opacity: 0.8 },
              ]}
            >
              <ThemedText style={styles.calculateButtonText}>হিসাব করুন</ThemedText>
            </Pressable>

            {calculatedZakat !== null && (
              <Card style={styles.resultCard}>
                <ThemedText style={[styles.resultLabel, { color: theme.textSecondary }]}>
                  প্রদেয় যাকাত
                </ThemedText>
                <ThemedText style={[styles.resultValue, { color: theme.success }]}>
                  ৳ {calculatedZakat.toLocaleString("bn-BD")}
                </ThemedText>
                <ThemedText style={[styles.resultInfo, { color: theme.textSecondary }]}>
                  (সম্পদের ২.৫%)
                </ThemedText>
              </Card>
            )}

            <ThemedText style={[styles.zakatInfo, { color: theme.textSecondary }]}>
              * নিসাব পরিমাণ: ৫২.৫ তোলা রূপা বা ৭.৫ তোলা স্বর্ণের মূল্য
            </ThemedText>
          </ThemedView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    marginBottom: Spacing.lg,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...Typography.h3,
    marginBottom: Spacing.xs,
  },
  profileEmail: {
    ...Typography.bodySmall,
  },
  sectionTitle: {
    ...Typography.h2,
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  optionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    ...Typography.body,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  optionSubtitle: {
    ...Typography.caption,
  },
  settingsCard: {
    marginBottom: Spacing.lg,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.md,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  settingText: {
    ...Typography.body,
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  settingValue: {
    ...Typography.body,
  },
  divider: {
    height: 1,
  },
  aboutCard: {
    alignItems: "center",
    marginBottom: Spacing["3xl"],
  },
  aboutTitle: {
    ...Typography.h2,
    marginBottom: Spacing.xs,
  },
  aboutVersion: {
    ...Typography.caption,
    marginBottom: Spacing.sm,
  },
  aboutText: {
    ...Typography.bodySmall,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    padding: Spacing["2xl"],
    paddingBottom: Spacing["4xl"],
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    ...Typography.h1,
  },
  modalDescription: {
    ...Typography.body,
    marginBottom: Spacing.lg,
  },
  input: {
    ...Typography.body,
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  calculateButton: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  calculateButtonText: {
    ...Typography.body,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  resultCard: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  resultLabel: {
    ...Typography.bodySmall,
    marginBottom: Spacing.xs,
  },
  resultValue: {
    ...Typography.display,
    fontSize: 36,
    fontWeight: "700",
    marginBottom: Spacing.xs,
  },
  resultInfo: {
    ...Typography.caption,
  },
  zakatInfo: {
    ...Typography.caption,
    textAlign: "center",
  },
});
