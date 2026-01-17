"use client"

import React from 'react'

export default function Stepper({ step = 2 }: { step?: number }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex items-center gap-2 text-sm text-text-muted-light dark:text-text-muted-dark">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 1 ? 'bg-brand-teal text-white' : 'bg-white/5'}`}>1</div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 2 ? 'bg-brand-teal text-white' : 'bg-white/5'}`}>2</div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 3 ? 'bg-brand-teal text-white' : 'bg-white/5'}`}>3</div>
      </div>
      <div className="text-sm text-text-muted-light dark:text-text-muted-dark">Step {step} of 3</div>
    </div>
  )
}
