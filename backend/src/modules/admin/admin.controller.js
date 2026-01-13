import { query } from '../../shared/db.js';

// --- UPDATED: Get Stats for ALL Assigned Users (Shared View) ---
export const getAdminStats = async (req, res) => {
  // We no longer filter by "req.user.id". 
  // Any Admin sees stats for ALL assigned users.
  try {
    const totalRes = await query('SELECT COUNT(*) FROM users WHERE assigned_admin_id IS NOT NULL');
    
    const submittedRes = await query("SELECT COUNT(*) FROM users WHERE assigned_admin_id IS NOT NULL AND kyc_status = 'SUBMITTED'");
    const approvedRes = await query("SELECT COUNT(*) FROM users WHERE assigned_admin_id IS NOT NULL AND kyc_status = 'APPROVED'");
    
    res.json({
      totalAssigned: parseInt(totalRes.rows[0].count),
      submittedKYC: parseInt(submittedRes.rows[0].count),
      approvedKYC: parseInt(approvedRes.rows[0].count)
    });
  } catch (err) {
    console.error("Admin Stats Error:", err);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};

// --- UPDATED: Get Users with FILTER (Shared View) ---
export const getMyAssignedUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const search = req.query.search || ''; 
  const kycStatus = req.query.kycStatus || ''; 
  const offset = (page - 1) * limit;

  try {
    // OLD LOGIC: WHERE u.assigned_admin_id = $1
    // NEW LOGIC: WHERE u.assigned_admin_id IS NOT NULL
    let whereClause = `WHERE u.assigned_admin_id IS NOT NULL`;
    let params = [];
    let paramIndex = 1; // Reset index to 1 since we removed adminId

    // Apply Filter if selected
    if (kycStatus && kycStatus !== 'ALL') {
        whereClause += ` AND u.kyc_status = $${paramIndex}`;
        params.push(kycStatus);
        paramIndex++;
    }

    // Apply Search
    if (search) {
        whereClause += ` AND (u.full_name ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex} OR u.referral_code ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
    }

    const countQuery = `SELECT COUNT(*) FROM users u ${whereClause}`;
    const countResult = await query(countQuery, params);
    const totalItems = parseInt(countResult.rows[0].count);

    const dataQuery = `
      SELECT u.id, u.full_name, u.email, u.referral_code, u.kyc_status, u.created_at,
             (SELECT full_name FROM users WHERE id = u.referred_by_id) as referred_by_name
      FROM users u
      ${whereClause}
      ORDER BY u.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    
    // Add Limit and Offset to params
    const dataParams = [...params, limit, offset];
    const result = await query(dataQuery, dataParams);

    res.json({
      data: result.rows,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        itemsPerPage: limit
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};