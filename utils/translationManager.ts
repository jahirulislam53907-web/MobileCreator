import AsyncStorage from '@react-native-async-storage/async-storage';

export type LanguageCode = 'bengali' | 'english' | 'arabic' | 'urdu' | 'hindi' | 'turkish' | 'indonesian' | 'malay' | 'pashto' | 'somali';

export interface Translation {
  surah: number;
  ayah: number;
  language: LanguageCode;
  text: string;
  translatorName: string;
}

export interface DownloadedTranslation {
  language: LanguageCode;
  surah: number;
  isDownloaded: boolean;
  downloadedAt?: string;
  size: number;
}

class TranslationManager {
  private downloadedTranslations: Map<string, DownloadedTranslation> = new Map();
  private translationCache: Map<string, Translation> = new Map();

  async loadDownloadedTranslations(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('downloaded_translations');
      if (stored) {
        const data = JSON.parse(stored);
        this.downloadedTranslations = new Map(data);
      }
    } catch (error) {
      console.error('Error loading downloaded translations:', error);
    }
  }

  async getTranslation(surah: number, ayah: number, language: LanguageCode): Promise<Translation | null> {
    const key = `${surah}_${ayah}_${language}`;

    // Check cache first
    if (this.translationCache.has(key)) {
      return this.translationCache.get(key) || null;
    }

    // Check if available locally
    const dlKey = `${language}_${surah}`;
    if (this.downloadedTranslations.has(dlKey)) {
      try {
        const stored = await AsyncStorage.getItem(`translation_${dlKey}_${ayah}`);
        if (stored) {
          const translation = JSON.parse(stored);
          this.translationCache.set(key, translation);
          return translation;
        }
      } catch (error) {
        console.error('Error loading translation:', error);
      }
    }

    return null;
  }

  async downloadTranslation(language: LanguageCode, surah: number, translationData: Translation[]): Promise<boolean> {
    try {
      const dlKey = `${language}_${surah}`;
      
      for (const translation of translationData) {
        await AsyncStorage.setItem(
          `translation_${dlKey}_${translation.ayah}`,
          JSON.stringify(translation)
        );
      }

      const downloadedTr: DownloadedTranslation = {
        language,
        surah,
        isDownloaded: true,
        downloadedAt: new Date().toISOString(),
        size: JSON.stringify(translationData).length
      };

      this.downloadedTranslations.set(dlKey, downloadedTr);
      await this.saveDownloadedTranslations();

      return true;
    } catch (error) {
      console.error('Error downloading translation:', error);
      return false;
    }
  }

  async deleteDownloadedTranslation(language: LanguageCode, surah: number): Promise<boolean> {
    try {
      const dlKey = `${language}_${surah}`;
      
      const keys = (await AsyncStorage.getAllKeys()).filter(k =>
        k.startsWith(`translation_${dlKey}`)
      );

      for (const key of keys) {
        await AsyncStorage.removeItem(key);
      }

      this.downloadedTranslations.delete(dlKey);
      await this.saveDownloadedTranslations();

      return true;
    } catch (error) {
      console.error('Error deleting translation:', error);
      return false;
    }
  }

  private async saveDownloadedTranslations(): Promise<void> {
    try {
      const data = Array.from(this.downloadedTranslations.entries());
      await AsyncStorage.setItem('downloaded_translations', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving downloaded translations:', error);
    }
  }

  isLanguageDownloaded(language: LanguageCode, surah: number): boolean {
    const key = `${language}_${surah}`;
    return this.downloadedTranslations.has(key) && 
           (this.downloadedTranslations.get(key)?.isDownloaded || false);
  }

  getDownloadedLanguages(): LanguageCode[] {
    const languages = new Set<LanguageCode>();
    this.downloadedTranslations.forEach(dl => {
      if (dl.isDownloaded) languages.add(dl.language);
    });
    return Array.from(languages);
  }
}

export const translationManager = new TranslationManager();
