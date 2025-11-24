import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Switch } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { useTheme } from '@/hooks/useTheme';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Spacing, BorderRadius } from '@/constants/theme';

export default function SettingsScreen() {
  const { theme } = useTheme();
  const colorScheme = useColorScheme();
  const [notifications, setNotifications] = useState(true);
  const [prayerReminder, setPrayerReminder] = useState(true);

  const SETTINGS = [
    {
      section: 'প্রদর্শন',
      items: [
        { icon: 'moon', label: 'ডার্ক মোড', value: colorScheme === 'dark' },
        { icon: 'bell', label: 'নোটিফিকেশন', value: notifications },
      ],
    },
    {
      section: 'নামাজ',
      items: [
        { icon: 'clock', label: 'নামাজের রিমাইন্ডার', value: prayerReminder },
        { icon: 'volume-2', label: 'আজানের শব্দ', value: true },
      ],
    },
    {
      section: 'অ্যাপ তথ্য',
      items: [
        { icon: 'info', label: 'সংস্করণ', subtitle: '1.0.0' },
        { icon: 'help-circle', label: 'সহায়তা এবং প্রতিক্রিয়া' },
        { icon: 'shield', label: 'গোপনীয়তা নীতি' },
      ],
    },
  ];

  return (
    <ScreenScrollView>
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <ThemedText style={styles.headerTitle}>সেটিংস</ThemedText>
      </View>

      {SETTINGS.map((section, idx) => (
        <View key={idx}>
          <ThemedText style={[styles.sectionHeader, { color: theme.primary, marginTop: Spacing.xl }]}>
            {section.section}
          </ThemedText>
          {section.items.map((item, itemIdx) => (
            <Card key={itemIdx} style={styles.settingItem}>
              <View style={styles.settingContent}>
                <View style={styles.settingLeft}>
                  <Feather name={item.icon as any} size={20} color={theme.primary} />
                  <View style={{ marginLeft: Spacing.md }}>
                    <ThemedText style={styles.settingLabel}>{item.label}</ThemedText>
                    {item.subtitle && (
                      <ThemedText style={[styles.settingSubtitle, { color: theme.textSecondary }]}>
                        {item.subtitle}
                      </ThemedText>
                    )}
                  </View>
                </View>
                {item.value !== undefined && (
                  <Switch
                    value={item.value}
                    trackColor={{ false: theme.border, true: theme.primary }}
                    thumbColor="#fff"
                  />
                )}
              </View>
            </Card>
          ))}
        </View>
      ))}

      <Pressable style={[styles.logoutBtn, { backgroundColor: '#E76F51' }]}>
        <Feather name="log-out" size={18} color="#fff" />
        <ThemedText style={{ color: '#fff', fontWeight: '600', marginLeft: Spacing.md }}>লগ আউট</ThemedText>
      </Pressable>
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  settingItem: {
    marginBottom: Spacing.md,
  },
  settingContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontWeight: '600',
    fontSize: 14,
  },
  settingSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
});
