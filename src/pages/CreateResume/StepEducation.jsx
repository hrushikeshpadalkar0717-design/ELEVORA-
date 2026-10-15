import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { ArrowLeft, ArrowRight, GraduationCap, Plus, Trash2, Edit3 } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useToast } from '../../context/ToastContext';

export const StepEducation = () => {
  const navigate = useNavigate();
  const { education, addEducation, updateEducation, deleteEducation } = useResume();
  const { showToast } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form state for add/edit
  const [eduForm, setEduForm] = useState({
    degree: 'B.Tech / B.E.',
    branch: 'Mechanical Engineering',
    college: '',
    location: '',
    startYear: '',
    graduationYear: '',
    score: '',
  });

  const degreeOptions = [
    'B.Tech / B.E.',
    'M.Tech / M.E.',
    'B.Sc',
    'M.Sc',
    'BCA',
    'MCA',
    'Diploma in Engineering',
    'High School (12th)',
    'Other Degree'
  ];

  const handleOpenAdd = () => {
    setEditingItem(null);
    setEduForm({
      degree: 'High School (12th)',
      branch: '',
      college: '',
      location: '',
      startYear: '',
      graduationYear: '',
      score: '',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setEduForm({ ...item });
    setIsAddModalOpen(true);
  };

  const handleSaveModal = (e) => {
    e.preventDefault();
    if (!eduForm.college.trim()) {
      showToast('Please enter college or institution name', 'error');
      return;
    }

    if (editingItem) {
      updateEducation(editingItem.id, eduForm);
      showToast('Education updated successfully', 'success');
    } else {
      addEducation(eduForm);
      showToast('Education added successfully', 'success');
    }
    setIsAddModalOpen(false);
  };

  // Inline updater for the primary highest qualification
  const handlePrimaryChange = (field, value) => {
    if (education.length > 0) {
      updateEducation(education[0].id, { [field]: value });
    }
  };

  const primaryEdu = education[0] || {
    degree: 'B.Tech / B.E.',
    branch: '',
    college: '',
    location: '',
    startYear: '',
    graduationYear: '',
    score: ''
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">3. Education</h1>
        <p className="text-sm text-slate-500 mt-1">Add your academic details, starting from the highest qualification.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Highest Qualification</h2>
              <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full">Primary</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Degree"
                value={primaryEdu.degree}
                onChange={(e) => handlePrimaryChange('degree', e.target.value)}
                options={degreeOptions}
                required
              />
              <Input
                label="Branch / Specialization"
                value={primaryEdu.branch}
                onChange={(e) => handlePrimaryChange('branch', e.target.value)}
                placeholder="e.g. Mechanical Engineering"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="College / University"
                value={primaryEdu.college}
                onChange={(e) => handlePrimaryChange('college', e.target.value)}
                placeholder="e.g. ABC College of Engineering"
                required
              />
              <Input
                label="Location"
                value={primaryEdu.location}
                onChange={(e) => handlePrimaryChange('location', e.target.value)}
                placeholder="e.g. Pune, Maharashtra"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Input
                label="Start Year"
                value={primaryEdu.startYear}
                onChange={(e) => handlePrimaryChange('startYear', e.target.value)}
                placeholder="2020"
              />
              <Input
                label="Graduation Year"
                value={primaryEdu.graduationYear}
                onChange={(e) => handlePrimaryChange('graduationYear', e.target.value)}
                placeholder="2024"
              />
              <Input
                label="CGPA / Percentage"
                value={primaryEdu.score}
                onChange={(e) => handlePrimaryChange('score', e.target.value)}
                placeholder="8.5"
              />
            </div>

            {/* Previous Educations List if any */}
            {education.length > 1 && (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Additional Qualifications</h3>
                {education.slice(1).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-800">{item.degree} — {item.branch}</p>
                      <p className="text-slate-500">{item.college} ({item.startYear} - {item.graduationYear}) • {item.score}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-200"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          deleteEducation(item.id);
                          showToast('Education removed', 'info');
                        }}
                        className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-200"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                icon={Plus}
                onClick={handleOpenAdd}
                className="w-full sm:w-auto"
              >
                Add Previous Education
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Tip Card matching reference */}
        <div>
          <div className="bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-white rounded-2xl border border-blue-100 p-6 flex flex-col items-center text-center shadow-card h-full min-h-[300px] justify-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Did you know?</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-xs">
              Good education details help your resume get shortlisted faster. Always list your highest qualification first with accurate CGPA or percentage.
            </p>
            <div className="mt-5 w-full bg-white/90 rounded-xl p-3 border border-blue-100 text-[11px] text-slate-600 text-left">
              <span className="font-semibold text-blue-600 block mb-1">ATS Tip:</span>
              Recruiters filter candidates by degree specialization and graduating year. Keep standard degree naming formats like B.Tech or M.Tech.
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <Button variant="outline" size="md" icon={ArrowLeft} onClick={() => navigate('/create-resume/career')}>
          Back
        </Button>
        <Button variant="primary" size="md" iconRight={ArrowRight} onClick={() => navigate('/create-resume/projects')}>
          Next
        </Button>
      </div>

      {/* Add / Edit Education Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingItem ? 'Edit Qualification' : 'Add Previous Qualification'}
        subtitle="Add 12th standard, diploma, or undergraduate details."
      >
        <form onSubmit={handleSaveModal} className="space-y-4 text-left">
          <Select
            label="Degree"
            value={eduForm.degree}
            onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
            options={degreeOptions}
            required
          />
          <Input
            label="Branch / Stream"
            value={eduForm.branch}
            onChange={(e) => setEduForm({ ...eduForm, branch: e.target.value })}
            placeholder="e.g. Science / Computer Applications"
            required
          />
          <Input
            label="Institution / College"
            value={eduForm.college}
            onChange={(e) => setEduForm({ ...eduForm, college: e.target.value })}
            placeholder="e.g. St. Xavier's Junior College"
            required
          />
          <Input
            label="Location"
            value={eduForm.location}
            onChange={(e) => setEduForm({ ...eduForm, location: e.target.value })}
            placeholder="e.g. Pune, Maharashtra"
          />
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Start Year"
              value={eduForm.startYear}
              onChange={(e) => setEduForm({ ...eduForm, startYear: e.target.value })}
              placeholder="2018"
            />
            <Input
              label="End Year"
              value={eduForm.graduationYear}
              onChange={(e) => setEduForm({ ...eduForm, graduationYear: e.target.value })}
              placeholder="2020"
            />
            <Input
              label="Score"
              value={eduForm.score}
              onChange={(e) => setEduForm({ ...eduForm, score: e.target.value })}
              placeholder="85%"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Qualification
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
