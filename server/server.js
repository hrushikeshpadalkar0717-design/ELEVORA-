import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Allowed frontend origins
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5174',
  'http://localhost:5173',
  'http://localhost:3000',
];

// CORS — credentials required for cookies
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server or same-origin requests (no origin header)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true, // required for cookies
  })
);

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(cookieParser()); // parse signed/unsigned cookies

// Health Check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'ELEVORA Backend API',
    database: (process.env.MONGODB_URI || process.env.MONGO_URI) ? 'MongoDB Atlas Configured' : 'Needs MONGODB_URI in .env',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/upload', uploadRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Server Unhandled Error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

// Port and Startup
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 ELEVORA Backend running on http://localhost:${PORT}`);
    console.log(`📡 Health: http://localhost:${PORT}/api/health`);
    console.log(`🔐 Google Callback: http://localhost:${PORT}/api/auth/google/callback`);
    console.log(`🔗 LinkedIn Callback: http://localhost:${PORT}/api/auth/linkedin/callback`);
  });
});
