'use client';

import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Plus,
  Trash2,
  Copy,
  ExternalLink,
  Film,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function MediaLibraryPage() {
  const { success, info } = useToast();
  const [filter, setFilter] = useState<'ALL' | 'IMAGE' | 'VIDEO'>('ALL');
  const [mediaItems, setMediaItems] = useState([
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
      title: 'Enterprise Analytics Dashboard Banner',
      type: 'IMAGE',
      size: '1.4 MB',
      createdAt: '2026-11-05',
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
      title: 'Marketing Ops Strategy Session',
      type: 'IMAGE',
      size: '2.1 MB',
      createdAt: '2026-11-04',
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80',
      title: 'London 4K Production Studio B-Roll',
      type: 'VIDEO',
      size: '18.4 MB',
      createdAt: '2026-11-02',
    },
    {
      id: '4',
      url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      title: 'Social SEO & Algorithm Data Graphics',
      type: 'IMAGE',
      size: '980 KB',
      createdAt: '2026-10-28',
    },
    {
      id: '5',
      url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
      title: 'Executive Team Collaboration Summit',
      type: 'IMAGE',
      size: '1.8 MB',
      createdAt: '2026-10-25',
    },
    {
      id: '6',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
      title: 'Luxury Architectural Design Palette',
      type: 'IMAGE',
      size: '2.4 MB',
      createdAt: '2026-10-20',
    },
  ]);

  const [uploadUrl, setUploadUrl] = useState('');

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadUrl.trim()) return;

    const newItem = {
      id: Date.now().toString(),
      url: uploadUrl.trim(),
      title: `Asset ${mediaItems.length + 1}`,
      type: uploadUrl.includes('.mp4') || uploadUrl.includes('video') ? 'VIDEO' : 'IMAGE',
      size: '1.2 MB',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setMediaItems([newItem, ...mediaItems]);
    setUploadUrl('');
    success('Media Uploaded', 'New asset added to enterprise library.');
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard?.writeText(url);
    info('Copied', 'Media URL copied to clipboard.');
  };

  const handleDelete = (id: string) => {
    setMediaItems(mediaItems.filter((m) => m.id !== id));
    success('Deleted', 'Media asset removed.');
  };

  const filteredItems = mediaItems.filter((item) => {
    if (filter === 'ALL') return true;
    return item.type === filter;
  });

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-surface-lightText dark:text-surface-lightText dark:text-white tracking-tight font-sans">
            Enterprise Media Asset Library
          </h1>
          <p className="text-xs sm:text-sm text-surface-lightMuted mt-1">
            Centralized digital asset management: high-resolution photography, 4K video clips, and brand kits.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-lightCard dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder">
          {(['ALL', 'IMAGE', 'VIDEO'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                filter === t ? 'bg-maroon-700 text-white' : 'text-surface-lightMuted'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Upload Dropzone */}
      <form onSubmit={handleAddMedia} className="p-6 rounded-2xl bg-white dark:bg-surface-darkCard border-2 border-dashed border-maroon-700/50 flex flex-col items-center justify-center text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-maroon-900/30 text-gold-400 flex items-center justify-center">
          <Upload className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-bold text-surface-lightText dark:text-surface-lightText dark:text-white">
            Upload Brand Assets to Storage
          </p>
          <p className="text-xs text-surface-lightMuted mt-0.5">
            Supported formats: PNG, JPG, WebP, MP4, MOV (up to 500MB per file)
          </p>
        </div>

        <div className="flex w-full max-w-md gap-2 pt-2">
          <input
            type="url"
            value={uploadUrl}
            onChange={(e) => setUploadUrl(e.target.value)}
            placeholder="Paste direct asset CDN URL..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-surface-lightBg dark:bg-surface-darkBg border border-surface-lightBorder dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white placeholder-surface-lightMuted focus:outline-none focus:border-gold-400"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-gold-300 text-xs font-semibold"
          >
            Upload
          </button>
        </div>
      </form>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 overflow-hidden shadow-sm flex flex-col justify-between"
          >
            <div className="relative aspect-video overflow-hidden bg-black">
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/70 text-gold-300">
                {item.type}
              </span>
            </div>

            <div className="p-4 space-y-2">
              <p className="text-xs font-bold text-surface-lightText dark:text-surface-lightText dark:text-white truncate">
                {item.title}
              </p>
              <div className="flex items-center justify-between text-[10px] text-surface-lightMuted">
                <span>{item.size}</span>
                <span>{item.createdAt}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-surface-lightBorder dark:border-surface-darkBorder/40">
                <button
                  onClick={() => handleCopyUrl(item.url)}
                  className="flex items-center gap-1 text-[11px] text-gold-400 hover:underline"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy CDN</span>
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-surface-lightMuted hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

