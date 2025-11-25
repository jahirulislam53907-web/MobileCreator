import React, { useState } from 'react';
import { View, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '@/hooks/useTranslation';
import { ThemedText } from './ThemedText';
import { Spacing, BorderRadius } from '@/constants/theme';

type LanguageCode = 'bn' | 'en' | 'ur' | 'hi' | 'ar' | 'tr' | 'ms' | 'id' | 'pa' | 'fa';

export interface TopNavigationBarProps {
  activeTab?: 'Home' | 'Prayer' | 'Quran' | 'Dua' | 'More';
}

export const TopNavigationBar: React.FC<TopNavigationBarProps> = ({ activeTab = 'Home' }) => {
  const { theme, isDark } = useAppTheme();
  const navigation = useNavigation<any>();
  const { language, setLanguage, t } = useTranslation();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const languages: { id: LanguageCode; label: string }[] = [
    { id: 'bn', label: t('language.bengali') },
    { id: 'en', label: t('language.english') },
    { id: 'ur', label: t('language.urdu') },
    { id: 'hi', label: t('language.hindi') },
    { id: 'ar', label: t('language.arabic') },
    { id: 'tr', label: t('language.turkish') },
    { id: 'ms', label: t('language.malay') },
    { id: 'id', label: t('language.indonesian') },
    { id: 'pa', label: t('language.punjabi') },
    { id: 'fa', label: t('language.persian') },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot, borderBottomColor: theme.border }]}>
      {/* Left: Hamburger Menu */}
      <Pressable 
        style={styles.hamburger}
        onPress={() => navigation.toggleDrawer()}
      >
        <Feather name="menu" size={24} color={theme.text} />
      </Pressable>

      {/* Logo */}
      <View style={styles.logoSection}>
        <ThemedText style={[styles.logo, { color: theme.primary }]}>{t('home.title')}</ThemedText>
      </View>

      {/* Right: Icons */}
      <View style={styles.iconSection}>
        {/* Language Button */}
        <View style={styles.languageContainer}>
          <Pressable 
            style={styles.languageBtn}
            onPress={() => setShowLanguageMenu(!showLanguageMenu)}
          >
            <Feather name="globe" size={20} color={theme.text} />
            <ThemedText style={styles.languageLabel}>
              {language.toUpperCase()}
            </ThemedText>
          </Pressable>
          
          {/* Language Dropdown Menu */}
          {showLanguageMenu && (
            <View style={[styles.languageMenu, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
              {languages.map((lang) => (
                <Pressable
                  key={lang.id}
                  style={[
                    styles.languageOption,
                    language === lang.id && { backgroundColor: theme.primary }
                  ]}
                  onPress={() => {
                    setLanguage(lang.id);
                    setShowLanguageMenu(false);
                  }}
                >
                  <ThemedText style={[
                    styles.languageOptionLabel,
                    { color: language === lang.id ? theme.backgroundDefault : theme.text }
                  ]}>
                    {lang.label}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <Pressable style={styles.iconBtn}>
          <Feather name="bell" size={20} color={theme.text} />
        </Pressable>
        <Pressable 
          style={styles.iconBtn}
          onPress={() => navigation.navigate('MoreTab')}
        >
          <Feather name="user" size={20} color={theme.text} />
        </Pressable>
        <Pressable 
          style={styles.iconBtn}
          onPress={() => {
            if (navigation.navigate) {
              navigation.navigate('MoreTab', { screen: 'Settings' });
            }
          }}
        >
          <Feather name="settings" size={20} color={theme.text} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  hamburger: {
    padding: Spacing.sm,
    marginRight: Spacing.md,
  },
  logoSection: {
    flex: 1,
  },
  logo: {
    fontSize: 16,
    fontWeight: '700',
  },
  iconSection: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
  iconBtn: {
    padding: Spacing.sm,
  },
  languageContainer: {
    position: 'relative',
  },
  languageBtn: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    padding: Spacing.sm,
  },
  languageLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  languageMenu: {
    position: 'absolute',
    top: 50,
    right: 0,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    minWidth: 120,
    zIndex: 1000,
  },
  languageOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  languageOptionLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
