'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Send,
  Plus,
  Search,
  Filter,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  FileEdit,
  Repeat,
  Eye,
  Heart,
  MessageCircle,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { PlatformBadge } from '@/components/ui/PlatformBadge';
import { useToast } from '@/context/ToastContext';
import { motion } from 'framer-motion';

export default function PostManagementPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const { success, error, info } = useToast();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      if (searchQuery) params.set('search', searchQuery);

      const res = await fetch(`/api/posts?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setPosts(json.posts || []);
      }
    } catch (err) {
      error('Error', 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [statusFilter, searchQuery]);

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await fetch(`/api/posts?id=${postId}`, { method: 'DELETE' });
      if (res.ok) {
        success('Deleted', 'Post successfully deleted.');
        fetchPosts();
      } else {
        error('Error', 'Failed to delete post');
      }
    } catch (err) {
      error('Error', 'Failed to delete post');
    }
  };

  const handlePublishNow = async (postId: string) => {
    try {
      const res = await fetch('/api/posts/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });

      if (res.ok) {
        success('Published!', 'Post published immediately across all connected channels.');
        fetchPosts();
      } else {
        error('Publish Failed', 'Could not publish post');
      }
    } catch (err) {
      error('Error', 'Network error');
    }
  };

  const handleDuplicate = (post: any) => {
    info('Duplicate', `Copied content from post to clipboard.`);
    navigator.clipboard?.writeText(post.content);
  };

  const statusTabs = [
    { label: 'All Posts', value: 'ALL' },
    { label: 'Published', value: 'PUBLISHED' },
    { label: 'Scheduled', value: 'SCHEDULED' },
    { label: 'Drafts', value: 'DRAFT' },
    { label: 'Pending Approval', value: 'PENDING_APPROVAL' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-surface-lightText dark:text-surface-lightText dark:text-white tracking-tight font-sans">
            Post Management Studio
          </h1>
          <p className="text-xs sm:text-sm text-surface-lightMuted mt-1">
            Author, schedule, review, and track content campaigns across all networks.
          </p>
        </div>

        <Link
          href="/dashboard/posts/create"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-maroon-700 to-burgundy-600 hover:from-maroon-800 hover:to-burgundy-700 text-white font-medium text-xs shadow-luxury hover:shadow-maroon-glow transition-all"
        >
          <Plus className="w-4 h-4 text-gold-300" />
          <span>Compose New Post</span>
        </Link>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-2 rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 shadow-sm">
        {/* Status Pills */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto p-1">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === tab.value
                  ? 'bg-maroon-700 text-white shadow-sm'
                  : 'text-surface-lightMuted hover:text-surface-lightText dark:hover:text-white hover:bg-surface-darkHover'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-surface-lightMuted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts or tags..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface-lightBg dark:bg-surface-darkBg border border-surface-lightBorder dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white placeholder-surface-lightMuted focus:outline-none focus:border-gold-400"
          />
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 bg-surface-darkCard/50 rounded-2xl" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-surface-darkBorder/60 bg-surface-darkCard/30 space-y-4">
          <Send className="w-12 h-12 text-maroon-500 mx-auto" />
          <h3 className="text-lg font-bold text-surface-lightText dark:text-white">No Posts Found</h3>
          <p className="text-xs text-surface-lightMuted max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'ALL'
              ? 'Try adjusting your filters or search keywords.'
              : 'Create your first multi-platform post in our intuitive studio.'}
          </p>
          <Link
            href="/dashboard/posts/create"
            className="inline-block px-4 py-2 rounded-xl bg-maroon-700 text-white text-xs font-semibold"
          >
            Compose Post
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const media = post.mediaUrls ? JSON.parse(post.mediaUrls) : [];
            const platforms = post.socialAccounts?.map((sa: any) => sa.socialAccount?.platform) || [];

            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                {/* Left: Thumbnail & Details */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {media[0] && (
                    <img
                      src={media[0]}
                      alt="Post attachment"
                      className="w-20 h-20 rounded-xl object-cover border border-gold-400/30 shrink-0"
                    />
                  )}

                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Status & Platforms */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          post.status === 'PUBLISHED'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : post.status === 'SCHEDULED'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : post.status === 'PENDING_APPROVAL'
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                            : 'bg-zinc-500/10 text-zinc-300 border-zinc-500/30'
                        }`}
                      >
                        {post.status.replace(/_/g, ' ')}
                      </span>

                      {platforms.map((plat: string) => (
                        <PlatformBadge key={plat} platform={plat} size="sm" />
                      ))}
                    </div>

                    {/* Content */}
                    <p className="text-xs sm:text-sm text-surface-lightText dark:text-surface-lightText dark:text-white leading-relaxed line-clamp-3">
                      {post.content}
                    </p>

                    {/* Metadata: Author & Time */}
                    <div className="flex items-center gap-4 text-[11px] text-surface-lightMuted">
                      <span>By {post.user?.name || 'Admin'}</span>
                      {post.publishedAt && (
                        <span>Published: {new Date(post.publishedAt).toLocaleString()}</span>
                      )}
                      {post.scheduledAt && (
                        <span className="text-amber-400 font-medium">
                          Scheduled: {new Date(post.scheduledAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Metrics & Actions */}
                <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-surface-lightBorder dark:border-surface-darkBorder/40">
                  {post.analytics && post.status === 'PUBLISHED' ? (
                    <div className="flex items-center gap-3 text-xs">
                      <div className="text-right">
                        <span className="font-bold text-gold-400 block">{post.analytics.impressions.toLocaleString()}</span>
                        <span className="text-[10px] text-surface-lightMuted">Impressions</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-surface-lightText dark:text-white block">{post.analytics.likes.toLocaleString()}</span>
                        <span className="text-[10px] text-surface-lightMuted">Likes</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-right text-xs text-surface-lightMuted">
                      {post.status === 'SCHEDULED' ? 'Awaiting automatic trigger' : 'Draft pending edits'}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {post.status !== 'PUBLISHED' && (
                      <button
                        onClick={() => handlePublishNow(post.id)}
                        className="px-3 py-1.5 rounded-lg bg-maroon-700 hover:bg-maroon-800 text-gold-300 font-semibold text-xs transition-colors"
                      >
                        Publish Now
                      </button>
                    )}

                    <button
                      onClick={() => handleDuplicate(post)}
                      className="p-1.5 rounded-lg text-surface-lightMuted hover:text-surface-lightText dark:hover:text-white hover:bg-surface-darkHover"
                      title="Copy Content"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-1.5 rounded-lg text-surface-lightMuted hover:text-rose-400 hover:bg-rose-500/10"
                      title="Delete Post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

