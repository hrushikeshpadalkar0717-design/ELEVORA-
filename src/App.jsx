import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ResumeProvider } from './context/ResumeContext';
import { ToastProvider } from './context/ToastContext';

// Layout & Route Guards (Direct imports for immediate shell hydration)
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RouteLoadingFallback } from './components/common/RouteLoadingFallback';
import { RouteErrorBoundary } from './components/common/RouteErrorBoundary';

// Public Critical Pages (Eagerly loaded for zero-waterfall first paint)
import { LandingPage } from './pages/Landing/LandingPage';
import { AuthPage } from './pages/Auth/AuthPage';

/**
 * Resilient lazy route loader with automatic one-time reload recovery
 * to mitigate stale chunk errors after production deployments.
 */
const lazyRoute = (importer, name) =>
  React.lazy(async () => {
    try {
      const module = await importer();
      return { default: module[name] };
    } catch (error) {
      const reloadKey = `elevora_chunk_reload_${name}`;
      if (!sessionStorage.getItem(reloadKey)) {
        sessionStorage.setItem(reloadKey, 'true');
        window.location.reload();
        return { default: () => null };
      }
      sessionStorage.removeItem(reloadKey);
      throw error;
    }
  });

// Public Auxiliary Routes (Lazy-loaded)
const AuthCallbackPage = lazyRoute(() => import('./pages/Auth/AuthCallbackPage'), 'AuthCallbackPage');
const CompleteProfilePage = lazyRoute(() => import('./pages/Auth/CompleteProfilePage'), 'CompleteProfilePage');
const ResetPasswordPage = lazyRoute(() => import('./pages/Auth/ResetPasswordPage'), 'ResetPasswordPage');

// Authenticated Primary Pages (Lazy-loaded)
const DashboardPage = lazyRoute(() => import('./pages/Dashboard/DashboardPage'), 'DashboardPage');
const ProfilePage = lazyRoute(() => import('./pages/Profile/ProfilePage'), 'ProfilePage');
const MyResumesPage = lazyRoute(() => import('./pages/Resumes/MyResumesPage'), 'MyResumesPage');
const EditResumePage = lazyRoute(() => import('./pages/EditResume/EditResumePage'), 'EditResumePage');
const InterviewPrepPage = lazyRoute(() => import('./pages/InterviewPrep/InterviewPrepPage'), 'InterviewPrepPage');
const SettingsPage = lazyRoute(() => import('./pages/Settings/SettingsPage'), 'SettingsPage');
const ResumeGeneratedPage = lazyRoute(() => import('./pages/ResumeGenerated/ResumeGeneratedPage'), 'ResumeGeneratedPage');
const PricingPage = lazyRoute(() => import('./pages/Pricing/PricingPage'), 'PricingPage');

// Multi-step Resume Creation Wizard (Lazy-loaded)
const CreateResumeLayout = lazyRoute(() => import('./pages/CreateResume/CreateResumeLayout'), 'CreateResumeLayout');
const StepBasics = lazyRoute(() => import('./pages/CreateResume/StepBasics'), 'StepBasics');
const StepCareerGoal = lazyRoute(() => import('./pages/CreateResume/StepCareerGoal'), 'StepCareerGoal');
const StepEducation = lazyRoute(() => import('./pages/CreateResume/StepEducation'), 'StepEducation');
const StepProjects = lazyRoute(() => import('./pages/CreateResume/StepProjects'), 'StepProjects');
const StepExperience = lazyRoute(() => import('./pages/CreateResume/StepExperience'), 'StepExperience');
const StepSkills = lazyRoute(() => import('./pages/CreateResume/StepSkills'), 'StepSkills');
const StepCertifications = lazyRoute(() => import('./pages/CreateResume/StepCertifications'), 'StepCertifications');
const StepReview = lazyRoute(() => import('./pages/CreateResume/StepReview'), 'StepReview');

export default function App() {
  return (
    <ToastProvider>
      <ResumeProvider>
        <BrowserRouter>
          <RouteErrorBoundary>
            <React.Suspense fallback={<RouteLoadingFallback />}>
              <Routes>
                {/* Public Landing & Authentication (Eager for immediate first render) */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<AuthPage initialMode="login" />} />
                <Route path="/signup" element={<AuthPage initialMode="signup" />} />
                <Route path="/auth/callback" element={<AuthCallbackPage />} />
                <Route path="/complete-profile" element={<CompleteProfilePage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

                {/* Authenticated Application (Guarded by ProtectedRoute) */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/profile" element={<ProfilePage />} />

                    {/* Multi-step Resume Wizard */}
                    <Route path="/create-resume" element={<CreateResumeLayout />}>
                      <Route index element={<Navigate to="/create-resume/basics" replace />} />
                      <Route path="basics" element={<StepBasics />} />
                      <Route path="career" element={<StepCareerGoal />} />
                      <Route path="education" element={<StepEducation />} />
                      <Route path="projects" element={<StepProjects />} />
                      <Route path="experience" element={<StepExperience />} />
                      <Route path="skills" element={<StepSkills />} />
                      <Route path="certifications" element={<StepCertifications />} />
                      <Route path="review" element={<StepReview />} />
                    </Route>

                    {/* Resume Generated Showcase */}
                    <Route path="/resume/generated" element={<ResumeGeneratedPage />} />

                    {/* Resume Management & Editor */}
                    <Route path="/resumes" element={<MyResumesPage />} />
                    <Route path="/resumes/:id/edit" element={<EditResumePage />} />

                    {/* Feature Pages */}
                    <Route path="/interview-prep" element={<InterviewPrepPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                  </Route>
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </React.Suspense>
          </RouteErrorBoundary>
        </BrowserRouter>
      </ResumeProvider>
    </ToastProvider>
  );
}
