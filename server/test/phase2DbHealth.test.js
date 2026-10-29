import express from 'express';
import mongoose from 'mongoose';
import { getDatabaseHealth, initDbListeners, connectDB } from '../config/db.js';

/**
 * Phase 2 Automated Test Suite:
 * Verifies MongoDB connection reliability, lifecycle event deduplication,
 * accurate Mongoose readyState mapping, and sanitized 200/503 health responses.
 */
async function runPhase2Tests() {
  console.log('======================================================');
  console.log('🧪 ELEVORA PHASE 2: DATABASE RELIABILITY & HEALTH TESTS');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, name, details = '') => {
    if (condition) {
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${name} ${details ? `(${details})` : ''}`);
      failed++;
    }
  };

  // ─────────────────────────────────────────────────────────────
  // TEST 1: Missing Database URI Handling
  // ─────────────────────────────────────────────────────────────
  console.log('1. Testing Missing Database URI...');
  const originalUri = process.env.MONGODB_URI;
  const originalMongoUri = process.env.MONGO_URI;
  delete process.env.MONGODB_URI;
  delete process.env.MONGO_URI;

  try {
    const resultNoUri = await connectDB();
    assert(resultNoUri === false, 'connectDB() returns false when MONGODB_URI is absent');
  } catch (err) {
    assert(false, 'connectDB() threw an error instead of returning false', err.message);
  } finally {
    if (originalUri) process.env.MONGODB_URI = originalUri;
    if (originalMongoUri) process.env.MONGO_URI = originalMongoUri;
  }

  // ─────────────────────────────────────────────────────────────
  // TEST 2: Initial Connection Failure Handling (Unreachable DB)
  // ─────────────────────────────────────────────────────────────
  console.log('\n2. Testing Initial Connection Failure on Unreachable URI...');
  process.env.MONGODB_URI = 'mongodb://127.0.0.1:27099/elevora_test_nonexistent?connectTimeoutMS=1000&serverSelectionTimeoutMS=1000';

  try {
    const resultUnreachable = await connectDB();
    assert(resultUnreachable === false, 'connectDB() safely returns false on connection failure');
  } catch (err) {
    assert(false, 'connectDB() threw an unhandled exception', err.message);
  } finally {
    if (originalUri) process.env.MONGODB_URI = originalUri;
    else delete process.env.MONGODB_URI;
  }

  // ─────────────────────────────────────────────────────────────
  // TEST 3: Duplicate Listener Prevention
  // ─────────────────────────────────────────────────────────────
  console.log('\n3. Testing Lifecycle Listener Deduplication...');
  initDbListeners();
  initDbListeners();
  initDbListeners();

  const disconnectedCount = mongoose.connection.listenerCount('disconnected');
  const reconnectedCount = mongoose.connection.listenerCount('reconnected');
  const errorCount = mongoose.connection.listenerCount('error');

  assert(disconnectedCount === 1, 'Exactly 1 disconnected listener registered', `count: ${disconnectedCount}`);
  assert(reconnectedCount === 1, 'Exactly 1 reconnected listener registered', `count: ${reconnectedCount}`);
  assert(errorCount === 1, 'Exactly 1 error listener registered', `count: ${errorCount}`);

  // ─────────────────────────────────────────────────────────────
  // TEST 4: Mongoose readyState Mapping & Sanitization (Unit)
  // ─────────────────────────────────────────────────────────────
  console.log('\n4. Testing getDatabaseHealth() Mongoose State Mapping...');

  // Disconnected state (0)
  const healthDisconnected = getDatabaseHealth();
  assert(healthDisconnected.readyState === mongoose.connection.readyState, 'Reflects active readyState code');
  assert(typeof healthDisconnected.status === 'string', 'Returns human-readable status string');
  assert(typeof healthDisconnected.isHealthy === 'boolean', 'Returns isHealthy boolean');

  // Verify no credentials leaked in health payload
  const serializedHealth = JSON.stringify(healthDisconnected);
  assert(!serializedHealth.includes('mongodb+srv'), 'Does not leak MongoDB protocol strings');
  assert(!serializedHealth.includes('@'), 'Does not leak credentials or user-pass pairs');
  assert(!serializedHealth.includes('password'), 'Does not contain password field');

  // ─────────────────────────────────────────────────────────────
  // TEST 5: Health Check HTTP Status & Response Verification
  // ─────────────────────────────────────────────────────────────
  console.log('\n5. Testing /api/health HTTP Responses (200 Healthy vs 503 Degraded)...');

  const testApp = express();
  testApp.get('/api/health', (req, res) => {
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

  const testServer = testApp.listen(0);
  const testPort = testServer.address().port;

  try {
    // When disconnected (readyState === 0):
    const resDisconnected = await fetch(`http://127.0.0.1:${testPort}/api/health`);
    const dataDisconnected = await resDisconnected.json();

    assert(resDisconnected.status === 503, 'Returns HTTP 503 Service Unavailable when DB is disconnected', `got ${resDisconnected.status}`);
    assert(dataDisconnected.status === 'degraded', 'Payload status is degraded when disconnected');
    assert(dataDisconnected.database.connected === false, 'Database connected flag is false');
    assert(dataDisconnected.database.status === 'disconnected', 'Database status describes disconnected');

    // Verify response is completely clean of internal secrets or stack traces
    const rawBody = JSON.stringify(dataDisconnected);
    assert(!rawBody.includes('stack'), 'No stack traces in 503 response');
    assert(!rawBody.includes('Error:'), 'No raw error objects in 503 response');
    assert(!rawBody.includes('secret'), 'No secret values in 503 response');

    // Simulate mock connected state to verify 200 OK
    const originalReadyStateGetter = Object.getOwnPropertyDescriptor(mongoose.Connection.prototype, 'readyState');
    Object.defineProperty(mongoose.connection, 'readyState', { value: 1, configurable: true });

    const resConnected = await fetch(`http://127.0.0.1:${testPort}/api/health`);
    const dataConnected = await resConnected.json();

    assert(resConnected.status === 200, 'Returns HTTP 200 OK when DB is connected', `got ${resConnected.status}`);
    assert(dataConnected.status === 'healthy', 'Payload status is healthy when connected');
    assert(dataConnected.database.connected === true, 'Database connected flag is true');
    assert(dataConnected.database.status === 'connected', 'Database status describes connected');

    // Restore original property
    if (originalReadyStateGetter) {
      Object.defineProperty(mongoose.connection, 'readyState', originalReadyStateGetter);
    } else {
      delete mongoose.connection.readyState;
    }
  } finally {
    testServer.close();
  }

  // ─────────────────────────────────────────────────────────────
  // SUMMARY
  // ─────────────────────────────────────────────────────────────
  console.log('\n======================================================');
  console.log(`📊 PHASE 2 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase2Tests().catch((err) => {
  console.error('Unexpected test suite error:', err);
  process.exit(1);
});
