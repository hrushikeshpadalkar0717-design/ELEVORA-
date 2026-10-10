import React from 'react';

export const Card = ({
  children,
  className = '',
  hover = false,
  bordered = true,
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-2xl p-6 transition-all duration-200 ${
        bordered ? 'border border-slate-200/80 shadow-card' : ''
      } ${hover ? 'hover:shadow-card-hover hover:border-slate-300' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action, className = '' }) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100 ${className}`}>
      <div>
        <h3 className="text-base font-bold text-slate-800">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};
