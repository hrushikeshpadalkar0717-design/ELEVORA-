import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import { connectDB, getDatabaseHealth } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Security: Disable Express fingerprint header & trust proxy for accurate rate limiting
app.disable('x-powered-by');
app.set('trust proxy', 1);

// Security Headers & Content Security Policy compatible with Razorpay, OAuth & Google Fonts
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://checkout.razorpay.com',
          'https://accounts.google.com',
        ],
        frameSrc: [
          "'self'",
          'https://api.razorpay.com',
          'https://checkout.razorpay.com',
          'https://accounts.google.com',
        ],
        connectSrc: [
          "'self'",
          'http://localhost:5173',
          'http://localhost:5174',
          'http://localhost:3000',
          'http://127.0.0.1:5173',
          'http://127.0.0.1:5174',
          'https://api.razorpay.com',
          'https://lumberjack.razorpay.com',
          'https://accounts.google.com',
          'https://www.linkedin.com',
          ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map((u) => u.trim()) : []),
        ].filter(Boolean),
        imgSrc: [
          "'self'",
          'data:',
          'blob:',
          'https://images.unsplash.com',
          'https://lh3.googleusercontent.com',
          'https://media.licdn.com',
          'https://*.licdn.com',
        ],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
      },
    },
  })
);

// Dynamic allowed frontend origins (restricts strictly to CLIENT_URL in production)
const getCorsOrigins = () => {
  const isProd = process.env.NODE_ENV === 'production';
  if (isProd) {
    if (!process.env.CLIENT_URL) {
      console.warn('⚠️ CLIENT_URL not set in production. Permitting same-origin only.');
      return [];
    }
    return process.env.CLIENT_URL.split(',').map((u) => u.trim()).filter(Boolean);
  }
  // Development origins
  const devOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
  ];
  if (process.env.CLIENT_URL) {
    process.env.CLIENT_URL.split(',').forEach((u) => {
      const clean = u.trim();
      if (clean && !devOrigins.includes(clean)) devOrigins.push(clean);
    });
  }
  return devOrigins;
};

// CORS — credentials required for cookies
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin header (e.g. server-to-server, curl, mobile apps)
      if (!origin) return callback(null, true);
      const allowedOrigins = getCorsOrigins();
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true, // required for cookies
  })
);

app.use(
  express.json({
    limit: '15mb',
    verify: (req, _res, buf) => {
      // Store raw buffer for Razorpay webhook HMAC signature verification
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(cookieParser()); // parse signed/unsigned cookies

// Health Check route — reports live database readiness and returns 503 if disconnected
app.get('/api/health', (req, res) => {
  const dbHealth = getDatabaseHealth();
  const isHealthy = dbHealth.isHealthy;

  const response = {
    status: isHealthy ? 'healthy' : 'degraded',
    app: 'ELEVORA Backend API',
    database: {
      status: dbHealth.status,
      connected: isHealthy,
    },
    razorpay: (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) ? 'configured' : 'not_configured',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  };

  res.status(isHealthy ? 200 : 503).json(response);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payments', paymentRoutes);

// Error Handling Middleware
app.use((err, req, res, _next) => {
  console.error('Server Unhandled Error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

// Port and Startup
const PORT = process.env.PORT || 5000;

// Validate Environment Variables on Startup
function validateEnv() {
  console.log('──────────────────────────────────────────────────────');
  console.log('🔍 Validating Authentication & Environment Variables:');

  const dbConfigured = !!(process.env.MONGODB_URI || process.env.MONGO_URI);
  console.log(`  • Database URI (MongoDB Atlas): ${dbConfigured ? '✅ CONFIGURED' : '❌ MISSING (Required)'}`);

  const jwtConfigured = !!process.env.JWT_SECRET;
  console.log(`  • JWT Secret:                   ${jwtConfigured ? '✅ CONFIGURED' : (process.env.NODE_ENV === 'production' ? '❌ MISSING (Required in Production)' : '⚠️ USING DEV FALLBACK (Not for Production)')}`);
  if (!jwtConfigured && process.env.NODE_ENV === 'production') {
    console.error('❌ FATAL: JWT_SECRET environment variable is missing in production. Aborting server startup.');
    process.exit(1);
  }

  const googleConfigured = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  console.log(`  • Google OAuth (OIDC):          ${googleConfigured ? '✅ CONFIGURED' : '⚠️ NOT CONFIGURED (Google Login disabled)'}`);

  const linkedinConfigured = !!(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET);
  console.log(`  • LinkedIn OAuth (OIDC):        ${linkedinConfigured ? '✅ CONFIGURED' : '⚠️ NOT CONFIGURED (LinkedIn Login disabled)'}`);

  const razorpayConfigured = !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
  const isLive = (process.env.RAZORPAY_KEY_ID || '').startsWith('rzp_live');
  console.log(`  • Razorpay Gateway:             ${razorpayConfigured ? `✅ CONFIGURED (${isLive ? 'LIVE MODE 💳' : 'TEST MODE 🧪'})` : '⚠️ NOT CONFIGURED (Add RAZORPAY_KEY_ID / SECRET in .env)'}`);

  console.log(`  • Client Origin:                ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
  console.log('──────────────────────────────────────────────────────');
}

// Connect to MongoDB Atlas and start server — halts safely if initial connection fails
const startServer = async () => {
  try {
    let isConnected = await connectDB();
    if (!isConnected && process.env.NODE_ENV !== 'production') {
      console.warn('⚠️  Primary MongoDB unreachable. Attempting local development fallback on mongodb://127.0.0.1:27017/elevora ...');
      isConnected = await connectDB('mongodb://127.0.0.1:27017/elevora');
      if (isConnected) {
        console.warn('💡 Tip: To connect to MongoDB Atlas, add your current public IP in Atlas -> Network Access.');
      }
    }

    if (!isConnected) {
      console.error('❌ FATAL: Could not establish initial connection to MongoDB Atlas or local database.');
      console.error('❌ Server startup aborted. Application will not accept traffic without an active database.');
      process.exit(1);
    }

    validateEnv();

    const server = app.listen(PORT, () => {
      console.log(`🚀 ELEVORA Backend running on http://localhost:${PORT}`);
      console.log(`📡 Health: http://localhost:${PORT}/api/health`);
      console.log(`🔐 Google Callback: http://localhost:${PORT}/api/auth/google/callback`);
      console.log(`🔗 LinkedIn Callback: http://localhost:${PORT}/api/auth/linkedin/callback`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use by another running process.`);
        console.warn(`💡 Tip: Close the existing server instance or kill the process using port ${PORT}.`);
      } else {
        console.error('❌ Server startup error:', err.message);
      }
      process.exit(1);
    });

    return server;
  } catch (err) {
    console.error('❌ FATAL: Unexpected error during server initialization:', err.message);
    process.exit(1);
  }
};

startServer();

export { app, startServer };
export default app;
