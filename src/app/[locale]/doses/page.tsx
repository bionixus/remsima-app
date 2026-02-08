"use client"

import React, { useState, useEffect } from 'react'
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Clock, ChevronLeft, ChevronRight, MapPin } from "lucide-react"
import { format, addMonths, subMonths } from 'date-fns'
import { calculateSchedule, Dose } from '@/lib/medication'
import { motion, AnimatePresence } from "framer-motion"
import { cn } from '@/lib/utils'

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
}

const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 1, 0.5, 1] as any } }
}

const MOCK_SITES = ['Right Thigh', 'Left Arm', 'Left Abdomen', 'Right Abdomen', 'Left Thigh', 'Right Arm', 'Left Abdomen', 'Right Thigh', 'Left Arm', 'Right Abdomen']

export default function DosesPage() {
    const [schedule, setSchedule] = useState<Dose[]>([])
    const [isMounted, setIsMounted] = useState(false)
    const [viewMonth, setViewMonth] = useState(new Date())

    useEffect(() => {
        setIsMounted(true)
        const lastIv = new Date()
        lastIv.setDate(lastIv.getDate() - 49)
        setSchedule(calculateSchedule(lastIv))
    }, [])

    if (!isMounted) return null

    const nextPendingIndex = schedule.findIndex(d => d.status === 'pending')

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="min-h-screen bg-background"
        >
            {/* Header */}
            <motion.div variants={item} className="bg-white px-5 pt-14 pb-4 border-b border-[#E2E8F0]">
                <h1 className="text-2xl font-bold text-foreground">Schedule</h1>
                <p className="text-sm text-muted-foreground mt-1">Your Remsima SC treatment timeline</p>
            </motion.div>

            {/* Month Selector */}
            <motion.div variants={item} className="bg-white flex items-center justify-center gap-5 py-3 border-b border-[#E2E8F0]">
                <button
                    onClick={() => setViewMonth(subMonths(viewMonth, 1))}
                    className="w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center text-muted-foreground hover:bg-[#E2E8F0] transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-base font-bold text-foreground min-w-[140px] text-center">
                    {format(viewMonth, 'MMMM yyyy')}
                </span>
                <button
                    onClick={() => setViewMonth(addMonths(viewMonth, 1))}
                    className="w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center text-muted-foreground hover:bg-[#E2E8F0] transition-colors"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </motion.div>

            {/* Timeline */}
            <div className="px-5 py-4 pb-28 space-y-4">
                <AnimatePresence>
                    {schedule.map((dose, index) => {
                        const isNext = index === nextPendingIndex
                        const isDone = dose.status === 'taken'
                        const site = MOCK_SITES[index] || undefined

                        return (
                            <motion.div
                                key={dose.id}
                                variants={item}
                                initial="hidden"
                                animate="show"
                                layout
                                className="flex gap-3.5"
                            >
                                {/* Date Column */}
                                <div className="w-11 flex-shrink-0 text-center pt-3.5">
                                    <span className="block text-lg font-bold text-foreground">{format(dose.date, 'dd')}</span>
                                    <span className="block text-[10px] font-semibold text-muted-foreground uppercase">{format(dose.date, 'MMM')}</span>
                                </div>

                                {/* Timeline Connector */}
                                <div className="relative w-0.5 flex-shrink-0">
                                    {index !== schedule.length - 1 && (
                                        <div className="absolute top-7 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-[#E2E8F0]" />
                                    )}
                                    <div className={cn(
                                        "absolute top-4 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-white",
                                        isDone ? "bg-emerald-500" : isNext ? "bg-primary" : "bg-[#CBD5E1]",
                                        isDone && "shadow-[0_0_0_3px_rgba(16,185,129,0.15)]",
                                        isNext && "shadow-[0_0_0_3px_rgba(37,99,235,0.15)]"
                                    )} />
                                </div>

                                {/* Dose Card */}
                                <div className={cn(
                                    "flex-1 app-card",
                                    isNext && "border border-primary/20 bg-blue-50/50"
                                )}>
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-[15px] text-foreground">
                                            {dose.type} {dose.id.includes('iv') ? 'Infusion' : `Dose #${index}`}
                                        </span>
                                        <Badge className={cn(
                                            "text-[9px] font-bold uppercase tracking-wide border-none h-5 px-2 rounded-md",
                                            isDone && "bg-emerald-50 text-emerald-600",
                                            isNext && "bg-blue-50 text-primary",
                                            !isDone && !isNext && "bg-[#F1F5F9] text-[#94A3B8]"
                                        )}>
                                            {isDone ? 'Done' : isNext ? 'Next' : 'Upcoming'}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Remsima {dose.type === 'IV' ? 'IV' : 'SC 120mg'}
                                    </p>
                                    {isDone && site && (
                                        <div className="flex items-center gap-1.5 mt-2 text-[11px] text-muted-foreground">
                                            <MapPin className="w-3 h-3" />
                                            {site}
                                        </div>
                                    )}
                                    {isNext && (
                                        <div className="flex items-center gap-1.5 mt-2 text-[11px] text-primary font-semibold">
                                            <MapPin className="w-3 h-3" />
                                            Suggested: Right Abdomen
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}
