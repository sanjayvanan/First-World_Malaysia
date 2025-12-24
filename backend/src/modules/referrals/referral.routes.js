import express from 'express';
import { getMyStats, getMyReferrals } from './referral.controller.js';
import { authenticateToken } from '../../middleware/authMiddleware.js';

const router = express.Router();

// PROTECTED ROUTES (Need Token)
router.get('/stats', authenticateToken, getMyStats);
router.get('/members', authenticateToken, getMyReferrals);

export default router;