import express from 'express';
import { getSystemStats, getAllUsers, 
    getAllAdmins, 
    updateUserRole, 
    assignUserToAdmin,
  getAuditLogs } from './superuser.controller.js';
import { authenticateToken, authorizeRole } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Middleware to Ensure they are a SUPERUSER (Role check)
const requireSuperuserRole = (req, res, next) => {
  if (req.user.role !== 'SUPERUSER') {
    return res.status(403).json({ error: 'Access Denied: Superusers Only' });
  }
  next();
};

// All routes require: 
// 1. Valid Token (Login) 
// 2. Superuser Role (Database)
router.use(authenticateToken, authorizeRole('SUPERUSER'));
router.get('/stats', getSystemStats);
router.get('/users', getAllUsers);
router.get('/admins', getAllAdmins); // <--- New
router.post('/role', updateUserRole); // <--- New
router.post('/assign', assignUserToAdmin); // <--- New

export default router;