'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  Clock,
  Send,
  Plus,
  Eye,
  Globe,
} from 'lucide-react';
import { PlatformBadge } from '@/components/ui/PlatformBadge';
import { useToast } from '@/context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContentCalendarPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'MONTH' | 'WEEK'>('MONTH');
  const [platformFilter, setPlatformFilter] = useState('ALL');
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [timezone, setTimezone] = useState('America/New_York (EST)');
  const { success, error, info } = useToast();

  const fetchCalendar = async () => {
    try {
      const res = await fetch('/api/calendar');
      if (res.ok) {
        const json = await res.json();
        setEvents(json.events || []);
      }
    } catch (err) {
      error('Error', 'Failed to fetch calendar');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, []);

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Month calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const calendarDays = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push({ dayNumber: null, isCurrentMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({ dayNumber: d, isCurrentMonth: true, dateObj: new Date(year, month, d) });
  }

  // Filter events
  const filteredEvents = events.filter((e) => {
    if (platformFilter !== 'ALL' && !e.platforms.includes(platformFilter)) {
      return false;
    }
    return true;
  });

  const getEventsForDay = (dayDate: Date) => {
    return filteredEvents.filter((ev) => {
      const evDate = new Date(ev.date);
      return (
        evDate.getFullYear() === dayDate.getFullYear() &&
        evDate.getMonth() === dayDate.getMonth() &&
        evDate.getDate() === dayDate.getDate()
      );
    });
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-surface-lightText dark:text-surface-lightText dark:text-white tracking-tight font-sans">
            Content Master Calendar
          </h1>
          <p className="text-xs sm:text-sm text-surface-lightMuted mt-1">
            Timezone-synchronized multi-platform release grid and scheduling orchestrator.
          </p>
        </div>

        {/* Timezone & View Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-lightCard dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder text-xs text-surface-lightMuted">
            <Globe className="w-3.5 h-3.5 text-gold-400" />
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="bg-transparent text-white focus:outline-none text-xs"
            >
              <option value="America/New_York (EST)">New York (EST)</option>
              <option value="Europe/London (GMT)">London (GMT)</option>
              <option value="Europe/Paris (CET)">Paris (CET)</option>
              <option value="Asia/Tokyo (JST)">Tokyo (JST)</option>
              <option value="Asia/Dubai (GST)">Dubai (GST)</option>
            </select>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-lightCard dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder">
            <button
              onClick={() => setViewMode('MONTH')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                viewMode === 'MONTH' ? 'bg-maroon-700 text-white' : 'text-surface-lightMuted'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => {
                setViewMode('WEEK');
                info('Weekly View', 'Switching to 7-day high-density slot view.');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                viewMode === 'WEEK' ? 'bg-maroon-700 text-white' : 'text-surface-lightMuted'
              }`}
            >
              Week
            </button>
          </div>
        </div>
      </div>

      {/* Month Navigation & Platform Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Prev / Next controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl bg-surface-lightBg dark:bg-surface-darkHover border border-surface-lightBorder dark:border-surface-darkBorder text-surface-lightMuted hover:text-surface-lightText dark:hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h2 className="text-base sm:text-lg font-bold text-surface-lightText dark:text-surface-lightText dark:text-white font-sans">
            {monthNames[month]} {year}
          </h2>
          <button
            onClick={nextMonth}
            className="p-2 rounded-xl bg-surface-lightBg dark:bg-surface-darkHover border border-surface-lightBorder dark:border-surface-darkBorder text-surface-lightMuted hover:text-surface-lightText dark:hover:text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Platform filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {['ALL', 'INSTAGRAM', 'LINKEDIN', 'TWITTER', 'TIKTOK', 'YOUTUBE'].map((plat) => (
            <button
              key={plat}
              onClick={() => setPlatformFilter(plat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                platformFilter === plat
                  ? 'bg-gold-400 text-black font-bold'
                  : 'text-surface-lightMuted hover:text-surface-lightText dark:hover:text-white hover:bg-surface-darkHover'
              }`}
            >
              {plat}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder/60 shadow-sm overflow-hidden">
        {/* Day Name Header */}
        <div className="grid grid-cols-7 border-b border-surface-lightBorder dark:border-surface-darkBorder/60 text-center py-3 bg-surface-lightBg dark:bg-[#151115] text-xs font-semibold text-surface-lightMuted uppercase tracking-wider font-sans">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 divide-x divide-y divide-surface-lightBorder dark:divide-surface-darkBorder/40">
          {calendarDays.map((cal, idx) => {
            if (!cal.isCurrentMonth || !cal.dateObj) {
              return (
                <div
                  key={idx}
                  className="min-h-[110px] sm:min-h-[130px] p-2 bg-surface-lightBg/50 dark:bg-[#120E12]/50 opacity-40"
                />
              );
            }

            const dayEvents = getEventsForDay(cal.dateObj);
            const isToday =
              new Date().toDateString() === cal.dateObj.toDateString();

            return (
              <div
                key={idx}
                className={`min-h-[110px] sm:min-h-[130px] p-2 transition-colors hover:bg-surface-lightBg/50 dark:hover:bg-surface-darkHover/30 flex flex-col justify-between ${
                  isToday ? 'bg-maroon-900/10 dark:bg-maroon-950/20' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                      isToday
                        ? 'bg-gold-400 text-black font-extrabold shadow-sm'
                        : 'text-surface-lightText dark:text-white'
                    }`}
                  >
                    {cal.dayNumber}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-[9px] text-gold-400 font-bold">
                      {dayEvents.length} {dayEvents.length === 1 ? 'post' : 'posts'}
                    </span>
                  )}
                </div>

                {/* Day events pills */}
                <div className="space-y-1.5 overflow-hidden">
                  {dayEvents.slice(0, 2).map((ev: any) => (
                    <div
                      key={ev.id}
                      onClick={() => setSelectedEvent(ev)}
                      className={`cursor-pointer p-1.5 rounded-lg text-[10px] border transition-all truncate ${
                        ev.status === 'PUBLISHED'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          : ev.status === 'SCHEDULED'
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                          : 'bg-maroon-700/20 border-maroon-700/40 text-gold-300'
                      }`}
                    >
                      <div className="flex items-center gap-1 font-semibold truncate">
                        <span>{new Date(ev.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="truncate">&bull; {ev.title}</span>
                      </div>
                    </div>
                  ))}

                  {dayEvents.length > 2 && (
                    <span className="text-[9px] text-surface-lightMuted block text-center">
                      +{dayEvents.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#1A141A] border border-maroon-700/60 p-6 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-surface-lightBorder dark:border-surface-darkBorder/40 pb-4">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-gold-400" />
                  <h3 className="text-sm font-bold text-surface-lightText dark:text-white uppercase tracking-wider font-sans">
                    Scheduled Event Details
                  </h3>
                </div>
                <button onClick={() => setSelectedEvent(null)} className="text-surface-lightMuted hover:text-surface-lightText dark:hover:text-white">
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {selectedEvent.platforms.map((p: string) => (
                    <PlatformBadge key={p} platform={p} size="sm" />
                  ))}
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gold-400/20 text-gold-300 font-bold">
                    {selectedEvent.status}
                  </span>
                </div>

                <p className="text-xs text-surface-lightText dark:text-white leading-relaxed whitespace-pre-line p-3 rounded-xl bg-surface-lightBg dark:bg-surface-darkCard border border-surface-lightBorder dark:border-surface-darkBorder">
                  {selectedEvent.content}
                </p>

                {selectedEvent.mediaUrls?.[0] && (
                  <img
                    src={selectedEvent.mediaUrls[0]}
                    alt="Event Attachment"
                    className="w-full h-44 object-cover rounded-xl border border-maroon-700/40"
                  />
                )}

                <div className="flex items-center justify-between text-xs text-surface-lightMuted pt-2">
                  <span>Release: {new Date(selectedEvent.date).toLocaleString()}</span>
                  <span>Timezone: {timezone}</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-2 rounded-xl bg-maroon-700 text-white text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

