import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useToast } from '../../context/ToastContext';

export const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useResume();
  const { showToast } = useToast();

  const [status, setStatus] = useState('processing'); // 'processing' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const processOAuthCallback = async () => {
      const token = searchParams.get('token');
      const provider = searchParams.get('provider') || 'Social';
      const error = searchParams.get('error');

      if (error) {
        setStatus('error');
        let readableError = 'Authentication was not completed. Please try again.';
        if (error === 'google_denied') readableError = 'Google sign-in was cancelled or access denied.';
        else if (error === 'linkedin_denied') readableError = 'LinkedIn sign-in was cancelled or access denied.';
        else if (error === 'google_not_configured') readableError = 'Google OAuth is not configured on the server.';
        else if (error === 'linkedin_not_configured') readableError = 'LinkedIn OAuth is not configured on the server.';
        else if (error === 'invalid_oauth_state') readableError = 'Security verification failed or session expired. Please retry.';
        else if (error === 'google_auth_failed') readableError = 'Google authentication failed. Please try again.';
        else if (error === 'linkedin_auth_failed') readableError = 'LinkedIn authentication failed. Please try again.';

        setErrorMessage(readableError);
        showToast(readableError, 'error');
        setTimeout(() => navigate('/login'), 2500);
        return;
      }

      if (!token) {
        setStatus('error');
        const msg = 'No authentication token received from identity provider.';
        setErrorMessage(msg);
        showToast(msg, 'error');
        setTimeout(() => navigate('/login'), 2500);
        return;
      }

      try {
        const user = await loginWithToken(token);
        setStatus('success');
        const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);

        // Check if user needs to input mobile number, field, subfield prior to reaching dashboard
        const needsOnboardingParam = searchParams.get('needsOnboarding') === 'true';
        const isNewParam = searchParams.get('isNew') === 'true';
        const missingContact = !user?.phone || user?.phone.trim() === '';
        const shouldCompleteProfile = needsOnboardingParam || isNewParam || missingContact;

        if (shouldCompleteProfile) {
          showToast(`Welcome! Please complete your contact and domain details before entering your dashboard.`, 'info');
          setTimeout(() => navigate('/complete-profile', { replace: true }), 800);
        } else {
          showToast(`Welcome! Successfully logged in with ${providerName}.`, 'success');
          setTimeout(() => navigate('/dashboard', { replace: true }), 800);
        }
      } catch (err) {
        console.error('Callback error:', err);
        setStatus('error');
        const msg = err.message || 'Failed to initialize session with ELEVORA backend.';
        setErrorMessage(msg);
        showToast(msg, 'error');
        setTimeout(() => navigate('/login'), 2500);
      }
    };

    processOAuthCallback();
  }, [searchParams, loginWithToken, navigate, showToast]);

  return (
    <div className="min-h-screen bg-[#f5f8fd] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 text-center">
        {/* Brand Icon */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-md shadow-blue-500/20 mb-5">
          <span className="font-extrabold text-xl">E</span>
        </div>

        {status === 'processing' && (
          <>
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Authenticating with ELEVORA</h2>
            <p className="text-xs text-slate-500 mt-2">
              Verifying your credentials and establishing a secure session...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Authentication Successful!</h2>
            <p className="text-xs text-slate-500 mt-2">
              Redirecting you to your dashboard...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Authentication Failed</h2>
            <p className="text-xs text-rose-600 mt-2 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
              {errorMessage}
            </p>
            <p className="text-[11px] text-slate-400 mt-3">
              Redirecting back to login in a moment...
            </p>
          </>
        )}
      </div>
    </div>
  );
};
