import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { ArrowRight, User, Mail, Phone, MapPin, Globe, Sparkles, Edit3 } from 'lucide-react';
import { LinkedinIcon } from '../../components/common/BrandIcons';
import { useResume } from '../../context/ResumeContext';
import { useToast } from '../../context/ToastContext';

export const StepBasics = () => {
  const navigate = useNavigate();
  const { profile, updateProfile } = useResume();
  const { showToast } = useToast();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profile.fullName || '',
    email: profile.email || '',
    phone: profile.phone || '',
    field: profile.field || 'Engineering',
    subfield: profile.subfield || 'Mechanical Engineering',
    location: profile.location || 'Pune, Maharashtra',
    linkedin: profile.linkedin || 'https://linkedin.com/in/johndoe',
    portfolio: profile.portfolio || 'https://johndoe.dev',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    updateProfile({ [name]: value });
  };

  const handleSaveModal = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditModalOpen(false);
    showToast('Profile information updated', 'success');
  };

  const handleNext = () => {
    updateProfile(formData);
    navigate('/create-resume/career');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Step Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">1. Basics Introduction</h1>
        <p className="text-sm text-slate-500 mt-1">Let's start with some basic information about you.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Basic Info Card (2 cols) */}
        <Card className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Basic Information</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              We already have your name, email, phone and field from your signup. Please confirm or update if needed.
            </p>
          </div>

          {/* User Profile Card Preview */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200/80 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-lg overflow-hidden shrink-0 border-2 border-white shadow-sm">
                {formData.fullName ? formData.fullName.slice(0, 2).toUpperCase() : 'JD'}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">{formData.fullName || 'John Doe'}</h3>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {formData.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {formData.phone}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-block text-[11px] font-semibold bg-blue-100/70 text-blue-700 px-2 py-0.5 rounded-md">
                    {formData.field}
                  </span>
                  <span className="text-slate-400 text-xs">•</span>
                  <span className="inline-block text-[11px] font-semibold bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded-md">
                    {formData.subfield}
                  </span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              icon={Edit3}
              onClick={() => setIsEditModalOpen(true)}
              className="shrink-0 self-end sm:self-center"
            >
              Edit
            </Button>
          </div>

          {/* Additional Details Form */}
          <div className="pt-2 border-t border-slate-100 space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Additional Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Input
                  label="Location (City, State)"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Pune, Maharashtra"
                  icon={MapPin}
                />
              </div>
              <div>
                <Input
                  label="LinkedIn Profile (Optional)"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                  icon={LinkedinIcon}
                />
              </div>
              <div>
                <Input
                  label="Portfolio / Website (Optional)"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                  placeholder="https://yourportfolio.com"
                  icon={Globe}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Right Side Encouraging Illustration Card */}
        <div className="flex flex-col gap-6">
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white rounded-2xl border border-blue-100 p-6 flex flex-col items-center text-center shadow-card justify-center h-full min-h-[280px]">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4 animate-float">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Great! Let's build your professional story.</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-xs">
              Every detail you provide helps our AI generate an ATS-tailored resume that grabs recruiters' attention.
            </p>
            <div className="mt-5 w-full bg-white/80 backdrop-blur-xs rounded-xl p-3 border border-blue-100/60 text-xs text-slate-600">
              <span className="font-semibold text-blue-600">Pro Tip:</span> Including location and LinkedIn increases recruiter outreach by 40%.
            </div>
          </div>
        </div>
      </div>

      {/* Step Footer Actions */}
      <div className="flex items-center justify-end pt-4 border-t border-slate-200">
        <Button variant="primary" size="md" iconRight={ArrowRight} onClick={handleNext}>
          Next
        </Button>
      </div>

      {/* Edit Basic Info Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Basic Information"
        subtitle="Update your contact and specialization details."
      >
        <form onSubmit={handleSaveModal} className="space-y-4 text-left">
          <Input
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            icon={User}
          />
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            icon={Mail}
          />
          <Input
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            icon={Phone}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Field"
              name="field"
              value={formData.field}
              onChange={handleChange}
            />
            <Input
              label="Sub-field"
              name="subfield"
              value={formData.subfield}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" size="sm" type="button" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
