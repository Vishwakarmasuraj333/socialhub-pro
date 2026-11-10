'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-surface-lightBg dark:bg-surface-darkBg text-surface-lightText dark:text-[#F5EEF3] transition-colors">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-8">
        <div className="space-y-3 pb-6 border-b border-surface-lightBorder dark:border-surface-darkBorder/40">
          <span className="text-xs font-bold text-gold-400 uppercase tracking-widest font-sans">
            Terms of Service
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-surface-lightText dark:text-white tracking-tight font-sans">
            Master Subscription Agreement
          </h1>
          <p className="text-xs text-surface-lightMuted">
            Last Updated: November 10, 2026 &bull; Version 4.2
          </p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-surface-lightText dark:text-[#DCD2DA] leading-relaxed font-sans">
          <h2 className="text-lg font-bold text-surface-lightText dark:text-white pt-2">1. Agreement to Terms</h2>
          <p>
            By accessing or subscribing to the SOCIALHUB PRO software-as-a-service platform, you and the legal entity you represent agree to be bound by these Master Subscription Terms.
          </p>

          <h2 className="text-lg font-bold text-surface-lightText dark:text-white pt-2">2. Acceptable Use and Platform Compliance</h2>
          <p>
            You agree to comply with all applicable terms, policies, and guidelines established by the connected social media networks (Meta Platform Terms, YouTube Terms of Service, LinkedIn User Agreement, TikTok Developer Policy, X Developer Agreement). You will not use SOCIALHUB PRO for automated spam, intellectual property infringement, or malicious distribution.
          </p>

          <h2 className="text-lg font-bold text-surface-lightText dark:text-white pt-2">3. Service Level Commitments (SLA)</h2>
          <p>
            For Enterprise Tier subscriptions, SOCIALHUB PRO guarantees 99.99% monthly publishing availability. Scheduled triggers run on redundant distributed queues with automatic failover and exponential retry logic.
          </p>

          <h2 className="text-lg font-bold text-surface-lightText dark:text-white pt-2">4. Subscriptions &amp; Cancellation</h2>
          <p>
            Subscriptions renew automatically unless canceled prior to the end of the current billing period. Enterprise customers may request seat tier adjustments or invoice modifications directly from their Billing settings.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

