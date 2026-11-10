'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ArrowLeft, Clock, Share2, Calendar, User, Bookmark, Check } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const { success, info } = useToast();

  const [post, setPost] = useState<any | null>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/blog?slug=${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.post) {
          setPost(data.post);
          setRelated(data.related || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    success('Link Copied', 'Article URL copied to clipboard.');
    setTimeout(() => setCopied(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#100D10] text-[#F5EEF3]">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-24 space-y-6 animate-pulse">
          <div className="h-8 bg-surface-darkCard/50 rounded w-1/4" />
          <div className="h-16 bg-surface-darkCard/60 rounded w-3/4" />
          <div className="h-80 bg-surface-darkCard/40 rounded-3xl" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#100D10] text-white flex flex-col justify-between">
        <Navbar />
        <div className="text-center py-32 space-y-4">
          <h1 className="text-3xl font-bold">Article Not Found</h1>
          <p className="text-surface-lightMuted text-sm">The requested thought leadership guide may have moved.</p>
          <Link href="/blog" className="inline-block px-5 py-2.5 rounded-xl bg-maroon-700 text-gold-300 font-semibold text-xs">
            Return to Journal
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-lightBg dark:bg-surface-darkBg text-surface-lightText dark:text-[#F5EEF3] transition-colors">
      <Navbar />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gold-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Strategy Journal</span>
          </Link>
        </div>

        {/* Title & Metadata */}
        <div className="space-y-4">
          <span className="px-3 py-1 rounded-full bg-maroon-900/30 text-gold-300 font-bold text-xs uppercase tracking-wider border border-maroon-700/50">
            {post.category}
          </span>

          <h1 className="text-3xl sm:text-5xl font-black text-surface-lightText dark:text-white tracking-tight leading-tight font-sans">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-surface-lightMuted leading-relaxed">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-y border-surface-lightBorder dark:border-surface-darkBorder/40 py-4 text-xs text-surface-lightMuted">
            <div className="flex items-center gap-3">
              <img
                src={post.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={post.author?.name}
                className="w-10 h-10 rounded-full object-cover border border-gold-400/50"
              />
              <div>
                <p className="font-bold text-surface-lightText dark:text-white">{post.author?.name || 'Executive Editorial Team'}</p>
                <p className="text-[11px] text-surface-lightMuted">Published {new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gold-400" />
                <span>{post.readingTime}</span>
              </span>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-lightCard dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder hover:border-gold-400 text-xs font-semibold text-gold-300 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link Copied' : 'Share Article'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Featured Cover Image */}
        {post.coverImage && (
          <div className="rounded-3xl overflow-hidden border border-maroon-700/40 shadow-luxury-lg aspect-video bg-black">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Article Body Content */}
        <div className="prose prose-invert max-w-none text-surface-lightText dark:text-[#E8E2E4] text-sm sm:text-base leading-relaxed space-y-6 pt-4 font-sans">
          {post.content.split('\n\n').map((paragraph: string, idx: number) => {
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={idx} className="text-2xl font-black text-surface-lightText dark:text-white pt-6 pb-2 border-b border-surface-lightBorder dark:border-surface-darkBorder/40">
                  {paragraph.replace('## ', '')}
                </h2>
              );
            }
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={idx} className="text-xl font-bold text-gold-400 pt-4">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('> ')) {
              return (
                <blockquote key={idx} className="p-4 rounded-2xl bg-maroon-900/20 border-l-4 border-gold-400 italic text-gold-200">
                  {paragraph.replace('> ', '')}
                </blockquote>
              );
            }
            return <p key={idx} className="leading-relaxed whitespace-pre-line">{paragraph}</p>;
          })}
        </div>

        {/* Related Articles */}
        {related.length > 0 && (
          <div className="pt-16 border-t border-surface-lightBorder dark:border-surface-darkBorder/40 space-y-6">
            <h3 className="text-lg font-bold text-surface-lightText dark:text-white uppercase tracking-wider font-sans">
              Related Playbooks
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel: any) => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  className="p-5 rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder hover:border-gold-400 transition-all space-y-2 block"
                >
                  <span className="text-[10px] font-bold text-gold-400 uppercase">{rel.category}</span>
                  <h4 className="text-xs font-bold text-surface-lightText dark:text-white line-clamp-2">{rel.title}</h4>
                  <span className="text-[10px] text-surface-lightMuted block">{rel.readingTime}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      <Footer />
    </div>
  );
}

