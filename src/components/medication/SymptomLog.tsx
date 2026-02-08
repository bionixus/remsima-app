"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { cn } from '@/lib/utils'
import { Thermometer, Wind, Zap, Activity, Frown, HeartPulse, Eye, Droplets } from 'lucide-react'

const SYMPTOMS = [
    { id: 'injection-site', label: 'Injection Site Reaction', icon: Activity, category: 'Common' },
    { id: 'fever', label: 'Fever', icon: Thermometer, category: 'Common' },
    { id: 'fatigue', label: 'Fatigue', icon: Zap, category: 'Common' },
    { id: 'nausea', label: 'Nausea', icon: Frown, category: 'Common' },
    { id: 'headache', label: 'Headache', icon: HeartPulse, category: 'Other' },
    { id: 'breath', label: 'Shortness of Breath', icon: Wind, category: 'Other' },
    { id: 'joint', label: 'Joint Pain', icon: Activity, category: 'Other' },
    { id: 'vision', label: 'Vision Changes', icon: Eye, category: 'Other' },
    { id: 'rash', label: 'Skin Rash', icon: Droplets, category: 'Other' },
]

const MOOD_OPTIONS = [
    { id: 'great', label: 'Great', emoji: '😊' },
    { id: 'good', label: 'Good', emoji: '🙂' },
    { id: 'okay', label: 'Okay', emoji: '😐' },
    { id: 'bad', label: 'Not Good', emoji: '😞' },
]

export function SymptomLog({ onComplete }: { onComplete: (data: any) => void }) {
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
    const [intensity, setIntensity] = useState(3)
    const [mood, setMood] = useState<string>('')
    const [notes, setNotes] = useState('')

    const toggleSymptom = (id: string) => {
        setSelectedSymptoms(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        )
    }

    const intensityLabel = intensity <= 3 ? 'Mild' : intensity <= 6 ? 'Moderate' : 'Severe'
    const intensityColor = intensity <= 3 ? 'text-emerald-600' : intensity <= 6 ? 'text-amber-600' : 'text-red-500'

    return (
        <div className="space-y-6">
            {/* Mood */}
            <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">How are you feeling?</h3>
                <div className="flex gap-2">
                    {MOOD_OPTIONS.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => setMood(option.id)}
                            className={cn(
                                "flex-1 app-card flex flex-col items-center gap-1.5 py-3 transition-all",
                                mood === option.id ? "border-2 border-primary bg-blue-50" : "border border-[#E2E8F0]"
                            )}
                        >
                            <span className="text-xl">{option.emoji}</span>
                            <span className={cn("text-[10px] font-semibold", mood === option.id ? "text-primary" : "text-muted-foreground")}>
                                {option.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Symptoms */}
            <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Any symptoms?</h3>
                <div className="grid grid-cols-2 gap-2.5">
                    {SYMPTOMS.map((symptom) => {
                        const isSelected = selectedSymptoms.includes(symptom.id)
                        return (
                            <button
                                key={symptom.id}
                                onClick={() => toggleSymptom(symptom.id)}
                                className={cn(
                                    "app-card flex items-center gap-3 py-3 px-3 text-left transition-all",
                                    isSelected ? "border-2 border-primary bg-blue-50" : "border border-[#E2E8F0]"
                                )}
                            >
                                <symptom.icon className={cn("w-4 h-4 flex-shrink-0", isSelected ? "text-primary" : "text-muted-foreground")} />
                                <span className={cn("text-xs font-medium leading-tight", isSelected ? "text-primary" : "text-foreground")}>
                                    {symptom.label}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Intensity */}
            {selectedSymptoms.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-semibold text-foreground">Intensity</span>
                        <span className={cn("text-sm font-bold", intensityColor)}>{intensity}/10 - {intensityLabel}</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={intensity}
                        onChange={(e) => setIntensity(parseInt(e.target.value))}
                        className="w-full"
                        style={{ '--value': `${(intensity / 10) * 100}%` } as any}
                    />
                    <div className="flex justify-between mt-1">
                        <span className="text-[10px] text-emerald-600 font-semibold">Mild</span>
                        <span className="text-[10px] text-amber-600 font-semibold">Moderate</span>
                        <span className="text-[10px] text-red-500 font-semibold">Severe</span>
                    </div>
                </motion.div>
            )}

            {/* Notes */}
            <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Additional Notes</h3>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional observations..."
                    className="w-full bg-white rounded-xl border border-[#E2E8F0] p-3 text-sm min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-[#94A3B8]"
                />
            </div>

            {/* Submit */}
            <Button
                onClick={() => onComplete({ symptoms: selectedSymptoms, intensity, mood, notes })}
                className="btn-primary w-full"
            >
                Save to Diary
            </Button>
        </div>
    )
}
