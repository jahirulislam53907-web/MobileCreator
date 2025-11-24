import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'Server running', timestamp: new Date().toISOString() });
});

// Prayer Times API
app.get('/api/prayer-times', (req: Request, res: Response) => {
  const { latitude, longitude } = req.query;
  // TODO: Implement prayer times calculation
  res.json({ message: 'Prayer times endpoint' });
});

// Quran API
app.get('/api/quran/:surah', (req: Request, res: Response) => {
  const { surah } = req.params;
  res.json({ message: `Quran surah ${surah}` });
});

// Duas API
app.get('/api/duas', (req: Request, res: Response) => {
  res.json({ message: 'Duas list' });
});

// Listen
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
