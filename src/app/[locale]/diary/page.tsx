"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Plus, Syringe, Activity, Smile, ChevronLeft, ChevronRight } from 'lucide-react'
import { format, addDays, startOfWeek, isSameDay } from 'date-fns'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.02 } }
}

const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.15 } }
}

type DiaryEntry = {
    id: string
    time: string
    type: 'injection' | 'symptom' | 'mood'
    title: string
    description: string
    tags: { label: string, color: 'blue' | 'green' | 'amber' }[]
}

const MOCK_ENTRIES: DiaryEntry[] = [
    {
        id: '1', time: '8:30 AM', type: 'injection',
        title: 'Remsima SC 120mg',
        description: 'Left Abdomen - Dose #8',
        tags: [{ label: 'Completed', color: 'green' }, { label: 'On Schedule', color: 'blue' }]
    },
    {
        id: '2', time: '9:00 AM', type: 'symptom',
        title: 'Mild injection site reaction',
        description: 'Redness, slight swelling - Intensity: 3/10',
        tags: [{ label: 'Mild', color: 'amber' }]
    },
    {
        id: '3', time: '2:00 PM', type: 'symptom',
        title: 'Feeling good overall',
        description: 'No fatigue, energy level 7/10',
        tags: [{ label: 'Positive', color: 'green' }]
    },
    {
        id: '4', time: '6:00 PM', type: 'mood',
        title: 'Daily mood: Good',
        description: 'Productive day, managed well',
        tags: [{ label: 'Good', color: 'green' }]
    },
]

const TAG_COLORS = {
    blue: 'bg-blue-50 text-[#2563EB]',
    green: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
}

const TYPE_CONFIG = {
    injection: { label: 'Injection Logged', color: 'text-emerald-600', dotColor: 'bg-emerald-500', icon: Syringe },
    symptom: { label: 'Symptom Log', color: 'text-[#2563EB]', dotColor: 'bg-[#2563EB]', icon: Activity },
    mood: { label: 'Mood Entry', color: 'text-[#2563EB]', dotColor: 'bg-[#2563EB]', icon: Smile },
}

export default function DiaryPage() {
    const params = useParams()
    const locale = params.locale as string
    const [activeTab, setActiveTab] = useState<'timeline' | 'calendar' | 'reports'>('timeline')
    const [selectedDate, setSelectedDate] = useState(new Date())

    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

    const entriesWithDots = [1, 3, 5, 6] // indexes with entries for demo

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen bg-background">
            {/* Header */}
            <motion.div variants={item} className="bg-white px-5 pt-14 pb-4">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-foreground">My Diary</h1>
                    <Link href={`/${locale}/log-injection`}>
                        <button className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white">
                            <Plus className="w-5 h-5" />
                        </button>
                    </Link>
                </div>

                {/* Tabs */}
                <div className="flex bg-[#F1F5F9] rounded-xl p-1">
                    {(['timeline', 'calendar', 'reports'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "flex-1 py-2 text-center rounded-lg text-sm font-semibold transition-all duration-200 capitalize",
                                activeTab === tab
                                    ? "bg-white text-primary shadow-sm"
                                    : "text-[#64748B]"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Calendar Strip */}
            <motion.div variants={item} className="bg-white border-b border-[#E2E8F0]">
                <div className="flex items-center justify-between px-5 py-2">
                    <button onClick={() => setSelectedDate(addDays(selectedDate, -7))} className="p-1 text-muted-foreground">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-semibold text-foreground">{format(selectedDate, 'MMMM yyyy')}</span>
                    <button onClick={() => setSelectedDate(addDays(selectedDate, 7))} className="p-1 text-muted-foreground">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex gap-1.5 px-4 pb-3 overflow-x-auto">
                    {weekDays.map((day, i) => {
                        const isSelected = isSameDay(day, selectedDate)
                        const hasEntry = entriesWithDots.includes(i)
                        return (
                            <button
                                key={i}
                                onClick={() => setSelectedDate(day)}
                                className={cn(
                                    "flex flex-col items-center min-w-[44px] py-2 px-1 rounded-xl transition-all duration-200",
                                    isSelected ? "bg-primary text-white" : "text-foreground"
                                )}
                            >
                                <span className={cn("text-[10px] font-semibold uppercase", isSelected ? "text-white/80" : "text-muted-foreground")}>
                                    {format(day, 'EEE')}
                                </span>
                                <span className="text-base font-bold mt-1">{format(day, 'd')}</span>
                                <div className={cn(
                                    "w-1 h-1 rounded-full mt-1.5",
                                    hasEntry ? (isSelected ? "bg-white" : "bg-primary") : "bg-transparent"
                                )} />
                            </button>
                        )
                    })}
                </div>
            </motion.div>

            {/* Timeline */}
            <div className="px-5 py-4 pb-28 space-y-4">
                {MOCK_ENTRIES.map((entry) => {
                    const config = TYPE_CONFIG[entry.type]
                    return (
                        <motion.div key={entry.id} variants={item} className="flex gap-3">
                            {/* Time */}
                            <div className="w-14 flex-shrink-0 text-right pt-3.5">
                                <span className="text-xs font-semibold text-muted-foreground">{entry.time}</span>
                            </div>

                            {/* Timeline line */}
                            <div className="relative w-0.5 flex-shrink-0">
                                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-[#E2E8F0]" />
                                <div className={cn(
                                    "absolute top-3.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border-2 border-white",
                                    config.dotColor,
                                    entry.type === 'injection' ? "shadow-[0_0_0_3px_rgba(16,185,129,0.15)]" : "shadow-[0_0_0_3px_rgba(37,99,235,0.15)]"
                                )} />
                            </div>

                            {/* Card */}
                            <div className="flex-1 app-card">
                                <div className={cn("text-[10px] font-bold uppercase tracking-wide mb-1", config.color)}>
                                    {config.label}
                                </div>
                                <p className="font-semibold text-sm text-foreground">{entry.title}</p>
                                <p className="text-[11px] text-muted-foreground mt-0.5">{entry.description}</p>
                                <div className="flex gap-1.5 mt-2 flex-wrap">
                                    {entry.tags.map((tag, i) => (
                                        <span key={i} className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-md", TAG_COLORS[tag.color])}>
                                            {tag.label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </motion.div>
    )
}
