'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Edit3,
  Eye,
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Social Media Strategy');
  const [tags, setTags] = useState('strategy,growth,ai');
  const [coverImage, setCoverImage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { success, error } = useToast();

  const fetchBlogPosts = async () => {
    try {
      const res = await fetch('/api/blog');
      if (res.ok) {
        const json = await res.json();
        setPosts(json.posts || []);
      }
    } catch (err) {
      error('Error', 'Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          category,
          tags,
          coverImage,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        success('Article Published', 'New post added to public blog CMS.');
        setCreateModalOpen(false);
        setTitle('');
        setExcerpt('');
        setContent('');
        fetchBlogPosts();
      } else {
        error('Failed', data.message);
      }
    } catch (err: any) {
      error('Error', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-surface-lightText dark:text-surface-lightText dark:text-white tracking-tight font-sans">
            Blog &amp; Thought Leadership CMS
          </h1>
          <p className="text-xs sm:text-sm text-surface-lightMuted mt-1">
            Author SEO-optimized articles, whitepapers, and guides for the public resource hub.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-maroon-700 to-burgundy-600 hover:from-maroon-800 text-white font-medium text-xs shadow-luxury"
        >
          <Plus className="w-4 h-4 text-gold-300" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Posts Table */}
      <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-surface-lightBorder dark:border-surface-darkBorder/40 flex items-center justify-between">
          <h3 className="text-sm font-bold text-surface-lightText dark:text-surface-lightText dark:text-white uppercase tracking-wider font-sans">
            Published Articles ({posts.length})
          </h3>
          <Link href="/blog" target="_blank" className="text-xs text-gold-400 hover:underline flex items-center gap-1">
            <span>View Public Blog</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-surface-lightBorder dark:border-surface-darkBorder/40 text-surface-lightMuted uppercase font-semibold">
              <tr>
                <th className="py-3 px-5">Title</th>
                <th className="py-3 px-5">Category</th>
                <th className="py-3 px-5">Author</th>
                <th className="py-3 px-5">Published</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-lightBorder dark:divide-surface-darkBorder/30">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-surface-lightBg dark:hover:bg-surface-darkHover/40 transition-colors">
                  <td className="py-4 px-5">
                    <p className="font-bold text-surface-lightText dark:text-surface-lightText dark:text-white line-clamp-1">{post.title}</p>
                    <p className="text-[11px] text-surface-lightMuted line-clamp-1">{post.excerpt}</p>
                  </td>
                  <td className="py-4 px-5">
                    <span className="px-2 py-0.5 rounded-full bg-gold-400/10 text-gold-400 font-semibold border border-gold-400/30">
                      {post.category}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-surface-lightMuted">{post.author?.name || 'Admin'}</td>
                  <td className="py-4 px-5 text-surface-lightMuted">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}
                  </td>
                  <td className="py-4 px-5 text-right">
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-gold-400 hover:underline"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Article Modal */}
      <AnimatePresence>
        {createModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-2xl bg-white dark:bg-[#1A141A] border border-maroon-700/60 p-6 space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-surface-lightBorder dark:border-surface-darkBorder/40 pb-4">
                <h3 className="text-base font-bold text-surface-lightText dark:text-surface-lightText dark:text-white font-sans">
                  Publish Thought Leadership Article
                </h3>
                <button onClick={() => setCreateModalOpen(false)} className="text-surface-lightMuted hover:text-surface-lightText dark:hover:text-white">
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateArticle} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-surface-lightText dark:text-white">Article Headline</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Navigating Multi-Channel Algorithm Updates in 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-lightBg dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white placeholder-surface-lightMuted focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-surface-lightText dark:text-white">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-lightBg dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white focus:outline-none focus:border-gold-400"
                    >
                      <option value="Social Media Strategy">Social Media Strategy</option>
                      <option value="Productivity & Automation">Productivity &amp; Automation</option>
                      <option value="Customer Experience">Customer Experience</option>
                      <option value="Algorithm & SEO">Algorithm &amp; SEO</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-surface-lightText dark:text-white">Cover Image URL</label>
                    <input
                      type="url"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-lightBg dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white placeholder-surface-lightMuted focus:outline-none focus:border-gold-400"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-surface-lightText dark:text-white">Executive Excerpt</label>
                  <textarea
                    rows={2}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Brief 1-2 sentence preview for search engine cards..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-lightBg dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white placeholder-surface-lightMuted focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-surface-lightText dark:text-white">Article Content (Markdown Supported)</label>
                  <textarea
                    rows={8}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="## Introduction&#10;&#10;Write in markdown with headings, bullets, and blockquotes..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-lightBg dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white placeholder-surface-lightMuted focus:outline-none focus:border-gold-400 font-mono"
                  />
                </div>

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
                    {submitting ? 'Publishing...' : 'Publish to Blog'}
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
