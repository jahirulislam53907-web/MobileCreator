const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();

// ============ CORS SETUP - সব requests allow করবে ============
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
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('🔴 DB Error:', err.message);
});

// ============ LOAD QURAN DATA ============
let QURAN_DATA = {
  totalSurahs: 114,
  surahs: []
};

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
    const dbTest = await pool.query('SELECT NOW()');
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: 'Connected',
      quranDataLoaded: QURAN_DATA.totalSurahs > 0,
      totalSurahs: QURAN_DATA.totalSurahs
    });
  } catch (error) {
    res.json({
      status: 'Partial',
      timestamp: new Date().toISOString(),
      database: 'Disconnected',
      error: error.message,
      quranDataLoaded: QURAN_DATA.totalSurahs > 0
    });
  }
});

// ============ QURAN API ENDPOINTS ============

// Get all Surahs list
app.get('/api/quran/surahs', (req, res) => {
  try {
    const surahsOverview = QURAN_DATA.surahs?.map(s => ({
      number: s.number,
      name: s.name,
      nameBengali: s.nameBengali,
      numberOfAyahs: s.numberOfAyahs,
      revelationType: s.revelationType,
      revelationTypeBengali: s.revelationTypeBengali
    })) || [];

    res.json({
      success: true,
      totalSurahs: QURAN_DATA.totalSurahs || 114,
      surahs: surahsOverview,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get specific Surah
app.get('/api/quran/surah/:number', (req, res) => {
  try {
    const { number } = req.params;
    const surahNumber = parseInt(number);

    const surah = QURAN_DATA.surahs?.find(s => s.number === surahNumber);
    
    if (!surah) {
      return res.status(404).json({ 
        success: false,
        error: 'Surah not found',
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      surah: {
        number: surah.number,
        name: surah.name,
        nameBengali: surah.nameBengali,
        numberOfAyahs: surah.numberOfAyahs,
        revelationType: surah.revelationType,
        revelationTypeBengali: surah.revelationTypeBengali,
        ayahs: surah.ayahs || []
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get specific Ayah
app.get('/api/quran/ayah/:surah/:ayah', (req, res) => {
  try {
    const { surah, ayah } = req.params;
    const surahNumber = parseInt(surah);
    const ayahNumber = parseInt(ayah);

    const surahData = QURAN_DATA.surahs?.find(s => s.number === surahNumber);
    if (!surahData) {
      return res.status(404).json({ 
        success: false,
        error: 'Surah not found',
        timestamp: new Date().toISOString()
      });
    }

    const ayahData = surahData.ayahs?.find(a => a.number === ayahNumber);
    if (!ayahData) {
      return res.status(404).json({ 
        success: false,
        error: 'Ayah not found',
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      surah: surahNumber,
      ayah: ayahNumber,
      arabic: ayahData.arabic,
      bengali: ayahData.bengali,
      translations: ayahData.translations || {},
      audioUrls: ayahData.audioUrls || {},
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get all Ayahs for a Surah
app.get('/api/quran/surah/:surah/ayahs', (req, res) => {
  try {
    const { surah } = req.params;
    const surahNumber = parseInt(surah);

    const surahData = QURAN_DATA.surahs?.find(s => s.number === surahNumber);
    if (!surahData) {
      return res.status(404).json({ 
        success: false,
        error: 'Surah not found',
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      surah: surahNumber,
      ayahs: surahData.ayahs || [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// ============ USER BOOKMARKS (Database) ============

app.get('/api/bookmarks/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM user_bookmarks WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json({
      success: true,
      bookmarks: result.rows,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.post('/api/bookmarks', async (req, res) => {
  try {
    const { userId, surahNumber, ayahNumber, notes } = req.body;

    const result = await pool.query(
      `INSERT INTO user_bookmarks (user_id, surah_number, ayah_number, notes, created_at)
       VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
      [userId, surahNumber, ayahNumber, notes || null]
    );

    res.json({
      success: true,
      bookmark: result.rows[0],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// ============ SYNC ENDPOINT ============

app.post('/api/sync', (req, res) => {
  try {
    const { userId, changes } = req.body;

    res.json({
      success: true,
      userId,
      changesApplied: changes?.length || 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// ============ ERROR HANDLING ============

app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    timestamp: new Date().toISOString()
  });
});

// ============ START SERVER ============

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log('\n🌙 ═════════════════════════════════════════');
  console.log('  Smart Muslim Premium Backend');
  console.log('  Running on: http://0.0.0.0:' + PORT);
  console.log('  Environment: ' + process.env.NODE_ENV || 'development');
  console.log('  Database: PostgreSQL');
  console.log('  Quran Data: ' + QURAN_DATA.totalSurahs + ' Surahs loaded');
  console.log('  CORS: Enabled for all origins');
  console.log('  ✅ Ready for requests');
  console.log('═════════════════════════════════════════\n');
});

process.on('SIGINT', () => {
  console.log('\n🛑 Server shutting down...');
  server.close(() => {
    pool.end();
    console.log('✅ Server stopped');
    process.exit(0);
  });
});

module.exports = app;
