import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ResumePreview } from '../../components/resume/ResumePreview';
import {
  Plus,
  FileText,
  Clock,
  Sparkles,
  Download,
  Copy,
  Trash2,
  Edit3,
  Eye,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useToast } from '../../context/ToastContext';
import { exportToPdf } from '../../services/pdfService';
import { generateDocxResume } from '../../services/docxService';

export const MyResumesPage = () => {
  const navigate = useNavigate();
  const resumeContext = useResume();
  const { savedResumes, deleteSavedResume, duplicateSavedResume, setActiveTemplate, setActiveResumeId, profile } = resumeContext;
  const { showToast } = useToast();

  const [previewResume, setPreviewResume] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const handleEdit = (resume) => {
    setActiveResumeId(resume.id);
    setActiveTemplate(resume.template);
    navigate(`/resumes/${resume.id}/edit`);
  };

  const handleDuplicate = (resume) => {
    const copy = duplicateSavedResume(resume.id);
    showToast(`Duplicated "${resume.name}"`, 'success');
  };

  const handleDelete = (id) => {
    deleteSavedResume(id);
    setDeleteConfirmId(null);
    showToast('Resume deleted', 'info');
  };

  const handleDownloadQuick = async (resume, type = 'pdf') => {
    setActiveTemplate(resume.template);
    if (type === 'pdf') {
      showToast('Downloading PDF...', 'info');
      await exportToPdf('resume-document-to-export', `${resume.name.replace(/\s+/g, '_')}.pdf`);
    } else {
      showToast('Generating DOCX...', 'info');
      await generateDocxResume(resumeContext);
    }
    showToast(`Downloaded ${type.toUpperCase()}!`, 'success');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">My Resumes</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage, duplicate, edit, and export your tailored career documents.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => navigate('/create-resume/basics')}
          className="shadow-md shadow-blue-500/20"
        >
          Create New Resume
        </Button>
      </div>

      {/* Resumes Grid */}
      {savedResumes.length === 0 ? (
        <Card className="text-center py-12 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <FolderOpen className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No resumes created yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Build your first ATS-optimized resume using our guided multi-step builder.
          </p>
          <div>
            <Button variant="primary" size="sm" onClick={() => navigate('/create-resume/basics')}>
              Create Your First Resume
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedResumes.map((resume) => (
            <Card
              key={resume.id}
              hover
              className="flex flex-col justify-between space-y-4 group border-slate-200/90 relative"
            >
              <div>
                {/* Header with target role badge and template */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                    {resume.template} template
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{resume.lastUpdated}</span>
                  </div>
                </div>

                {/* Resume Title & Role */}
                <div className="pt-3 space-y-1">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {resume.name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">{resume.targetRole}</p>
                </div>

                {/* Score Pill */}
                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">ATS Match</span>
                    <p className="text-lg font-extrabold text-slate-900">
                      {resume.atsScore}
                      <span className="text-xs text-slate-400 font-normal">/100</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Keywords</span>
                    <p className="text-sm font-bold text-emerald-600">{resume.keywordMatch}%</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-1">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPreviewResume(resume)}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDuplicate(resume)}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Duplicate"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(resume.id)}
                    className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Download}
                    onClick={() => handleDownloadQuick(resume, 'pdf')}
                    className="text-xs px-2.5 py-1"
                  >
                    PDF
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Edit3}
                    onClick={() => handleEdit(resume)}
                    className="text-xs px-3 py-1"
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      <Modal
        isOpen={Boolean(previewResume)}
        onClose={() => setPreviewResume(null)}
        title={previewResume?.name || 'Resume Preview'}
        subtitle={`Template: ${previewResume?.template} • Target: ${previewResume?.targetRole}`}
        maxWidth="max-w-4xl"
      >
        <div className="space-y-4">
          <ResumePreview template={previewResume?.template} />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setPreviewResume(null)}>
              Close
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={Download}
              onClick={() => handleDownloadQuick(previewResume, 'pdf')}
            >
              Download PDF
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Edit3}
              onClick={() => {
                const target = previewResume;
                setPreviewResume(null);
                handleEdit(target);
              }}
            >
              Edit in Workspace
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Resume"
        subtitle="Are you sure you want to delete this resume? This action cannot be undone."
        maxWidth="max-w-md"
      >
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="secondary" size="sm" onClick={() => setDeleteConfirmId(null)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDelete(deleteConfirmId)}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};
