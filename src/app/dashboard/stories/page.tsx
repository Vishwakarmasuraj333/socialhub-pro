'use client';

import React, { useState, useEffect } from 'react';
import {
  Camera,
  Plus,
  Play,
  Eye,
  Clock,
  Archive,
  Trash2,
  Sparkles,
  Info,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { PlatformBadge } from '@/components/ui/PlatformBadge';
import { useToast } from '@/context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function StoriesPage() {
  const [categorized, setCategorized] = useState<any>({ active: [], scheduled: [], archived: [] });
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [isPublishNow, setIsPublishNow] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { success, error } = useToast();

  const fetchStories = async () => {
    try {
      const res = await fetch('/api/stories');
      if (res.ok) {
        const json = await res.json();
        setCategorized(json.categorized || { active: [], scheduled: [], archived: [] });
      }
    } catch (err) {
      error('Error', 'Failed to fetch stories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
    fetch('/api/accounts')
      .then((r) => r.json())
      .then((data) => {
        if (data.accounts) {
          // Filter accounts that support stories (Instagram, Facebook, TikTok)
          const supported = data.accounts.filter((a: any) =>
            ['INSTAGRAM', 'FACEBOOK', 'TIKTOK'].includes(a.platform)
          );
          setAccounts(supported);
          if (supported.length > 0) setSelectedAccountId(supported[0].id);
        }
      })
      .catch(() => {});
  }, []);

  const handleCreateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccountId || !mediaUrl) {
      error('Missing Information', 'Select an account and specify a media URL.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          socialAccountId: selectedAccountId,
          mediaUrl,
          caption,
          status: isPublishNow ? 'ACTIVE' : 'SCHEDULED',
          scheduledAt: !isPublishNow && scheduledAt ? new Date(scheduledAt).toISOString() : null,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        success('Story Created', data.message);
        setCreateModalOpen(false);
        setMediaUrl('');
        setCaption('');
        fetchStories();
      } else {
        error('Failed', data.message);
      }
    } catch (err: any) {
      error('Error', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteStory = async (id: string) => {
    if (!confirm('Delete this story?')) return;
    try {
      const res = await fetch(`/api/stories?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        success('Deleted', 'Story deleted successfully.');
        fetchStories();
      }
    } catch (err) {
      error('Error', 'Failed to delete story');
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-surface-lightText dark:text-surface-lightText dark:text-white tracking-tight font-sans">
            Stories &amp; Ephemeral Content
          </h1>
          <p className="text-xs sm:text-sm text-surface-lightMuted mt-1">
            24-hour visual stories, vertical video reels, and scheduled ephemeral announcements.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-maroon-700 to-burgundy-600 hover:from-maroon-800 hover:to-burgundy-700 text-white font-medium text-xs shadow-luxury hover:shadow-maroon-glow transition-all"
        >
          <Plus className="w-4 h-4 text-gold-300" />
          <span>New Story</span>
        </button>
      </div>

      {/* API Capability Notice */}
      <div className="p-4 rounded-2xl bg-surface-lightCard dark:bg-surface-darkCard/60 border border-surface-lightBorder dark:border-surface-darkBorder/60 flex items-start gap-3 text-xs">
        <Info className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-surface-lightText dark:text-surface-lightText dark:text-white">
            Official Platform Story Support Matrix
          </p>
          <p className="text-surface-lightMuted text-[11px] leading-relaxed mt-0.5">
            Meta Graph API officially supports direct 24h story publishing for verified Instagram and Facebook business accounts. TikTok supports vertical creator video sharing. LinkedIn and X currently do not offer public third-party story publishing APIs.
          </p>
        </div>
      </div>

      {/* 1. Active Stories Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <h3 className="text-sm font-bold text-surface-lightText dark:text-surface-lightText dark:text-white uppercase tracking-wider font-sans">
              Active Live Stories ({categorized.active?.length || 0})
            </h3>
          </div>
          <span className="text-xs text-surface-lightMuted">Auto-expires after 24 hours</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[9/16] bg-surface-darkCard/50 rounded-2xl" />
            ))}
          </div>
        ) : categorized.active.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-surface-darkBorder/40 bg-surface-darkCard/20 text-xs text-surface-lightMuted">
            No active stories currently broadcasting.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {categorized.active.map((story: any) => (
              <div
                key={story.id}
                className="group relative aspect-[9/16] rounded-2xl overflow-hidden border border-gold-400/50 shadow-luxury flex flex-col justify-between p-3"
              >
                <img
                  src={story.mediaUrl}
                  alt="Story"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

                {/* Top: Platform & delete */}
                <div className="relative z-10 flex items-center justify-between">
                  <PlatformBadge platform={story.socialAccount?.platform || 'INSTAGRAM'} size="sm" showLabel={false} />
                  <button
                    onClick={() => handleDeleteStory(story.id)}
                    className="p-1 rounded-md bg-black/60 text-white/70 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Bottom: Caption & Views */}
                <div className="relative z-10 space-y-1">
                  {story.caption && (
                    <p className="text-[11px] text-surface-lightText dark:text-white line-clamp-2 leading-tight">
                      {story.caption}
                    </p>
                  )}
                  <div className="flex items-center gap-1.5 text-[10px] text-gold-300 font-bold">
                    <Eye className="w-3 h-3" />
                    <span>{story.viewsCount?.toLocaleString()} views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Scheduled Stories */}
      <div className="space-y-4 pt-4">
        <h3 className="text-sm font-bold text-surface-lightText dark:text-surface-lightText dark:text-white uppercase tracking-wider font-sans">
          Scheduled Stories Queue ({categorized.scheduled?.length || 0})
        </h3>
        {categorized.scheduled?.length === 0 ? (
          <p className="text-xs text-surface-lightMuted">No stories in scheduled queue.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {categorized.scheduled.map((story: any) => (
              <div
                key={story.id}
                className="relative aspect-[9/16] rounded-2xl overflow-hidden border border-amber-500/40 p-3 flex flex-col justify-between"
              >
                <img src={story.mediaUrl} alt="Scheduled Story" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60" />
                <div className="relative z-10 flex items-center justify-between">
                  <PlatformBadge platform={story.socialAccount?.platform || 'INSTAGRAM'} size="sm" showLabel={false} />
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                    Scheduled
                  </span>
                </div>
                <div className="relative z-10 text-[10px] text-white">
                  <Clock className="w-3 h-3 inline mr-1 text-gold-400" />
                  {story.scheduledAt ? new Date(story.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Upcoming'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Archived Stories */}
      <div className="space-y-4 pt-4">
        <h3 className="text-sm font-bold text-surface-lightText dark:text-surface-lightText dark:text-white uppercase tracking-wider font-sans">
          Archived Stories ({categorized.archived?.length || 0})
        </h3>
        {categorized.archived?.length === 0 ? (
          <p className="text-xs text-surface-lightMuted">No archived stories.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {categorized.archived.map((story: any) => (
              <div
                key={story.id}
                className="relative aspect-[9/16] rounded-2xl overflow-hidden border border-surface-darkBorder/40 p-3 flex flex-col justify-between opacity-80 hover:opacity-100 transition-opacity"
              >
                <img src={story.mediaUrl} alt="Archived Story" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60" />
                <div className="relative z-10 flex items-center justify-between">
                  <PlatformBadge platform={story.socialAccount?.platform || 'INSTAGRAM'} size="sm" showLabel={false} />
                  <Archive className="w-3.5 h-3.5 text-surface-lightMuted" />
                </div>
                <div className="relative z-10 text-[10px] text-gold-300 font-semibold">
                  {story.viewsCount?.toLocaleString()} total views
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Story Modal */}
      <AnimatePresence>
        {createModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#1A141A] border border-maroon-700/60 p-6 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-surface-lightBorder dark:border-surface-darkBorder/40 pb-4">
                <h3 className="text-base font-bold text-surface-lightText dark:text-surface-lightText dark:text-white font-sans">
                  Publish or Schedule Story
                </h3>
                <button onClick={() => setCreateModalOpen(false)} className="text-surface-lightMuted hover:text-surface-lightText dark:hover:text-white">
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateStory} className="space-y-4">
                {/* Account Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-surface-lightText dark:text-white">
                    Select Channel
                  </label>
                  <select
                    value={selectedAccountId}
                    onChange={(e) => setSelectedAccountId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-lightBg dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white focus:outline-none focus:border-gold-400"
                  >
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.platform} - @{a.username}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Media URL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-surface-lightText dark:text-white">
                    Vertical Media Image/Video URL (9:16)
                  </label>
                  <input
                    type="url"
                    required
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-lightBg dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white placeholder-surface-lightMuted focus:outline-none focus:border-gold-400"
                  />
                </div>

                {/* Caption */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-surface-lightText dark:text-white">
                    Story Caption &amp; Stickers
                  </label>
                  <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Add text overlay or link prompt..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-lightBg dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white placeholder-surface-lightMuted focus:outline-none focus:border-gold-400"
                  />
                </div>

                {/* Timing */}
                <div className="flex items-center gap-4 pt-2">
                  <label className="flex items-center gap-2 text-xs text-surface-lightText dark:text-white cursor-pointer">
                    <input
                      type="radio"
                      name="timing"
                      checked={isPublishNow}
                      onChange={() => setIsPublishNow(true)}
                    />
                    <span>Publish Immediately</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-surface-lightText dark:text-white cursor-pointer">
                    <input
                      type="radio"
                      name="timing"
                      checked={!isPublishNow}
                      onChange={() => setIsPublishNow(false)}
                    />
                    <span>Schedule for Later</span>
                  </label>
                </div>

                {!isPublishNow && (
                  <input
                    type="datetime-local"
                    required
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-lightBg dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white"
                  />
                )}

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-surface-lightMuted hover:text-surface-lightText dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-maroon-700 to-burgundy-600 text-white font-medium text-xs shadow-luxury"
                  >
                    {submitting ? 'Broadcasting...' : isPublishNow ? 'Post Story Now' : 'Schedule Story'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

