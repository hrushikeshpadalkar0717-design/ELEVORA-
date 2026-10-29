import jwt from 'jsonwebtoken';
import axios from 'axios';
import crypto from 'crypto';
import { User } from '../models/User.js';
import { sendEmail } from '../utils/sendEmail.js';
import { getJwtSecret } from '../middleware/authMiddleware.js';

// ─── Constants ────────────────────────────────────────────────────────────────

// Default primary client URL for redirects (safely extracts first domain if comma-separated list is provided)
const CLIENT_URL = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',')[0].trim()
  : 'http://localhost:5173';
const IS_PROD = process.env.NODE_ENV === 'production';
const SAME_SITE = process.env.COOKIE_SAME_SITE || (IS_PROD ? 'none' : 'lax');

// In-memory OAuth state store (per-process; works for single server instance)
// Each entry: { createdAt: Date }
const oauthStates = new Map();

// In-memory single-use OAuth exchange code store (expires in 60s)
// Maps: exchangeCode -> { token: string, createdAt: number }
const oauthExchangeCodes = new Map();

// Clean up states older than 10 minutes and exchange codes older than 60 seconds
const oauthCleanupTimer = setInterval(() => {
  const stateCutoff = Date.now() - 10 * 60 * 1000;
  for (const [key, val] of oauthStates.entries()) {
    if (val.createdAt < stateCutoff) oauthStates.delete(key);
  }

  const codeCutoff = Date.now() - 60 * 1000;
  for (const [key, val] of oauthExchangeCodes.entries()) {
    if (val.createdAt < codeCutoff) oauthExchangeCodes.delete(key);
  }
}, 30 * 1000);
if (oauthCleanupTimer.unref) oauthCleanupTimer.unref();

// ─── JWT helpers ──────────────────────────────────────────────────────────────

/** Sign a JWT containing only the user's MongoDB _id */
const generateToken = (id) =>
  jwt.sign({ id: id.toString() }, getJwtSecret(), { expiresIn: '30d' });

/**
 * Sets the JWT in an HttpOnly cookie AND returns it in the response body
 * so the frontend can also store it in localStorage for the Authorization header fallback.
 */
const setAuthCookie = (res, token) => {
  res.cookie('elevora_token', token, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: SAME_SITE,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
    path: '/',
  });
};

/** Clears the auth cookie */
const clearAuthCookie = (res) => {
  res.clearCookie('elevora_token', {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: SAME_SITE,
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
  hasCompletedOnboarding: Boolean(user.hasCompletedOnboarding && user.phone),
  careerGoal: user.careerGoal,
  activeTemplate: user.activeTemplate,
  plan: user.plan || 'free',
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
      hasCompletedOnboarding: true,
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
  const clientOrigin =
    req.query.client_url ||
    (req.headers.referer ? new URL(req.headers.referer).origin : null) ||
    CLIENT_URL;

  if (!clientId) {
    return res.redirect(`${clientOrigin}/login?error=google_not_configured`);
  }

  const state = crypto.randomBytes(24).toString('hex');
  oauthStates.set(state, { createdAt: Date.now(), provider: 'google', clientOrigin });

  const callbackUrl =
    process.env.GOOGLE_CALLBACK_URL ||
    `${req.protocol}://${req.get('host')}/api/auth/google/callback`;

  const promptParam = req.query.prompt || 'select_account';

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: callbackUrl,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    prompt: promptParam,
  });

  return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
};

