import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Phone,
  Briefcase,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  User,
  Loader2,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { useResume } from '../../context/ResumeContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import {
  MAIN_FIELDS,
  getSubfields,
  getFieldDisplayLabel,
  getRoles,
} from '../../data/careerTaxonomy';

export const CompleteProfilePage = () => {
  const navigate = useNavigate();
  const { profile, updateProfile, setTargetRoles } = useResume();
  const { showToast } = useToast();

  const [phone, setPhone] = useState(profile?.phone || '');
  const [selectedField, setSelectedField] = useState(profile?.field || 'Engineering');
  const [selectedSubfield, setSelectedSubfield] = useState(profile?.subfield || 'CSE');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [prevProfile, setPrevProfile] = useState(profile);

  // Synchronize when profile becomes available (React render-adjustment pattern)
  if (profile !== prevProfile) {
    setPrevProfile(profile);
    if (profile?.phone && !phone) setPhone(profile.phone);
    if (profile?.field && selectedField === 'Engineering') setSelectedField(profile.field);
    if (profile?.subfield && selectedSubfield === 'CSE') setSelectedSubfield(profile.subfield);
  }

  // When field changes, reset subfield to first available for that field
  const handleFieldChange = (e) => {
    const rawDisplay = e.target.value;
    const rawKey =
      MAIN_FIELDS.find((f) => getFieldDisplayLabel(f) === rawDisplay) || rawDisplay;
    setSelectedField(rawKey);
    const subfields = getSubfields(rawKey);
    if (subfields.length > 0) {
      setSelectedSubfield(subfields[0]);
    }
  };

  const handleSubfieldChange = (e) => {
    setSelectedSubfield(e.target.value);
  };

  const validatePhone = (val) => {
    const clean = val.replace(/[\s\-()+]/g, '');
    if (!clean) {
      return 'Mobile number is required';
    }
    if (clean.length < 10) {
      return 'Please enter a valid mobile number (at least 10 digits)';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validatePhone(phone);
    if (err) {
      setPhoneError(err);
      showToast(err, 'error');
      return;
    }
    setPhoneError('');
    setIsSubmitting(true);

    try {
      const updatedData = {
        phone: phone.trim(),
        field: selectedField,
        subfield: selectedSubfield,
        hasCompletedOnboarding: true,
      };

      // 1. Persist to MongoDB backend
      await api.updateProfile(updatedData);

      // 2. Update context state
      updateProfile(updatedData);

      // 3. Update target roles for the chosen specialization
      const defaultRoles = getRoles(selectedField, selectedSubfield);
      if (defaultRoles?.length) {
        setTargetRoles(defaultRoles.slice(0, 4));
      }

      showToast('Profile configured successfully! Welcome to ELEVORA.', 'success');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Error saving profile onboarding:', error);
      showToast(error.message || 'Failed to save profile details. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldOptions = MAIN_FIELDS.map((f) => getFieldDisplayLabel(f));
  const subfieldOptions = getSubfields(selectedField);

  return (
    <div className="min-h-screen bg-[#f5f8fd] flex flex-col justify-center items-center p-4 sm:p-8">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-10 text-left relative overflow-hidden">
        {/* Decorative corner element */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

        {/* Brand Header */}
        <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
            <span className="font-extrabold text-lg">E</span>
          </div>
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-blue-600">Quick Onboarding</span>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Complete Your Profile Setup</h1>
          </div>
        </div>

        {/* User preview banner */}
        <div className="mt-6 p-4 rounded-2xl bg-blue-50/70 border border-blue-100/80 flex items-center gap-3.5">
          {profile?.avatar ? (
            <img
              src={profile.avatar}
              alt={profile.fullName || 'User'}
              className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0">
              <User className="w-5 h-5" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs text-blue-700 font-semibold uppercase tracking-wider">Signed in with Google</p>
            <p className="text-sm font-bold text-slate-900 truncate">{profile?.fullName || 'ELEVORA Candidate'}</p>
            <p className="text-xs text-slate-500 truncate">{profile?.email || 'your-google-account@email.com'}</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 mt-5 leading-relaxed">
          Before taking you to your personalized dashboard, please enter your mobile number and select your professional domain so we can generate tailored resume templates and ATS keywords.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Mobile Number */}
          <Input
            label="Mobile Number"
            type="tel"
            required
            icon={Phone}
            placeholder="e.g. +91 98765 43210"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (phoneError) setPhoneError('');
            }}
            error={phoneError}
            helperText="Used for employer contact and recruiter communications"
          />

          {/* Domain / Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-blue-600" />
              <span>Career Field / Domain</span>
              <span className="text-rose-500">*</span>
            </label>
            <Select
              options={fieldOptions}
              value={getFieldDisplayLabel(selectedField)}
              onChange={handleFieldChange}
            />
          </div>

          {/* Subfield / Specialization */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
              <span>Branch / Specialization</span>
              <span className="text-rose-500">*</span>
            </label>
            <Select
              options={subfieldOptions}
              value={selectedSubfield}
              onChange={handleSubfieldChange}
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Customizes your target job roles, technical skills dictionary, and interview prep questions.
            </p>
          </div>

          {/* Submit CTA */}
          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full justify-center shadow-lg shadow-blue-500/25"
              isLoading={isSubmitting}
              icon={isSubmitting ? Loader2 : ArrowRight}
            >
              {isSubmitting ? 'Configuring Your Dashboard...' : 'Save & Continue to Dashboard'}
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Your contact information is strictly secure and private.</span>
        </div>
      </div>
    </div>
  );
};
