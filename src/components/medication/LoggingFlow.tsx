"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BodyMap } from './BodyMap'
import { SymptomLog } from './SymptomLog'
import { Button } from '@/components/ui/button'
import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react'

type Step = 'site' | 'symptoms' | 'success'

const STEPS: { key: Step, label: string }[] = [
    { key: 'site', label: 'Injection Site' },
    { key: 'symptoms', label: 'Symptoms' },
    { key: 'success', label: 'Done' },
]

export function LoggingFlow() {
    const [step, setStep] = useState<Step>('site')
    const [data, setData] = useState({
        siteId: '',
        symptoms: [],
        intensity: 0,
        mood: '',
        notes: ''
    })

    const currentStepIndex = STEPS.findIndex(s => s.key === step)

    const handleSiteSelect = (siteId: string) => {
        setData({ ...data, siteId })
    }

    const handleContinueToSymptoms = () => {
        if (data.siteId) setStep('symptoms')
    }

    const handleSymptomsComplete = (symptomData: any) => {
        setData({ ...data, ...symptomData })
        setStep('success')
    }

    return (
        <div className="max-w-md mx-auto">
            {/* Step Indicator */}
            {step !== 'success' && (
                <div className="bg-white px-5 pt-14 pb-5 -mx-5 -mt-10 mb-4 border-b border-[#E2E8F0]">
                    <div className="flex items-center gap-2 mb-5">
                        {STEPS.map((s, i) => (
                            <div
                                key={s.key}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                    i < currentStepIndex ? 'bg-emerald-400 flex-1' :
                                    i === currentStepIndex ? 'bg-primary w-8' :
                                    'bg-[#E2E8F0] flex-1'
                                }`}
                            />
                        ))}
                    </div>
                    <h1 className="text-xl font-bold text-foreground">{STEPS[currentStepIndex].label}</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {step === 'site' ? 'Select where you injected today' : 'Log how you\'re feeling'}
                    </p>
                </div>
            )}

            <AnimatePresence mode="wait">
                {step === 'site' && (
                    <motion.div
                        key="site"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-5"
                    >
                        <BodyMap onSelect={handleSiteSelect} selectedSite={data.siteId} />

                        <Button
                            onClick={handleContinueToSymptoms}
                            disabled={!data.siteId}
                            className="btn-primary w-full"
                        >
                            Continue
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    </motion.div>
                )}

                {step === 'symptoms' && (
                    <motion.div
                        key="symptoms"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-5"
                    >
                        <button
                            onClick={() => setStep('site')}
                            className="flex items-center gap-2 text-sm text-muted-foreground font-medium hover:text-foreground transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Back to site selection
                        </button>
                        <SymptomLog onComplete={handleSymptomsComplete} />
                    </motion.div>
                )}

                {step === 'success' && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 space-y-6"
                    >
                        <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
                            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                        </div>
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold text-foreground">Log Complete!</h2>
                            <p className="text-sm text-muted-foreground max-w-[260px]">
                                Your injection and symptoms have been recorded. Keep up the great work!
                            </p>
                        </div>
                        <div className="bg-emerald-50 rounded-xl px-4 py-3 text-center">
                            <p className="text-sm font-semibold text-emerald-600">92% Adherence Rate</p>
                            <p className="text-[11px] text-emerald-500 mt-0.5">You&apos;re on track!</p>
                        </div>
                        <Button
                            onClick={() => window.location.href = '/'}
                            className="btn-primary w-full max-w-[240px]"
                        >
                            Back to Dashboard
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
