// src/shared/db.js
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// 1. Setup the connection
// Recommendation: For production, increase max connections if needed
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Supabase
  },
  max: 20, // Limit pool size to prevent database overload
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// 2. FORCE a connection check immediately
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Database connected successfully to Supabase');
    client.release();
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
  }
};

testConnection();

// EXPORT pool so we can use transactions
export { pool }; 
export const query = (text, params) => pool.query(text, params);