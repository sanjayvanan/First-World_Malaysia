import { query } from '../../shared/db.js';
import jwt from 'jsonwebtoken';



// 1. GET ALL USERS (Paginated + Search)
export const getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const search = req.query.search || '';
  const offset = (page - 1) * limit;

  try {
    let countQuery = 'SELECT COUNT(*) FROM users';
    let countParams = [];

    let dataQuery = `
       SELECT u.id, u.email, u.full_name, u.role, u.kyc_status, u.created_at, u.referral_code, 
              u.assigned_admin_id, a.full_name as assigned_admin_name
       FROM users u
       LEFT JOIN users a ON u.assigned_admin_id = a.id
    `;
    let dataParams = [limit, offset];

    // --- SEARCH LOGIC ---
    if (search) {
        // Filter by Name, Email, or Referral Code
        const whereClause = ` WHERE u.full_name ILIKE $1 OR u.email ILIKE $1 OR u.referral_code ILIKE $1`;
        
        countQuery = `SELECT COUNT(*) FROM users u ${whereClause}`;
        countParams = [`%${search}%`];

        dataQuery += whereClause;
        dataQuery += ` ORDER BY u.created_at DESC LIMIT $2 OFFSET $3`;
        
        // Params: $1=search, $2=limit, $3=offset
        dataParams = [`%${search}%`, limit, offset];
    } else {
        // Standard Query
        dataQuery += ` ORDER BY u.created_at DESC LIMIT $1 OFFSET $2`;
    }

    // 1. Get Total
    const countResult = await query(countQuery, countParams);
    const totalItems = parseInt(countResult.rows[0].count);

    // 2. Get Data
    const result = await query(dataQuery, dataParams);
    
    res.json({
        data: result.rows,
        pagination: {
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: page
        }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// 2. GET ALL ADMINS (For the dropdown list)
export const getAllAdmins = async (req, res) => {
  try {
    const result = await query("SELECT id, full_name FROM users WHERE role = 'ADMIN' OR role = 'SUPERUSER'");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// 3. CHANGE USER ROLE (Promote/Demote)
export const updateUserRole = async (req, res) => {
  const { userId, role } = req.body; 
  try {
    await query('UPDATE users SET role = $1 WHERE id = $2', [role, userId]);
    res.json({ message: `User role updated to ${role}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
};

// 4. ASSIGN USER TO ADMIN (FIXED)
export const assignUserToAdmin = async (req, res) => {
  let { userId, adminId } = req.body;

  // FIX: Handle empty string or "null" string from frontend
  // This prevents the "invalid input syntax for type integer" error
  if (adminId === "" || adminId === "null" || !adminId) {
    adminId = null;
  }

  try {
    await query('UPDATE users SET assigned_admin_id = $1 WHERE id = $2', [adminId, userId]);
    res.json({ message: 'User assigned successfully' });
  } catch (err) {
    console.error("Assign Admin Error:", err);
    res.status(500).json({ error: 'Assignment failed' });
  }
};

// --- 5. DASHBOARD OVERVIEW (Fixed 500 Error) ---
export const getSystemStats = async (req, res) => {
  try {
    // 1. Total Users
    const userCount = await query('SELECT COUNT(*) FROM users');
    
    // 2. Total Referrals (FIXED: Query 'users' table instead of missing 'referral_stats')
    // We count how many users have a 'referred_by_id' (meaning they were referred)
    const referralCount = await query('SELECT COUNT(*) FROM users WHERE referred_by_id IS NOT NULL');
    
    // 3. Pending KYC
    const pendingKycCount = await query("SELECT COUNT(*) FROM users WHERE kyc_status = 'SUBMITTED' OR kyc_status = 'PENDING'");
    
    // 4. Approved KYC
    const approvedKycCount = await query("SELECT COUNT(*) FROM users WHERE kyc_status = 'APPROVED'");

    res.json({
      totalUsers: parseInt(userCount.rows[0].count),
      totalReferrals: parseInt(referralCount.rows[0].count),
      pendingKYC: parseInt(pendingKycCount.rows[0].count),
      approvedKYC: parseInt(approvedKycCount.rows[0].count)
    });
  } catch (err) {
    console.error("Stats Error:", err); // Check your terminal for this if it fails again
    res.status(500).json({ error: 'Server error fetching stats' });
  }
};

// 6. GET AUDIT LOGS
export const getAuditLogs = async (req, res) => {
  try {
    res.json({ logs: [], message: "Audit logging system coming soon" });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
};