// @route GET /api/auth/google/callback  — Google sends code here
export const googleCallback = async (req, res) => {
  const { code, state, error } = req.query;
  const stateData = state ? oauthStates.get(state) : null;
  const clientUrl = stateData?.clientOrigin || CLIENT_URL;

  if (error) {
    if (state) oauthStates.delete(state);
    return res.redirect(`${clientUrl}/login?error=google_denied`);
  }

  // Validate CSRF state
  if (!state || !stateData) {
    return res.redirect(`${clientUrl}/login?error=invalid_oauth_state`);
  }
  oauthStates.delete(state);

  if (!code) {
    return res.redirect(`${clientUrl}/login?error=no_auth_code`);
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const callbackUrl =
      process.env.GOOGLE_CALLBACK_URL ||
      `${req.protocol}://${req.get('host')}/api/auth/google/callback`;

    // Direct TLS code-for-tokens exchange with Google
    const tokenRes = await axios.post(
      'https://oauth2.googleapis.com/token',
      {
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: callbackUrl,
        grant_type: 'authorization_code',
      },
      { timeout: 8000 }
    );

    const idToken = tokenRes.data.id_token;
    if (!idToken) {
      return res.redirect(`${clientUrl}/login?error=google_no_id_token`);
    }

    // Decode ID token payload directly (already verified by TLS connection & client secret)
    const googleData = jwt.decode(idToken);
    if (!googleData || !googleData.sub) {
      return res.redirect(`${clientUrl}/login?error=google_token_invalid`);
    }

    // Validate token claims
    if (googleData.aud !== clientId) {
      console.error('Google token audience mismatch');
      return res.redirect(`${clientUrl}/login?error=google_token_invalid`);
    }

    const googleId = googleData.sub;
    const email = (googleData.email || '').toLowerCase();
    const fullName = googleData.name || `${googleData.given_name || ''} ${googleData.family_name || ''}`.trim() || 'Google User';
    const avatar = googleData.picture || '';

    // Find user by googleId first, then by verified email
    let user = await User.findOne({ googleId });
    let isNewUser = false;
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
          phone: '',
          hasCompletedOnboarding: false,
        });
        isNewUser = true;
      }
    }

    const needsOnboarding = isNewUser || !user.phone || !user.hasCompletedOnboarding;
    const elevoraToken = generateToken(user._id);
    setAuthCookie(res, elevoraToken);

    // Generate single-use, 60s exchange code to securely transfer session without exposing JWT in URL
    const exchangeCode = crypto.randomBytes(24).toString('hex');
    oauthExchangeCodes.set(exchangeCode, { token: elevoraToken, createdAt: Date.now() });

    return res.redirect(`${clientUrl}/auth/callback?code=${exchangeCode}&provider=google${needsOnboarding ? '&needsOnboarding=true' : ''}`);
  } catch (err) {
    console.error('Google callback error:', err.response?.data || err.message);
    const clientUrl = CLIENT_URL;
    return res.redirect(`${clientUrl}/login?error=google_auth_failed`);
  }
};

// ─── TASK 4: LinkedIn OIDC (Authorization Code Flow) ─────────────────────────

// @route GET /api/auth/linkedin  — redirects user to LinkedIn
export const linkedinAuthRedirect = (req, res) => {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientOrigin =
    req.query.client_url ||
    (req.headers.referer ? new URL(req.headers.referer).origin : null) ||
    CLIENT_URL;

  if (!clientId) {
    return res.redirect(`${clientOrigin}/login?error=linkedin_not_configured`);
  }

  const state = crypto.randomBytes(24).toString('hex');
  oauthStates.set(state, { createdAt: Date.now(), provider: 'linkedin', clientOrigin });

  const callbackUrl =
    process.env.LINKEDIN_CALLBACK_URL ||
    `${req.protocol}://${req.get('host')}/api/auth/linkedin/callback`;

  const promptParam = req.query.prompt || 'login';

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: callbackUrl,
    // OpenID Connect scopes for Sign In with LinkedIn v2
    scope: 'openid profile email',
    state,
    prompt: promptParam,
    max_age: '0',
  });

  return res.redirect(`https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`);
};

