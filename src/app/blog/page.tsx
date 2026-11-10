'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Search, Clock, ArrowRight, Sparkles, BookOpen } from 'lucide-react';

export default function BlogListingPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== 'ALL') params.set('category', selectedCategory);
    if (search) params.set('search', search);

    fetch(`/api/blog?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.posts) {
          setPosts(data.posts);
          if (data.categories) setCategories(data.categories);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedCategory, search]);

  return (
    <div className="min-h-screen bg-surface-lightBg dark:bg-surface-darkBg text-surface-lightText dark:text-[#F5EEF3] transition-colors">
      <Navbar />

      {/* Header */}
      <section className="pt-20 pb-16 border-b border-surface-lightBorder dark:border-surface-darkBorder/40 bg-surface-lightBg/50 dark:bg-[#130F13]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold text-gold-400 uppercase tracking-widest font-sans">
            Thought Leadership &amp; Playbooks
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-surface-lightText dark:text-surface-lightText dark:text-white tracking-tight font-sans">
            The Omnichannel Strategy Journal
          </h1>
          <p className="text-sm sm:text-base text-surface-lightMuted max-w-2xl mx-auto">
            Actionable algorithm teardowns, enterprise social benchmark reports, and growth frameworks from industry leaders.
          </p>

          {/* Search & Category Filter */}
          <div className="pt-6 max-w-md mx-auto">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-surface-lightMuted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles, algorithms, or playbooks..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white placeholder-surface-lightMuted focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {['ALL', ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-maroon-700 text-white shadow-sm'
                  : 'text-surface-lightMuted hover:text-surface-lightText dark:hover:text-white hover:bg-surface-darkHover'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Cards Grid */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-surface-darkCard/50 rounded-3xl" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="p-16 text-center text-xs text-surface-lightMuted">
            No articles match your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group rounded-3xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 overflow-hidden shadow-sm hover:shadow-luxury transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video overflow-hidden bg-black">
                    <img
                      src={post.coverImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80'}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/70 text-gold-300 backdrop-blur-md">
                      {post.category}
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-[11px] text-surface-lightMuted">
                      <Clock className="w-3.5 h-3.5 text-gold-400" />
                      <span>{post.readingTime}</span>
                      <span>&bull;</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>

                    <h2 className="text-base sm:text-lg font-bold text-surface-lightText dark:text-surface-lightText dark:text-white group-hover:text-gold-400 transition-colors leading-snug font-sans">
                      {post.title}
                    </h2>

                    <p className="text-xs text-surface-lightMuted line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-surface-lightBorder dark:border-surface-darkBorder/30 flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <img
                      src={post.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                      alt={post.author?.name}
                      className="w-7 h-7 rounded-full object-cover border border-gold-400/40"
                    />
                    <span className="text-xs text-surface-lightMuted">{post.author?.name || 'Editorial Team'}</span>
                  </div>

                  <span className="text-xs font-semibold text-gold-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Read Article <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

