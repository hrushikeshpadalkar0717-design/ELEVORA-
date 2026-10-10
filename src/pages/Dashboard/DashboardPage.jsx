import React, { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import {
  UploadCloud,
  Search,
  CheckCircle2,
  FileText,
  User,
  ArrowRight,
  Briefcase,
  Sparkles,
  Loader2,
  Edit3,
  Tag
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useToast } from '../../context/ToastContext';
import { getRolesForProfile } from '../../data/initialData';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { profile, careerGoal, setTargetRoles } = useResume();
  const { showToast } = useToast();

  const fileInputRef = useRef(null);

  // ── Dynamic roles list based on user's field + subfield ──────
  const dynamicRolesList = useMemo(
    () => getRolesForProfile(profile.field, profile.subfield),
    [profile.field, profile.subfield]
  );

  // Seed selected roles: prefer saved goal roles that exist in the dynamic list,
  // otherwise start with the first 3 from the dynamic list.
  const [selectedRoles, setSelectedRoles] = useState(() => {
    const saved = careerGoal.targetRoles || [];
    const intersection = saved.filter((r) => dynamicRolesList.includes(r));
    return intersection.length > 0 ? intersection : dynamicRolesList.slice(0, 3);
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Filtered roles based on search
  const filteredRoles = dynamicRolesList.filter((r) =>
    r.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isAllSelected = filteredRoles.length > 0 && filteredRoles.every((r) => selectedRoles.includes(r));

  const handleToggleRole = (role) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRoles((prev) => prev.filter((r) => !filteredRoles.includes(r)));
    } else {
      const combined = Array.from(new Set([...selectedRoles, ...filteredRoles]));
      setSelectedRoles(combined);
    }
  };

  const handleSaveAndContinue = () => {
    if (selectedRoles.length === 0) {
      showToast('Please select at least one target role', 'error');
      return;
    }
    setTargetRoles(selectedRoles);
    showToast('Target roles saved successfully!', 'success');
    navigate('/create-resume/basics');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.match(/\.(pdf|docx)$/i)) {
      showToast('Please upload a PDF or DOCX file', 'error');
      return;
    }

    setIsUploading(true);
    setUploadedFileName(file.name);

    setTimeout(() => {
      setIsUploading(false);
      showToast(`Successfully extracted profile details from ${file.name}!`, 'success');
    }, 1500);
  };

  return (
    <div className="space-y-8 text-left">
      {/* Welcome Banner */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome back, {profile.fullName?.split(' ')[0] || 'John'}! 👋
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
          Let's build something great. Your profile is ready — now choose your roles and start your journey.
        </p>
      </div>

      {/* Top 2 Cards Grid: Profile Card + Import Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <Card className="flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Profile</span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                Active
              </span>
            </div>

            <div className="pt-4 flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-lg overflow-hidden shrink-0 border-2 border-white shadow-sm">
                {profile.fullName ? profile.fullName.slice(0, 2).toUpperCase() : 'JD'}
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">{profile.fullName || 'John Doe'}</h3>
                <p className="text-xs text-slate-500">{profile.email}</p>
                <p className="text-xs text-slate-500">{profile.phone}</p>
                <div className="pt-1">
                  <span className="text-xs font-medium text-slate-600">
                    {profile.field} • {profile.subfield}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              icon={Edit3}
              onClick={() => navigate('/profile')}
              className="w-full sm:w-auto"
            >
              Edit Profile
            </Button>
          </div>
        </Card>

        {/* Import Existing Resume Card */}
        <Card className="flex flex-col justify-between space-y-4 bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/30 border-blue-100/70">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Fast Track Setup</span>
              </span>
              <span className="text-[11px] text-slate-400">PDF, DOCX (Max 5MB)</span>
            </div>

            <div className="pt-4 space-y-2">
              <h3 className="text-base font-bold text-slate-900">Import Your Existing Resume</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Upload your resume (PDF/DOCX) to auto-fill your details and get better suggestions.
              </p>

              {uploadedFileName && (
                <div className="mt-3 flex items-center gap-2 p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-800 font-medium">
                  <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="truncate">{uploadedFileName}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 ml-auto shrink-0" />
                </div>
              )}
            </div>
          </div>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
            />
            <Button
              variant="primary"
              size="sm"
              icon={isUploading ? Loader2 : UploadCloud}
              isLoading={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto"
            >
              {isUploading ? 'Extracting Resume...' : 'Upload Resume'}
            </Button>
          </div>
        </Card>
      </div>

      {/* Target Roles Selection Section — dynamically generated by field+subfield */}
      <Card className="space-y-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="text-lg font-bold text-slate-900">Select Roles You're Targeting</h2>
            {(profile.field || profile.subfield) && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-2.5 py-0.5">
                <Tag className="w-3 h-3" />
                {profile.subfield || profile.field}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Roles curated for <span className="font-semibold text-slate-700">{profile.subfield || profile.field || 'your profile'}</span>.
            Choose the positions you want to target — we'll tailor your resume and interview prep accordingly.
          </p>
        </div>

        {/* Search & Select All controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search for roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={handleToggleSelectAll}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <span>Select All</span>
          </label>
        </div>

        {/* Role Options Grid matching screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {filteredRoles.map((role) => {
            const isSelected = selectedRoles.includes(role);
            return (
              <div
                key={role}
                onClick={() => handleToggleRole(role)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs select-none ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span>{role}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end pt-4 border-t border-slate-100">
          <Button
            variant="primary"
            size="md"
            iconRight={ArrowRight}
            onClick={handleSaveAndContinue}
            className="px-6"
          >
            Save & Continue
          </Button>
        </div>
      </Card>
    </div>
  );
};
