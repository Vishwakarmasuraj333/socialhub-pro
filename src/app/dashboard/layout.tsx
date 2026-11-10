'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/context/ToastContext';
import {
  LayoutDashboard,
  Share2,
  Send,
  Calendar as CalendarIcon,
  MessageSquare,
  BarChart3,
  Users,
  Image as ImageIcon,
  FileText,
  Settings,
  Bell,
  Search,
  Plus,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Building2,
  Menu,
  X,
  Sparkles,
  Camera,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { success } = useToast();
  const pathname = usePathname();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  // Fetch notifications
  useEffect(() => {
    if (user) {
      fetch('/api/notifications')
        .then((r) => r.json())
        .then((data) => {
          if (data.notifications) {
            setNotifications(data.notifications);
            setUnreadCount(data.unreadCount || 0);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const markAllNotificationsRead = async () => {
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markAllRead: true }),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    success('Notifications', 'All notifications marked as read.');
  };

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Social Accounts', href: '/dashboard/accounts', icon: Share2 },
    { label: 'Posts Studio', href: '/dashboard/posts', icon: Send },
    { label: 'Stories Manager', href: '/dashboard/stories', icon: Camera },
    { label: 'Content Calendar', href: '/dashboard/calendar', icon: CalendarIcon },
    { label: 'Unified Inbox', href: '/dashboard/inbox', icon: MessageSquare, badge: 'Live' },
    { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { label: 'Media Library', href: '/dashboard/media', icon: ImageIcon },
    { label: 'Team Management', href: '/dashboard/team', icon: Users },
    { label: 'Reports', href: '/dashboard/reports', icon: FileText },
    { label: 'Blog Management', href: '/dashboard/blog-admin', icon: FileText },
    { label: 'Settings', href: '/dashboard/settings/profile', icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#100D10] flex flex-col items-center justify-center">
        <Logo size="lg" />
        <div className="mt-6 flex items-center gap-2 text-gold-400">
          <div className="w-2.5 h-2.5 rounded-full bg-gold-400 animate-ping" />
          <span className="text-sm font-medium tracking-wide">Initializing Enterprise Session...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-surface-lightBg dark:bg-surface-darkBg text-surface-lightText dark:text-[#F5EEF3] transition-colors">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-white dark:bg-[#151115] border-r border-surface-lightBorder dark:border-surface-darkBorder/60 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Logo Bar */}
          <div className="p-6 border-b border-surface-lightBorder dark:border-surface-darkBorder/40 flex items-center justify-between">
            <Logo size="md" href="/dashboard" />
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-surface-lightMuted hover:text-surface-lightText dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Organization Pill */}
          <div className="px-6 py-4">
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-lightBg dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/40">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-maroon-700 to-burgundy-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                <Building2 className="w-4 h-4 text-gold-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate text-surface-lightText dark:text-surface-lightText dark:text-white">
                  {user.organizationName || 'Apex Global Media'}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Enterprise Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Create Post Action */}
          <div className="px-6 pb-4">
            <Link
              href="/dashboard/posts/create"
              onClick={() => setSidebarOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-maroon-700 via-burgundy-600 to-maroon-800 hover:opacity-95 text-white font-medium text-xs tracking-wide shadow-luxury hover:shadow-maroon-glow border border-gold-400/20 transition-all"
            >
              <Plus className="w-4 h-4 text-gold-300" />
              <span>Create Post</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-maroon-700/20 to-burgundy-600/10 text-maroon-700 dark:text-gold-300 font-semibold border border-maroon-700/40 dark:border-gold-400/30'
                      : 'text-surface-lightMuted hover:text-surface-lightText dark:hover:text-surface-lightText dark:hover:text-white hover:bg-surface-lightBg dark:hover:bg-surface-darkCard/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-maroon-600 dark:text-gold-400' : 'text-surface-lightMuted'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: User Card */}
        <div className="p-4 border-t border-surface-lightBorder dark:border-surface-darkBorder/40">
          <div className="flex items-center justify-between p-2 rounded-xl bg-surface-lightBg dark:bg-surface-darkCard/60">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-gold-400/40"
              />
              <div className="truncate">
                <p className="text-xs font-semibold truncate text-surface-lightText dark:text-surface-lightText dark:text-white">{user.name}</p>
                <p className="text-[10px] text-surface-lightMuted truncate">{user.role}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-surface-lightMuted hover:text-rose-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-[#100D10]/80 backdrop-blur-xl border-b border-surface-lightBorder dark:border-surface-darkBorder/40 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-surface-lightMuted hover:text-surface-lightText dark:hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Quick Global Search */}
            <div className="relative hidden md:block w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-surface-lightMuted" />
              <input
                type="text"
                placeholder="Search posts, metrics, accounts... (⌘K)"
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface-lightBg dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 text-xs focus:outline-none focus:border-gold-400 transition-all text-surface-lightText dark:text-surface-lightText dark:text-surface-lightText dark:text-white placeholder-surface-lightMuted"
              />
            </div>
          </div>

          {/* Right Header Icons */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-surface-lightMuted hover:text-gold-400 hover:bg-surface-lightBg dark:hover:bg-surface-darkCard transition-all"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-gold-400" /> : <Moon className="w-4 h-4 text-maroon-700" />}
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-xl text-surface-lightMuted hover:text-gold-400 hover:bg-surface-lightBg dark:hover:bg-surface-darkCard transition-all"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                )}
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
                )}
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#1C171C] border border-surface-lightBorder dark:border-maroon-700/50 shadow-luxury-lg overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-surface-lightBorder dark:border-surface-darkBorder/40 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-semibold text-surface-lightText dark:text-surface-lightText dark:text-white uppercase tracking-wider font-sans">
                          Notifications
                        </h4>
                        {unreadCount > 0 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-maroon-700 text-gold-300 font-bold">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-[11px] text-gold-400 hover:underline"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-surface-lightBorder dark:divide-surface-darkBorder/20">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-surface-lightMuted">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-3.5 hover:bg-surface-lightBg dark:hover:bg-surface-darkHover transition-colors ${
                              !n.isRead ? 'bg-maroon-900/10 dark:bg-maroon-900/20' : ''
                            }`}
                          >
                            <p className="text-xs font-medium text-surface-lightText dark:text-surface-lightText dark:text-white">{n.title}</p>
                            <p className="text-[11px] text-surface-lightMuted mt-0.5 leading-relaxed">{n.message}</p>
                            <span className="text-[9px] text-gold-400/80 mt-1 block">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Menu Trigger */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-surface-lightBg dark:hover:bg-surface-darkCard transition-all"
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  className="w-8 h-8 rounded-xl object-cover border border-gold-400/40"
                />
                <ChevronDown className="w-3.5 h-3.5 text-surface-lightMuted" />
              </button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#1C171C] border border-surface-lightBorder dark:border-maroon-700/50 shadow-luxury-lg overflow-hidden z-50 py-2"
                  >
                    <div className="px-4 py-3 border-b border-surface-lightBorder dark:border-surface-darkBorder/40">
                      <p className="text-xs font-semibold text-surface-lightText dark:text-surface-lightText dark:text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-surface-lightMuted truncate">{user.email}</p>
                      <span className="inline-block mt-1.5 text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold-400/20 text-gold-400 border border-gold-400/30 font-bold">
                        {user.role}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/dashboard/settings/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-surface-lightText dark:text-white hover:bg-surface-lightBg dark:hover:bg-surface-darkHover"
                      >
                        <Settings className="w-3.5 h-3.5 text-surface-lightMuted" />
                        <span>Profile Settings</span>
                      </Link>
                      <Link
                        href="/dashboard/settings/security"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-surface-lightText dark:text-white hover:bg-surface-lightBg dark:hover:bg-surface-darkHover"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-surface-lightMuted" />
                        <span>Security &amp; 2FA</span>
                      </Link>
                      <Link
                        href="/dashboard/settings/billing"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-surface-lightText dark:text-white hover:bg-surface-lightBg dark:hover:bg-surface-darkHover"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                        <span>Subscription &amp; Billing</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-surface-lightBorder dark:border-surface-darkBorder/40">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 text-left font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Dashboard Main Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

