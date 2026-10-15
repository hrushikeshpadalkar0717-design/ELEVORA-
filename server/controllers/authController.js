import jwt from 'jsonwebtoken';
import axios from 'axios';
import crypto from 'crypto';
import { User } from '../models/User.js';

// ─── Constants ────────────────────────────────────────────────────────────────

const JWT_SECRET = process.env.JWT_SECRET || 'elevora_fallback_jwt_secret_key_2026';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5174';
const IS_PROD = process.env.NODE_ENV === 'production';

// In-memory OAuth state store (per-process; works for single server instance)
// Each entry: { createdAt: Date }
const oauthStates = new Map();

// Clean up states older than 10 minutes
setInterval(() => {
  const cutoff = Date.now() - 10 * 60 * 1000;
  for (const [key, val] of oauthStates.entries()) {
    if (val.createdAt < cutoff) oauthStates.delete(key);
  }
}, 5 * 60 * 1000);

// ─── JWT helpers ──────────────────────────────────────────────────────────────

/** Sign a JWT containing only the user's MongoDB _id */
const generateToken = (id) =>
  jwt.sign({ id: id.toString() }, JWT_SECRET, { expiresIn: '30d' });

/**
 * Sets the JWT in an HttpOnly cookie AND returns it in the response body
 * so the frontend can also store it in localStorage for the Authorization header fallback.
 */
const setAuthCookie = (res, token) => {
  res.cookie('elevora_token', token, {
    httpOnly: true,
    secure: IS_PROD,           // HTTPS only in production
    sameSite: IS_PROD ? 'Strict' : 'Lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
    path: '/',
  });
};

/** Clears the auth cookie */
const clearAuthCookie = (res) => {
  res.clearCookie('elevora_token', {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: IS_PROD ? 'Strict' : 'Lax',
    path: '/',
  });
};

/** Safe user shape — never expose password hash */
const safeUser = (user, token) => ({
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone || '',
  field: user.field || '',
  subfield: user.subfield || '',
  location: user.location || '',
  linkedin: user.linkedin || '',
  portfolio: user.portfolio || '',
  github: user.github || '',
  avatar: user.avatar || '',
  authProvider: user.authProvider,
  careerGoal: user.careerGoal,
  activeTemplate: user.activeTemplate,
  token, // included for localStorage fallback compatibility
});

// ─── TASK 1: Local email/password auth ────────────────────────────────────────

