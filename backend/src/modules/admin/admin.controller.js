import { query } from '../../shared/db.js';

// Get ONLY users assigned to this specific Admin (With Pagination & Search)
export const getMyAssignedUsers = async (req, res) => {
  const adminId = req.user.id; 
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const search = req.query.search || ''; // <--- Get search term
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

    // --- SEARCH LOGIC ---
    if (search) {
      // Add Search Condition
      const searchClause = ` AND (full_name ILIKE $2 OR email ILIKE $2 OR referral_code ILIKE $2)`;
      
      // Update Count Query
      countQuery = `SELECT COUNT(*) FROM users WHERE assigned_admin_id = $1 AND (full_name ILIKE $2 OR email ILIKE $2 OR referral_code ILIKE $2)`;
      countParams = [adminId, `%${search}%`];

      // Update Data Query (Adjust params indexing)
      dataQuery = `
        SELECT id, full_name, email, referral_code, kyc_status, created_at,
               (SELECT full_name FROM users WHERE id = u.referred_by_id) as referred_by_name
        FROM users u
        WHERE u.assigned_admin_id = $1 
        AND (full_name ILIKE $4 OR email ILIKE $4 OR referral_code ILIKE $4)
        ORDER BY u.created_at DESC
        LIMIT $2 OFFSET $3
      `;
      // Params: $1=adminId, $2=limit, $3=offset, $4=search
      dataParams = [adminId, limit, offset, `%${search}%`];
    } else {
       // Append Order/Limit if no search
       dataQuery += ` ORDER BY u.created_at DESC LIMIT $2 OFFSET $3`;
    }

    // 1. Get total count
    const countResult = await query(countQuery, countParams);
    const totalItems = parseInt(countResult.rows[0].count);

    // 2. Get data
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