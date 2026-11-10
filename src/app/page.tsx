'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Logo } from '@/components/ui/Logo';
import { PlatformBadge } from '@/components/ui/PlatformBadge';
import { PLATFORM_REGISTRY } from '@/lib/social-oauth';
import { SocialOrbitalAnimation } from '@/components/home/SocialOrbitalAnimation';
import { SocialPlatformsSlider } from '@/components/home/SocialPlatformsSlider';
import { SocialPlatform } from '@/types';
import {
  Sparkles,
  ArrowRight,
  Send,
  Calendar,
  MessageSquare,
  BarChart3,
  ShieldCheck,
  Zap,
  Users,
  CheckCircle2,
  ChevronDown,
  Layers,
  Clock,
  Eye,
  TrendingUp,
  Share2,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'ANNUAL'>('MONTHLY');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const supportedPlatforms = Object.keys(PLATFORM_REGISTRY) as SocialPlatform[];

  const features = [
    {
      icon: Send,
      title: 'Unified Publishing Studio',
      desc: 'Craft once, tailor for seven algorithms. Automatically enforces character caps, media ratios, and hashtag rules per network.',
    },
    {
      icon: Calendar,
      title: 'Timezone-Aware Master Calendar',
      desc: 'Visualize releases across London, Tokyo, and New York. Drag-and-drop rescheduling with conflict detection.',
    },
    {
      icon: MessageSquare,
      title: 'Real-Time Social Inbox',
      desc: 'Triage direct messages, comments, and mentions from Instagram, LinkedIn, and Facebook in one shared priority stream.',
    },
    {
      icon: BarChart3,
      title: 'Cross-Network Attribution',
      desc: 'Compare engagement velocity and audience growth side-by-side with official Graph API metrics, not estimated scrapers.',
    },
    {
      icon: Users,
      title: 'Enterprise Team RBAC',
      desc: 'Assign Granular roles (Admin, Manager, Editor, Analyst) with built-in multi-stage post approval workflows.',
    },
    {
      icon: ShieldCheck,
      title: 'SOC2 Type II & OAuth Security',
      desc: 'Official partner API keys with automated token refresh, zero raw credential exposure, and encrypted audit trails.',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Authorize Channels with OAuth 2.0',
      desc: 'Connect your brand profiles across Instagram, TikTok, LinkedIn, YouTube, X, Facebook, and Pinterest in one click.',
    },
    {
      num: '02',
      title: 'Compose with Feed Simulators',
      desc: 'Draft posts and 24h stories with live aspect-ratio previews, hashtag chips, and character limit indicators.',
    },
    {
      num: '03',
      title: 'Slot into Algorithmic Peak Hours',
      desc: 'Leverage historical engagement heatmaps to automatically trigger releases when your target demographic is active.',
    },
    {
      num: '04',
      title: 'Triage Inbound Conversations',
      desc: 'Slash response time from hours to seconds by assigning inquiries and replying directly through the unified inbox.',
    },
  ];

  const testimonials = [
    {
      quote:
        'SOCIALHUB PRO gave our agency the ability to run 40+ client brands from a single screen. We eliminated 15 hours of weekly context-switching and increased organic post reach by 34%.',
      author: 'Marcus Aurelius Sterling',
      title: 'Chief Marketing Officer, Zenith Global Media',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    },
    {
      quote:
        'The unified social inbox with team routing resolved our customer response SLA bottleneck. Our Instagram and LinkedIn inquiries now get answered in under 8 minutes.',
      author: 'Helena Vane',
      title: 'VP of Customer Experience, Kova Luxury Group',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    },
    {
      quote:
        'The best-posting-time heatmap and real Graph API analytics gave our board absolute confidence in our omnichannel performance investments.',
      author: 'Julian Thorne',
      title: 'Director of Growth, Horizon Fintech',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    },
  ];

  const faqs = [
    {
      q: 'Do you use official social media platform APIs?',
      a: 'Yes, 100%. SOCIALHUB PRO integrates directly via official OAuth 2.0 endpoints with Meta Graph API (Instagram & Facebook), Google YouTube Data API, LinkedIn Community API, TikTok Open Platform, Twitter API v2, and Pinterest API v5. We never use fragile web scrapers.',
    },
    {
      q: 'Can multiple team members collaborate with approval workflows?',
      a: 'Yes. Our Role-Based Access Control (RBAC) supports Admin, Manager, Editor, and Analyst roles. Editors can draft content that requires one-click manager sign-off before it can be published or scheduled.',
    },
    {
      q: 'How does the unified inbox work across different networks?',
      a: 'Inbound direct messages, mentions, and post comments are ingested in real time. Your team can filter by channel, priority, or unread status, assign threads to specific colleagues, and send direct replies without leaving SOCIALHUB PRO.',
    },
    {
      q: 'Is there a free trial available?',
      a: 'Yes. We offer a 14-day fully featured Enterprise trial with zero credit card commitment so your team can test multi-channel scheduling and unified inbox capabilities immediately.',
    },
  ];

  return (
    <div className="min-h-screen bg-surface-lightBg dark:bg-surface-darkBg text-surface-lightText dark:text-[#F5EEF3] transition-colors selection:bg-maroon-700 selection:text-gold-300">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-24 sm:pt-20 sm:pb-32 overflow-hidden">
        {/* Ambient Gradient Glow Orbs */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[650px] h-[450px] bg-gradient-to-tr from-maroon-700/25 via-burgundy-600/20 to-gold-400/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-80 h-80 bg-maroon-800/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* TWO COLUMN RESPONSIVE HERO: LEFT TEXT & RIGHT ANIMATED SOCIAL ICONS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* LEFT COLUMN: Headings, Subtitles, CTA Buttons & Trust Indicators */}
            <div className="lg:col-span-7 text-left space-y-6">
              {/* Eyebrow Pill */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-maroon-900/30 dark:bg-maroon-900/40 border border-maroon-700/50 text-gold-300 text-xs font-semibold uppercase tracking-wider shadow-sm backdrop-blur-md"
              >
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                <span>Enterprise Omnichannel Social Suite 2026</span>
              </motion.div>

              {/* Master Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-surface-lightText dark:text-white font-sans leading-[1.1]"
              >
                Manage Every Social Platform.{' '}
                <span className="block mt-2 bg-gradient-to-r from-maroon-600 via-burgundy-500 to-gold-400 bg-clip-text text-transparent">
                  From One Powerful Dashboard.
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-base sm:text-lg lg:text-xl text-surface-lightMuted max-w-2xl leading-relaxed"
              >
                Create, schedule, publish, analyze, and manage your entire social media presence from one beautifully connected workspace.
              </motion.p>

              {/* Hero CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
              >
                <Link
                  href="/register"
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-maroon-700 via-burgundy-600 to-maroon-800 hover:opacity-95 text-white font-bold text-sm shadow-luxury-lg hover:shadow-maroon-glow border border-gold-400/30 flex items-center justify-center gap-2 group transition-all text-center"
                >
                  <Sparkles className="w-4 h-4 text-gold-300" />
                  <span>Start 14-Day Free Trial</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/login"
                  className="px-8 py-4 rounded-2xl bg-white dark:bg-surface-darkCard hover:bg-surface-lightBg dark:hover:bg-surface-darkHover border border-surface-lightBorder dark:border-surface-darkBorder/80 text-surface-lightText dark:text-white font-semibold text-sm transition-all text-center"
                >
                  Sign In
                </Link>
              </motion.div>

              {/* Trust Guarantees */}
              <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-surface-lightMuted">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> No credit card required
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instant OAuth setup
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Cancel anytime
                </span>
              </div>
            </div>

            {/* RIGHT COLUMN: Mast Animated Social Icon Constellation */}
            <div className="lg:col-span-5 relative flex items-center justify-center w-full">
              <SocialOrbitalAnimation />
            </div>
          </div>

          {/* Interactive Floating Dashboard Preview Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-20 relative max-w-5xl mx-auto rounded-3xl p-2 sm:p-3 bg-gradient-to-b from-maroon-700/40 via-maroon-900/20 to-transparent border border-maroon-700/40 shadow-luxury-lg backdrop-blur-xl"
          >
            <div className="rounded-2xl bg-white dark:bg-[#151115] border border-surface-lightBorder dark:border-surface-darkBorder/60 overflow-hidden shadow-2xl">
              {/* Fake Window Header */}
              <div className="px-4 py-3 bg-surface-lightBg dark:bg-[#120E12] border-b border-surface-lightBorder dark:border-surface-darkBorder/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-3 text-[11px] font-mono text-surface-lightMuted">
                    app.socialhubpro.com/dashboard/overview
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                    Connected &bull; 7 Networks Active
                  </span>
                </div>
              </div>

              {/* Mock Dashboard Body */}
              <div className="p-6 sm:p-8 space-y-6 text-left">
                {/* Metrics Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-surface-lightBg dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/50">
                    <p className="text-[11px] text-surface-lightMuted uppercase font-semibold">Total Followers</p>
                    <p className="text-xl sm:text-2xl font-black text-gold-400 mt-1">1,267,600</p>
                    <span className="text-[10px] text-emerald-400 font-bold">+14.6% this month</span>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-lightBg dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/50">
                    <p className="text-[11px] text-surface-lightMuted uppercase font-semibold">Impressions</p>
                    <p className="text-xl sm:text-2xl font-black text-white mt-1">428,900</p>
                    <span className="text-[10px] text-emerald-400 font-bold">+28.4% velocity</span>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-lightBg dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/50">
                    <p className="text-[11px] text-surface-lightMuted uppercase font-semibold">Engagement Rate</p>
                    <p className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">5.24%</p>
                    <span className="text-[10px] text-surface-lightMuted">2.5x industry standard</span>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-lightBg dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/50">
                    <p className="text-[11px] text-surface-lightMuted uppercase font-semibold">Scheduled Queue</p>
                    <p className="text-xl sm:text-2xl font-black text-white mt-1">8 Releases</p>
                    <span className="text-[10px] text-amber-400 font-bold">Auto-optimized peak slots</span>
                  </div>
                </div>

                {/* Simulated Feed Preview Banner */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-maroon-900/30 via-burgundy-900/20 to-transparent border border-maroon-700/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-maroon-700 text-gold-300 flex items-center justify-center font-bold">
                      SH
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">
                        Next Scheduled Drop: &quot;2026 Omnichannel Strategy Guide&quot;
                      </p>
                      <p className="text-[11px] text-surface-lightMuted">
                        Simultaneously publishing to Instagram, LinkedIn, and X in 45 minutes.
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 rounded-xl bg-gold-400 text-black font-bold text-xs hover:bg-gold-300 transition-colors shrink-0"
                  >
                    Explore Dashboard Live &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CONNECTED PLATFORMS SHOWCASE MARQUEE SLIDER */}
      <SocialPlatformsSlider />

      {/* CORE FEATURES SECTION */}
      <section id="features" className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest font-sans">
              Engineered For High Growth
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-surface-lightText dark:text-white tracking-tight font-sans">
              Everything Your Brand Needs To Dominate Social Media
            </h2>
            <p className="text-sm sm:text-base text-surface-lightMuted leading-relaxed">
              Eliminate disconnected browser extensions and manual spreadsheet trackers with our unified, enterprise-grade operating system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="p-8 rounded-3xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 shadow-sm hover:shadow-luxury transition-all space-y-4 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-maroon-700 to-burgundy-600 text-gold-300 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-surface-lightText dark:text-white font-sans">
                    {f.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-surface-lightMuted leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-surface-lightBg/50 dark:bg-[#130F13] border-y border-surface-lightBorder dark:border-surface-darkBorder/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest font-sans">
              Streamlined Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-surface-lightText dark:text-white tracking-tight font-sans">
              How SOCIALHUB PRO Accelerates Growth
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((st) => (
              <div key={st.num} className="space-y-3 p-6 rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/50">
                <span className="text-3xl font-black text-gold-400 font-mono block">{st.num}</span>
                <h4 className="text-base font-bold text-surface-lightText dark:text-white">{st.title}</h4>
                <p className="text-xs text-surface-lightMuted leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest font-sans">
              Trusted Worldwide
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-surface-lightText dark:text-white tracking-tight font-sans">
              Loved By Modern Marketing Leaders
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 shadow-sm flex flex-col justify-between space-y-6"
              >
                <p className="text-xs sm:text-sm text-surface-lightText dark:text-[#E8E2E4] italic leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-surface-lightBorder dark:border-surface-darkBorder/40">
                  <img
                    src={t.avatar}
                    alt={t.author}
                    className="w-12 h-12 rounded-full object-cover border border-gold-400/50"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-surface-lightText dark:text-white">{t.author}</h4>
                    <p className="text-[10px] text-surface-lightMuted">{t.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING PLANS */}
      <section id="pricing" className="py-24 bg-surface-lightBg/50 dark:bg-[#130F13] border-y border-surface-lightBorder dark:border-surface-darkBorder/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest font-sans">
              Transparent Pricing
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-surface-lightText dark:text-white tracking-tight font-sans">
              Scalable Tiers for Any Stage
            </h2>
            <p className="text-xs sm:text-sm text-surface-lightMuted">
              All plans include real OAuth integrations, master calendar, and 14-day money-back guarantee.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="p-8 rounded-3xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-surface-lightText dark:text-white">Starter Tier</h3>
                <p className="text-xs text-surface-lightMuted">For boutique creator brands and startups.</p>
                <div className="text-3xl font-black text-surface-lightText dark:text-white">$49<span className="text-xs font-normal text-surface-lightMuted">/month</span></div>
                <div className="space-y-2 pt-4 border-t border-surface-lightBorder dark:border-surface-darkBorder/40 text-xs">
                  <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gold-400" /> Up to 5 Social Accounts</p>
                  <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gold-400" /> 1 Team Seat</p>
                  <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gold-400" /> Master Calendar &amp; Drafts</p>
                  <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gold-400" /> Standard 30-Day Metrics</p>
                </div>
              </div>
              <Link href="/register" className="w-full text-center py-3 rounded-xl bg-surface-darkHover border border-surface-darkBorder text-gold-300 font-semibold text-xs">
                Start Free Trial
              </Link>
            </div>

            {/* Pro (Highlighted) */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-maroon-900/40 via-[#1C171C] to-[#1C171C] border-2 border-gold-400 shadow-luxury-lg flex flex-col justify-between space-y-6 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gold-400 text-black font-black text-[10px] uppercase tracking-wider">
                Most Popular
              </span>
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Professional Team</h3>
                <p className="text-xs text-surface-lightMuted">For fast-growing companies and marketing teams.</p>
                <div className="text-3xl font-black text-white">$99<span className="text-xs font-normal text-surface-lightMuted">/month</span></div>
                <div className="space-y-2 pt-4 border-t border-maroon-700/40 text-xs">
                  <p className="flex items-center gap-2 text-white"><CheckCircle2 className="w-4 h-4 text-gold-400" /> Up to 15 Social Accounts</p>
                  <p className="flex items-center gap-2 text-white"><CheckCircle2 className="w-4 h-4 text-gold-400" /> 5 Team Seats &amp; Approvals</p>
                  <p className="flex items-center gap-2 text-white"><CheckCircle2 className="w-4 h-4 text-gold-400" /> Unified Social Inbox</p>
                  <p className="flex items-center gap-2 text-white"><CheckCircle2 className="w-4 h-4 text-gold-400" /> Stories Studio &amp; Scheduling</p>
                  <p className="flex items-center gap-2 text-white"><CheckCircle2 className="w-4 h-4 text-gold-400" /> Priority Support</p>
                </div>
              </div>
              <Link href="/register" className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-maroon-700 to-burgundy-600 text-white font-bold text-xs shadow-luxury hover:opacity-95">
                Start 14-Day Free Trial
              </Link>
            </div>

            {/* Enterprise */}
            <div className="p-8 rounded-3xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-surface-lightText dark:text-white">Global Enterprise</h3>
                <p className="text-xs text-surface-lightMuted">For multi-brand organizations and global agencies.</p>
                <div className="text-3xl font-black text-surface-lightText dark:text-white">$199<span className="text-xs font-normal text-surface-lightMuted">/month</span></div>
                <div className="space-y-2 pt-4 border-t border-surface-lightBorder dark:border-surface-darkBorder/40 text-xs">
                  <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gold-400" /> Unlimited Social Accounts</p>
                  <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gold-400" /> Unlimited Seats &amp; Custom RBAC</p>
                  <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gold-400" /> White-Label Reports &amp; Exports</p>
                  <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gold-400" /> 99.99% Uptime SLA Guarantee</p>
                </div>
              </div>
              <Link href="/register" className="w-full text-center py-3 rounded-xl bg-surface-darkHover border border-surface-darkBorder text-gold-300 font-semibold text-xs">
                Request Custom Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 sm:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest font-sans">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-surface-lightText dark:text-white tracking-tight font-sans">
              Common Inquiries Answered
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between text-sm font-bold text-surface-lightText dark:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gold-400 transition-transform ${
                      activeFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-surface-lightMuted leading-relaxed border-t border-surface-lightBorder dark:border-surface-darkBorder/40 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-20 bg-gradient-to-r from-maroon-900 via-burgundy-900 to-maroon-950 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-sans">
            Ready to Unify Your Social Media Operations?
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Join thousands of modern enterprises managing multi-channel publishing, unified inboxes, and analytics with SOCIALHUB PRO.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-3.5 rounded-xl bg-gold-400 hover:bg-gold-300 text-black font-extrabold text-sm shadow-gold-glow transition-all"
            >
              Get Started for Free
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3.5 rounded-xl border border-white/30 hover:bg-white/10 text-white font-semibold text-sm transition-all"
            >
              Request Custom Demo
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

