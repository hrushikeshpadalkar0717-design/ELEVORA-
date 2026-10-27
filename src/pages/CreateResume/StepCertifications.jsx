import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { ArrowLeft, ArrowRight, Plus, Edit3, Trash2, Award, Trophy, ExternalLink } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useToast } from '../../context/ToastContext';
import { ensureUrl } from '../../utils/linkUtils';

export const StepCertifications = () => {
  const navigate = useNavigate();
  const {
    certifications,
    addCertification,
    updateCertification,
    deleteCertification,
    achievements,
    addAchievement,
    updateAchievement,
    deleteAchievement
  } = useResume();
  const { showToast } = useToast();

  // Cert Modal State
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [certForm, setCertForm] = useState({ name: '', issuer: '', date: '', credentialId: '', link: '' });

  // Achievement Modal State
  const [achModalOpen, setAchModalOpen] = useState(false);
  const [editingAch, setEditingAch] = useState(null);
  const [achForm, setAchForm] = useState({ title: '', description: '', year: '' });

  // Open Cert Modal
  const handleOpenAddCert = () => {
    setEditingCert(null);
    setCertForm({ name: '', issuer: '', date: '', credentialId: '', link: '' });
    setCertModalOpen(true);
  };

  const handleOpenEditCert = (item) => {
    setEditingCert(item);
    setCertForm({
      name: item.name || '',
      issuer: item.issuer || '',
      date: item.date || '',
      credentialId: item.credentialId || '',
      link: item.link || item.url || ''
    });
    setCertModalOpen(true);
  };

  const handleSaveCert = (e) => {
    e.preventDefault();
    if (!certForm.name.trim()) return;
    if (editingCert) {
      updateCertification(editingCert.id, certForm);
      showToast('Certification updated', 'success');
    } else {
      addCertification(certForm);
      showToast('Certification added', 'success');
    }
    setCertModalOpen(false);
  };

  // Open Achievement Modal
  const handleOpenAddAch = () => {
    setEditingAch(null);
    setAchForm({ title: '', description: '', year: '' });
    setAchModalOpen(true);
  };

  const handleOpenEditAch = (item) => {
    setEditingAch(item);
    setAchForm({ ...item });
    setAchModalOpen(true);
  };

  const handleSaveAch = (e) => {
    e.preventDefault();
    if (!achForm.title.trim()) return;
    if (editingAch) {
      updateAchievement(editingAch.id, achForm);
      showToast('Achievement updated', 'success');
    } else {
      addAchievement(achForm);
      showToast('Achievement added', 'success');
    }
    setAchModalOpen(false);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">7. Certifications & Achievements</h1>
        <p className="text-sm text-slate-500 mt-1">Add your certifications, awards, and achievements (if any).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Certifications Card */}
        <Card className="flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Certifications</h2>
                <p className="text-xs text-slate-400">Industry-recognized credentials</p>
              </div>
              <Button variant="outline" size="sm" icon={Plus} onClick={handleOpenAddCert}>
                Add Certification
              </Button>
            </div>

            <div className="pt-4 space-y-3 min-h-[220px]">
              {certifications && certifications.length > 0 ? (
                certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="flex items-start justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/60 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{cert.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{cert.issuer}</p>
                        <p className="text-[11px] text-slate-400 mt-1">{cert.date}</p>
                        {(cert.link || cert.url) && (
                          <a
                            href={ensureUrl(cert.link || cert.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline mt-1.5"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>View Certificate</span>
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditCert(cert)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-200"
                        title="Edit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          deleteCertification(cert.id);
                          showToast('Certification removed', 'info');
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-200"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic text-center py-8">No certifications added yet.</p>
              )}
            </div>
          </div>
        </Card>

        {/* Right: Achievements Card */}
        <Card className="flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Achievements</h2>
                <p className="text-xs text-slate-400">Awards, hackathons & honors</p>
              </div>
              <Button variant="outline" size="sm" icon={Plus} onClick={handleOpenAddAch}>
                Add Achievement
              </Button>
            </div>

            <div className="pt-4 space-y-3 min-h-[220px]">
              {achievements && achievements.length > 0 ? (
                achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className="flex items-start justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/60 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Trophy className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{ach.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{ach.description}</p>
                        <p className="text-[11px] text-slate-400 mt-1">{ach.year}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditAch(ach)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-200"
                        title="Edit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          deleteAchievement(ach.id);
                          showToast('Achievement removed', 'info');
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-200"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic text-center py-8">No achievements added yet.</p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <Button variant="outline" size="md" icon={ArrowLeft} onClick={() => navigate('/create-resume/skills')}>
          Back
        </Button>
        <Button variant="primary" size="md" iconRight={ArrowRight} onClick={() => navigate('/create-resume/review')}>
          Next
        </Button>
      </div>

      {/* Add / Edit Certification Modal */}
      <Modal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        title={editingCert ? 'Edit Certification' : 'Add Certification'}
        subtitle="e.g. SolidWorks Professional, AWS Certified, Six Sigma"
      >
        <form onSubmit={handleSaveCert} className="space-y-4 text-left">
          <Input
            label="Certification Name"
            value={certForm.name}
            onChange={(e) => setCertForm({ ...certForm, name: e.target.value })}
            placeholder="e.g. SolidWorks Professional (CSWP)"
            required
            autoFocus
          />
          <Input
            label="Issuing Organization"
            value={certForm.issuer}
            onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
            placeholder="e.g. Dassault Systèmes"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Issue Date"
              value={certForm.date}
              onChange={(e) => setCertForm({ ...certForm, date: e.target.value })}
              placeholder="e.g. Jan 2023"
            />
            <Input
              label="Credential ID (Optional)"
              value={certForm.credentialId}
              onChange={(e) => setCertForm({ ...certForm, credentialId: e.target.value })}
              placeholder="e.g. CSWP-1289"
            />
          </div>

          <Input
            label="Certificate URL / Verification Link (Optional)"
            value={certForm.link}
            onChange={(e) => setCertForm({ ...certForm, link: e.target.value })}
            placeholder="https://coursera.org/verify/... or certificate link"
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" type="button" onClick={() => setCertModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Certification
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add / Edit Achievement Modal */}
      <Modal
        isOpen={achModalOpen}
        onClose={() => setAchModalOpen(false)}
        title={editingAch ? 'Edit Achievement' : 'Add Achievement'}
        subtitle="e.g. Hackathons, Competitions, Academic Honors"
      >
        <form onSubmit={handleSaveAch} className="space-y-4 text-left">
          <Input
            label="Achievement Title"
            value={achForm.title}
            onChange={(e) => setAchForm({ ...achForm, title: e.target.value })}
            placeholder="e.g. 3rd Rank in National Level Design Competition"
            required
            autoFocus
          />
          <Input
            label="Awarding Entity / Description"
            value={achForm.description}
            onChange={(e) => setAchForm({ ...achForm, description: e.target.value })}
            placeholder="e.g. IIT Bombay Techfest"
            required
          />
          <Input
            label="Year"
            value={achForm.year}
            onChange={(e) => setAchForm({ ...achForm, year: e.target.value })}
            placeholder="2023"
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" type="button" onClick={() => setAchModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Achievement
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
