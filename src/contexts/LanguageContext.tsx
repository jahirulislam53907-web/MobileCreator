import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LanguageCode = 'bn' | 'en' | 'ur' | 'hi' | 'ar' | 'tr' | 'ms' | 'id' | 'pa' | 'fa';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  bn: require('@/locales/bn.json'),
  en: require('@/locales/en.json'),
  ur: require('@/locales/ur.json'),
  hi: require('@/locales/hi.json'),
  ar: require('@/locales/ar.json'),
  tr: require('@/locales/tr.json'),
  ms: require('@/locales/ms.json'),
  id: require('@/locales/id.json'),
  pa: require('@/locales/pa.json'),
  fa: require('@/locales/fa.json'),
};

const getNestedValue = (obj: any, path: string): string => {
  const keys = path.split('.');
  let value = obj;
  for (const key of keys) {
    value = value?.[key];
  }
  return value || path;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>('bn');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const saved = await AsyncStorage.getItem('app_language');
        if (saved && Object.keys(translations).includes(saved)) {
          setLanguageState(saved as LanguageCode);
        }
      } catch (error) {
        console.error('Failed to load language:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadLanguage();
  }, []);

  const setLanguage = async (lang: LanguageCode) => {
    try {
      await AsyncStorage.setItem('app_language', lang);
      setLanguageState(lang);
    } catch (error) {
      console.error('Failed to save language:', error);
    }
  };

  const t = (key: string): string => {
    const currentTranslations = translations[language];
    return getNestedValue(currentTranslations, key);
  };

  if (!isLoaded) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
