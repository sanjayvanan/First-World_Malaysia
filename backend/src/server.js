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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ---------------------- SECURITY ---------------------- */

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

/* ---------------------- CORS (HARDENED) ---------------------- */

const allowedOrigins = new Set([
  "https://srfirstworld.org",
  "https://www.srfirstworld.org",
  "https://srfirstworld.co",
  "https://www.srfirstworld.co",
  process.env.CLIENT_URL,
  process.env.SUPERUSER_URL
].filter(Boolean).map(o => o.trim()));

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    console.warn("🚫 Blocked by CORS:", origin);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

/* ---------------------- MIDDLEWARE ---------------------- */

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());

/* ---------------------- ROUTES ---------------------- */

app.use('/api/auth', authRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/superuser', superuserRoutes);
app.use('/api/admin', adminRoutes);

/* ---------------------- ERROR HANDLER ---------------------- */

app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

/* ---------------------- START SERVER ---------------------- */

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`✅ Allowed Origins:`, [...allowedOrigins]);
});
