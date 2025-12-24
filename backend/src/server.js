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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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
app.use('/api/auth', authRoutes); // <--- NEW: Enables /api/auth/register
app.use('/api/referrals', referralRoutes);

// B. Superuser Routes
app.use('/api/admin', (req, res, next) => {
  if (req.isSuperuserDomain) {
    return res.json({ message: "Welcome Superuser", domain: "Private" });
  }
  res.status(403).json({ error: "Access Denied" });
});

// C. Public Routes
app.get('/', async (req, res) => {
  try {
    const time = await query('SELECT NOW()');
    res.json({ status: 'active', time: time.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// --- 3. Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});