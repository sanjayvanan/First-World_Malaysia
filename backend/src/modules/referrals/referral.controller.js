import { query } from '../../shared/db.js';

// --- 1. Get My Stats (Instant Read) ---
export const getMyStats = async (req, res) => {
  const userId = req.user.id;

  try {
    // FAST: Just read the columns we created in 'users'
    const result = await query(
      `SELECT direct_referrals_count, level_1_count, level_2_count, current_tier 
       FROM users 
       WHERE id = $1`, 
      [userId]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];

    res.json({
      user_id: userId,
      direct_referrals_count: user.direct_referrals_count,
      // Map your DB columns to whatever your Frontend expects:
      level_1_count: user.level_1_count, 
      level_2_count: user.level_2_count,
      current_tier: user.current_tier
    });

  } catch (err) {
    console.error("Stats Error:", err);
    res.status(500).json({ error: 'Server error fetching stats' });
  }
};

// --- 2. Get My Recruits (Tree View) ---
// (This one is fine, just ensures it queries 'users' which it already did)
export const getMyReferrals = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await query(
      `SELECT id, full_name, email, created_at, kyc_status, current_tier 
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