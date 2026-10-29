import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import {
  User,
  Lock,
  Bell,
  Sparkles,
  Trash2
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useToast } from '../../context/ToastContext';

export const SettingsPage = () => {
  const navigate = useNavigate();
  const { profile, logout, userPlan } = useResume();
  const currentPlan = (userPlan || profile?.plan || 'free').toLowerCase();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('account');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Form states
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoAtsOptimize, setAutoAtsOptimize] = useState(true);

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'password', label: 'Password', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Sparkles },
  ];

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Settings saved successfully', 'success');
  };

  const handleDeleteAccount = () => {
    setDeleteModalOpen(false);
    logout();
    showToast('Account deleted successfully', 'info');
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your account preferences, security, and notifications.</p>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-bold transition-colors whitespace-nowrap ${
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <Card className="p-6 space-y-6">
        {activeTab === 'account' && (
          <form onSubmit={handleSave} className="space-y-5">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Account Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Registered Email" value={profile.email} disabled />
              <Input label="Account Tier" value={`ELEVORA ${currentPlan.toUpperCase()} (${currentPlan === 'free' ? 'Standard' : 'Active'})`} disabled />
            </div>

            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              currentPlan === 'ultra'
                ? 'bg-gradient-to-r from-amber-50 to-orange-50/60 border-amber-200'
                : currentPlan === 'pro'
                ? 'bg-gradient-to-r from-blue-50 to-indigo-50/60 border-blue-100'
                : 'bg-gradient-to-r from-slate-50 to-slate-100/60 border-slate-200'
            }`}>
              <div>
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  currentPlan === 'ultra' ? 'text-amber-800' : currentPlan === 'pro' ? 'text-blue-800' : 'text-slate-700'
                }`}>
                  ELEVORA {currentPlan.toUpperCase()} Plan
                </span>
                <p className="text-xs text-slate-600 mt-0.5">
                  {currentPlan === 'ultra'
                    ? 'Unlimited resumes, all templates, dedicated support & priority ATS'
                    : currentPlan === 'pro'
                    ? 'Up to 10 resumes, all 10+ premium templates & full ATS insights'
                    : '1 resume, basic ATS scanning, and essential templates'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold text-white px-3 py-1 rounded-lg shadow-sm ${
                  currentPlan === 'ultra' ? 'bg-amber-600' : currentPlan === 'pro' ? 'bg-blue-600' : 'bg-slate-600'
                }`}>
                  Active
                </span>
                {currentPlan !== 'ultra' && (
                  <button
                    type="button"
                    onClick={() => navigate('/pricing')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 underline ml-2"
                  >
                    Upgrade
                  </button>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button variant="primary" size="sm" type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        )}

        {activeTab === 'password' && (
          <form onSubmit={handleSave} className="space-y-4 max-w-md">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Change Password</h3>
            <Input label="Current Password" type="password" placeholder="••••••••" required />
            <Input label="New Password" type="password" placeholder="••••••••" required />
            <Input label="Confirm New Password" type="password" placeholder="••••••••" required />

            <div className="pt-2">
              <Button variant="primary" size="sm" type="submit">
                Update Password
              </Button>
            </div>
          </form>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Notification Preferences</h3>
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Job Market Keyword Alerts</span>
                <span className="text-[11px] text-slate-500">Get notified when high-frequency ATS keywords emerge for your role</span>
              </div>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Email Digest</span>
                <span className="text-[11px] text-slate-500">Receive weekly interview prep tips & resume analytics</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>

            <div className="flex justify-end pt-3">
              <Button variant="primary" size="sm" onClick={handleSave}>
                Save Preferences
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">AI Generation Preferences</h3>
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Automatic ATS Keyword Insertion</span>
                <span className="text-[11px] text-slate-500">Auto-align action bullet points with target role descriptions</span>
              </div>
              <input
                type="checkbox"
                checked={autoAtsOptimize}
                onChange={(e) => setAutoAtsOptimize(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>

            <div className="flex justify-end pt-3">
              <Button variant="primary" size="sm" onClick={handleSave}>
                Save Preferences
              </Button>
            </div>
          </div>
        )}

        {/* Danger Zone */}
        <div className="pt-6 border-t border-rose-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-rose-50/50 border border-rose-200">
            <div>
              <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider">Danger Zone</h4>
              <p className="text-xs text-rose-600 mt-0.5">Permanently delete your profile, saved resumes, and account data.</p>
            </div>
            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={() => setDeleteModalOpen(true)}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Account"
        subtitle="This action is irreversible. All your saved resumes will be deleted."
        maxWidth="max-w-md"
      >
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="secondary" size="sm" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleDeleteAccount}>
            Permanently Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};
