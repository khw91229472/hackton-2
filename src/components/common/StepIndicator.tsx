'use client';

import React from 'react';
import { Camera, Cpu, CheckSquare, Hash } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3 | 4;
}

const steps = [
  { step: 1, label: '사진 촬영', icon: Camera },
  { step: 2, label: 'AI 분석', icon: Cpu },
  { step: 3, label: '기자재 확인', icon: CheckSquare },
  { step: 4, label: '수량 확인', icon: Hash },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="w-full bg-white border-b border-slate-200 px-3 py-2.5 shadow-xs">
      <div className="mx-auto max-w-xl">
        <div className="flex items-center justify-between">
          {steps.map((item, idx) => {
            const isCurrent = item.step === currentStep;
            const isCompleted = item.step < currentStep;
            const Icon = item.icon;

            return (
              <React.Fragment key={item.step}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-sm'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {isCompleted ? (
                      '✓'
                    ) : (
                      <span className="flex items-center gap-0.5">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </div>
                  <span
                    className={`mt-1 text-[11px] font-medium tracking-tight text-center ${
                      isCurrent
                        ? 'text-blue-700 font-bold'
                        : isCompleted
                        ? 'text-emerald-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {item.step}. {item.label}
                  </span>
                </div>

                {/* Arrow connector */}
                {idx < steps.length - 1 && (
                  <div
                    className={`h-[2px] flex-1 max-w-[28px] mx-1 mb-3 transition-colors ${
                      item.step < currentStep ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
