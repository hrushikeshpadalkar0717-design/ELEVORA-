import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, TextArea } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { AIEnhanceModal } from '../../components/resume/AIEnhanceModal';
import { ArrowLeft, ArrowRight, Plus, Edit3, Trash2, Briefcase, Sparkles } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useToast } from '../../context/ToastContext';

export const StepExperience = () => {
  const navigate = useNavigate();
  const { experience, addExperience, updateExperience, deleteExperience, profile, careerGoal } = useResume();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // AI enhance modal state
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [targetBulletIndex, setTargetBulletIndex] = useState(null);
  const [targetExpId, setTargetExpId] = useState(null);
  const [initialAiText, setInitialAiText] = useState('');

  const [form, setForm] = useState({
    company: '',
    role: '',
    location: '',
    startDate: '',
    endDate: '',
    currentlyWorking: false,
    responsibilities: '',
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setForm({
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: '',
      currentlyWorking: false,
      responsibilities: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exp) => {
    setEditingItem(exp);
    setForm({
      company: exp.company || '',
      role: exp.role || '',
      location: exp.location || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      currentlyWorking: exp.currentlyWorking || false,
      responsibilities: Array.isArray(exp.responsibilities) ? exp.responsibilities.join('\n') : '',
    });
    setIsModalOpen(true);
  };

  const handleSaveModal = (e) => {
    e.preventDefault();
    if (!form.company.trim() || !form.role.trim()) {
      showToast('Please enter company and role', 'error');
      return;
    }

    const payload = {
      company: form.company,
      role: form.role,
      location: form.location,
      startDate: form.startDate,
      endDate: form.currentlyWorking ? 'Present' : form.endDate,
      currentlyWorking: form.currentlyWorking,
      responsibilities: form.responsibilities
        ? form.responsibilities.split('\n').map((r) => r.trim()).filter(Boolean)
        : [],
    };

    if (editingItem) {
      updateExperience(editingItem.id, payload);
      showToast('Experience updated successfully', 'success');
    } else {
      addExperience(payload);
      showToast('Experience added successfully', 'success');
    }
    setIsModalOpen(false);
  };

  const handleTriggerAIEnhance = (expId, bulletIdx, bulletText) => {
    setTargetExpId(expId);
    setTargetBulletIndex(bulletIdx);
    setInitialAiText(bulletText);
    setAiModalOpen(true);
  };

  const handleApplyAIEnhance = (enhancedText) => {
    if (targetExpId && targetBulletIndex !== null) {
      const exp = experience.find((e) => e.id === targetExpId);
      if (exp) {
        const newBullets = [...exp.responsibilities];
        newBullets[targetBulletIndex] = enhancedText;
        updateExperience(targetExpId, { responsibilities: newBullets });
        showToast('Bullet point updated with AI version', 'success');
      }
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">5. Work Experience</h1>
          <p className="text-sm text-slate-500 mt-1">Add your internship or work experience details (if any).</p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenAdd}>
          Add Experience
        </Button>
      </div>

      {experience.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No work experience added yet"
          description="If you don't have full-time experience, add internships, apprenticeships, or student jobs."
          actionLabel="+ Add Experience"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="space-y-5">
          {experience.map((exp) => (
            <Card key={exp.id} className="relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{exp.role}</h3>
                  <p className="text-xs font-semibold text-blue-600 mt-0.5">
                    {exp.company} • {exp.location}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500">
                    {exp.startDate} – {exp.currentlyWorking ? 'Present' : exp.endDate}
                  </span>
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={() => handleOpenEdit(exp)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        deleteExperience(exp.id);
                        showToast('Experience removed', 'info');
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Responsibilities list with AI button */}
              <div className="pt-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Key Responsibilities</h4>
                  <span className="text-[11px] text-slate-400">Click sparkle to enhance with AI</span>
                </div>

                <div className="space-y-2">
                  {exp.responsibilities && exp.responsibilities.length > 0 ? (
                    exp.responsibilities.map((resp, idx) => (
                      <div
                        key={idx}
                        className="group flex items-start justify-between gap-3 p-2.5 rounded-xl bg-slate-50/70 border border-slate-200/60 hover:bg-slate-100/60 transition-colors text-xs text-slate-700"
                      >
                        <div className="flex items-start gap-2 flex-1">
                          <span className="text-blue-600 font-bold mt-0.5">•</span>
                          <span className="leading-relaxed">{resp}</span>
                        </div>

                        <button
                          onClick={() => handleTriggerAIEnhance(exp.id, idx, resp)}
                          className="opacity-80 group-hover:opacity-100 flex items-center gap-1 px-2 py-1 bg-white hover:bg-blue-50 text-blue-600 rounded-lg border border-blue-200/80 text-[10px] font-semibold transition-all shadow-2xs shrink-0"
                          title="Optimize with AI"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>AI Enhance</span>
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">No responsibilities listed.</p>
                  )}
                </div>
              </div>
            </Card>
          ))}

          <Button
            variant="outline"
            size="sm"
            icon={Plus}
            onClick={handleOpenAdd}
            className="w-full sm:w-auto"
          >
            Add Another Experience
          </Button>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <Button variant="outline" size="md" icon={ArrowLeft} onClick={() => navigate('/create-resume/projects')}>
          Back
        </Button>
        <Button variant="primary" size="md" iconRight={ArrowRight} onClick={() => navigate('/create-resume/skills')}>
          Next
        </Button>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Experience' : 'Add Experience'}
        subtitle="Detail your roles, contributions, and tools used."
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSaveModal} className="space-y-4 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Company Name"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              placeholder="e.g. Tata Technologies"
              required
            />
            <Input
              label="Role / Position"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              placeholder="e.g. Mechanical Design Intern"
              required
            />
          </div>

          <Input
            label="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="e.g. Pune, Maharashtra"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              placeholder="e.g. May 2023"
            />
            <Input
              label="End Date"
              value={form.endDate}
              disabled={form.currentlyWorking}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              placeholder={form.currentlyWorking ? 'Present' : 'e.g. Jul 2023'}
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={form.currentlyWorking}
              onChange={(e) => setForm({ ...form, currentlyWorking: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <span>Currently working here</span>
          </label>

          <TextArea
            label="Key Responsibilities (one bullet per line)"
            value={form.responsibilities}
            onChange={(e) => setForm({ ...form, responsibilities: e.target.value })}
            placeholder="Assisted in designing mechanical components using SolidWorks.&#10;Worked on CAD modelling and 3D simulations.&#10;Collaborated with senior engineers on project documentation."
            rows={4}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Experience
            </Button>
          </div>
        </form>
      </Modal>

      {/* AI Bullet Point Enhancer Modal */}
      <AIEnhanceModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        initialText={initialAiText}
        onApply={handleApplyAIEnhance}
        field={profile?.field || ''}
        subfield={profile?.subfield || ''}
        role={form.role || careerGoal?.targetRoles?.[0] || ''}
      />
    </div>
  );
};
