// src/server.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { domainRouter } from './middleware/domainRouter.js';
import { query } from './shared/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- 1. Global Middleware ---
app.use(express.json()); // Allow JSON body parsing
app.use(cors());         // Allow Frontend to talk to Backend
app.use(helmet());       // Security headers
app.use(morgan('dev'));  // Logging
app.use(domainRouter);   // <--- Our Custom Domain Logic

// --- 2. Modular Routing ---

// A. Superuser Routes (Only accessible from superuser domain)
app.use('/api', (req, res, next) => {
  if (req.isSuperuserDomain) {
    // We will import actual superuser routes here later
    return res.json({ 
      message: "Welcome to the SUPERUSER Control Center", 
      domain: "Private" 
    });
  }
  next();
});

// B. Public/User Routes (Standard users)
app.use('/api', (req, res, next) => {
  if (!req.isSuperuserDomain) {
    // We will import auth/referral routes here later
    return res.json({ 
      message: "Welcome to Sai Ram / Maxso Platform", 
      domain: "Public" 
    });
  }
  next(); // Should not happen if logic is strict, but good safety
});

// --- 3. Health Check ---
app.get('/', async (req, res) => {
  try {
    const time = await query('SELECT NOW()');
    res.json({ 
      status: 'active', 
      time: time.rows[0].now,
      isSuperuser: req.isSuperuserDomain 
    });
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// --- 4. Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`- Public: http://localhost:${PORT}`);
  console.log(`- Admin:  http://superuser.localhost:${PORT} (Requires host config)`);
});