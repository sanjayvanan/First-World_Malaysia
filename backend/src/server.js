import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// --- IMPORTS ---
import { domainRouter } from './middleware/domainRouter.js';
import { query } from './shared/db.js';
import authRoutes from './modules/auth/auth.routes.js'; 
import referralRoutes from './modules/referrals/referral.routes.js';
import superuserRoutes from './modules/superuser/superuser.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import kycRoutes from './modules/kyc/kyc.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';


dotenv.config();
// Define __dirname (since we are using ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;


// --- ADD SECURITY LIMITER ---
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many login attempts, please try again later.' }
});


// --- 1. Global Middleware ---
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(domainRouter);

// --- 2. Modular Routing ---

// A. Superuser Routes (Strict Domain Check)
app.use('/api/superuser', (req, res, next) => {
  // 1. Check Domain (Must be srfirstworld.org or superuser.localhost)
  if (!req.isSuperuserDomain) {
    return res.status(404).json({ error: 'Not Found (Wrong Domain)' });
  }
  next();
}, superuserRoutes);


// A. Auth Routes (Available to everyone)
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// B. Superuser Routes
// ✅ ADD THIS INSTEAD
app.use('/api/admin', (req, res, next) => {
  // 1. Security Check: Only allow access from Superuser domains
  if (!req.isSuperuserDomain) {
    return res.status(403).json({ error: "Access Denied: Wrong Domain" });
  }
  // 2. Pass control to the actual Admin Routes
  next();
}, adminRoutes);

// C. Public Routes
app.get('/', async (req, res) => {
  try {
    const time = await query('SELECT NOW()');
    res.json({ status: 'active', time: time.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});
app.use('/api/kyc', kycRoutes);

// --- 3. Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});