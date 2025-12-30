import { query } from '../../shared/db.js';

// --- NEW: Get Stats for My Assigned Users ---
export const getAdminStats = async (req, res) => {
  const adminId = req.user.id;
  try {
    const totalRes = await query('SELECT COUNT(*) FROM users WHERE assigned_admin_id = $1', [adminId]);
    const pendingRes = await query("SELECT COUNT(*) FROM users WHERE assigned_admin_id = $1 AND kyc_status = 'PENDING'", [adminId]);
    const approvedRes = await query("SELECT COUNT(*) FROM users WHERE assigned_admin_id = $1 AND kyc_status = 'APPROVED'", [adminId]);
    
    // Optional: Calculate 'Action Required' or other metrics
    res.json({
      totalAssigned: parseInt(totalRes.rows[0].count),
      pendingKYC: parseInt(pendingRes.rows[0].count),
      approvedKYC: parseInt(approvedRes.rows[0].count)
    });
  } catch (err) {
    console.error("Admin Stats Error:", err);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};

export const getMyAssignedUsers = async (req, res) => {
  const adminId = req.user.id; 
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const search = req.query.search || ''; 
  const offset = (page - 1) * limit;

  try {
    let countQuery = `SELECT COUNT(*) FROM users WHERE assigned_admin_id = $1`;
    let countParams = [adminId];

    let dataQuery = `
      SELECT id, full_name, email, referral_code, kyc_status, created_at,
             (SELECT full_name FROM users WHERE id = u.referred_by_id) as referred_by_name
      FROM users u
      WHERE u.assigned_admin_id = $1
    `;
    let dataParams = [adminId, limit, offset];

    if (search) {
      countQuery = `SELECT COUNT(*) FROM users WHERE assigned_admin_id = $1 AND (full_name ILIKE $2 OR email ILIKE $2 OR referral_code ILIKE $2)`;
      countParams = [adminId, `%${search}%`];

      dataQuery = `
        SELECT id, full_name, email, referral_code, kyc_status, created_at,
               (SELECT full_name FROM users WHERE id = u.referred_by_id) as referred_by_name
        FROM users u
        WHERE u.assigned_admin_id = $1 
        AND (full_name ILIKE $4 OR email ILIKE $4 OR referral_code ILIKE $4)
        ORDER BY u.created_at DESC
        LIMIT $2 OFFSET $3
      `;
      dataParams = [adminId, limit, offset, `%${search}%`];
    } else {
       dataQuery += ` ORDER BY u.created_at DESC LIMIT $2 OFFSET $3`;
    }

    const countResult = await query(countQuery, countParams);
    const totalItems = parseInt(countResult.rows[0].count);

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