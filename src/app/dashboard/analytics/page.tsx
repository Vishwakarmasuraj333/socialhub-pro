'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Eye,
  Heart,
  Share2,
  Users,
  Clock,
  Sparkles,
  PieChart as PieIcon,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { PlatformBadge } from '@/components/ui/PlatformBadge';
import { useToast } from '@/context/ToastContext';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('30d');
  const { success, info } = useToast();

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/analytics?range=${range}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [range]);

  const handleExportCSV = () => {
    if (!data?.timeline) return;
    const headers = 'Date,Followers,Impressions,Reach,Engagement,Clicks\n';
    const rows = data.timeline
      .map(
        (t: any) =>
          `${t.date},${t.followers},${t.impressions},${t.reach},${t.engagement},${t.clicks}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SOCIALHUB_Analytics_${range}_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('CSV Exported', 'Full dataset downloaded successfully.');
  };

  const timeline = data?.timeline || [];
  const platforms = data?.platformBreakdown || [];
  const bestTimes = data?.bestTimes || [];
  const demographics = data?.demographics || {
    gender: [],
    ageRanges: [],
    topCountries: [],
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-surface-lightText dark:text-white tracking-tight font-sans">
            Advanced Analytics Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-surface-lightMuted mt-1">
            Algorithmic reach analysis, cross-network attribution, and engagement telemetry.
          </p>
        </div>

        {/* Range & Export Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-lightCard dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder">
            {(['7d', '30d', '90d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase ${
                  range === r ? 'bg-maroon-700 text-white' : 'text-surface-lightMuted'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-lightBg dark:bg-surface-darkCard border border-surface-lightBorder dark:border-maroon-700/60 hover:border-gold-400 text-xs font-semibold text-gold-300 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Growth Area Chart */}
      <div className="p-6 rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-surface-lightText dark:text-white uppercase tracking-wider font-sans">
              Impression &amp; Engagement Trajectory ({range})
            </h3>
            <p className="text-xs text-surface-lightMuted">Consolidated timeline signals across all 7 networks</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-gold-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-gold-400" /> Impressions
            </span>
            <span className="flex items-center gap-1.5 text-maroon-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-maroon-600" /> Unique Reach
            </span>
          </div>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="anGold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D6B36A" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#D6B36A" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="anMaroon" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#842D49" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#842D49" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2C222A" opacity={0.3} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#91858C' }} tickFormatter={(d) => d.slice(5)} />
              <YAxis tick={{ fontSize: 10, fill: '#91858C' }} tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1C171C',
                  borderColor: '#641B32',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '11px',
                }}
              />
              <Area type="monotone" dataKey="impressions" stroke="#D6B36A" strokeWidth={2} fill="url(#anGold)" />
              <Area type="monotone" dataKey="reach" stroke="#842D49" strokeWidth={2} fill="url(#anMaroon)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cross-Platform Comparison Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-surface-lightText dark:text-white uppercase tracking-wider font-sans">
          Cross-Platform Velocity Benchmark
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-surface-lightBorder dark:border-surface-darkBorder/40 text-surface-lightMuted uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Platform</th>
                <th className="py-3 px-4">Followers</th>
                <th className="py-3 px-4">Total Impressions</th>
                <th className="py-3 px-4">Reach</th>
                <th className="py-3 px-4">Engagement</th>
                <th className="py-3 px-4">Outbound Clicks</th>
                <th className="py-3 px-4">Eng Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-lightBorder dark:divide-surface-darkBorder/30">
              {platforms.map((p: any) => (
                <tr key={p.platform} className="hover:bg-surface-lightBg dark:hover:bg-surface-darkHover/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white flex items-center gap-2">
                    <PlatformBadge platform={p.platform} size="sm" showLabel={false} />
                    <span>{p.platform}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-gold-400">{p.followers.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-white">{p.impressions.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-surface-lightMuted">{p.reach.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-white font-semibold">{p.engagement.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-emerald-400">{p.clicks.toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-bold text-gold-400">{p.engagementRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Heatmap: Best Posting Times */}
      <div className="p-6 rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-surface-lightText dark:text-white uppercase tracking-wider font-sans">
              Algorithmic Audience Presence Heatmap
            </h3>
            <p className="text-xs text-surface-lightMuted">Identifies peak algorithmic velocity windows per audience timezone</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-surface-lightMuted">
            <span>Low</span>
            <div className="w-16 h-2 rounded bg-gradient-to-r from-maroon-900 via-burgundy-600 to-gold-400" />
            <span className="text-gold-400 font-bold">Peak</span>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-2 text-center text-xs pt-2">
          <div className="text-surface-lightMuted font-bold">Day</div>
          <div className="text-surface-lightMuted font-bold">9:00 AM</div>
          <div className="text-surface-lightMuted font-bold">12:00 PM</div>
          <div className="text-surface-lightMuted font-bold">3:00 PM</div>
          <div className="text-surface-lightMuted font-bold">6:00 PM</div>
          <div className="text-surface-lightMuted font-bold">9:00 PM</div>

          {bestTimes.map((row: any) => (
            <React.Fragment key={row.day}>
              <div className="p-2.5 rounded-lg bg-surface-darkCard font-bold text-white flex items-center justify-center">
                {row.day}
              </div>
              {['9am', '12pm', '3pm', '6pm', '9pm'].map((slot) => {
                const val = row[slot];
                const isHigh = val > 85;
                const isMid = val > 65;

                return (
                  <div
                    key={slot}
                    className={`p-2.5 rounded-lg font-semibold flex items-center justify-center transition-all ${
                      isHigh
                        ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-black font-extrabold shadow-gold-glow'
                        : isMid
                        ? 'bg-maroon-700 text-gold-300'
                        : 'bg-maroon-950/60 text-surface-lightMuted'
                    }`}
                  >
                    {val}%
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Demographics Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Age cohorts */}
        <div className="p-6 rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-surface-lightText dark:text-white uppercase tracking-wider font-sans">
            Age Cohort Distribution
          </h3>
          <div className="space-y-3 pt-2">
            {demographics.ageRanges?.map((a: any) => (
              <div key={a.age} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-surface-lightMuted">{a.age} years old</span>
                  <span className="font-bold text-white">{a.percentage}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-surface-darkSubtle overflow-hidden">
                  <div className="h-full bg-gold-400 rounded-full" style={{ width: `${a.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Countries */}
        <div className="p-6 rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-surface-lightText dark:text-white uppercase tracking-wider font-sans">
            Top Geographic Markets
          </h3>
          <div className="space-y-3 pt-2">
            {demographics.topCountries?.map((c: any) => (
              <div key={c.country} className="flex items-center justify-between p-2.5 rounded-xl bg-surface-darkHover/40 text-xs">
                <span className="font-semibold text-white">{c.country}</span>
                <span className="font-bold text-gold-400">{c.share}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

