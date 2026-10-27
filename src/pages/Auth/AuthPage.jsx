import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams, NavLink } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  FileText,
  User,
  Mail,
  Phone,
  Lock,
  Laptop,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Info,
  ExternalLink,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { useResume } from '../../context/ResumeContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { MAIN_FIELDS, getSubfields, getFieldDisplayLabel } from '../../data/careerTaxonomy';

export const AuthPage = ({ initialMode = 'signup' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login, signup, isAuthenticated } = useResume();
  const { showToast } = useToast();

  const isSignUpDefault = initialMode === 'signup' || location.pathname.includes('signup');
  const [isSignUp, setIsSignUp] = useState(isSignUpDefault);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null); // 'Google' | 'LinkedIn' | null

  // Sign up fields
  const [signUpForm, setSignUpForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    field: 'Engineering',
    subfield: 'CSE',
    password: '',
  });

  // Log in fields
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  // Forgot password modal state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotResult, setForgotResult] = useState(null);

  // Redirect already authenticated users away from /login and /signup
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Display OAuth error if redirected with query param
  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      let msg = 'Authentication error. Please try again.';
      if (error === 'google_denied') msg = 'Google sign-in was cancelled.';
      else if (error === 'linkedin_denied') msg = 'LinkedIn sign-in was cancelled.';
      else if (error === 'google_not_configured') msg = 'Google OAuth is not configured on the server.';
      else if (error === 'linkedin_not_configured') msg = 'LinkedIn OAuth is not configured on the server.';
      else if (error === 'invalid_oauth_state') msg = 'Authentication session expired. Please retry.';
      else if (error === 'google_auth_failed') msg = 'Failed to authenticate with Google.';
      else if (error === 'linkedin_auth_failed') msg = 'Failed to authenticate with LinkedIn.';
      showToast(msg, 'error');
    }
  }, [searchParams, showToast]);

  // Build field options using emoji labels from taxonomy
  const fieldOptions = MAIN_FIELDS.map((f) => getFieldDisplayLabel(f));

  // Map display label back to raw key
  const rawFieldFromDisplay = (display) =>
    MAIN_FIELDS.find((f) => getFieldDisplayLabel(f) === display) || display;

  // Subfields for the currently selected field (raw key)
  const currentSubfields = getSubfields(signUpForm.field);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!signUpForm.fullName.trim() || !signUpForm.email.trim()) {
      showToast('Please enter your full name and email', 'error');
      return;
    }
    if (!signUpForm.password || signUpForm.password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await signup(signUpForm);
      showToast('Account created successfully! Welcome to ELEVORA.', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.message || 'Error signing up', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginForm.email.trim()) {
      showToast('Please enter your email', 'error');
      return;
    }
    if (!loginForm.password) {
      showToast('Please enter your password', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email: loginForm.email, password: loginForm.password });
      showToast('Welcome back to ELEVORA!', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.message || 'Invalid email or password', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialAuth = (provider) => {
    try {
      setSocialLoading(provider);
      if (provider === 'Google') {
        window.location.href = api.getGoogleAuthUrl(window.location.origin);
      } else if (provider === 'LinkedIn') {
        window.location.href = api.getLinkedInAuthUrl(window.location.origin);
      }
    } catch {
      setSocialLoading(null);
      showToast(`Could not initialize ${provider} sign-in`, 'error');
    }
  };

  const handleOpenForgotModal = (e) => {
    e?.preventDefault();
    setForgotEmail(loginForm.email || '');
    setForgotSuccess(false);
    setForgotError('');
    setForgotResult(null);
    setIsForgotModalOpen(true);
  };

  const handleSendPasswordReset = async (e) => {
    e?.preventDefault();
    if (!forgotEmail || !forgotEmail.trim()) {
      setForgotError('Please enter your account email address.');
      return;
    }

    setForgotLoading(true);
    setForgotError('');
    try {
      const res = await api.forgotPassword(forgotEmail.trim());
      setForgotResult(res);
      setForgotSuccess(true);
      showToast(res.message || 'Password reset link sent to your email!', 'success');
    } catch (err) {
      setForgotError(err.message || 'Failed to dispatch reset link');
      showToast(err.message || 'Error sending reset email', 'error');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f8fd] flex flex-col justify-center items-center p-4 sm:p-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* Left Side: Brand & Marketing Panel (5 cols) matching panel 1 */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-50/90 via-indigo-50/70 to-slate-100 p-8 sm:p-10 flex flex-col justify-between text-left border-r border-slate-200/80 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />

          <div>
            {/* Logo */}
            <NavLink to="/" className="inline-flex items-center gap-2.5 mb-8">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <span className="font-extrabold text-lg">E</span>
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900">ELEVORA</span>
            </NavLink>

            {/* Heading */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Your Dream Career <br />
              <span className="text-blue-600">Starts with a Great Resume</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 mt-3 leading-relaxed">
              Create, customize, and optimize your resume with the power of AI.
            </p>

            {/* Feature Bullets */}
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">AI-Powered Resume Generation</h4>
                  <p className="text-[11px] text-slate-500">Tailored to your profile and goals</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">ATS Optimization</h4>
                  <p className="text-[11px] text-slate-500">Improve your chances of getting shortlisted</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Multiple Templates</h4>
                  <p className="text-[11px] text-slate-500">Modern, professional and industry-specific</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Laptop Illustration card at bottom */}
          <div className="mt-8 pt-6 border-t border-slate-200/60 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-blue-600">
              <Laptop className="w-6 h-6" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-slate-800 block">50,000+ Candidates Placed</span>
              <span className="text-[11px] text-slate-500">Top tech & engineering roles</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form (7 cols) */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center text-left">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {isSignUp ? 'Create Your Account' : 'Welcome Back!'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {isSignUp
                ? "Let's get started! Fill in your details to continue."
                : 'Log in to continue building your future.'}
            </p>
          </div>

          {/* Sign Up Form */}
          {isSignUp ? (
            <form onSubmit={handleSignUp} className="space-y-4">
              <Input
                label="Full Name"
                value={signUpForm.fullName}
                onChange={(e) => setSignUpForm({ ...signUpForm, fullName: e.target.value })}
                placeholder="Your Full Name"
                icon={User}
                required
              />

              <Input
                label="Email Address"
                type="email"
                value={signUpForm.email}
                onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                placeholder="username@gmail.com"
                icon={Mail}
                required
              />

              <Input
                label="Phone Number (Optional)"
                value={signUpForm.phone}
                onChange={(e) => setSignUpForm({ ...signUpForm, phone: e.target.value })}
                placeholder="+91 XXXXX XXXXX"
                icon={Phone}
              />

              <Input
                label="Create Password"
                type="password"
                value={signUpForm.password}
                onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                placeholder="••••••••"
                icon={Lock}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Select
                  label="Select Field"
                  value={getFieldDisplayLabel(signUpForm.field)}
                  onChange={(e) => {
                    const rawField = rawFieldFromDisplay(e.target.value);
                    const firstSub = getSubfields(rawField)[0] || 'CSE';
                    setSignUpForm({ ...signUpForm, field: rawField, subfield: firstSub });
                  }}
                  options={fieldOptions}
                />

                <Select
                  label="Select Sub-field"
                  value={signUpForm.subfield}
                  onChange={(e) => setSignUpForm({ ...signUpForm, subfield: e.target.value })}
                  options={currentSubfields}
                />
              </div>

              <Button
                variant="primary"
                size="md"
                type="submit"
                disabled={isSubmitting || !!socialLoading}
                className="w-full mt-2 font-bold shadow-sm flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Sign Up</span>
                )}
              </Button>
            </form>
          ) : (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                placeholder="username@gmail.com"
                icon={Mail}
                required
              />

              <div>
                <Input
                  label="Password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="••••••••"
                  icon={Lock}
                  required
                />
                <div className="text-right mt-1">
                  <button
                    type="button"
                    onClick={handleOpenForgotModal}
                    className="text-xs text-blue-600 hover:text-blue-700 hover:underline font-medium cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              <Button
                variant="primary"
                size="md"
                type="submit"
                disabled={isSubmitting || !!socialLoading}
                className="w-full mt-2 font-bold shadow-sm flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Logging In...</span>
                  </>
                ) : (
                  <span>Log In</span>
                )}
              </Button>
            </form>
          )}

          {/* Social Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-3 text-xs text-slate-400 uppercase tracking-wider">or</span>
          </div>

          {/* Social Buttons with Authorization Code Flow */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              disabled={isSubmitting || !!socialLoading}
              onClick={() => handleSocialAuth('Google')}
              className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {socialLoading === 'Google' ? (
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              )}
              <span>{socialLoading === 'Google' ? 'Redirecting...' : 'Continue with Google'}</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting || !!socialLoading}
              onClick={() => handleSocialAuth('LinkedIn')}
              className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {socialLoading === 'LinkedIn' ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#0A66C2]" />
              ) : (
                <svg className="w-4 h-4 fill-[#0A66C2]" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.39 9.74v-8.37H5.07v8.37h2.78z" />
                </svg>
              )}
              <span>{socialLoading === 'LinkedIn' ? 'Redirecting...' : 'Continue with LinkedIn'}</span>
            </button>
          </div>

          {/* Toggle Login / Sign Up */}
          <div className="mt-6 text-center text-xs text-slate-500">
            {isSignUp ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="font-bold text-blue-600 hover:underline ml-1 cursor-pointer"
                >
                  Log In
                </button>
              </p>
            ) : (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="font-bold text-blue-600 hover:underline ml-1 cursor-pointer"
                >
                  Sign Up
                </button>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        title={forgotSuccess ? 'Reset Link Dispatched' : 'Reset Your Password'}
        subtitle={forgotSuccess ? 'Check your email inbox' : 'Enter your registered email to receive a reset link'}
        maxWidth="max-w-md"
      >
        {forgotSuccess ? (
          <div className="py-2 text-center animate-in fade-in">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-emerald-100 shadow-sm">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-800 mb-1">Check Your Inbox</h4>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              We dispatched a password reset link to <strong className="text-slate-900">{forgotEmail}</strong>. Follow the link to choose a new password. The link is valid for 30 minutes.
            </p>

            {/* Sandbox helper when real SMTP credentials are not yet configured */}
            {!forgotResult?.isRealSmtp && (
              <div className="p-3.5 bg-blue-50/80 rounded-2xl border border-blue-200/80 text-xs text-blue-900 text-left mb-4 shadow-xs">
                <div className="flex items-center gap-1.5 font-bold text-blue-800 mb-1">
                  <Info className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Developer Sandbox Active</span>
                </div>
                <p className="text-blue-700 leading-relaxed mb-2.5">
                  Real SMTP is not configured in <code className="bg-blue-100/80 px-1 py-0.5 rounded text-[11px] font-mono">server/.env</code>. The reset email was caught by the local test sandbox.
                </p>
                <div className="space-y-1.5 pt-1 border-t border-blue-200/60">
                  {forgotResult?.previewUrl && (
                    <a
                      href={forgotResult.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-bold hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      View Sent Email in Ethereal Sandbox →
                    </a>
                  )}
                  {forgotResult?.resetUrl && (
                    <a
                      href={forgotResult.resetUrl}
                      className="block text-indigo-600 hover:text-indigo-800 font-bold hover:underline"
                    >
                      🔑 Open Password Reset Page Directly →
                    </a>
                  )}
                </div>
              </div>
            )}

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 text-left mb-5">
              💡 <strong>Tip for real delivery:</strong> To send emails directly to your Gmail inbox, add <code className="bg-slate-200 px-1 py-0.5 rounded text-[10px]">EMAIL_USER</code> and a Google App Password (<code className="bg-slate-200 px-1 py-0.5 rounded text-[10px]">EMAIL_PASS</code>) to <code className="bg-slate-200 px-1 py-0.5 rounded text-[10px]">server/.env</code>.
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={handleSendPasswordReset}
                disabled={forgotLoading}
                className="flex-1 text-xs"
              >
                {forgotLoading ? 'Resending...' : 'Resend Link'}
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="button"
                onClick={() => setIsForgotModalOpen(false)}
                className="flex-1 text-xs font-semibold"
              >
                Back to Sign In
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSendPasswordReset} className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Enter the email address associated with your account, and we'll send you a secure link to create a new password.
            </p>

            {forgotError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <span>{forgotError}</span>
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="username@gmail.com"
              icon={Mail}
              required
              autoFocus
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="md"
                type="button"
                onClick={() => setIsForgotModalOpen(false)}
                disabled={forgotLoading}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                type="submit"
                disabled={forgotLoading}
                className="text-xs font-bold shadow-sm flex items-center justify-center gap-2"
              >
                {forgotLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending Link...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-3.5 h-3.5" />
                    <span>Send Reset Link</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
