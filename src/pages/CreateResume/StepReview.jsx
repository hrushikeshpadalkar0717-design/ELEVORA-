import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Loader2
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useToast } from '../../context/ToastContext';

export const StepReview = () => {
  const navigate = useNavigate();
  const { profile, careerGoal, education, experience, projects, skills, certifications, achievements, createSavedResume } = useResume();
  const { showToast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const checklist = [
    { label: 'Basic Information', count: profile.fullName ? 'Complete' : 'Pending', path: '/create-resume/basics' },
    { label: 'Career Goal', count: careerGoal.stage, path: '/create-resume/career' },
    { label: 'Education', count: `${education.length} added`, path: '/create-resume/education' },
    { label: 'Projects', count: `${projects.length} added`, path: '/create-resume/projects' },
    { label: 'Work Experience', count: `${experience.length} added`, path: '/create-resume/experience' },
    { label: 'Skills', count: `${skills.technical.length + skills.soft.length} skills`, path: '/create-resume/skills' },
    { label: 'Certifications & Achievements', count: `${certifications.length + achievements.length} entries`, path: '/create-resume/certifications' },
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    showToast('AI is synthesizing your ATS-optimized resume...', 'info');

    // Simulate AI synthesis
    await new Promise((resolve) => setTimeout(resolve, 1400));

    // Create a new resume item in saved resumes list
    createSavedResume(
      `${careerGoal.targetRoles?.[0] || profile.subfield || profile.field || 'Professional'} Resume`,
      careerGoal.targetRoles?.[0],
      'modern',
      profile.field,
      profile.subfield
    );

    // Celebratory confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    setIsGenerating(false);
    showToast('Resume generated successfully!', 'success');
    navigate('/resume/generated');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">8. Review & Submit</h1>
        <p className="text-sm text-slate-500 mt-1">Review your information before generating the resume.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Checklist (1 col) */}
        <Card className="space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Resume Sections Checklist</h2>
            <p className="text-xs text-slate-400 mt-0.5">Click any section to edit</p>
          </div>

          <div className="space-y-2 pt-2">
            {checklist.map((item, idx) => (
              <div
                key={idx}
                onClick={() => navigate(item.path)}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/70 hover:border-blue-200 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 group-hover:text-blue-700 transition-colors">
                    {item.label}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-slate-400 group-hover:text-blue-600 transition-colors">
                  {item.count}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700">
              <Sparkles className="w-4 h-4" />
              <span>ATS Score Estimate: 92%</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Your profile contains all essential sections required by Fortune 500 ATS scanners.
            </p>
          </div>
        </Card>

        {/* Right Column: Profile Summary Preview (2 cols) */}
        <Card className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Profile Preview</h2>
            <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              Ready for Generation
            </span>
          </div>

          {/* User Hero Preview */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xl overflow-hidden shrink-0 border-2 border-white shadow-sm">
              {profile.fullName ? profile.fullName.slice(0, 2).toUpperCase() : 'JD'}
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-900">{profile.fullName || 'John Doe'}</h3>
              <p className="text-xs font-semibold text-blue-600">
                {careerGoal.targetRoles?.[0] || profile.subfield || profile.field || 'Software Developer'} • {profile.field}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {profile.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {profile.phone}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {profile.location}
                </span>
              </div>
            </div>
          </div>

          {/* Career Goal box */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Target Career Goal</span>
              <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                {careerGoal.stage} • {careerGoal.roleType}
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed italic">
              "{careerGoal.summary}"
            </p>
          </div>

          {/* Snapshot stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="block text-lg font-bold text-slate-800">{education.length}</span>
              <span className="text-[11px] text-slate-500">Education</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="block text-lg font-bold text-slate-800">{experience.length}</span>
              <span className="text-[11px] text-slate-500">Work Experience</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="block text-lg font-bold text-slate-800">{projects.length}</span>
              <span className="text-[11px] text-slate-500">Key Projects</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="block text-lg font-bold text-slate-800">
                {skills.technical.length + skills.soft.length}
              </span>
              <span className="text-[11px] text-slate-500">Skills Total</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <Button variant="outline" size="md" icon={ArrowLeft} onClick={() => navigate('/create-resume/certifications')}>
          Back
        </Button>
        <Button
          variant="gradient"
          size="lg"
          icon={isGenerating ? Loader2 : Sparkles}
          isLoading={isGenerating}
          onClick={handleGenerate}
          className="shadow-lg shadow-blue-500/25 px-8"
        >
          Generate Resume
        </Button>
      </div>
    </div>
  );
};
