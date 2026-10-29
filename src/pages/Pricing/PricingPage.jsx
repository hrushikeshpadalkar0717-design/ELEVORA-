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
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useResume } from '../../context/ResumeContext';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';

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

export const PricingPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { profile, userPlan, isAuthenticated } = useResume();

  // Coming Soon modal state: 'pro' | 'ultra' | null
  const [comingSoonPlan, setComingSoonPlan] = useState(null);

  const handleSelectPlan = (plan) => {
    const activePlan = userPlan || profile?.plan || 'free';

    // 1. Handling Free Plan selection
    if (plan.id === 'free') {
      if (activePlan === 'free') {
        showToast('You are currently on the Free plan. Enjoy ELEVORA!', 'info');
      } else {
        showToast(`You have an active ${activePlan.toUpperCase()} subscription with all Free features included.`, 'info');
      }
      return;
    }

    // 2. User is already on this plan
    if (activePlan === plan.id) {
      showToast(`You are already on the ${plan.name} plan!`, 'info');
      return;
    }

    // 3. Ultra user clicking Pro
    if (activePlan === 'ultra' && plan.id === 'pro') {
      showToast('You are already on Ultra, which includes all Pro features and unlimited access.', 'info');
      return;
    }

    // 4. Upgrade actions: Pro Mode or Ultra Mode -> Trigger Coming Soon notice (zero payment calls)
    if (plan.id === 'pro') {
      setComingSoonPlan('pro');
      return;
    }

    if (plan.id === 'ultra') {
      setComingSoonPlan('ultra');
      return;
    }
  };

  const activePlan = userPlan || profile?.plan || 'free';

  return (
    <div className="space-y-8 text-left max-w-6xl mx-auto">
      {/* Back navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Current Plan Indicator */}
        {isAuthenticated && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active Plan: <strong className="capitalize text-slate-900">{activePlan}</strong></span>
          </div>
        )}
      </div>

      {/* Hero */}
      <div className="text-center space-y-3 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ELEVORA Pricing</span>
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
          const isCurrentPlan = activePlan === plan.id;
          const isCoveredByHigherPlan = activePlan === 'ultra' && plan.id === 'pro';

          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl border ${
                isCurrentPlan
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                  : `${plan.accentBorder} ${plan.accentRing || ''}`
              } shadow-sm flex flex-col overflow-hidden transition-all duration-200 hover:shadow-md`}
            >
              {/* Active Plan or Badge */}
              {isCurrentPlan ? (
                <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Active Plan
                </div>
              ) : plan.badge ? (
                <div className={`absolute top-0 right-0 ${plan.badgeBg} text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl`}>
                  {plan.badge}
                </div>
              ) : null}

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
                  disabled={isCurrentPlan || isCoveredByHigherPlan}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-200 ${
                    isCurrentPlan
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                      : isCoveredByHigherPlan
                      ? 'bg-slate-50 text-slate-400 border border-slate-200 cursor-not-allowed'
                      : plan.ctaVariant === 'primary'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 active:scale-[0.99]'
                      : plan.id === 'ultra'
                      ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300 active:scale-[0.99]'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 active:scale-[0.99]'
                  } disabled:opacity-75`}
                >
                  {isCurrentPlan ? (
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Current Plan
                    </span>
                  ) : isCoveredByHigherPlan ? (
                    <span className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-slate-400" />
                      Included with Ultra
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

      {/* Payment Security & Details Notice */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-slate-700">
        <Lock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div>
            <span className="font-bold text-slate-900">Secure Payment via Razorpay: </span>
            Plan purchases are one-time payments (₹200 for Pro, ₹500 for Ultra) with immediate trusted server-side signature verification. Free plan is available without payment.
          </div>
          <div className="text-[11px] text-slate-500">
            Razorpay Test Mode is active by default. No real bank accounts or credit cards are charged in test mode.
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div className="flex flex-wrap justify-center items-center gap-6 py-4 border-t border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Shield className="w-4 h-4 text-emerald-500" />
          <span>Encrypted Checkout Protection</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Check className="w-4 h-4 text-emerald-500" />
          <span>Instant Plan Activation</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span>ATS-Optimized Resumes</span>
        </div>
      </div>

      {/* Plan Upgrade Notice: Pro / Ultra Coming Soon Modal */}
      <Modal
        isOpen={Boolean(comingSoonPlan)}
        onClose={() => setComingSoonPlan(null)}
        title={comingSoonPlan === 'ultra' ? 'Ultra Mode is Coming Soon!' : 'Pro Mode is Coming Soon!'}
        subtitle="Feature in Active Development"
        maxWidth="max-w-md"
      >
        <div className="space-y-5">
          {/* Plan Icon Header */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                comingSoonPlan === 'ultra'
                  ? 'bg-amber-500 text-white shadow-amber-500/20'
                  : 'bg-blue-600 text-white shadow-blue-500/20'
              }`}
            >
              {comingSoonPlan === 'ultra' ? (
                <Crown className="w-6 h-6" />
              ) : (
                <Sparkles className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-slate-900">
                  {comingSoonPlan === 'ultra' ? 'ELEVORA Ultra Tier' : 'ELEVORA Pro Tier'}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    comingSoonPlan === 'ultra'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  Coming Soon
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                {comingSoonPlan === 'ultra' ? '₹500 • Maximum power & zero limits' : '₹200 • For serious job seekers'}
              </p>
            </div>
          </div>

          {/* Required Supporting Message */}
          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            We're working on this feature. Premium plan upgrades will be available soon. Stay tuned!
          </p>

          {/* Quick Feature Highlights */}
          <div className="space-y-2 rounded-xl bg-slate-50/70 p-3.5 border border-slate-100/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Included when available:
            </span>
            {comingSoonPlan === 'ultra' ? (
              <ul className="text-xs text-slate-700 space-y-1.5">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Unlimited resumes per account</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>All 10+ premium modern & executive templates</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Full interview preparation question library</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Priority ATS keyword scoring & role mapping</span>
                </li>
              </ul>
            ) : (
              <ul className="text-xs text-slate-700 space-y-1.5">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>Up to 10 resumes per account</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>All 10+ premium modern & executive templates</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>Unlimited AI professional summaries</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>Advanced ATS keyword analysis & optimization</span>
                </li>
              </ul>
            )}
          </div>

          {/* Dismiss Action */}
          <div className="pt-1">
            <Button
              variant="primary"
              className="w-full justify-center text-sm font-bold py-2.5 rounded-xl shadow-md shadow-blue-500/20 active:scale-[0.99]"
              onClick={() => setComingSoonPlan(null)}
              autoFocus
            >
              Got it
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
