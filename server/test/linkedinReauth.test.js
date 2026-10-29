import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..', '..');

console.log('======================================================');
console.log('🧪 ELEVORA: LINKEDIN REAUTHENTICATION & ACCOUNT SWITCHING TESTS');
console.log('======================================================\n');

let passedTests = 0;
const recordPass = (msg) => {
  console.log(`  ✅ PASS: ${msg}`);
  passedTests++;
};

// 1. Static Source Inspection of OAuth Redirect Generators
console.log('1. Verifying Re-Authentication OIDC Parameters in authController.js...');
const authControllerPath = path.join(__dirname, '../controllers/authController.js');
const authSource = fs.readFileSync(authControllerPath, 'utf8');

// LinkedIn parameters
assert.ok(authSource.includes("prompt: promptParam"), 'LinkedIn redirect must pass prompt parameter');
assert.ok(authSource.includes("max_age: '0'"), 'LinkedIn redirect must pass max_age=0');
assert.ok(authSource.includes("scope: 'openid profile email'"), 'LinkedIn redirect must request openid profile email');
recordPass('LinkedIn authorization request includes prompt=login and max_age=0 to demand fresh authentication');

// Google parameters
assert.ok(authSource.includes("prompt: promptParam"), 'Google redirect must pass prompt parameter');
assert.ok(authSource.includes("'select_account'"), 'Google redirect defaults to select_account');
recordPass('Google authorization request includes prompt=select_account for account chooser');

// 2. Simulating LinkedIn Authorization URL Generation
console.log('\n2. Testing LinkedIn Authorization URL Construction...');
{
  const mockReq = {
    protocol: 'http',
    get: (header) => (header === 'host' ? 'localhost:5000' : null),
    query: { client_url: 'http://localhost:5173' },
    headers: {},
  };

  let redirectedUrl = null;
  const mockRes = {
    redirect: (url) => { redirectedUrl = url; },
  };

  // Set mock environment
  process.env.LINKEDIN_CLIENT_ID = 'test_linkedin_client_123';
  process.env.LINKEDIN_CALLBACK_URL = 'http://localhost:5000/api/auth/linkedin/callback';

  const { linkedinAuthRedirect } = await import('../controllers/authController.js');
  linkedinAuthRedirect(mockReq, mockRes);

  assert.ok(redirectedUrl, 'Must redirect to LinkedIn authorization endpoint');
  const parsed = new URL(redirectedUrl);
  assert.equal(parsed.origin, 'https://www.linkedin.com');
  assert.equal(parsed.pathname, '/oauth/v2/authorization');
  assert.equal(parsed.searchParams.get('response_type'), 'code');
  assert.equal(parsed.searchParams.get('client_id'), 'test_linkedin_client_123');
  assert.equal(parsed.searchParams.get('redirect_uri'), 'http://localhost:5000/api/auth/linkedin/callback');
  assert.equal(parsed.searchParams.get('scope'), 'openid profile email');
  assert.equal(parsed.searchParams.get('prompt'), 'login');
  assert.equal(parsed.searchParams.get('max_age'), '0');
  assert.ok(parsed.searchParams.get('state'), 'Must include cryptographically random state parameter');

  recordPass('Generated LinkedIn URL contains exact OpenID Connect reauthentication parameters (prompt=login, max_age=0)');
}

