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

  const score = atsAnalysis?.score ?? 85;
  const keywordMatch = atsAnalysis?.keywordMatch ?? 80;
  const status = atsAnalysis?.status || 'Well matched';
  const suggestionsCount = atsAnalysis?.suggestionsCount || atsAnalysis?.improvementSuggestions?.length || 2;

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/80 shadow-card text-left box-border max-w-full overflow-hidden ${compact ? 'p-3.5 w-full' : 'p-6'}`}>
      {/* Header */}
      <div className={`flex ${compact ? 'flex-col gap-2' : 'flex-row items-center justify-between'} pb-3 border-b border-slate-100 min-w-0`}>
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-bold text-slate-800 truncate" title="ATS Optimization Analysis">
              ATS Optimization Analysis
            </h3>
            <p className="text-[10px] text-slate-400 truncate">Scored against your target role</p>
          </div>
        </div>

        <button
          onClick={handleReanalyze}
          disabled={isAnalyzing}
          className={`flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100/80 rounded-lg transition-colors disabled:opacity-50 cursor-pointer ${
            compact ? 'w-full mt-0.5' : 'shrink-0'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span>{isAnalyzing ? 'Re-analyzing...' : 'Re-analyze ATS'}</span>
        </button>
      </div>

      {/* Metric Cards */}
      {compact ? (
        <div className="grid grid-cols-2 gap-2 mt-3 min-w-0">
          {/* ATS Score */}
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-50/70 to-white border border-emerald-100 text-left min-w-0 overflow-hidden">
            <div className="flex items-center justify-between text-emerald-600">
              <span className="text-[10px] font-semibold text-slate-500 truncate">Score</span>
              <CheckCircle2 className="w-3 h-3 shrink-0" />
            </div>
            <div className="mt-1 flex items-baseline gap-0.5">
              <span className="text-lg font-black text-slate-900 leading-none">{score}</span>
              <span className="text-[9px] text-slate-400">/100</span>
            </div>
            <p className="mt-1 text-[9px] font-semibold text-emerald-700 truncate" title={status}>{status}</p>
          </div>

          {/* Keyword Match */}
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-50/70 to-white border border-blue-100 text-left min-w-0 overflow-hidden">
            <div className="flex items-center justify-between text-blue-600">
              <span className="text-[10px] font-semibold text-slate-500 truncate">Keywords</span>
              <ArrowUpRight className="w-3 h-3 shrink-0" />
            </div>
            <div className="mt-1 flex items-baseline gap-0.5">
              <span className="text-lg font-black text-slate-900 leading-none">{keywordMatch}%</span>
            </div>
            <p className="mt-1 text-[9px] font-semibold text-blue-700 truncate">{suggestionsCount} tips</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
          {/* ATS Score */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50/60 to-white border border-emerald-100 text-left">
            <div className="flex items-center justify-between text-emerald-600">
              <span className="text-xs font-semibold text-slate-500">ATS Score</span>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-slate-900">{score}</span>
              <span className="text-xs text-slate-400">/100</span>
            </div>
            <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
              {status}
            </span>
          </div>

          {/* Keyword Match */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50/60 to-white border border-blue-100 text-left">
            <div className="flex items-center justify-between text-blue-600">
              <span className="text-xs font-semibold text-slate-500">Keyword Match</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-slate-900">{keywordMatch}%</span>
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
              <span className="text-2xl font-extrabold text-slate-900">{suggestionsCount}</span>
            </div>
            <span className="inline-block mt-1 text-[11px] font-semibold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
              Actionable items
            </span>
          </div>
        </div>
      )}

      {/* In compact mode: show top suggestions & keywords cleanly inside the box */}
      {compact && atsAnalysis?.improvementSuggestions && atsAnalysis.improvementSuggestions.length > 0 && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 text-left space-y-2">
          <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Top Improvement Tips</h4>
          <ul className="space-y-1.5 text-[11px] text-slate-600">
            {atsAnalysis.improvementSuggestions.slice(0, 2).map((sug, idx) => (
              <li key={idx} className="flex items-start gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100 leading-snug break-words">
                <span className="text-blue-600 font-bold shrink-0 mt-0.5">•</span>
                <span className="break-words">{sug}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!compact && (
        <div className="mt-6 pt-5 border-t border-slate-100 space-y-4 text-left">
          {/* Matched & Missing Keywords */}
          {atsAnalysis?.matchedKeywords && atsAnalysis.matchedKeywords.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Matched Target Keywords</h4>
              <div className="flex flex-wrap gap-1.5">
                {atsAnalysis.matchedKeywords.map((kw) => (
                  <span key={kw} className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2.5 py-1 rounded-lg font-medium">
                    ✓ {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {atsAnalysis?.missingKeywords && atsAnalysis.missingKeywords.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Recommended Missing Keywords</h4>
              <div className="flex flex-wrap gap-1.5">
                {atsAnalysis.missingKeywords.map((kw) => (
                  <span key={kw} className="text-xs bg-amber-50 text-amber-700 border border-amber-200/60 px-2.5 py-1 rounded-lg font-medium">
                    + {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actionable suggestions */}
          {atsAnalysis?.improvementSuggestions && (
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">AI Optimization Recommendations</h4>
              <ul className="space-y-2 text-xs text-slate-600">
                {atsAnalysis.improvementSuggestions.map((sug, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-blue-600 font-bold">•</span>
                    <span className="break-words">{sug}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
