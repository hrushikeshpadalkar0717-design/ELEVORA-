import React from 'react';
import { Outlet } from 'react-router-dom';
import { ProgressStepper } from '../../components/resume/ProgressStepper';

export const CreateResumeLayout = () => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* 8-Step Stepper Header */}
      <ProgressStepper />

      {/* Step Content */}
      <div className="animate-in fade-in duration-300">
        <Outlet />
      </div>
    </div>
  );
};
