'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import {
  Lock,
  Mail,
  User,
  Building,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const router = useRouter();
  const { success, error } = useToast();
  const { refreshUser } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    if (password.length < 8) {
      error('Password Too Short', 'Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, companyName }),
      });

      const data = await res.json();
      if (res.ok) {
        success('Trial Activated!', 'Welcome to SOCIALHUB PRO! Your 14-day free trial is now active.');
        await refreshUser();
        router.push('/dashboard');
      } else {
        error('Registration Failed', data.message);
      }
    } catch (err: any) {
      error('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-lightBg dark:bg-[#100D10] text-surface-lightText dark:text-[#F5EEF3] flex flex-col justify-between p-6 sm:p-10 relative overflow-hidden transition-colors">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-maroon-700/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between max-w-6xl mx-auto w-full z-10">
        <Logo size="md" href="/" />
        <Link
          href="/login"
          className="text-xs font-semibold text-maroon-700 dark:text-gold-400 hover:underline transition-colors"
        >
          Already have an account? <span className="underline">Sign In</span>
        </Link>
      </div>

      {/* Center Registration Card */}
      <div className="max-w-md w-full mx-auto my-auto z-10 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-white dark:bg-[#181318]/90 border border-surface-lightBorder dark:border-maroon-700/50 shadow-luxury-lg p-8 sm:p-10 space-y-6 backdrop-blur-xl"
        >
          {/* Header */}
          <div className="space-y-1.5 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-maroon-900/10 dark:bg-maroon-900/40 border border-maroon-700/20 dark:border-maroon-700/50 text-maroon-800 dark:text-gold-300 text-[10px] font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3 text-gold-500" />
              <span>Full Platform Access</span>
            </div>
            <h1 className="text-2xl font-black text-surface-lightText dark:text-white tracking-tight font-sans">
              Start 14-Day Free Trial
            </h1>
            <p className="text-xs text-zinc-500 dark:text-surface-lightMuted leading-relaxed">
              Unlock the entire omnichannel social management suite. No credit card required.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-surface-lightText dark:text-white">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Suraj Vishwakarma"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-[#120E12] border border-zinc-200 dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white placeholder-zinc-400 focus:outline-none focus:border-maroon-700 dark:focus:border-gold-400 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-surface-lightText dark:text-white">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-[#120E12] border border-zinc-200 dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white placeholder-zinc-400 focus:outline-none focus:border-maroon-700 dark:focus:border-gold-400 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-surface-lightText dark:text-white">
                Organization / Company Name
              </label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Global Media HQ"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-[#120E12] border border-zinc-200 dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white placeholder-zinc-400 focus:outline-none focus:border-maroon-700 dark:focus:border-gold-400 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-surface-lightText dark:text-white">
                Password (min 8 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-[#120E12] border border-zinc-200 dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white placeholder-zinc-400 focus:outline-none focus:border-maroon-700 dark:focus:border-gold-400 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-maroon-700 via-burgundy-600 to-maroon-800 hover:opacity-95 text-white font-bold text-xs tracking-wider uppercase shadow-luxury hover:shadow-maroon-glow flex items-center justify-center gap-2 border border-gold-400/20 transition-all cursor-pointer"
            >
              <span>{loading ? 'Activating Trial...' : 'Get Instant Access'}</span>
              <ArrowRight className="w-4 h-4 text-gold-300" />
            </button>
          </form>

          {/* Terms & Privacy */}
          <p className="text-[11px] text-zinc-500 dark:text-surface-lightMuted text-center leading-relaxed">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-maroon-700 dark:text-gold-400 font-semibold hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-maroon-700 dark:text-gold-400 font-semibold hover:underline">
              Privacy Policy
            </Link>
            .
          </p>

          {/* Guarantees */}
          <div className="pt-2 border-t border-zinc-100 dark:border-white/5 flex items-center justify-center gap-4 text-[10px] text-zinc-500 dark:text-surface-lightMuted">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> No credit card required
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" /> SOC2 Encrypted
            </span>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto w-full text-center text-xs text-zinc-500 dark:text-surface-lightMuted z-10">
        &copy; {new Date().getFullYear()} SOCIALHUB PRO. All rights reserved.
      </div>
    </div>
  );
}
