
"use client"

import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, Calendar, BookOpen, User, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface MobileShellProps {
    children: React.ReactNode
    locale: string
}

export function MobileShell({ children, locale }: MobileShellProps) {
    const pathname = usePathname()

    const navItems = [
        { icon: Home, label: 'Home', href: `/${locale}` },
        { icon: Calendar, label: 'Doses', href: `/${locale}/doses` },
        { icon: BookOpen, label: 'Articles', href: `/${locale}/articles` },
        { icon: User, label: 'Profile', href: `/${locale}/profile` },
    ]

    return (
        <div className="flex flex-col min-h-screen bg-transparent text-foreground font-sans relative">
            {/* Top Bar - Minimal & Integrated */}
            <header className="sticky top-0 z-50 w-full px-4 pt-6 pb-2 transition-all">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                            <span className="text-white font-bold text-xl">H</span>
                        </div>
                        <div>
                            <span className="block font-bold text-lg tracking-tight leading-none text-white">Hikma</span>
                            <span className="text-[10px] uppercase tracking-widest text-primary font-bold">Remsima Care</span>
                        </div>
                    </div>
                    <button className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-white/70 hover:text-white transition-colors">
                        <Bell className="w-6 h-6" />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 pb-28">
                {children}
            </main>

            {/* Bottom Navigation - Floating & Glass */}
            <div className="fixed bottom-6 left-6 right-6 z-50">
                <nav className="glass rounded-[2rem] px-4 py-3 shadow-2xl overflow-hidden border-white/10">
                    <div className="flex items-center justify-around">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "relative flex flex-col items-center justify-center gap-1 min-w-[64px] transition-all duration-300 py-1",
                                        isActive ? "text-primary sc-active" : "text-white/40 hover:text-white/70"
                                    )}
                                >
                                    <item.icon className={cn("w-6 h-6 transition-transform duration-300", isActive && "scale-110")} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-glow"
                                            className="absolute -top-1 w-8 h-1 bg-primary rounded-full blur-[2px]"
                                        />
                                    )}
                                </Link>
                            )
                        })}
                    </div>
                </nav>
            </div>
        </div>
    )
}
