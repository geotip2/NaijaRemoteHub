'use client';

import React, { useState } from 'react';
import { fullyRemediatedHtml } from '@/data/remediatedHtml';
import { Download, Copy, Check, FileCode, CheckCircle2, ListFilter } from 'lucide-react';

export function FullCodeExport() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'changelog'>('code');

  const handleCopy = () => {
    navigator.clipboard.writeText(fullyRemediatedHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([fullyRemediatedHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'naijaremotehub-accessible.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const changelog = [
    {
      category: 'Skip Link & Landmarks',
      wcag: '2.4.1 Bypass Blocks (Level A)',
      items: [
        'Added top-level offscreen skip link: <a href="#main-content" class="sr-only focus:not-sr-only ...">',
        'Marked main container with <main id="main-content" tabindex="-1"> for programmatic focus.',
        'Added aria-label="Primary navigation" to <nav> to identify the landmark in screen reader rotors.',
        'Added aria-labelledby to all <section> page views for descriptive landmark headers.',
      ],
    },
    {
      category: 'Forms & Explicit Labeling',
      wcag: '1.3.1 Info & Relationships, 3.3.2 Labels or Instructions (Level A)',
      items: [
        'Added missing for="id" attributes to Bank Name, Account Number, and Amount in withdrawal form.',
        'Replaced placeholder-only inputs in Admin announcement and material forms with persistent <label> elements.',
        'Linked helper instructions (e.g. "At least 6 characters", "10-digit account") via aria-describedby.',
        'Added aria-labelledby="refHeading" and a screen-reader label to the read-only referral link input.',
        'Added dynamic aria-invalid="true" toggling and automatic focus shifting on form validation failures.',
      ],
    },
    {
      category: 'SPA Focus & Live Regions',
      wcag: '2.4.3 Focus Order, 4.1.3 Status Messages (Level AA)',
      items: [
        'Rewrote showPage() to update document.title, set aria-hidden on dormant pages, and shift focus to the view\'s <h1>/<h2>.',
        'Added an offscreen live region <div id="routeAnnouncer" role="status" aria-live="polite"> for SPA transitions.',
        'Attached role="alert" / aria-live="assertive" to #loginError, #signupError, and notice containers.',
        'Replaced disruptive, thread-blocking window.alert() and confirm() with non-disruptive, accessible inline toasts.',
      ],
    },
    {
      category: 'ARIA Roles & Tablist Pattern',
      wcag: '4.1.2 Name, Role, Value (Level A)',
      items: [
        'Converted Login/Sign Up buttons to a true ARIA tablist with role="tablist", role="tab", aria-selected, and role="tabpanel".',
        'Added dynamic aria-current="page" to active primary navigation buttons.',
        'Added descriptive aria-label attributes to ambiguous buttons (e.g., Delete [Title], Watch Video [Title] (opens in a new tab)).',
      ],
    },
    {
      category: 'Color Contrast & Typography',
      wcag: '1.4.3 Contrast Minimum (Level AA)',
      items: [
        'Replaced semi-transparent hero badge bg-white/15 with high-contrast dark overlay bg-slate-950/70 border-yellow-300.',
        'Boosted contrast on strikethrough price ₦50,000 from washed out green-200 to crisp white/80 with aria-label.',
        'Increased contrast on all badge pills and secondary text (e.g., text-slate-700 instead of faint slate-400).',
      ],
    },
    {
      category: 'Tables & Keyboard Scrolling',
      wcag: '1.3.1 Info & Relationships, 2.1.1 Keyboard (Level A)',
      items: [
        'Added <caption> descriptions to All Users and Withdrawals tables.',
        'Added scope="col" on all <th> elements for screen reader column/row cross-referencing.',
        'Made the overflow-x-auto table wrappers keyboard-scrollable by adding tabindex="0", role="region", and aria-label.',
      ],
    },
    {
      category: 'Focus Visibility & Touch Targets',
      wcag: '2.4.7 Focus Visible, 2.5.8 Target Size (Level AA)',
      items: [
        'Implemented global high-contrast :focus-visible outlines (3px solid #15803d with 2px offset).',
        'Ensured all interactive navigation buttons meet the 44x44px minimum touch target size.',
        'Added @media (prefers-reduced-motion: reduce) to respect system animation preferences.',
      ],
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-green-700" />
            <h2 className="text-2xl font-black text-slate-900">
              Full Remediated Source & Changelog
            </h2>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Complete, self-contained single-file HTML ready for direct deployment or integration into your repository.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-green-700" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Full HTML!' : 'Copy Entire HTML'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-green-800 hover:bg-green-700 text-white text-xs font-bold transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download .html File</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mt-6 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('code')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'code'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Remediated HTML Code ({fullyRemediatedHtml.split('\n').length} lines)
        </button>
        <button
          onClick={() => setActiveTab('changelog')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'changelog'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Detailed Remediation Changelog (7 Pillars)
        </button>
      </div>

      {activeTab === 'code' ? (
        <div className="mt-4 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden text-slate-200">
          <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>naijaremotehub-accessible.html</span>
            <span className="text-emerald-400 font-bold">✓ WCAG 2.1 AA Compliant</span>
          </div>
          <div className="p-4 overflow-x-auto max-h-[500px] font-mono text-xs leading-relaxed">
            <pre className="text-slate-300">{fullyRemediatedHtml}</pre>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {changelog.map((section, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-700" />
                  <span>{section.category}</span>
                </h3>
                <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-emerald-800">
                  {section.wcag}
                </span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-700 font-bold mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
