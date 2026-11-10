'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { useToast } from '@/context/ToastContext';
import { Send, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { success } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    success('Subscribed!', 'You are now subscribed to the SOCIALHUB PRO Executive Digest.');
    setEmail('');
  };

  return (
    <footer className="border-t border-zinc-200 dark:border-surface-darkBorder/60 bg-white dark:bg-[#0C0A0C] text-zinc-700 dark:text-zinc-300 text-sm pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="lg" showTagline={true} />
            <p className="text-zinc-600 dark:text-zinc-400 max-w-sm text-sm leading-relaxed mt-3 font-normal">
              The premier enterprise omnichannel social media management suite. Unify publishing, scheduled stories, social listening, and customer communications across seven major global networks.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs font-semibold text-amber-700 dark:text-gold-400">
              <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-gold-400 shrink-0" />
              <span>SOC2 Type II Certified &bull; Official Meta, Google, LinkedIn &amp; X Partner</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-zinc-900 dark:text-white font-bold text-sm tracking-wider uppercase font-sans">
              Product
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/dashboard/posts" className="text-zinc-600 dark:text-zinc-400 hover:text-maroon-700 dark:hover:text-gold-300 font-medium transition-colors">
                  Publishing Studio
                </Link>
              </li>
              <li>
                <Link href="/dashboard/stories" className="text-zinc-600 dark:text-zinc-400 hover:text-maroon-700 dark:hover:text-gold-300 font-medium transition-colors">
                  Stories Manager
                </Link>
              </li>
              <li>
                <Link href="/dashboard/calendar" className="text-zinc-600 dark:text-zinc-400 hover:text-maroon-700 dark:hover:text-gold-300 font-medium transition-colors">
                  Content Calendar
                </Link>
              </li>
              <li>
                <Link href="/dashboard/inbox" className="text-zinc-600 dark:text-zinc-400 hover:text-maroon-700 dark:hover:text-gold-300 font-medium transition-colors">
                  Unified Social Inbox
                </Link>
              </li>
              <li>
                <Link href="/dashboard/analytics" className="text-zinc-600 dark:text-zinc-400 hover:text-maroon-700 dark:hover:text-gold-300 font-medium transition-colors">
                  Advanced Analytics
                </Link>
              </li>
              <li>
                <Link href="/dashboard/team" className="text-zinc-600 dark:text-zinc-400 hover:text-maroon-700 dark:hover:text-gold-300 font-medium transition-colors">
                  Enterprise Team RBAC
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="text-zinc-900 dark:text-white font-bold text-sm tracking-wider uppercase font-sans">
              Resources
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/blog" className="text-zinc-600 dark:text-zinc-400 hover:text-maroon-700 dark:hover:text-gold-300 font-medium transition-colors">
                  Executive Blog CMS
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-zinc-600 dark:text-zinc-400 hover:text-maroon-700 dark:hover:text-gold-300 font-medium transition-colors">
                  Help Center &amp; Guides
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-zinc-600 dark:text-zinc-400 hover:text-maroon-700 dark:hover:text-gold-300 font-medium transition-colors">
                  Request Enterprise Demo
                </Link>
              </li>
              <li>
                <Link href="/dashboard/reports" className="text-zinc-600 dark:text-zinc-400 hover:text-maroon-700 dark:hover:text-gold-300 font-medium transition-colors">
                  Benchmark Reports
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-zinc-600 dark:text-zinc-400 hover:text-maroon-700 dark:hover:text-gold-300 font-medium transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-zinc-600 dark:text-zinc-400 hover:text-maroon-700 dark:hover:text-gold-300 font-medium transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div className="space-y-3">
            <h4 className="text-zinc-900 dark:text-white font-bold text-sm tracking-wider uppercase font-sans">
              Executive Digest
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
              Curated algorithmic shifts, platform updates, and benchmark data delivered every Tuesday.
            </p>
            {subscribed ? (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-maroon-900/30 border border-emerald-300 dark:border-gold-400/40 text-emerald-800 dark:text-gold-300 text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-surface-darkCard border border-zinc-300 dark:border-surface-darkBorder/80 text-zinc-900 dark:text-white placeholder-zinc-400 text-xs focus:outline-none focus:border-maroon-700 dark:focus:border-gold-400 transition-all pr-10"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 p-1.5 rounded-lg bg-maroon-700 hover:bg-maroon-800 text-gold-300 transition-all shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium block">
                  No spam. One-click unsubscribe anytime.
                </span>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-200 dark:border-surface-darkBorder/40 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium">
          <p className="text-zinc-600 dark:text-zinc-400">
            &copy; {new Date().getFullYear()} SOCIALHUB PRO Global Technologies Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              Security
            </Link>
            <Link href="/contact" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