// @route POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, phone, field, subfield } = req.body;

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ message: 'Full name is required' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Email address is required' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const emailLower = email.toLowerCase().trim();

    const existing = await User.findOne({ email: emailLower });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    // Password is hashed automatically by the User model pre-save hook
    const user = await User.create({
      fullName: fullName.trim(),
      email: emailLower,
      password, // pre-save hook will hash it
      phone: phone || '',
      field: field || 'Engineering',
      subfield: subfield || 'CSE',
      authProvider: 'local',
    });

    const token = generateToken(user._id);
    setAuthCookie(res, token);

    return res.status(201).json({
      ...safeUser(user, token),
      message: 'Account created successfully',
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    return res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

// @route POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Email address is required' });
    }
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const emailLower = email.toLowerCase().trim();

    // Always select password for comparison; never expose it in response
    const user = await User.findOne({ email: emailLower }).select('+password');
    if (!user) {
      // Generic message to prevent user enumeration
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Social-auth accounts have no password — local login not allowed for them
    if (user.authProvider !== 'local' && !user.password) {
      return res.status(401).json({
        message: `This account uses ${user.authProvider} sign-in. Please use the social login button.`,
      });
    }

    // *** ROOT CAUSE FIX: always verify password — no bypass ***
    if (!user.password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    setAuthCookie(res, token);

    return res.json(safeUser(user, token));
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

// @route POST /api/auth/logout
export const logoutUser = (req, res) => {
  clearAuthCookie(res);
  return res.json({ message: 'Logged out successfully' });
};

// ─── TASK 2–3: Google OAuth (Authorization Code Flow) ─────────────────────────

// @route GET /api/auth/google  — redirects user to Google
export const googleAuthRedirect = (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return res.redirect(`${CLIENT_URL}/login?error=google_not_configured`);
  }

  const state = crypto.randomBytes(24).toString('hex');
  oauthStates.set(state, { createdAt: Date.now(), provider: 'google' });

  const callbackUrl = `${req.protocol}://${req.get('host')}/api/auth/google/callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: callbackUrl,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'offline',
    prompt: 'select_account',
  });

  return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
};

// @route GET /api/auth/google/callback  — Google sends code here
export const googleCallback = async (req, res) => {
  const { code, state, error } = req.query;

  if (error) {
    return res.redirect(`${CLIENT_URL}/login?error=google_denied`);
  }

  // Validate CSRF state
  if (!state || !oauthStates.has(state)) {
    return res.redirect(`${CLIENT_URL}/login?error=invalid_oauth_state`);
  }
  oauthStates.delete(state);

  if (!code) {
    return res.redirect(`${CLIENT_URL}/login?error=no_auth_code`);
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const callbackUrl = `${req.protocol}://${req.get('host')}/api/auth/google/callback`;

    // Exchange code for tokens
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: callbackUrl,
      grant_type: 'authorization_code',
    });

    const idToken = tokenRes.data.id_token;
    if (!idToken) {
      return res.redirect(`${CLIENT_URL}/login?error=google_no_id_token`);
    }

    // Verify ID token with Google's tokeninfo endpoint (server-side verification)
    const verifyRes = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
    );
    const googleData = verifyRes.data;

    // Validate token claims
    if (googleData.aud !== clientId) {
      console.error('Google token audience mismatch');
      return res.redirect(`${CLIENT_URL}/login?error=google_token_invalid`);
    }
    if (!googleData.email_verified || googleData.email_verified === 'false') {
      return res.redirect(`${CLIENT_URL}/login?error=google_email_not_verified`);
    }

    const googleId = googleData.sub;
    const email = googleData.email.toLowerCase();
    const fullName = googleData.name || `${googleData.given_name || ''} ${googleData.family_name || ''}`.trim();
    const avatar = googleData.picture || '';

    // Find user by googleId first, then by verified email
    let user = await User.findOne({ googleId });
    if (!user) {
      // Check for an existing local account with the same email
      const emailUser = await User.findOne({ email });
      if (emailUser) {
        // Link Google to existing account (safe: Google has verified email ownership)
        emailUser.googleId = googleId;
        if (!emailUser.avatar) emailUser.avatar = avatar;
        await emailUser.save();
        user = emailUser;
      } else {
        // Create new account
        user = await User.create({
          fullName,
          email,
          avatar,
          authProvider: 'google',
          googleId,
          field: 'Engineering',
          subfield: 'CSE',
        });
      }
    }

    const elevoraToken = generateToken(user._id);
    setAuthCookie(res, elevoraToken);

    // Redirect to frontend with token in query param (one-time pickup by frontend)
    return res.redirect(`${CLIENT_URL}/auth/callback?token=${elevoraToken}&provider=google`);
  } catch (err) {
    console.error('Google callback error:', err.response?.data || err.message);
    return res.redirect(`${CLIENT_URL}/login?error=google_auth_failed`);
  }
};

// ─── TASK 4: LinkedIn OIDC (Authorization Code Flow) ─────────────────────────

// @route GET /api/auth/linkedin  — redirects user to LinkedIn
export const linkedinAuthRedirect = (req, res) => {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  if (!clientId) {
    return res.redirect(`${CLIENT_URL}/login?error=linkedin_not_configured`);
  }

  const state = crypto.randomBytes(24).toString('hex');
  oauthStates.set(state, { createdAt: Date.now(), provider: 'linkedin' });

  const callbackUrl = `${req.protocol}://${req.get('host')}/api/auth/linkedin/callback`;
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: callbackUrl,
    // OpenID Connect scopes for Sign In with LinkedIn v2
    scope: 'openid profile email',
    state,
  });

  return res.redirect(`https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`);
};

