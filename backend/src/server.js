import express from 'express';
import cors from 'cors'; // <--- FIX: MUST BE 'cors', NOT 'express'
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Routes
import authRoutes from './modules/auth/auth.routes.js';
import referralRoutes from './modules/referrals/referral.routes.js';
import kycRoutes from './modules/kyc/kyc.routes.js';
import superuserRoutes from './modules/superuser/superuser.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. SECURITY HEADERS
app.use(helmet());

// 2. RATE LIMITING
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// 3. STRICT CORS (Fixed Logic)
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.SUPERUSER_URL
].map(origin => origin ? origin.trim() : null).filter(Boolean); // <--- Trims spaces to prevent errors

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman testing)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`Blocked by CORS: ${origin}`); // Debug log
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/superuser', superuserRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`Allowed Origins:`, allowedOrigins); // Log this to verify it reads .env correctly
});