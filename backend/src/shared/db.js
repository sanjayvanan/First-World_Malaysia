import pg from 'pg';
import dotenv from 'dotenv';
import { URL } from 'url'; // Native Node module to parse URLs

dotenv.config();

const { Pool } = pg;

// Helper: Manually parse the DB URL to ensure our SSL settings aren't overridden
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
    database: params.pathname.split('/')[1], // Remove the leading '/'
    ssl: {
      rejectUnauthorized: false // This effectively solves the SELF_SIGNED_CERT error
    }
  };
};

// 1. Create the Pool using the manual config object
export const pool = new Pool(getDbConfig());

// --- Handle idle client errors ---
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
});

// 2. Test connection on startup
pool.query('SELECT NOW()')
  .then((res) => console.log(`✅ DB Connected! Time: ${res.rows[0].now}`))
  .catch(err => {
    console.error('❌ DB Connection Failed:', err);
  });

// 3. Export the query helper
export const query = (text, params) => pool.query(text, params);