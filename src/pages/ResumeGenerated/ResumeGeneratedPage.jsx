import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ResumePreview } from '../../components/resume/ResumePreview';
import { AtsScoreCard } from '../../components/resume/AtsScoreCard';
import {
  Download,
  FileText,
  Edit3,
  RefreshCw,
  Palette,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Printer
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useToast } from '../../context/ToastContext';
import { exportToPdf } from '../../services/pdfService';
import { generateDocxResume } from '../../services/docxService';

export const ResumeGeneratedPage = () => {
  const navigate = useNavigate();
  const resumeContext = useResume();
  const { activeTemplate, setActiveTemplate, profile, reanalyzeATS, isAnalyzing, activeResumeId } = resumeContext;
  const { showToast } = useToast();

  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);

  const templatesList = [
    { id: 'modern', name: 'Modern Professional', desc: 'Clean header bar & contemporary font hierarchy' },
    { id: 'classic', name: 'Classic', desc: 'Traditional black & white serif format preferred by traditional firms' },
    { id: 'minimal', name: 'Minimal', desc: 'Spacious grid layout with elegant simplicity' },
    { id: 'executive', name: 'Executive', desc: 'Commanding dark navy banner and structured credentials' },
    { id: 'creative', name: 'Creative', desc: 'Modern sidebar column with vibrant accent pills' },
    { id: 'tech-modern', name: 'Tech Modern', desc: 'Polished teal header with skill badge grid — ideal for tech roles' },
    { id: 'corporate-blue', name: 'Corporate Blue', desc: 'Conservative navy layout for corporate and enterprise roles' },
    { id: 'elegant-serif', name: 'Elegant Serif', desc: 'Centered serif headings with restrained, refined typography' },
    { id: 'compact-ats', name: 'Compact ATS', desc: 'Dense single-column layout optimized for ATS parsing' },
    { id: 'two-column', name: 'Two-Column Professional', desc: 'Sidebar with skills & contact, main column for experience and projects' },
  ];

  const handleDownloadPdf = async () => {
    setIsExportingPdf(true);
    showToast('Preparing high-resolution PDF download...', 'info');
    try {
      await exportToPdf('resume-document-to-export', `${(profile.fullName || 'Resume').replace(/\s+/g, '_')}_Resume.pdf`);
      showToast('PDF downloaded successfully!', 'success');
      confetti({ particleCount: 50, spread: 60 });
    } catch {
      showToast('Error generating PDF', 'error');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleDownloadDocx = async () => {
    setIsExportingDocx(true);
    showToast('Generating formatted Microsoft Word (.docx) file...', 'info');
    try {
      await generateDocxResume(resumeContext);
      showToast('DOCX downloaded successfully!', 'success');
      confetti({ particleCount: 50, spread: 60 });
    } catch (err) {
      console.error(err);
      showToast('Error generating DOCX', 'error');
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleRegenerate = async () => {
    showToast('Re-synthesizing resume with AI optimizations...', 'info');
    await reanalyzeATS();
    showToast('Resume re-generated with refreshed keyword match!', 'success');
  };

  const handleDirectPrint = () => {
    const resumeEl = document.getElementById('resume-document-to-export');
    if (!resumeEl) {
      showToast('Resume preview not found. Please wait for it to load.', 'error');
      return;
    }

    // Collect all stylesheets from the current document
    const styleLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .map((link) => `<link rel="stylesheet" href="${link.href}" />`)
      .join('\n');
    const inlineStyles = Array.from(document.querySelectorAll('style'))
      .map((s) => `<style>${s.innerHTML}</style>`)
      .join('\n');

    const resumeHtml = resumeEl.outerHTML;

    const printWindow = window.open('', '_blank', 'width=900,height=1200');
    if (!printWindow) {
      showToast('Pop-up blocked. Please allow pop-ups and try again.', 'error');
      return;
    }

    printWindow.document.write(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Resume — ${profile?.fullName || 'ELEVORA'}</title>
  ${styleLinks}
  ${inlineStyles}
  <style>
    @page {
      size: A4 portrait;
      margin: 8mm 8mm;
    }
    html, body {
      margin: 0;
      padding: 0;
      background: white;
      display: flex;
      justify-content: center;
      width: 100%;
    }
    #resume-document-to-export {
      width: 100%;
      max-width: 194mm;
      min-height: auto;
      background: white;
      box-shadow: none;
      border-radius: 0;
      overflow: visible;
      margin: 0 auto;
    }
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    section, .resume-section {
      page-break-inside: avoid;
      break-inside: avoid;
    }
    h1, h2, h3 {
      page-break-after: avoid;
      break-after: avoid;
    }
    ul, li {
      page-break-inside: avoid;
      break-inside: avoid;
    }
  </style>
</head>
<body>
  ${resumeHtml}
</body>
</html>`);

    printWindow.document.close();

    // Wait for resources to load, then print
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      // Close the window after printing (delay gives browser time to show dialog)
      setTimeout(() => printWindow.close(), 500);
    };
  };

  return (
    <div className="space-y-8 text-left">
      {/* Top Banner Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Generation Complete</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Resume is Ready!</h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            We've created a professional resume based on your profile and goals. You can download it, edit it, or generate a new version with a different template.
          </p>
        </div>

        {/* Primary Download CTAs */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="primary"
            size="md"
            icon={Download}
            isLoading={isExportingPdf}
            onClick={handleDownloadPdf}
            className="shadow-md shadow-blue-500/20"
          >
            Download PDF
          </Button>
          <Button
            variant="outline"
            size="md"
            icon={FileText}
            isLoading={isExportingDocx}
            onClick={handleDownloadDocx}
          >
            Download DOCX
          </Button>
        </div>
      </div>

      {/* ATS Metric Breakdown Card */}
      <AtsScoreCard />

      {/* Main Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Actions & Template Switcher (1 col) */}
        <div className="space-y-4">
          <Card className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
              Quick Actions
            </h3>

            <Button
              variant="outline"
              size="sm"
              icon={Edit3}
              onClick={() => navigate(`/resumes/${activeResumeId || 'res-1'}/edit`)}
              className="w-full justify-start text-xs font-semibold"
            >
              Edit Resume & Sections
            </Button>

            <Button
              variant="outline"
              size="sm"
              icon={Palette}
              onClick={() => setTemplateModalOpen(true)}
              className="w-full justify-start text-xs font-semibold"
            >
              Change Template ({activeTemplate})
            </Button>

            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              isLoading={isAnalyzing}
              onClick={handleRegenerate}
              className="w-full justify-start text-xs font-semibold"
            >
              Re-generate Content
            </Button>

            <Button
              variant="ghost"
              size="sm"
              icon={Printer}
              onClick={handleDirectPrint}
              className="w-full justify-start text-xs text-slate-500"
            >
              Direct Print
            </Button>
          </Card>

          {/* Template Info Card */}
          <Card className="space-y-3 bg-gradient-to-br from-slate-50 to-blue-50/40 border-blue-100/60">
            <div className="flex items-center gap-2 text-blue-600">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Current Template</span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 capitalize">{activeTemplate} Style</p>
              <p className="text-xs text-slate-500 mt-1">
                Optimized for standard A4 ATS screening and human recruiters.
              </p>
            </div>
            <button
              onClick={() => setTemplateModalOpen(true)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 pt-1"
            >
              <span>Explore 9 other templates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Card>
        </div>

        {/* Live Resume Mockup Preview (3 cols) */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-card">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Interactive Document Preview
              </span>
              <span className="text-xs text-slate-400">100% Scale • A4 Ready</span>
            </div>
            <ResumePreview template={activeTemplate} id="resume-document-to-export" />
          </div>
        </div>
      </div>

      {/* Change Template Modal */}
      <Modal
        isOpen={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        title="Select Resume Template"
        subtitle="Switching templates updates the design layout instantly."
        maxWidth="max-w-2xl"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {templatesList.map((tpl) => {
            const isSelected = activeTemplate === tpl.id;
            return (
              <div
                key={tpl.id}
                onClick={() => {
                  setActiveTemplate(tpl.id);
                  showToast(`Switched to ${tpl.name} template`, 'success');
                  setTemplateModalOpen(false);
                }}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-800">{tpl.name}</h4>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{tpl.desc}</p>
              </div>
            );
          })}
        </div>
      </Modal>
    </div>
  );
};
