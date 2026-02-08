"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
    CheckCircle2, Circle, Clock, ChevronLeft, ChevronRight,
    MapPin, Pencil, Check, X, CalendarDays, AlertCircle,
    BellRing, Download
} from "lucide-react"
import { format, addMonths, subMonths } from 'date-fns'
import {
    calculateSchedule, Dose, getStoredIvDate, setDoseOverride
} from '@/lib/medication'
import {
    downloadDoseIcs, downloadAllDosesIcs,
    requestNotificationPermission, isNotificationSupported,
    isNotificationEnabled, setNotificationEnabled,
    isCalendarEnabled, setCalendarEnabled
} from '@/lib/reminders'
import { motion, AnimatePresence } from "framer-motion"
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.04 } }
}

const item = {
    hidden: { opacity: 0, y: 4 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } }
}

export default function DosesPage() {
    const params = useParams()
    const locale = params.locale as string
    const [schedule, setSchedule] = useState<Dose[]>([])
    const [isMounted, setIsMounted] = useState(false)
    const [viewMonth, setViewMonth] = useState(new Date())
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editDate, setEditDate] = useState<Date>()
    const [notifEnabled, setNotifEnabled] = useState(false)
    const [calendarOn, setCalendarOn] = useState(false)

    const loadSchedule = useCallback(() => {
        const ivDate = getStoredIvDate()
        if (ivDate) {
            setSchedule(calculateSchedule(ivDate))
        } else {
            setSchedule([])
        }
    }, [])

    useEffect(() => {
        setIsMounted(true)
        loadSchedule()
        setNotifEnabled(isNotificationEnabled())
        setCalendarOn(isCalendarEnabled())
        // Listen for changes from other components / tabs
        const handler = () => loadSchedule()
        window.addEventListener('hikma:schedule-updated', handler)
        return () => window.removeEventListener('hikma:schedule-updated', handler)
    }, [loadSchedule])

    // ── Notification toggle ──
    const handleToggleNotifications = async () => {
        if (notifEnabled) {
            setNotificationEnabled(false)
            setNotifEnabled(false)
        } else {
            const granted = await requestNotificationPermission()
            setNotifEnabled(granted)
        }
    }

    // ── Calendar alarm toggle ──
    const handleToggleCalendar = () => {
        if (calendarOn) {
            // Turn off — just update preference (events already in phone calendar
            // must be removed manually, so we inform the user)
            setCalendarEnabled(false)
            setCalendarOn(false)
        } else {
            // Turn on — download ICS and mark enabled
            downloadAllDosesIcs(schedule)
            setCalendarEnabled(true)
            setCalendarOn(true)
        }
    }

    const handleAddDoseToCalendar = (dose: Dose, index: number) => {
        downloadDoseIcs(dose, index)
    }

    const handleMarkComplete = (doseId: string) => {
        setDoseOverride(doseId, { status: 'taken' })
        loadSchedule()
    }

    const handleMarkPending = (doseId: string) => {
        setDoseOverride(doseId, { status: 'pending' })
        loadSchedule()
    }

    const handleEditDate = (doseId: string, currentDate: Date) => {
        setEditingId(doseId)
        setEditDate(currentDate)
    }

    const handleSaveDate = () => {
        if (editingId && editDate) {
            setDoseOverride(editingId, { customDate: editDate.toISOString() })
            setEditingId(null)
            setEditDate(undefined)
            loadSchedule()
        }
    }

    const handleCancelEdit = () => {
        setEditingId(null)
        setEditDate(undefined)
    }

    if (!isMounted) return null

    const hasSchedule = schedule.length > 0
    const nextPendingIndex = schedule.findIndex(d => d.status === 'pending' && d.type === 'SC')

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

            {!hasSchedule ? (
                /* Empty State */
                <motion.div variants={item} className="flex flex-col items-center justify-center px-8 py-20 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                        <CalendarDays className="w-8 h-8 text-primary/50" />
                    </div>
                    <h2 className="text-lg font-bold text-foreground mb-2">No Schedule Yet</h2>
                    <p className="text-sm text-muted-foreground mb-6 max-w-[260px]">
                        Set your last IV infusion date in your profile to auto-generate your dose schedule.
                    </p>
                    <Link href={`/${locale}/profile`}>
                        <Button className="btn-primary">
                            Go to Profile
                        </Button>
                    </Link>
                </motion.div>
            ) : (
                <>
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

                    {/* Reminders Section */}
                    <motion.div variants={item} className="px-5 pt-4">
                        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Reminders</h2>
                        <div className="app-card space-y-0">
                            {/* Option 1: Calendar Alarms */}
                            <button
                                onClick={handleToggleCalendar}
                                className="w-full flex items-center gap-3 py-3 active:bg-[#F8FAFC] transition-colors rounded-t-2xl"
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                                    calendarOn ? "bg-primary/10" : "bg-[#F1F5F9]"
                                )}>
                                    <Download className={cn("w-5 h-5", calendarOn ? "text-primary" : "text-muted-foreground")} />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="font-semibold text-sm text-foreground">Calendar Alarms</p>
                                    <p className="text-[11px] text-muted-foreground">
                                        {calendarOn
                                            ? 'Active — alarms added to your phone calendar'
                                            : 'Adds dose events with alarms to your calendar'}
                                    </p>
                                </div>
                                <div className={cn(
                                    "w-11 h-6 rounded-full p-0.5 transition-colors flex-shrink-0",
                                    calendarOn ? "bg-primary" : "bg-gray-300"
                                )}>
                                    <div className={cn(
                                        "w-5 h-5 rounded-full bg-white shadow transition-transform",
                                        calendarOn && "translate-x-5"
                                    )} />
                                </div>
                            </button>

                            <div className="border-t border-[#F1F5F9]" />

                            {/* Option 2: App Notifications */}
                            <button
                                onClick={handleToggleNotifications}
                                className={cn(
                                    "w-full flex items-center gap-3 py-3 active:bg-[#F8FAFC] transition-colors rounded-b-2xl",
                                    !isNotificationSupported() && "opacity-50 pointer-events-none"
                                )}
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                                    notifEnabled ? "bg-amber-50" : "bg-[#F1F5F9]"
                                )}>
                                    <BellRing className={cn("w-5 h-5", notifEnabled ? "text-amber-600" : "text-muted-foreground")} />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="font-semibold text-sm text-foreground">App Notifications</p>
                                    <p className="text-[11px] text-muted-foreground">
                                        {!isNotificationSupported()
                                            ? 'Not supported in this browser'
                                            : notifEnabled
                                                ? 'Active — you\'ll be alerted when you open the app'
                                                : 'Get a reminder when you visit the app near a dose'}
                                    </p>
                                </div>
                                <div className={cn(
                                    "w-11 h-6 rounded-full p-0.5 transition-colors flex-shrink-0",
                                    notifEnabled ? "bg-amber-500" : "bg-gray-300"
                                )}>
                                    <div className={cn(
                                        "w-5 h-5 rounded-full bg-white shadow transition-transform",
                                        notifEnabled && "translate-x-5"
                                    )} />
                                </div>
                            </button>
                        </div>
                        {calendarOn && (
                            <p className="text-[10px] text-muted-foreground mt-2 px-1">
                                To remove calendar alarms, turn off the toggle above and delete the events from your phone&apos;s calendar app.
                            </p>
                        )}
                    </motion.div>

                    {/* Timeline */}
                    <div className="px-5 py-4 pb-28 space-y-4">
                        <AnimatePresence>
                            {schedule.map((dose, index) => {
                                const isNext = index === nextPendingIndex
                                const isDone = dose.status === 'taken'
                                const isEditing = editingId === dose.id
                                const isSc = dose.type === 'SC'

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
                                                    {dose.type === 'IV' ? 'IV Infusion' : `Dose #${index}`}
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
                                                Remsima {dose.type === 'IV' ? 'IV' : 'SC 120mg'} &middot; {format(dose.date, 'EEEE, MMM dd')}
                                            </p>

                                            {/* Injection site info */}
                                            {isDone && dose.site && (
                                                <div className="flex items-center gap-1.5 mt-2 text-[11px] text-muted-foreground">
                                                    <MapPin className="w-3 h-3" />
                                                    {dose.site}
                                                </div>
                                            )}

                                            {/* Edit date inline */}
                                            {isEditing && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="mt-3 pt-3 border-t border-[#F1F5F9]"
                                                >
                                                    <p className="text-[11px] font-semibold text-muted-foreground mb-2">Reschedule dose:</p>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                className="w-full justify-start text-left font-normal h-10 rounded-xl border-[#E2E8F0] bg-[#F8FAFC] text-sm"
                                                            >
                                                                <CalendarDays className="mr-2 h-4 w-4 text-primary" />
                                                                {editDate ? format(editDate, "PPP") : "Pick a date"}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0 z-[60]" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={editDate}
                                                                onSelect={setEditDate}
                                                                autoFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <div className="flex gap-2 mt-2">
                                                        <Button size="sm" className="flex-1 h-9 rounded-xl bg-primary text-white text-xs font-semibold" onClick={handleSaveDate}>
                                                            <Check className="w-3.5 h-3.5 mr-1" /> Save
                                                        </Button>
                                                        <Button size="sm" variant="outline" className="flex-1 h-9 rounded-xl text-xs" onClick={handleCancelEdit}>
                                                            <X className="w-3.5 h-3.5 mr-1" /> Cancel
                                                        </Button>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {/* Action buttons for SC doses */}
                                            {isSc && !isEditing && (
                                                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#F1F5F9] flex-wrap">
                                                    {isDone ? (
                                                        <button
                                                            onClick={() => handleMarkPending(dose.id)}
                                                            className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
                                                        >
                                                            <Circle className="w-3.5 h-3.5" />
                                                            Undo
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleMarkComplete(dose.id)}
                                                            className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                                                        >
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                            Mark Complete
                                                        </button>
                                                    )}
                                                    <span className="text-[#E2E8F0]">|</span>
                                                    <button
                                                        onClick={() => handleEditDate(dose.id, dose.date)}
                                                        className="flex items-center gap-1.5 text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors"
                                                    >
                                                        <Pencil className="w-3.5 h-3.5" />
                                                        Edit Date
                                                    </button>
                                                    {!isDone && (
                                                        <>
                                                            <span className="text-[#E2E8F0]">|</span>
                                                            <button
                                                                onClick={() => handleAddDoseToCalendar(dose, index)}
                                                                className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                                                            >
                                                                <BellRing className="w-3.5 h-3.5" />
                                                                Add Alarm
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </div>
                </>
            )}
        </motion.div>
    )
}
