import React, { useState } from "react";
import { View, StyleSheet, Pressable, ScrollView, Switch, Modal, TextInput, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { TopNavigationBar } from "@/components/TopNavigationBar";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PRAYER_TIMES = [
  { name: "ফজর", karachi_start: "04:30", mosque_time: "05:15", karachi_end: "06:30", completed: true },
  { name: "যোহর", karachi_start: "12:00", mosque_time: "12:30", karachi_end: "14:00", completed: true },
  { name: "আসর", karachi_start: "15:30", mosque_time: "15:45", karachi_end: "17:45", completed: false },
  { name: "মাগরিব", karachi_start: "17:45", mosque_time: "18:10", karachi_end: "19:00", completed: false },
  { name: "এশা", karachi_start: "19:00", mosque_time: "19:30", karachi_end: "23:59", completed: false },
];

// Helper function to convert 24-hour format to 12-hour AM/PM format
const convertTo12Hour = (time24: string): string => {
  const [hours, minutes] = time24.split(':');
  let hour = parseInt(hours);
  const isAM = hour < 12;
  
  if (hour === 0) hour = 12;
  else if (hour > 12) hour -= 12;
  
  const period = isAM ? 'AM' : 'PM';
  return `${String(hour).padStart(2, '0')}:${minutes} ${period}`;
};

export default function PrayerScreen() {
  const { theme } = useAppTheme();
  const [prayerTimes, setPrayerTimes] = useState(PRAYER_TIMES);
  const [prayerCompletions, setPrayerCompletions] = useState<Record<string, boolean>>(
    PRAYER_TIMES.reduce((acc, p) => ({ ...acc, [p.name]: p.completed }), {})
  );
  const [editingPrayer, setEditingPrayer] = useState<string | null>(null);
  const [editingTime, setEditingTime] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  const togglePrayer = (name: string) => {
    setPrayerCompletions(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleEditPrayerTime = (prayerName: string, currentTime: string) => {
    setEditingPrayer(prayerName);
    setEditingTime(currentTime);
    setShowEditModal(true);
  };

  const savePrayerTime = async () => {
    if (!editingTime.match(/^\d{2}:\d{2}$/)) {
      Alert.alert("ত্রুটি", "সঠিক সময় ফরম্যাট ব্যবহার করুন (HH:MM)");
      return;
    }

    const updatedTimes = prayerTimes.map(p =>
      p.name === editingPrayer ? { ...p, mosque_time: editingTime } : p
    );
    setPrayerTimes(updatedTimes);
    await AsyncStorage.setItem('prayerTimes', JSON.stringify(updatedTimes));
    
    setShowEditModal(false);
    setEditingPrayer(null);
    setEditingTime("");
    Alert.alert("সফল", "নামাজের সময় আপডেট হয়েছে");
  };

  return (
    <View style={{ flex: 1 }}>
      <TopNavigationBar activeTab="Prayer" />
      <ScreenScrollView>
        <View style={{ paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg }}>
          {prayerTimes.map((prayer, idx) => (
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
                  
                  {/* তিনটি সময়ের লাইন - 12 hour format with AM/PM */}
                  <View style={styles.timeLines}>
                    {/* করাচি শুরুর সময় */}
                    <ThemedText style={[styles.timeLine, { color: theme.textSecondary }]}>
                      {convertTo12Hour(prayer.karachi_start)}
                    </ThemedText>

                    {/* মসজিদ অনুযায়ী সময় - Editable */}
                    <Pressable
                      onPress={() => handleEditPrayerTime(prayer.name, prayer.mosque_time)}
                      style={[styles.editableTimeLine, { borderBottomColor: theme.primary }]}
                    >
                      <ThemedText style={[styles.timeLine, { color: theme.primary, fontWeight: '600' }]}>
                        {convertTo12Hour(prayer.mosque_time)}
                      </ThemedText>
                      <Feather name="edit-2" size={12} color={theme.primary} style={{ marginLeft: Spacing.xs }} />
                    </Pressable>

                    {/* করাচি শেষের সময় */}
                    <ThemedText style={[styles.timeLine, { color: theme.textSecondary }]}>
                      {convertTo12Hour(prayer.karachi_end)}
                    </ThemedText>
                  </View>
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

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalBox, { backgroundColor: theme.card }]}>
            <ThemedText style={styles.modalTitle}>নামাজের সময় সম্পাদন করুন</ThemedText>
            <ThemedText style={[styles.modalLabel, { color: theme.textSecondary }]}>
              {editingPrayer}
            </ThemedText>

            <TextInput
              style={[styles.timeInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface }]}
              placeholder="HH:MM"
              value={editingTime}
              onChangeText={setEditingTime}
              maxLength={5}
            />

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, { backgroundColor: theme.border }]}
                onPress={() => setShowEditModal(false)}
              >
                <ThemedText style={styles.modalButtonText}>বাতিল করুন</ThemedText>
              </Pressable>

              <Pressable
                style={[styles.modalButton, { backgroundColor: theme.primary }]}
                onPress={savePrayerTime}
              >
                <ThemedText style={[styles.modalButtonText, { color: theme.surface }]}>সংরক্ষণ করুন</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: Spacing.md,
  },
  timeLines: {
    gap: Spacing.xs,
  },
  timeLine: {
    fontSize: 13,
    fontWeight: '500',
  },
  editableTimeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  modalLabel: {
    fontSize: 13,
    marginBottom: Spacing.md,
  },
  timeInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  modalButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
