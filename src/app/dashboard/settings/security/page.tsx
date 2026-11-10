'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Key,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Laptop,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function SecuritySettingsPage() {
  const { user, refreshUser } = useAuth();
  const { success, error, info } = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);

  const [twoFactor, setTwoFactor] = useState(user?.twoFactorEnabled || false);
  const [toggling2FA, setToggling2FA] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      error('Password Mismatch', 'New password and confirmation do not match.');
      return;
    }

    setChangingPass(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        success('Password Updated', data.message);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        error('Error', data.message);
      }
    } catch (err: any) {
      error('Error', err.message);
    } finally {
      setChangingPass(false);
    }
  };

  const handleToggle2FA = async () => {
    setToggling2FA(true);
    try {
      const newState = !twoFactor;
      const res = await fetch('/api/auth/2fa/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: newState }),
      });

      const data = await res.json();
      if (res.ok) {
        setTwoFactor(newState);
        success('2FA Status Changed', data.message);
        await refreshUser();
      } else {
        error('Error', data.message);
      }
    } catch (err: any) {
      error('Error', err.message);
    } finally {
      setToggling2FA(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-surface-lightText dark:text-surface-lightText dark:text-white tracking-tight font-sans">
          Security &amp; Cryptographic Controls
        </h1>
        <p className="text-xs sm:text-sm text-surface-lightMuted mt-1">
          Two-factor email OTP authentication, session lifecycle, and credential safeguards.
        </p>
      </div>

      {/* 2FA Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gold-400/20 text-gold-400 flex items-center justify-center shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-surface-lightText dark:text-surface-lightText dark:text-white">
              Two-Factor Authentication (Email OTP)
            </h3>
            <p className="text-xs text-surface-lightMuted leading-relaxed mt-1 max-w-md">
              Requires a real, single-use 6-digit cryptographic verification code sent to your registered email on every sign-in attempt.
            </p>
            <div className="mt-2">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  twoFactor
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {twoFactor ? 'Enabled & Enforced' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleToggle2FA}
          disabled={toggling2FA}
          className={`px-5 py-2.5 rounded-xl font-semibold text-xs transition-all ${
            twoFactor
              ? 'bg-surface-darkHover border border-surface-darkBorder text-rose-400 hover:bg-rose-500/10'
              : 'bg-gradient-to-r from-maroon-700 to-burgundy-600 text-white shadow-luxury'
          }`}
        >
          {toggling2FA ? 'Updating...' : twoFactor ? 'Disable 2FA' : 'Enable 2FA'}
        </button>
      </div>

      {/* Password Change Form */}
      <form onSubmit={handleChangePassword} className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 shadow-sm space-y-5">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-gold-400" />
          <h3 className="text-sm font-bold text-surface-lightText dark:text-surface-lightText dark:text-white uppercase tracking-wider font-sans">
            Update Password
          </h3>
        </div>

        <div className="space-y-4 max-w-md">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-surface-lightText dark:text-white">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-lightBg dark:bg-surface-darkBg border border-surface-lightBorder dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white focus:outline-none focus:border-gold-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-surface-lightText dark:text-white">New Password (min 8 chars)</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-lightBg dark:bg-surface-darkBg border border-surface-lightBorder dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white focus:outline-none focus:border-gold-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-surface-lightText dark:text-white">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-lightBg dark:bg-surface-darkBg border border-surface-lightBorder dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white focus:outline-none focus:border-gold-400"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={changingPass}
            className="px-6 py-2.5 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-gold-300 font-semibold text-xs shadow-luxury"
          >
            {changingPass ? 'Updating Hash...' : 'Change Password'}
          </button>
        </div>
      </form>

      {/* Active Sessions */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-surface-lightText dark:text-surface-lightText dark:text-white uppercase tracking-wider font-sans">
          Active Authenticated Sessions
        </h3>

        <div className="p-4 rounded-xl bg-surface-lightBg dark:bg-surface-darkHover/40 border border-surface-lightBorder dark:border-surface-darkBorder/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <Laptop className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="font-bold text-surface-lightText dark:text-white">Current Session (Windows Desktop &bull; Chrome)</p>
              <p className="text-[11px] text-surface-lightMuted">IP: 192.168.1.104 &bull; Signed in recently</p>
            </div>
          </div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
            Active Now
          </span>
        </div>
      </div>
    </div>
  );
}

