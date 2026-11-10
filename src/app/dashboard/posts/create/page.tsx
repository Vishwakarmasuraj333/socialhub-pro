'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Send,
  Calendar,
  Image as ImageIcon,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Hash,
  AtSign,
  Share2,
  Trash2,
  ExternalLink,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { PlatformBadge } from '@/components/ui/PlatformBadge';
import { PLATFORM_REGISTRY } from '@/lib/social-oauth';
import { SocialPlatform } from '@/types';
import { useToast } from '@/context/ToastContext';

export default function CreatePostPage() {
  const router = useRouter();
  const { success, error, info } = useToast();

  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [mediaUrls, setMediaUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
  ]);
  const [mediaInput, setMediaInput] = useState('');
  const [postMode, setPostMode] = useState<'NOW' | 'SCHEDULE' | 'DRAFT' | 'APPROVAL'>('NOW');
  const [scheduledDateTime, setScheduledDateTime] = useState('');
  const [activePreviewPlatform, setActivePreviewPlatform] = useState<SocialPlatform>('INSTAGRAM');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/accounts')
      .then((r) => r.json())
      .then((data) => {
        if (data.accounts) {
          setAccounts(data.accounts);
          // Select all accounts by default
          setSelectedAccountIds(data.accounts.map((a: any) => a.id));
        }
      })
      .catch(() => {});
  }, []);

  const toggleAccountSelection = (id: string) => {
    setSelectedAccountIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddMedia = () => {
    if (!mediaInput.trim()) return;
    setMediaUrls((prev) => [...prev, mediaInput.trim()]);
    setMediaInput('');
    info('Media Attached', 'Image attached to post studio.');
  };

  const handleRemoveMedia = (index: number) => {
    setMediaUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const insertHashtags = (tag: string) => {
    setContent((prev) => (prev ? `${prev} ${tag}` : tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() && mediaUrls.length === 0) {
      error('Validation Error', 'Post content or at least one media image is required.');
      return;
    }

    if (selectedAccountIds.length === 0) {
      error('Validation Error', 'Please select at least one social media channel.');
      return;
    }

    if (postMode === 'SCHEDULE' && !scheduledDateTime) {
      error('Validation Error', 'Please select a scheduled date and time.');
      return;
    }

    setSubmitting(true);

    let status = 'DRAFT';
    if (postMode === 'NOW') status = 'PUBLISHED';
    if (postMode === 'SCHEDULE') status = 'SCHEDULED';
    if (postMode === 'APPROVAL') status = 'PENDING_APPROVAL';

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          hashtags,
          mediaUrls,
          status,
          scheduledAt: postMode === 'SCHEDULE' ? new Date(scheduledDateTime).toISOString() : null,
          socialAccountIds: selectedAccountIds,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        success('Success!', data.message);
        router.push('/dashboard/posts');
      } else {
        error('Error', data.message || 'Failed to submit post');
      }
    } catch (err: any) {
      error('Submission Failed', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedAccounts = accounts.filter((a) => selectedAccountIds.includes(a.id));
  const characterLimits = {
    TWITTER: 280,
    INSTAGRAM: 2200,
    LINKEDIN: 3000,
    FACEBOOK: 63206,
    TIKTOK: 2200,
    PINTEREST: 500,
    YOUTUBE: 5000,
  };

  const currentLimit = characterLimits[activePreviewPlatform] || 2200;
  const isOverLimit = content.length > currentLimit;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-surface-lightText dark:text-surface-lightText dark:text-white tracking-tight font-sans">
            Post Creation Studio
          </h1>
          <p className="text-xs sm:text-sm text-surface-lightMuted mt-1">
            Compose omnichannel posts with live preview simulators and smart validation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form (7 Cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          {/* 1. Account Picker */}
          <div className="p-5 rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 shadow-sm space-y-3">
            <label className="text-xs font-bold text-surface-lightText dark:text-white uppercase tracking-wider block font-sans">
              1. Select Channels to Publish
            </label>
            <div className="flex flex-wrap gap-2.5">
              {accounts.map((acc) => {
                const isSelected = selectedAccountIds.includes(acc.id);
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => toggleAccountSelection(acc.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'border-gold-400 bg-maroon-900/40 text-gold-300 shadow-sm'
                        : 'border-surface-lightBorder dark:border-surface-darkBorder text-surface-lightMuted hover:text-surface-lightText dark:hover:text-white'
                    }`}
                  >
                    <PlatformBadge platform={acc.platform} size="sm" showLabel={false} />
                    <span>@{acc.username}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Content Composer */}
          <div className="p-5 rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-surface-lightText dark:text-white uppercase tracking-wider font-sans">
                2. Caption &amp; Content
              </label>
              <span
                className={`text-xs font-mono ${
                  isOverLimit ? 'text-rose-400 font-bold' : 'text-surface-lightMuted'
                }`}
              >
                {content.length} / {currentLimit} chars ({activePreviewPlatform})
              </span>
            </div>

            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What would you like to share with your audience? Mention brands with @ or hashtags with #..."
              className="w-full p-4 rounded-xl bg-surface-lightBg dark:bg-surface-darkBg border border-surface-lightBorder dark:border-surface-darkBorder text-sm text-surface-lightText dark:text-surface-lightText dark:text-white placeholder-surface-lightMuted focus:outline-none focus:border-gold-400 transition-all leading-relaxed"
            />

            {/* Smart Hashtag Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-surface-lightMuted flex items-center gap-1 mr-1">
                <Sparkles className="w-3 h-3 text-gold-400" /> Suggestions:
              </span>
              {['#EnterpriseMarketing', '#GrowthStrategy', '#SocialSaaS', '#Innovation', '#Omnichannel'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => insertHashtags(tag)}
                  className="px-2 py-0.5 rounded-md bg-surface-lightBg dark:bg-surface-darkHover border border-surface-lightBorder dark:border-surface-darkBorder/60 text-[10px] text-gold-400 hover:border-gold-400 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Media Upload & Attachments */}
          <div className="p-5 rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 shadow-sm space-y-3">
            <label className="text-xs font-bold text-surface-lightText dark:text-white uppercase tracking-wider font-sans block">
              3. Visual Attachments
            </label>

            <div className="flex gap-2">
              <input
                type="url"
                value={mediaInput}
                onChange={(e) => setMediaInput(e.target.value)}
                placeholder="Paste image or video URL (https://...)"
                className="flex-1 px-3.5 py-2 rounded-xl bg-surface-lightBg dark:bg-surface-darkBg border border-surface-lightBorder dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white placeholder-surface-lightMuted focus:outline-none focus:border-gold-400"
              />
              <button
                type="button"
                onClick={handleAddMedia}
                className="px-4 py-2 rounded-xl bg-surface-lightBg dark:bg-surface-darkHover border border-surface-lightBorder dark:border-surface-darkBorder text-xs font-semibold text-gold-400 hover:border-gold-400"
              >
                Attach
              </button>
            </div>

            {/* Media Gallery Previews */}
            {mediaUrls.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
                {mediaUrls.map((url, index) => (
                  <div key={index} className="relative group rounded-xl overflow-hidden border border-maroon-700/40 aspect-square">
                    <img src={url} alt="Attached" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(index)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/70 text-rose-400 hover:bg-rose-500 hover:text-surface-lightText dark:hover:text-white transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. Scheduling & Workflow Options */}
          <div className="p-5 rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 shadow-sm space-y-4">
            <label className="text-xs font-bold text-surface-lightText dark:text-white uppercase tracking-wider font-sans block">
              4. Publishing Action
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPostMode('NOW')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                  postMode === 'NOW'
                    ? 'border-gold-400 bg-maroon-900/40 text-gold-300'
                    : 'border-surface-lightBorder dark:border-surface-darkBorder text-surface-lightMuted hover:text-surface-lightText dark:hover:text-white'
                }`}
              >
                Publish Now
              </button>

              <button
                type="button"
                onClick={() => setPostMode('SCHEDULE')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                  postMode === 'SCHEDULE'
                    ? 'border-gold-400 bg-maroon-900/40 text-gold-300'
                    : 'border-surface-lightBorder dark:border-surface-darkBorder text-surface-lightMuted hover:text-surface-lightText dark:hover:text-white'
                }`}
              >
                Schedule Date
              </button>

              <button
                type="button"
                onClick={() => setPostMode('APPROVAL')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                  postMode === 'APPROVAL'
                    ? 'border-gold-400 bg-maroon-900/40 text-gold-300'
                    : 'border-surface-lightBorder dark:border-surface-darkBorder text-surface-lightMuted hover:text-surface-lightText dark:hover:text-white'
                }`}
              >
                Team Approval
              </button>

              <button
                type="button"
                onClick={() => setPostMode('DRAFT')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                  postMode === 'DRAFT'
                    ? 'border-gold-400 bg-maroon-900/40 text-gold-300'
                    : 'border-surface-lightBorder dark:border-surface-darkBorder text-surface-lightMuted hover:text-surface-lightText dark:hover:text-white'
                }`}
              >
                Save as Draft
              </button>
            </div>

            {postMode === 'SCHEDULE' && (
              <div className="pt-2">
                <label className="text-xs text-surface-lightMuted block mb-1.5">
                  Select Publishing Date &amp; Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={scheduledDateTime}
                  onChange={(e) => setScheduledDateTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-lightBg dark:bg-surface-darkBg border border-surface-lightBorder dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white focus:outline-none focus:border-gold-400"
                />
              </div>
            )}
          </div>

          {/* Submit CTA */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.push('/dashboard/posts')}
              className="px-5 py-2.5 rounded-xl text-xs font-medium text-surface-lightMuted hover:text-surface-lightText dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || isOverLimit}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-maroon-700 to-burgundy-600 hover:from-maroon-800 hover:to-burgundy-700 text-white font-semibold text-xs shadow-luxury hover:shadow-maroon-glow disabled:opacity-50 transition-all"
            >
              <Send className="w-4 h-4 text-gold-300" />
              <span>
                {submitting
                  ? 'Processing...'
                  : postMode === 'NOW'
                  ? 'Publish Immediately'
                  : postMode === 'SCHEDULE'
                  ? 'Confirm Schedule'
                  : postMode === 'APPROVAL'
                  ? 'Submit for Approval'
                  : 'Save Draft'}
              </span>
            </button>
          </div>
        </form>

        {/* Right Preview Simulator (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-gold-400" />
              <h3 className="text-xs font-bold text-surface-lightText dark:text-surface-lightText dark:text-white uppercase tracking-wider font-sans">
                Live Feed Simulator
              </h3>
            </div>

            {/* Preview Platform Switcher */}
            <div className="flex items-center gap-1">
              {(['INSTAGRAM', 'LINKEDIN', 'TWITTER'] as SocialPlatform[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setActivePreviewPlatform(p)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                    activePreviewPlatform === p
                      ? 'bg-gold-400 text-black font-extrabold'
                      : 'text-surface-lightMuted hover:text-surface-lightText dark:hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Simulated Card */}
          <div className="rounded-2xl bg-white dark:bg-[#181318] border border-surface-lightBorder dark:border-surface-darkBorder shadow-luxury-lg overflow-hidden">
            {/* Simulator Header */}
            <div className="p-4 flex items-center justify-between border-b border-surface-lightBorder dark:border-surface-darkBorder/40">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                  alt="Apex Official"
                  className="w-10 h-10 rounded-full object-cover border border-gold-400/50"
                />
                <div>
                  <h4 className="text-xs font-bold text-surface-lightText dark:text-surface-lightText dark:text-white">
                    Apex Brand Official
                  </h4>
                  <p className="text-[10px] text-surface-lightMuted">
                    {activePreviewPlatform === 'TWITTER' ? '@ApexGlobalNow' : 'Sponsored &bull; 1m ago'}
                  </p>
                </div>
              </div>
              <PlatformBadge platform={activePreviewPlatform} size="sm" showLabel={false} />
            </div>

            {/* Media Image */}
            {mediaUrls.length > 0 && (
              <div className="w-full aspect-video bg-black overflow-hidden">
                <img src={mediaUrls[0]} alt="Simulator" className="w-full h-full object-cover" />
              </div>
            )}

            {/* Caption Text */}
            <div className="p-4 space-y-2">
              <p className="text-xs text-surface-lightText dark:text-surface-lightText dark:text-white leading-relaxed whitespace-pre-line">
                {content || 'Your composed content will appear here in real-time as you type...'}
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-surface-lightBorder dark:border-surface-darkBorder/30 text-surface-lightMuted text-xs">
                <span>❤️ 1.2k</span>
                <span>💬 48 comments</span>
                <span>↗️ 19 shares</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

