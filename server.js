const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(cors());
app.use(express.json());

// Init Database
pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    location VARCHAR(255),
    theme VARCHAR(20) DEFAULT 'light',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS prayer_logs (
    id SERIAL PRIMARY KEY,
    user_id INT,
    prayer_name VARCHAR(50),
    completed BOOLEAN,
    date DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
  
  CREATE TABLE IF NOT EXISTS bookmarks (
    id SERIAL PRIMARY KEY,
    user_id INT,
    surah_id INT,
    ayah_id INT,
    type VARCHAR(50),
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
  
  CREATE TABLE IF NOT EXISTS prayer_times (
    id SERIAL PRIMARY KEY,
    date DATE UNIQUE,
    fajr VARCHAR(10),
    sunrise VARCHAR(10),
    dhuhr VARCHAR(10),
    asr VARCHAR(10),
    maghrib VARCHAR(10),
    isha VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`).catch(console.error);

// Fetch from Aladhan and store in DB
async function fetchAndStorePrayerTimes(latitude = 23.8103, longitude = 90.4125) {
  try {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    
    // Check if today's data already exists
    const existing = await pool.query('SELECT * FROM prayer_times WHERE date = CURRENT_DATE');
    if (existing.rows.length > 0) {
      return existing.rows[0];
    }
    
    // Fetch from Aladhan
    const url = `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${latitude}&longitude=${longitude}&method=2&tune=0,-2,4,5,0`;
    const response = await fetch(url);
    const data = await response.json();
    const timings = data.data.timings;
    
    // Store in DB
    await pool.query(`
      INSERT INTO prayer_times (date, fajr, sunrise, dhuhr, asr, maghrib, isha, latitude, longitude)
      VALUES (CURRENT_DATE, $1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (date) DO UPDATE SET fajr=$1, sunrise=$2, dhuhr=$3, asr=$4, maghrib=$5, isha=$6, updated_at=CURRENT_TIMESTAMP
    `, [timings.Fajr, timings.Sunrise, timings.Dhuhr, timings.Asr, timings.Maghrib, timings.Isha, latitude, longitude]);
    
    return { fajr: timings.Fajr, sunrise: timings.Sunrise, dhuhr: timings.Dhuhr, asr: timings.Asr, maghrib: timings.Maghrib, isha: timings.Isha };
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    return null;
  }
}

// Prayer Times API
app.get('/api/prayer-times', async (req, res) => {
  try {
    const { latitude = 23.8103, longitude = 90.4125 } = req.query;
    
    // First try to get from DB
    let result = await pool.query('SELECT fajr, sunrise, dhuhr, asr, maghrib, isha FROM prayer_times WHERE date = CURRENT_DATE');
    
    // If not in DB, fetch from Aladhan and store
    if (result.rows.length === 0) {
      await fetchAndStorePrayerTimes(latitude, longitude);
      result = await pool.query('SELECT fajr, sunrise, dhuhr, asr, maghrib, isha FROM prayer_times WHERE date = CURRENT_DATE');
    }
    
    const times = result.rows[0] || {};
    res.json({
      fajr: times.fajr,
      sunrise: times.sunrise,
      dhuhr: times.dhuhr,
      asr: times.asr,
      maghrib: times.maghrib,
      isha: times.isha,
      date: new Date().toISOString().split('T')[0]
    });
  } catch (error) {
    console.error('Prayer times error:', error);
    res.status(500).json({ error: 'Failed to fetch prayer times' });
  }
});

// Quran API
app.get('/api/quran/:surah', async (req, res) => {
  const { surah } = req.params;
  res.json({ surah, ayahs: [] });
});

// Duas API
app.get('/api/duas', async (req, res) => {
  res.json({ duas: [] });
});

// User Profile
app.get('/api/user/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]).catch(() => ({ rows: [] }));
  res.json(result.rows[0] || {});
});

// Prayer Log
app.post('/api/prayer-log', async (req, res) => {
  const { user_id, prayer_name, completed } = req.body;
  await pool.query('INSERT INTO prayer_logs (user_id, prayer_name, completed) VALUES ($1, $2, $3)', [user_id, prayer_name, completed]).catch(console.error);
  res.json({ success: true });
});

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Smart Muslim Backend running on port ${PORT}`);
});
