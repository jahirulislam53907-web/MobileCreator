import * as SQLite from 'expo-sqlite';

export interface PrayerLog {
  id?: number;
  date: string;
  prayer: string;
  completed: boolean;
}

export interface QuranProgress {
  id?: number;
  surahNumber: number;
  ayahNumber: number;
  lastRead: string;
}

export interface UserSettings {
  id?: number;
  key: string;
  value: string;
}

let db: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async (): Promise<void> => {
  try {
    db = await SQLite.openDatabaseAsync('islamic_app.db');
    
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS prayer_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        prayer TEXT NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0,
        UNIQUE(date, prayer)
      );
      
      CREATE TABLE IF NOT EXISTS quran_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        surah_number INTEGER NOT NULL,
        ayah_number INTEGER NOT NULL,
        last_read TEXT NOT NULL,
        UNIQUE(surah_number, ayah_number)
      );
      
      CREATE TABLE IF NOT EXISTS user_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT NOT NULL UNIQUE,
        value TEXT NOT NULL
      );
      
      CREATE INDEX IF NOT EXISTS idx_prayer_logs_date ON prayer_logs(date);
      CREATE INDEX IF NOT EXISTS idx_quran_progress_surah ON quran_progress(surah_number);
    `);
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

export const savePrayerLog = async (date: string, prayer: string, completed: boolean): Promise<void> => {
  if (!db) throw new Error('Database not initialized');
  
  try {
    await db.runAsync(
      `INSERT OR REPLACE INTO prayer_logs (date, prayer, completed) VALUES (?, ?, ?)`,
      [date, prayer, completed ? 1 : 0]
    );
  } catch (error) {
    console.error('Save prayer log error:', error);
    throw error;
  }
};

export const getPrayerLogsForDate = async (date: string): Promise<PrayerLog[]> => {
  if (!db) throw new Error('Database not initialized');
  
  try {
    const result = await db.getAllAsync<PrayerLog>(
      `SELECT * FROM prayer_logs WHERE date = ?`,
      [date]
    );
    
    return result.map((row: any) => ({
      ...row,
      completed: row.completed === 1
    }));
  } catch (error) {
    console.error('Get prayer logs error:', error);
    return [];
  }
};

export const getPrayerStats = async (days: number = 7): Promise<{ total: number; completed: number }> => {
  if (!db) throw new Error('Database not initialized');
  
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];
    
    const result = await db.getFirstAsync<{ total: number; completed: number }>(
      `SELECT COUNT(*) as total, SUM(completed) as completed FROM prayer_logs WHERE date >= ?`,
      [startDateStr]
    );
    
    return result || { total: 0, completed: 0 };
  } catch (error) {
    console.error('Get prayer stats error:', error);
    return { total: 0, completed: 0 };
  }
};

export const saveQuranProgress = async (surahNumber: number, ayahNumber: number): Promise<void> => {
  if (!db) throw new Error('Database not initialized');
  
  try {
    const lastRead = new Date().toISOString();
    await db.runAsync(
      `INSERT OR REPLACE INTO quran_progress (surah_number, ayah_number, last_read) VALUES (?, ?, ?)`,
      [surahNumber, ayahNumber, lastRead]
    );
  } catch (error) {
    console.error('Save Quran progress error:', error);
    throw error;
  }
};

export const getLastReadQuran = async (): Promise<QuranProgress | null> => {
  if (!db) throw new Error('Database not initialized');
  
  try {
    const result = await db.getFirstAsync<QuranProgress>(
      `SELECT * FROM quran_progress ORDER BY last_read DESC LIMIT 1`
    );
    
    return result || null;
  } catch (error) {
    console.error('Get last read Quran error:', error);
    return null;
  }
};

export const saveSetting = async (key: string, value: string): Promise<void> => {
  if (!db) throw new Error('Database not initialized');
  
  try {
    await db.runAsync(
      `INSERT OR REPLACE INTO user_settings (key, value) VALUES (?, ?)`,
      [key, value]
    );
  } catch (error) {
    console.error('Save setting error:', error);
    throw error;
  }
};

export const getSetting = async (key: string): Promise<string | null> => {
  if (!db) throw new Error('Database not initialized');
  
  try {
    const result = await db.getFirstAsync<{ value: string }>(
      `SELECT value FROM user_settings WHERE key = ?`,
      [key]
    );
    
    return result?.value || null;
  } catch (error) {
    console.error('Get setting error:', error);
    return null;
  }
};

export const closeDatabase = async (): Promise<void> => {
  if (db) {
    await db.closeAsync();
    db = null;
  }
};
