import { query } from '../../shared/db.js';

// Get ONLY users assigned to this specific Admin (With Pagination)
export const getMyAssignedUsers = async (req, res) => {
  const adminId = req.user.id; 
  // Get page and limit from query string (default: page 1, limit 20)
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  try {
    // 1. Get total count for this admin (to calculate total pages)
    const countResult = await query(
      `SELECT COUNT(*) FROM users WHERE assigned_admin_id = $1`,
      [adminId]
    );
    const totalItems = parseInt(countResult.rows[0].count);

    // 2. Get the specific slice of data
    const result = await query(
      `SELECT id, full_name, email, referral_code, kyc_status, created_at,
              (SELECT full_name FROM users WHERE id = u.referred_by_id) as referred_by_name
       FROM users u
       WHERE u.assigned_admin_id = $1
       ORDER BY u.created_at DESC
       LIMIT $2 OFFSET $3`,
      [adminId, limit, offset]
    );

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