// 3. Testing OAuth CSRF State Validation & Single-Use Enforcement
console.log('\n3. Testing OAuth CSRF State Protection...');
{
  const { linkedinCallback } = await import('../controllers/authController.js');

  // 3.1 Rejected when state is missing
  let redirectMissingState = null;
  await linkedinCallback(
    { query: { code: 'test_code' } },
    { redirect: (url) => { redirectMissingState = url; } }
  );
  assert.ok(redirectMissingState.includes('error=invalid_oauth_state'), 'Missing state must be rejected');
  recordPass('Missing OAuth state is immediately rejected with error=invalid_oauth_state');

  // 3.2 Rejected when state is invalid/tampered
  let redirectInvalidState = null;
  await linkedinCallback(
    { query: { code: 'test_code', state: 'tampered_state_hex_abc123' } },
    { redirect: (url) => { redirectInvalidState = url; } }
  );
  assert.ok(redirectInvalidState.includes('error=invalid_oauth_state'), 'Tampered state must be rejected');
  recordPass('Forged/expired OAuth state is rejected with error=invalid_oauth_state');

  // 3.3 Provider cancellation/error handling
  let redirectCancelled = null;
  await linkedinCallback(
    { query: { error: 'user_cancelled_login', error_description: 'The user cancelled' } },
    { redirect: (url) => { redirectCancelled = url; } }
  );
  assert.ok(redirectCancelled.includes('error=linkedin_denied'), 'Cancelled OAuth must redirect with error=linkedin_denied');
  assert.ok(!redirectCancelled.includes('token='), 'Cancelled OAuth must never expose token');
  recordPass('Cancelled OAuth attempt is safely redirected with error=linkedin_denied and zero tokens');
}

// 4. Testing ELEVORA Logout Session Clearing & Provider Boundary
console.log('\n4. Testing Logout & Session Clearing...');
{
  let clearedCookieName = null;
  let clearedOptions = null;
  let jsonResult = null;

  const mockRes = {
    clearCookie: (name, opts) => {
      clearedCookieName = name;
      clearedOptions = opts;
    },
    json: (body) => { jsonResult = body; },
  };

  const { logoutUser } = await import('../controllers/authController.js');
  logoutUser({}, mockRes);

  assert.equal(clearedCookieName, 'elevora_token', 'Must clear elevora_token cookie');
  assert.equal(clearedOptions.httpOnly, true, 'Clear options must specify httpOnly: true');
  assert.equal(clearedOptions.path, '/', 'Clear options must specify path: /');
  assert.equal(jsonResult.message, 'Logged out successfully', 'Returns logout confirmation message');
  recordPass('Logout controller revokes elevora_token HttpOnly cookie and session');
}

// 5. Testing Frontend Account Switching UI Elements in AuthPage.jsx
console.log('\n5. Testing Account-Switching UI in AuthPage.jsx...');
{
  const authPagePath = path.join(rootDir, 'src', 'pages', 'Auth', 'AuthPage.jsx');
  const authPageSource = fs.readFileSync(authPagePath, 'utf8');

  assert.ok(
    authPageSource.includes('Need to switch or use another LinkedIn account?'),
    'Must provide account switching link for LinkedIn'
  );
  assert.ok(
    authPageSource.includes('Switching LinkedIn Accounts'),
    'Must render Account Switching Modal'
  );
  assert.ok(
    authPageSource.includes('https://www.linkedin.com/m/logout'),
    'Must provide direct link to sign out of LinkedIn.com'
  );
  assert.ok(
    authPageSource.includes('Use a Private / Incognito Window'),
    'Must provide instructions on using Incognito/Private window'
  );
  assert.ok(
    authPageSource.includes('Request Re-Authentication'),
    'Must explain re-authentication prompt behavior'
  );
  recordPass('Frontend AuthPage implements complete account-switching guidance and modal');
}

// 6. Testing Frontend API Service OAuth URL Generator
console.log('\n6. Testing Frontend api.js OAuth URL Generator...');
{
  const apiPath = path.join(rootDir, 'src', 'services', 'api.js');
  const apiSource = fs.readFileSync(apiPath, 'utf8');

  assert.ok(
    apiSource.includes('getLinkedInAuthUrl(clientOrigin = window.location.origin, options = {})'),
    'getLinkedInAuthUrl must accept options parameter'
  );
  assert.ok(
    apiSource.includes('getGoogleAuthUrl(clientOrigin = window.location.origin, options = {})'),
    'getGoogleAuthUrl must accept options parameter'
  );
  recordPass('api.js supports parameterized prompt options for LinkedIn and Google');
}

console.log('\n======================================================');
console.log(`📊 LINKEDIN REAUTH TESTS: ${passedTests} PASSED, 0 FAILED`);
console.log('======================================================\n');
process.exit(0);
