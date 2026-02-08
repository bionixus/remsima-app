"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format, addWeeks } from "date-fns"
import {
    Calendar as CalendarIcon, User, Mail, ChevronLeft,
    Pill, MapPin, Phone, Globe, CheckCircle2, Syringe
} from "lucide-react"
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { getStoredIvDate, setStoredIvDate } from '@/lib/medication'

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.02 } }
}

const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.15 } }
}

export default function ProfilePage() {
    const params = useParams()
    const locale = params.locale as string
    const [date, setDate] = useState<Date>()
    const [saved, setSaved] = useState(false)

    // Load stored date on mount
    useEffect(() => {
        const stored = getStoredIvDate()
        if (stored) setDate(stored)
    }, [])

    const handleDateSelect = (d: Date | undefined) => {
        setDate(d)
        setSaved(false)
    }

    const handleSave = () => {
        if (date) {
            setStoredIvDate(date)
            setSaved(true)
            setTimeout(() => setSaved(false), 2500)
        }
    }

    // Preview schedule: first SC at +4 weeks, then 3 more at every 2 weeks
    const previewDoses = date ? [
        { label: 'Dose #1', date: addWeeks(date, 4) },
        { label: 'Dose #2', date: addWeeks(date, 6) },
        { label: 'Dose #3', date: addWeeks(date, 8) },
        { label: 'Dose #4', date: addWeeks(date, 10) },
    ] : []

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen bg-background">
            {/* Header */}
            <motion.div variants={item} className="bg-white px-5 pt-14 pb-4 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-3">
                    <Link href={`/${locale}/more`}>
                        <button className="w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center text-muted-foreground">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                    </Link>
                    <h1 className="text-xl font-bold text-foreground">Profile</h1>
                </div>
            </motion.div>

            <div className="px-5 py-4 pb-28 space-y-6">
                {/* Avatar & Name */}
                <motion.div variants={item} className="flex flex-col items-center py-4">
                    <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold mb-3">
                        S
                    </div>
                    <h2 className="text-lg font-bold text-foreground">Sarah Johnson</h2>
                    <p className="text-sm text-muted-foreground">Patient ID: HIK-2024-0847</p>
                </motion.div>

                {/* Personal Info */}
                <motion.div variants={item}>
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Personal Information</h3>
                    <div className="app-card space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                                <User className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-[11px] text-muted-foreground font-medium">Full Name</p>
                                <p className="text-sm font-semibold text-foreground">Sarah Johnson</p>
                            </div>
                        </div>
                        <div className="border-t border-[#F1F5F9]" />
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                                <Mail className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-[11px] text-muted-foreground font-medium">Email</p>
                                <p className="text-sm font-semibold text-foreground">sarah.j@email.com</p>
                            </div>
                        </div>
                        <div className="border-t border-[#F1F5F9]" />
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                                <Phone className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-[11px] text-muted-foreground font-medium">Phone</p>
                                <p className="text-sm font-semibold text-foreground">+1 (555) 123-4567</p>
                            </div>
                        </div>
                        <div className="border-t border-[#F1F5F9]" />
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                                <Globe className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-[11px] text-muted-foreground font-medium">Language</p>
                                <p className="text-sm font-semibold text-foreground">English</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Medication Settings */}
                <motion.div variants={item}>
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Medication</h3>
                    <div className="app-card space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                                <Pill className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-[11px] text-muted-foreground font-medium">Current Medication</p>
                                <p className="text-sm font-semibold text-foreground">Remsima SC 120mg</p>
                            </div>
                        </div>
                        <div className="border-t border-[#F1F5F9]" />
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                                <MapPin className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-[11px] text-muted-foreground font-medium">Treating Physician</p>
                                <p className="text-sm font-semibold text-foreground">Dr. Emily Chen</p>
                            </div>
                        </div>
                        <div className="border-t border-[#F1F5F9]" />
                        <div>
                            <Label className="text-[11px] text-muted-foreground font-medium mb-2 block">Last IV Infusion Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal h-11 rounded-xl border-[#E2E8F0] bg-[#F8FAFC]",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                                        {date ? format(date, "PPP") : "Select date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 z-[60]" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={handleDateSelect}
                                        autoFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </motion.div>

                {/* Auto-calculated Schedule Preview */}
                <AnimatePresence>
                    {date && previewDoses.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Auto-Calculated Schedule</h3>
                            <div className="app-card space-y-0">
                                <div className="flex items-center gap-3 pb-3 mb-3 border-b border-[#F1F5F9]">
                                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                                        <CalendarIcon className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[11px] text-muted-foreground font-medium">Protocol</p>
                                        <p className="text-sm font-semibold text-foreground">First dose 4 wks post-IV, then every 2 wks</p>
                                    </div>
                                </div>
                                {previewDoses.map((dose, i) => (
                                    <div key={i} className={cn(
                                        "flex items-center gap-3 py-2.5",
                                        i < previewDoses.length - 1 && "border-b border-[#F1F5F9]"
                                    )}>
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                                            i === 0 ? "bg-primary text-white" : "bg-[#F1F5F9] text-muted-foreground"
                                        )}>
                                            {i + 1}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-foreground">{dose.label}</p>
                                            <p className="text-[11px] text-muted-foreground">
                                                {format(dose.date, 'EEEE, MMM dd, yyyy')}
                                            </p>
                                        </div>
                                        <Syringe className="w-4 h-4 text-muted-foreground/40" />
                                    </div>
                                ))}
                                <div className="pt-3 mt-1">
                                    <p className="text-[11px] text-muted-foreground text-center">
                                        + more doses on the <Link href={`/${locale}/doses`} className="text-primary font-semibold">Schedule page</Link>
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Save */}
                <motion.div variants={item}>
                    <Button className="btn-primary w-full" onClick={handleSave} disabled={!date}>
                        {saved ? (
                            <span className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Saved
                            </span>
                        ) : (
                            'Save Changes'
                        )}
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    )
}
