'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Eye,
  TrendingUp,
  Share2,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Send,
  Plus,
  RefreshCw,
  Heart,
  MessageCircle,
  Repeat,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts';
import { PlatformBadge } from '@/components/ui/PlatformBadge';
import { motion } from 'framer-motion';

export default function DashboardOverviewPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'14d' | '30d'>('14d');
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const res = await fetch('/api/dashboard/stats');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 bg-surface-darkCard/50 rounded-xl w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-surface-darkCard/40 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-surface-darkCard/40 rounded-2xl" />
          <div className="h-80 bg-surface-darkCard/40 rounded-2xl" />
        </div>
      </div>
    );
  }

  const stats = data?.stats || {
    totalConnectedAccounts: 7,
    totalFollowers: 1267600,
    totalImpressions: 428900,
    totalReach: 312400,
    totalEngagement: 19840,
    engagementRate: '5.24%',
    totalPublishedPosts: 3,
    scheduledPostsCount: 3,
    pendingPostsCount: 1,
    draftPostsCount: 1,
    audienceGrowthRate: '+14.6%',
  };

  const growthCharts = data?.charts?.growth || [];
  const platformBreakdown = data?.charts?.platformBreakdown || [];
  const bestPosts = data?.bestPerformingPosts || [];
  const recentActivity = data?.recentActivity || [];

  return (
    <div className="space-y-8">
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-surface-lightText dark:text-white tracking-tight font-sans">
            Executive Command Center
          </h1>
          <p className="text-xs sm:text-sm text-surface-lightMuted mt-1">
            Real-time cross-platform performance across 7 authorized channels.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={fetchData}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-lightCard dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder text-xs font-medium hover:border-gold-400 transition-all text-surface-lightText dark:text-white"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-gold-400' : ''}`} />
            <span>Sync Live Metrics</span>
          </button>

          <Link
            href="/dashboard/posts/create"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-maroon-700 to-burgundy-600 hover:from-maroon-800 hover:to-burgundy-700 text-white font-medium text-xs shadow-luxury transition-all"
          >
            <Plus className="w-4 h-4 text-gold-300" />
            <span>New Post</span>
          </Link>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Total Audience / Followers */}
        <motion.div
          whileHover={{ y: -3 }}
          className="p-5 rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 shadow-sm relative overflow-hidden group"
        >
          <div className="flex items-center justify-between text-surface-lightMuted">
            <span className="text-xs font-semibold uppercase tracking-wider font-sans">Total Audience</span>
            <div className="w-8 h-8 rounded-xl bg-gold-400/10 text-gold-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-surface-lightText dark:text-white tracking-tight">
              {stats.totalFollowers.toLocaleString()}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-xs">
              <span className="text-emerald-400 font-semibold flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
                {stats.audienceGrowthRate}
              </span>
              <span className="text-surface-lightMuted">past 30 days</span>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gold-400/10 to-transparent pointer-events-none rounded-bl-full" />
        </motion.div>

        {/* Metric 2: Impressions */}
        <motion.div
          whileHover={{ y: -3 }}
          className="p-5 rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 shadow-sm relative overflow-hidden group"
        >
          <div className="flex items-center justify-between text-surface-lightMuted">
            <span className="text-xs font-semibold uppercase tracking-wider font-sans">Total Impressions</span>
            <div className="w-8 h-8 rounded-xl bg-maroon-700/15 text-maroon-500 dark:text-maroon-400 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-surface-lightText dark:text-white tracking-tight">
              {stats.totalImpressions.toLocaleString()}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-xs">
              <span className="text-emerald-400 font-semibold flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +28.4%
              </span>
              <span className="text-surface-lightMuted">vs last month</span>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-maroon-600/15 to-transparent pointer-events-none rounded-bl-full" />
        </motion.div>

        {/* Metric 3: Total Reach */}
        <motion.div
          whileHover={{ y: -3 }}
          className="p-5 rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 shadow-sm relative overflow-hidden group"
        >
          <div className="flex items-center justify-between text-surface-lightMuted">
            <span className="text-xs font-semibold uppercase tracking-wider font-sans">Unique Reach</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-surface-lightText dark:text-white tracking-tight">
              {stats.totalReach.toLocaleString()}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-xs">
              <span className="text-emerald-400 font-semibold flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +19.2%
              </span>
              <span className="text-surface-lightMuted">unique accounts</span>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/10 to-transparent pointer-events-none rounded-bl-full" />
        </motion.div>

        {/* Metric 4: Engagement Rate */}
        <motion.div
          whileHover={{ y: -3 }}
          className="p-5 rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 shadow-sm relative overflow-hidden group"
        >
          <div className="flex items-center justify-between text-surface-lightMuted">
            <span className="text-xs font-semibold uppercase tracking-wider font-sans">Engagement Rate</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-surface-lightText dark:text-white tracking-tight">
              {stats.engagementRate}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-xs">
              <span className="text-emerald-400 font-semibold flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +0.8%
              </span>
              <span className="text-surface-lightMuted">industry avg 2.1%</span>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/10 to-transparent pointer-events-none rounded-bl-full" />
        </motion.div>
      </div>

      {/* Publishing Status Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-surface-lightCard dark:bg-surface-darkCard/50 border border-surface-lightBorder dark:border-surface-darkBorder/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-lg font-bold text-surface-lightText dark:text-white">{stats.totalPublishedPosts}</p>
            <p className="text-[11px] text-surface-lightMuted">Published Posts</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-lg font-bold text-surface-lightText dark:text-white">{stats.scheduledPostsCount}</p>
            <p className="text-[11px] text-surface-lightMuted">Scheduled in Queue</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-lg font-bold text-surface-lightText dark:text-white">{stats.pendingPostsCount}</p>
            <p className="text-[11px] text-surface-lightMuted">Pending Approval</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-lg font-bold text-surface-lightText dark:text-white">{stats.totalConnectedAccounts}</p>
            <p className="text-[11px] text-surface-lightMuted">Connected Channels</p>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Follower Growth & Impressions Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-surface-lightText dark:text-white uppercase tracking-wider font-sans">
                Follower Growth &amp; Reach Dynamics
              </h3>
              <p className="text-xs text-surface-lightMuted">Aggregated daily signals across all connected platforms</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs text-gold-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-gold-400" /> Impressions
              </span>
              <span className="flex items-center gap-1.5 text-xs text-maroon-400 font-medium ml-2">
                <span className="w-2.5 h-2.5 rounded-full bg-maroon-600" /> Reach
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthCharts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D6B36A" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#D6B36A" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="maroonGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#842D49" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#842D49" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2C222A" opacity={0.3} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: '#91858C' }}
                  tickFormatter={(val) => val.slice(5)}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#91858C' }}
                  tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1C171C',
                    borderColor: '#641B32',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="impressions"
                  stroke="#D6B36A"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#goldGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="reach"
                  stroke="#842D49"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#maroonGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Platform Share Breakdown */}
        <div className="p-6 rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-surface-lightText dark:text-white uppercase tracking-wider font-sans">
              Platform Audience Share
            </h3>
            <p className="text-xs text-surface-lightMuted mt-0.5">Follower distribution per network</p>

            <div className="space-y-4 mt-6">
              {platformBreakdown.slice(0, 5).map((p: any) => {
                const percentage = ((p.followers / stats.totalFollowers) * 100).toFixed(1);
                return (
                  <div key={p.platform} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <PlatformBadge platform={p.platform} size="sm" showLabel={false} />
                        <span className="font-semibold text-surface-lightText dark:text-white">{p.platform}</span>
                      </div>
                      <span className="font-bold text-gold-400">
                        {p.followers.toLocaleString()} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-surface-lightBg dark:bg-surface-darkSubtle overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-maroon-700 to-gold-400 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Link
            href="/dashboard/accounts"
            className="mt-6 block text-center py-2.5 rounded-xl border border-maroon-700/50 hover:bg-maroon-900/20 text-xs font-semibold text-gold-300 transition-colors"
          >
            Manage All 7 Connected Accounts &rarr;
          </Link>
        </div>
      </div>

      {/* Bottom Row: Best Performing Content & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Best Performing Content (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-surface-lightText dark:text-white uppercase tracking-wider font-sans">
                Best-Performing Content
              </h3>
              <p className="text-xs text-surface-lightMuted">Ranked by total reach and engagement velocity</p>
            </div>
            <Link href="/dashboard/posts" className="text-xs text-gold-400 hover:underline font-medium">
              View All Posts &rarr;
            </Link>
          </div>

          <div className="space-y-4 pt-2">
            {bestPosts.length === 0 ? (
              <p className="text-xs text-surface-lightMuted">No published posts yet.</p>
            ) : (
              bestPosts.map((post: any) => {
                const media = post.mediaUrls ? JSON.parse(post.mediaUrls) : [];
                const platforms = post.socialAccounts?.map((sa: any) => sa.socialAccount?.platform) || [];

                return (
                  <div
                    key={post.id}
                    className="p-4 rounded-xl bg-surface-lightBg dark:bg-surface-darkHover/40 border border-surface-lightBorder dark:border-surface-darkBorder/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {media[0] && (
                        <img
                          src={media[0]}
                          alt="Post media"
                          className="w-14 h-14 rounded-lg object-cover border border-maroon-700/30 shrink-0"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap gap-1.5 mb-1.5">
                          {platforms.map((plat: string) => (
                            <PlatformBadge key={plat} platform={plat} size="sm" showLabel={false} />
                          ))}
                        </div>
                        <p className="text-xs text-surface-lightText dark:text-white line-clamp-2 leading-relaxed">
                          {post.content}
                        </p>
                        <span className="text-[10px] text-surface-lightMuted mt-1 block">
                          Published {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Recently'}
                        </span>
                      </div>
                    </div>

                    {post.analytics && (
                      <div className="flex items-center gap-4 shrink-0 text-xs">
                        <div className="text-right">
                          <span className="font-bold text-gold-400 block">{post.analytics.impressions.toLocaleString()}</span>
                          <span className="text-[10px] text-surface-lightMuted">Impressions</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-white block">{post.analytics.likes.toLocaleString()}</span>
                          <span className="text-[10px] text-surface-lightMuted">Likes</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-emerald-400 block">{post.analytics.shares.toLocaleString()}</span>
                          <span className="text-[10px] text-surface-lightMuted">Shares</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Live Audit & Recent Activity (1 Col) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-surface-lightText dark:text-white uppercase tracking-wider font-sans">
            Audit Activity Stream
          </h3>
          <p className="text-xs text-surface-lightMuted">Immutable server-side action log</p>

          <div className="space-y-3.5 pt-2">
            {recentActivity.map((act: any) => (
              <div key={act.id} className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-gold-400 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-surface-lightText dark:text-white">
                    {act.action.replace(/_/g, ' ')}
                  </p>
                  <p className="text-[11px] text-surface-lightMuted line-clamp-1">
                    {act.details}
                  </p>
                  <span className="text-[9px] text-surface-lightMuted">
                    {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

