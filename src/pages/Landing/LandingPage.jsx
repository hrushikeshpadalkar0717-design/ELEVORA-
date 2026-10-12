import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Play,
  Star,
  ShieldCheck,
  FileText,
  MessageSquareCode,
  Zap,
  Users,
  Award
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  const features = [
    {
      title: 'AI-Powered Content',
      desc: 'Get personalized content based on your profile and goals.',
      icon: Sparkles,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      title: 'ATS Optimization',
      desc: 'Build resumes optimized for Applicant Tracking Systems.',
      icon: ShieldCheck,
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      title: 'Industry-Specific Templates',
      desc: 'Templates designed for every career stage.',
      icon: FileText,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      title: 'Interview Preparation',
      desc: 'Get role-specific interview questions and tips.',
      icon: MessageSquareCode,
      color: 'text-cyan-600 bg-cyan-50',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f8fd] text-slate-800 flex flex-col antialiased">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <span className="font-extrabold text-lg">E</span>
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900">ELEVORA</span>
          </NavLink>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <a href="#home" className="text-blue-600 hover:text-blue-700">Home</a>
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How It Works</a>
            <a href="#testimonials" className="hover:text-slate-900 transition-colors">Testimonials</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/login')}
              className="text-xs font-semibold"
            >
              Log In
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/signup')}
              className="text-xs font-bold shadow-md shadow-blue-500/20"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-12 sm:pt-16 pb-16 px-4 sm:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Text (7 cols) */}
          <div className="lg:col-span-7 text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-600 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Resume Builder</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Build a Resume <br />
              That Gets <span className="text-gradient">You Hired</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
              Create professional, ATS-friendly resumes with the power of AI. Tailored to your field, role and career goals.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Button
                variant="gradient"
                size="lg"
                iconRight={ArrowRight}
                onClick={() => navigate('/signup')}
                className="shadow-lg shadow-blue-500/25 px-7"
              >
                Get Started Free
              </Button>
              <Button
                variant="outline"
                size="lg"
                icon={Play}
                onClick={() => setDemoModalOpen(true)}
                className="bg-white border-slate-300"
              >
                Watch Demo
              </Button>
            </div>

            {/* Statistics Row matching reference */}
            <div className="pt-8 grid grid-cols-3 gap-6 border-t border-slate-200/80 max-w-lg">
              <div>
                <span className="block text-2xl sm:text-3xl font-extrabold text-slate-900">50K+</span>
                <span className="text-xs font-medium text-slate-500">Resumes Generated</span>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">4.8</span>
                  <span className="text-xs text-slate-400">/5</span>
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
                <span className="text-xs font-medium text-slate-500">User Rating</span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-extrabold text-slate-900">95%</span>
                <span className="text-xs font-medium text-slate-500">ATS Success Rate</span>
              </div>
            </div>
          </div>

          {/* Right Hero Graphic Mockup (5 cols) matching panel 3 */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Floating badges surrounding mockup */}
              <div className="absolute -top-4 -right-4 z-20 bg-white/95 backdrop-blur-md rounded-xl p-2.5 shadow-lg border border-slate-200 flex items-center gap-2 animate-float">
                <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-800">AI Powered</span>
              </div>

              <div className="absolute top-1/3 -left-6 z-20 bg-white/95 backdrop-blur-md rounded-xl p-2.5 shadow-lg border border-slate-200 flex items-center gap-2 animate-float [animation-delay:1s]">
                <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-800">ATS Friendly</span>
              </div>

              <div className="absolute -bottom-4 right-6 z-20 bg-white/95 backdrop-blur-md rounded-xl p-2.5 shadow-lg border border-slate-200 flex items-center gap-2 animate-float [animation-delay:2s]">
                <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Award className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-800">Industry Specific</span>
              </div>

              {/* Main 3D Card Simulation */}
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-6 space-y-4 text-left transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                      JD
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">John Doe</h4>
                      <p className="text-[10px] text-blue-600 font-semibold">Mechanical Design Engineer</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                    95% Match
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="h-2 bg-slate-100 rounded-full w-full" />
                  <div className="h-2 bg-slate-100 rounded-full w-5/6" />
                  <div className="h-2 bg-slate-100 rounded-full w-4/6" />
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1.5">
                    <span>Key Competencies</span>
                    <span className="text-blue-600">SolidWorks • ANSYS</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <span className="bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded">CAD 3D</span>
                    <span className="bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded">GD&T</span>
                    <span className="bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded">Simulation</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-blue-600">ATS Score</span>
                    <p className="text-base font-extrabold text-slate-900">92 / 100</p>
                  </div>
                  <Button size="sm" variant="primary" onClick={() => navigate('/signup')} className="text-xs">
                    Try Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose ELEVORA Section */}
      <section id="features" className="py-20 px-4 sm:px-8 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Why Choose ELEVORA?</h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
            Everything you need to create a resume that stands out to recruiters and applicant tracking systems.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10 text-left">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-200 hover:shadow-card-hover transition-all duration-200 group"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feat.color}`}>
                    <Icon className="w-6 h-6 transition-transform group-hover:scale-110" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800 mb-1.5">{feat.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-8 bg-[#f5f8fd]">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">How It Works</h2>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            Three simple steps between where you are and landing your next dream interview.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 text-left">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                1
              </span>
              <h3 className="text-base font-bold text-slate-800 mb-1">Enter Your Experience</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Provide your education, projects, and target roles in our step-by-step intuitive wizard.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                2
              </span>
              <h3 className="text-base font-bold text-slate-800 mb-1">AI Enhances & Optimizes</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Our AI synthesizes strong action bullets, integrates missing job keywords, and calculates your ATS score.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                3
              </span>
              <h3 className="text-base font-bold text-slate-800 mb-1">Download & Apply</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Export ATS-formatted PDF and DOCX files ready for company career portals and LinkedIn Easy Apply.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-16 px-4 sm:px-8 bg-gradient-to-r from-[#0a1128] to-[#121e42] text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready to build your career-defining resume?</h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Join over 50,000 professionals who accelerated their hiring pipeline with ELEVORA.
          </p>
          <div>
            <Button
              variant="gradient"
              size="lg"
              onClick={() => navigate('/signup')}
              className="px-8 shadow-lg shadow-blue-500/30"
            >
              Get Started for Free
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 px-4 sm:px-8 border-t border-slate-200 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">ELEVORA</span>
            <span>© {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <a href="#features" className="hover:text-slate-800">Features</a>
            <a href="#privacy" className="hover:text-slate-800">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-800">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Interactive Demo Video Modal */}
      <Modal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        title="ELEVORA Product Walkthrough"
        subtitle="See how our multi-step AI wizard generates interview-ready resumes in minutes."
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          <div className="w-full aspect-video bg-slate-900 rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 text-white relative">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg animate-pulse mb-3">
              <Play className="w-6 h-6 ml-1" />
            </div>
            <p className="text-sm font-bold">Interactive Walkthrough Demo</p>
            <p className="text-xs text-slate-400 mt-1">Multi-step wizard • Live ATS scoring • Word & PDF export</p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setDemoModalOpen(false)}>
              Close
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/signup')}>
              Try It Yourself
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
