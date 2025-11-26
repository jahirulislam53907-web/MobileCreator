const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(cors());
app.use(express.json());

// In-memory storage for notifications (until persistent DB)
let allNotifications = [];
let permissionMessages = {
  location: 'অবস্থান ব্যবহারের জন্য অনুমতি দিন নামাজের সময় পেতে',
  notification: 'নোটিফিকেশন পাঠাতে অনুমতি দিন',
  calendar: 'ক্যালেন্ডার অ্যাক্সেস করতে অনুমতি দিন'
};

// Init Database Tables
const initDatabase = async () => {
  try {
    // All notifications table (unified)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS all_notifications (
        id SERIAL PRIMARY KEY,
        notification_id VARCHAR(50) UNIQUE,
        admin_id VARCHAR(100),
        type VARCHAR(50),
        prayer_name VARCHAR(50),
        message TEXT,
        delivery_mode VARCHAR(50),
        target_platform VARCHAR(50),
        status VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        scheduled_for TIMESTAMP,
        delivered_at TIMESTAMP
      );
    `);

    // Permission messages table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS permission_messages (
        id SERIAL PRIMARY KEY,
        key VARCHAR(100) UNIQUE,
        message_bn TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP
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

    console.log('Database tables initialized');
  } catch (error) {
    console.error('Database init error:', error);
  }
};

initDatabase();

// ===== ADMIN AUTH ENDPOINTS =====

app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await pool.query(
      'SELECT id, username FROM admin_users WHERE username = $1 AND password = $2',
      [username, password]
    );
    
    if (result.rows.length > 0) {
      res.json({ success: true, admin: result.rows[0] });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/admin/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    try {
      const result = await pool.query(
        'INSERT INTO admin_users (username, password) VALUES ($1, $2) RETURNING id, username',
        [username, password]
      );
      res.json({ success: true, admin: result.rows[0] });
    } catch (dbError) {
      if (dbError.message.includes('duplicate')) {
        res.status(400).json({ error: 'Username already exists' });
      } else {
        throw dbError;
      }
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// ===== UNIFIED NOTIFICATION ENDPOINTS =====

// Get all notifications (for dashboard)
app.get('/api/notifications/all', async (req, res) => {
  try {
    const notifs = allNotifications.sort((a, b) => b.created_at - a.created_at);
    res.json({ notifications: notifs });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

// Create new notification (CRUD: Create)
app.post('/api/notifications/create', async (req, res) => {
  try {
    const { admin_id, type, prayer_name, message, delivery_mode, target_platform } = req.body;
    
    const notification = {
      id: Math.random().toString(36).substr(2, 9),
      admin_id,
      type: type || 'custom',
      prayer_name: prayer_name || null,
      message,
      delivery_mode: delivery_mode || 'immediate',
      target_platform: target_platform || 'all',
      status: 'pending',
      created_at: Date.now(),
      timestamp: Date.now()
    };

    allNotifications.push(notification);
    
    try {
      await pool.query(
        `INSERT INTO all_notifications (notification_id, admin_id, type, prayer_name, message, delivery_mode, target_platform, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
        [notification.id, admin_id, type, prayer_name, message, delivery_mode, target_platform]
      );
    } catch (dbError) {
      console.log('DB optional:', dbError.message);
    }

    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create' });
  }
});

// Update notification (CRUD: Update)
app.put('/api/notifications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { message, delivery_mode, target_platform, prayer_name } = req.body;
    
    const idx = allNotifications.findIndex(n => n.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Not found' });
    }

    allNotifications[idx] = {
      ...allNotifications[idx],
      message: message || allNotifications[idx].message,
      delivery_mode: delivery_mode || allNotifications[idx].delivery_mode,
      target_platform: target_platform || allNotifications[idx].target_platform,
      prayer_name: prayer_name !== undefined ? prayer_name : allNotifications[idx].prayer_name
    };

    res.json({ success: true, notification: allNotifications[idx] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update' });
  }
});

// Delete notification (CRUD: Delete)
app.delete('/api/notifications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    allNotifications = allNotifications.filter(n => n.id !== id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

// Send notification immediately to all devices
app.post('/api/notifications/send-now', async (req, res) => {
  try {
    const { notification_id, message, target_platform } = req.body;
    
    const notification = allNotifications.find(n => n.id === notification_id);
    if (notification) {
      notification.status = 'sent';
      notification.delivered_at = Date.now();
    }

    res.json({ success: true, message: 'Notification queued for delivery' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send' });
  }
});

// Fetch pending notifications for app polling
app.get('/api/notifications/pending', async (req, res) => {
  try {
    const since = parseInt(req.query.since || '0', 10);
    const pending = allNotifications.filter(n => 
      n.timestamp > since && 
      (n.delivery_mode === 'immediate' || n.status === 'sent')
    );
    
    res.json({ notifications: pending, timestamp: Date.now() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

// ===== PERMISSION MESSAGES ENDPOINTS =====

// Get all permission messages
app.get('/api/permissions/messages', async (req, res) => {
  try {
    res.json({ messages: permissionMessages });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

// Update permission message
app.put('/api/permissions/messages/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const { message } = req.body;
    
    if (permissionMessages.hasOwnProperty(key)) {
      permissionMessages[key] = message;
      res.json({ success: true, messages: permissionMessages });
    } else {
      res.status(404).json({ error: 'Key not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update' });
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
