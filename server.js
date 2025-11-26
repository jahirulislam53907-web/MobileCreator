const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(cors());
app.use(express.json());

// Init Database - prayer_times table only
pool.query(`
  CREATE TABLE IF NOT EXISTS prayer_times (
    id SERIAL PRIMARY KEY,
    date DATE UNIQUE,
    fajr VARCHAR(10),
    sunrise VARCHAR(10),
    dhuhr VARCHAR(10),
    asr VARCHAR(10),
    maghrib VARCHAR(10),
    isha VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`).catch(console.error);

// Get prayer times from database
app.get('/api/prayer-times', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT fajr, sunrise, dhuhr, asr, maghrib, isha FROM prayer_times WHERE date = CURRENT_DATE'
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Prayer times not found for today' });
    }
    
    const times = result.rows[0];
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

// Add prayer times (admin endpoint)
app.post('/api/prayer-times', async (req, res) => {
  try {
    const { date, fajr, sunrise, dhuhr, asr, maghrib, isha } = req.body;
    
    await pool.query(`
      INSERT INTO prayer_times (date, fajr, sunrise, dhuhr, asr, maghrib, isha)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (date) DO UPDATE SET 
        fajr=$2, sunrise=$3, dhuhr=$4, asr=$5, maghrib=$6, isha=$7
    `, [date, fajr, sunrise, dhuhr, asr, maghrib, isha]);
    
    res.json({ success: true, message: 'Prayer times saved' });
  } catch (error) {
    console.error('Error saving prayer times:', error);
    res.status(500).json({ error: 'Failed to save prayer times' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Smart Muslim Backend running on port ${PORT}`);
});
