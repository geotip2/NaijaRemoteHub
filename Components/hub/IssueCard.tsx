'use client';

import React, { useState } from 'react';
import { AccessibilityIssue } from '@/data/auditData';
import { Check, Copy, ChevronDown, ChevronUp, AlertCircle, HelpCircle, Code2, Users } from 'lucide-react';

interface IssueCardProps {
  issue: AccessibilityIssue;
}

export function IssueCard({ issue }: IssueCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'fix' | 'original' | 'diff'>('fix');
  const [copied, setCopied] = useState(false);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const severityBadge = {
    critical: 'bg-red-100 text-red-800 border-red-200',
    serious: 'bg-amber-100 text-amber-800 border-amber-200',
    moderate: 'bg-blue-100 text-blue-800 border-blue-200',
    minor: 'bg-slate-100 text-slate-800 border-slate-200',
  }[issue.severity];

  return (
    <article className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all overflow-hidden">
      {/* Header Summary */}
      <div className="p-5 sm:p-6 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              {issue.id}
            </span>
            <span className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${severityBadge}`}>
              {issue.severity}
            </span>
            <span className="text-xs font-semibold text-slate-600 bg-slate-50 px-2.5 py-0.5 rounded-md border border-slate-150">
              {issue.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              WCAG {issue.wcagCriterion} (Level {issue.wcagLevel})
            </span>
            <button
              type="button"
              aria-label={isExpanded ? 'Collapse issue details' : 'Expand issue details'}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
            >
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-900 leading-snug">
          {issue.title}
        </h3>

        <p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
          {issue.impact}
        </p>

        {/* Affected User Groups */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
          <Users className="w-3.5 h-3.5 text-slate-400 mr-1" />
          <span className="font-medium text-slate-700">Affected users:</span>
          {issue.affectedUsers.map((user, idx) => (
            <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium text-[11px]">
              {user}
            </span>
          ))}
        </div>
      </div>

      {/* Expanded Details & Code Remediation */}
      {isExpanded && (
        <div className="bg-slate-50/70 border-t border-slate-200 p-5 sm:p-6 space-y-5">
          {/* Why it Matters & Solution */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1.5 uppercase tracking-wide">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Impact Assessment</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {issue.explanation}
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/30">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 mb-1.5 uppercase tracking-wide">
                <Check className="w-4 h-4 text-emerald-700" />
                <span>Remediation Solution</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {issue.solutionSummary}
              </p>
            </div>
          </div>

          {/* Code Viewer (Tabs: Remediated Fix vs Original Code) */}
          <div className="rounded-xl border border-slate-300 overflow-hidden bg-slate-900 text-slate-100">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveCodeTab('fix')}
                  className={`px-3 py-1 rounded-md font-bold transition-colors ${
                    activeCodeTab === 'fix'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  ✓ Remediated Accessible Code
                </button>
                <button
                  onClick={() => setActiveCodeTab('original')}
                  className={`px-3 py-1 rounded-md font-bold transition-colors ${
                    activeCodeTab === 'original'
                      ? 'bg-red-900 text-red-200'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  ✗ Original Code (Issues)
                </button>
              </div>

              <button
                onClick={() => copyCode(activeCodeTab === 'fix' ? issue.fixedCode : issue.originalCode)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
                title="Copy snippet"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Snippet'}</span>
              </button>
            </div>

            <div className="p-4 overflow-x-auto font-mono text-xs leading-relaxed max-h-72">
              <pre className={activeCodeTab === 'fix' ? 'text-emerald-300' : 'text-rose-300'}>
                {activeCodeTab === 'fix' ? issue.fixedCode : issue.originalCode}
              </pre>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