// @route GET /api/auth/linkedin/callback  — LinkedIn sends code here
export const linkedinCallback = async (req, res) => {
  const { code, state, error, error_description } = req.query;
  const stateData = state ? oauthStates.get(state) : null;
  const clientUrl = stateData?.clientOrigin || CLIENT_URL;

  if (error) {
    console.warn('LinkedIn OAuth error:', error, error_description);
    if (state) oauthStates.delete(state);
    return res.redirect(`${clientUrl}/login?error=linkedin_denied`);
  }

  // Validate CSRF state
  if (!state || !stateData) {
    return res.redirect(`${clientUrl}/login?error=invalid_oauth_state`);
  }
  oauthStates.delete(state);

  if (!code) {
    return res.redirect(`${clientUrl}/login?error=no_auth_code`);
  }

  try {
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
    const callbackUrl =
      process.env.LINKEDIN_CALLBACK_URL ||
      `${req.protocol}://${req.get('host')}/api/auth/linkedin/callback`;

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
    if (!accessToken && !tokenRes.data.id_token) {
      return res.redirect(`${clientUrl}/login?error=linkedin_no_access_token`);
    }

    // Try fast-decode ID token if returned by LinkedIn OIDC, otherwise query userinfo
    let liData = tokenRes.data.id_token ? jwt.decode(tokenRes.data.id_token) : null;
    if (!liData || !liData.sub) {
      const userInfoRes = await axios.get('https://api.linkedin.com/v2/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
        timeout: 8000,
      });
      liData = userInfoRes.data;
    }
    const linkedinId = liData.sub; // stable provider identifier
    if (!linkedinId) {
      return res.redirect(`${clientUrl}/login?error=linkedin_no_subject`);
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
          return res.redirect(`${clientUrl}/login?error=linkedin_no_email`);
        }
        user = await User.create({
          fullName,
          email,
          avatar,
          authProvider: 'linkedin',
          linkedinId,
          field: 'Engineering',
          subfield: 'CSE',
          phone: '',
          hasCompletedOnboarding: false,
        });
      }
    } else {
      // Update avatar if missing
      if (!user.avatar && avatar) {
        user.avatar = avatar;
        await user.save();
      }
    }

    const needsOnboarding = !user.phone || !user.hasCompletedOnboarding;
    const elevoraToken = generateToken(user._id);
    setAuthCookie(res, elevoraToken);

    // Generate single-use, 60s exchange code to securely transfer session without exposing JWT in URL
    const exchangeCode = crypto.randomBytes(24).toString('hex');
    oauthExchangeCodes.set(exchangeCode, { token: elevoraToken, createdAt: Date.now() });

    return res.redirect(`${clientUrl}/auth/callback?code=${exchangeCode}&provider=linkedin${needsOnboarding ? '&needsOnboarding=true' : ''}`);
  } catch (err) {
    console.error('LinkedIn callback error:', err.response?.data || err.message);
    return res.redirect(`${clientUrl}/login?error=linkedin_auth_failed`);
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
      hasCompletedOnboarding,
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
    if (hasCompletedOnboarding !== undefined) user.hasCompletedOnboarding = hasCompletedOnboarding;

    const updatedUser = await user.save();
    return res.json(safeUser(updatedUser, null));
  } catch (error) {
    console.error('Update profile error:', error.message);
    return res.status(500).json({ message: error.message || 'Error updating user profile' });
  }
};

// ─── TASK 6: Forgot & Reset Password ──────────────────────────────────────────

