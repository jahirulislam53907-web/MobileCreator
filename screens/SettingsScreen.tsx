import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Switch, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { HeaderNav } from '@/components/HeaderNav';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { type ThemeName } from '@/constants/theme';

interface SettingItem {
  icon: string;
  label: string;
  subtitle?: string;
  hasToggle?: boolean;
  value?: boolean;
  onChange?: (val: boolean) => void;
  action?: () => void;
}

const THEME_OPTIONS: { name: ThemeName; bengali: string; color: string }[] = [
  { name: 'teal', bengali: 'টিল (ডিফল্ট)', color: '#1a5e63' },
  { name: 'blue', bengali: 'নীল', color: '#0066cc' },
  { name: 'purple', bengali: 'বেগুনি', color: '#7c3aed' },
  { name: 'green', bengali: 'সবুজ', color: '#059669' },
  { name: 'orange', bengali: 'কমলা', color: '#ea580c' },
];

export default function SettingsScreen() {
  const { theme, themeName, setThemeName } = useAppTheme();
  const [notifications, setNotifications] = useState(true);
  const [prayerReminder, setPrayerReminder] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [showThemes, setShowThemes] = useState(false);

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
        { icon: 'palette', label: 'অ্যাপ থিম', subtitle: `বর্তমান: ${THEME_OPTIONS.find(t => t.name === themeName)?.bengali || 'টিল'}` } as SettingItem,
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
    <View style={{ flex: 1 }}>
      <HeaderNav />
      <ScreenScrollView>
      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* Settings Sections */}
        {SETTINGS_SECTIONS.map((section, sectionIdx) => (
          <View key={sectionIdx} style={styles.sectionWrapper}>
            {/* Section Header */}
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconBg, { backgroundColor: theme.primary + '20' }]}>
                <Feather name={section.icon as any} size={16} color={theme.primary} />
              </View>
              <ThemedText style={[styles.sectionTitle, { color: theme.primary }]}>{section.title}</ThemedText>
            </View>

            {/* Section Items */}
            {section.items.map((item, itemIdx) => (
              <Pressable
                key={itemIdx}
                onPress={() => item.icon === 'palette' && setShowThemes(!showThemes)}
                style={{ marginBottom: Spacing.md }}
              >
                <Card style={[styles.settingCard, { backgroundColor: theme.backgroundSecondary, ...Shadows.sm }]}>
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
                      <Feather
                        name={item.icon === 'palette' ? (showThemes ? 'chevron-up' : 'chevron-down') : 'chevron-right'}
                        size={20}
                        color={theme.textSecondary}
                      />
                    )}
                  </View>
                </Card>
              </Pressable>
            ))}

            {/* Theme Selector */}
            {section.title === 'প্রদর্শন' && showThemes && (
              <View style={styles.themeGrid}>
                {THEME_OPTIONS.map((themeOpt) => (
                  <Pressable
                    key={themeOpt.name}
                    onPress={() => {
                      setThemeName(themeOpt.name);
                      setShowThemes(false);
                    }}
                    style={[
                      styles.themeOption,
                      {
                        borderColor: themeName === themeOpt.name ? themeOpt.color : theme.border,
                        borderWidth: themeName === themeOpt.name ? 3 : 1,
                        backgroundColor: themeOpt.color + '15',
                      }
                    ]}
                  >
                    <View style={[styles.themeDot, { backgroundColor: themeOpt.color }]} />
                    <ThemedText style={[styles.themeText, { color: theme.text }]}>{themeOpt.bengali}</ThemedText>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        ))}

        {/* Logout Button */}
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
      </View>
      </ScreenScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  sectionWrapper: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionIconBg: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  settingCard: {
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
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
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  themeOption: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  themeDot: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
  },
  themeText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
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
