'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  Download,
  Building,
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function BillingSettingsPage() {
  const { success, error } = useToast();
  const [billingData, setBillingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  const fetchBilling = async () => {
    try {
      const res = await fetch('/api/billing');
      if (res.ok) {
        const json = await res.json();
        setBillingData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBilling();
  }, []);

  const handleSelectPlan = async (planKey: string) => {
    setUpgrading(true);
    try {
      const res = await fetch('/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey }),
      });

      const data = await res.json();
      if (res.ok) {
        success('Subscription Updated', data.message);
        fetchBilling();
      } else {
        error('Error', data.message);
      }
    } catch (err: any) {
      error('Error', err.message);
    } finally {
      setUpgrading(false);
    }
  };

  const currentPlan = billingData?.subscription?.plan || 'ENTERPRISE';

  const plans = [
    {
      key: 'STARTER',
      name: 'Starter Tier',
      price: '$49',
      period: 'per month',
      desc: 'Ideal for boutique brands and early-stage creator businesses.',
      features: ['Up to 5 Connected Social Channels', 'Single Seat License', 'Content Calendar & Scheduler', 'Basic 30-Day Analytics', 'Email Support'],
    },
    {
      key: 'PRO',
      name: 'Professional Team',
      price: '$99',
      period: 'per month',
      desc: 'High-velocity growth teams managing multi-channel presence.',
      features: ['Up to 15 Connected Social Channels', '5 Team Collaborators', 'Unified Social Inbox', '24h Stories Manager & Scheduler', 'Team Approval Workflows', 'Priority Support'],
    },
    {
      key: 'ENTERPRISE',
      name: 'Global Enterprise',
      price: '$199',
      period: 'per month',
      desc: 'Uncompromising control for multi-brand agencies and corporate leaders.',
      features: ['Unlimited Social Channels (All 7 Networks)', 'Unlimited Team Seats & Custom RBAC', 'Real-Time Graph API Webhook Ingestion', 'White-Label Executive Reports & Export', 'Dedicated Account Strategist', '99.99% Uptime SLA Guarantee'],
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-surface-lightText dark:text-white tracking-tight font-sans">
          Subscription &amp; Enterprise Billing
        </h1>
        <p className="text-xs sm:text-sm text-surface-lightMuted mt-1">
          Review your tier capabilities, scale your team seats, and inspect tax invoices.
        </p>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => {
          const isCurrent = currentPlan === p.key;

          return (
            <div
              key={p.key}
              className={`p-6 rounded-2xl flex flex-col justify-between transition-all relative ${
                isCurrent
                  ? 'bg-gradient-to-b from-maroon-900/40 via-[#1C171C] to-[#1C171C] border-2 border-gold-400 shadow-luxury-lg'
                  : 'bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60'
              }`}
            >
              {isCurrent && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gold-400 text-black font-extrabold text-[10px] uppercase tracking-wider shadow-sm">
                  Active Tier
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-surface-lightText dark:text-white font-sans">{p.name}</h3>
                  <p className="text-xs text-surface-lightMuted mt-1">{p.desc}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-surface-lightText dark:text-white tracking-tight">{p.price}</span>
                  <span className="text-xs text-surface-lightMuted">{p.period}</span>
                </div>

                <div className="pt-4 border-t border-surface-lightBorder dark:border-surface-darkBorder/40 space-y-2.5">
                  {p.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                      <span className="text-surface-lightText dark:text-[#E8E2E4]">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => handleSelectPlan(p.key)}
                  disabled={isCurrent || upgrading}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-gold-400/20 text-gold-400 border border-gold-400/30 cursor-default'
                      : 'bg-maroon-700 hover:bg-maroon-800 text-gold-300 shadow-luxury'
                  }`}
                >
                  {isCurrent ? 'Current Plan' : `Switch to ${p.name}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Invoices History Table */}
      <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-surface-lightBorder dark:border-surface-darkBorder/40 flex items-center justify-between">
          <h3 className="text-sm font-bold text-surface-lightText dark:text-white uppercase tracking-wider font-sans">
            Invoice Billing History
          </h3>
          <span className="text-xs text-surface-lightMuted">Mastercard ending in &bull;&bull;&bull;&bull; 4242</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-surface-lightBorder dark:border-surface-darkBorder/40 text-surface-lightMuted uppercase font-semibold">
              <tr>
                <th className="py-3 px-5">Invoice Reference</th>
                <th className="py-3 px-5">Billing Date</th>
                <th className="py-3 px-5">Amount</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-lightBorder dark:divide-surface-darkBorder/30">
              {billingData?.invoices?.map((inv: any) => (
                <tr key={inv.id} className="hover:bg-surface-lightBg dark:hover:bg-surface-darkHover/40 transition-colors">
                  <td className="py-3.5 px-5 font-mono text-white">{inv.id}</td>
                  <td className="py-3.5 px-5 text-surface-lightMuted">{inv.date}</td>
                  <td className="py-3.5 px-5 font-bold text-gold-400">{inv.amount}</td>
                  <td className="py-3.5 px-5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => success('Download', `Downloading invoice ${inv.id}`)}
                      className="text-gold-400 hover:underline"
                    >
                      Download PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

