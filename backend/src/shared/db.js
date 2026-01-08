import pg from 'pg';
import dotenv from 'dotenv';
import { URL } from 'url';

dotenv.config();

const { Pool } = pg;

const getDbConfig = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is missing from .env');
  }

  const params = new URL(process.env.DATABASE_URL);

  return {
    user: params.username,
    password: params.password,
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: {
      rejectUnauthorized: false
    },
    // --- STABILITY SETTINGS (TUNED) ---
    max: 10,                 // Keep this low for free tier
    idleTimeoutMillis: 30000, // Keep this to prevent "reset by peer" errors
    connectionTimeoutMillis: 10000, // CHANGED: Increased to 10s to allow "Cold Starts"
  };
};

export const pool = new Pool(getDbConfig());

// Prevent crashes on unexpected disconnects
pool.on('error', (err, client) => {
  console.error('Silenced a DB connection error:', err);
});

// Test connection
pool.query('SELECT NOW()')
  .then((res) => console.log(`✅ DB Connected! Time: ${res.rows[0].now}`))
  .catch(err => {
    console.error('❌ DB Connection Failed:', err);
  });

export const query = (text, params) => pool.query(text, params);