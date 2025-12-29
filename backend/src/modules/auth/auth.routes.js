import express from 'express';
import { register, login } from './auth.controller.js';
import { registerValidation, loginValidation } from './auth.validator.js'; // Import

const router = express.Router();

// Add validators middleware before the controller
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

export default router;