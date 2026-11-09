'use client';

import React, { useState } from 'react';
import { Volume2, Eye, Keyboard, Sparkles, CheckCircle2, RotateCcw, AlertCircle } from 'lucide-react';

export function AccessibilitySimulator() {
  const [currentPage, setCurrentPage] = useState<'home' | 'auth' | 'dashboard' | 'admin'>('home');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [visionMode, setVisionMode] = useState<'normal' | 'protanopia' | 'deuteranopia' | 'contrast' | 'blur'>('normal');
  const [focusHighlights, setFocusHighlights] = useState(true);
  const [screenReaderLog, setScreenReaderLog] = useState<string[]>([
    'VoiceOver ready. Focus on document: "NaijaRemoteHub | Learn. Earn. Grow."',
    'Landmark: Primary navigation. Currently on: "Home, page"',
  ]);
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const logSpeech = (message: string) => {
    setScreenReaderLog((prev) => [message, ...prev.slice(0, 15)]);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    logSpeech(`[Screen Reader Alert] "${msg}"`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const navigateTo = (page: 'home' | 'auth' | 'dashboard' | 'admin') => {
    setCurrentPage(page);
    const titles = {
      home: 'Home | Learn. Earn. Grow.',
      auth: 'Login and Registration',
      dashboard: 'Member Dashboard',
      admin: 'Administrator Panel',
    };
    logSpeech(`[Screen Reader Focus] Navigated to: "${titles[page]}". Main heading focused.`);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEmail || !formEmail.includes('@')) {
      setFormError('Please enter a valid email address.');
      logSpeech('[Screen Reader Alert] "Error: Please enter a valid email address. Focus moved to Email field."');
      return;
    }
    if (formPassword.length < 6) {
      setFormError('Password must be at least 6 characters.');
      logSpeech('[Screen Reader Alert] "Error: Password must be at least 6 characters. aria-invalid=true."');
      return;
    }
    setFormError('');
    showToast('Signed in successfully! Redirecting to Dashboard.');
    setTimeout(() => navigateTo('dashboard'), 800);
  };

  // Vision Filter CSS classes
  const filterStyles = {
    normal: '',
    protanopia: 'filter grayscale-[50%] sepia-[40%] hue-rotate-[-30deg]',
    deuteranopia: 'filter sepia-[60%] hue-rotate-[45deg]',
    contrast: 'filter contrast-[140%] brightness-[95%]',
    blur: 'filter blur-[1px]',
  }[visionMode];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Simulator Control Bar */}
      <div className="bg-slate-900 text-slate-100 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="font-bold text-sm sm:text-base text-white">
              Accessible NaijaRemoteHub Live Simulator
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Test drive the remediated SPA: screen reader live speech, focus management, and accessibility filters.
          </p>
        </div>

        {/* Accessibility Test Tools */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Vision Filter Selector */}
          <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
            <Eye className="w-3.5 h-3.5 text-slate-300" />
            <label htmlFor="visionFilter" className="sr-only">Visual Impairment Simulation</label>
            <select
              id="visionFilter"
              value={visionMode}
              onChange={(e) => {
                setVisionMode(e.target.value as any);
                logSpeech(`[Simulation Filter Changed] Mode: ${e.target.value}`);
              }}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value="normal" className="bg-slate-900 text-white">Vision: Normal</option>
              <option value="contrast" className="bg-slate-900 text-white">Vision: High Contrast</option>
              <option value="protanopia" className="bg-slate-900 text-white">Vision: Protanopia (Red-blind)</option>
              <option value="deuteranopia" className="bg-slate-900 text-white">Vision: Deuteranopia (Green-blind)</option>
              <option value="blur" className="bg-slate-900 text-white">Vision: Low Acuity (Blur)</option>
            </select>
          </div>

          {/* Keyboard Focus Indicators Toggle */}
          <button
            onClick={() => setFocusHighlights(!focusHighlights)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors ${
              focusHighlights
                ? 'bg-emerald-900/60 border-emerald-500 text-emerald-200'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Focus Rings: {focusHighlights ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-0 border-t border-slate-200">
        {/* Main Interactive App Container */}
        <div className={`lg:col-span-8 p-4 sm:p-6 bg-slate-50 transition-all ${filterStyles}`}>
          {/* Remediated Skip Link demonstration */}
          <div className="mb-4">
            <a
              href="#sim-main"
              onClick={(e) => {
                e.preventDefault();
                logSpeech('[Screen reader] "Skipped to main content landmark"');
                document.getElementById('sim-main')?.focus();
              }}
              className="px-3 py-1.5 bg-green-800 text-white text-xs font-bold rounded-lg inline-block focus:ring-4 focus:ring-yellow-400 outline-none"
            >
              ⌨️ Tab or Click: Skip to main content (WCAG 2.4.1)
            </a>
          </div>

          {/* Interactive Simulation Frame */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header / Nav */}
            <header className="px-4 py-3 bg-white border-b border-slate-200 flex items-center justify-between gap-3">
              <button
                onClick={() => navigateTo('home')}
                className="flex items-center gap-2 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-green-700 text-left"
                aria-label="NaijaRemoteHub, go to homepage"
              >
                <span className="w-8 h-8 rounded-lg bg-green-700 text-white grid place-items-center font-black text-sm" aria-hidden="true">N</span>
                <span className="font-extrabold text-green-900 text-base">NaijaRemoteHub</span>
              </button>

              <nav aria-label="Primary navigation" className="flex items-center gap-1 text-xs">
                {(['home', 'auth', 'dashboard', 'admin'] as const).map((p) => {
                  const isActive = currentPage === p;
                  const label = p === 'auth' ? 'Login' : p.charAt(0).toUpperCase() + p.slice(1);
                  return (
                    <button
                      key={p}
                      onClick={() => navigateTo(p)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`px-2.5 py-1.5 rounded-lg font-bold transition-all min-h-[36px] ${
                        focusHighlights ? 'focus:outline-none focus:ring-2 focus:ring-green-700' : ''
                      } ${
                        isActive
                          ? 'bg-green-100 text-green-900 border border-green-300'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </nav>
            </header>

            {/* Toast notice inside frame */}
            {toastMessage && (
              <div
                role="status"
                aria-live="polite"
                className="m-3 p-3 rounded-xl bg-green-800 text-white text-xs font-bold flex items-center justify-between"
              >
                <span>{toastMessage}</span>
                <button onClick={() => setToastMessage(null)} className="text-green-200 hover:text-white">✕</button>
              </div>
            )}

            {/* Main Content Area */}
            <main id="sim-main" tabIndex={-1} className="p-4 sm:p-6 outline-none min-h-[360px]">
              {/* HOME VIEW */}
              {currentPage === 'home' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-green-900 to-green-700 text-white p-6 rounded-2xl">
                    <span className="inline-block bg-slate-950/70 border border-yellow-300/50 text-yellow-300 text-xs font-bold px-3 py-1 rounded-full mb-3">
                      High Contrast AA Badge
                    </span>
                    <h1 className="text-3xl font-black">Learn. Earn. <span className="text-yellow-300">Grow.</span></h1>
                    <p className="text-green-50 text-sm mt-2">
                      Digital skills academy with 100% accessible navigation and screen reader support.
                    </p>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => {
                          setAuthMode('signup');
                          navigateTo('auth');
                        }}
                        className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs rounded-xl shadow-xs"
                      >
                        Create Free Account
                      </button>
                      <button
                        onClick={() => showToast('Membership details viewed')}
                        className="px-4 py-2 bg-white text-green-900 font-bold text-xs rounded-xl hover:bg-green-50"
                      >
                        Explore Perks
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <h2 className="font-extrabold text-sm text-slate-900">Accessible Perks List (ul / li)</h2>
                    <ul className="grid sm:grid-cols-2 gap-2 mt-3 text-xs text-slate-700 font-medium" role="list">
                      <li className="flex items-center gap-2">
                        <span className="text-green-700 font-bold" aria-hidden="true">✓</span>
                        <span>Full Course Access</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-700 font-bold" aria-hidden="true">✓</span>
                        <span>Personal Dashboard</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-700 font-bold" aria-hidden="true">✓</span>
                        <span>Your Referral Link</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-700 font-bold" aria-hidden="true">✓</span>
                        <span>Verified Completion Certificate</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* AUTH VIEW */}
              {currentPage === 'auth' && (
                <div className="max-w-md mx-auto py-2">
                  <div className="text-center mb-4">
                    <h1 className="text-xl font-black text-slate-900">NaijaRemoteHub Sign In</h1>
                    <p className="text-xs text-slate-500 mt-0.5">WCAG APG ARIA Tablist pattern demo</p>
                  </div>

                  {/* Accessible Tablist */}
                  <div role="tablist" aria-label="Auth modes" className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl mb-4">
                    <button
                      role="tab"
                      aria-selected={authMode === 'login'}
                      aria-controls="authPanel"
                      onClick={() => {
                        setAuthMode('login');
                        logSpeech('[Screen reader tab change] Tab: Login selected, 1 of 2');
                      }}
                      className={`py-2 text-xs font-bold rounded-lg transition-colors ${
                        authMode === 'login' ? 'bg-green-800 text-white shadow-xs' : 'text-slate-700 hover:text-slate-950'
                      }`}
                    >
                      Login Tab
                    </button>
                    <button
                      role="tab"
                      aria-selected={authMode === 'signup'}
                      aria-controls="authPanel"
                      onClick={() => {
                        setAuthMode('signup');
                        logSpeech('[Screen reader tab change] Tab: Sign Up selected, 2 of 2');
                      }}
                      className={`py-2 text-xs font-bold rounded-lg transition-colors ${
                        authMode === 'signup' ? 'bg-green-800 text-white shadow-xs' : 'text-slate-700 hover:text-slate-950'
                      }`}
                    >
                      Sign Up Tab
                    </button>
                  </div>

                  <form id="authPanel" role="tabpanel" onSubmit={handleAuthSubmit} className="space-y-3" noValidate>
                    <div>
                      <label htmlFor="simEmail" className="block text-xs font-bold text-slate-800 mb-1">
                        Email Address <span className="text-red-600" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="simEmail"
                        type="email"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-700"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="simPassword" className="block text-xs font-bold text-slate-800 mb-1">
                        Password <span className="text-red-600" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="simPassword"
                        type="password"
                        value={formPassword}
                        onChange={(e) => setFormPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        aria-describedby="passHint"
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-700"
                        required
                      />
                      <p id="passHint" className="text-[11px] text-slate-500 mt-1">Must be at least 6 characters.</p>
                    </div>

                    {formError && (
                      <div
                        role="alert"
                        aria-live="assertive"
                        className="p-2.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl font-medium flex items-center gap-1.5"
                      >
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                        <span>{formError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-green-800 hover:bg-green-700 text-white font-bold text-xs rounded-xl shadow-xs"
                    >
                      {authMode === 'login' ? 'Sign In (Test Live Validation)' : 'Create Free Account'}
                    </button>
                  </form>
                </div>
              )}

              {/* DASHBOARD VIEW */}
              {currentPage === 'dashboard' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-green-800">MEMBER DASHBOARD</p>
                      <h1 className="text-xl font-black text-slate-900">Welcome, Test Member</h1>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 bg-green-100 text-green-900 border border-green-300 rounded-full">
                      PAID MEMBER
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-green-900 text-white rounded-xl">
                      <p className="text-xs text-green-200">Wallet Balance</p>
                      <p className="text-2xl font-black mt-1">₦24,000</p>
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-xl">
                      <p className="text-xs text-slate-500 font-medium">Direct Referrals</p>
                      <p className="text-2xl font-black text-slate-900 mt-1">2</p>
                    </div>
                  </div>

                  {/* Referral link with accessible label */}
                  <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                    <h2 id="refCodeLabel" className="text-xs font-extrabold text-slate-900">
                      Your Referral Link
                    </h2>
                    <div className="flex gap-2">
                      <label htmlFor="simRefLink" className="sr-only">Your unique referral link</label>
                      <input
                        id="simRefLink"
                        aria-labelledby="refCodeLabel"
                        readOnly
                        value="https://naijaremotehub.com?ref=member84"
                        className="text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg flex-1 font-mono text-slate-700"
                      />
                      <button
                        onClick={() => showToast('Referral link copied to clipboard!')}
                        aria-label="Copy referral link to clipboard"
                        className="px-3 py-2 bg-green-800 hover:bg-green-700 text-white text-xs font-bold rounded-lg"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ADMIN VIEW */}
              {currentPage === 'admin' && (
                <div className="space-y-4">
                  <h1 className="text-xl font-black text-slate-900">Administrator Console</h1>
                  <p className="text-xs text-slate-600">Accessible table with scope=&quot;col&quot;, caption, and focusable scroll region.</p>

                  <div
                    tabIndex={0}
                    role="region"
                    aria-label="Registered members table"
                    className="overflow-x-auto rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-700"
                  >
                    <table className="w-full text-xs text-left min-w-[400px]">
                      <caption className="sr-only">Registered members and wallet balances</caption>
                      <thead className="bg-slate-100 text-slate-700">
                        <tr>
                          <th scope="col" className="p-2.5 font-bold">Name</th>
                          <th scope="col" className="p-2.5 font-bold">Email</th>
                          <th scope="col" className="p-2.5 font-bold">Balance</th>
                          <th scope="col" className="p-2.5 font-bold">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="p-2.5 font-medium text-slate-900">Tunde Adeleke</td>
                          <td className="p-2.5 text-slate-600">tunde@example.com</td>
                          <td className="p-2.5 text-green-800 font-bold">₦10,000</td>
                          <td className="p-2.5">
                            <button
                              onClick={() => showToast('Deleted material: Virtual Assistant Module 1')}
                              aria-label="Delete member Tunde Adeleke"
                              className="px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded text-[11px] font-bold hover:bg-red-100"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-medium text-slate-900">Chioma Okafor</td>
                          <td className="p-2.5 text-slate-600">chioma@example.com</td>
                          <td className="p-2.5 text-green-800 font-bold">₦24,000</td>
                          <td className="p-2.5">
                            <button
                              onClick={() => showToast('Deleted member Chioma Okafor')}
                              aria-label="Delete member Chioma Okafor"
                              className="px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded text-[11px] font-bold hover:bg-red-100"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>

        {/* Screen Reader Voice Console */}
        <div className="lg:col-span-4 bg-slate-950 text-slate-200 p-4 sm:p-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
                  Assistive Tech Output
                </span>
              </div>
              <button
                onClick={() => setScreenReaderLog(['Log cleared.'])}
                className="text-[11px] text-slate-400 hover:text-slate-200"
              >
                Clear
              </button>
            </div>

            <p className="text-[11px] text-slate-400 mt-2">
              Real-time transcript of what JAWS, NVDA, and VoiceOver announce as you interact with the page above:
            </p>

            <div className="mt-3 space-y-2 max-h-[340px] overflow-y-auto pr-1">
              {screenReaderLog.map((log, index) => (
                <div
                  key={index}
                  className={`p-2.5 rounded-lg text-xs font-mono leading-relaxed ${
                    index === 0
                      ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-900/60 border border-slate-800/80 text-slate-300'
                  }`}
                >
                  <span className="text-[10px] text-slate-400 block mb-0.5">
                    {index === 0 ? '▶ Just announced:' : 'Previous:'}
                  </span>
                  {log}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            💡 <strong>WCAG 4.1.3 & 2.4.3:</strong> Dynamic single-page applications must explicitly manage focus and provide audio announcements via <code className="text-emerald-400">aria-live</code>.
          </div>
        </div>
      </div>
    </div>
  );
}
