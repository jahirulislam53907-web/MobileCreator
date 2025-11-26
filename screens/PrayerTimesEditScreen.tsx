import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Spacing, BorderRadius } from '@/constants/theme';
import { useTranslation } from '../src/contexts/LanguageContext';
import { PrayerTimesData, saveCustomPrayerTimes, calculatePrayerTimes } from '@/utils/prayerTimes';
import { DHAKA_COORDINATES } from '@/utils/prayerTimes';

interface PrayerTimesEditScreenProps {
  onClose: () => void;
  onSave: (times: PrayerTimesData) => void;
  currentTimes: PrayerTimesData | null;
}

export function PrayerTimesEditScreen({ onClose, onSave, currentTimes }: PrayerTimesEditScreenProps) {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const [fajr, setFajr] = useState(currentTimes?.fajr || '');
  const [sunrise, setSunrise] = useState(currentTimes?.sunrise || '');
  const [dhuhr, setDhuhr] = useState(currentTimes?.dhuhr || '');
  const [asr, setAsr] = useState(currentTimes?.asr || '');
  const [maghrib, setMaghrib] = useState(currentTimes?.maghrib || '');
  const [isha, setIsha] = useState(currentTimes?.isha || '');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setLoading(true);
    const defaultTimes = await calculatePrayerTimes(DHAKA_COORDINATES.latitude, DHAKA_COORDINATES.longitude);
    setFajr(defaultTimes.fajr);
    setSunrise(defaultTimes.sunrise);
    setDhuhr(defaultTimes.dhuhr);
    setAsr(defaultTimes.asr);
    setMaghrib(defaultTimes.maghrib);
    setIsha(defaultTimes.isha);
    setLoading(false);
  };

  const handleSave = async () => {
    const updatedTimes: PrayerTimesData = {
      fajr,
      sunrise,
      dhuhr,
      asr,
      maghrib,
      isha,
      date: new Date(),
    };
    await saveCustomPrayerTimes(updatedTimes);
    onSave(updatedTimes);
    onClose();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundDefault }]}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>নামাজের সময় সম্পাদনা</ThemedText>
        <Pressable onPress={onClose}>
          <ThemedText style={styles.closeBtn}>বন্ধ</ThemedText>
        </Pressable>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.timeField}>
          <ThemedText style={styles.label}>ফজর</ThemedText>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.border }]}
            value={fajr}
            onChangeText={setFajr}
            placeholder="05:00 AM"
            placeholderTextColor={theme.textSecondary}
          />
        </View>

        <View style={styles.timeField}>
          <ThemedText style={styles.label}>সূর্যোদয়</ThemedText>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.border }]}
            value={sunrise}
            onChangeText={setSunrise}
            placeholder="06:30 AM"
            placeholderTextColor={theme.textSecondary}
          />
        </View>

        <View style={styles.timeField}>
          <ThemedText style={styles.label}>যোহর</ThemedText>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.border }]}
            value={dhuhr}
            onChangeText={setDhuhr}
            placeholder="12:30 PM"
            placeholderTextColor={theme.textSecondary}
          />
        </View>

        <View style={styles.timeField}>
          <ThemedText style={styles.label}>আসর</ThemedText>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.border }]}
            value={asr}
            onChangeText={setAsr}
            placeholder="03:45 PM"
            placeholderTextColor={theme.textSecondary}
          />
        </View>

        <View style={styles.timeField}>
          <ThemedText style={styles.label}>মাগরিব</ThemedText>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.border }]}
            value={maghrib}
            onChangeText={setMaghrib}
            placeholder="06:15 PM"
            placeholderTextColor={theme.textSecondary}
          />
        </View>

        <View style={styles.timeField}>
          <ThemedText style={styles.label}>এশা</ThemedText>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.border }]}
            value={isha}
            onChangeText={setIsha}
            placeholder="07:45 PM"
            placeholderTextColor={theme.textSecondary}
          />
        </View>

        <View style={styles.buttonGroup}>
          <Pressable
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={handleReset}
            disabled={loading}
          >
            <ThemedText style={styles.buttonText}>পুনরায় সেট করুন</ThemedText>
          </Pressable>
          <Pressable
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={handleSave}
            disabled={loading}
          >
            <ThemedText style={styles.buttonText}>সংরক্ষণ করুন</ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeBtn: {
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    padding: Spacing.lg,
  },
  timeField: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
