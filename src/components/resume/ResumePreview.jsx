import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { TemplateModern } from './TemplateModern';
import { TemplateClassic } from './TemplateClassic';
import { TemplateMinimal } from './TemplateMinimal';
import { TemplateExecutive } from './TemplateExecutive';
import { TemplateCreative } from './TemplateCreative';

export const ResumePreview = ({ template: overrideTemplate, customData, id = 'resume-document-to-export' }) => {
  const resumeContext = useResume();

  const activeTemplate = overrideTemplate || resumeContext.activeTemplate || 'modern';
  const data = customData || resumeContext;

  const renderTemplate = () => {
    switch (activeTemplate) {
      case 'classic':
        return <TemplateClassic data={data} />;
      case 'minimal':
        return <TemplateMinimal data={data} />;
      case 'executive':
        return <TemplateExecutive data={data} />;
      case 'creative':
        return <TemplateCreative data={data} />;
      case 'modern':
      default:
        return <TemplateModern data={data} />;
    }
  };

  return (
    <div className="w-full flex justify-center bg-slate-100/70 p-4 sm:p-6 rounded-2xl border border-slate-200/80 overflow-x-auto shadow-inner">
      <div
        id={id}
        className="w-full max-w-[800px] min-h-[1050px] bg-white rounded-xl shadow-xl overflow-hidden print:shadow-none print:m-0"
      >
        {renderTemplate()}
      </div>
    </div>
  );
};
