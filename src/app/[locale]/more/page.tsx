"use client"

import React from 'react'
import { motion } from 'framer-motion'
import {
    BookOpen, Video, FileText, AlertTriangle, Phone,
    User, Bell, Users, Target, Shield, ChevronRight, LogOut
} from 'lucide-react'
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

type MenuItem = {
    icon: React.ElementType
    title: string
    desc: string
    iconBg: string
    iconColor: string
    href?: string
}

const RESOURCES: MenuItem[] = [
    { icon: BookOpen, title: 'Self-Injection Guide', desc: 'Step-by-step instructions', iconBg: 'bg-blue-50', iconColor: 'text-primary', href: '/articles/1' },
    { icon: Video, title: 'Training Videos', desc: 'Watch video tutorials', iconBg: 'bg-purple-50', iconColor: 'text-purple-600' },
    { icon: FileText, title: 'Export Health Report', desc: 'Share data with your doctor', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
    { icon: AlertTriangle, title: 'Drug Interactions', desc: 'Check medication safety', iconBg: 'bg-orange-50', iconColor: 'text-orange-500' },
]

const SETTINGS: MenuItem[] = [
    { icon: User, title: 'Profile & Account', desc: 'Personal information', iconBg: 'bg-[#F1F5F9]', iconColor: 'text-[#64748B]' },
    { icon: Bell, title: 'Notifications', desc: 'Reminders & alerts', iconBg: 'bg-[#F1F5F9]', iconColor: 'text-[#64748B]' },
    { icon: Users, title: 'Family Members', desc: 'Manage family profiles', iconBg: 'bg-[#F1F5F9]', iconColor: 'text-[#64748B]' },
    { icon: Target, title: 'My Goals', desc: 'Set treatment targets', iconBg: 'bg-[#F1F5F9]', iconColor: 'text-[#64748B]' },
    { icon: Shield, title: 'Privacy & Security', desc: 'Data settings', iconBg: 'bg-[#F1F5F9]', iconColor: 'text-[#64748B]' },
]

function MenuItemRow({ item: menuItem }: { item: MenuItem }) {
    const content = (
        <div className="app-card flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-xl ${menuItem.iconBg} flex items-center justify-center flex-shrink-0`}>
                <menuItem.icon className={`w-[18px] h-[18px] ${menuItem.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground">{menuItem.title}</p>
                <p className="text-[11px] text-muted-foreground">{menuItem.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#94A3B8] flex-shrink-0" />
        </div>
    )

    if (menuItem.href) {
        return <Link href={menuItem.href}>{content}</Link>
    }
    return content
}

export default function MorePage() {
    const params = useParams()
    const locale = params.locale as string

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen bg-background">
            {/* Header */}
            <motion.div variants={item} className="bg-white px-5 pt-14 pb-4 border-b border-[#E2E8F0]">
                <h1 className="text-2xl font-bold text-foreground">More</h1>
            </motion.div>

            <div className="px-5 py-4 pb-28 space-y-6">
                {/* Nurse Ambassador CTA */}
                <motion.div variants={item} className="hero-gradient rounded-2xl p-5 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <Phone className="w-5 h-5" />
                        <h3 className="text-base font-bold">Nurse Ambassador</h3>
                    </div>
                    <p className="text-sm text-white/80 mb-4">
                        Get personalized support from a trained nurse ambassador for your treatment journey.
                    </p>
                    <button className="bg-white text-primary px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-white/90 transition-colors">
                        Connect Now
                    </button>
                </motion.div>

                {/* Support & Resources */}
                <motion.div variants={item}>
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Support & Resources</h3>
                    {RESOURCES.map((r, i) => (
                        <MenuItemRow key={i} item={r} />
                    ))}
                </motion.div>

                {/* Settings */}
                <motion.div variants={item}>
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Settings</h3>
                    {SETTINGS.map((s, i) => {
                        const href = s.title === 'Profile & Account' ? `/${locale}/profile` : undefined
                        return <MenuItemRow key={i} item={{ ...s, href }} />
                    })}
                </motion.div>

                {/* Logout */}
                <motion.div variants={item}>
                    <button className="app-card flex items-center gap-3 w-full text-red-500">
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                            <LogOut className="w-[18px] h-[18px]" />
                        </div>
                        <span className="font-semibold text-sm">Sign Out</span>
                    </button>
                </motion.div>
            </div>
        </motion.div>
    )
}
