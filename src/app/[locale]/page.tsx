"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";
import {
  Syringe, Bell, ChevronRight,
  Activity, Calendar, BookOpen,
  Phone, Target, Clock, AlertCircle
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { calculateSchedule, Dose, getNextDose, getStoredIvDate } from '@/lib/medication';
import { format, differenceInDays } from 'date-fns';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] as any } }
};

const INJECTION_SITES = ['L-Arm', 'R-Arm', 'L-Abd', 'R-Abd', 'L-Thigh', 'R-Thigh'];

export default function IndexPage() {
  const t = useTranslations('Index');
  const params = useParams();
  const locale = params.locale as string;
  const [schedule, setSchedule] = useState<Dose[]>([]);
  const [nextDose, setNextDose] = useState<Dose | null>(null);

  const loadSchedule = React.useCallback(() => {
    const ivDate = getStoredIvDate();
    if (ivDate) {
      const calculated = calculateSchedule(ivDate);
      setSchedule(calculated);
      setNextDose(getNextDose(calculated) || null);
    } else {
      setSchedule([]);
      setNextDose(null);
    }
  }, []);

  useEffect(() => {
    loadSchedule();
    const handler = () => loadSchedule();
    window.addEventListener('hikma:schedule-updated', handler);
    return () => window.removeEventListener('hikma:schedule-updated', handler);
  }, [loadSchedule]);

  const daysToNextDose = nextDose ? differenceInDays(nextDose.date, new Date()) : 0;
  const progressPercent = Math.max(0, Math.min(100, (14 - daysToNextDose) / 14 * 100));
  const takenCount = schedule.filter(d => d.status === 'taken').length;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="min-h-screen"
    >
      {/* Hero Header with Gradient */}
      <motion.section variants={item} className="hero-gradient px-5 pt-14 pb-8 rounded-b-3xl">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-white/70 text-sm font-medium">Good Morning</p>
            <h1 className="text-2xl font-bold text-white">Sarah</h1>
          </div>
          <button className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/10">
            <Bell className="w-5 h-5" />
          </button>
        </div>

        {/* Next Dose Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
          <div className="flex items-center gap-5">
            {/* Progress Ring */}
            <div className="relative w-24 h-24 flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" strokeWidth="8" className="fill-transparent" style={{ stroke: 'rgba(255,255,255,0.15)' }} />
                <motion.circle
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: progressPercent / 100 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  cx="50" cy="50" r="42"
                  strokeWidth="8"
                  className="fill-transparent"
                  style={{ stroke: 'white', strokeLinecap: 'round', filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.3))' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">{daysToNextDose}</span>
                <span className="text-[9px] uppercase tracking-wider text-white/60 font-semibold">days</span>
              </div>
            </div>

            <div className="flex-1 text-white">
              <p className="text-xs text-white/60 font-medium uppercase tracking-wider">Next Dose</p>
              <p className="text-lg font-bold mt-0.5">Remsima SC 120mg</p>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-3.5 h-3.5 text-white/60" />
                <span className="text-sm text-white/80">
                  {nextDose ? format(nextDose.date, 'EEEE, MMM dd') : '--'}
                </span>
              </div>
            </div>
          </div>

          <Link href={`/${locale}/log-injection`} className="block mt-4">
            <Button className="w-full h-11 rounded-xl bg-white text-[#2563EB] font-semibold hover:bg-white/90 transition-all border-none">
              <Syringe className="w-4 h-4 mr-2" />
              Log Injection
            </Button>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="stat-card text-center">
            <span className="block text-xl font-bold">92%</span>
            <span className="text-[10px] text-white/60 font-medium">Adherence</span>
          </div>
          <div className="stat-card text-center">
            <span className="block text-xl font-bold">{takenCount}</span>
            <span className="text-[10px] text-white/60 font-medium">Doses Taken</span>
          </div>
          <div className="stat-card text-center">
            <span className="block text-xl font-bold">14</span>
            <span className="text-[10px] text-white/60 font-medium">Day Streak</span>
          </div>
        </div>
      </motion.section>

      {/* Content Area */}
      <div className="px-5 py-6 space-y-6">
        {/* Today Section */}
        <motion.section variants={item}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-foreground">Today</h2>
            <Link href={`/${locale}/diary`} className="text-sm text-primary font-medium flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
            <Link href={`/${locale}/doses`}>
              <div className="app-card flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground">Dose Reminder</p>
                  <p className="text-xs text-muted-foreground">Remsima SC - Due in {daysToNextDose} days</p>
                </div>
                <div className="badge-pill bg-blue-50 text-primary">Upcoming</div>
              </div>
            </Link>

            <Link href={`/${locale}/diary`}>
              <div className="app-card flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <Activity className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground">Symptom Check-in</p>
                  <p className="text-xs text-muted-foreground">Log how you feel today</p>
                </div>
                <div className="badge-pill bg-emerald-50 text-emerald-600">Log Now</div>
              </div>
            </Link>

            <div className="app-card flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground">Refill Reminder</p>
                <p className="text-xs text-muted-foreground">3 doses remaining - order refill</p>
              </div>
              <div className="badge-pill bg-amber-50 text-amber-600">Action</div>
            </div>
          </div>
        </motion.section>

        {/* Quick Actions Grid */}
        <motion.section variants={item}>
          <h2 className="text-lg font-bold text-foreground mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href={`/${locale}/log-injection`}>
              <div className="app-card flex flex-col items-center text-center py-5 gap-2.5">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                  <Syringe className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Log Injection</p>
                  <p className="text-[11px] text-muted-foreground">Record site & dose</p>
                </div>
              </div>
            </Link>

            <Link href={`/${locale}/diary`}>
              <div className="app-card flex flex-col items-center text-center py-5 gap-2.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Symptom Diary</p>
                  <p className="text-[11px] text-muted-foreground">Track how you feel</p>
                </div>
              </div>
            </Link>

            <Link href={`/${locale}/more`}>
              <div className="app-card flex flex-col items-center text-center py-5 gap-2.5">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Nurse Support</p>
                  <p className="text-[11px] text-muted-foreground">Talk to a nurse</p>
                </div>
              </div>
            </Link>

            <Link href={`/${locale}/more`}>
              <div className="app-card flex flex-col items-center text-center py-5 gap-2.5">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center">
                  <Target className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p className="font-semibold text-sm">My Goals</p>
                  <p className="text-[11px] text-muted-foreground">Treatment goals</p>
                </div>
              </div>
            </Link>
          </div>
        </motion.section>

        {/* Treatment Progress */}
        <motion.section variants={item}>
          <h2 className="text-lg font-bold text-foreground mb-3">Treatment Progress</h2>
          <div className="app-card-elevated">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-20 flex-shrink-0">
                <svg viewBox="0 0 100 133" className="w-full h-full" style={{ fill: '#EFF6FF', stroke: '#93C5FD', strokeWidth: 1.5 }}>
                  <path d="M50,10 C55,10 60,15 60,20 C60,25 55,30 50,30 C45,30 40,25 40,20 C40,15 45,10 50,10 Z M40,30 L60,30 L75,60 L70,65 L60,45 L60,90 L55,120 L45,120 L40,90 L40,45 L30,65 L25,60 L40,30 Z" />
                </svg>
                <div className="absolute w-2.5 h-2.5 rounded-full bg-primary" style={{ left: '35%', top: '52%' }} />
                <div className="absolute w-2.5 h-2.5 rounded-full bg-primary/30 ring-2 ring-primary/20" style={{ left: '55%', top: '52%' }} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Last injection: <span className="font-semibold text-foreground">Left Abdomen</span></p>
                <p className="text-sm text-muted-foreground mt-1">Next suggested: <span className="font-semibold text-primary">Right Abdomen</span></p>
                <div className="flex gap-1.5 mt-3">
                  {INJECTION_SITES.map((site, i) => (
                    <div key={site} className="flex flex-col items-center gap-1">
                      <div
                        className={cn(
                          "w-2.5 h-2.5 rounded-full",
                          i === 2 ? "bg-primary" : i === 3 ? "bg-primary/30 ring-2 ring-primary/20" : i < 2 ? "bg-emerald-400" : "bg-gray-200"
                        )}
                      />
                      <span className="text-[7px] text-muted-foreground">{site}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Resources Preview */}
        <motion.section variants={item}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-foreground">Resources</h2>
            <Link href={`/${locale}/more`} className="text-sm text-primary font-medium flex items-center gap-1">
              See All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
            <div className="app-card min-w-[180px] flex-shrink-0">
              <div className="w-full h-20 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                <BookOpen className="w-7 h-7 text-primary/40" />
              </div>
              <p className="font-semibold text-sm">Self-Injection Guide</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">8 min read</p>
            </div>
            <div className="app-card min-w-[180px] flex-shrink-0">
              <div className="w-full h-20 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
                <Activity className="w-7 h-7 text-emerald-400" />
              </div>
              <p className="font-semibold text-sm">Managing Side Effects</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">5 min read</p>
            </div>
            <div className="app-card min-w-[180px] flex-shrink-0">
              <div className="w-full h-20 rounded-xl bg-purple-50 flex items-center justify-center mb-3">
                <Phone className="w-7 h-7 text-purple-400" />
              </div>
              <p className="font-semibold text-sm">Nurse Ambassador</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Get support</p>
            </div>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}
