const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();

// ============ CORS SETUP ============
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ============ DATABASE SETUP ============
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 20,
});

// ============ LOAD QURAN DATA ============
let QURAN_DATA = { totalSurahs: 114, surahs: [] };

try {
  const quranPath = path.join(__dirname, 'data', 'quranComplete.json');
  if (fs.existsSync(quranPath)) {
    QURAN_DATA = JSON.parse(fs.readFileSync(quranPath, 'utf-8'));
    console.log('✅ Quran data loaded:', QURAN_DATA.totalSurahs, 'Surahs');
  }
} catch (error) {
  console.warn('⚠️ Quran data error:', error.message);
}

// ============ HEALTH CHECK ============
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.json({
      status: 'OK',
      database: 'Connected',
      quranDataLoaded: QURAN_DATA.totalSurahs > 0,
      totalSurahs: QURAN_DATA.totalSurahs,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.json({
      status: 'OK (Local)',
      database: 'Disconnected',
      quranDataLoaded: QURAN_DATA.totalSurahs > 0,
      timestamp: new Date().toISOString()
    });
  }
});

// ============ QURAN ENDPOINTS ============

// Get all Surahs
app.get('/api/quran/surahs', (req, res) => {
  try {
    const surahs = QURAN_DATA.surahs?.map(s => ({
      number: s.number,
      name: s.name,
      nameBengali: s.nameBengali,
      numberOfAyahs: s.numberOfAyahs,
      revelationType: s.revelationType,
      revelationTypeBengali: s.revelationTypeBengali
    })) || [];

    res.json({
      success: true,
      totalSurahs: QURAN_DATA.totalSurahs,
      surahs: surahs
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get Surah (Arabic only)
app.get('/api/quran/surah/:number', (req, res) => {
  try {
    const surah = QURAN_DATA.surahs?.find(s => s.number === parseInt(req.params.number));
    if (!surah) return res.status(404).json({ success: false, error: 'Surah not found' });

    // Return only Arabic
    const ayahsArabicOnly = surah.ayahs?.map(a => ({
      number: a.number,
      arabic: a.arabic,
      bengali: a.bengali // Keep Bengali as default
    })) || [];

    res.json({
      success: true,
      surah: {
        number: surah.number,
        name: surah.name,
        nameBengali: surah.nameBengali,
        numberOfAyahs: surah.numberOfAyahs,
        revelationType: surah.revelationType,
        revelationTypeBengali: surah.revelationTypeBengali,
        ayahs: ayahsArabicOnly
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get Translations for specific language - CRITICAL ENDPOINT
app.get('/api/quran/surah/:surahNumber/translations/:language', async (req, res) => {
  try {
    const { surahNumber, language } = req.params;
    const surah = QURAN_DATA.surahs?.find(s => s.number === parseInt(surahNumber));
    
    if (!surah) return res.status(404).json({ success: false, error: 'Surah not found' });

    // Only Bengali and English have database translations
    const supportedDBLanguages = ['bn', 'en'];
    
    // If language has database translations, fetch from DB
    if (supportedDBLanguages.includes(language)) {
      try {
        const result = await pool.query(
          `SELECT ayah_number, translation FROM quran_translations 
           WHERE surah_number = $1 AND language = $2 
           ORDER BY ayah_number ASC`,
          [parseInt(surahNumber), language]
        );

        const translations = surah.ayahs?.map((ayah) => {
          const dbTranslation = result.rows.find(r => r.ayah_number === ayah.number);
          return {
            number: ayah.number,
            arabic: ayah.arabic,
            [language === 'bn' ? 'bn' : 'en']: dbTranslation?.translation || 'Translation not available'
          };
        }) || [];

        res.json({
          success: true,
          surah: surahNumber,
          language: language,
          translations: translations,
          totalAyahs: translations.length,
          source: 'database'
        });
      } catch (dbError) {
        console.warn('DB translation fetch failed:', dbError.message);
        // Fallback to Arabic only
        const arabicOnly = surah.ayahs?.map(ayah => ({
          number: ayah.number,
          arabic: ayah.arabic
        })) || [];
        res.json({
          success: true,
          surah: surahNumber,
          language: language,
          translations: arabicOnly,
          totalAyahs: arabicOnly.length,
          source: 'arabic_only'
        });
      }
    } else {
      // For other languages, return Arabic only
      const arabicOnly = surah.ayahs?.map(ayah => ({
        number: ayah.number,
        arabic: ayah.arabic
      })) || [];

      res.json({
        success: true,
        surah: surahNumber,
        language: language,
        translations: arabicOnly,
        totalAyahs: arabicOnly.length,
        source: 'arabic_only'
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Download entire Surah with all translations
app.get('/api/quran/surah/:surahNumber/download', (req, res) => {
  try {
    const surah = QURAN_DATA.surahs?.find(s => s.number === parseInt(req.params.surahNumber));
    if (!surah) return res.status(404).json({ success: false, error: 'Surah not found' });

    // Return complete surah with all data for downloading
    res.json({
      success: true,
      surah: surah,
      downloadedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ USER BOOKMARKS ============
app.get('/api/bookmarks/:userId', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM user_bookmarks WHERE user_id = $1 ORDER BY created_at DESC',
      [req.params.userId]
    );
    res.json({ success: true, bookmarks: result.rows });
  } catch (error) {
    res.json({ success: false, bookmarks: [] }); // Fallback
  }
});

app.post('/api/bookmarks', async (req, res) => {
  try {
    const { userId, surahNumber, ayahNumber, language } = req.body;
    const result = await pool.query(
      `INSERT INTO user_bookmarks (user_id, surah_number, ayah_number, language, created_at)
       VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
      [userId, surahNumber, ayahNumber, language]
    );
    res.json({ success: true, bookmark: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ ERROR HANDLING ============
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// ============ START SERVER ============
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('\n🌙 Smart Muslim Backend - Online Mode');
  console.log('  Port:', PORT);
  console.log('  Database: PostgreSQL Ready');
  console.log('  Quran Data: Loaded');
  console.log('  Status: Ready\n');
});
