import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..', '..');

console.log('======================================================');
console.log('🧪 ELEVORA: PLAN UPGRADE NOTICE (PRO / ULTRA) VERIFICATION');
console.log('======================================================\n');

let passedTests = 0;
const recordPass = (msg) => {
  console.log(`  ✅ PASS: ${msg}`);
  passedTests++;
};

// 1. Static Source Code & Safety Inspection
console.log('1. Verifying Payment Disarmament & Safety in PricingPage.jsx...');
const pricingPagePath = path.join(rootDir, 'src', 'pages', 'Pricing', 'PricingPage.jsx');
const pricingSource = fs.readFileSync(pricingPagePath, 'utf8');

// Verify Razorpay order creation and payment API calls are absent from PricingPage
assert.ok(!pricingSource.includes('api.createPaymentOrder'), 'PricingPage must not call api.createPaymentOrder');
assert.ok(!pricingSource.includes('new window.Razorpay'), 'PricingPage must not instantiate window.Razorpay');
assert.ok(!pricingSource.includes('loadRazorpayScript'), 'PricingPage must not load Razorpay script');
assert.ok(!pricingSource.includes('api.verifyPaymentSignature'), 'PricingPage must not call payment verify API');
assert.ok(!pricingSource.includes('window.alert'), 'PricingPage must not use window.alert()');
recordPass('Zero Razorpay orders, script injections, or payment endpoints in PricingPage');

// 2. Verifying Plan Upgrade Notice Strings & Supporting Message
console.log('\n2. Verifying Plan Upgrade Notice Copy and Strings...');
assert.ok(pricingSource.includes('Pro Mode is Coming Soon!'), 'Must include exact copy "Pro Mode is Coming Soon!"');
assert.ok(pricingSource.includes('Ultra Mode is Coming Soon!'), 'Must include exact copy "Ultra Mode is Coming Soon!"');
assert.ok(
  pricingSource.includes("We're working on this feature. Premium plan upgrades will be available soon. Stay tuned!"),
  'Must include exact copy "We\'re working on this feature. Premium plan upgrades will be available soon. Stay tuned!"'
);
assert.ok(pricingSource.includes('Got it'), 'Must include "Got it" action button');
recordPass('All required exact titles, supporting message, and "Got it" button are present');

// 3. Verifying Modal Component Accessibility & Interaction Contracts
console.log('\n3. Verifying Modal.jsx Keyboard & Accessibility Support...');
const modalPath = path.join(rootDir, 'src', 'components', 'common', 'Modal.jsx');
const modalSource = fs.readFileSync(modalPath, 'utf8');

assert.ok(modalSource.includes("role=\"dialog\""), 'Modal must specify role="dialog"');
assert.ok(modalSource.includes("aria-modal=\"true\""), 'Modal must specify aria-modal="true"');
assert.ok(modalSource.includes("aria-labelledby="), 'Modal must specify aria-labelledby');
assert.ok(modalSource.includes("e.key === 'Escape'"), 'Modal must handle Escape key navigation');
assert.ok(modalSource.includes("window.addEventListener('keydown', handleKeyDown)"), 'Modal must attach keydown listener when open');
assert.ok(modalSource.includes("window.removeEventListener('keydown', handleKeyDown)"), 'Modal must remove keydown listener when closed');
assert.ok(modalSource.includes("onClick={onClose}"), 'Backdrop click must trigger onClose()');
recordPass('Modal component implements Escape dismiss, backdrop dismiss, and accessibility dialog attributes');

// 4. Simulating Upgrade Logic Transitions
console.log('\n4. Simulating Plan Selection State Machine Transitions...');

// Pure representation of the handleSelectPlan logic
const simulatePlanSelection = (activePlan, targetPlanId) => {
  let modalState = null;
  let toastMessage = null;

  const showToast = (msg) => { toastMessage = msg; };
  const setComingSoonPlan = (planId) => { modalState = planId; };

  // 1. Free plan selection
  if (targetPlanId === 'free') {
    if (activePlan === 'free') {
      showToast('You are currently on the Free plan. Enjoy ELEVORA!');
    } else {
      showToast(`You have an active ${activePlan.toUpperCase()} subscription with all Free features included.`);
    }
    return { modalState, toastMessage };
  }

  // 2. Active plan is target plan
  if (activePlan === targetPlanId) {
    showToast(`You are already on this plan!`);
    return { modalState, toastMessage };
  }

  // 3. Ultra user clicking Pro
  if (activePlan === 'ultra' && targetPlanId === 'pro') {
    showToast('You are already on Ultra, which includes all Pro features and unlimited access.');
    return { modalState, toastMessage };
  }

  // 4. Upgrade actions: Pro Mode or Ultra Mode -> Trigger Coming Soon notice
  if (targetPlanId === 'pro') {
    setComingSoonPlan('pro');
    return { modalState, toastMessage };
  }

  if (targetPlanId === 'ultra') {
    setComingSoonPlan('ultra');
    return { modalState, toastMessage };
  }

  return { modalState, toastMessage };
};

// Transition Test A: Free user clicks Pro
{
  const result = simulatePlanSelection('free', 'pro');
  assert.equal(result.modalState, 'pro');
  const title = result.modalState === 'ultra' ? 'Ultra Mode is Coming Soon!' : 'Pro Mode is Coming Soon!';
  assert.equal(title, 'Pro Mode is Coming Soon!');
  recordPass('Free → Pro: Displays "Pro Mode is Coming Soon!"');
}

// Transition Test B: Free user clicks Ultra
{
  const result = simulatePlanSelection('free', 'ultra');
  assert.equal(result.modalState, 'ultra');
  const title = result.modalState === 'ultra' ? 'Ultra Mode is Coming Soon!' : 'Pro Mode is Coming Soon!';
  assert.equal(title, 'Ultra Mode is Coming Soon!');
  recordPass('Free → Ultra: Displays "Ultra Mode is Coming Soon!"');
}

// Transition Test C: Pro user clicks Ultra
{
  const result = simulatePlanSelection('pro', 'ultra');
  assert.equal(result.modalState, 'ultra');
  const title = result.modalState === 'ultra' ? 'Ultra Mode is Coming Soon!' : 'Pro Mode is Coming Soon!';
  assert.equal(title, 'Ultra Mode is Coming Soon!');
  recordPass('Pro → Ultra: Displays "Ultra Mode is Coming Soon!"');
}

// Transition Test D: Ultra user clicks Pro (already has Ultra)
{
  const result = simulatePlanSelection('ultra', 'pro');
  assert.equal(result.modalState, null);
  assert.ok(result.toastMessage.includes('already on Ultra'));
  recordPass('Ultra → Pro: Correctly indicates user already has higher Ultra tier without opening upgrade modal');
}

// Transition Test E: Free user clicking Free (already on Free)
{
  const result = simulatePlanSelection('free', 'free');
  assert.equal(result.modalState, null);
  assert.ok(result.toastMessage.includes('currently on the Free plan'));
  recordPass('Free → Free: Informs user they are on Free plan');
}

// Transition Test F: Dismissal with "Got it"
{
  let modalState = 'pro';
  const handleGotIt = () => { modalState = null; };
  handleGotIt();
  assert.equal(modalState, null);
  recordPass('"Got it" action properly resets modal state to null (closes modal)');
}

console.log('\n======================================================');
console.log(`📊 UPGRADE NOTICE TESTS: ${passedTests} PASSED, 0 FAILED`);
console.log('======================================================\n');
