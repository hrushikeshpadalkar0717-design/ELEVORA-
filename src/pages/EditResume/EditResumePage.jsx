import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, TextArea } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { ResumePreview } from '../../components/resume/ResumePreview';
import { AtsScoreCard } from '../../components/resume/AtsScoreCard';
import {
  CheckCircle2,
  Download,
  FileText,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Eye,
  Sliders,
  Palette,
  ArrowLeft
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useToast } from '../../context/ToastContext';
import { exportToPdf } from '../../services/pdfService';
import { generateDocxResume } from '../../services/docxService';

export const EditResumePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const resumeContext = useResume();
  const {
    profile,
    updateProfile,
    careerGoal,
    updateCareerGoal,
    education,
    experience,
    projects,
    skills,
    certifications,
    achievements,
    activeTemplate,
    setActiveTemplate,
    setActiveResumeId,
    savedResumes,
    reanalyzeATS,
    isAnalyzing
  } = resumeContext;

  const { showToast } = useToast();

  const [activeSection, setActiveSection] = useState('summary');
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [editModalSection, setEditModalSection] = useState(null);

  // Resume item details
  const currentResume = savedResumes.find((r) => r.id === id) || savedResumes[0] || {
    name: 'Mechanical Design Engineer Resume',
    targetRole: 'Mechanical Design Engineer'
  };

  // Synchronize active resume ID with context
  React.useEffect(() => {
    if (id) {
      if (setActiveResumeId) setActiveResumeId(id);
      const res = savedResumes.find((r) => r.id === id);
      if (res?.template) {
        setActiveTemplate(res.template);
      }
    }
  }, [id, savedResumes, setActiveResumeId, setActiveTemplate]);

  const sectionsList = [
    { id: 'personal', name: 'Personal Information', completed: true },
    { id: 'summary', name: 'Professional Summary', completed: true },
    { id: 'education', name: 'Education', completed: education.length > 0 },
    { id: 'experience', name: 'Experience', completed: experience.length > 0 },
    { id: 'projects', name: 'Projects', completed: projects.length > 0 },
    { id: 'skills', name: 'Skills', completed: skills.technical.length > 0 },
    { id: 'certifications', name: 'Certifications', completed: certifications.length > 0 },
    { id: 'achievements', name: 'Achievements', completed: achievements.length > 0 },
  ];

  const templatesList = [
    { id: 'modern', name: 'Modern Professional', desc: 'Crisp header & modern hierarchy' },
    { id: 'classic', name: 'Classic', desc: 'Standard serif ATS layout' },
    { id: 'minimal', name: 'Minimal', desc: 'Spacious grid with light typography' },
    { id: 'creative', name: 'Creative', desc: 'Sleek two-column layout with sidebar' },
    { id: 'executive', name: 'Executive', desc: 'Dark navy banner with leadership style' },
  ];

  const handleDownloadPdf = async () => {
    setIsExportingPdf(true);
    showToast('Exporting high-resolution PDF...', 'info');
    try {
      await exportToPdf('resume-document-to-export', `${(profile.fullName || 'Resume').replace(/\s+/g, '_')}_Resume.pdf`);
      showToast('PDF downloaded successfully!', 'success');
      confetti({ particleCount: 40, spread: 60 });
    } catch {
      showToast('Error exporting PDF', 'error');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleDownloadDocx = async () => {
    setIsExportingDocx(true);
    showToast('Generating formatted Microsoft Word (.docx)...', 'info');
    try {
      await generateDocxResume(resumeContext);
      showToast('DOCX file downloaded successfully!', 'success');
      confetti({ particleCount: 40, spread: 60 });
    } catch {
      showToast('Error generating DOCX', 'error');
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleReanalyze = async () => {
    showToast('Re-analyzing ATS keywords and formatting...', 'info');
    await reanalyzeATS();
    showToast('ATS score updated!', 'success');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate('/resumes')}>
            Back
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {currentResume.name}
            </h1>
            <p className="text-xs text-slate-500">Live preview & real-time editor</p>
          </div>
        </div>

        {/* Quick Top Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={FileText}
            isLoading={isExportingDocx}
            onClick={handleDownloadDocx}
          >
            DOCX
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Download}
            isLoading={isExportingPdf}
            onClick={handleDownloadPdf}
          >
            Download PDF
          </Button>
        </div>
      </div>

      {/* 3-Column Split Layout matching Panel 6 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0 items-start">
        {/* Left Column: Sections Navigator (3 cols) */}
        <div className="lg:col-span-3 min-w-0 space-y-4">
          <Card className="p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
              Resume Sections
            </h3>

            <div className="space-y-1.5">
              {sectionsList.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setEditModalSection(sec.id)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 transition-colors text-left text-xs font-semibold text-slate-700 group"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="group-hover:text-blue-600 transition-colors">{sec.name}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                icon={Sparkles}
                onClick={handleReanalyze}
                isLoading={isAnalyzing}
                className="w-full text-xs text-blue-600 border-blue-200"
              >
                Re-analyze ATS
              </Button>
            </div>
          </Card>

          {/* Quick summary inline edit */}
          <Card className="p-4 space-y-3 bg-white">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Quick Summary Edit</h4>
            <TextArea
              rows={4}
              value={careerGoal.summary}
              onChange={(e) => updateCareerGoal({ summary: e.target.value })}
              className="text-xs"
              placeholder="Edit your professional summary..."
            />
            <p className="text-[11px] text-slate-400">Updates live in center preview</p>
          </Card>
        </div>

        {/* Center Column: Live Resume Preview (6 cols) */}
        <div className="lg:col-span-6 min-w-0 flex flex-col justify-start">
          <div className="w-full bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-card overflow-hidden">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 text-xs">
              <span className="font-bold text-slate-700">Live Preview</span>
              <span className="text-slate-400">A4 • {activeTemplate}</span>
            </div>
            <div className="w-full overflow-x-auto">
              <ResumePreview template={activeTemplate} id="resume-document-to-export" />
            </div>
          </div>
        </div>

        {/* Right Column: Template Selection and ATS (3 cols) */}
        <div className="lg:col-span-3 min-w-0 space-y-4">
          <Card className="p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
              Choose Template
            </h3>

            <div className="space-y-2.5">
              {templatesList.map((tpl) => {
                const isSelected = activeTemplate === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => {
                      setActiveTemplate(tpl.id);
                      showToast(`Selected ${tpl.name}`, 'info');
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all text-left ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-2xs ring-1 ring-blue-500'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">{tpl.name}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">{tpl.desc}</p>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* ATS Mini Card */}
          <AtsScoreCard compact />
        </div>
      </div>

      {/* Bottom Actions Floating Bar matching Panel 6 */}
      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-4 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            isLoading={isAnalyzing}
            onClick={handleReanalyze}
          >
            Re-analyze
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={Sparkles}
            onClick={() => navigate('/create-resume/basics')}
          >
            Generate New
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={Palette}
            onClick={() => {
              const keys = ['modern', 'classic', 'minimal', 'creative', 'executive'];
              const nextIndex = (keys.indexOf(activeTemplate) + 1) % keys.length;
              setActiveTemplate(keys[nextIndex]);
              showToast(`Switched to ${keys[nextIndex]} template`, 'info');
            }}
          >
            Change Template
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Download}
            isLoading={isExportingPdf}
            onClick={handleDownloadPdf}
            className="shadow-md shadow-blue-500/20"
          >
            Download PDF
          </Button>
        </div>
      </div>

      {/* Section Edit Modal */}
      <Modal
        isOpen={Boolean(editModalSection)}
        onClose={() => setEditModalSection(null)}
        title={`Edit ${sectionsList.find((s) => s.id === editModalSection)?.name || 'Section'}`}
        subtitle="Make real-time edits to your resume details."
        maxWidth="max-w-lg"
      >
        <div className="space-y-4 text-left">
          {editModalSection === 'personal' && (
            <div className="space-y-3">
              <Input
                label="Full Name"
                value={profile.fullName}
                onChange={(e) => updateProfile({ fullName: e.target.value })}
              />
              <Input
                label="Email"
                value={profile.email}
                onChange={(e) => updateProfile({ email: e.target.value })}
              />
              <Input
                label="Phone"
                value={profile.phone}
                onChange={(e) => updateProfile({ phone: e.target.value })}
              />
              <Input
                label="Location"
                value={profile.location || ''}
                placeholder="e.g. Pune, Maharashtra"
                onChange={(e) => updateProfile({ location: e.target.value })}
              />
              <Input
                label="LinkedIn Profile"
                value={profile.linkedin || ''}
                placeholder="https://linkedin.com/in/username"
                onChange={(e) => updateProfile({ linkedin: e.target.value })}
              />
              <Input
                label="Portfolio / Website"
                value={profile.portfolio || ''}
                placeholder="https://yourportfolio.com"
                onChange={(e) => updateProfile({ portfolio: e.target.value })}
              />
            </div>
          )}

          {editModalSection === 'summary' && (
            <TextArea
              label="Professional Summary"
              rows={5}
              value={careerGoal.summary}
              onChange={(e) => updateCareerGoal({ summary: e.target.value })}
            />
          )}

          {editModalSection === 'education' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">Edit primary qualification:</p>
              <Input
                label="Degree"
                value={education[0]?.degree || ''}
                onChange={(e) => {
                  const copy = [...education];
                  copy[0] = { ...copy[0], degree: e.target.value };
                  resumeContext.updateEducation(education[0]?.id, { degree: e.target.value });
                }}
              />
              <Input
                label="Branch"
                value={education[0]?.branch || ''}
                onChange={(e) => {
                  resumeContext.updateEducation(education[0]?.id, { branch: e.target.value });
                }}
              />
              <Input
                label="College"
                value={education[0]?.college || ''}
                onChange={(e) => {
                  resumeContext.updateEducation(education[0]?.id, { college: e.target.value });
                }}
              />
            </div>
          )}

          {editModalSection === 'experience' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">Edit primary role & company:</p>
              <Input
                label="Role"
                value={experience[0]?.role || ''}
                onChange={(e) => resumeContext.updateExperience(experience[0]?.id, { role: e.target.value })}
              />
              <Input
                label="Company"
                value={experience[0]?.company || ''}
                onChange={(e) => resumeContext.updateExperience(experience[0]?.id, { company: e.target.value })}
              />
            </div>
          )}

          {editModalSection === 'projects' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">Edit primary project:</p>
              <Input
                label="Project Name"
                value={projects[0]?.name || ''}
                onChange={(e) => resumeContext.updateProject(projects[0]?.id, { name: e.target.value })}
              />
              <TextArea
                label="Description"
                rows={3}
                value={projects[0]?.description || ''}
                onChange={(e) => resumeContext.updateProject(projects[0]?.id, { description: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="GitHub Link"
                  value={projects[0]?.github || projects[0]?.link || ''}
                  placeholder="https://github.com/..."
                  onChange={(e) => resumeContext.updateProject(projects[0]?.id, { github: e.target.value })}
                />
                <Input
                  label="Live Demo Link"
                  value={projects[0]?.liveUrl || ''}
                  placeholder="https://..."
                  onChange={(e) => resumeContext.updateProject(projects[0]?.id, { liveUrl: e.target.value })}
                />
              </div>
            </div>
          )}

          {['skills', 'certifications', 'achievements'].includes(editModalSection) && (
            <p className="text-xs text-slate-600 leading-relaxed">
              Use the multi-step builder wizard to add, remove, or modify detailed tags and certificates.
            </p>
          )}

          <div className="flex justify-end gap-2 pt-3">
            <Button variant="primary" size="sm" onClick={() => setEditModalSection(null)}>
              Done
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
