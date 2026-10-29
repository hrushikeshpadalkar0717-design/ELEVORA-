import assert from 'node:assert/strict';
import http from 'node:http';
import { normalizeOrigin, getCorsOrigins, corsOptions, isMainModule } from '../server.js';
import app from '../server.js';

console.log('======================================================');
console.log('🧪 ELEVORA: CORS PREFLIGHT & ORIGIN NORMALIZATION TESTS');
console.log('======================================================\n');

let passedTests = 0;
const recordPass = (msg) => {
  console.log(`  ✅ PASS: ${msg}`);
  passedTests++;
};

// ─────────────────────────────────────────────────────────────
// 1. Testing normalizeOrigin
// ─────────────────────────────────────────────────────────────
console.log('1. Testing Origin Normalization Helper (Trailing Slashes & Formatting)...');
{
  assert.equal(
    normalizeOrigin('https://elevora-bay.vercel.app/'),
    'https://elevora-bay.vercel.app',
    'Strips single trailing slash'
  );
  assert.equal(
    normalizeOrigin('https://elevora-bay.vercel.app///'),
    'https://elevora-bay.vercel.app',
    'Strips multiple trailing slashes'
  );
  assert.equal(
    normalizeOrigin('  https://elevora-bay.vercel.app/  '),
    'https://elevora-bay.vercel.app',
    'Trims whitespace around origin'
  );
  assert.equal(
    normalizeOrigin('HTTPS://Elevora-Bay.Vercel.App/'),
    'https://elevora-bay.vercel.app',
    'Converts origin to lowercase'
  );
  assert.equal(
    normalizeOrigin('https://elevora-bay.vercel.app'),
    'https://elevora-bay.vercel.app',
    'Preserves clean origin without alteration'
  );
  assert.equal(
    normalizeOrigin('http://localhost:5173/'),
    'http://localhost:5173',
    'Strips trailing slash from localhost dev URL'
  );
  assert.equal(normalizeOrigin(''), '', 'Handles empty string gracefully');
  assert.equal(normalizeOrigin(null), '', 'Handles null gracefully');
  assert.equal(normalizeOrigin(undefined), '', 'Handles undefined gracefully');

  recordPass('normalizeOrigin correctly strips trailing slashes, whitespace, and normalizes casing');
}

// ─────────────────────────────────────────────────────────────
// 2. Testing getCorsOrigins Whitelist Resolution
// ─────────────────────────────────────────────────────────────
console.log('\n2. Testing getCorsOrigins Whitelist Resolution...');
{
  const allowed = getCorsOrigins();
  assert.ok(
    allowed.includes('https://elevora-bay.vercel.app'),
    'Explicitly allows production origin https://elevora-bay.vercel.app'
  );
  assert.ok(allowed.includes('http://localhost:5173'), 'Preserves http://localhost:5173');
  assert.ok(allowed.includes('http://localhost:5174'), 'Preserves http://localhost:5174');
  assert.ok(allowed.includes('http://localhost:3000'), 'Preserves http://localhost:3000');
  assert.ok(allowed.includes('http://127.0.0.1:5173'), 'Preserves http://127.0.0.1:5173');
  assert.ok(allowed.includes('http://127.0.0.1:5174'), 'Preserves http://127.0.0.1:5174');

  // Test dynamic CLIENT_URL with trailing slash
  const originalClientUrl = process.env.CLIENT_URL;
  try {
    process.env.CLIENT_URL = 'https://elevora-custom.com/, https://staging.elevora.com/ ';
    const dynamicAllowed = getCorsOrigins();
    assert.ok(
      dynamicAllowed.includes('https://elevora-custom.com'),
      'Normalizes and includes custom domain from CLIENT_URL'
    );
    assert.ok(
      dynamicAllowed.includes('https://staging.elevora.com'),
      'Normalizes and includes secondary domain from CLIENT_URL'
    );
    assert.ok(
      !dynamicAllowed.includes('https://elevora-custom.com/'),
      'Does not contain trailing slash version in whitelist'
    );
  } finally {
    if (originalClientUrl) process.env.CLIENT_URL = originalClientUrl;
    else delete process.env.CLIENT_URL;
  }

  recordPass('getCorsOrigins resolves production origin, dev origins, and normalizes CLIENT_URL');
}

// ─────────────────────────────────────────────────────────────
// 3. Testing corsOptions Origin Verifier Callback
// ─────────────────────────────────────────────────────────────
console.log('\n3. Testing corsOptions Verification Callback...');
{
  const verify = corsOptions.origin;

  // Requests with no origin (curl, server-to-server, mobile app)
  let noOriginAllowed = null;
  verify(undefined, (err, allow) => {
    noOriginAllowed = allow;
  });
  assert.equal(noOriginAllowed, true, 'Permits requests with no origin header');

  // Exact production frontend origin
  let prodAllowed = null;
  verify('https://elevora-bay.vercel.app', (err, allow) => {
    prodAllowed = allow;
  });
  assert.equal(prodAllowed, true, 'Permits exact production origin https://elevora-bay.vercel.app');

  // Localhost development origin
  let devAllowed = null;
  verify('http://localhost:5173', (err, allow) => {
    devAllowed = allow;
  });
  assert.equal(devAllowed, true, 'Permits development origin http://localhost:5173');

  // Unauthorized origin
  let rogueAllowed = null;
  let rogueError = null;
  verify('https://malicious-phishing-site.com', (err, allow) => {
    rogueError = err;
    rogueAllowed = allow;
  });
  assert.equal(rogueError, null, 'Does not throw internal server error for unauthorized origin');
  assert.equal(rogueAllowed, false, 'Rejects unauthorized origin cleanly with false');

  recordPass('corsOptions origin verification callback accepts trusted origins and safely rejects untrusted origins');
}

