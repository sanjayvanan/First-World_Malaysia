import { query } from '../../shared/db.js';
import jwt from 'jsonwebtoken';


// 1. GET ALL USERS (With Admin Info)
export const getAllUsers = async (req, res) => {
  try {
    // We LEFT JOIN to get the name of the assigned admin
    const result = await query(
      `SELECT u.id, u.email, u.full_name, u.role, u.kyc_status, u.created_at, u.referral_code, 
              u.assigned_admin_id, a.full_name as assigned_admin_name
       FROM users u
       LEFT JOIN users a ON u.assigned_admin_id = a.id
       ORDER BY u.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// 2. GET ALL ADMINS (For the dropdown list)
export const getAllAdmins = async (req, res) => {
  try {
    const result = await query(
      "SELECT id, full_name FROM users WHERE role = 'ADMIN' OR role = 'SUPERUSER'"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// 3. CHANGE USER ROLE (Promote/Demote)
export const updateUserRole = async (req, res) => {
  const { userId, role } = req.body; // role: 'USER', 'ADMIN', 'SUPERUSER'
  try {
    await query('UPDATE users SET role = $1 WHERE id = $2', [role, userId]);
    res.json({ message: `User role updated to ${role}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
};

// 4. ASSIGN USER TO ADMIN
export const assignUserToAdmin = async (req, res) => {
  const { userId, adminId } = req.body;
  try {
    await query('UPDATE users SET assigned_admin_id = $1 WHERE id = $2', [adminId, userId]);
    res.json({ message: 'User assigned successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Assignment failed' });
  }
};


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


// 5. GET AUDIT LOGS (Placeholder for now)
export const getAuditLogs = async (req, res) => {
  try {
    // For now, return an empty list or static message
    res.json({ logs: [], message: "Audit logging system coming soon" });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
};
