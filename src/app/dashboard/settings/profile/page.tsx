'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Building,
  Mail,
  Globe,
  Clock,
  Sparkles,
  Save,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function ProfileSettingsPage() {
  const { user, refreshUser } = useAuth();
  const { success, error } = useToast();

  const [name, setName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [timezone, setTimezone] = useState('America/New_York');
  const [website, setWebsite] = useState('');
  const [avatar, setAvatar] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings/profile')
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setName(data.user.name || '');
          setAvatar(data.user.avatar || '');
          if (data.user.profile) {
            setJobTitle(data.user.profile.jobTitle || '');
            setCompany(data.user.profile.company || '');
            setBio(data.user.profile.bio || '');
            setPhone(data.user.profile.phone || '');
            setTimezone(data.user.profile.timezone || 'America/New_York');
            setWebsite(data.user.profile.website || '');
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          avatar,
          bio,
          phone,
          timezone,
          jobTitle,
          company,
          website,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        success('Profile Updated', 'Your profile details have been saved.');
        await refreshUser();
      } else {
        error('Error', data.message);
      }
    } catch (err: any) {
      error('Error', err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-surface-lightText dark:text-surface-lightText dark:text-white tracking-tight font-sans">
          Profile &amp; Executive Settings
        </h1>
        <p className="text-xs sm:text-sm text-surface-lightMuted mt-1">
          Manage your personal executive identity, organization metadata, and timezone preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 shadow-sm space-y-6">
        {/* Avatar section */}
        <div className="flex items-center gap-5 pb-6 border-b border-surface-lightBorder dark:border-surface-darkBorder/40">
          <img
            src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt="Profile Avatar"
            className="w-20 h-20 rounded-2xl object-cover border-2 border-gold-400 shadow-luxury"
          />
          <div className="space-y-1.5 flex-1">
            <label className="text-xs font-semibold text-surface-lightText dark:text-white">Profile Photo URL</label>
            <input
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 rounded-xl bg-surface-lightBg dark:bg-surface-darkBg border border-surface-lightBorder dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white placeholder-surface-lightMuted focus:outline-none focus:border-gold-400"
            />
          </div>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-surface-lightText dark:text-white">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-lightBg dark:bg-surface-darkBg border border-surface-lightBorder dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white focus:outline-none focus:border-gold-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-surface-lightText dark:text-white">Email Address</label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-lightBg/50 dark:bg-surface-darkBg/50 border border-surface-lightBorder dark:border-surface-darkBorder text-xs text-surface-lightMuted cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-surface-lightText dark:text-white">Job Title</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="VP of Omnichannel Marketing"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-lightBg dark:bg-surface-darkBg border border-surface-lightBorder dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white focus:outline-none focus:border-gold-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-surface-lightText dark:text-white">Organization / Company</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Apex Global Media Group"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-lightBg dark:bg-surface-darkBg border border-surface-lightBorder dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white focus:outline-none focus:border-gold-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-surface-lightText dark:text-white">Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-lightBg dark:bg-surface-darkBg border border-surface-lightBorder dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white focus:outline-none focus:border-gold-400"
            >
              <option value="America/New_York">America/New_York (EST)</option>
              <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
              <option value="America/Chicago">America/Chicago (CST)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
              <option value="Europe/Paris">Europe/Paris (CET)</option>
              <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
              <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-surface-lightText dark:text-white">Website</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://apexglobal.example.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-lightBg dark:bg-surface-darkBg border border-surface-lightBorder dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white focus:outline-none focus:border-gold-400"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-surface-lightText dark:text-white">Executive Bio</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell your team about your strategic focus..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-lightBg dark:bg-surface-darkBg border border-surface-lightBorder dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white focus:outline-none focus:border-gold-400 leading-relaxed"
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-maroon-700 to-burgundy-600 hover:from-maroon-800 text-white font-semibold text-xs shadow-luxury"
          >
            <Save className="w-4 h-4 text-gold-300" />
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

