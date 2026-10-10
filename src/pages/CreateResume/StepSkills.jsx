import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { ArrowLeft, ArrowRight, Plus, X, Globe, Sparkles, Check } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useToast } from '../../context/ToastContext';

export const StepSkills = () => {
  const navigate = useNavigate();
  const {
    skills,
    addTechnicalSkill,
    removeTechnicalSkill,
    addSoftSkill,
    removeSoftSkill,
    addLanguage,
    removeLanguage,
    updateLanguage
  } = useResume();
  const { showToast } = useToast();

  // Modals state
  const [techModalOpen, setTechModalOpen] = useState(false);
  const [newTechSkill, setNewTechSkill] = useState('');

  const [softModalOpen, setSoftModalOpen] = useState(false);
  const [newSoftSkill, setNewSoftSkill] = useState('');

  const [langModalOpen, setLangModalOpen] = useState(false);
  const [newLangName, setNewLangName] = useState('');
  const [newLangProficiency, setNewLangProficiency] = useState('Fluent');

  const proficiencyLevels = ['Native', 'Fluent', 'Intermediate', 'Basic'];

  // Add Tech skill
  const handleAddTech = (e) => {
    e.preventDefault();
    if (!newTechSkill.trim()) return;
    addTechnicalSkill(newTechSkill);
    showToast(`Added skill "${newTechSkill}"`, 'success');
    setNewTechSkill('');
    setTechModalOpen(false);
  };

  // Add Soft skill
  const handleAddSoft = (e) => {
    e.preventDefault();
    if (!newSoftSkill.trim()) return;
    addSoftSkill(newSoftSkill);
    showToast(`Added soft skill "${newSoftSkill}"`, 'success');
    setNewSoftSkill('');
    setSoftModalOpen(false);
  };

  // Add Language
  const handleAddLang = (e) => {
    e.preventDefault();
    if (!newLangName.trim()) return;
    addLanguage({ name: newLangName, proficiency: newLangProficiency });
    showToast(`Added language "${newLangName}"`, 'success');
    setNewLangName('');
    setLangModalOpen(false);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">6. Skills</h1>
        <p className="text-sm text-slate-500 mt-1">Add the skills and tools relevant to your field.</p>
      </div>

      {/* 3 Columns matching reference */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: Technical Skills */}
        <Card className="flex flex-col justify-between space-y-4">
          <div>
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Technical Skills</h2>
              <p className="text-xs text-slate-400 mt-0.5">Select your technical skills</p>
            </div>

            <div className="pt-4 flex flex-wrap gap-2 min-h-[140px] content-start">
              {skills.technical?.map((skill) => (
                <span
                  key={skill}
                  className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-semibold transition-all border border-slate-200/60"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => {
                      removeTechnicalSkill(skill);
                      showToast(`Removed ${skill}`, 'info');
                    }}
                    className="text-slate-400 hover:text-rose-500 p-0.5 rounded transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={Plus}
            onClick={() => setTechModalOpen(true)}
            className="w-full"
          >
            Add Custom Skill
          </Button>
        </Card>

        {/* Column 2: Soft Skills */}
        <Card className="flex flex-col justify-between space-y-4">
          <div>
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Soft Skills</h2>
              <p className="text-xs text-slate-400 mt-0.5">Select your soft skills</p>
            </div>

            <div className="pt-4 flex flex-wrap gap-2 min-h-[140px] content-start">
              {skills.soft?.map((skill) => (
                <span
                  key={skill}
                  className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50/70 hover:bg-blue-100/70 text-blue-900 text-xs font-semibold transition-all border border-blue-100"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => {
                      removeSoftSkill(skill);
                      showToast(`Removed ${skill}`, 'info');
                    }}
                    className="text-blue-400 hover:text-rose-500 p-0.5 rounded transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={Plus}
            onClick={() => setSoftModalOpen(true)}
            className="w-full"
          >
            Add Custom Skill
          </Button>
        </Card>

        {/* Column 3: Languages */}
        <Card className="flex flex-col justify-between space-y-4">
          <div>
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Languages</h2>
              <p className="text-xs text-slate-400 mt-0.5">Select languages and proficiency</p>
            </div>

            <div className="pt-4 space-y-2.5 min-h-[140px]">
              {skills.languages?.map((lang, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs"
                >
                  <span className="font-bold text-slate-800">{lang.name}</span>
                  <div className="flex items-center gap-2">
                    <select
                      value={lang.proficiency}
                      onChange={(e) => updateLanguage(idx, { proficiency: e.target.value })}
                      className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-semibold text-blue-700 focus:outline-hidden focus:border-blue-500"
                    >
                      {proficiencyLevels.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        removeLanguage(idx);
                        showToast(`Removed language`, 'info');
                      }}
                      className="text-slate-400 hover:text-rose-500 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={Plus}
            onClick={() => setLangModalOpen(true)}
            className="w-full"
          >
            Add Language
          </Button>
        </Card>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <Button variant="outline" size="md" icon={ArrowLeft} onClick={() => navigate('/create-resume/experience')}>
          Back
        </Button>
        <Button variant="primary" size="md" iconRight={ArrowRight} onClick={() => navigate('/create-resume/certifications')}>
          Next
        </Button>
      </div>

      {/* Add Tech Skill Modal */}
      <Modal
        isOpen={techModalOpen}
        onClose={() => setTechModalOpen(false)}
        title="Add Technical Skill"
        subtitle="e.g. Creo, Catia, GD&T, FEA Analysis, C++"
      >
        <form onSubmit={handleAddTech} className="space-y-4 text-left">
          <Input
            label="Skill Name"
            value={newTechSkill}
            onChange={(e) => setNewTechSkill(e.target.value)}
            placeholder="e.g. GD&T (Geometric Dimensioning)"
            required
            autoFocus
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" type="button" onClick={() => setTechModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Add Skill
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Soft Skill Modal */}
      <Modal
        isOpen={softModalOpen}
        onClose={() => setSoftModalOpen(false)}
        title="Add Soft Skill"
        subtitle="e.g. Critical Thinking, Stakeholder Management, Agile"
      >
        <form onSubmit={handleAddSoft} className="space-y-4 text-left">
          <Input
            label="Soft Skill Name"
            value={newSoftSkill}
            onChange={(e) => setNewSoftSkill(e.target.value)}
            placeholder="e.g. Conflict Resolution"
            required
            autoFocus
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" type="button" onClick={() => setSoftModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Add Skill
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Language Modal */}
      <Modal
        isOpen={langModalOpen}
        onClose={() => setLangModalOpen(false)}
        title="Add Language"
        subtitle="Specify spoken / written languages."
      >
        <form onSubmit={handleAddLang} className="space-y-4 text-left">
          <Input
            label="Language Name"
            value={newLangName}
            onChange={(e) => setNewLangName(e.target.value)}
            placeholder="e.g. German, French, Spanish"
            required
            autoFocus
          />
          <Select
            label="Proficiency Level"
            value={newLangProficiency}
            onChange={(e) => setNewLangProficiency(e.target.value)}
            options={proficiencyLevels}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" type="button" onClick={() => setLangModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Add Language
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
