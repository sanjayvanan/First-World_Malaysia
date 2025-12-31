import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Helper: Check if the database URL points to a local instance
const isLocal = process.env.DATABASE_URL && (
  process.env.DATABASE_URL.includes('localhost') || 
  process.env.DATABASE_URL.includes('127.0.0.1')
);

// 1. Create the Pool
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  // FIXED: If it's NOT local, we force SSL with rejectUnauthorized: false.
  // This fixes the "EOF detected" error on cloud databases (Render/Neon/AWS).
  ssl: isLocal ? false : { rejectUnauthorized: false } 
});

// --- CRITICAL FIX: Handle idle client errors to prevent crash ---
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  // Do not exit the process; the pool will handle reconnection
});

// 2. Test connection on startup
// We use pool.query here because it automatically releases the client, preventing leaks
pool.query('SELECT NOW()')
  .then(() => console.log(`DB Connected (SSL: ${isLocal ? 'Disabled' : 'Enabled - Insecure Mode'})`))
  .catch(err => {
    console.error('DB Connection Error:', err);
    // Optional: Log if DATABASE_URL is missing
    if (!process.env.DATABASE_URL) console.error('FATAL: DATABASE_URL is missing from .env');
  });

// 3. Export the query helper
export const query = (text, params) => pool.query(text, params);