// @route GET /api/auth/linkedin/callback  — LinkedIn sends code here
export const linkedinCallback = async (req, res) => {
  const { code, state, error, error_description } = req.query;

  if (error) {
    console.warn('LinkedIn OAuth error:', error, error_description);
    return res.redirect(`${CLIENT_URL}/login?error=linkedin_denied`);
  }

  // Validate CSRF state
  if (!state || !oauthStates.has(state)) {
    return res.redirect(`${CLIENT_URL}/login?error=invalid_oauth_state`);
  }
  oauthStates.delete(state);

  if (!code) {
    return res.redirect(`${CLIENT_URL}/login?error=no_auth_code`);
  }

  try {
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
    const callbackUrl = `${req.protocol}://${req.get('host')}/api/auth/linkedin/callback`;

    // Exchange code for access token
    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: callbackUrl,
      client_id: clientId,
      client_secret: clientSecret,
    });

    const tokenRes = await axios.post(
      'https://www.linkedin.com/oauth/v2/accessToken',
      tokenParams.toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const accessToken = tokenRes.data.access_token;
    if (!accessToken) {
      return res.redirect(`${CLIENT_URL}/login?error=linkedin_no_access_token`);
    }

    // Fetch user info from LinkedIn OIDC UserInfo endpoint
    // This is the correct endpoint for Sign In with LinkedIn using OpenID Connect v2
    const userInfoRes = await axios.get('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const liData = userInfoRes.data;
    const linkedinId = liData.sub; // stable provider identifier
    if (!linkedinId) {
      return res.redirect(`${CLIENT_URL}/login?error=linkedin_no_subject`);
    }

    const email = liData.email ? liData.email.toLowerCase() : null;
    const fullName = liData.name || `${liData.given_name || ''} ${liData.family_name || ''}`.trim() || 'LinkedIn User';
    const avatar = liData.picture || '';

    // Find user by stable LinkedIn subject identifier
    let user = await User.findOne({ linkedinId });
    if (!user) {
      if (email) {
        // Check for existing account with same verified email
        const emailUser = await User.findOne({ email });
        if (emailUser) {
          emailUser.linkedinId = linkedinId;
          if (!emailUser.avatar) emailUser.avatar = avatar;
          await emailUser.save();
          user = emailUser;
        }
      }
      if (!user) {
        if (!email) {
          // LinkedIn didn't provide an email — can't create account safely
          return res.redirect(`${CLIENT_URL}/login?error=linkedin_no_email`);
        }
        user = await User.create({
          fullName,
          email,
          avatar,
          authProvider: 'linkedin',
          linkedinId,
          field: 'Engineering',
          subfield: 'CSE',
        });
      }
    } else {
      // Update avatar if missing
      if (!user.avatar && avatar) {
        user.avatar = avatar;
        await user.save();
      }
    }

    const elevoraToken = generateToken(user._id);
    setAuthCookie(res, elevoraToken);

    return res.redirect(`${CLIENT_URL}/auth/callback?token=${elevoraToken}&provider=linkedin`);
  } catch (err) {
    console.error('LinkedIn callback error:', err.response?.data || err.message);
    return res.redirect(`${CLIENT_URL}/login?error=linkedin_auth_failed`);
  }
};

// ─── TASK 5: Get current authenticated user ───────────────────────────────────

// @route GET /api/auth/me  (protected)
export const getCurrentUser = async (req, res) => {
  try {
    // req.user is set by the protect middleware
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(safeUser(user, null));
  } catch (error) {
    console.error('Get profile error:', error.message);
    return res.status(500).json({ message: 'Error retrieving user profile' });
  }
};

// @route PUT /api/auth/profile  (protected)
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const {
      fullName, phone, field, subfield, location,
      linkedin, portfolio, github, avatar, careerGoal, activeTemplate,
    } = req.body;

    if (fullName !== undefined) user.fullName = fullName;
    if (phone !== undefined) user.phone = phone;
    if (field !== undefined) user.field = field;
    if (subfield !== undefined) user.subfield = subfield;
    if (location !== undefined) user.location = location;
    if (linkedin !== undefined) user.linkedin = linkedin;
    if (portfolio !== undefined) user.portfolio = portfolio;
    if (github !== undefined) user.github = github;
    if (avatar !== undefined) user.avatar = avatar;
    if (careerGoal !== undefined) user.careerGoal = { ...user.careerGoal, ...careerGoal };
    if (activeTemplate !== undefined) user.activeTemplate = activeTemplate;

    const updatedUser = await user.save();
    return res.json(safeUser(updatedUser, null));
  } catch (error) {
    console.error('Update profile error:', error.message);
    return res.status(500).json({ message: error.message || 'Error updating user profile' });
  }
};
