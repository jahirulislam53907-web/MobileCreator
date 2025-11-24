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
`).catch(console.error);

// Prayer Times API
app.get('/api/prayer-times', (req, res) => {
  const { lat, lng } = req.query;
  res.json({ fajr: '04:45 AM', dhuhr: '12:15 PM', asr: '04:30 PM', maghrib: '06:25 PM', isha: '07:45 PM' });
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
