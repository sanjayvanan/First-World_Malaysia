import { query } from '../../shared/db.js';

// Get ONLY users assigned to this specific Admin
export const getMyAssignedUsers = async (req, res) => {
  const adminId = req.user.id; // From the JWT Token

  try {
    const result = await query(
      `SELECT id, full_name, email, referral_code, kyc_status, created_at,
              (SELECT full_name FROM users WHERE id = u.referred_by_id) as referred_by_name
       FROM users u
       WHERE u.assigned_admin_id = $1
       ORDER BY u.created_at DESC`,
      [adminId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};