import { useState, useEffect } from 'react';
import localQuranData from '@/data/quranComplete.json';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export interface QuranSurah {
  number: number;
  name: string;
  nameBengali: string;
  numberOfAyahs: number;
  revelationType: string;
  revelationTypeBengali: string;
}

export interface QuranAyah {
  number: number;
  arabic: string;
  bengali: string;
  [key: string]: any;
}

export interface QuranSurahData {
  number: number;
  name: string;
  nameBengali: string;
  numberOfAyahs: number;
  revelationType: string;
  revelationTypeBengali: string;
  ayahs: QuranAyah[];
}

export const useQuranAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSurahs = async (): Promise<QuranSurah[]> => {
    try {
      setLoading(true);
      setError(null);
      
      // Try online first, fallback to local
      try {
        const response = await fetch(`${API_BASE_URL}/api/quran/surahs`);
        if (response.ok) {
          const data = await response.json();
          return data.surahs || [];
        }
      } catch (e) {
        // Fallback to local
      }
      
      // Local fallback
      return (localQuranData as any).surahs?.map((s: any) => ({
        number: s.number,
        name: s.name,
        nameBengali: s.nameBengali,
        numberOfAyahs: s.numberOfAyahs,
        revelationType: s.revelationType,
        revelationTypeBengali: s.revelationTypeBengali
      })) || [];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Using local data';
      console.log('Using local Quran data');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchSurah = async (surahNumber: number): Promise<QuranSurahData | null> => {
    try {
      setLoading(true);
      setError(null);
      
      // Try online first
      try {
        const response = await fetch(`${API_BASE_URL}/api/quran/surah/${surahNumber}`);
        if (response.ok) {
          const data = await response.json();
          return data.surah || null;
        }
      } catch (e) {
        // Fallback to local
      }
      
      // Local fallback
      const surah = (localQuranData as any).surahs?.find((s: any) => s.number === surahNumber);
      if (surah) {
        return {
          number: surah.number,
          name: surah.name,
          nameBengali: surah.nameBengali,
          numberOfAyahs: surah.numberOfAyahs,
          revelationType: surah.revelationType,
          revelationTypeBengali: surah.revelationTypeBengali,
          ayahs: surah.ayahs || []
        };
      }
      return null;
    } catch (err) {
      console.log('Using local Quran data for Surah', surahNumber);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchAyah = async (surah: number, ayah: number) => {
    try {
      setLoading(true);
      setError(null);
      
      // Local data
      const surahData = (localQuranData as any).surahs?.find((s: any) => s.number === surah);
      const ayahData = surahData?.ayahs?.find((a: any) => a.number === ayah);
      
      return ayahData || null;
    } catch (err) {
      console.log('Error fetching ayah');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchSurahAyahs = async (surahNumber: number): Promise<QuranAyah[]> => {
    try {
      setLoading(true);
      setError(null);
      
      // Local data
      const surah = (localQuranData as any).surahs?.find((s: any) => s.number === surahNumber);
      return surah?.ayahs || [];
    } catch (err) {
      console.log('Error fetching ayahs');
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchSurahs,
    fetchSurah,
    fetchAyah,
    fetchSurahAyahs
  };
};
