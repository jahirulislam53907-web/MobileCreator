import React, { useState } from 'react';
import { View, Pressable, StyleSheet, Modal, ScrollView } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useNavigation } from '@react-navigation/native';
import { ThemedText } from './ThemedText';
import { Spacing, BorderRadius } from '@/constants/theme';
import { useTranslation } from '../src/contexts/LanguageContext';

type LanguageCode = 'bn' | 'en' | 'ur' | 'hi' | 'ar' | 'tr' | 'ms' | 'id' | 'pa' | 'fa';

interface Language {
  id: LanguageCode;
  label: string;
  nativeLabel: string;
  flag: string;
}

export interface TopNavigationBarProps {
  activeTab?: 'Home' | 'Prayer' | 'Quran' | 'Dua' | 'More';
}

export const TopNavigationBar: React.FC<TopNavigationBarProps> = ({ activeTab = 'Home' }) => {
  const { theme } = useAppTheme();
  const navigation = useNavigation<any>();
  const { language, setLanguage } = useTranslation();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const languages: Language[] = [
    { id: 'bn', label: 'বাংলা', nativeLabel: 'বাংলা', flag: '🇧🇩' },
    { id: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
    { id: 'ur', label: 'اردو', nativeLabel: 'اردو', flag: '🇵🇰' },
    { id: 'hi', label: 'हिंदी', nativeLabel: 'हिंदी', flag: '🇮🇳' },
    { id: 'ar', label: 'العربية', nativeLabel: 'العربية', flag: '🇸🇦' },
    { id: 'tr', label: 'Türkçe', nativeLabel: 'Türkçe', flag: '🇹🇷' },
    { id: 'ms', label: 'Bahasa Melayu', nativeLabel: 'Bahasa Melayu', flag: '🇲🇾' },
    { id: 'id', label: 'Bahasa Indonesia', nativeLabel: 'Bahasa Indonesia', flag: '🇮🇩' },
    { id: 'pa', label: 'پنجابی', nativeLabel: 'پنجابی', flag: '🇵🇰' },
    { id: 'fa', label: 'فارسی', nativeLabel: 'فارسی', flag: '🇮🇷' },
  ];

  const currentLang = languages.find(l => l.id === language);
  const { setThemeName } = useAppTheme();

  const handleLanguageChange = (lang: LanguageCode) => {
    setLanguage(lang);
    setThemeName(lang as any);
    setShowLanguageMenu(false);
  };

  return (
    <>
      <View style={[styles.container, { backgroundColor: theme.primary, borderBottomColor: theme.border }]}>
        {/* Left: Hamburger Menu */}
        <Pressable 
          style={styles.hamburger}
          onPress={() => navigation.toggleDrawer()}
        >
          <MaterialIcons name="menu" size={24} color={theme.buttonText} />
        </Pressable>

        {/* Logo */}
        <View style={styles.logoSection}>
          <ThemedText style={[styles.logo, { color: theme.buttonText }]}>Smart Muslim</ThemedText>
        </View>

        {/* Right: Icons */}
        <View style={styles.iconSection}>
          {/* Language Button */}
          <Pressable 
            style={styles.languageBtn}
            onPress={() => setShowLanguageMenu(true)}
          >
            <MaterialIcons name="public" size={20} color={theme.buttonText} />
            <ThemedText style={[styles.languageLabel, { color: theme.buttonText }]}>
              {currentLang?.flag} {language.toUpperCase()}
            </ThemedText>
          </Pressable>

          <Pressable style={styles.iconBtn}>
            <MaterialIcons name="notifications" size={20} color={theme.buttonText} />
          </Pressable>
          <Pressable 
            style={styles.iconBtn}
            onPress={() => navigation.navigate('MoreTab')}
          >
            <MaterialIcons name="person" size={20} color={theme.buttonText} />
          </Pressable>
          <Pressable 
            style={styles.iconBtn}
            onPress={() => {
              if (navigation.navigate) {
                navigation.navigate('MoreTab', { screen: 'Settings' });
              }
            }}
          >
            <MaterialIcons name="settings" size={20} color={theme.buttonText} />
          </Pressable>
        </View>
      </View>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLanguageMenu(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowLanguageMenu(false)}
        >
          <View style={[styles.languageModal, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
              <ThemedText style={styles.modalTitle}>ভাষা নির্বাচন করুন</ThemedText>
              <Pressable onPress={() => setShowLanguageMenu(false)}>
                <MaterialIcons name="close" size={24} color={theme.text} />
              </Pressable>
            </View>
            
            <ScrollView style={styles.languageList}>
              {languages.map((lang) => (
                <Pressable
                  key={lang.id}
                  style={[
                    styles.languageOptionItem,
                    language === lang.id && { backgroundColor: theme.primary }
                  ]}
                  onPress={() => handleLanguageChange(lang.id)}
                >
                  <ThemedText style={[
                    styles.languageOptionFlag,
                    { color: language === lang.id ? theme.backgroundDefault : theme.text }
                  ]}>
                    {lang.flag}
                  </ThemedText>
                  <View style={styles.languageOptionText}>
                    <ThemedText style={[
                      styles.languageOptionNative,
                      { color: language === lang.id ? theme.backgroundDefault : theme.text }
                    ]}>
                      {lang.nativeLabel}
                    </ThemedText>
                    <ThemedText style={[
                      styles.languageOptionEnglish,
                      { color: language === lang.id ? theme.backgroundDefault : theme.textSecondary }
                    ]}>
                      {lang.label}
                    </ThemedText>
                  </View>
                  {language === lang.id && (
                    <Feather name="check" size={20} color={theme.backgroundDefault} />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </>
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
    fontSize: 22,
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
  languageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.sm,
  },
  languageLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  languageModal: {
    width: '85%',
    maxHeight: '80%',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    zIndex: 10000,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  languageList: {
    maxHeight: 400,
  },
  languageOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    gap: Spacing.md,
  },
  languageOptionFlag: {
    fontSize: 24,
    minWidth: 40,
    textAlign: 'center',
  },
  languageOptionText: {
    flex: 1,
  },
  languageOptionNative: {
    fontSize: 14,
    fontWeight: '700',
  },
  languageOptionEnglish: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
});
