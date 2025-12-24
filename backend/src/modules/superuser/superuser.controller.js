import { query } from '../../shared/db.js';

// --- 1. DASHBOARD OVERVIEW (Big Numbers) ---
export const getSystemStats = async (req, res) => {
  try {
    // 1. Total Users
    const userCount = await query('SELECT COUNT(*) FROM users');
    
    // 2. Total Referrals
    const referralCount = await query('SELECT SUM(direct_referrals_count) as total FROM referral_stats');
    
    // 3. Pending KYC
    const pendingKycCount = await query("SELECT COUNT(*) FROM users WHERE kyc_status = 'SUBMITTED' OR kyc_status = 'PENDING'");
    
    // 4. Approved KYC (NEW!)
    const approvedKycCount = await query("SELECT COUNT(*) FROM users WHERE kyc_status = 'APPROVED'");

    res.json({
      totalUsers: parseInt(userCount.rows[0].count),
      totalReferrals: parseInt(referralCount.rows[0].total) || 0,
      pendingKYC: parseInt(pendingKycCount.rows[0].count),
      approvedKYC: parseInt(approvedKycCount.rows[0].count) // <--- Sending this to frontend
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
      `SELECT id, email, full_name, role, kyc_status, created_at, referral_code, details 
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