// ─────────────────────────────────────────────────────────────
// 4. Testing End-to-End HTTP OPTIONS Preflight on Express Server
// ─────────────────────────────────────────────────────────────
console.log('\n4. Testing Live HTTP OPTIONS Preflight Requests...');

const testServer = http.createServer(app);

await new Promise((resolve) => testServer.listen(0, resolve));
const port = testServer.address().port;

const makeRequest = (options) => {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        host: '127.0.0.1',
        port,
        ...options,
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => resolve({ res, body }));
      }
    );
    req.on('error', reject);
    req.end();
  });
};

try {
  // 4.1 Production Frontend OPTIONS Preflight to /api/auth/me
  {
    const { res } = await makeRequest({
      method: 'OPTIONS',
      path: '/api/auth/me',
      headers: {
        Origin: 'https://elevora-bay.vercel.app',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'content-type, authorization',
      },
    });

    assert.equal(res.statusCode, 204, 'Preflight response returns HTTP 204 No Content');
    assert.equal(
      res.headers['access-control-allow-origin'],
      'https://elevora-bay.vercel.app',
      'Returns Access-Control-Allow-Origin matching exact requesting origin'
    );
    assert.equal(
      res.headers['access-control-allow-credentials'],
      'true',
      'Enforces Access-Control-Allow-Credentials: true'
    );
    assert.notEqual(
      res.headers['access-control-allow-origin'],
      '*',
      'Never uses wildcard * with credentialed CORS'
    );
    assert.ok(
      res.headers['access-control-allow-methods']?.includes('GET'),
      'Allows GET method in preflight'
    );
    assert.ok(
      res.headers['access-control-allow-headers']?.toLowerCase().includes('authorization'),
      'Allows authorization header in preflight'
    );

    recordPass('Preflight OPTIONS from https://elevora-bay.vercel.app returns 204 with correct CORS headers');
  }

  // 4.2 Development Origin OPTIONS Preflight
  {
    const { res } = await makeRequest({
      method: 'OPTIONS',
      path: '/api/auth/me',
      headers: {
        Origin: 'http://localhost:5173',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'content-type',
      },
    });

    assert.equal(res.statusCode, 204, 'Development preflight returns HTTP 204');
    assert.equal(
      res.headers['access-control-allow-origin'],
      'http://localhost:5173',
      'Returns dev origin in Access-Control-Allow-Origin'
    );
    assert.equal(res.headers['access-control-allow-credentials'], 'true', 'Includes credentials true for dev origin');

    recordPass('Preflight OPTIONS from http://localhost:5173 succeeds with credentials');
  }

  // 4.3 Unauthorized Origin Preflight Block
  {
    const { res } = await makeRequest({
      method: 'OPTIONS',
      path: '/api/auth/me',
      headers: {
        Origin: 'https://attacker-domain.org',
        'Access-Control-Request-Method': 'GET',
      },
    });

    assert.equal(
      res.headers['access-control-allow-origin'],
      undefined,
      'No Access-Control-Allow-Origin header is present for untrusted origin'
    );
    assert.notEqual(res.statusCode, 500, 'Does not throw unhandled 500 server crash on rejected origin');

    recordPass('Unauthorized origin receives no Access-Control-Allow-Origin header without crashing server');
  }

  // 4.4 Render Log Simulation: CLIENT_URL with trailing slash vs Browser Origin without trailing slash
  {
    // Simulate what happens in Render production where CLIENT_URL had trailing slash:
    const originalEnv = process.env.CLIENT_URL;
    try {
      process.env.CLIENT_URL = 'https://elevora-bay.vercel.app/';

      const { res } = await makeRequest({
        method: 'OPTIONS',
        path: '/api/auth/me',
        headers: {
          Origin: 'https://elevora-bay.vercel.app', // Browser sends clean origin without slash
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'content-type, authorization',
        },
      });

      assert.equal(res.statusCode, 204, 'Preflight succeeds even if CLIENT_URL had trailing slash');
      assert.equal(
        res.headers['access-control-allow-origin'],
        'https://elevora-bay.vercel.app',
        'Sets exact origin despite CLIENT_URL having a trailing slash'
      );
      assert.equal(res.headers['access-control-allow-credentials'], 'true');

      recordPass('Trailing slash on CLIENT_URL safely normalized: preflight passes access control check');
    } finally {
      if (originalEnv) process.env.CLIENT_URL = originalEnv;
      else delete process.env.CLIENT_URL;
    }
  }

} finally {
  await new Promise((resolve) => testServer.close(resolve));
}

// ─────────────────────────────────────────────────────────────
// 5. Testing isMainModule Guard & Import Safety (No Auto-Start)
// ─────────────────────────────────────────────────────────────
console.log('\n5. Testing isMainModule Guard & Test Isolation...');
{
  assert.equal(
    isMainModule,
    false,
    'isMainModule evaluates to false when server.js is imported as a module in tests'
  );

  const mongoose = (await import('mongoose')).default;
  assert.equal(
    mongoose.connection.readyState,
    0,
    'Importing server.js does not trigger unexpected connection to MongoDB'
  );

  recordPass('isMainModule guard successfully isolates Express app: zero unexpected port binding or DB connections');
}

console.log('\n======================================================');
console.log(`📊 CORS PREFLIGHT TESTS: ${passedTests} PASSED, 0 FAILED`);
console.log('======================================================\n');

