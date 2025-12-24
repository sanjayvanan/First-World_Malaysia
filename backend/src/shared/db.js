// src/shared/db.js
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// 1. Setup the connection using the link from your .env file
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Supabase
  },
});

// 2. FORCE a connection check immediately
const testConnection = async () => {
  try {
    const client = await pool.connect(); // This forces the connection NOW
    console.log('✅ Database connected successfully to Supabase');
    client.release();
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
  }
};

testConnection();

export const query = (text, params) => pool.query(text, params);