import mongoose from 'mongoose';

// Disable query buffering so requests fail fast with clear errors if DB is unreachable
mongoose.set('bufferCommands', false);

// Guard to ensure lifecycle listeners are registered exactly once
let listenersInitialized = false;

/**
 * Register connection lifecycle event listeners once without creating duplicates.
 */
export const initDbListeners = () => {
  if (listenersInitialized) return;
  listenersInitialized = true;

  mongoose.connection.on('connected', () => {
    console.log('🔗 Mongoose connection established to MongoDB.');
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB connection lost. Awaiting auto-reconnection...');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('🔄 MongoDB successfully reconnected.');
  });

  mongoose.connection.on('error', (err) => {
    console.error(`❌ MongoDB connection error event: ${err.message}`);
  });
};

/**
 * Connect to MongoDB Atlas.
 * Returns true if connected successfully, or false if URI is missing or connection rejected.
 * Never throws unhandled rejections to callers.
 */
export const connectDB = async (overrideUri) => {
  initDbListeners();

  const uri = overrideUri || process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!uri) {
    console.warn('⚠️  MONGODB_URI is not set in environment variables. Please configure your MongoDB Atlas connection string.');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
    });
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host} (DB: ${conn.connection.name})`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Atlas Connection Error: ${error.message}`);
    console.warn('⚠️  Check your MongoDB Atlas connection string, network access IP whitelist (0.0.0.0/0), and credentials.');
    return false;
  }
};

/**
 * Returns sanitized connection health state based on actual Mongoose readyState.
 * Prevents credential, host, or stack trace leakage.
 *
 * Mongoose readyState codes:
 * 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
 */
export const getDatabaseHealth = () => {
  const readyState = mongoose.connection.readyState;
  switch (readyState) {
    case 1:
      return { status: 'connected', readyState: 1, isHealthy: true };
    case 2:
      return { status: 'connecting', readyState: 2, isHealthy: false };
    case 3:
      return { status: 'disconnecting', readyState: 3, isHealthy: false };
    case 0:
    default:
      return { status: 'disconnected', readyState: 0, isHealthy: false };
  }
};
