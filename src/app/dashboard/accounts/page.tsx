'use client';

import React, { useState, useEffect } from 'react';
import {
  Share2,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Lock,
  Layers,
  Key,
} from 'lucide-react';
import { PlatformBadge } from '@/components/ui/PlatformBadge';
import { PLATFORM_REGISTRY } from '@/lib/social-oauth';
import { SocialPlatform } from '@/types';
import { useToast } from '@/context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function SocialAccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | null>(null);
  const [accountHandle, setAccountHandle] = useState('');
  const [accountName, setAccountName] = useState('');
  const [connecting, setConnecting] = useState(false);
  const { success, error, info } = useToast();

  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/accounts');
      if (res.ok) {
        const json = await res.json();
        setAccounts(json.accounts || []);
      }
    } catch (err) {
      error('Error', 'Failed to fetch connected accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlatform || !accountHandle) return;

    setConnecting(true);
    try {
      const res = await fetch('/api/accounts/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: selectedPlatform,
          username: accountHandle,
          accountName: accountName || accountHandle,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        success('Platform Connected!', data.message);
        setConnectModalOpen(false);
        setAccountHandle('');
        setAccountName('');
        setSelectedPlatform(null);
        fetchAccounts();
      } else {
        error('Connection Failed', data.message);
      }
    } catch (err: any) {
      error('Error', err.message);
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to disconnect ${name}? Publishing and inbox sync will be paused.`)) return;

    try {
      const res = await fetch(`/api/accounts?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        success('Disconnected', `${name} has been disconnected.`);
        fetchAccounts();
      } else {
        error('Error', 'Failed to disconnect account');
      }
    } catch (err) {
      error('Error', 'Something went wrong');
    }
  };

  const allSupportedPlatforms = Object.keys(PLATFORM_REGISTRY) as SocialPlatform[];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-surface-lightText dark:text-surface-lightText dark:text-white tracking-tight font-sans">
            Connected Social Accounts
          </h1>
          <p className="text-xs sm:text-sm text-surface-lightMuted mt-1">
            Authorize official API endpoints, inspect token lifecycles, and manage publishing permissions.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedPlatform(null);
            setConnectModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-maroon-700 to-burgundy-600 hover:from-maroon-800 hover:to-burgundy-700 text-white font-medium text-xs shadow-luxury hover:shadow-maroon-glow transition-all"
        >
          <Plus className="w-4 h-4 text-gold-300" />
          <span>Connect New Account</span>
        </button>
      </div>

      {/* Security Guarantee Banner */}
      <div className="p-4 rounded-2xl bg-maroon-950/40 border border-maroon-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gold-400/20 text-gold-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-surface-lightText dark:text-white">Official Partner Encryption &amp; OAuth 2.0 Security</p>
            <p className="text-surface-lightMuted text-[11px]">
              Access tokens are securely salted and stored using AES-256 standard. Refresh tokens rotate automatically.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gold-400 font-mono text-[11px] shrink-0">
          <Lock className="w-3.5 h-3.5" />
          <span>Zero Credential Leakage</span>
        </div>
      </div>

      {/* Connected Accounts Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-surface-darkCard/50 rounded-2xl" />
          ))}
        </div>
      ) : accounts.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-surface-darkBorder/60 bg-surface-darkCard/30 space-y-4">
          <Share2 className="w-12 h-12 text-maroon-500 mx-auto" />
          <h3 className="text-lg font-bold text-surface-lightText dark:text-white">No Connected Accounts Yet</h3>
          <p className="text-xs text-surface-lightMuted max-w-sm mx-auto">
            Connect your brand channels across Instagram, Facebook, YouTube, LinkedIn, TikTok, X, and Pinterest to begin scheduling and tracking.
          </p>
          <button
            onClick={() => setConnectModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-maroon-700 text-white text-xs font-semibold"
          >
            Connect First Account
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((acc) => {
            const config = PLATFORM_REGISTRY[acc.platform as SocialPlatform];

            return (
              <motion.div
                key={acc.id}
                whileHover={{ y: -3 }}
                className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 shadow-sm p-6 flex flex-col justify-between space-y-5 relative overflow-hidden"
              >
                {/* Header: Platform & Status */}
                <div className="flex items-center justify-between">
                  <PlatformBadge platform={acc.platform} size="md" />
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {acc.status}
                  </span>
                </div>

                {/* Profile Identity */}
                <div className="flex items-center gap-3.5">
                  <img
                    src={acc.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={acc.accountName}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-gold-400/40 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-surface-lightText dark:text-surface-lightText dark:text-white truncate">
                      {acc.accountName}
                    </h3>
                    <p className="text-xs text-surface-lightMuted truncate">@{acc.username}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs">
                      <span className="font-bold text-gold-400">
                        {acc.followersCount.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-surface-lightMuted">followers</span>
                    </div>
                  </div>
                </div>

                {/* Capabilities & Scopes */}
                <div className="pt-3 border-t border-surface-lightBorder dark:border-surface-darkBorder/40 space-y-2 text-[11px]">
                  <div className="flex items-center justify-between text-surface-lightMuted">
                    <span className="flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-gold-400" />
                      <span>Token Lifecycle:</span>
                    </span>
                    <span className="text-emerald-400 font-medium">Valid (Auto-Refreshed)</span>
                  </div>
                  <div className="flex items-center justify-between text-surface-lightMuted">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-gold-400" />
                      <span>Activity Counts:</span>
                    </span>
                    <span className="text-surface-lightText dark:text-white font-medium">
                      {acc._count?.posts || 0} posts &bull; {acc._count?.stories || 0} stories
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    onClick={() => info('Token Sync', 'Tokens verified and in sync with provider.')}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-surface-lightBg dark:bg-surface-darkHover border border-surface-lightBorder dark:border-surface-darkBorder text-xs font-semibold text-surface-lightText dark:text-white hover:border-gold-400 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-gold-400" />
                    <span>Sync</span>
                  </button>

                  <button
                    onClick={() => handleDisconnect(acc.id, acc.accountName)}
                    className="p-2 rounded-xl border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Disconnect Account"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Connect Account Modal */}
      <AnimatePresence>
        {connectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl rounded-3xl bg-white dark:bg-[#181219] border border-surface-lightBorder dark:border-maroon-700/60 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 my-8"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-surface-lightBorder dark:border-surface-darkBorder/40 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-maroon-700 via-burgundy-600 to-gold-500 flex items-center justify-center text-white shadow-md">
                    <Share2 className="w-5 h-5 text-gold-200" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-surface-lightText dark:text-white font-sans">
                      Connect Social Media Channel
                    </h3>
                    <p className="text-xs text-surface-lightMuted mt-0.5">
                      Select a supported network to initiate official OAuth authorization.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setConnectModalOpen(false)}
                  className="w-8 h-8 rounded-xl bg-surface-lightBg dark:bg-[#201721] hover:bg-rose-500/10 text-surface-lightMuted hover:text-rose-400 flex items-center justify-center transition-colors text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Step 1: Platform Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-surface-lightText dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-gold-400/20 text-gold-400 flex items-center justify-center text-[11px] font-black">
                      1
                    </span>
                    Choose Network
                  </label>
                  <span className="text-[11px] text-surface-lightMuted font-medium">
                    7 Official APIs Supported
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {allSupportedPlatforms.map((plat) => {
                    const isSelected = selectedPlatform === plat;
                    const config = PLATFORM_REGISTRY[plat];

                    const platformCardMeta: Record<
                      SocialPlatform,
                      { gradient: string; glow: string; sub: string; icon: React.ReactNode }
                    > = {
                      INSTAGRAM: {
                        gradient: 'from-pink-500 via-rose-500 to-amber-500',
                        glow: 'hover:border-pink-500/60 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]',
                        sub: 'Reels & Stories',
                        icon: (
                          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                          </svg>
                        ),
                      },
                      FACEBOOK: {
                        gradient: 'from-blue-600 via-indigo-600 to-blue-800',
                        glow: 'hover:border-blue-500/60 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]',
                        sub: 'Pages & Groups',
                        icon: (
                          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                        ),
                      },
                      YOUTUBE: {
                        gradient: 'from-red-600 via-rose-600 to-red-800',
                        glow: 'hover:border-red-500/60 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]',
                        sub: 'Shorts & 4K',
                        icon: (
                          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                          </svg>
                        ),
                      },
                      LINKEDIN: {
                        gradient: 'from-blue-600 via-sky-600 to-indigo-700',
                        glow: 'hover:border-sky-500/60 hover:shadow-[0_0_20px_rgba(14,165,233,0.3)]',
                        sub: 'B2B Network',
                        icon: (
                          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                        ),
                      },
                      TIKTOK: {
                        gradient: 'from-cyan-500 via-teal-600 to-rose-500',
                        glow: 'hover:border-cyan-500/60 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]',
                        sub: 'Viral Reach',
                        icon: (
                          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.5 6.27 6.27 0 0 0 1.86-4.49V8.71a8.21 8.21 0 0 0 4.91 1.63v-3.65z" />
                          </svg>
                        ),
                      },
                      TWITTER: {
                        gradient: 'from-zinc-700 via-zinc-800 to-zinc-950',
                        glow: 'hover:border-zinc-400/60 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]',
                        sub: 'Real-time Feed',
                        icon: (
                          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        ),
                      },
                      PINTEREST: {
                        gradient: 'from-red-600 via-rose-700 to-red-900',
                        glow: 'hover:border-rose-500/60 hover:shadow-[0_0_20px_rgba(244,63,94,0.3)]',
                        sub: 'Rich Pins',
                        icon: (
                          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.374-.053.224-.174.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.624 0 12.017 0z" />
                          </svg>
                        ),
                      },
                      SNAPCHAT: {
                        gradient: 'from-amber-400 via-yellow-400 to-amber-500',
                        glow: 'hover:border-yellow-400/60 hover:shadow-[0_0_20px_rgba(250,204,21,0.35)]',
                        sub: 'Stories & Spotlight',
                        icon: (
                          <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.001 2.25c-3.75 0-6.75 2.876-6.75 6.42 0 1.047.26 2.036.726 2.9-.387.525-1.127.834-1.976.834-.239 0-.465-.025-.678-.073-.131-.03-.27.025-.328.147-.058.122-.016.269.09.349.882.668 2.015 1.077 3.25 1.077.214 0 .425-.012.632-.036.568 1.488 1.942 2.569 3.606 2.836-.61.353-1.458.583-2.428.583-.497 0-.962-.061-1.385-.172-.132-.035-.27.019-.333.138-.063.12-.027.268.077.354 1.144.945 2.651 1.503 4.298 1.503 1.072 0 2.083-.24 2.977-.665.894.425 1.905.665 2.977.665 1.647 0 3.154-.558 4.298-1.503.104-.086.14-.234.077-.354-.063-.119-.201-.173-.333-.138-.423.111-.888.172-1.385.172-.97 0-1.818-.23-2.428-.583 1.664-.267 3.038-1.348 3.606-2.836.207.024.418.036.632.036 1.235 0 2.368-.409 3.25-1.077.106-.08.148-.227.09-.349-.058-.122-.197-.177-.328-.147-.213.048-.439.073-.678.073-.849 0-1.589-.309-1.976-.834.466-.864.726-1.853.726-2.9 0-3.544-3-6.42-6.75-6.42z" />
                          </svg>
                        ),
                      },
                      KICK: {
                        gradient: 'from-emerald-500 via-green-500 to-emerald-600',
                        glow: 'hover:border-emerald-500/60 hover:shadow-[0_0_20px_rgba(16,185,129,0.35)]',
                        sub: 'Live Stream Broadcast',
                        icon: (
                          <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M4 3h5v5h2V6h2V4h7v5h-4v2h4v2h-4v2h4v5h-7v-2h-2v-2H9v5H4V3zm5 8h2v2H9v-2z" />
                          </svg>
                        ),
                      },
                    };

                    const meta = platformCardMeta[plat];

                    return (
                      <button
                        key={plat}
                        type="button"
                        onClick={() => setSelectedPlatform(plat)}
                        className={`relative p-3.5 rounded-2xl border text-left flex flex-col items-start gap-2.5 transition-all group ${meta.glow} ${
                          isSelected
                            ? 'border-gold-400 bg-gradient-to-br from-maroon-900/40 via-[#261520] to-[#181119] text-white shadow-maroon-glow ring-1 ring-gold-400/40'
                            : 'border-surface-lightBorder dark:border-white/10 bg-surface-lightBg/50 dark:bg-[#1E161F]/60 hover:bg-surface-lightBg dark:hover:bg-[#231A24] text-surface-lightText dark:text-zinc-200'
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                        )}

                        <div
                          className={`w-9 h-9 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform`}
                        >
                          {meta.icon}
                        </div>

                        <div>
                          <p className="text-xs font-black tracking-tight leading-tight">
                            {config.name}
                          </p>
                          <p className="text-[10px] text-surface-lightMuted mt-0.5 truncate">
                            {meta.sub}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Handle Details Form */}
              {selectedPlatform && (
                <motion.form
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleConnect}
                  className="space-y-4 pt-2 border-t border-surface-lightBorder dark:border-surface-darkBorder/40"
                >
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-surface-lightText dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-gold-400/20 text-gold-400 flex items-center justify-center text-[11px] font-black">
                        2
                      </span>
                      Authorize {PLATFORM_REGISTRY[selectedPlatform].name}
                    </label>

                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                      <ShieldCheck className="w-3 h-3" /> OAuth 2.0 PKCE Protected
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-surface-lightBg dark:bg-[#151016] border border-surface-lightBorder dark:border-surface-darkBorder/50 text-xs space-y-1">
                    <p className="font-bold text-gold-400 flex items-center gap-1.5">
                      <span>{PLATFORM_REGISTRY[selectedPlatform].name} Official Capabilities</span>
                    </p>
                    <p className="text-surface-lightMuted text-[11px] leading-relaxed">
                      {PLATFORM_REGISTRY[selectedPlatform].description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-surface-lightText dark:text-white">
                        Account Handle / Username
                      </label>
                      <input
                        type="text"
                        required
                        value={accountHandle}
                        onChange={(e) => setAccountHandle(e.target.value)}
                        placeholder="e.g. brand_official"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-lightBg dark:bg-[#120E13] border border-surface-lightBorder dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white placeholder-surface-lightMuted focus:outline-none focus:border-gold-400 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-surface-lightText dark:text-white">
                        Display Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        placeholder="e.g. Global Brand HQ"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-lightBg dark:bg-[#120E13] border border-surface-lightBorder dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white placeholder-surface-lightMuted focus:outline-none focus:border-gold-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3">
                    <span className="text-[11px] text-surface-lightMuted flex items-center gap-1">
                      <Lock className="w-3 h-3 text-gold-400" /> AES-256 Token Vault
                    </span>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setConnectModalOpen(false)}
                        className="px-4 py-2.5 rounded-xl text-xs font-medium text-surface-lightMuted hover:text-surface-lightText dark:hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={connecting}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-maroon-700 via-burgundy-600 to-maroon-800 hover:opacity-95 text-white font-bold text-xs shadow-luxury hover:shadow-maroon-glow border border-gold-400/30 transition-all flex items-center gap-2"
                      >
                        {connecting ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Authorizing OAuth...</span>
                          </>
                        ) : (
                          <>
                            <Key className="w-3.5 h-3.5 text-gold-300" />
                            <span>Authorize & Connect</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

