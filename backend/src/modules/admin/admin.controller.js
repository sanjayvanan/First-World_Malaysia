import { query } from '../../shared/db.js';

// --- UPDATED: Get Stats for My Assigned Users ---
export const getAdminStats = async (req, res) => {
  const adminId = req.user.id;
  try {
    const totalRes = await query('SELECT COUNT(*) FROM users WHERE assigned_admin_id = $1', [adminId]);
    
    // CHANGED: We now count 'SUBMITTED' (People waiting for you) instead of 'PENDING'
    const submittedRes = await query("SELECT COUNT(*) FROM users WHERE assigned_admin_id = $1 AND kyc_status = 'SUBMITTED'", [adminId]);
    const approvedRes = await query("SELECT COUNT(*) FROM users WHERE assigned_admin_id = $1 AND kyc_status = 'APPROVED'", [adminId]);
    
    res.json({
      totalAssigned: parseInt(totalRes.rows[0].count),
      submittedKYC: parseInt(submittedRes.rows[0].count), // <--- Send 'submitted' count
      approvedKYC: parseInt(approvedRes.rows[0].count)
    });
  } catch (err) {
    console.error("Admin Stats Error:", err);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};

// --- UPDATED: Get Users with FILTER ---
export const getMyAssignedUsers = async (req, res) => {
  const adminId = req.user.id; 
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const search = req.query.search || ''; 
  const kycStatus = req.query.kycStatus || ''; // <--- Capture Filter
  const offset = (page - 1) * limit;

  try {
    let whereClause = `WHERE u.assigned_admin_id = $1`;
    let params = [adminId];
    let paramIndex = 2;

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