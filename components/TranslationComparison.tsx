import React, { useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Spacing, BorderRadius } from '@/constants/theme';

interface Translation {
  language: string;
  text: string;
  translator?: string;
}

interface TranslationComparisonProps {
  arabic: string;
  translations: Translation[];
  selectedLanguages: string[];
  onLanguageToggle: (language: string) => void;
}

export const TranslationComparison = ({
  arabic,
  translations,
  selectedLanguages,
  onLanguageToggle
}: TranslationComparisonProps) => {
  const { theme } = useAppTheme();
  const [expandedLanguage, setExpandedLanguage] = useState<string | null>(null);

  const availableLanguages = [
    { code: 'bengali', name: 'বাংলা' },
    { code: 'english', name: 'English' },
    { code: 'urdu', name: 'اردو' },
    { code: 'hindi', name: 'हिन्दी' },
    { code: 'turkish', name: 'Türkçe' },
    { code: 'indonesian', name: 'Bahasa Indonesia' }
  ];

  return (
    <View style={styles.container}>
      {/* Arabic (Always shown) */}
      <View style={[styles.translationCard, { borderLeftColor: theme.primary }]}>
        <View style={styles.translationHeader}>
          <ThemedText style={styles.languageLabel}>العربية (Arabic)</ThemedText>
        </View>
        <ThemedText style={[styles.translationText, { textAlign: 'right', fontSize: 18 }]}>
          {arabic}
        </ThemedText>
      </View>

      {/* Language Selector */}
      <View style={styles.languageSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {availableLanguages.map((lang) => (
            <Pressable
              key={lang.code}
              style={[
                styles.langTag,
                selectedLanguages.includes(lang.code) && {
                  backgroundColor: theme.primary
                }
              ]}
              onPress={() => onLanguageToggle(lang.code)}
            >
              <ThemedText
                style={[
                  styles.langTagText,
                  selectedLanguages.includes(lang.code) && { color: 'white' }
                ]}
              >
                {lang.name}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Selected Translations */}
      {selectedLanguages.map((selectedLang) => {
        const translation = translations.find((t) => t.language === selectedLang);
        if (!translation) return null;

        return (
          <Pressable
            key={selectedLang}
            onPress={() =>
              setExpandedLanguage(
                expandedLanguage === selectedLang ? null : selectedLang
              )
            }
          >
            <View
              style={[
                styles.translationCard,
                { borderLeftColor: theme.secondary }
              ]}
            >
              <View style={styles.translationHeader}>
                <ThemedText style={styles.languageLabel}>
                  {selectedLang.toUpperCase()}
                </ThemedText>
                <MaterialIcons
                  name={
                    expandedLanguage === selectedLang
                      ? 'expand-less'
                      : 'expand-more'
                  }
                  size={20}
                  color={theme.textSecondary}
                />
              </View>

              {expandedLanguage === selectedLang && (
                <>
                  <ThemedText style={styles.translationText}>
                    {translation.text}
                  </ThemedText>
                  {translation.translator && (
                    <ThemedText style={styles.translatorName}>
                      — {translation.translator}
                    </ThemedText>
                  )}
                </>
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
    marginVertical: Spacing.lg
  },
  translationCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 4,
    backgroundColor: '#f0f0f0'
  },
  translationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md
  },
  languageLabel: {
    fontSize: 14,
    fontWeight: '700'
  },
  translationText: {
    fontSize: 16,
    lineHeight: 26,
    marginBottom: Spacing.sm
  },
  translatorName: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: Spacing.sm
  },
  languageSelector: {
    marginVertical: Spacing.md
  },
  langTag: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: '#e0e0e0'
  },
  langTagText: {
    fontSize: 12,
    fontWeight: '600'
  }
});
