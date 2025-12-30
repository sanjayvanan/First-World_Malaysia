import { query } from '../../shared/db.js';

// 1. GET ALL USERS (Paginated + Search)
export const getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const search = req.query.search || '';
  const offset = (page - 1) * limit;

  try {
    let countQuery = 'SELECT COUNT(*) FROM users';
    let countParams = [];

    // Modified query: simply check if assigned_admin_id is not null to determine if "Shown to Admin"
    let dataQuery = `
       SELECT u.id, u.email, u.full_name, u.role, u.kyc_status, u.created_at, u.referral_code, 
              (u.assigned_admin_id IS NOT NULL) as is_shown_to_admin
       FROM users u
    `;
    let dataParams = [limit, offset];

    // --- SEARCH LOGIC ---
    if (search) {
        const whereClause = ` WHERE u.full_name ILIKE $1 OR u.email ILIKE $1 OR u.referral_code ILIKE $1`;
        
        countQuery = `SELECT COUNT(*) FROM users u ${whereClause}`;
        countParams = [`%${search}%`];

        dataQuery += whereClause;
        dataQuery += ` ORDER BY u.created_at DESC LIMIT $2 OFFSET $3`;
        dataParams = [`%${search}%`, limit, offset];
    } else {
        dataQuery += ` ORDER BY u.created_at DESC LIMIT $1 OFFSET $2`;
    }

    const countResult = await query(countQuery, countParams);
    const totalItems = parseInt(countResult.rows[0].count);

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

// 2. CHANGE USER ROLE (Promote/Demote)
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

// 3. TOGGLE "SHOW TO ADMIN" (Simplified Assignment)
export const assignUserToAdmin = async (req, res) => {
  const { userId, assign } = req.body; // Expects boolean: true = show, false = hide

  try {
    if (assign) {
        // Find the single Admin ID automatically
        const adminRes = await query("SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1");
        
        if (adminRes.rows.length === 0) {
            return res.status(400).json({ error: 'No Admin account found. Please create an Admin first.' });
        }
        
        const adminId = adminRes.rows[0].id;
        await query('UPDATE users SET assigned_admin_id = $1 WHERE id = $2', [adminId, userId]);
        res.json({ message: 'User is now visible to Admin' });
    } else {
        // Remove assignment
        await query('UPDATE users SET assigned_admin_id = NULL WHERE id = $1', [userId]);
        res.json({ message: 'User removed from Admin view' });
    }
  } catch (err) {
    console.error("Assign Admin Error:", err);
    res.status(500).json({ error: 'Assignment failed' });
  }
};

// --- 4. DASHBOARD OVERVIEW ---
export const getSystemStats = async (req, res) => {
  try {
    const userCount = await query('SELECT COUNT(*) FROM users');
    const referralCount = await query('SELECT COUNT(*) FROM users WHERE referred_by_id IS NOT NULL');
    const pendingKycCount = await query("SELECT COUNT(*) FROM users WHERE kyc_status = 'SUBMITTED' OR kyc_status = 'PENDING'");
    const approvedKycCount = await query("SELECT COUNT(*) FROM users WHERE kyc_status = 'APPROVED'");

    res.json({
      totalUsers: parseInt(userCount.rows[0].count),
      totalReferrals: parseInt(referralCount.rows[0].count),
      pendingKYC: parseInt(pendingKycCount.rows[0].count),
      approvedKYC: parseInt(approvedKycCount.rows[0].count)
    });
  } catch (err) {
    console.error("Stats Error:", err);
    res.status(500).json({ error: 'Server error fetching stats' });
  }
};