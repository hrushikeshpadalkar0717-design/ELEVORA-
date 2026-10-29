import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useResume } from '../../context/ResumeContext';

/**
 * Route guard component that restricts access to authenticated users only.
 * Displays a non-blocking branded loader while the initial session verification is in-flight.
 * If unauthenticated after verification completes, redirects the visitor to /login
 * while preserving the attempted path in location state.
 */
export const ProtectedRoute = () => {
  const { isAuthenticated, isLoaded } = useResume();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-3.5 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="w-9 h-9 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <div className="text-center">
            <p className="text-xs font-bold text-slate-700 tracking-wide uppercase">
              Verifying Session
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Checking your ELEVORA credentials...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
