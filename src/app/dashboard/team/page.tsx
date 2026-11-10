'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Mail,
  ShieldCheck,
  Check,
  Trash2,
  Sparkles,
  UserCheck,
  Key,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Role } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

export default function TeamManagementPage() {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<Role>('EDITOR');
  const [inviteJobTitle, setInviteJobTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchTeam = async () => {
    try {
      const res = await fetch('/api/team');
      if (res.ok) {
        const json = await res.json();
        setMembers(json.members || []);
      }
    } catch (err) {
      error('Error', 'Failed to fetch team');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: inviteName,
          email: inviteEmail,
          role: inviteRole,
          jobTitle: inviteJobTitle,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        success('Member Invited!', data.message);
        setInviteModalOpen(false);
        setInviteName('');
        setInviteEmail('');
        setInviteJobTitle('');
        fetchTeam();
      } else {
        error('Invitation Failed', data.message);
      }
    } catch (err: any) {
      error('Error', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRoleChange = async (memberId: string, role: string) => {
    try {
      const res = await fetch('/api/team', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId, role }),
      });

      if (res.ok) {
        success('Role Updated', 'Teammate permissions updated.');
        fetchTeam();
      } else {
        error('Permission Denied', 'Unable to change role');
      }
    } catch (err) {
      error('Error', 'Failed to change role');
    }
  };

  const handleRemoveMember = async (memberId: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from your organization?`)) return;

    try {
      const res = await fetch(`/api/team?id=${memberId}`, { method: 'DELETE' });
      if (res.ok) {
        success('Member Removed', `${name} has been removed.`);
        fetchTeam();
      } else {
        error('Error', 'Unable to remove member');
      }
    } catch (err) {
      error('Error', 'Failed to remove member');
    }
  };

  const rolePermissions = [
    {
      role: 'ADMIN',
      desc: 'Full administrative access: billing, API OAuth integrations, team roles, and post approval.',
    },
    {
      role: 'MANAGER',
      desc: 'Publish, schedule, approve posts, and manage social inbox conversations.',
    },
    {
      role: 'EDITOR',
      desc: 'Compose draft posts and stories, upload media, request approval from managers.',
    },
    {
      role: 'ANALYST',
      desc: 'Read-only access to analytics dashboards, audience reports, and benchmarks.',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-surface-lightText dark:text-surface-lightText dark:text-white tracking-tight font-sans">
            Enterprise Team &amp; RBAC
          </h1>
          <p className="text-xs sm:text-sm text-surface-lightMuted mt-1">
            Enforce role-based access control, assign publishing approvals, and audit collaborator permissions.
          </p>
        </div>

        <button
          onClick={() => setInviteModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-maroon-700 to-burgundy-600 hover:from-maroon-800 hover:to-burgundy-700 text-white font-medium text-xs shadow-luxury hover:shadow-maroon-glow transition-all"
        >
          <Plus className="w-4 h-4 text-gold-300" />
          <span>Invite Team Member</span>
        </button>
      </div>

      {/* Permissions Matrix Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {rolePermissions.map((rp) => (
          <div
            key={rp.role}
            className="p-4 rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 space-y-2 text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-gold-400 uppercase tracking-wider font-sans">
                {rp.role}
              </span>
              <ShieldCheck className="w-4 h-4 text-maroon-500" />
            </div>
            <p className="text-surface-lightMuted leading-relaxed text-[11px]">{rp.desc}</p>
          </div>
        ))}
      </div>

      {/* Team Members Table */}
      <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-surface-lightBorder dark:border-surface-darkBorder/40 flex items-center justify-between">
          <h3 className="text-sm font-bold text-surface-lightText dark:text-surface-lightText dark:text-white uppercase tracking-wider font-sans">
            Organization Collaborators ({members.length})
          </h3>
          <span className="text-xs text-gold-400 font-medium">Enterprise SSO Enabled</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-surface-lightBorder dark:border-surface-darkBorder/40 text-surface-lightMuted uppercase font-semibold">
              <tr>
                <th className="py-3 px-5">Member</th>
                <th className="py-3 px-5">Job Title</th>
                <th className="py-3 px-5">Role</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-lightBorder dark:divide-surface-darkBorder/30">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-surface-lightBg dark:hover:bg-surface-darkHover/40 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          m.avatar ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                        }
                        alt={m.name}
                        className="w-10 h-10 rounded-xl object-cover border border-gold-400/40"
                      />
                      <div>
                        <p className="font-bold text-surface-lightText dark:text-surface-lightText dark:text-white">{m.name}</p>
                        <p className="text-[11px] text-surface-lightMuted">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-surface-lightMuted">{m.jobTitle}</td>
                  <td className="py-4 px-5">
                    <select
                      value={m.role}
                      disabled={m.id === user?.id}
                      onChange={(e) => handleRoleChange(m.id, e.target.value)}
                      className="px-2.5 py-1 rounded-lg bg-surface-darkCard border border-surface-darkBorder text-gold-300 font-bold text-xs focus:outline-none"
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="MANAGER">MANAGER</option>
                      <option value="EDITOR">EDITOR</option>
                      <option value="ANALYST">ANALYST</option>
                    </select>
                  </td>
                  <td className="py-4 px-5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      ACTIVE
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    {m.id !== user?.id && (
                      <button
                        onClick={() => handleRemoveMember(m.id, m.name)}
                        className="p-1.5 rounded-lg text-surface-lightMuted hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Remove Member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {inviteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl bg-white dark:bg-[#1A141A] border border-maroon-700/60 p-6 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-surface-lightBorder dark:border-surface-darkBorder/40 pb-4">
                <h3 className="text-base font-bold text-surface-lightText dark:text-surface-lightText dark:text-white font-sans">
                  Invite Organization Member
                </h3>
                <button onClick={() => setInviteModalOpen(false)} className="text-surface-lightMuted hover:text-surface-lightText dark:hover:text-white">
                  ✕
                </button>
              </div>

              <form onSubmit={handleInvite} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-surface-lightText dark:text-white">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="e.g. Jordan Blake"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-lightBg dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white placeholder-surface-lightMuted focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-surface-lightText dark:text-white">
                    Work Email
                  </label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="jordan@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-lightBg dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white placeholder-surface-lightMuted focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-surface-lightText dark:text-white">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={inviteJobTitle}
                    onChange={(e) => setInviteJobTitle(e.target.value)}
                    placeholder="e.g. Brand Strategist"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-lightBg dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white placeholder-surface-lightMuted focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-surface-lightText dark:text-white">
                    Assigned Role
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as Role)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-lightBg dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white focus:outline-none focus:border-gold-400"
                  >
                    <option value="ADMIN">ADMIN - Full administrative access</option>
                    <option value="MANAGER">MANAGER - Publishing and team approval</option>
                    <option value="EDITOR">EDITOR - Content creation and drafting</option>
                    <option value="ANALYST">ANALYST - Reporting and data insights</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setInviteModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-surface-lightMuted hover:text-surface-lightText dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-maroon-700 to-burgundy-600 text-white font-medium text-xs shadow-luxury"
                  >
                    {submitting ? 'Sending Invite...' : 'Send Invitation'}
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

