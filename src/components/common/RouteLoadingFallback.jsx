import React from 'react';

/**
 * Consistent branded loading fallback for lazy-loaded route transitions.
 * Matches ELEVORA's minimalist blue/navy aesthetic.
 */
export const RouteLoadingFallback = ({ message = 'Loading workspace...' }) => (
  <div className="min-h-[55vh] flex items-center justify-center p-6 w-full">
    <div className="flex flex-col items-center gap-3.5 max-w-xs text-center">
      <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shadow-sm">
        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-700 tracking-wider uppercase">
          ELEVORA
        </p>
        <p className="text-xs text-slate-400 mt-0.5">
          {message}
        </p>
      </div>
    </div>
  </div>
);
