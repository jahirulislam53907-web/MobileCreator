import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Switch, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { useTheme } from '@/hooks/useTheme';
import { Spacing, BorderRadius, Shadows } from '@/constants/theme';

interface SettingItem {
  icon: string;
  label: string;
  subtitle?: string;
  hasToggle?: boolean;
  value?: boolean;
  onChange?: (val: boolean) => void;
  action?: () => void;
}

export default function SettingsScreen() {
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [prayerReminder, setPrayerReminder] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibration, setVibration] = useState(true);

  const handleLogout = () => {
    Alert.alert('লগ আউট', 'আপনি নিশ্চিত?', [
      { text: 'বাতিল' },
      { text: 'লগ আউট', onPress: () => {} }
    ]);
  };

  const SETTINGS_SECTIONS = [
    {
      title: 'প্রদর্শন',
      icon: 'monitor' as const,
      items: [
        { icon: 'moon', label: 'ডার্ক মোড', hasToggle: true, value: false } as SettingItem,
        { icon: 'type', label: 'ফন্ট সাইজ', subtitle: 'মাঝারি' } as SettingItem,
      ]
    },
    {
      title: 'নোটিফিকেশন',
      icon: 'bell' as const,
      items: [
        { icon: 'bell', label: 'সমস্ত নোটিফিকেশন', hasToggle: true, value: notifications, onChange: setNotifications } as SettingItem,
        { icon: 'clock', label: 'নামাজের রিমাইন্ডার', hasToggle: true, value: prayerReminder, onChange: setPrayerReminder } as SettingItem,
        { icon: 'volume-2', label: 'নোটিফিকেশন শব্দ', hasToggle: true, value: soundEnabled, onChange: setSoundEnabled } as SettingItem,
        { icon: 'zap', label: 'কম্পন', hasToggle: true, value: vibration, onChange: setVibration } as SettingItem,
      ]
    },
    {
      title: 'অ্যাপ তথ্য',
      icon: 'info' as const,
      items: [
        { icon: 'package', label: 'সংস্করণ', subtitle: '1.0.0' } as SettingItem,
        { icon: 'help-circle', label: 'সাহায্য ও সহায়তা' } as SettingItem,
        { icon: 'lock', label: 'গোপনীয়তা নীতি' } as SettingItem,
        { icon: 'file-text', label: 'শর্তাবলী' } as SettingItem,
      ]
    }
  ];

  return (
    <ScreenScrollView>
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <ThemedText style={styles.headerTitle}>সেটিংস</ThemedText>
        <ThemedText style={styles.headerSubtitle}>আপনার পছন্দ কাস্টমাইজ করুন</ThemedText>
      </View>

      {SETTINGS_SECTIONS.map((section, sectionIdx) => (
        <View key={sectionIdx}>
          <View style={styles.sectionHeader}>
            <Feather name={section.icon as any} size={16} color={theme.primary} />
            <ThemedText style={[styles.sectionTitle, { color: theme.primary }]}>{section.title}</ThemedText>
          </View>

          {section.items.map((item, itemIdx) => (
            <Card key={itemIdx} style={[styles.settingItem, { ...Shadows.sm }]}>
              <View style={styles.itemContent}>
                <View style={[styles.itemIcon, { backgroundColor: theme.primary + '15' }]}>
                  <Feather name={item.icon as any} size={18} color={theme.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText style={[styles.itemLabel, { color: theme.text }]}>{item.label}</ThemedText>
                  {item.subtitle && (
                    <ThemedText style={[styles.itemSubtitle, { color: theme.textSecondary }]}>
                      {item.subtitle}
                    </ThemedText>
                  )}
                </View>
                {item.hasToggle ? (
                  <Switch
                    value={item.value || false}
                    onValueChange={item.onChange || (() => {})}
                    trackColor={{ false: theme.border, true: theme.primary + '40' }}
                    thumbColor={item.value ? theme.primary : theme.textSecondary}
                  />
                ) : (
                  <Feather name="chevron-right" size={20} color={theme.textSecondary} />
                )}
              </View>
            </Card>
          ))}
        </View>
      ))}

      <Pressable
        onPress={handleLogout}
        style={({ pressed }) => [
          styles.logoutBtn,
          { backgroundColor: '#ef5350' },
          pressed && { opacity: 0.8 }
        ]}
      >
        <Feather name="log-out" size={20} color="#fff" />
        <ThemedText style={styles.logoutText}>লগ আউট</ThemedText>
      </Pressable>

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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  settingItem: {
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  itemSubtitle: {
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
    gap: Spacing.md,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
