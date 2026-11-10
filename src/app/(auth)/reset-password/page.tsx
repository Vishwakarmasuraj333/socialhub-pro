'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { useToast } from '@/context/ToastContext';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetToken = searchParams.get('token') || '';
  const { success, error } = useToast();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetToken) {
      error('Invalid Token', 'Reset token is missing or expired.');
      return;
    }

    if (newPassword !== confirmPassword) {
      error('Mismatch', 'Passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      error('Password Too Short', 'Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        success('Password Changed!', data.message);
        router.push('/login');
      } else {
        error('Reset Failed', data.message);
      }
    } catch (err: any) {
      error('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#100D10] text-[#F5EEF3] flex flex-col justify-between p-6 sm:p-10 relative overflow-hidden">
      <div className="flex items-center justify-between max-w-6xl mx-auto w-full z-10">
        <Logo size="md" href="/" />
        <Link href="/login" className="text-xs font-semibold text-gold-400 hover:underline">
          Return to Sign In
        </Link>
      </div>

      <div className="max-w-md w-full mx-auto my-auto z-10 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-[#181318]/90 border border-maroon-700/50 shadow-luxury-lg p-8 sm:p-10 space-y-6 backdrop-blur-xl"
        >
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-black text-white tracking-tight font-sans">
              Set New Password
            </h1>
            <p className="text-xs text-surface-lightMuted leading-relaxed">
              Create a secure passphrase for your enterprise administrator account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-surface-lightMuted" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#120E12] border border-surface-darkBorder text-xs text-white placeholder-surface-lightMuted focus:outline-none focus:border-gold-400 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-surface-lightMuted" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#120E12] border border-surface-darkBorder text-xs text-white placeholder-surface-lightMuted focus:outline-none focus:border-gold-400 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-maroon-700 via-burgundy-600 to-maroon-800 hover:opacity-95 text-white font-semibold text-xs tracking-wider uppercase shadow-luxury flex items-center justify-center gap-2 border border-gold-400/20 transition-all"
            >
              <span>{loading ? 'Updating Credentials...' : 'Save & Sign In'}</span>
              <ArrowRight className="w-4 h-4 text-gold-300" />
            </button>
          </form>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto w-full text-center text-xs text-surface-lightMuted z-10">
        &copy; {new Date().getFullYear()} SOCIALHUB PRO.
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#100D10] flex items-center justify-center text-gold-400 text-xs">Loading Security Gate...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
