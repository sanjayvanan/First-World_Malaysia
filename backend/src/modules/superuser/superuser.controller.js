import { query } from '../../shared/db.js';

// --- 1. DASHBOARD OVERVIEW (Big Numbers) ---
export const getSystemStats = async (req, res) => {
  try {
    // Count total users
    const userCount = await query('SELECT COUNT(*) FROM users');
    
    // Count total referrals made
    const referralCount = await query('SELECT SUM(direct_referrals_count) as total FROM referral_stats');
    
    // Count Pending KYC
    const kycCount = await query("SELECT COUNT(*) FROM users WHERE kyc_status = 'PENDING'");

    res.json({
      totalUsers: parseInt(userCount.rows[0].count),
      totalReferrals: parseInt(referralCount.rows[0].total) || 0,
      pendingKYC: parseInt(kycCount.rows[0].count)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// --- 2. LIST ALL USERS (Paginated) ---
export const getAllUsers = async (req, res) => {
  try {
    const result = await query(
      `SELECT id, email, full_name, role, kyc_status, created_at, referral_code 
       FROM users 
       ORDER BY created_at DESC 
       LIMIT 50`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// --- 3. AUDIT LOGS (See what's happening) ---
export const getAuditLogs = async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM superuser_audit_logs ORDER BY created_at DESC LIMIT 20`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};