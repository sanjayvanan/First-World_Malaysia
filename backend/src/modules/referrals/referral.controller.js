import { query } from '../../shared/db.js';

// --- 1. Get My Stats (The Progress Bar & Badges) ---
// REFACTORED: Calculates counts dynamically from the 'users' table.
// Efficiency: High (Uses Index 'idx_users_referred_by')
export const getMyStats = async (req, res) => {
  const userId = req.user.id;

  try {
    // 1. Level 1 Count (Direct Referrals)
    // Postgres uses the Index to count this instantly.
    const level1Query = await query(
      `SELECT COUNT(*) FROM users WHERE referred_by_id = $1`, 
      [userId]
    );
    const directCount = parseInt(level1Query.rows[0].count);

    // 2. Level 2 Count (Indirect Referrals)
    // "Count users where their referrer is one of my direct referrals"
    // Postgres uses the Index for both the inner and outer query.
    const level2Query = await query(
      `SELECT COUNT(*) FROM users 
       WHERE referred_by_id IN (
           SELECT id FROM users WHERE referred_by_id = $1
       )`, 
      [userId]
    );
    const level2Count = parseInt(level2Query.rows[0].count);

    // 3. Return Fresh, Accurate Data
    res.json({
      user_id: userId,
      direct_referrals_count: directCount, // Used for Badge
      level_1_count: directCount,          // Used for L1 Card
      level_2_count: level2Count           // Used for L2 Card
    });

  } catch (err) {
    console.error("Stats Error:", err);
    res.status(500).json({ error: 'Server error fetching stats' });
  }
};

// --- 2. Get My Recruits (The Tree View) ---
export const getMyReferrals = async (req, res) => {
  const userId = req.user.id;

  try {
    // Uses Index: idx_users_referred_by
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