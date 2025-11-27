import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use Replit's proxy or fallback to localhost for backend
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || (() => {
  // In Replit web preview, use localhost:3000 for backend
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    // If on Replit preview (localhost or replit domain), use localhost:3000
    if (hostname === 'localhost' || hostname.includes('replit')) {
      return `${protocol}//localhost:3000`;
    }
  }
  return 'http://localhost:3000';
})();

export const useQuranTranslations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch translations for specific language (ONLINE)
  const fetchTranslations = async (surahNumber: number, language: string) => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from server
      const url = `${API_BASE_URL}/api/quran/surah/${surahNumber}/translations/${language}`;
      console.log('📡 Fetching translations from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        console.error('❌ Translation fetch failed:', response.status, response.statusText);
        throw new Error(`Failed to fetch translations: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Translations received:', data.totalAyahs, 'ayahs');
      return data.translations || [];
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error fetching translations';
      console.error('🔴 Translation error:', errorMsg);
      setError(errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Download and save translations locally - ONLY selected language + Arabic
  const downloadSurah = async (surahNumber: number, language: string, surahName: string) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch from server
      const url = `${API_BASE_URL}/api/quran/surah/${surahNumber}/translations/${language}`;
      console.log('📥 Downloading surah from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to download surah: ${response.statusText}`);
      }

      const data = await response.json();
      const translations = data.translations || [];
      console.log('✅ Surah downloaded:', translations.length, 'ayahs');

      // Save ONLY selected language translations + arabic to local storage
      const storageKey = `quran_surah_${surahNumber}_${language}`;
      const filteredData = {
        number: surahNumber,
        ayahs: translations
      };
      
      await AsyncStorage.setItem(storageKey, JSON.stringify(filteredData));

      return {
        success: true,
        message: `${surahName} downloaded successfully`,
        surah: filteredData
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Download failed';
      setError(message);
      return { success: false, message, error };
    } finally {
      setLoading(false);
    }
  };

  // Get downloaded translations from local storage
  const getDownloadedSurah = async (surahNumber: number, language: string) => {
    try {
      const storageKey = `quran_surah_${surahNumber}_${language}`;
      const data = await AsyncStorage.getItem(storageKey);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      return null;
    }
  };

  // Get list of downloaded surahs
  const getDownloadedList = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const downloadedKeys = keys.filter(k => k.startsWith('quran_surah_'));
      return downloadedKeys.map(k => {
        const parts = k.split('_');
        return {
          surahNumber: parseInt(parts[2]),
          language: parts[3]
        };
      });
    } catch (err) {
      return [];
    }
  };

  return {
    loading,
    error,
    fetchTranslations,
    downloadSurah,
    getDownloadedSurah,
    getDownloadedList
  };
};
