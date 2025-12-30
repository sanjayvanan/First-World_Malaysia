import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Check if we are in production to enable SSL
const isProduction = process.env.NODE_ENV === 'production';

// 1. Create the Pool
export const pool = new Pool({  
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false 
});

// --- CRITICAL FIX: Handle idle client errors to prevent crash ---
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  // Do not exit the process; the pool will handle reconnection
});

// 2. Test connection on startup
pool.connect()
  .then(() => console.log(`DB Connected (SSL: ${isProduction ? 'Enabled' : 'Disabled'})`))
  .catch(err => console.error('DB Connection Error:', err));

// 3. Export the query helper
export const query = (text, params) => pool.query(text, params);