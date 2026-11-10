'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  href?: string;
  className?: string;
}

export function Logo({ size = 'md', showTagline = false, href = '/', className = '' }: LogoProps) {
  const sizeMap = {
    sm: { icon: 'w-7 h-7 text-xs', text: 'text-lg', badge: 'text-[9px] px-1 py-0.2' },
    md: { icon: 'w-9 h-9 text-sm', text: 'text-xl', badge: 'text-[10px] px-1.5 py-0.5' },
    lg: { icon: 'w-12 h-12 text-base', text: 'text-2xl', badge: 'text-xs px-2 py-0.5' },
    xl: { icon: 'w-16 h-16 text-xl', text: 'text-3xl', badge: 'text-sm px-2.5 py-1' },
  };

  const currentSize = sizeMap[size];

  const content = (
    <div className={`flex items-center gap-3 select-none group ${className}`}>
      {/* Emblem */}
      <motion.div
        whileHover={{ scale: 1.05, rotate: 2 }}
        whileTap={{ scale: 0.95 }}
        className={`relative ${currentSize.icon} rounded-xl bg-gradient-to-br from-maroon-600 via-maroon-700 to-maroon-900 border border-gold-400/40 shadow-luxury flex items-center justify-center overflow-hidden shrink-0`}
      >
        {/* Ambient gold glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(214,179,106,0.35),transparent_70%)]" />
        {/* Geometric luxury lines */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-300 to-transparent opacity-80" />
        <span className="relative font-black tracking-tighter text-gold-300 font-sans">
          S<span className="text-white">H</span>
        </span>
      </motion.div>

      {/* Wordmark */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-tight text-surface-lightText dark:text-white ${currentSize.text} font-sans`}>
            SOCIAL<span className="bg-gradient-to-r from-maroon-600 to-burgundy-500 bg-clip-text text-maroon-600 dark:text-maroon-400">HUB</span>
          </span>
          <span className={`rounded-md bg-gradient-to-r from-gold-400 to-gold-600 font-bold uppercase tracking-wider text-black shadow-sm ${currentSize.badge}`}>
            PRO
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] font-semibold tracking-wide text-zinc-600 dark:text-zinc-400 uppercase mt-0.5">
            Enterprise Social Suite
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}

