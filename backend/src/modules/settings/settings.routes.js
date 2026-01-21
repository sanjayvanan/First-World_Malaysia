import express from 'express';
import { getBankDetails, updateBankDetails } from './settings.controller.js';
import { authenticateToken, requireSuperUser } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Public (or Authenticated User) can READ
router.get('/', authenticateToken, getBankDetails);

// Only SUPERUSER can UPDATE
router.put('/', authenticateToken, requireSuperUser, updateBankDetails);

export default router;