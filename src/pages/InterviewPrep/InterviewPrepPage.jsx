import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import {
  MessageSquareCode,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  HelpCircle,
  Brain,
  Filter,
  Plus
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useToast } from '../../context/ToastContext';
import { defaultInterviewQuestions } from '../../data/interviewData';
import { aiService } from '../../services/aiService';

export const InterviewPrepPage = () => {
  const { careerGoal } = useResume();
  const { showToast } = useToast();

  const targetRoles = careerGoal.targetRoles || ['Mechanical Design Engineer'];
  const [selectedRole, setSelectedRole] = useState(targetRoles[0] || 'Mechanical Design Engineer');
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedId, setExpandedId] = useState('q-1');
  const [isGenerating, setIsGenerating] = useState(false);

  // Current list of questions for the role
  const [questionsMap, setQuestionsMap] = useState(defaultInterviewQuestions);

  const roleQuestions = questionsMap[selectedRole] || defaultInterviewQuestions['Mechanical Design Engineer'] || [];

  const categories = ['All', 'Technical', 'Behavioral', 'HR', 'Role-specific'];

  const filteredQuestions = roleQuestions.filter(
    (q) => activeCategory === 'All' || q.category.toLowerCase() === activeCategory.toLowerCase()
  );

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleGenerateAIQuestion = async () => {
    setIsGenerating(true);
    showToast(`AI generating custom interview scenario for ${selectedRole}...`, 'info');
    try {
      const newQ = await aiService.generateInterviewQuestion(selectedRole, activeCategory === 'All' ? 'Technical' : activeCategory);
      setQuestionsMap((prev) => ({
        ...prev,
        [selectedRole]: [newQ, ...(prev[selectedRole] || [])]
      }));
      setExpandedId(newQ.id);
      showToast('New AI interview question generated!', 'success');
    } catch {
      showToast('Error generating question', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Interview Preparation</h1>
          <p className="text-sm text-slate-500 mt-1">
            Master the most critical questions asked by top engineering & tech recruiters.
          </p>
        </div>

        <Button
          variant="gradient"
          size="sm"
          icon={Sparkles}
          isLoading={isGenerating}
          onClick={handleGenerateAIQuestion}
          className="shadow-md shadow-blue-500/20"
        >
          Generate Question with AI
        </Button>
      </div>

      {/* Target Role & Category Filter Controls */}
      <Card className="p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Target Role Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Role:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-blue-700 focus:outline-hidden focus:border-blue-500"
            >
              {targetRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
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
      </Card>

      {/* Questions Accordion List */}
      <div className="space-y-3">
        {filteredQuestions.map((item) => {
          const isExpanded = expandedId === item.id;
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
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                      item.difficulty === 'Easy'
                        ? 'bg-emerald-100 text-emerald-700'
                        : item.difficulty === 'Hard'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {item.difficulty[0]}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">Difficulty: {item.difficulty}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{item.question}</h3>
                  </div>
                </div>

                <button className="text-slate-400 hover:text-slate-600 p-1">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {/* Collapsible Answer & Key Points Body */}
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
                      Suggested Model Answer (STAR Method):
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
    </div>
  );
};
