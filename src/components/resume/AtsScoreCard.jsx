import React from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, ArrowUpRight, RefreshCw } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useToast } from '../../context/ToastContext';

export const AtsScoreCard = ({ compact = false }) => {
  const { atsAnalysis, isAnalyzing, reanalyzeATS } = useResume();
  const { showToast } = useToast();

  const handleReanalyze = async () => {
    try {
      const res = await reanalyzeATS();
      showToast(`Resume re-analyzed! ATS score: ${res.score}/100`, 'success');
    } catch {
      showToast('Error re-analyzing resume', 'error');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">ATS Optimization Analysis</h3>
            <p className="text-xs text-slate-400">Scored against your target role</p>
          </div>
        </div>

        <button
          onClick={handleReanalyze}
          disabled={isAnalyzing}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span>{isAnalyzing ? 'Scanning...' : 'Re-analyze'}</span>
        </button>
      </div>

      {/* 3 Metric Cards matching reference */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
        {/* ATS Score */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50/60 to-white border border-emerald-100 text-left">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-semibold text-slate-500">ATS Score</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-900">{atsAnalysis.score}</span>
            <span className="text-xs text-slate-400">/100</span>
          </div>
          <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
            {atsAnalysis.status || 'Great match!'}
          </span>
        </div>

        {/* Keyword Match */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50/60 to-white border border-blue-100 text-left">
          <div className="flex items-center justify-between text-blue-600">
            <span className="text-xs font-semibold text-slate-500">Keyword Match</span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-900">{atsAnalysis.keywordMatch}%</span>
          </div>
          <span className="inline-block mt-1 text-[11px] font-semibold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-full">
            Well optimized
          </span>
        </div>

        {/* Suggestions */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50/60 to-white border border-amber-100 text-left">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-semibold text-slate-500">Suggestions</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-900">{atsAnalysis.suggestionsCount}</span>
          </div>
          <span className="inline-block mt-1 text-[11px] font-semibold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
            Minor improvements
          </span>
        </div>
      </div>

      {!compact && (
        <div className="mt-6 pt-5 border-t border-slate-100 space-y-4 text-left">
          {/* Matched & Missing Keywords */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Matched Target Keywords</h4>
            <div className="flex flex-wrap gap-1.5">
              {atsAnalysis.matchedKeywords?.map((kw) => (
                <span key={kw} className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2.5 py-1 rounded-lg font-medium">
                  ✓ {kw}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Recommended Missing Keywords</h4>
            <div className="flex flex-wrap gap-1.5">
              {atsAnalysis.missingKeywords?.map((kw) => (
                <span key={kw} className="text-xs bg-amber-50 text-amber-700 border border-amber-200/60 px-2.5 py-1 rounded-lg font-medium">
                  + {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Actionable suggestions */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">AI Optimization Recommendations</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              {atsAnalysis.improvementSuggestions?.map((sug, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{sug}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
