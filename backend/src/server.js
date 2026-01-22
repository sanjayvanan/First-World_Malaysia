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
// 1. CORS MUST BE FIRST (The Fix)
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

app.use(cors(corsOptions)); // <--- MOVED TO TOP

// ==========================================
// 2. OTHER MIDDLEWARE
// ==========================================
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());

// Rate Limiting
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

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`Allowed Origins:`, allowedOrigins); 
});