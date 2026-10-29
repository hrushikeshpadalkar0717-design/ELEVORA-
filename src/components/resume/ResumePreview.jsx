import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { TemplateModern } from './TemplateModern';
import { TemplateClassic } from './TemplateClassic';
import { TemplateMinimal } from './TemplateMinimal';
import { TemplateExecutive } from './TemplateExecutive';
import { TemplateCreative } from './TemplateCreative';
import { TemplateTechModern } from './TemplateTechModern';
import { TemplateCorporateBlue } from './TemplateCorporateBlue';
import { TemplateElegantSerif } from './TemplateElegantSerif';
import { TemplateCompactAts } from './TemplateCompactAts';
import { TemplateTwoColumn } from './TemplateTwoColumn';

export const ResumePreview = ({ template: overrideTemplate, customData, id = 'resume-document-to-export' }) => {
  const resumeContext = useResume();

  const activeTemplate = overrideTemplate || resumeContext.activeTemplate || 'modern';
  const rawData = customData || resumeContext;

  // Filter out empty experience items and legacy demonstration artifacts
  const validExperience = (rawData.experience || []).filter(
    (exp) => exp && exp.company !== 'Tata Technologies' && (exp.company?.trim() || exp.role?.trim())
  );

  const data = {
    ...rawData,
    experience: validExperience,
  };

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
      case 'tech-modern':
        return <TemplateTechModern data={data} />;
      case 'corporate-blue':
        return <TemplateCorporateBlue data={data} />;
      case 'elegant-serif':
        return <TemplateElegantSerif data={data} />;
      case 'compact-ats':
        return <TemplateCompactAts data={data} />;
      case 'two-column':
        return <TemplateTwoColumn data={data} />;
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
