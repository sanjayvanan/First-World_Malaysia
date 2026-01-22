import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

// Routes
import authRoutes from './modules/auth/auth.routes.js';
import referralRoutes from './modules/referrals/referral.routes.js';
import kycRoutes from './modules/kyc/kyc.routes.js';
import superuserRoutes from './modules/superuser/superuser.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import plansRoutes from './modules/plans/plans.routes.js';
import settingsRoutes from './modules/settings/settings.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// 1. CORS (MUST BE AT THE VERY TOP)
// ==========================================
const allowedOrigins = [
  'https://ci9pb4z5.up.railway.app',
  'https://app.srfirstworld.co',
  'https://srfirstworld.org',
  'https://www.srfirstworld.org',
  'https://srfirstworld.co',
  'https://www.srfirstworld.co',
  'http://localhost:5173',
  'http://localhost:5174'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`Blocked by CORS: ${origin}`);
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));

// ==========================================
// 2. MIDDLEWARE
// ==========================================
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// ==========================================
// 3. ROUTES
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/superuser', superuserRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/plans', plansRoutes);
app.use('/api/settings', settingsRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ==========================================
// 4. SERVER START (THE FIX IS HERE)
// ==========================================
// '0.0.0.0' is REQUIRED for Railway to see the app
app.listen(PORT, '0.0.0.0', () => {
  console.log("---------------------------------------------------------");
  console.log(`🚀 SERVER STARTED SUCCESSFULLY ON PORT ${PORT}`);
  console.log(`🚀 LISTENING ON ADDRESS: 0.0.0.0 (PUBLIC)`);
  console.log(`🚀 DEPLOYMENT VERSION: ROCKET TEST`);
  console.log("---------------------------------------------------------");
  console.log(`Allowed Origins:`, allowedOrigins); 
});