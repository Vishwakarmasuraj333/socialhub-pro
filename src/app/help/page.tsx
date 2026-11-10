'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  HelpCircle,
  Search,
  BookOpen,
  Key,
  ShieldCheck,
  Send,
  Calendar,
  MessageSquare,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function HelpCenterPage() {
  const [search, setSearch] = useState('');

  const guides = [
    {
      icon: Key,
      title: 'Connecting Official Social Accounts',
      desc: 'Step-by-step walkthrough on authenticating Instagram, Facebook, LinkedIn, TikTok, and YouTube via official OAuth 2.0.',
      href: '/dashboard/accounts',
    },
    {
      icon: Send,
      title: 'Mastering the Post Studio',
      desc: 'How to utilize platform-specific aspect ratios, character counters, and draft approval gates before scheduling.',
      href: '/dashboard/posts',
    },
    {
      icon: Calendar,
      title: 'Timezone-Aware Scheduling',
      desc: 'Configuring multi-timezone release calendars for global audience cohorts without scheduling conflicts.',
      href: '/dashboard/calendar',
    },
    {
      icon: MessageSquare,
      title: 'Triage with Unified Social Inbox',
      desc: 'Assigning incoming direct messages, comments, and mentions to team members with priority labels.',
      href: '/dashboard/inbox',
    },
    {
      icon: ShieldCheck,
      title: 'Enterprise RBAC & Security',
      desc: 'Managing Admin, Manager, Editor, and Analyst permissions, and enforcing Two-Factor Authentication (2FA).',
      href: '/dashboard/team',
    },
    {
      icon: Sparkles,
      title: 'Exporting Executive Reports',
      desc: 'Generating CSV and printable PDF board reports with real Graph API data.',
      href: '/dashboard/reports',
    },
  ];

  return (
    <div className="min-h-screen bg-surface-lightBg dark:bg-surface-darkBg text-surface-lightText dark:text-[#F5EEF3] transition-colors">
      <Navbar />

      <section className="pt-20 pb-16 border-b border-surface-lightBorder dark:border-surface-darkBorder/40 bg-surface-lightBg/50 dark:bg-[#130F13]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold text-gold-400 uppercase tracking-widest font-sans">
            Support &amp; Documentation
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-surface-lightText dark:text-surface-lightText dark:text-white tracking-tight font-sans">
            How Can We Assist Your Team?
          </h1>
          <p className="text-sm text-surface-lightMuted max-w-xl mx-auto">
            Search our knowledge base, explore API guides, or connect directly with our 24/7 technical team.
          </p>

          <div className="pt-6 max-w-md mx-auto">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-surface-lightMuted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search guides: e.g. OAuth tokens, Instagram reels..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white placeholder-surface-lightMuted focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Guide Cards */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((g, idx) => {
            const Icon = g.icon;
            return (
              <Link
                key={idx}
                href={g.href}
                className="p-6 rounded-3xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 hover:shadow-luxury transition-all space-y-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-maroon-700/20 text-gold-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-surface-lightText dark:text-surface-lightText dark:text-white group-hover:text-gold-400 transition-colors font-sans">
                  {g.title}
                </h3>
                <p className="text-xs text-surface-lightMuted leading-relaxed">
                  {g.desc}
                </p>
                <span className="text-[11px] font-semibold text-gold-400 inline-flex items-center gap-1 pt-2">
                  Read Guide <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}

