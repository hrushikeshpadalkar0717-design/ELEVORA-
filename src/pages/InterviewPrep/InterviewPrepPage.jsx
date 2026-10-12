import React, { useState, useMemo, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import {
  MessageSquareCode,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { defaultInterviewQuestions, getQuestionsForRole } from '../../data/interviewData';
import { aiService } from '../../services/aiService';

export const InterviewPrepPage = () => {
  const { careerGoal, profile } = useResume();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const userField = profile?.field || '';
  const userSubfield = profile?.subfield || '';

  // Target roles from the user's saved career goal
  const savedRoles = useMemo(() => {
    const roles = careerGoal?.targetRoles || [];
    return roles.filter((r) => r && r.trim() !== '');
  }, [careerGoal]);

  const [selectedRole, setSelectedRole] = useState(() => savedRoles[0] || '');
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Keep selectedRole in sync if savedRoles changes (e.g. after profile update)
  useEffect(() => {
    if (savedRoles.length > 0 && !savedRoles.includes(selectedRole)) {
      setSelectedRole(savedRoles[0]);
      setActiveCategory('All');
      setExpandedId(null);
    }
  }, [savedRoles]);

  // Questions map: role → question[]  (allows AI-generated additions per session)
  const [questionsMap, setQuestionsMap] = useState({});

  // Resolve questions for the currently selected role
  const roleQuestions = useMemo(() => {
    if (!selectedRole) return [];
    // Prefer session-added questions (AI generated), then static bank
    return questionsMap[selectedRole] || getQuestionsForRole(selectedRole, userField, userSubfield);
  }, [selectedRole, questionsMap, userField, userSubfield]);

  const categories = ['All', 'Technical', 'Behavioral', 'HR', 'Role-specific'];

  const filteredQuestions = useMemo(() => {
    return roleQuestions.filter(
      (q) => activeCategory === 'All' || q.category.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [roleQuestions, activeCategory]);

  // Auto-open first question when role or category changes
  useEffect(() => {
    setExpandedId(filteredQuestions[0]?.id || null);
  }, [selectedRole, activeCategory]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setActiveCategory('All');
    setExpandedId(null);
  };

  const handleGenerateAIQuestion = async () => {
    if (!selectedRole) {
      showToast('Please select a target role first.', 'error');
      return;
    }
    setIsGenerating(true);
    showToast(`AI generating a ${activeCategory === 'All' ? 'Technical' : activeCategory} question for ${selectedRole}...`, 'info');
    try {
      const newQ = await aiService.generateInterviewQuestion(
        selectedRole,
        activeCategory === 'All' ? 'Technical' : activeCategory,
        userField,
        userSubfield
      );
      setQuestionsMap((prev) => ({
        ...prev,
        [selectedRole]: [newQ, ...(prev[selectedRole] || getQuestionsForRole(selectedRole, userField, userSubfield))]
      }));
      setExpandedId(newQ.id);
      showToast('New AI interview question generated!', 'success');
    } catch {
      showToast('Error generating question. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // ── No target roles saved ────────────────────────────────────────────────────
  if (savedRoles.length === 0) {
    return (
      <div className="space-y-6 text-left">
        <div className="pb-4 border-b border-slate-200">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Interview Preparation</h1>
          <p className="text-sm text-slate-500 mt-1">
            Practice role-specific questions tailored to your field and target role.
          </p>
        </div>

        <Card className="flex flex-col items-center justify-center py-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">No Target Roles Selected</h2>
          <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
            To see role-specific interview questions, please go to your <strong>Dashboard</strong> and select the
            target roles that match your{' '}
            {userField ? (
              <span className="font-semibold text-blue-600">{userField} › {userSubfield}</span>
            ) : (
              'field and subfield'
            )}.
          </p>
          <Button
            variant="primary"
            size="sm"
            iconRight={ArrowRight}
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  // ── Main UI ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Interview Preparation</h1>
          <p className="text-sm text-slate-500 mt-1">
            Role-specific questions for{' '}
            {userField && (
              <span className="font-semibold text-blue-600">{userField}{userSubfield ? ` › ${userSubfield}` : ''}</span>
            )}
          </p>
        </div>

        <Button
          variant="gradient"
          size="sm"
          icon={Sparkles}
          isLoading={isGenerating}
          onClick={handleGenerateAIQuestion}
          className="shadow-md shadow-blue-500/20 shrink-0"
        >
          Generate Question with AI
        </Button>
      </div>

      {/* Target Role & Category Filter Controls */}
      <Card className="p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Target Role Selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">Target Role:</span>
            <select
              value={selectedRole}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-blue-700 focus:outline-hidden focus:border-blue-500"
            >
              {savedRoles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>

            {/* Domain tag */}
            {userField && (
              <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                {userSubfield || userField}
              </span>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Question count */}
        <p className="text-[11px] text-slate-400">
          Showing <span className="font-semibold text-slate-600">{filteredQuestions.length}</span> questions
          {activeCategory !== 'All' ? ` in ${activeCategory}` : ''} for{' '}
          <span className="font-semibold text-blue-600">{selectedRole}</span>
        </p>
      </Card>

      {/* Questions Accordion List */}
      {filteredQuestions.length === 0 ? (
        <Card className="flex flex-col items-center py-10 text-center space-y-3">
          <MessageSquareCode className="w-10 h-10 text-slate-300" />
          <p className="text-sm font-semibold text-slate-600">No {activeCategory} questions yet for this role.</p>
          <p className="text-xs text-slate-400">Try generating one with AI or switch to a different category.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredQuestions.map((item) => {
            const isExpanded = expandedId === item.id;
            const difficultyColor =
              item.difficulty === 'Easy'
                ? 'bg-emerald-100 text-emerald-700'
                : item.difficulty === 'Hard'
                ? 'bg-rose-100 text-rose-700'
                : 'bg-amber-100 text-amber-700';

            return (
              <Card
                key={item.id}
                className={`transition-all duration-200 ${
                  isExpanded ? 'border-blue-200 ring-2 ring-blue-500/10 shadow-md' : 'hover:border-slate-300'
                }`}
              >
                <div
                  onClick={() => toggleExpand(item.id)}
                  className="flex items-start justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-start gap-3 flex-1">
                    {/* Difficulty badge */}
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${difficultyColor}`}>
                      {item.difficulty[0]}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          Difficulty: {item.difficulty}
                        </span>
                        {item.roleSpecific && (
                          <span className="text-[10px] font-semibold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100">
                            Role-Specific
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">{item.question}</h3>
                    </div>
                  </div>

                  <button className="text-slate-400 hover:text-slate-600 p-1 shrink-0">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {/* Collapsible Body */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-4 text-xs animate-in fade-in duration-200">
                    {/* Key Points */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                      <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block mb-1.5">
                        Key Evaluation Points Recruiters Look For:
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-slate-600">
                        {item.keyPoints?.map((pt, idx) => (
                          <li key={idx}>{pt}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Suggested Answer */}
                    <div>
                      <span className="font-bold text-blue-700 uppercase tracking-wider text-[10px] block mb-1">
                        Suggested Model Answer:
                      </span>
                      <p className="text-slate-700 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200">
                        {item.suggestedAnswer}
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
