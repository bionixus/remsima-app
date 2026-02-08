
"use client"

import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Home, Calendar, BookOpen, User, Bell, MoreHorizontal } from 'lucide-react'
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
        { icon: MoreHorizontal, label: 'More', href: `/${locale}/more` },
    ]

    return (
        <div className="flex flex-col min-h-screen bg-transparent text-foreground font-sans relative">
            {/* Top Bar - Fixed & Static */}
            <header className="fixed top-0 left-0 right-0 z-50 w-full px-4 pt-6 pb-2 bg-[#F0F4F8]">
                <div className="flex items-center justify-between">
                    <Link href={`/${locale}`} className="flex items-center gap-2">
                        <Image
                            src="/hikma-logo.png"
                            alt="Hikma"
                            width={90}
                            height={32}
                            className="h-8 w-auto object-contain"
                            priority
                        />
                        <span className="text-[10px] uppercase tracking-widest text-primary font-bold mt-1">Remsima Care</span>
                    </Link>
                    <button className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shadow-sm">
                        <Bell className="w-6 h-6" />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 pt-[72px] pb-28">
                {children}
            </main>

            {/* Bottom Navigation - Floating & Glass */}
            <div className="fixed bottom-0 left-0 right-0 z-50">
                <nav className="bg-[#1C1C1E] px-4 py-3 pt-2 pb-[env(safe-area-inset-bottom,8px)] shadow-2xl border-t border-white/10">
                    <div className="flex items-center justify-around">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "relative flex flex-col items-center justify-center gap-1 min-w-0 flex-1 transition-all duration-300 py-1",
                                        isActive ? "text-primary sc-active" : "text-white/40 hover:text-white/70"
                                    )}
                                >
                                    <item.icon className={cn("w-6 h-6 transition-transform duration-200", isActive && "scale-105")} />
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
