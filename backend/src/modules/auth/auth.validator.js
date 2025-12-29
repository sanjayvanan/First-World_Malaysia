import { body, validationResult } from 'express-validator';

// Standardized Error Handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return only the first error to keep UI clean
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};

export const registerValidation = [
  body('email').isEmail().withMessage('Please enter a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('fullName').notEmpty().withMessage('Full name is required').trim().escape(),
  body('referredByCode').optional().isString().trim(),
  validate
];

export const loginValidation = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];