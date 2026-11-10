'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ShieldCheck, Lock, Eye, CheckCircle2 } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-surface-lightBg dark:bg-surface-darkBg text-surface-lightText dark:text-[#F5EEF3] transition-colors">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-8">
        <div className="space-y-3 pb-6 border-b border-surface-lightBorder dark:border-surface-darkBorder/40">
          <span className="text-xs font-bold text-gold-400 uppercase tracking-widest font-sans">
            Legal &amp; Data Protection
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-surface-lightText dark:text-white tracking-tight font-sans">
            Privacy Policy &amp; Security Standards
          </h1>
          <p className="text-xs text-surface-lightMuted">
            Effective Date: November 10, 2026 &bull; Compliant with GDPR, CCPA, and SOC2 Type II
          </p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-surface-lightText dark:text-[#DCD2DA] leading-relaxed font-sans">
          <h2 className="text-lg font-bold text-surface-lightText dark:text-white pt-2">1. Overview and Commitment</h2>
          <p>
            At SOCIALHUB PRO Global Technologies (&ldquo;SOCIALHUB PRO&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;), we hold enterprise data confidentiality and cryptographic integrity as paramount. This Privacy Policy delineates how we securely collect, ingest, encrypt, and handle account credentials, media assets, message streams, and performance metrics across authorized third-party social media networks.
          </p>

          <h2 className="text-lg font-bold text-surface-lightText dark:text-white pt-2">2. Official Platform OAuth 2.0 Ingestion</h2>
          <p>
            SOCIALHUB PRO communicates solely via official, approved API endpoints:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-surface-lightMuted">
            <li>Meta Platforms Inc. (Instagram Graph API, Facebook Pages API)</li>
            <li>Google LLC (YouTube Data API v3, Google OAuth 2.0)</li>
            <li>LinkedIn Corporation (LinkedIn Community Management API v2)</li>
            <li>TikTok Inc. (TikTok Open Platform API)</li>
            <li>X Corp. (Twitter API v2)</li>
            <li>Pinterest Inc. (Pinterest API v5)</li>
          </ul>
          <p>
            We strictly adhere to each provider&apos;s Developer Data Policy and Platform Terms. We never store customer platform passwords. All tokens are encrypted using AES-256 at rest and transmitted using TLS 1.3 in transit.
          </p>

          <h2 className="text-lg font-bold text-surface-lightText dark:text-white pt-2">3. Role-Based Access Control and Tenant Isolation</h2>
          <p>
            Customer organizations operate in dedicated logical tenancy. Social accounts, draft posts, scheduled queue items, and team comments belonging to your organization cannot be accessed by other tenants. Administrative users maintain full power to revoke invitations and change permission tiers.
          </p>

          <h2 className="text-lg font-bold text-surface-lightText dark:text-white pt-2">4. Single-Use OTP and Two-Factor Authentication</h2>
          <p>
            Authentication employs single-use 6-digit cryptographic verification codes governed by strict expiration windows (10 minutes) and 60-second cooldown rate limits.
          </p>

          <h2 className="text-lg font-bold text-surface-lightText dark:text-white pt-2">5. Data Retention &amp; Right to Be Forgotten</h2>
          <p>
            When an account is disconnected or deleted, all associated OAuth tokens, scheduled posts, and cached inbox messages are purged from our database immediately in compliance with GDPR Article 17.
          </p>

          <h2 className="text-lg font-bold text-surface-lightText dark:text-white pt-2">6. Contact Data Protection Officer</h2>
          <p>
            For inquiries regarding compliance, enterprise SOC2 audits, or data processing agreements (DPA), please reach our Data Protection Officer at <span className="text-gold-400 font-mono">dpo@socialhubpro.com</span>.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

