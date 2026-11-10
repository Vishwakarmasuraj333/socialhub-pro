'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  RefreshCw,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const { success, error, info } = useToast();

  const email = searchParams.get('email') || '';
  const type = searchParams.get('type') || 'REGISTER';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(60);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    if (pasted.length === 6) {
      inputRefs.current[5]?.focus();
      handleVerify(pasted);
    } else {
      inputRefs.current[pasted.length]?.focus();
    }
  };

  const handleVerify = async (codeToVerify?: string) => {
    const code = codeToVerify || otp.join('');
    if (code.length !== 6) {
      error('Incomplete Code', 'Please enter all 6 digits.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, type }),
      });

      const data = await res.json();
      if (res.ok) {
        success('Verification Succeeded', data.message);
        if (type === 'PASSWORD_RESET') {
          router.push(`/reset-password?token=${data.resetToken}`);
        } else {
          await refreshUser();
          router.push('/dashboard');
        }
      } else {
        error('Verification Failed', data.message);
      }
    } catch (err: any) {
      error('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setResending(true);
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type }),
      });

      const data = await res.json();
      if (res.ok) {
        success('Code Dispatched', data.message);
        setCooldown(60);
      } else {
        error('Error', data.message);
      }
    } catch (err: any) {
      error('Error', err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#100D10] text-[#F5EEF3] flex flex-col justify-between p-6 sm:p-10 relative overflow-hidden">
      <div className="flex items-center justify-between max-w-6xl mx-auto w-full z-10">
        <Logo size="md" href="/" />
        <Link href="/login" className="text-xs font-semibold text-gold-400 hover:underline">
          Return to Login
        </Link>
      </div>

      <div className="max-w-md w-full mx-auto my-auto z-10 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl bg-[#181318]/90 border border-maroon-700/50 shadow-luxury-lg p-8 sm:p-10 space-y-6 backdrop-blur-xl"
        >
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-black text-white tracking-tight font-sans">
              Verify Security Code
            </h1>
            <p className="text-xs text-surface-lightMuted leading-relaxed">
              We dispatched a 6-digit cryptographic verification code to{' '}
              <span className="text-gold-300 font-semibold">{email || 'your email'}</span>.
            </p>
          </div>

          {/* 6 Digit Input Boxes */}
          <div className="flex justify-between gap-2 sm:gap-3 py-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-14 sm:w-13 sm:h-16 text-center text-xl sm:text-2xl font-black rounded-xl bg-[#120E12] border border-surface-darkBorder focus:border-gold-400 text-gold-300 focus:outline-none transition-all shadow-inner"
              />
            ))}
          </div>

          <button
            onClick={() => handleVerify()}
            disabled={loading || otp.join('').length !== 6}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-maroon-700 via-burgundy-600 to-maroon-800 hover:opacity-95 text-white font-semibold text-xs tracking-wider uppercase shadow-luxury hover:shadow-maroon-glow flex items-center justify-center gap-2 border border-gold-400/20 disabled:opacity-40 transition-all"
          >
            <span>{loading ? 'Verifying OTP...' : 'Verify & Continue'}</span>
            <ArrowRight className="w-4 h-4 text-gold-300" />
          </button>

          {/* Resend Cooldown */}
          <div className="flex items-center justify-between text-xs text-surface-lightMuted pt-2">
            <span>Didn&apos;t receive code?</span>
            <button
              onClick={handleResend}
              disabled={cooldown > 0 || resending}
              className={`font-semibold transition-colors ${
                cooldown > 0 ? 'text-surface-lightMuted cursor-not-allowed' : 'text-gold-400 hover:underline'
              }`}
            >
              {resending ? 'Sending...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}
            </button>
          </div>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto w-full text-center text-xs text-surface-lightMuted z-10">
        &copy; {new Date().getFullYear()} SOCIALHUB PRO. Single-use Cryptographic Verification.
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#100D10] flex items-center justify-center text-gold-400 text-xs">Loading Security Gate...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
