import React, { useState } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  FileText,
  User,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  Laptop
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { useResume } from '../../context/ResumeContext';
import { useToast } from '../../context/ToastContext';
import { MAIN_FIELDS, getSubfields, getFieldDisplayLabel } from '../../data/careerTaxonomy';

export const AuthPage = ({ initialMode = 'signup' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, googleLogin } = useResume();
  const { showToast } = useToast();

  const isSignUpDefault = initialMode === 'signup' || location.pathname.includes('signup');
  const [isSignUp, setIsSignUp] = useState(isSignUpDefault);

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
    try {
      await signup(signUpForm);
      showToast('Account created successfully! Welcome to ELEVORA.', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.message || 'Error signing up', 'error');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginForm.email.trim()) {
      showToast('Please enter your email', 'error');
      return;
    }
    try {
      await login({ email: loginForm.email, password: loginForm.password });
      showToast('Welcome back to ELEVORA!', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
    }
  };

  const handleSocialAuth = (provider) => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (provider === 'Google' && googleClientId) {
      const redirectUri = window.location.origin + '/login';
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=openid%20email%20profile&prompt=select_account`;
      window.location.href = authUrl;
      return;
    }

    // Default social authentication
    login({ email: `user@${provider.toLowerCase()}.com`, fullName: `${provider} User` });
    showToast(`Logged in via ${provider}!`, 'success');
    navigate('/dashboard');
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

              <Button variant="primary" size="md" type="submit" className="w-full mt-2 font-bold shadow-sm">
                Sign Up
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
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); showToast('Password reset link sent!', 'info'); }} className="text-xs text-blue-600 hover:underline">
                    Forgot Password?
                  </a>
                </div>
              </div>

              <Button variant="primary" size="md" type="submit" className="w-full mt-2 font-bold shadow-sm">
                Log In
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

          {/* Social Buttons matching reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialAuth('Google')}
              className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialAuth('LinkedIn')}
              className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
            >
              <svg className="w-4 h-4 fill-[#0A66C2]" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.39 9.74v-8.37H5.07v8.37h2.78z" />
              </svg>
              <span>Continue with LinkedIn</span>
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
                  className="font-bold text-blue-600 hover:underline ml-1"
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
                  className="font-bold text-blue-600 hover:underline ml-1"
                >
                  Sign Up
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
