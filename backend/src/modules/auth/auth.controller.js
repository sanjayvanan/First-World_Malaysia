import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../../shared/db.js';

// Helper: Generate a random code like "MAX-XY12Z"
const generateReferralCode = () => {
  return 'MAX-' + Math.random().toString(36).substring(2, 7).toUpperCase();
};

// --- 1. REGISTER USER ---
// --- 1. REGISTER USER (With Multi-Level Tree Updates) ---
export const register = async (req, res) => {
  const { email, password, fullName, referredByCode } = req.body;

  try {
    // A. Check if user already exists
    const userCheck = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // B. Find the Direct Referrer (if code provided)
    let referrerId = null;
    if (referredByCode) {
      const referrerCheck = await query('SELECT id FROM users WHERE referral_code = $1', [referredByCode]);
      if (referrerCheck.rows.length > 0) {
        referrerId = referrerCheck.rows[0].id;
      } else {
        return res.status(400).json({ error: 'Invalid referral code' });
      }
    }

    // C. Secure Password & Create User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newReferralCode = generateReferralCode();

    const newUser = await query(
      `INSERT INTO users (email, password_hash, full_name, referral_code, referred_by_id) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, email, role, referral_code`,
      [email, hashedPassword, fullName, newReferralCode, referrerId]
    );

    const newUserId = newUser.rows[0].id;

    // D. Initialize New User's Stats
    await query('INSERT INTO referral_stats (user_id) VALUES ($1)', [newUserId]);

    // E. MAGIC: Walk up the tree to update Ancestors
    // Generation 1 = Direct Referrer
    // Generation 2 = "Level 1" in your image
    // Generation 3 = "Level 2" in your image
    
    if (referrerId) {
      let currentAncestorId = referrerId;
      let generation = 1;

      // Loop up to 5 levels deep (prevent infinite loops)
      while (currentAncestorId && generation <= 5) {
        
        // 1. Determine which column to update based on generation
        let columnToUpdate = null;
        if (generation === 1) columnToUpdate = 'direct_referrals_count';
        else if (generation === 2) columnToUpdate = 'level_1_count'; // Image: "Level 1: 100 Members"
        else if (generation === 3) columnToUpdate = 'level_2_count'; // Image: "Level 2: 10,000 Members"
        
        // 2. Update the stats if we have a matching column
        if (columnToUpdate) {
            await query(
                `UPDATE referral_stats SET ${columnToUpdate} = ${columnToUpdate} + 1 WHERE user_id = $1`,
                [currentAncestorId]
            );
        }

        // 3. Move up to the next ancestor (Grandparent)
        // We need to fetch who referred the current ancestor
        const ancestorInfo = await query('SELECT referred_by_id FROM users WHERE id = $1', [currentAncestorId]);
        
        if (ancestorInfo.rows.length > 0) {
            currentAncestorId = ancestorInfo.rows[0].referred_by_id;
            generation++;
        } else {
            break; // No more ancestors (reached the top of the tree)
        }
      }
    }

    res.status(201).json({ 
      message: 'Welcome to Maxso!', 
      user: newUser.rows[0] 
    });

  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// --- 2. LOGIN USER ---
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // A. Find User
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(400).json({ error: 'Invalid email or password' });

    const user = result.rows[0];

    // B. Check Password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

    // C. Generate "Passport" (JWT Token)
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // Token expires in 1 day
    );

    res.json({ 
      message: 'Login successful',
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role, 
        fullName: user.full_name,
        referralCode: user.referral_code
      } 
    });

  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};