"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import {
    Calendar as CalendarIcon, User, Mail, ChevronLeft,
    Pill, MapPin, Phone, Globe
} from "lucide-react"
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
}

const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
}

export default function ProfilePage() {
    const params = useParams()
    const locale = params.locale as string
    const [date, setDate] = useState<Date>()

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
                                        onSelect={setDate}
                                        autoFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </motion.div>

                {/* Save */}
                <motion.div variants={item}>
                    <Button className="btn-primary w-full">
                        Save Changes
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    )
}
