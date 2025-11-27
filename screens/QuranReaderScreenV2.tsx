import React, { useState, useEffect } from 'react';
import { View, Pressable, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useQuranAPI } from '@/hooks/useQuranAPI';
import { useQuranTranslations } from '@/hooks/useQuranTranslations';
import { useTranslation } from '@/src/contexts/LanguageContext';
import { Spacing } from '@/constants/theme';

interface Props {
  surahNumber?: number;
}

interface LanguageItem {
  code: 'bn' | 'en' | 'ur' | 'hi' | 'tr' | 'id' | 'ms' | 'ps' | 'so';
  name: string;
}

interface LanguageItem {
  code: 'bn' | 'en' | 'ur' | 'hi' | 'tr' | 'id' | 'ms' | 'ps' | 'so';
  name: string;
}

const LANGUAGES: LanguageItem[] = [
  { code: 'bn', name: 'Bengali' },
  { code: 'en', name: 'English' },
  { code: 'ur', name: 'Urdu' },
  { code: 'hi', name: 'Hindi' },
  { code: 'tr', name: 'Turkish' },
  { code: 'id', name: 'Indonesian' },
  { code: 'ms', name: 'Malay' },
  { code: 'ps', name: 'Pashto' },
  { code: 'so', name: 'Somali' }
];

export default function QuranReaderScreenV2({ surahNumber = 1 }: Props) {
  const { theme } = useAppTheme();
  const { fetchSurah } = useQuranAPI();
  const { fetchTranslations, downloadSurah, loading: translationLoading, getDownloadedSurah } = useQuranTranslations();
  const { language, t } = useTranslation();

  const [surahData, setSurahData] = useState<any>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(language);
  const [translations, setTranslations] = useState<any[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [downloading, setDownloading] = useState(false);

  // Update selectedLanguage when app language changes
  useEffect(() => {
    setSelectedLanguage(language);
  }, [language]);

  // Load Arabic
  useEffect(() => {
    const loadArabic = async () => {
      const data = await fetchSurah(surahNumber);
      setSurahData(data);
    };
    loadArabic();
  }, [surahNumber]);

  // Load translations - OFFLINE FIRST, then ONLINE
  useEffect(() => {
    const loadTranslations = async () => {
      if (!surahData) return;

      // 1. Check offline (AsyncStorage)
      const downloadedSurah = await getDownloadedSurah(surahNumber, selectedLanguage);
      if (downloadedSurah?.ayahs) {
        setTranslations(downloadedSurah.ayahs);
        setIsOnline(false);
        return;
      }

      // 2. Try online from server
      const onlineTranslations = await fetchTranslations(surahNumber, selectedLanguage);
      if (onlineTranslations && onlineTranslations.length > 0) {
        setTranslations(onlineTranslations);
        setIsOnline(true);
        return;
      }

      // 3. Fallback to local Arabic only (no translation)
      const arabicOnly = surahData.ayahs?.map((ayah: any) => ({
        number: ayah.number,
        arabic: ayah.arabic
      })) || [];
      setTranslations(arabicOnly);
      setIsOnline(false);
    };

    loadTranslations();
  }, [surahNumber, selectedLanguage, surahData, getDownloadedSurah]);

  const handleDownload = async () => {
    setDownloading(true);
    const result = await downloadSurah(surahNumber, selectedLanguage, surahData?.nameBengali);

    if (result.success) {
      Alert.alert(t('quran.success'), result.message);
    } else {
      Alert.alert(t('quran.error'), result.message);
    }
    setDownloading(false);
  };

  if (!surahData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  const languageName = LANGUAGES.find(l => l.code === selectedLanguage)?.name || 'Bengali';

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Header */}
      <Card style={{ margin: Spacing.md, marginTop: Spacing.lg }}>
        <ThemedText style={{ fontSize: 24, fontWeight: 'bold', marginBottom: Spacing.sm }}>
          {surahData.nameBengali}
        </ThemedText>
        <ThemedText style={{ fontSize: 14, color: theme.textSecondary }}>
          {surahData.numberOfAyahs} আয়াত • {surahData.revelationTypeBengali}
        </ThemedText>
      </Card>

      {/* Language Selector */}
      <Card style={{ marginHorizontal: Spacing.md, marginVertical: Spacing.md }}>
        <ThemedText style={{ fontSize: 14, fontWeight: '600', marginBottom: Spacing.sm }}>
          {t('quran.selectLanguage')}
        </ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {LANGUAGES.map(lang => (
            <Pressable
              key={lang.code}
              onPress={() => setSelectedLanguage(lang.code)}
              style={{
                paddingHorizontal: Spacing.md,
                paddingVertical: Spacing.sm,
                marginRight: Spacing.sm,
                backgroundColor: selectedLanguage === lang.code ? theme.primary : theme.cardBackground,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: selectedLanguage === lang.code ? theme.primary : theme.border
              }}
            >
              <ThemedText
                style={{
                  color: selectedLanguage === lang.code ? theme.buttonText : theme.text,
                  fontSize: 12,
                  fontWeight: '500'
                }}
              >
                {lang.name}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>

        {/* Download Button */}
        <Pressable
          onPress={handleDownload}
          disabled={downloading}
          style={{
            marginTop: Spacing.md,
            paddingVertical: Spacing.md,
            backgroundColor: theme.primary,
            borderRadius: 8,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: downloading ? 0.6 : 1
          }}
        >
          <Feather name="download" size={16} color={theme.buttonText} style={{ marginRight: Spacing.sm }} />
          <ThemedText style={{ color: theme.buttonText, fontWeight: '600' }}>
            {downloading ? 
              t('quran.downloading') : 
              `${languageName} ${t('quran.downloadLanguage')}`}
          </ThemedText>
        </Pressable>

        {!isOnline && (
          <ThemedText style={{ marginTop: Spacing.sm, fontSize: 12, color: '#FF9500' }}>
            {t('quran.offlineMode')}
          </ThemedText>
        )}
      </Card>

      {/* Ayahs with Translations */}
      <View style={{ paddingHorizontal: Spacing.md, paddingBottom: Spacing.lg }}>
        {translationLoading ? (
          <ActivityIndicator size="large" color={theme.primary} />
        ) : (
          translations.length > 0 ? translations.map((translation: any) => (
            <Card key={translation.number} style={{ marginBottom: Spacing.md }}>
              {/* Arabic */}
              <ThemedText style={{ fontSize: 18, lineHeight: 32, marginBottom: Spacing.md, textAlign: 'right' }}>
                {translation.arabic}
              </ThemedText>

              {/* Ayah Number */}
              <View
                style={{
                  paddingHorizontal: Spacing.sm,
                  paddingVertical: 2,
                  backgroundColor: theme.primary,
                  borderRadius: 4,
                  alignSelf: 'flex-start',
                  marginBottom: Spacing.md
                }}
              >
                <ThemedText style={{ color: theme.buttonText, fontSize: 12, fontWeight: '600' }}>
                  آية {translation.number}
                </ThemedText>
              </View>

              {/* Translation */}
              <ThemedText style={{ fontSize: 14, lineHeight: 22, color: theme.textSecondary }}>
                {translation[selectedLanguage] || 'Translation not available'}
              </ThemedText>
            </Card>
          )) : (
            <ThemedText style={{ textAlign: 'center', marginTop: Spacing.lg }}>
              {t('quran.noVerses')}
            </ThemedText>
          )
        )}
      </View>
    </ScrollView>
  );
}
