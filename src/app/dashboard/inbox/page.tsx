'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  User,
  Send,
  Sparkles,
  AlertCircle,
  Tag,
  Share2,
} from 'lucide-react';
import { PlatformBadge } from '@/components/ui/PlatformBadge';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

export default function UnifiedInboxPage() {
  const { user } = useAuth();
  const { success, error, info } = useToast();

  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConvo, setSelectedConvo] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('OPEN');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  const fetchConversations = async () => {
    try {
      const params = new URLSearchParams();
      if (typeFilter !== 'ALL') params.set('type', typeFilter);
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      if (priorityFilter !== 'ALL') params.set('priority', priorityFilter);

      const res = await fetch(`/api/inbox?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        const convos = json.conversations || [];
        setConversations(convos);

        // Keep selected conversation in sync
        if (selectedConvo) {
          const updated = convos.find((c: any) => c.id === selectedConvo.id);
          if (updated) setSelectedConvo(updated);
        } else if (convos.length > 0) {
          setSelectedConvo(convos[0]);
        }
      }
    } catch (err) {
      error('Error', 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    fetch('/api/team')
      .then((r) => r.json())
      .then((d) => {
        if (d.members) setTeamMembers(d.members);
      })
      .catch(() => {});
  }, [typeFilter, statusFilter, priorityFilter]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConvo || !replyText.trim()) return;

    setSendingReply(true);
    try {
      const res = await fetch('/api/inbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConvo.id,
          content: replyText,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        success('Reply Sent', 'Your response was delivered via official API webhook.');
        setReplyText('');
        fetchConversations();
      } else {
        error('Failed', data.message);
      }
    } catch (err: any) {
      error('Error', err.message);
    } finally {
      setSendingReply(false);
    }
  };

  const handleUpdateStatus = async (newStatus: 'OPEN' | 'RESOLVED') => {
    if (!selectedConvo) return;
    try {
      const res = await fetch('/api/inbox', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConvo.id,
          status: newStatus,
        }),
      });

      if (res.ok) {
        success('Status Updated', `Conversation marked as ${newStatus}.`);
        fetchConversations();
      }
    } catch (err) {
      error('Error', 'Failed to update conversation');
    }
  };

  const handleAssignMember = async (memberId: string) => {
    if (!selectedConvo) return;
    try {
      const res = await fetch('/api/inbox', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConvo.id,
          assignedToId: memberId || null,
        }),
      });

      if (res.ok) {
        success('Assigned', 'Teammate assignment updated.');
        fetchConversations();
      }
    } catch (err) {
      error('Error', 'Failed to update assignment');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-surface-lightText dark:text-surface-lightText dark:text-white tracking-tight font-sans">
            Unified Social Inbox
          </h1>
          <p className="text-xs sm:text-sm text-surface-lightMuted mt-1">
            Omnichannel triage: direct messages, mentions, and comments across all networks.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gold-400 flex items-center gap-1 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Graph Webhook Ingestion
          </span>
        </div>
      </div>

      {/* Main Inbox Two-Pane Interface */}
      <div className="h-[750px] rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 shadow-luxury-lg overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left List Pane (5 Cols) */}
        <div className="md:col-span-5 border-r border-surface-lightBorder dark:border-surface-darkBorder/60 flex flex-col h-full bg-white dark:bg-[#151115]">
          {/* Filter Bar */}
          <div className="p-3.5 border-b border-surface-darkBorder/40 space-y-2.5">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStatusFilter(statusFilter === 'OPEN' ? 'ALL' : 'OPEN')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  statusFilter === 'OPEN' ? 'bg-maroon-700 text-white' : 'text-surface-lightMuted hover:text-surface-lightText dark:hover:text-white'
                }`}
              >
                Open Only
              </button>
              <button
                onClick={() => setTypeFilter(typeFilter === 'DIRECT_MESSAGE' ? 'ALL' : 'DIRECT_MESSAGE')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  typeFilter === 'DIRECT_MESSAGE' ? 'bg-maroon-700 text-white' : 'text-surface-lightMuted hover:text-surface-lightText dark:hover:text-white'
                }`}
              >
                Direct DMs
              </button>
              <button
                onClick={() => setTypeFilter(typeFilter === 'COMMENT' ? 'ALL' : 'COMMENT')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  typeFilter === 'COMMENT' ? 'bg-maroon-700 text-white' : 'text-surface-lightMuted hover:text-surface-lightText dark:hover:text-white'
                }`}
              >
                Comments
              </button>
            </div>
          </div>

          {/* Conversations Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-surface-darkBorder/30">
            {loading ? (
              <div className="p-4 space-y-3 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 bg-surface-darkCard/60 rounded-xl" />
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-surface-lightMuted">
                Inbox zero! No unaddressed messages.
              </div>
            ) : (
              conversations.map((convo) => {
                const isSelected = selectedConvo?.id === convo.id;
                const lastMsg = convo.messages?.[convo.messages.length - 1];

                return (
                  <div
                    key={convo.id}
                    onClick={() => setSelectedConvo(convo)}
                    className={`p-4 cursor-pointer transition-all flex items-start gap-3 relative ${
                      isSelected
                        ? 'bg-maroon-900/25 border-l-4 border-gold-400'
                        : 'hover:bg-surface-darkHover/40'
                    }`}
                  >
                    <img
                      src={convo.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                      alt={convo.senderName}
                      className="w-10 h-10 rounded-full object-cover border border-maroon-700/50 shrink-0 mt-0.5"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-xs font-bold text-surface-lightText dark:text-white truncate">
                          {convo.senderName}
                        </h4>
                        <span className="text-[10px] text-surface-lightMuted">
                          {new Date(convo.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <p className="text-xs text-surface-lightMuted truncate">
                        {lastMsg?.content || 'No message yet'}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <PlatformBadge platform={convo.socialAccount?.platform || 'INSTAGRAM'} size="sm" showLabel={false} />
                        <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-gold-400/20 text-gold-300 font-bold">
                          {convo.type.replace(/_/g, ' ')}
                        </span>
                        {convo.priority === 'HIGH' && (
                          <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold">
                            High Priority
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Active Thread Pane (7 Cols) */}
        {selectedConvo ? (
          <div className="md:col-span-7 flex flex-col h-full bg-surface-lightBg dark:bg-[#181318]">
            {/* Thread Header */}
            <div className="p-4 border-b border-surface-lightBorder dark:border-surface-darkBorder/50 flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#130F13]">
              <div className="flex items-center gap-3">
                <img
                  src={selectedConvo.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt={selectedConvo.senderName}
                  className="w-10 h-10 rounded-full object-cover border border-gold-400/50"
                />
                <div>
                  <h3 className="text-xs font-bold text-surface-lightText dark:text-white">
                    {selectedConvo.senderName}
                  </h3>
                  <p className="text-[10px] text-surface-lightMuted">
                    @{selectedConvo.senderUsername || selectedConvo.senderName.toLowerCase().replace(/ /g, '')} &bull; via {selectedConvo.socialAccount?.platform}
                  </p>
                </div>
              </div>

              {/* Status & Assignment controls */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedConvo.assignedToId || ''}
                  onChange={(e) => handleAssignMember(e.target.value)}
                  className="px-2 py-1 rounded-lg bg-surface-darkCard border border-surface-darkBorder text-[11px] text-gold-300 focus:outline-none"
                >
                  <option value="">Unassigned</option>
                  {teamMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      Assign: {m.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() =>
                    handleUpdateStatus(selectedConvo.status === 'OPEN' ? 'RESOLVED' : 'OPEN')
                  }
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    selectedConvo.status === 'RESOLVED'
                      ? 'bg-zinc-800 text-zinc-300'
                      : 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {selectedConvo.status === 'RESOLVED' ? 'Reopen' : 'Mark Resolved'}
                </button>
              </div>
            </div>

            {/* Messages Chat Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {selectedConvo.messages?.map((msg: any) => {
                const isBrand = msg.senderType === 'USER';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isBrand ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isBrand
                          ? 'bg-gradient-to-r from-maroon-700 to-burgundy-600 text-white rounded-br-none shadow-luxury'
                          : 'bg-white dark:bg-surface-darkCard text-surface-lightText dark:text-[#F5EEF3] border border-surface-lightBorder dark:border-surface-darkBorder rounded-bl-none shadow-sm'
                      }`}
                    >
                      <p>{msg.content}</p>
                    </div>
                    <span className="text-[10px] text-surface-lightMuted mt-1 px-1">
                      {isBrand ? 'Sent by team' : selectedConvo.senderName} &bull;{' '}
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Reply Input Bar */}
            <form onSubmit={handleSendReply} className="p-4 border-t border-surface-lightBorder dark:border-surface-darkBorder/50 bg-white dark:bg-[#130F13]">
              <div className="relative flex items-center">
                <input
                  type="text"
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to ${selectedConvo.senderName} on ${selectedConvo.socialAccount?.platform}...`}
                  className="w-full pl-4 pr-24 py-3 rounded-xl bg-surface-darkCard border border-surface-darkBorder text-xs text-surface-lightText dark:text-white placeholder-surface-lightMuted focus:outline-none focus:border-gold-400"
                />
                <button
                  type="submit"
                  disabled={sendingReply || !replyText.trim()}
                  className="absolute right-2 px-4 py-1.5 rounded-lg bg-maroon-700 hover:bg-maroon-800 disabled:opacity-40 text-gold-300 text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="md:col-span-7 flex items-center justify-center text-xs text-surface-lightMuted">
            Select a conversation on the left to start responding.
          </div>
        )}
      </div>
    </div>
  );
}

