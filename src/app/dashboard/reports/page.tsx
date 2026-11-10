'use client';

import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Sparkles,
  CheckCircle2,
  Share2,
  TrendingUp,
  Printer,
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function ReportsPage() {
  const { success, info } = useToast();
  const [reportType, setReportType] = useState('EXECUTIVE');
  const [timePeriod, setTimePeriod] = useState('Q4 2026');
  const [generating, setGenerating] = useState(false);

  const reportsList = [
    {
      id: 'rep_01',
      title: 'Q4 2026 Omnichannel Board Performance Briefing',
      period: 'Oct 1 - Dec 31, 2026',
      size: '4.2 MB',
      type: 'Executive PDF',
      generatedAt: 'Nov 8, 2026',
    },
    {
      id: 'rep_02',
      title: 'Monthly Creator Campaign Attribution & ROAS Analysis',
      period: 'October 2026',
      size: '2.8 MB',
      type: 'Marketing PDF',
      generatedAt: 'Nov 1, 2026',
    },
    {
      id: 'rep_03',
      title: 'Unified Customer Support & SLA Response Breakdown',
      period: 'September 2026',
      size: '1.9 MB',
      type: 'Operations CSV',
      generatedAt: 'Oct 1, 2026',
    },
  ];

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      success('Report Compiled', `${reportType} report for ${timePeriod} ready for download.`);
    }, 1200);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-surface-lightText dark:text-surface-lightText dark:text-white tracking-tight font-sans">
            Executive Intelligence Reports
          </h1>
          <p className="text-xs sm:text-sm text-surface-lightMuted mt-1">
            Generate presentation-ready performance decks and audit data for executive stakeholders.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-lightCard dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder text-xs font-semibold text-surface-lightText dark:text-white hover:border-gold-400"
        >
          <Printer className="w-3.5 h-3.5 text-gold-400" />
          <span>Print / Export PDF</span>
        </button>
      </div>

      {/* Report Generator Form */}
      <div className="p-6 rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 shadow-sm space-y-5">
        <h3 className="text-sm font-bold text-surface-lightText dark:text-surface-lightText dark:text-white uppercase tracking-wider font-sans">
          Generate New Report
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-surface-lightMuted">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-lightBg dark:bg-surface-darkBg border border-surface-lightBorder dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white focus:outline-none focus:border-gold-400"
            >
              <option value="EXECUTIVE">Executive Board Overview</option>
              <option value="CAMPAIGN">Campaign ROI &amp; Attribution</option>
              <option value="AUDIENCE">Demographic &amp; Follower Growth</option>
              <option value="SUPPORT">Support SLA &amp; Inbox Velocity</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-surface-lightMuted">Period Range</label>
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-lightBg dark:bg-surface-darkBg border border-surface-lightBorder dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white focus:outline-none focus:border-gold-400"
            >
              <option value="Q4 2026">Q4 2026 (Quarterly)</option>
              <option value="October 2026">October 2026 (Monthly)</option>
              <option value="Last 30 Days">Rolling Last 30 Days</option>
              <option value="Year-to-Date 2026">Year-to-Date 2026</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-maroon-700 to-burgundy-600 hover:from-maroon-800 text-white font-semibold text-xs shadow-luxury"
            >
              {generating ? 'Compiling Dataset...' : 'Generate Report'}
            </button>
          </div>
        </div>
      </div>

      {/* Available Reports Table */}
      <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-surface-lightBorder dark:border-surface-darkBorder/40">
          <h3 className="text-sm font-bold text-surface-lightText dark:text-surface-lightText dark:text-white uppercase tracking-wider font-sans">
            Archived Executive Reports
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-surface-lightBorder dark:border-surface-darkBorder/40 text-surface-lightMuted uppercase font-semibold">
              <tr>
                <th className="py-3 px-5">Report Name</th>
                <th className="py-3 px-5">Period</th>
                <th className="py-3 px-5">Format</th>
                <th className="py-3 px-5">Size</th>
                <th className="py-3 px-5">Compiled</th>
                <th className="py-3 px-5 text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-lightBorder dark:divide-surface-darkBorder/30">
              {reportsList.map((r) => (
                <tr key={r.id} className="hover:bg-surface-lightBg dark:hover:bg-surface-darkHover/40 transition-colors">
                  <td className="py-4 px-5 font-bold text-surface-lightText dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gold-400" />
                    <span>{r.title}</span>
                  </td>
                  <td className="py-4 px-5 text-surface-lightMuted">{r.period}</td>
                  <td className="py-4 px-5">
                    <span className="px-2 py-0.5 rounded-full bg-maroon-700/20 text-gold-300 font-semibold border border-maroon-700/40">
                      {r.type}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-surface-lightMuted">{r.size}</td>
                  <td className="py-4 px-5 text-surface-lightMuted">{r.generatedAt}</td>
                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={() => info('Download Started', `Downloading ${r.title}`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-darkHover text-gold-400 hover:border-gold-400 border border-surface-darkBorder font-medium"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

