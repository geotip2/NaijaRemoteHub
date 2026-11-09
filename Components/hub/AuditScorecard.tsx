'use client';

import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, Info, CheckCircle2, Award } from 'lucide-react';
import { auditSummary } from '@/data/auditData';

interface AuditScorecardProps {
  selectedSeverity: string;
  setSelectedSeverity: (severity: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function AuditScorecard({
  selectedSeverity,
  setSelectedSeverity,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
}: AuditScorecardProps) {
  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-800 border border-green-200 mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>WCAG 2.1 & 2.2 AA Compliance Audit</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            NaijaRemoteHub Accessibility Audit Report
          </h2>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl">
            Detailed evaluation of the single-page HTML application. Found <strong className="text-slate-900 font-bold">18 accessibility barriers</strong> across keyboard navigation, screen reader support, forms, color contrast, and landmark structure.
          </p>
        </div>

        {/* Score comparison pill */}
        <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 self-stretch sm:self-auto justify-around">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 block">Initial Score</span>
            <div className="text-3xl font-black text-red-600 mt-0.5">46<span className="text-sm font-semibold text-slate-400">/100</span></div>
            <span className="text-[11px] font-medium text-slate-500">Non-compliant</span>
          </div>
          <div className="h-10 w-px bg-slate-200" />
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-green-700 block">Remediated</span>
            <div className="text-3xl font-black text-green-700 mt-0.5 flex items-center justify-center gap-1">
              98<span className="text-sm font-semibold text-slate-400">/100</span>
            </div>
            <span className="text-[11px] font-medium text-green-600 flex items-center justify-center gap-0.5">
              <Award className="w-3 h-3" /> WCAG AA Pass
            </span>
          </div>
        </div>
      </div>

      {/* Severity Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
        <button
          onClick={() => setSelectedSeverity(selectedSeverity === 'critical' ? 'all' : 'critical')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedSeverity === 'critical'
              ? 'bg-red-50 border-red-300 ring-2 ring-red-500 shadow-xs'
              : 'bg-red-50/50 border-red-100 hover:bg-red-50 hover:border-red-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-800 uppercase tracking-wide">Critical</span>
            <ShieldAlert className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-2xl font-black text-red-700 mt-1">{auditSummary.criticalCount}</p>
          <p className="text-[11px] text-red-600 mt-0.5 font-medium">Blocks access completely</p>
        </button>

        <button
          onClick={() => setSelectedSeverity(selectedSeverity === 'serious' ? 'all' : 'serious')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedSeverity === 'serious'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-500 shadow-xs'
              : 'bg-amber-50/50 border-amber-100 hover:bg-amber-50 hover:border-amber-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">Serious</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-700 mt-1">{auditSummary.seriousCount}</p>
          <p className="text-[11px] text-amber-600 mt-0.5 font-medium">Major barrier or confusion</p>
        </button>

        <button
          onClick={() => setSelectedSeverity(selectedSeverity === 'moderate' ? 'all' : 'moderate')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedSeverity === 'moderate'
              ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-500 shadow-xs'
              : 'bg-blue-50/50 border-blue-100 hover:bg-blue-50 hover:border-blue-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wide">Moderate</span>
            <Info className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-blue-700 mt-1">{auditSummary.moderateCount}</p>
          <p className="text-[11px] text-blue-600 mt-0.5 font-medium">Degrades user experience</p>
        </button>

        <button
          onClick={() => setSelectedSeverity(selectedSeverity === 'minor' ? 'all' : 'minor')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedSeverity === 'minor'
              ? 'bg-slate-100 border-slate-300 ring-2 ring-slate-500 shadow-xs'
              : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Minor</span>
            <CheckCircle2 className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-2xl font-black text-slate-800 mt-1">{auditSummary.minorCount}</p>
          <p className="text-[11px] text-slate-600 mt-0.5 font-medium">Touch & polish issue</p>
        </button>
      </div>

      {/* Filter and Category Pills */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-500 mr-1">Category:</span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All (18)
          </button>
          {auditSummary.categories.map(cat => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(selectedCategory === cat.name ? 'all' : cat.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                selectedCategory === cat.name
                  ? 'bg-green-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="w-full sm:w-64">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search issues, WCAG criteria..."
            aria-label="Search accessibility issues"
            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-700 bg-slate-50/50"
          />
        </div>
      </div>
    </section>
  );
}
