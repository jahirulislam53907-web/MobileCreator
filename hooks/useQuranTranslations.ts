import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const useQuranTranslations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch translations for specific language (ONLINE)
  const fetchTranslations = async (surahNumber: number, language: string) => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from server
      const response = await fetch(
        `${API_BASE_URL}/api/quran/surah/${surahNumber}/translations/${language}`
      );

      if (!response.ok) throw new Error('Failed to fetch translations');

      const data = await response.json();
      return data.translations || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching translations');
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
      const response = await fetch(
        `${API_BASE_URL}/api/quran/surah/${surahNumber}/translations/${language}`
      );

      if (!response.ok) throw new Error('Failed to download surah');

      const data = await response.json();
      const translations = data.translations || [];

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
