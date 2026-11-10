'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { error, info } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      if (result.requires2FA) {
        info('Two-Factor Required', 'Please enter your verification code.');
        router.push(`/verify-otp?email=${encodeURIComponent(email)}&type=LOGIN_2FA`);
      } else {
        router.push('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-surface-lightBg dark:bg-[#100D10] text-surface-lightText dark:text-[#F5EEF3] flex flex-col justify-between p-6 sm:p-10 relative overflow-hidden transition-colors">
      {/* Ambient luxury glow background */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-maroon-700/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between max-w-6xl mx-auto w-full z-10">
        <Logo size="md" href="/" />
        <Link
          href="/register"
          className="text-xs font-semibold text-maroon-700 dark:text-gold-400 hover:underline transition-colors"
        >
          Don&apos;t have an account? <span className="underline">Sign Up</span>
        </Link>
      </div>

      {/* Center Form Card */}
      <div className="max-w-md w-full mx-auto my-auto z-10 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-white dark:bg-[#181318]/90 border border-surface-lightBorder dark:border-maroon-700/50 shadow-luxury-lg p-8 sm:p-10 space-y-6 backdrop-blur-xl"
        >
          {/* Header */}
          <div className="space-y-1.5 text-center">
            <h1 className="text-2xl font-black text-surface-lightText dark:text-white tracking-tight font-sans">
              Welcome Back
            </h1>
            <p className="text-xs text-zinc-500 dark:text-surface-lightMuted">
              Sign in to access your omnichannel command center.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-surface-lightText dark:text-white">
                Work Email Address
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
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-surface-lightText dark:text-white">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] text-maroon-700 dark:text-gold-400 font-medium hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
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
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4 text-gold-300" />
            </button>
          </form>

          {/* Security footnote */}
          <div className="pt-2 border-t border-zinc-100 dark:border-white/5 flex items-center justify-center gap-2 text-xs text-zinc-500 dark:text-surface-lightMuted">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>256-Bit Cryptographic TLS &bull; Single-Device Audit Trail</span>
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
