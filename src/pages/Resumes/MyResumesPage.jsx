import React, { useState, useMemo } from 'react';
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
  FolderOpen,
  Search,
  X,
  Tag
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useToast } from '../../context/ToastContext';
import { exportToPdf } from '../../services/pdfService';
import { generateDocxResume } from '../../services/docxService';

export const MyResumesPage = () => {
  const navigate = useNavigate();
  const resumeContext = useResume();
  const {
    savedResumes,
    deleteSavedResume,
    duplicateSavedResume,
    setActiveTemplate,
    setActiveResumeId,
    profile
  } = resumeContext;
  const { showToast } = useToast();

  const [previewResume, setPreviewResume] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);
  const [exportTargetResume, setExportTargetResume] = useState(null);

  // Derive the field label for a resume — use stored metadata, then infer from title, then neutral
  const getFieldLabel = (resume) => {
    if (resume.field && resume.subfield) return `${resume.subfield}`;
    if (resume.field) return resume.field;
    // Attempt basic inference from title keywords
    const t = (resume.name + ' ' + resume.targetRole).toLowerCase();
    if (t.includes('data') || t.includes('machine learning') || t.includes('ai ') || t.includes('analyst')) return 'Data & AI';
    if (t.includes('web') || t.includes('frontend') || t.includes('backend') || t.includes('full stack')) return 'Web Development';
    if (t.includes('cyber') || t.includes('security') || t.includes('soc')) return 'Cybersecurity';
    if (t.includes('mechanical') || t.includes('cad') || t.includes('automotive') || t.includes('manufacturing')) return 'Mechanical Engineering';
    if (t.includes('electrical') || t.includes('power') || t.includes('control')) return 'Electrical Engineering';
    if (t.includes('civil') || t.includes('structural') || t.includes('construction')) return 'Civil Engineering';
    if (t.includes('software') || t.includes('developer') || t.includes('engineer')) return 'Software Engineering';
    return profile?.subfield || profile?.field || 'General';
  };

  // Filter resumes by search query (name, role, field)
  const filteredResumes = useMemo(() => {
    if (!searchQuery.trim()) return savedResumes;
    const q = searchQuery.toLowerCase();
    return savedResumes.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.targetRole.toLowerCase().includes(q) ||
        (r.field || '').toLowerCase().includes(q) ||
        (r.subfield || '').toLowerCase().includes(q)
    );
  }, [savedResumes, searchQuery]);

  const handleEdit = (resume) => {
    setActiveResumeId(resume.id);
    setActiveTemplate(resume.template);
    navigate(`/resumes/${resume.id}/edit`);
  };

  const handleDuplicate = (resume) => {
    duplicateSavedResume(resume.id);
    showToast(`Duplicated "${resume.name}"`, 'success');
  };

  const handleDelete = (id) => {
    deleteSavedResume(id);
    setDeleteConfirmId(null);
    showToast('Resume deleted', 'info');
  };

  const handleDownloadQuick = async (resume, type = 'pdf') => {
    if (!resume) return;
    setDownloadingId(resume.id);
    setActiveTemplate(resume.template);
    setActiveResumeId(resume.id);

    if (type === 'pdf') {
      showToast('Preparing high-res resume PDF...', 'info');
      setExportTargetResume(resume);

      // Wait a moment for the DOM element to mount with template data
      await new Promise((resolve) => setTimeout(resolve, 350));

      try {
        const safeFilename = `${(resume.name || 'Resume').replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
        await exportToPdf('quick-export-resume-doc', safeFilename);
        showToast(`Downloaded ${resume.name}.pdf!`, 'success');
      } catch (err) {
        console.error('PDF export error:', err);
        showToast('Failed to download PDF. Please try again.', 'error');
      } finally {
        setExportTargetResume(null);
        setDownloadingId(null);
      }
    } else {
      try {
        showToast('Generating DOCX...', 'info');
        await generateDocxResume(resumeContext);
        showToast(`Downloaded ${type.toUpperCase()}!`, 'success');
      } catch (err) {
        console.error('DOCX export error:', err);
        showToast('Failed to generate DOCX.', 'error');
      } finally {
        setDownloadingId(null);
      }
    }
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
          {/* Profile field context */}
          {(profile?.field || profile?.subfield) && (
            <p className="text-xs text-blue-600 font-semibold mt-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              {[profile.field, profile.subfield].filter(Boolean).join(' → ')}
            </p>
          )}
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

      {/* Search bar — only show when there are resumes */}
      {savedResumes.length > 0 && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by role, title, or field…"
            className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white shadow-sm transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

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
      ) : filteredResumes.length === 0 ? (
        <Card className="text-center py-10 space-y-3">
          <Search className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No resumes match "{searchQuery}"</h3>
          <button onClick={() => setSearchQuery('')} className="text-xs text-blue-600 hover:underline">
            Clear search
          </button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResumes.map((resume) => {
            const fieldLabel = getFieldLabel(resume);
            return (
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
                    <p className="text-xs font-semibold text-slate-600">{resume.targetRole}</p>
                    {/* Field/Subfield tag */}
                    {fieldLabel && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 rounded-md px-2 py-0.5 mt-0.5">
                        <Tag className="w-2.5 h-2.5" />
                        {fieldLabel}
                      </span>
                    )}
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
                      icon={downloadingId === resume.id ? undefined : Download}
                      isLoading={downloadingId === resume.id}
                      onClick={() => handleDownloadQuick(resume, 'pdf')}
                      disabled={Boolean(downloadingId)}
                      className="text-xs px-2.5 py-1"
                    >
                      {downloadingId === resume.id ? 'Exporting...' : 'PDF'}
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
            );
          })}
        </div>
      )}

      {/* Hidden Off-Screen Container for Reliable Full-Scale PDF Export */}
      {exportTargetResume && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            left: '-9999px',
            top: 0,
            width: '800px',
            zIndex: -9999,
            pointerEvents: 'none',
            background: '#ffffff',
          }}
        >
          <ResumePreview
            id="quick-export-resume-doc"
            template={exportTargetResume.template}
            customData={{
              ...resumeContext,
              careerGoal: {
                ...resumeContext.careerGoal,
                targetRoles: [
                  exportTargetResume.targetRole ||
                  resumeContext.careerGoal?.targetRoles?.[0] ||
                  'Professional'
                ],
              },
            }}
          />
        </div>
      )}

      {/* Preview Modal */}
      <Modal
        isOpen={Boolean(previewResume)}
        onClose={() => setPreviewResume(null)}
        title={previewResume?.name || 'Resume Preview'}
        subtitle={`Template: ${previewResume?.template} • Target: ${previewResume?.targetRole}${previewResume?.subfield ? ` • ${previewResume.subfield}` : ''}`}
        maxWidth="max-w-4xl"
      >
        <div className="space-y-4">
          <ResumePreview template={previewResume?.template} id="modal-resume-preview" />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setPreviewResume(null)}>
              Close
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={downloadingId === previewResume?.id ? undefined : Download}
              isLoading={downloadingId === previewResume?.id}
              disabled={Boolean(downloadingId)}
              onClick={() => handleDownloadQuick(previewResume, 'pdf')}
            >
              {downloadingId === previewResume?.id ? 'Exporting...' : 'Download PDF'}
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

      {/* Off-screen container for quick PDF export from resume cards */}
      {exportTargetResume && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            left: '-9999px',
            top: 0,
            width: '800px',
            opacity: 0,
            pointerEvents: 'none',
            zIndex: -100,
          }}
        >
          <ResumePreview
            id="quick-export-resume-doc"
            template={exportTargetResume.template || 'modern'}
            customData={exportTargetResume}
          />
        </div>
      )}
    </div>
  );
};