// @route POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Please provide an email address' });
    }

    const emailLower = email.toLowerCase().trim();
    const user = await User.findOne({ email: emailLower });

    if (!user) {
      // For security, avoid user enumeration, but return a friendly success confirmation
      return res.json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been dispatched.',
      });
    }

    if (user.authProvider !== 'local' && !user.password) {
      return res.status(400).json({
        message: `This account signs in using ${user.authProvider}. Please use the social login button.`,
      });
    }

    // Generate unhashed reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash token for database storage
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set token & expiry (30 minutes)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
    await user.save();

    // Construct reset URL pointing to frontend
    const clientUrl = req.headers.origin || CLIENT_URL;
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    const textMessage = `Hello ${user.fullName || 'User'},\n\nYou requested a password reset for your ELEVORA account.\n\nPlease click the link below or paste it into your browser to reset your password:\n${resetUrl}\n\nThis link will expire in 30 minutes.\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n\nBest regards,\nThe ELEVORA Team`;

    const htmlMessage = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="margin-bottom: 24px; text-align: center;">
          <div style="display: inline-block; width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #2563eb, #4f46e5); color: #ffffff; font-weight: 800; font-size: 20px; line-height: 44px; text-align: center;">E</div>
          <h2 style="color: #0f172a; margin-top: 12px; margin-bottom: 4px; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">Reset Your ELEVORA Password</h2>
          <p style="color: #64748b; font-size: 13px; margin: 0;">Smart AI Resume & Career Builder</p>
        </div>

        <p style="color: #334155; font-size: 14px; line-height: 1.6;">Hello <strong>${user.fullName || 'there'}</strong>,</p>
        <p style="color: #334155; font-size: 14px; line-height: 1.6;">We received a request to reset your password for your ELEVORA account. Click the button below to choose a new password:</p>

        <div style="text-align: center; margin: 28px 0;">
          <a href="${resetUrl}" style="background-color: #2563eb; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 28px; border-radius: 10px; display: inline-block; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);">Reset Password</a>
        </div>

        <p style="color: #64748b; font-size: 12px; line-height: 1.5;">This link will expire in <strong>30 minutes</strong>. If you did not make this request, you can safely ignore this email.</p>
        <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #f1f5f9; font-size: 11px; color: #94a3b8; word-break: break-all;">
          If the button doesn't work, copy and paste this link: <br/>
          <a href="${resetUrl}" style="color: #2563eb;">${resetUrl}</a>
        </div>
      </div>
    `;

    const mailResult = await sendEmail({
      to: user.email,
      subject: 'Password Reset Request — ELEVORA',
      text: textMessage,
      html: htmlMessage,
    });

    return res.json({
      success: true,
      message: mailResult?.isRealSmtp
        ? 'Password reset link has been dispatched to your email address.'
        : 'Password reset link generated! In local sandbox mode, a test inbox preview is provided.',
      isRealSmtp: mailResult?.isRealSmtp || false,
      previewUrl: mailResult?.previewUrl || null,
      resetUrl,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: error.message || 'Error processing password reset request' });
  }
};

// @route PUT /api/auth/reset-password/:token
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Reset token is required' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    // Hash the token from the URL to compare with hashed token in DB
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired password reset token' });
    }

    // Set new password (pre-save hook will hash it with bcrypt)
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();

    return res.json({
      success: true,
      message: 'Password has been reset successfully! You can now log in with your new password.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ message: error.message || 'Error resetting password' });
  }
};

// ─── TASK 7: Exchange one-time OAuth authorization code for session ──────────

// @route POST /api/auth/oauth-exchange
export const exchangeOAuthCode = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: 'Authorization code is required' });
    }

    const entry = oauthExchangeCodes.get(code);
    if (!entry) {
      return res.status(401).json({ message: 'Invalid or expired authorization code' });
    }

    // Burn immediately — single use
    oauthExchangeCodes.delete(code);

    if (Date.now() - entry.createdAt > 60 * 1000) {
      return res.status(401).json({ message: 'Authorization code has expired' });
    }

    const secret = getJwtSecret();
    const decoded = jwt.verify(entry.token, secret);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User account not found' });
    }

    // Re-ensure HttpOnly cookie is set
    setAuthCookie(res, entry.token);

    return res.json(safeUser(user, entry.token));
  } catch (error) {
    console.error('OAuth exchange error:', error.message);
    return res.status(500).json({ message: 'Failed to complete OAuth authentication' });
  }
};


