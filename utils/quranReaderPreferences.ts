import AsyncStorage from '@react-native-async-storage/async-storage';

export interface QuranPreferences {
  textSize: number;
  lastSurahNumber: number;
  lastAyahNumber: number;
  bookmarks: Array<{ surahNumber: number; ayahNumber: number }>;
  displayMode: 'arabic-only' | 'with-translation' | 'arabic-bengali-split';
}

const STORAGE_KEY = 'QURAN_PREFERENCES';

export const defaultPreferences: QuranPreferences = {
  textSize: 16,
  lastSurahNumber: 1,
  lastAyahNumber: 1,
  bookmarks: [],
  displayMode: 'with-translation',
};

export async function getQuranPreferences(): Promise<QuranPreferences> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      return { ...defaultPreferences, ...JSON.parse(data) };
    }
    return defaultPreferences;
  } catch (error) {
    console.log('Error loading Quran preferences:', error);
    return defaultPreferences;
  }
}

export async function saveQuranPreferences(prefs: QuranPreferences): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch (error) {
    console.log('Error saving Quran preferences:', error);
  }
}

export async function updateLastRead(surahNumber: number, ayahNumber: number): Promise<void> {
  try {
    const prefs = await getQuranPreferences();
    prefs.lastSurahNumber = surahNumber;
    prefs.lastAyahNumber = ayahNumber;
    await saveQuranPreferences(prefs);
  } catch (error) {
    console.log('Error updating last read:', error);
  }
}

export async function addBookmark(surahNumber: number, ayahNumber: number): Promise<void> {
  try {
    const prefs = await getQuranPreferences();
    const exists = prefs.bookmarks.some(b => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber);
    if (!exists) {
      prefs.bookmarks.push({ surahNumber, ayahNumber });
      await saveQuranPreferences(prefs);
    }
  } catch (error) {
    console.log('Error adding bookmark:', error);
  }
}

export async function removeBookmark(surahNumber: number, ayahNumber: number): Promise<void> {
  try {
    const prefs = await getQuranPreferences();
    prefs.bookmarks = prefs.bookmarks.filter(b => !(b.surahNumber === surahNumber && b.ayahNumber === ayahNumber));
    await saveQuranPreferences(prefs);
  } catch (error) {
    console.log('Error removing bookmark:', error);
  }
}

export async function isBookmarked(surahNumber: number, ayahNumber: number): Promise<boolean> {
  try {
    const prefs = await getQuranPreferences();
    return prefs.bookmarks.some(b => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber);
  } catch (error) {
    return false;
  }
}
