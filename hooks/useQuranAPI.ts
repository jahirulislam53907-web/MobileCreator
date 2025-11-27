import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://192.168.1.100:3000'; // Change to your local IP

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
      
      const response = await fetch(`${API_BASE_URL}/api/quran/surahs`);
      if (!response.ok) throw new Error('Failed to fetch surahs');
      
      const data = await response.json();
      return data.surahs || [];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Fetch surahs error:', message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchSurah = async (surahNumber: number): Promise<QuranSurahData | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/quran/surah/${surahNumber}`);
      if (!response.ok) throw new Error('Failed to fetch surah');
      
      const data = await response.json();
      return data.surah || null;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Fetch surah error:', message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchAyah = async (surah: number, ayah: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/quran/ayah/${surah}/${ayah}`);
      if (!response.ok) throw new Error('Failed to fetch ayah');
      
      const data = await response.json();
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Fetch ayah error:', message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchSurahAyahs = async (surahNumber: number): Promise<QuranAyah[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/quran/surah/${surahNumber}/ayahs`);
      if (!response.ok) throw new Error('Failed to fetch surah ayahs');
      
      const data = await response.json();
      return data.ayahs || [];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Fetch ayahs error:', message);
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
