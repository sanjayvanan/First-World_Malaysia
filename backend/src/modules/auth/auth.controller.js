import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../../shared/db.js'; // IMPORT POOL

const generateReferralCode = () => {
  return 'MAX-' + Math.random().toString(36).substring(2, 7).toUpperCase();
};

// --- 1. REGISTER USER (Atomic Transaction) ---
export const register = async (req, res) => {
  const { email, password, fullName, referredByCode } = req.body;
  
  // 1. Get a dedicated client for the transaction
  const client = await pool.connect();

  try {
    // 2. Start Transaction (Nothing is saved until COMMIT)
    await client.query('BEGIN');

    // A. Check for duplicates (Use 'client.query', NOT global 'query')
    const userCheck = await client.query('SELECT 1 FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      throw new Error('User already exists'); // Throws to catch block
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

    // E. Tree Updates (Inside Transaction)
    if (referrerId) {
      let currentAncestorId = referrerId;
      let generation = 1;

      while (currentAncestorId && generation <= 5) {
        // Map generation to column name
        const columnMap = {
            1: 'direct_referrals_count',
            2: 'level_1_count',
            3: 'level_2_count'
        };

        const column = columnMap[generation];

        if (column) {
            await client.query(
                `UPDATE referral_stats SET ${column} = ${column} + 1 WHERE user_id = $1`,
                [currentAncestorId]
            );
        }

        // Move Up Tree
        const ancestorRes = await client.query('SELECT referred_by_id FROM users WHERE id = $1', [currentAncestorId]);
        if (ancestorRes.rows.length > 0) {
            currentAncestorId = ancestorRes.rows[0].referred_by_id;
            generation++;
        } else {
            break;
        }
      }
    }

    // 3. Commit Transaction (Everything is successful, save it!)
    await client.query('COMMIT');

    res.status(201).json({ 
      message: 'Welcome to Maxso!', 
      user: newUser 
    });

  } catch (err) {
    // 4. Rollback (Undo EVERYTHING if any step failed)
    await client.query('ROLLBACK');
    console.error('Register Transaction Failed:', err.message);
    
    const statusCode = err.message === 'User already exists' || err.message === 'Invalid referral code' ? 400 : 500;
    res.status(statusCode).json({ error: err.message });
  } finally {
    // 5. Release Client (Important!)
    client.release();
  }
};

// --- 2. LOGIN USER ---
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Use pool to get a clean client
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    client.release();

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