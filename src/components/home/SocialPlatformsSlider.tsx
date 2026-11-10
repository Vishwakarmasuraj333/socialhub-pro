'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, Sparkles, ExternalLink } from 'lucide-react';

interface PlatformSlide {
  id: string;
  name: string;
  apiBadge: string;
  scope: string;
  gradient: string;
  glow: string;
  borderColor: string;
  icon: React.ReactNode;
}

export function SocialPlatformsSlider() {
  const platforms: PlatformSlide[] = [
    {
      id: 'instagram',
      name: 'Instagram',
      apiBadge: 'Meta Graph API v19.0',
      scope: 'Reels, Stories, Carousels & Direct Messages',
      gradient: 'from-pink-500 via-rose-500 to-amber-500',
      glow: 'group-hover:shadow-[0_0_30px_rgba(236,72,153,0.35)]',
      borderColor: 'border-pink-500/30',
      icon: (
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      id: 'facebook',
      name: 'Facebook',
      apiBadge: 'Meta Graph API v19.0',
      scope: 'Pages, Video Streams, Insights & Inbox Sync',
      gradient: 'from-blue-600 via-indigo-600 to-blue-800',
      glow: 'group-hover:shadow-[0_0_30px_rgba(59,130,246,0.35)]',
      borderColor: 'border-blue-500/30',
      icon: (
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      id: 'youtube',
      name: 'YouTube',
      apiBadge: 'Google Data API v3',
      scope: 'Shorts, 4K Video Uploads & Channel Metrics',
      gradient: 'from-red-600 via-rose-600 to-red-800',
      glow: 'group-hover:shadow-[0_0_30px_rgba(239,68,68,0.35)]',
      borderColor: 'border-red-500/30',
      icon: (
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      apiBadge: 'Community API v2',
      scope: 'Company Updates, Polls, Documents & Lead Gen',
      gradient: 'from-blue-600 via-sky-600 to-indigo-700',
      glow: 'group-hover:shadow-[0_0_30px_rgba(14,165,233,0.35)]',
      borderColor: 'border-sky-500/30',
      icon: (
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      apiBadge: 'Open Platform API',
      scope: 'Direct Video Publishing, Audio Sync & Analytics',
      gradient: 'from-cyan-500 via-teal-600 to-rose-500',
      glow: 'group-hover:shadow-[0_0_30px_rgba(6,182,212,0.35)]',
      borderColor: 'border-cyan-500/30',
      icon: (
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.5 6.27 6.27 0 0 0 1.86-4.49V8.71a8.21 8.21 0 0 0 4.91 1.63v-3.65z" />
        </svg>
      ),
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      apiBadge: 'X Developer API v2',
      scope: 'Multi-Tweet Threads, Media Uploads & Mentions',
      gradient: 'from-zinc-700 via-zinc-800 to-zinc-950',
      glow: 'group-hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]',
      borderColor: 'border-zinc-500/30',
      icon: (
        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      id: 'pinterest',
      name: 'Pinterest',
      apiBadge: 'Pinterest API v5',
      scope: 'Rich Pins, Secret Boards, Visual Discovery',
      gradient: 'from-red-600 via-rose-700 to-red-900',
      glow: 'group-hover:shadow-[0_0_30px_rgba(244,63,94,0.35)]',
      borderColor: 'border-rose-500/30',
      icon: (
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.374-.053.224-.174.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.624 0 12.017 0z" />
        </svg>
      ),
    },
    {
      id: 'snapchat',
      name: 'Snapchat',
      apiBadge: 'Snap Kit Marketing API',
      scope: 'Story Distribution, Spotlight & AR Lenses',
      gradient: 'from-amber-400 via-yellow-400 to-amber-500',
      glow: 'group-hover:shadow-[0_0_30px_rgba(250,204,21,0.4)]',
      borderColor: 'border-yellow-400/40',
      icon: (
        <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.001 2.25c-3.75 0-6.75 2.876-6.75 6.42 0 1.047.26 2.036.726 2.9-.387.525-1.127.834-1.976.834-.239 0-.465-.025-.678-.073-.131-.03-.27.025-.328.147-.058.122-.016.269.09.349.882.668 2.015 1.077 3.25 1.077.214 0 .425-.012.632-.036.568 1.488 1.942 2.569 3.606 2.836-.61.353-1.458.583-2.428.583-.497 0-.962-.061-1.385-.172-.132-.035-.27.019-.333.138-.063.12-.027.268.077.354 1.144.945 2.651 1.503 4.298 1.503 1.072 0 2.083-.24 2.977-.665.894.425 1.905.665 2.977.665 1.647 0 3.154-.558 4.298-1.503.104-.086.14-.234.077-.354-.063-.119-.201-.173-.333-.138-.423.111-.888.172-1.385.172-.97 0-1.818-.23-2.428-.583 1.664-.267 3.038-1.348 3.606-2.836.207.024.418.036.632.036 1.235 0 2.368-.409 3.25-1.077.106-.08.148-.227.09-.349-.058-.122-.197-.177-.328-.147-.213.048-.439.073-.678.073-.849 0-1.589-.309-1.976-.834.466-.864.726-1.853.726-2.9 0-3.544-3-6.42-6.75-6.42z" />
        </svg>
      ),
    },
    {
      id: 'kick',
      name: 'Kick',
      apiBadge: 'Kick Creator API',
      scope: 'Live Stream Broadcast, Chat & Clips Syndication',
      gradient: 'from-emerald-500 via-green-500 to-emerald-600',
      glow: 'group-hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]',
      borderColor: 'border-emerald-500/40',
      icon: (
        <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 3h5v5h2V6h2V4h7v5h-4v2h4v2h-4v2h4v5h-7v-2h-2v-2H9v5H4V3zm5 8h2v2H9v-2z" />
        </svg>
      ),
    },
  ];

  // Duplicate platforms 3x for a seamless, continuous, infinite loop ticker
  const duplicatedPlatforms = [...platforms, ...platforms, ...platforms];

  return (
    <section className="py-16 border-y border-zinc-200 dark:border-surface-darkBorder/40 bg-zinc-50/70 dark:bg-[#0B080C] relative overflow-hidden transition-colors">
      {/* Subtle Ambient Radial Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[250px] bg-gradient-to-r from-maroon-700/15 via-gold-400/10 to-burgundy-600/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-10 relative z-10">
        {/* Header Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-maroon-100 dark:bg-maroon-900/40 border border-maroon-300 dark:border-gold-400/30 text-maroon-900 dark:text-gold-300 text-[11px] font-bold uppercase tracking-wider shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-maroon-700 dark:text-gold-400" />
          <span>Official Partner Architecture &bull; 100% OAuth 2.0 PKCE</span>
        </div>

        {/* Master Section Heading */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 dark:text-white tracking-tight font-sans">
          Official Direct OAuth 2.0 Integration With Global Networks
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed font-medium">
          Direct cloud connections with Meta, Google, ByteDance, LinkedIn, X, Pinterest, Snapchat, and Kick.
          Zero fragile scrapers, enterprise-grade token rotation, and 99.9% publishing reliability.
        </p>
      </div>

      {/* CONTINUOUS MARQUEE SLIDER ("slider slider hote rhe proepr all do") */}
      <div className="relative w-full overflow-hidden">
        {/* Left Edge Fade Mask */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-44 bg-gradient-to-r from-zinc-50 dark:from-[#0B080C] via-zinc-50/80 dark:via-[#0B080C]/80 to-transparent z-20 pointer-events-none" />

        {/* Right Edge Fade Mask */}
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-44 bg-gradient-to-l from-zinc-50 dark:from-[#0B080C] via-zinc-50/80 dark:via-[#0B080C]/80 to-transparent z-20 pointer-events-none" />

        {/* Sliding Infinite Track */}
        <motion.div
          className="flex items-center gap-5 w-max py-4"
          animate={{
            x: ['0%', '-33.333%'],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {duplicatedPlatforms.map((p, index) => (
            <div
              key={`${p.id}-${index}`}
              className={`group relative p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#161017]/95 border ${p.borderColor} shadow-md hover:shadow-xl ${p.glow} backdrop-blur-xl transition-all duration-300 min-w-[280px] sm:min-w-[320px] max-w-[320px] flex flex-col justify-between cursor-pointer select-none`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${p.gradient} flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform`}
                  >
                    {p.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                        {p.name}
                      </h3>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    </div>
                    <span className="text-[10px] font-bold text-maroon-700 dark:text-gold-400 uppercase tracking-wider block">
                      {p.apiBadge}
                    </span>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[9px] font-bold shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Synced
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-white/5">
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                  {p.scope}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Security Assurance Guarantee Pill */}
      <div className="max-w-7xl mx-auto px-4 mt-8 text-center">
        <div className="inline-flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-700 dark:text-zinc-300 font-semibold">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Automated OAuth 2.0 Token Refresh
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> AES-256 GCM Token Encryption
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Zero Raw Password Storage
          </span>
        </div>
      </div>
    </section>
  );
}
