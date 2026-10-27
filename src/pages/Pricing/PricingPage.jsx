import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  X,
  Sparkles,
  Zap,
  Crown,
  ArrowLeft,
  ArrowRight,
  Shield,
  Info
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

// ─── Plan definitions ────────────────────────────────────────────────────────
const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    tagline: 'Get started with the essentials',
    icon: Zap,
    iconColor: 'text-slate-500',
    iconBg: 'bg-slate-100',
    badge: null,
    accentBorder: 'border-slate-200',
    ctaLabel: 'Continue with Free',
    ctaVariant: 'outline',
    features: [
      { text: '1 resume per account', included: true },
      { text: 'Access to 3 resume templates', included: true },
      { text: 'AI professional summary (1 per session)', included: true },
      { text: 'ATS keyword analysis', included: true },
      { text: 'PDF & DOCX download', included: true },
      { text: 'Basic career suggestions', included: true },
      { text: 'Interview preparation (5 questions)', included: true },
      { text: 'Unlimited resumes', included: false },
      { text: 'All 10+ premium templates', included: false },
      { text: 'Advanced AI content generation', included: false },
      { text: 'Priority ATS scoring & insights', included: false },
      { text: 'Field-specific role mapping', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₹200',
    tagline: 'For serious job seekers',
    icon: Sparkles,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
    badge: 'Most Popular',
    badgeBg: 'bg-blue-600',
    accentBorder: 'border-blue-500',
    accentRing: 'ring-2 ring-blue-500/20',
    ctaLabel: 'Upgrade to Pro',
    ctaVariant: 'primary',
    features: [
      { text: 'Up to 10 resumes per account', included: true },
      { text: 'All 10+ premium templates', included: true },
      { text: 'Unlimited AI professional summaries', included: true },
      { text: 'Advanced ATS keyword analysis', included: true },
      { text: 'PDF & DOCX download', included: true },
      { text: 'Advanced AI content generation', included: true },
      { text: 'Full interview prep library', included: true },
      { text: 'Field-specific role mapping', included: true },
      { text: 'Priority ATS scoring & insights', included: true },
      { text: 'Priority career suggestions', included: true },
      { text: 'Unlimited resumes', included: false },
      { text: 'Dedicated support & early features', included: false },
    ],
  },
  {
    id: 'ultra',
    name: 'Ultra',
    price: '₹500',
    tagline: 'Maximum power, zero limits',
    icon: Crown,
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-50',
    badge: 'Best Value',
    badgeBg: 'bg-amber-500',
    accentBorder: 'border-amber-400',
    accentRing: 'ring-2 ring-amber-400/20',
    ctaLabel: 'Go Ultra',
    ctaVariant: 'outline',
    features: [
      { text: 'Unlimited resumes per account', included: true },
      { text: 'All 10+ premium templates', included: true },
      { text: 'Unlimited AI professional summaries', included: true },
      { text: 'Advanced ATS keyword analysis', included: true },
      { text: 'PDF & DOCX download', included: true },
      { text: 'Advanced AI content generation', included: true },
      { text: 'Full interview prep library', included: true },
      { text: 'Field-specific role mapping', included: true },
      { text: 'Priority ATS scoring & insights', included: true },
      { text: 'Priority career suggestions', included: true },
      { text: 'Dedicated support & early features', included: true },
      { text: 'Bulk resume export & sharing links', included: true },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export const PricingPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loadingPlan, setLoadingPlan] = useState(null);

  const handleSelectPlan = async (plan) => {
    if (plan.id === 'free') {
      showToast('You are on the Free plan. Enjoy ELEVORA!', 'success');
      return;
    }

    // No payment gateway configured — show informational state
    setLoadingPlan(plan.id);
    await new Promise((r) => setTimeout(r, 800));
    setLoadingPlan(null);
    showToast(
      `${plan.name} plan selected. Payment integration coming soon — your current features are unchanged.`,
      'info'
    );
  };

  return (
    <div className="space-y-8 text-left max-w-6xl mx-auto">
      {/* Back navigation */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Hero */}
      <div className="text-center space-y-3 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ELEVORA Plans</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Choose the plan that fits your career goals
        </h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
          Whether you're crafting your first resume or managing a multi-role job search, ELEVORA has a plan for you.
        </p>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl border ${plan.accentBorder} ${plan.accentRing || ''} shadow-sm flex flex-col overflow-hidden transition-all duration-200 hover:shadow-md`}
            >
              {/* Popular / Best Value badge */}
              {plan.badge && (
                <div className={`absolute top-0 right-0 ${plan.badgeBg} text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl`}>
                  {plan.badge}
                </div>
              )}

              {/* Plan header */}
              <div className="p-6 pb-4 border-b border-slate-100">
                <div className={`w-10 h-10 rounded-xl ${plan.iconBg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${plan.iconColor}`} />
                </div>

                <h2 className="text-xl font-extrabold text-slate-900">{plan.name}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{plan.tagline}</p>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900">{plan.price}</span>
                  <span className="text-xs text-slate-400 font-medium ml-1">one-time</span>
                </div>
              </div>

              {/* Features list */}
              <div className="p-6 pt-5 flex-1">
                <ul className="space-y-2.5">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className={`mt-0.5 shrink-0 ${feat.included ? 'text-emerald-500' : 'text-slate-300'}`}>
                        {feat.included ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                      </span>
                      <span className={`text-xs leading-relaxed ${feat.included ? 'text-slate-700' : 'text-slate-400'}`}>
                        {feat.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={loadingPlan === plan.id}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-200 ${
                    plan.ctaVariant === 'primary'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20'
                      : plan.id === 'ultra'
                      ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {loadingPlan === plan.id ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <>
                      <span>{plan.ctaLabel}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment info notice */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-700">Payment note: </span>
          Paid plan checkout is not yet active. All current ELEVORA features remain available to you. Upgrade options will be enabled in a future release.
        </div>
      </div>

      {/* Trust badges */}
      <div className="flex flex-wrap justify-center items-center gap-6 py-4 border-t border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Shield className="w-4 h-4 text-emerald-500" />
          <span>No hidden charges</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Check className="w-4 h-4 text-emerald-500" />
          <span>Cancel any time</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span>ATS-optimized resume builder</span>
        </div>
      </div>
    </div>
  );
};
