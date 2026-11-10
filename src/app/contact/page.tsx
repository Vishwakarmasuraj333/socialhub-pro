'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useToast } from '@/context/ToastContext';
import {
  Mail,
  Building2,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Globe,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const { success } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [channels, setChannels] = useState('10-25 channels');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      success('Inquiry Received', 'An enterprise strategist will reach out within 2 hours.');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-surface-lightBg dark:bg-surface-darkBg text-surface-lightText dark:text-[#F5EEF3] transition-colors">
      <Navbar />

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Contact Info (5 Cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-bold text-gold-400 uppercase tracking-widest font-sans">
                Executive Inquiries
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-surface-lightText dark:text-surface-lightText dark:text-white tracking-tight font-sans">
                Request an Enterprise Solution Architecture
              </h1>
              <p className="text-sm text-surface-lightMuted leading-relaxed">
                Connect with our product architects to review API throughput, custom SSO/SAML requirements, dedicated SLA contracts, and high-volume multi-brand migration.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-surface-lightBorder dark:border-surface-darkBorder/40 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-maroon-700/20 text-gold-400 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-surface-lightText dark:text-surface-lightText dark:text-white">Direct Enterprise Sales</p>
                  <p className="text-surface-lightMuted">enterprise@socialhubpro.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-maroon-700/20 text-gold-400 flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-surface-lightText dark:text-surface-lightText dark:text-white">Global Headquarters</p>
                  <p className="text-surface-lightMuted">One World Trade Center, Floor 74, New York, NY</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-maroon-700/20 text-gold-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-surface-lightText dark:text-surface-lightText dark:text-white">Compliance &amp; Security</p>
                  <p className="text-surface-lightMuted">SOC2 Type II, ISO 27001 &amp; GDPR Certified</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Interactive Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 shadow-luxury-lg">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-surface-lightText dark:text-white">Inquiry Successfully Received</h3>
                  <p className="text-xs text-surface-lightMuted max-w-md mx-auto leading-relaxed">
                    Thank you, {name}. Our Director of Enterprise Solutions has been notified and will coordinate your private environment walkthrough shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-surface-lightText dark:text-white">Full Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Morgan"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-lightBg dark:bg-surface-darkBg border border-surface-lightBorder dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white focus:outline-none focus:border-gold-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-surface-lightText dark:text-white">Corporate Email</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@company.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-lightBg dark:bg-surface-darkBg border border-surface-lightBorder dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white focus:outline-none focus:border-gold-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-surface-lightText dark:text-white">Company / Agency Name</label>
                      <input
                        type="text"
                        required
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Apex Global Media Group"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-lightBg dark:bg-surface-darkBg border border-surface-lightBorder dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white focus:outline-none focus:border-gold-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-surface-lightText dark:text-white">Managed Social Channels</label>
                      <select
                        value={channels}
                        onChange={(e) => setChannels(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-lightBg dark:bg-surface-darkBg border border-surface-lightBorder dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white focus:outline-none focus:border-gold-400"
                      >
                        <option value="5-10 channels">5 - 10 social channels</option>
                        <option value="10-25 channels">10 - 25 social channels</option>
                        <option value="25-50 channels">25 - 50 social channels</option>
                        <option value="50+ channels">50+ multi-brand channels</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-surface-lightText dark:text-white">Tell us about your operational goals</label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share your current challenges: e.g. multi-channel inbox triage, approval workflows, custom white-label reports..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-lightBg dark:bg-surface-darkBg border border-surface-lightBorder dark:border-surface-darkBorder text-xs text-surface-lightText dark:text-white focus:outline-none focus:border-gold-400 leading-relaxed"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-maroon-700 to-burgundy-600 hover:from-maroon-800 text-white font-bold text-xs uppercase tracking-wider shadow-luxury"
                    >
                      {submitting ? 'Submitting Request...' : 'Request Enterprise Demo'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

