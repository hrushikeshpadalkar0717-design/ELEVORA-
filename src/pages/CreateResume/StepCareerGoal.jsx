import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { TextArea } from '../../components/common/Input';
import { ArrowLeft, ArrowRight, GraduationCap, Award, Briefcase, Star, Sparkles } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { aiService } from '../../services/aiService';
import { useToast } from '../../context/ToastContext';

export const StepCareerGoal = () => {
  const navigate = useNavigate();
  const { careerGoal, updateCareerGoal, skills, experience, projects, profile } = useResume();
  const { showToast } = useToast();

  const [stage, setStage] = useState(careerGoal.stage || 'Fresher');
  const [roleType, setRoleType] = useState(careerGoal.roleType || 'Full-time');
  const [summary, setSummary] = useState(careerGoal.summary || '');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const stages = [
    {
      id: 'Student',
      title: 'Student',
      description: 'Currently pursuing degree',
      icon: GraduationCap,
    },
    {
      id: 'Fresher',
      title: 'Fresher',
      description: 'Recently graduated',
      icon: Award,
    },
    {
      id: 'Intern',
      title: 'Intern',
      description: 'Looking for internship',
      icon: Briefcase,
    },
    {
      id: 'Experienced',
      title: 'Experienced',
      description: '1+ years of experience',
      icon: Star,
    },
  ];

  const roleTypes = ['Full-time', 'Internship', 'Both'];

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const userField = profile?.field || '';
      const userSubfield = profile?.subfield || '';
      const userRole = careerGoal.targetRoles?.[0] || userSubfield || userField || 'Professional';
      const generated = await aiService.generateSummary({
        role: userRole,
        stage,
        skills,
        experience,
        projects,
        field: userField,
        subfield: userSubfield,
      });
      setSummary(generated);
      updateCareerGoal({ summary: generated, stage, roleType });
      showToast('AI Summary generated successfully!', 'success');
    } catch {
      showToast('Error generating summary', 'error');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleNext = () => {
    updateCareerGoal({ stage, roleType, summary });
    navigate('/create-resume/education');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">2. Career Goal</h1>
        <p className="text-sm text-slate-500 mt-1">Tell us what kind of opportunity you are looking for.</p>
      </div>

      <Card className="space-y-8">
        {/* Question 1: Career Stage */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 mb-1">What is your current career stage?</h2>
          <p className="text-xs text-slate-400 mb-4">This helps our AI tailor the level of detail and formatting.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stages.map((stg) => {
              const Icon = stg.icon;
              const isSelected = stage === stg.id;
              return (
                <div
                  key={stg.id}
                  onClick={() => setStage(stg.id)}
                  className={`cursor-pointer rounded-2xl p-5 border text-center transition-all duration-200 flex flex-col items-center justify-center ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                      isSelected ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">{stg.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{stg.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Question 2: Roles targeted */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 mb-1">What type of roles are you targeting?</h2>
          <p className="text-xs text-slate-400 mb-3">Choose the employment type you are seeking.</p>

          <div className="flex flex-wrap gap-4">
            {roleTypes.map((type) => {
              const isChecked = roleType === type;
              return (
                <label
                  key={type}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                    isChecked
                      ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-semibold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="roleType"
                    value={type}
                    checked={isChecked}
                    onChange={() => setRoleType(type)}
                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-sm">{type}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Career Objective / Professional Summary */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Professional Summary</h2>
              <p className="text-xs text-slate-400">A concise highlight of your value proposition and expertise.</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={Sparkles}
              isLoading={isGeneratingSummary}
              onClick={handleGenerateSummary}
              className="text-blue-600 border-blue-200 hover:bg-blue-50 shrink-0 self-start sm:self-center"
            >
              Generate with AI
            </Button>
          </div>

          <TextArea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={4}
            placeholder="Write a brief professional summary or use our AI generator..."
          />
        </div>
      </Card>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <Button variant="outline" size="md" icon={ArrowLeft} onClick={() => navigate('/create-resume/basics')}>
          Back
        </Button>
        <Button variant="primary" size="md" iconRight={ArrowRight} onClick={handleNext}>
          Next
        </Button>
      </div>
    </div>
  );
};
