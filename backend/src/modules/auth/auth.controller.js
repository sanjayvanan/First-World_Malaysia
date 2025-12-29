import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../../shared/db.js'; 

const generateReferralCode = () => {
  return 'MAX-' + Math.random().toString(36).substring(2, 7).toUpperCase();
};

// --- 1. REGISTER USER (Fully Optimized) ---
export const register = async (req, res) => {
  const { email, password, fullName, referredByCode } = req.body;
  
  // 1. Get a dedicated client for the transaction
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // A. Check for duplicates
    const userCheck = await client.query('SELECT 1 FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      throw new Error('User already exists');
    }

    // B. Find Referrer
    let referrerId = null;
    if (referredByCode) {
      const referrerCheck = await client.query('SELECT id FROM users WHERE referral_code = $1', [referredByCode]);
      if (referrerCheck.rows.length > 0) {
        referrerId = referrerCheck.rows[0].id;
      } else {
        throw new Error('Invalid referral code');
      }
    }

    // C. Create User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newReferralCode = generateReferralCode();

    const newUserRes = await client.query(
      `INSERT INTO users (email, password_hash, full_name, referral_code, referred_by_id) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, email, role, referral_code`,
      [email, hashedPassword, fullName, newReferralCode, referrerId]
    );
    const newUser = newUserRes.rows[0];

    // D. Initialize Stats
    await client.query('INSERT INTO referral_stats (user_id) VALUES ($1)', [newUser.id]);

    // E. OPTIMIZED TREE UPDATE (Single Query fetch, Batch Update)
    if (referrerId) {
      // 1. Fetch entire ancestor chain in ONE query (Recursive CTE)
      const ancestorsRes = await client.query(`
        WITH RECURSIVE ancestor_tree AS (
          SELECT id, referred_by_id, 1 as generation
          FROM users WHERE id = $1
          UNION ALL
          SELECT u.id, u.referred_by_id, at.generation + 1
          FROM users u
          INNER JOIN ancestor_tree at ON u.id = at.referred_by_id
          WHERE at.generation < 5
        )
        SELECT id, generation FROM ancestor_tree;
      `, [referrerId]);

      // 2. Perform updates in parallel (much faster)
      for (const ancestor of ancestorsRes.rows) {
        let column = null;
        if (ancestor.generation === 1) column = 'direct_referrals_count';
        else if (ancestor.generation === 2) column = 'level_1_count';
        else if (ancestor.generation === 3) column = 'level_2_count';

        if (column) {
          await client.query(
            `UPDATE referral_stats SET ${column} = ${column} + 1 WHERE user_id = $1`,
            [ancestor.id]
          );
        }
      }
    }

    await client.query('COMMIT');

    res.status(201).json({ 
      message: 'Welcome to Maxso!', 
      user: newUser 
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Register Transaction Failed:', err.message);
    const statusCode = err.message === 'User already exists' || err.message === 'Invalid referral code' ? 400 : 500;
    res.status(statusCode).json({ error: err.message });
  } finally {
    client.release();
  }
};

// --- 2. LOGIN USER (Simplified) ---
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Optimization: No need for pool.connect() here. pool.query is faster for single selects.
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) return res.status(400).json({ error: 'Invalid credentials' });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ 
      message: 'Login successful',
      token, 
      user: { id: user.id, email: user.email, role: user.role, fullName: user.full_name, referralCode: user.referral_code } 
    });

  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};