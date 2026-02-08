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

// Coordinates are percentages relative to the body map container
// The SVG body viewBox is 200x400, container maps 1:1
const SITES: Site[] = [
    { id: 'arm-left', label: 'Left Upper Arm', shortLabel: 'L.Arm', x: 22, y: 32, lastUsed: '2 weeks ago' },
    { id: 'arm-right', label: 'Right Upper Arm', shortLabel: 'R.Arm', x: 78, y: 32 },
    { id: 'abdomen-left', label: 'Left Abdomen', shortLabel: 'L.Abd', x: 40, y: 46, lastUsed: '4 days ago' },
    { id: 'abdomen-right', label: 'Right Abdomen', shortLabel: 'R.Abd', x: 60, y: 46 },
    { id: 'thigh-left', label: 'Left Thigh', shortLabel: 'L.Thi', x: 39, y: 66 },
    { id: 'thigh-right', label: 'Right Thigh', shortLabel: 'R.Thi', x: 61, y: 66, lastUsed: '3 weeks ago' },
]

const USED_SITES = ['arm-left', 'abdomen-left', 'thigh-right']

export function BodyMap({ onSelect, selectedSite }: { onSelect: (siteId: string) => void, selectedSite?: string }) {
    return (
        <div className="space-y-5">
            {/* Body Map */}
            <div className="relative w-full max-w-[280px] mx-auto aspect-[1/2] bg-white rounded-2xl p-4 shadow-sm">
                {/* Anatomical body SVG */}
                <svg viewBox="0 0 200 400" className="w-full h-full" fill="none">
                    {/* Head */}
                    <ellipse cx="100" cy="38" rx="24" ry="28" fill="#EFF6FF" stroke="#93C5FD" strokeWidth="1.5" />

                    {/* Neck */}
                    <rect x="90" y="64" width="20" height="16" rx="4" fill="#EFF6FF" stroke="#93C5FD" strokeWidth="1.5" />

                    {/* Torso */}
                    <path
                        d="M65,80 L135,80 C138,80 140,82 140,85 L140,175 C140,178 138,180 135,180 L65,180 C62,180 60,178 60,175 L60,85 C60,82 62,80 65,80 Z"
                        fill="#EFF6FF" stroke="#93C5FD" strokeWidth="1.5"
                    />

                    {/* Left shoulder & upper arm */}
                    <path
                        d="M60,82 L42,90 C38,92 35,96 35,100 L35,155 C35,160 38,164 42,164 L50,164 C54,164 57,160 57,155 L57,95"
                        fill="#EFF6FF" stroke="#93C5FD" strokeWidth="1.5"
                    />
                    {/* Left forearm */}
                    <path
                        d="M38,164 L32,220 C31,225 34,230 39,230 L47,230 C52,230 55,225 54,220 L50,164"
                        fill="#EFF6FF" stroke="#93C5FD" strokeWidth="1.5"
                    />

                    {/* Right shoulder & upper arm */}
                    <path
                        d="M140,82 L158,90 C162,92 165,96 165,100 L165,155 C165,160 162,164 158,164 L150,164 C146,164 143,160 143,155 L143,95"
                        fill="#EFF6FF" stroke="#93C5FD" strokeWidth="1.5"
                    />
                    {/* Right forearm */}
                    <path
                        d="M150,164 L146,220 C145,225 148,230 153,230 L161,230 C166,230 169,225 168,220 L162,164"
                        fill="#EFF6FF" stroke="#93C5FD" strokeWidth="1.5"
                    />

                    {/* Waist / hip area */}
                    <path
                        d="M62,180 L138,180 L142,205 C142,210 138,215 132,215 L68,215 C62,215 58,210 58,205 L62,180 Z"
                        fill="#EFF6FF" stroke="#93C5FD" strokeWidth="1.5"
                    />

                    {/* Left thigh */}
                    <path
                        d="M68,215 L62,310 C61,316 65,320 70,320 L88,320 C93,320 97,316 96,310 L98,215"
                        fill="#EFF6FF" stroke="#93C5FD" strokeWidth="1.5"
                    />
                    {/* Left lower leg */}
                    <path
                        d="M66,320 L64,380 C64,385 67,390 72,390 L84,390 C89,390 92,385 92,380 L90,320"
                        fill="#EFF6FF" stroke="#93C5FD" strokeWidth="1.5"
                    />

                    {/* Right thigh */}
                    <path
                        d="M102,215 L104,310 C105,316 109,320 114,320 L132,320 C137,320 141,316 140,310 L138,215"
                        fill="#EFF6FF" stroke="#93C5FD" strokeWidth="1.5"
                    />
                    {/* Right lower leg */}
                    <path
                        d="M110,320 L108,380 C108,385 111,390 116,390 L128,390 C133,390 136,385 136,380 L134,320"
                        fill="#EFF6FF" stroke="#93C5FD" strokeWidth="1.5"
                    />
                </svg>

                {/* Injection site dots */}
                {SITES.map((site) => {
                    const isSelected = selectedSite === site.id
                    const isUsed = USED_SITES.includes(site.id) && !isSelected
                    return (
                        <button
                            key={site.id}
                            onClick={() => onSelect(site.id)}
                            className="absolute -translate-x-1/2 -translate-y-1/2 group z-10"
                            style={{ left: `${site.x}%`, top: `${site.y}%` }}
                        >
                            <motion.div
                                initial={false}
                                animate={{
                                    scale: isSelected ? 1.2 : 1,
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
