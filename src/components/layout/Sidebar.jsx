import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileEdit,
  FolderOpen,
  MessageSquareCode,
  User,
  Settings,
  HelpCircle,
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { profile } = useResume();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Create Resume', path: '/create-resume/basics', icon: FileEdit },
    { label: 'My Resumes', path: '/resumes', icon: FolderOpen },
    { label: 'Interview Prep', path: '/interview-prep', icon: MessageSquareCode },
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0a1128] text-slate-300 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Logo Section */}
        <div>
          <div className="flex items-center justify-between px-6 py-6 border-b border-slate-800/80">
            <NavLink to="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <span className="font-extrabold text-xl tracking-tight">E</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg text-white tracking-tight">ELEVORA</span>
                  <span className="text-[10px] font-semibold bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full border border-blue-500/30">PRO</span>
                </div>
                <span className="text-[11px] text-slate-400 font-normal">Build Your Future</span>
              </div>
            </NavLink>

            {/* Close button on mobile */}
            <button
              onClick={onClose}
              className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="px-4 py-6 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024 && onClose) onClose();
                  }}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Banner & Help */}
        <div className="p-4 space-y-4">
          {/* Upgrade to Pro Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-slate-700/60 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-2 text-blue-400 mb-1.5">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Upgrade to Pro</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Get access to premium templates, advanced AI suggestions and more.
            </p>
            <button
              onClick={() => navigate('/pricing')}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
            >
              <span>Go Pro</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Need Help Link */}
          <a
            href="mailto:support@elevora.app"
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span>Need Help?</span>
          </a>
        </div>
      </aside>
    </>
  );
};
