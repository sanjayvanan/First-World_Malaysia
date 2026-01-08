import express from 'express';
import { getPlans, updatePlan } from './plans.controller.js';
import { authenticateToken, authorizeRole } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Public Route
router.get('/', getPlans);

// Protected Route (Superuser)
router.put('/:id', authenticateToken, authorizeRole('SUPERUSER'), updatePlan);

export default router;