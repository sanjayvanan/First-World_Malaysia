import express from 'express';
import { getSystemStats, getAllUsers, 
    updateUserRole, 
    assignUserToAdmin } from './superuser.controller.js';
import { authenticateToken, authorizeRole } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Middleware: Authenticated + SUPERUSER Role
router.use(authenticateToken, authorizeRole('SUPERUSER'));

router.get('/stats', getSystemStats);
router.get('/users', getAllUsers);
router.post('/role', updateUserRole);
router.post('/assign', assignUserToAdmin); // Uses the new Toggle logic

export default router;