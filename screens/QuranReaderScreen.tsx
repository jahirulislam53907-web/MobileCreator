import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable, TextInput, ActivityIndicator } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { ScreenKeyboardAwareScrollView } from "@/components/ScreenKeyboardAwareScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { getQuranPreferences, updateLastRead, addBookmark, removeBookmark, saveQuranPreferences } from "@/utils/quranReaderPreferences";
import { useQuranAPI, QuranSurahData, QuranAyah } from "@/hooks/useQuranAPI";

interface Props {
  surahNumber: number;
}

export default function QuranReaderScreen({ surahNumber }: Props) {
  const { theme } = useAppTheme();
  const { fetchSurah, loading, error } = useQuranAPI();
  
  const [textSize, setTextSize] = useState(16);
  const [displayMode, setDisplayMode] = useState<'arabic-only' | 'with-translation' | 'arabic-bengali-split'>('with-translation');
  const [search, setSearch] = useState("");
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [selectedLanguage, setSelectedLanguage] = useState<string>('bengali');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAyahAudio, setCurrentAyahAudio] = useState<number | null>(null);
  const [surahData, setSurahData] = useState<QuranSurahData | null>(null);
  
  useEffect(() => {
    loadPreferences();
    loadSurahData();
  }, [surahNumber]);

  const loadSurahData = async () => {
    const data = await fetchSurah(surahNumber);
    if (data) {
      setSurahData(data);
    }
  };

  const loadPreferences = async () => {
    const prefs = await getQuranPreferences();
    setTextSize(prefs.textSize);
    setDisplayMode(prefs.displayMode);
    const bookmarkSet = new Set(prefs.bookmarks.map(b => `${b.surahNumber}-${b.ayahNumber}`));
    setBookmarks(bookmarkSet);
  };

  const handleUpdateLastRead = async (ayahNumber: number) => {
    await updateLastRead(surahNumber, ayahNumber);
  };

  const toggleBookmark = async (ayahNumber: number) => {
    const key = `${surahNumber}-${ayahNumber}`;
    if (bookmarks.has(key)) {
      await removeBookmark(surahNumber, ayahNumber);
      bookmarks.delete(key);
    } else {
      await addBookmark(surahNumber, ayahNumber);
      bookmarks.add(key);
    }
    setBookmarks(new Set(bookmarks));
  };

  const changeTextSize = async (newSize: number) => {
    setTextSize(newSize);
    const prefs = await getQuranPreferences();
    prefs.textSize = newSize;
    await saveQuranPreferences(prefs);
  };

  const changeDisplayMode = async (mode: 'arabic-only' | 'with-translation' | 'arabic-bengali-split') => {
    setDisplayMode(mode);
    const prefs = await getQuranPreferences();
    prefs.displayMode = mode;
    await saveQuranPreferences(prefs);
  };

  const ayahs = surahData?.ayahs || [];
  const filteredAyahs = ayahs.filter(ayah =>
    ayah.arabic.toLowerCase().includes(search.toLowerCase()) || 
    ayah.bengali.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && !surahData) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <ThemedText style={styles.loadingText}>সূরা লোড হচ্ছে...</ThemedText>
      </View>
    );
  }

  if (error && !surahData) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.background }]}>
        <ThemedText style={[styles.errorText, { color: 'red' }]}>❌ ত্রুটি: {error}</ThemedText>
        <ThemedText style={styles.errorHint}>ব্যাকএন্ড সার্ভার চেক করুন</ThemedText>
      </View>
    );
  }

  return (
    <ScreenKeyboardAwareScrollView>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <View style={styles.headerContent}>
          <ThemedText style={[styles.surahName, { color: theme.buttonText }]}>
            {surahData?.nameBengali}
          </ThemedText>
          <ThemedText style={[styles.surahInfo, { color: theme.buttonText }]}>
            {surahData?.numberOfAyahs} আয়াত • {surahData?.revelationTypeBengali}
          </ThemedText>
        </View>
      </View>

      {/* Controls Bar */}
      <Card style={[styles.controlsCard, { marginHorizontal: Spacing.md, marginTop: Spacing.md }]}>
        {/* Display Mode Selector */}
        <View style={styles.modeSelector}>
          <Pressable
            style={[styles.modeBtn, displayMode === 'arabic-only' && { backgroundColor: theme.primary }]}
            onPress={() => changeDisplayMode('arabic-only')}
          >
            <ThemedText style={[{ color: displayMode === 'arabic-only' ? theme.buttonText : theme.text, fontSize: 12 }]}>
              আরবি
            </ThemedText>
          </Pressable>
          <Pressable
            style={[styles.modeBtn, displayMode === 'with-translation' && { backgroundColor: theme.primary }]}
            onPress={() => changeDisplayMode('with-translation')}
          >
            <ThemedText style={[{ color: displayMode === 'with-translation' ? theme.buttonText : theme.text, fontSize: 12 }]}>
              অনুবাদ
            </ThemedText>
          </Pressable>
          <Pressable
            style={[styles.modeBtn, displayMode === 'arabic-bengali-split' && { backgroundColor: theme.primary }]}
            onPress={() => changeDisplayMode('arabic-bengali-split')}
          >
            <ThemedText style={[{ color: displayMode === 'arabic-bengali-split' ? theme.buttonText : theme.text, fontSize: 12 }]}>
              বিভাজিত
            </ThemedText>
          </Pressable>
        </View>

        {/* Text Size Controls */}
        <View style={styles.textSizeControl}>
          <Pressable onPress={() => changeTextSize(Math.max(12, textSize - 2))}>
            <MaterialIcons name="remove" size={20} color={theme.primary} />
          </Pressable>
          <ThemedText style={styles.textSizeValue}>{textSize}px</ThemedText>
          <Pressable onPress={() => changeTextSize(Math.min(24, textSize + 2))}>
            <MaterialIcons name="add" size={20} color={theme.primary} />
          </Pressable>
        </View>
      </Card>

      {/* Search Bar */}
      <View style={[styles.searchBox, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border, marginHorizontal: Spacing.md, marginTop: Spacing.md }]}>
        <Feather name="search" size={16} color={theme.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="আয়াত খুঁজুন..."
          placeholderTextColor={theme.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
        {search && (
          <Pressable onPress={() => setSearch("")}>
            <Feather name="x" size={16} color={theme.textSecondary} />
          </Pressable>
        )}
      </View>

      {/* Ayahs List */}
      <View style={styles.ayahsContainer}>
        {filteredAyahs.map((ayah, index) => (
          <Pressable
            key={`${ayah.surahNumber}-${ayah.ayahNumber}`}
            onPress={() => handleUpdateLastRead(ayah.ayahNumber)}
          >
            <Card style={[styles.ayahCard, { borderLeftColor: theme.primary, borderLeftWidth: 3 }]}>
              {/* Ayah Header */}
              <View style={styles.ayahHeader}>
                <View style={[styles.ayahNumber, { backgroundColor: theme.primary + '15' }]}>
                  <ThemedText style={[styles.ayahNumberText, { color: theme.primary }]}>
                    {ayah.ayahNumber}
                  </ThemedText>
                </View>
                <Pressable
                  onPress={() => toggleBookmark(ayah.ayahNumber)}
                  style={{ marginLeft: 'auto' }}
                >
                  <MaterialIcons
                    name={bookmarks.has(`${ayah.surahNumber}-${ayah.ayahNumber}`) ? 'bookmark' : 'bookmark-outline'}
                    size={20}
                    color={bookmarks.has(`${ayah.surahNumber}-${ayah.ayahNumber}`) ? theme.secondary : theme.textSecondary}
                  />
                </Pressable>
              </View>

              {/* Arabic Text */}
              {(displayMode === 'arabic-only' || displayMode === 'with-translation' || displayMode === 'arabic-bengali-split') && (
                <ThemedText style={[styles.arabicText, { fontSize: textSize, color: theme.text, marginTop: Spacing.md }]}>
                  {ayah.arabic}
                </ThemedText>
              )}

              {/* Bengali Translation */}
              {(displayMode === 'with-translation' || displayMode === 'arabic-bengali-split') && (
                <ThemedText style={[styles.bengaliText, { fontSize: textSize - 2, color: theme.textSecondary, marginTop: Spacing.md }]}>
                  {ayah.bengali}
                </ThemedText>
              )}
            </Card>
          </Pressable>
        ))}
      </View>

      <View style={{ height: Spacing.xl }} />
    </ScreenKeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: 16,
    marginTop: Spacing.md,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
  },
  errorHint: {
    fontSize: 12,
    opacity: 0.6,
  },
  header: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  headerContent: {
    alignItems: 'center',
  },
  surahName: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  surahInfo: {
    fontSize: 13,
    fontWeight: '500',
  },
  controlsCard: {
    gap: Spacing.md,
  },
  modeSelector: {
    flexDirection: 'row',
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  modeBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: '#e0e0e0',
  },
  textSizeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  textSizeValue: {
    fontSize: 13,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontSize: 14,
  },
  ayahsContainer: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  ayahCard: {
    padding: Spacing.md,
  },
  ayahHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  ayahNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ayahNumberText: {
    fontSize: 12,
    fontWeight: '700',
  },
  arabicText: {
    fontWeight: '600',
    lineHeight: 28,
    textAlign: 'right',
  },
  bengaliText: {
    lineHeight: 22,
  },
});
