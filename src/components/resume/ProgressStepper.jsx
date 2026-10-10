import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';

export const stepsList = [
  { id: 'basics', number: 1, label: 'Basics', path: '/create-resume/basics' },
  { id: 'career', number: 2, label: 'Career Goal', path: '/create-resume/career' },
  { id: 'education', number: 3, label: 'Education', path: '/create-resume/education' },
  { id: 'projects', number: 4, label: 'Projects', path: '/create-resume/projects' },
  { id: 'experience', number: 5, label: 'Experience', path: '/create-resume/experience' },
  { id: 'skills', number: 6, label: 'Skills', path: '/create-resume/skills' },
  { id: 'certifications', number: 7, label: 'Certifications', path: '/create-resume/certifications' },
  { id: 'review', number: 8, label: 'Review', path: '/create-resume/review' },
];

export const ProgressStepper = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Find active step index
  const currentStepIndex = stepsList.findIndex((s) => location.pathname === s.path);
  const activeIndex = currentStepIndex !== -1 ? currentStepIndex : 0;

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-card mb-6">
      {/* Horizontal scrolling wrapper on small screens */}
      <div className="overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
        <div className="flex items-center justify-between min-w-[700px] px-2">
          {stepsList.map((step, index) => {
            const isCompleted = index < activeIndex;
            const isActive = index === activeIndex;

            return (
              <React.Fragment key={step.id}>
                <button
                  type="button"
                  onClick={() => navigate(step.path)}
                  className="flex flex-col items-center group focus:outline-hidden transition-all duration-200"
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-4 ring-blue-100 scale-110'
                        : isCompleted
                        ? 'bg-blue-50 text-blue-600 border border-blue-200 group-hover:bg-blue-100'
                        : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4 text-blue-600 stroke-[3]" /> : step.number}
                  </div>
                  <span
                    className={`mt-2 text-xs transition-colors whitespace-nowrap ${
                      isActive
                        ? 'font-bold text-blue-600'
                        : isCompleted
                        ? 'font-medium text-slate-700'
                        : 'font-normal text-slate-400 group-hover:text-slate-600'
                    }`}
                  >
                    {step.label}
                  </span>
                </button>

                {/* Connecting Line between steps */}
                {index < stepsList.length - 1 && (
                  <div className="flex-1 mx-2 sm:mx-3 h-0.5 relative self-center mb-5">
                    <div className="absolute inset-0 bg-slate-200" />
                    <div
                      className={`absolute inset-0 bg-blue-600 transition-all duration-500 ${
                        index < activeIndex ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
