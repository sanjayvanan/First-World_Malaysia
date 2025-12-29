import express from 'express';
import { authenticateToken, authorizeRole } from '../../middleware/authMiddleware.js';
import { getMyAssignedUsers } from './admin.controller.js';

const router = express.Router();

// Middleware: Logged in + ADMIN role only
router.use(authenticateToken, authorizeRole('ADMIN'));

router.get('/my-users', getMyAssignedUsers);

export default router;