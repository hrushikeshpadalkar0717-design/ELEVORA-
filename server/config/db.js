import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!uri) {
    mongoose.set('bufferCommands', false);
    console.warn('⚠️  MONGODB_URI is not set in server/.env. Please configure your MongoDB Atlas connection string.');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host} (DB: ${conn.connection.name})`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Atlas Connection Error: ${error.message}`);
    console.warn('⚠️  Check your MongoDB Atlas connection string, network access IP whitelist (0.0.0.0/0), and credentials.');
    return false;
  }
};
