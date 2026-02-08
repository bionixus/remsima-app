"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Site {
    id: string
    label: string
    shortLabel: string
    x: number
    y: number
    lastUsed?: string
}

const SITES: Site[] = [
    { id: 'arm-left', label: 'Left Arm', shortLabel: 'L.Arm', x: 18, y: 30, lastUsed: '2 weeks ago' },
    { id: 'arm-right', label: 'Right Arm', shortLabel: 'R.Arm', x: 82, y: 30 },
    { id: 'abdomen-left', label: 'Left Abdomen', shortLabel: 'L.Abd', x: 38, y: 48, lastUsed: '4 days ago' },
    { id: 'abdomen-right', label: 'Right Abdomen', shortLabel: 'R.Abd', x: 62, y: 48 },
    { id: 'thigh-left', label: 'Left Thigh', shortLabel: 'L.Thi', x: 40, y: 72 },
    { id: 'thigh-right', label: 'Right Thigh', shortLabel: 'R.Thi', x: 60, y: 72, lastUsed: '3 weeks ago' },
]

const USED_SITES = ['arm-left', 'abdomen-left', 'thigh-right']

export function BodyMap({ onSelect, selectedSite }: { onSelect: (siteId: string) => void, selectedSite?: string }) {
    return (
        <div className="space-y-5">
            {/* Body Map */}
            <div className="relative w-full max-w-[280px] mx-auto aspect-[3/4] bg-white rounded-2xl p-6 shadow-sm">
                <svg viewBox="0 0 100 133" className="w-full h-full" style={{ fill: '#EFF6FF', stroke: '#93C5FD', strokeWidth: 0.8 }}>
                    <path d="M50,10 C55,10 60,15 60,20 C60,25 55,30 50,30 C45,30 40,25 40,20 C40,15 45,10 50,10 Z M40,30 L60,30 L75,60 L70,65 L60,45 L60,90 L55,120 L45,120 L40,90 L40,45 L30,65 L25,60 L40,30 Z" />
                </svg>

                {SITES.map((site) => {
                    const isSelected = selectedSite === site.id
                    const isUsed = USED_SITES.includes(site.id) && !isSelected
                    return (
                        <button
                            key={site.id}
                            onClick={() => onSelect(site.id)}
                            className="absolute -translate-x-1/2 -translate-y-1/2 group"
                            style={{ left: `${site.x}%`, top: `${site.y}%` }}
                        >
                            <motion.div
                                initial={false}
                                animate={{
                                    scale: isSelected ? 1.15 : 1,
                                }}
                                className={cn(
                                    "w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                                    isSelected && "border-primary bg-primary shadow-[0_0_0_4px_rgba(37,99,235,0.2),0_2px_8px_rgba(37,99,235,0.3)]",
                                    isUsed && "border-amber-400 bg-amber-50",
                                    !isSelected && !isUsed && "border-primary/30 bg-primary/10 hover:border-primary hover:bg-primary/20"
                                )}
                            >
                                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                {isUsed && <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                            </motion.div>
                            <span className={cn(
                                "absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-semibold transition-colors",
                                isSelected ? "text-primary" : "text-muted-foreground"
                            )}>
                                {site.label}
                            </span>
                        </button>
                    )
                })}
            </div>

            {/* Rotation Progress */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-muted-foreground">Site Rotation</span>
                    <span className="text-xs font-semibold text-primary">{USED_SITES.length + (selectedSite && !USED_SITES.includes(selectedSite) ? 1 : 0)}/6 used</span>
                </div>
                <div className="flex gap-1">
                    {SITES.map((site) => {
                        const isSelected = selectedSite === site.id
                        const isUsed = USED_SITES.includes(site.id)
                        return (
                            <div key={site.id} className="flex-1 flex flex-col items-center gap-1">
                                <div className={cn(
                                    "w-full h-1.5 rounded-full",
                                    isSelected ? "bg-primary" :
                                    isUsed ? "bg-emerald-400" : "bg-[#E2E8F0]"
                                )} />
                                <span className={cn(
                                    "text-[8px] font-semibold",
                                    isSelected ? "text-primary" : "text-muted-foreground"
                                )}>
                                    {site.shortLabel}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Selected Site Info */}
            {selectedSite && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-50 rounded-xl p-3 text-center"
                >
                    <p className="text-sm font-semibold text-primary">
                        {SITES.find(s => s.id === selectedSite)?.label}
                    </p>
                    {SITES.find(s => s.id === selectedSite)?.lastUsed && (
                        <p className="text-[11px] text-primary/70 mt-0.5">
                            Last used: {SITES.find(s => s.id === selectedSite)?.lastUsed}
                        </p>
                    )}
                </motion.div>
            )}
        </div>
    )
}
