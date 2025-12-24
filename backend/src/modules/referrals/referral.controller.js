import { query } from '../../shared/db.js';

// --- 1. Get My Stats (The Progress Bar) ---
export const getMyStats = async (req, res) => {
  const userId = req.user.id; // Comes from the middleware

  try {
    // Fetch stats from the specific table we created
    const result = await query(
      `SELECT * FROM referral_stats WHERE user_id = $1`, 
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Stats not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching stats' });
  }
};

// --- 2. Get My Recruits (The Tree View) ---
export const getMyReferrals = async (req, res) => {
  const userId = req.user.id;

  try {
    // Find all users who were referred by ME
    const result = await query(
      `SELECT id, full_name, email, created_at, kyc_status 
       FROM users 
       WHERE referred_by_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json({
      count: result.rows.length,
      referrals: result.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching referrals' });
  }
};