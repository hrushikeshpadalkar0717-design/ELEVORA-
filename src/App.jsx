import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ResumeProvider } from './context/ResumeContext';
import { ToastProvider } from './context/ToastContext';

// Layout
import { AppLayout } from './components/layout/AppLayout';

// Public Pages
import { LandingPage } from './pages/Landing/LandingPage';
import { AuthPage } from './pages/Auth/AuthPage';

// Authenticated Pages
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { ProfilePage } from './pages/Profile/ProfilePage';
import { MyResumesPage } from './pages/Resumes/MyResumesPage';
import { EditResumePage } from './pages/EditResume/EditResumePage';
import { InterviewPrepPage } from './pages/InterviewPrep/InterviewPrepPage';
import { SettingsPage } from './pages/Settings/SettingsPage';
import { ResumeGeneratedPage } from './pages/ResumeGenerated/ResumeGeneratedPage';

// Multi-step Resume Creation
import { CreateResumeLayout } from './pages/CreateResume/CreateResumeLayout';
import { StepBasics } from './pages/CreateResume/StepBasics';
import { StepCareerGoal } from './pages/CreateResume/StepCareerGoal';
import { StepEducation } from './pages/CreateResume/StepEducation';
import { StepProjects } from './pages/CreateResume/StepProjects';
import { StepExperience } from './pages/CreateResume/StepExperience';
import { StepSkills } from './pages/CreateResume/StepSkills';
import { StepCertifications } from './pages/CreateResume/StepCertifications';
import { StepReview } from './pages/CreateResume/StepReview';

export default function App() {
  return (
    <ToastProvider>
      <ResumeProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Landing & Authentication */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<AuthPage initialMode="login" />} />
            <Route path="/signup" element={<AuthPage initialMode="signup" />} />

            {/* Authenticated Application */}
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
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ResumeProvider>
    </ToastProvider>
  );
}
