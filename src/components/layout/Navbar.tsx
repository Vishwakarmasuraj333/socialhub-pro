'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Sun, Moon, Menu, X, ArrowRight, LayoutDashboard, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: 'Platform', href: '/#features' },
    { label: 'Publishing Studio', href: '/#publishing' },
    { label: 'Unified Inbox', href: '/#inbox' },
    { label: 'Analytics', href: '/#analytics' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Blog', href: '/blog' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/95 dark:bg-[#100D10]/95 border-b border-zinc-200 dark:border-surface-darkBorder/60 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Logo size="md" showTagline={false} href="/" />

        {/* Desktop Navigation - Dark & high-contrast in light mode */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`text-sm font-semibold transition-colors ${
                pathname === link.href
                  ? 'text-maroon-700 dark:text-gold-400 font-bold'
                  : 'text-zinc-800 hover:text-maroon-700 dark:text-zinc-300 dark:hover:text-gold-400'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:text-maroon-700 dark:hover:text-gold-400 hover:bg-zinc-100 dark:hover:bg-surface-darkCard/80 border border-transparent hover:border-zinc-300 dark:hover:border-maroon-700/40 transition-all"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-gold-400" />
            ) : (
              <Moon className="w-5 h-5 text-maroon-700" />
            )}
          </button>

          {user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-maroon-700 to-burgundy-600 hover:from-maroon-800 hover:to-burgundy-700 text-white font-bold text-sm shadow-luxury hover:shadow-maroon-glow transition-all"
            >
              <LayoutDashboard className="w-4 h-4 text-gold-300" />
              <span>Launch Dashboard</span>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-bold text-zinc-800 hover:text-maroon-700 dark:text-zinc-200 dark:hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="relative group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-maroon-700 via-burgundy-600 to-maroon-800 hover:opacity-95 text-white font-bold text-sm shadow-luxury hover:shadow-maroon-glow border border-gold-400/30 transition-all"
              >
                <Sparkles className="w-4 h-4 text-gold-300" />
                <span>Start Free Trial</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 text-zinc-700 dark:text-zinc-300 hover:text-maroon-700 dark:hover:text-gold-400"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-surface-darkCard"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-zinc-200 dark:border-surface-darkBorder/60 bg-white dark:bg-[#100D10]/95 px-6 py-6 space-y-4"
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-bold text-zinc-800 hover:text-maroon-700 dark:text-zinc-200 dark:hover:text-gold-400"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-zinc-200 dark:border-surface-darkBorder/40 flex flex-col gap-3">
              {user ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-maroon-700 to-burgundy-600 text-white font-bold"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl border border-zinc-300 dark:border-surface-darkBorder text-zinc-800 dark:text-white font-bold"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-maroon-700 to-burgundy-600 text-white font-bold"
                  >
                    Start Free Trial
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
