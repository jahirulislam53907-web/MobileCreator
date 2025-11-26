const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(cors());
app.use(express.json());

// Init Database Tables
const initDatabase = async () => {
  try {
    // Prayer times table
    await pool.query(`
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
    `);

    // Admin users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Manual notifications table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS manual_notifications (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER REFERENCES admin_users(id),
        prayer_name VARCHAR(50),
        message TEXT,
        target_users VARCHAR(50),
        status VARCHAR(20) DEFAULT 'pending',
        scheduled_time TIMESTAMP,
        sent_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // User notification preferences table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_notification_prefs (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255),
        prayer_name VARCHAR(50),
        automatic_enabled BOOLEAN DEFAULT true,
        manual_enabled BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, prayer_name)
      );
    `);

    console.log('Database tables initialized');
  } catch (error) {
    console.error('Database init error:', error);
  }
};

initDatabase();

// ===== PRAYER TIMES ENDPOINTS =====

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

// Add/Update prayer times (admin endpoint)
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

// ===== ADMIN AUTH ENDPOINTS =====

// Check if admin exists
app.get('/api/admin/check', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) as count FROM admin_users');
    const count = parseInt(result.rows[0].count, 10);
    res.json({ adminExists: count > 0 });
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ error: 'Check failed' });
  }
});

// Admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const result = await pool.query('SELECT id, username FROM admin_users WHERE username = $1 AND password = crypt($2, password)', [username, password]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const admin = result.rows[0];
    res.json({ success: true, adminId: admin.id, username: admin.username });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Create admin user (first time setup)
app.post('/api/admin/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const result = await pool.query(
      'INSERT INTO admin_users (username, password, email) VALUES ($1, crypt($2, gen_salt(\'bf\')), $3) RETURNING id, username',
      [username, password, email]
    );

    res.json({ success: true, admin: result.rows[0] });
  } catch (error) {
    console.error('Admin register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// ===== MANUAL NOTIFICATION ENDPOINTS =====

// Store pending notifications for delivery
let pendingNotifications = [];

// Send manual notification to all users
app.post('/api/notifications/send', async (req, res) => {
  try {
    const { admin_id, prayer_name, message, target_users } = req.body;
    
    if (!admin_id || !message) {
      return res.status(400).json({ error: 'Admin ID and message required' });
    }

    const notification = {
      id: Math.random().toString(36).substr(2, 9),
      admin_id,
      prayer_name: prayer_name || 'general',
      message,
      target_users: target_users || 'all',
      status: 'sent',
      created_at: new Date().toISOString(),
      timestamp: Date.now()
    };

    // Store in memory for delivery
    pendingNotifications.push(notification);
    
    // Keep only last 100 notifications
    if (pendingNotifications.length > 100) {
      pendingNotifications = pendingNotifications.slice(-100);
    }

    try {
      const result = await pool.query(
        `INSERT INTO manual_notifications (admin_id, prayer_name, message, target_users, status)
         VALUES ($1, $2, $3, $4, 'sent')
         RETURNING id, message`,
        [admin_id, prayer_name || 'general', message, target_users || 'all']
      );
    } catch (dbError) {
      console.log('DB write optional:', dbError.message);
    }

    res.json({ success: true, notification });
  } catch (error) {
    console.error('Notification send error:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Fetch pending notifications for app
app.get('/api/notifications/pending', async (req, res) => {
  try {
    const since = parseInt(req.query.since || '0', 10);
    const newNotifications = pendingNotifications.filter(n => n.timestamp > since);
    res.json({ notifications: newNotifications, timestamp: Date.now() });
  } catch (error) {
    console.error('Fetch pending error:', error);
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

// Get sent notifications history
app.get('/api/notifications/history', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, prayer_name, message, target_users, status, sent_at, created_at 
       FROM manual_notifications 
       ORDER BY created_at DESC 
       LIMIT 50`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// ===== USER NOTIFICATION PREFERENCES =====

// Get user notification preferences
app.get('/api/notifications/preferences/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await pool.query(
      'SELECT prayer_name, automatic_enabled, manual_enabled FROM user_notification_prefs WHERE user_id = $1',
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Preferences error:', error);
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
});

// Update user notification preferences
app.post('/api/notifications/preferences', async (req, res) => {
  try {
    const { user_id, prayer_name, automatic_enabled, manual_enabled } = req.body;
    
    await pool.query(
      `INSERT INTO user_notification_prefs (user_id, prayer_name, automatic_enabled, manual_enabled)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, prayer_name) DO UPDATE SET
       automatic_enabled = $3, manual_enabled = $4`,
      [user_id, prayer_name, automatic_enabled, manual_enabled]
    );

    res.json({ success: true, message: 'Preferences updated' });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
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
