'use client';

import React from 'react';
import { SocialPlatform } from '@/types';
import {
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Share2,
  Twitter,
  Pin,
} from 'lucide-react';

interface PlatformBadgeProps {
  platform: SocialPlatform | string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function PlatformBadge({
  platform,
  size = 'md',
  showLabel = true,
  className = '',
}: PlatformBadgeProps) {
  const plat = platform.toUpperCase() as SocialPlatform;

  const config: Record<
    SocialPlatform,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    INSTAGRAM: {
      label: 'Instagram',
      bg: 'bg-gradient-to-r from-pink-500/15 via-rose-500/15 to-amber-500/15',
      text: 'text-rose-400',
      border: 'border-rose-500/30',
      icon: <Instagram className="w-4 h-4 text-pink-500" />,
    },
    FACEBOOK: {
      label: 'Facebook',
      bg: 'bg-blue-600/15',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
      icon: <Facebook className="w-4 h-4 text-blue-500" />,
    },
    YOUTUBE: {
      label: 'YouTube',
      bg: 'bg-red-600/15',
      text: 'text-red-400',
      border: 'border-red-500/30',
      icon: <Youtube className="w-4 h-4 text-red-500" />,
    },
    LINKEDIN: {
      label: 'LinkedIn',
      bg: 'bg-sky-600/15',
      text: 'text-sky-400',
      border: 'border-sky-500/30',
      icon: <Linkedin className="w-4 h-4 text-sky-500" />,
    },
    TIKTOK: {
      label: 'TikTok',
      bg: 'bg-cyan-500/15',
      text: 'text-cyan-400',
      border: 'border-cyan-500/30',
      icon: <Share2 className="w-4 h-4 text-cyan-400" />,
    },
    TWITTER: {
      label: 'X (Twitter)',
      bg: 'bg-zinc-700/20',
      text: 'text-zinc-200',
      border: 'border-zinc-600/30',
      icon: <Twitter className="w-4 h-4 text-zinc-300" />,
    },
    PINTEREST: {
      label: 'Pinterest',
      bg: 'bg-red-700/15',
      text: 'text-red-400',
      border: 'border-red-600/30',
      icon: <Pin className="w-4 h-4 text-red-500" />,
    },
    SNAPCHAT: {
      label: 'Snapchat',
      bg: 'bg-yellow-400/15',
      text: 'text-yellow-500 dark:text-yellow-400',
      border: 'border-yellow-400/40',
      icon: <Share2 className="w-4 h-4 text-yellow-500" />,
    },
    KICK: {
      label: 'Kick',
      bg: 'bg-emerald-500/15',
      text: 'text-emerald-500 dark:text-emerald-400',
      border: 'border-emerald-500/40',
      icon: <Share2 className="w-4 h-4 text-emerald-500" />,
    },
  };

  const item = config[plat] || {
    label: platform,
    bg: 'bg-maroon-700/20',
    text: 'text-gold-400',
    border: 'border-maroon-600/30',
    icon: <Share2 className="w-4 h-4 text-gold-400" />,
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-2',
    lg: 'text-sm px-3.5 py-1.5 gap-2.5',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border backdrop-blur-sm ${item.bg} ${item.text} ${item.border} ${sizeClasses[size]} ${className}`}
    >
      {item.icon}
      {showLabel && <span>{item.label}</span>}
    </span>
  );
}

