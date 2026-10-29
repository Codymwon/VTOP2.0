import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config.js';

import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import facultyRoutes from './routes/facultyRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Request logging (exclude noisy static assets)
app.use((req, res, next) => {
  if (!req.url.startsWith('/assets')) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  }
  next();
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'UP',
    version: '2.0.0',
    service: 'VTOP Enterprise API Gateway',
    timestamp: new Date().toISOString(),
  });
});

// Mounted Routes
// 1. Auth routes mounted under /api/vtop (supporting /api/vtop/login, /api/vtop/validateSecurityOtp, etc.)
app.use('/api/vtop', authRoutes);

// 2. Role specific operational modules
app.use('/api/vtop/student', studentRoutes);
app.use('/api/vtop/faculty', facultyRoutes);
app.use('/api/vtop/admin', adminRoutes);
app.use('/api/vtop/feedback', feedbackRoutes);

// 3. Serve Frontend static assets in production or when dist folder is present
const frontendDistPath = path.resolve(__dirname, '../../dist');
if (fs.existsSync(frontendDistPath)) {
  console.log(`📦 Serving static frontend from: ${frontendDistPath}`);
  app.use(express.static(frontendDistPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// 404 handler for unmatched API routes
app.use('/api/*', (_req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(config.port, () => {
  console.log(`====================================================`);
  console.log(`🚀 VTOP 2.0 Backend Server running on http://localhost:${config.port}`);
  console.log(`🛡️  Authentication: JWT + 2FA OTP Enabled`);
  console.log(`💾 Database: SQLite via Prisma ORM`);
  console.log(`====================================================`);
});
