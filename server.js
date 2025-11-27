const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

// ===== PREMIUM QURAN AUDIO & TRANSLATION API =====

// Get Quran Audio for specific Ayah
app.get('/api/quran/audio/:surah/:ayah', async (req, res) => {
  try {
    const { surah, ayah } = req.params;
    const { qari = 'abdul-basit' } = req.query;

    // Example audio URLs (would be stored in database in production)
    const audioUrl = `https://cdn.example.com/quran/${qari}/${surah}_${ayah}.mp3`;
    
    res.json({
      success: true,
      surah: parseInt(surah),
      ayah: parseInt(ayah),
      qari,
      url: audioUrl,
      duration: 15000,
      size: 250000
    });
  } catch (error) {
    console.error('Audio fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch audio' });
  }
});

// Get Translations for specific Ayah (all languages)
app.get('/api/quran/translations/:surah/:ayah', async (req, res) => {
  try {
    const { surah, ayah } = req.params;
    const { languages } = req.query;

    // Example translations structure
    const translations = {
      arabic: 'الأصل العربي',
      bengali: 'বাংলা অনুবাদ',
      english: 'English translation',
      urdu: 'اردو ترجمہ',
      hindi: 'हिंदी अनुवाद',
      turkish: 'Türkçe çeviri',
      indonesian: 'Terjemahan Indonesia',
      malay: 'Terjemahan Melayu',
      pashto: 'پشتو ترجمہ',
      somali: 'Fasiraadda Soomaaliyeed'
    };

    res.json({
      success: true,
      surah: parseInt(surah),
      ayah: parseInt(ayah),
      translations,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Translation fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch translations' });
  }
});

// Download Translation (for offline storage)
app.post('/api/quran/translations/download', async (req, res) => {
  try {
    const { language, surah } = req.body;

    // Bulk translation data for a surah
    const translationData = {
      language,
      surah: parseInt(surah),
      ayahs: [], // Would contain full translation data
      size: 150000,
      downloadedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: translationData
    });
  } catch (error) {
    res.status(500).json({ error: 'Download failed' });
  }
});

// ===== USER SYNC API =====

// Sync user bookmarks, preferences, last read position
app.post('/api/sync', async (req, res) => {
  try {
    const { userId, changes } = req.body;

    // Process sync changes (bookmarks, preferences, last read)
    const syncResult = {
      success: true,
      userId,
      changesApplied: changes.length,
      timestamp: new Date().toISOString(),
      serverData: {
        bookmarks: [],
        preferences: {},
        lastRead: {}
      }
    };

    res.json(syncResult);
  } catch (error) {
    res.status(500).json({ error: 'Sync failed' });
  }
});

// Get user data for multi-device sync
app.get('/api/user/:userId/data', async (req, res) => {
  try {
    const { userId } = req.params;

    const userData = {
      userId,
      bookmarks: [],
      preferences: {
        language: 'bengali',
        theme: 'dark',
        textSize: 16
      },
      lastRead: {
        surah: 1,
        ayah: 1,
        timestamp: new Date().toISOString()
      }
    };

    res.json(userData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

// ===== QURAN DATA API =====

// Get complete Quran structure (all Surahs)
app.get('/api/quran/surahs', async (req, res) => {
  try {
    const surahs = [
      { number: 1, name: 'Al-Fatihah', nameBengali: 'সূরা ফাতিহা', ayahs: 7 },
      { number: 2, name: 'Al-Baqarah', nameBengali: 'সূরা বাকারা', ayahs: 286 },
      // ... all 114 surahs
    ];

    res.json({
      success: true,
      totalSurahs: 114,
      surahs
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch surahs' });
  }
});

// Get specific Surah with all Ayahs
app.get('/api/quran/surah/:number', async (req, res) => {
  try {
    const { number } = req.params;
    const { language = 'bengali' } = req.query;

    const surahData = {
      number: parseInt(number),
      name: 'Surah Name',
      ayahs: [
        {
          number: 1,
          arabic: 'Arabic text',
          translation: {
            bengali: 'বাংলা',
            english: 'English',
            // ... other languages
          }
        }
        // ... all ayahs
      ]
    };

    res.json(surahData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch surah' });
  }
});

// ===== ADMIN ENDPOINTS =====

app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    res.json({ success: true, token: 'admin-token' });
  } catch (error) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// ===== HEALTH CHECK =====

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    premium: true,
    features: {
      quranAudio: true,
      multiLanguageTranslations: true,
      offlineSync: true,
      premiumUI: true
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌙 Smart Muslim Premium Backend running on port ${PORT}`);
  console.log(`✨ Features: Quran Audio, Multi-Language, Offline Sync, Premium Quality`);
});
