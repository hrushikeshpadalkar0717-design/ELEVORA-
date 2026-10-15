import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, TextArea, Select } from '../../components/common/Input';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  CheckCircle2,
  Camera,
  Sparkles
} from 'lucide-react';
import { LinkedinIcon, GithubIcon } from '../../components/common/BrandIcons';
import { useResume } from '../../context/ResumeContext';
import { useToast } from '../../context/ToastContext';
import { MAIN_FIELDS, getSubfields, getFieldDisplayLabel, normalizeLegacyProfile } from '../../data/careerTaxonomy';

export const ProfilePage = () => {
  const { profile, updateProfile, careerGoal, updateCareerGoal } = useResume();
  const { showToast } = useToast();

  // Ensure stored profile values are normalized before populating the form
  const normalized = normalizeLegacyProfile(profile.field || '', profile.subfield || '');

  const [formData, setFormData] = useState({
    fullName: profile.fullName || '',
    email: profile.email || '',
    phone: profile.phone || '',
    field: normalized.field,
    subfield: normalized.subfield,
    location: profile.location || 'Pune, Maharashtra',
    linkedin: profile.linkedin || '',
    portfolio: profile.portfolio || '',
    github: profile.github || '',
    summary: careerGoal.summary || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      field: formData.field,
      subfield: formData.subfield,
      location: formData.location,
      linkedin: formData.linkedin,
      portfolio: formData.portfolio,
      github: formData.github
    });
    updateCareerGoal({ summary: formData.summary });
    showToast('Profile updated successfully!', 'success');
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">User Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your identity, contact information, and public links.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Card */}
        <Card className="flex flex-col sm:flex-row items-center gap-6 p-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-3xl overflow-hidden border-4 border-white shadow-md">
              {formData.fullName ? formData.fullName.slice(0, 2).toUpperCase() : 'JD'}
            </div>
            <button
              type="button"
              onClick={() => showToast('Avatar updated', 'info')}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-slate-900 text-white hover:bg-blue-600 transition-colors shadow-sm"
              title="Change Photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <h2 className="text-lg font-bold text-slate-900">{formData.fullName || 'John Doe'}</h2>
            <p className="text-xs font-semibold text-blue-600">{formData.field} • {formData.subfield}</p>
            <p className="text-xs text-slate-400">{formData.email}</p>
          </div>
        </Card>

        {/* Form fields card */}
        <Card className="space-y-5 p-6">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
            Personal & Contact Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              icon={User}
              required
            />
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              icon={Mail}
              required
            />
            <Input
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              icon={Phone}
            />
            <Input
              label="Location (City, State)"
              name="location"
              value={formData.location}
              onChange={handleChange}
              icon={MapPin}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Select
              label="Main Field"
              name="field"
              value={getFieldDisplayLabel(formData.field)}
              onChange={(e) => {
                const rawField = MAIN_FIELDS.find((f) => getFieldDisplayLabel(f) === e.target.value) || e.target.value;
                const firstSub = getSubfields(rawField)[0] || '';
                setFormData((prev) => ({ ...prev, field: rawField, subfield: firstSub }));
              }}
              options={MAIN_FIELDS.map((f) => getFieldDisplayLabel(f))}
            />
            <Select
              label="Sub-field / Specialization"
              name="subfield"
              value={formData.subfield}
              onChange={(e) => setFormData((prev) => ({ ...prev, subfield: e.target.value }))}
              options={getSubfields(formData.field)}
            />
          </div>

          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider pt-4 pb-2 border-b border-slate-100">
            Web & Social Profiles
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="LinkedIn URL"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              icon={LinkedinIcon}
              placeholder="https://linkedin.com/in/..."
            />
            <Input
              label="Portfolio / Website"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleChange}
              icon={Globe}
              placeholder="https://yourportfolio.com"
            />
            <Input
              label="GitHub URL"
              name="github"
              value={formData.github}
              onChange={handleChange}
              icon={GithubIcon}
              placeholder="https://github.com/..."
            />
          </div>

          <div className="pt-2">
            <TextArea
              label="Professional Bio"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button variant="primary" size="md" type="submit" className="px-6">
              Save Changes
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};
