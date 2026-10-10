import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, TextArea, Select } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { ArrowLeft, ArrowRight, Plus, Edit3, Trash2, FolderKanban, Sparkles } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useToast } from '../../context/ToastContext';

export const StepProjects = () => {
  const navigate = useNavigate();
  const { projects, addProject, updateProject, deleteProject } = useResume();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [projectForm, setProjectForm] = useState({
    name: '',
    type: 'Academic',
    description: '',
    technologies: '',
    role: '',
    duration: '',
    keyFeatures: '',
    link: ''
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setProjectForm({
      name: '',
      type: 'Academic',
      description: '',
      technologies: '',
      role: 'Developer / Designer',
      duration: '3 months',
      keyFeatures: '',
      link: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proj) => {
    setEditingItem(proj);
    setProjectForm({
      name: proj.name,
      type: proj.type || 'Academic',
      description: proj.description || '',
      technologies: Array.isArray(proj.technologies) ? proj.technologies.join(', ') : '',
      role: proj.role || '',
      duration: proj.duration || '',
      keyFeatures: Array.isArray(proj.keyFeatures) ? proj.keyFeatures.join('\n') : '',
      link: proj.link || ''
    });
    setIsModalOpen(true);
  };

  const handleSaveModal = (e) => {
    e.preventDefault();
    if (!projectForm.name.trim()) {
      showToast('Please enter project name', 'error');
      return;
    }

    const payload = {
      name: projectForm.name,
      type: projectForm.type,
      description: projectForm.description,
      role: projectForm.role,
      duration: projectForm.duration,
      link: projectForm.link,
      technologies: projectForm.technologies
        ? projectForm.technologies.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
      keyFeatures: projectForm.keyFeatures
        ? projectForm.keyFeatures.split('\n').map((f) => f.trim()).filter(Boolean)
        : []
    };

    if (editingItem) {
      updateProject(editingItem.id, payload);
      showToast('Project updated successfully', 'success');
    } else {
      addProject(payload);
      showToast('Project added successfully', 'success');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">4. Projects</h1>
          <p className="text-sm text-slate-500 mt-1">Showcase your key projects, academic or personal, that demonstrate your skills.</p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenAdd}>
          Add Project
        </Button>
      </div>

      {/* Projects List */}
      {projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects added yet"
          description="Projects give recruiters tangible proof of your technical capabilities."
          actionLabel="+ Add Project"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="space-y-4">
          {projects.map((proj) => (
            <Card key={proj.id} className="relative transition-all hover:border-slate-300">
              {/* Header with Title, Badge, Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold text-slate-900">{proj.name}</h3>
                  {proj.type && (
                    <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">
                      {proj.type}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  <button
                    onClick={() => handleOpenEdit(proj)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Edit project"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      deleteProject(proj.id);
                      showToast('Project removed', 'info');
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="pt-3 space-y-3 text-xs">
                <div>
                  <span className="font-semibold text-slate-700 block mb-1">Description</span>
                  <p className="text-slate-600 leading-relaxed">{proj.description}</p>
                </div>

                {/* Technologies pills */}
                {proj.technologies && proj.technologies.length > 0 && (
                  <div>
                    <span className="font-semibold text-slate-700 block mb-1.5">Technologies Used</span>
                    <div className="flex flex-wrap gap-1.5">
                      {proj.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="bg-slate-100 text-slate-700 font-medium px-2.5 py-1 rounded-lg border border-slate-200/60"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Role and Duration Row */}
                <div className="grid grid-cols-2 gap-4 py-2 border-y border-slate-100">
                  <div>
                    <span className="font-semibold text-slate-700 block text-[11px]">Role</span>
                    <span className="text-slate-600">{proj.role || 'Contributor'}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700 block text-[11px]">Duration</span>
                    <span className="text-slate-600">{proj.duration || 'N/A'}</span>
                  </div>
                </div>

                {/* Key Features Bullets */}
                {proj.keyFeatures && proj.keyFeatures.length > 0 && (
                  <div>
                    <span className="font-semibold text-slate-700 block mb-1">Key Features</span>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                      {proj.keyFeatures.map((feat, idx) => (
                        <li key={idx}>{feat}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <Button variant="outline" size="md" icon={ArrowLeft} onClick={() => navigate('/create-resume/education')}>
          Back
        </Button>
        <Button variant="primary" size="md" iconRight={ArrowRight} onClick={() => navigate('/create-resume/experience')}>
          Next
        </Button>
      </div>

      {/* Add / Edit Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Project' : 'Add Project'}
        subtitle="Highlight technical details, tools used, and measurable results."
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSaveModal} className="space-y-4 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <Input
                label="Project Name"
                value={projectForm.name}
                onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                placeholder="e.g. Smart Inspection System"
                required
              />
            </div>
            <div>
              <Select
                label="Project Type"
                value={projectForm.type}
                onChange={(e) => setProjectForm({ ...projectForm, type: e.target.value })}
                options={['Academic', 'Personal', 'Capstone', 'Client', 'Open Source']}
              />
            </div>
          </div>

          <TextArea
            label="Description"
            value={projectForm.description}
            onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
            placeholder="Developed a machine vision-based system to detect defects in mechanical parts using OpenCV and Python."
            rows={2}
            required
          />

          <Input
            label="Technologies Used (comma separated)"
            value={projectForm.technologies}
            onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
            placeholder="Python, OpenCV, MATLAB, SolidWorks"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Your Role"
              value={projectForm.role}
              onChange={(e) => setProjectForm({ ...projectForm, role: e.target.value })}
              placeholder="e.g. Team Lead"
            />
            <Input
              label="Duration"
              value={projectForm.duration}
              onChange={(e) => setProjectForm({ ...projectForm, duration: e.target.value })}
              placeholder="e.g. 3 months"
            />
          </div>

          <TextArea
            label="Key Features / Impact (one bullet per line)"
            value={projectForm.keyFeatures}
            onChange={(e) => setProjectForm({ ...projectForm, keyFeatures: e.target.value })}
            placeholder="Real-time defect detection&#10;Automated reporting&#10;High accuracy (92%)"
            rows={3}
          />

          <Input
            label="Project Link / GitHub (Optional)"
            value={projectForm.link}
            onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
            placeholder="https://github.com/username/project"
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
